/** @format */

import { queryOne, queryAll, executeQuery } from '@/server/lib/db.js';

export const PracticeAreaRepository = {
  async findById(id) {
    return queryOne(
      'SELECT * FROM practice_areas WHERE id = ? AND deleted_at IS NULL',
      [id],
    );
  },

  async findBySlug(slug) {
    return queryOne(
      'SELECT * FROM practice_areas WHERE slug = ? AND deleted_at IS NULL',
      [slug],
    );
  },

  async findAll(options = {}) {
    let query = 'SELECT * FROM practice_areas WHERE deleted_at IS NULL';
    const params = [];

    if (options.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(options.is_active ? 1 : 0);
    }

    query += ' ORDER BY name ASC';

    if (options.limit) {
      const offset = options.offset || 0;
      query += ` LIMIT ${parseInt(options.limit)} OFFSET ${parseInt(offset)}`;
    }

    return queryAll(query, params);
  },

  async create(data) {
    const [result] = await executeQuery(
      `INSERT INTO practice_areas (name, slug, description, seo_title, seo_description, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.seo_title || null,
        data.seo_description || null,
        data.is_active !== false ? 1 : 0,
      ],
    );

    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.slug !== undefined) {
      fields.push('slug = ?');
      values.push(data.slug);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.seo_title !== undefined) {
      fields.push('seo_title = ?');
      values.push(data.seo_title);
    }
    if (data.seo_description !== undefined) {
      fields.push('seo_description = ?');
      values.push(data.seo_description);
    }
    if (data.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(data.is_active ? 1 : 0);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await executeQuery(`UPDATE practice_areas SET ${fields.join(', ')} WHERE id = ?`, values);

    return this.findById(id);
  },

  async delete(id) {
    return executeQuery('UPDATE practice_areas SET deleted_at = NOW() WHERE id = ?', [id]);
  },

  async getLawyerCount(id) {
    const result = await queryOne(
      'SELECT COUNT(*) as count FROM lawyer_practice_areas WHERE practice_area_id = ?',
      [id],
    );
    return result?.count || 0;
  },

  async getArticleCount(id) {
    const result = await queryOne(
      'SELECT COUNT(*) as count FROM article_practice_areas WHERE practice_area_id = ?',
      [id],
    );
    return result?.count || 0;
  },
};
