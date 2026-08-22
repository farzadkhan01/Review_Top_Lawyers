/** @format */

import { queryOne, queryAll, executeQuery, executeTransaction } from '@/server/lib/db.js';

export const ArticleRepository = {
  async findById(id) {
    return queryOne(
      `SELECT a.*,
              JSON_ARRAYAGG(JSON_OBJECT('id', pa.id, 'name', pa.name, 'slug', pa.slug)) as practice_areas
       FROM articles a
       LEFT JOIN article_practice_areas apa ON a.id = apa.article_id
       LEFT JOIN practice_areas pa ON apa.practice_area_id = pa.id
       WHERE a.id = ? AND a.deleted_at IS NULL
       GROUP BY a.id`,
      [id],
    );
  },

  async findBySlug(slug) {
    return queryOne(
      `SELECT a.*,
              JSON_ARRAYAGG(JSON_OBJECT('id', pa.id, 'name', pa.name, 'slug', pa.slug)) as practice_areas
       FROM articles a
       LEFT JOIN article_practice_areas apa ON a.id = apa.article_id
       LEFT JOIN practice_areas pa ON apa.practice_area_id = pa.id
       WHERE a.slug = ? AND a.deleted_at IS NULL
       GROUP BY a.id`,
      [slug],
    );
  },

  async findAll(options = {}) {
    let query = `SELECT a.*,
                        JSON_ARRAYAGG(JSON_OBJECT('id', pa.id, 'name', pa.name, 'slug', pa.slug)) as practice_areas
                 FROM articles a
                 LEFT JOIN article_practice_areas apa ON a.id = apa.article_id
                 LEFT JOIN practice_areas pa ON apa.practice_area_id = pa.id
                 WHERE a.deleted_at IS NULL`;

    const params = [];

    if (options.status) {
      query += ' AND a.status = ?';
      params.push(options.status);
    }

    if (options.category) {
      query += ' AND a.category = ?';
      params.push(options.category);
    }

    if (options.practice_area_id) {
      query += ' AND apa.practice_area_id = ?';
      params.push(options.practice_area_id);
    }

    if (options.search) {
      query += ' AND MATCH(a.title, a.content) AGAINST(? IN BOOLEAN MODE)';
      params.push(options.search);
    }

    query += ' GROUP BY a.id';

    if (options.sort === 'recent') {
      query += ' ORDER BY a.published_at DESC';
    } else {
      query += ' ORDER BY a.created_at DESC';
    }

    if (options.limit) {
      const offset = options.offset || 0;
      query += ` LIMIT ${parseInt(options.limit)} OFFSET ${parseInt(offset)}`;
    }

    return queryAll(query, params);
  },

  async create(data) {
    return executeTransaction(async (connection) => {
      const [result] = await connection.execute(
        `INSERT INTO articles (
          title, slug, excerpt, content, category, author_id,
          status, published_at, seo_title, seo_description, canonical_url
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.title,
          data.slug,
          data.excerpt || null,
          data.content,
          data.category || null,
          data.author_id || null,
          data.status || 'draft',
          data.status === 'published' ? new Date() : null,
          data.seo_title || null,
          data.seo_description || null,
          data.canonical_url || null,
        ],
      );

      const articleId = result.insertId;

      if (data.practice_area_ids && data.practice_area_ids.length > 0) {
        for (const paId of data.practice_area_ids) {
          await connection.execute(
            'INSERT INTO article_practice_areas (article_id, practice_area_id) VALUES (?, ?)',
            [articleId, paId],
          );
        }
      }

      return this.findById(articleId);
    });
  },

  async update(id, data) {
    return executeTransaction(async (connection) => {
      const fields = [];
      const values = [];

      const fieldMap = {
        title: 'title',
        slug: 'slug',
        excerpt: 'excerpt',
        content: 'content',
        category: 'category',
        status: 'status',
        seo_title: 'seo_title',
        seo_description: 'seo_description',
        canonical_url: 'canonical_url',
      };

      for (const [key, dbField] of Object.entries(fieldMap)) {
        if (data[key] !== undefined) {
          fields.push(`${dbField} = ?`);
          values.push(data[key]);
        }
      }

      if (data.status === 'published' && data.status !== (await queryOne('SELECT status FROM articles WHERE id = ?', [id]))?.status) {
        fields.push('published_at = NOW()');
      }

      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      await connection.execute(`UPDATE articles SET ${fields.join(', ')} WHERE id = ?`, values);

      if (data.practice_area_ids) {
        await connection.execute('DELETE FROM article_practice_areas WHERE article_id = ?', [id]);
        for (const paId of data.practice_area_ids) {
          await connection.execute(
            'INSERT INTO article_practice_areas (article_id, practice_area_id) VALUES (?, ?)',
            [id, paId],
          );
        }
      }

      return this.findById(id);
    });
  },

  async delete(id) {
    return executeQuery('UPDATE articles SET deleted_at = NOW() WHERE id = ?', [id]);
  },

  async publish(id) {
    return executeQuery(
      'UPDATE articles SET status = ?, published_at = NOW() WHERE id = ?',
      ['published', id],
    );
  },

  async archive(id) {
    return executeQuery('UPDATE articles SET status = ? WHERE id = ?', ['archived', id]);
  },
};
