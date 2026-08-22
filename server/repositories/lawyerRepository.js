/** @format */

import { queryOne, queryAll, executeQuery, executeTransaction } from '@/server/lib/db.js';

export const LawyerRepository = {
  async findById(id) {
    return queryOne(
      `SELECT l.*,
              JSON_ARRAYAGG(JSON_OBJECT('id', pa.id, 'name', pa.name, 'slug', pa.slug)) as practice_areas,
              loc.country, loc.state_region, loc.city
       FROM lawyers l
       LEFT JOIN lawyer_practice_areas lpa ON l.id = lpa.lawyer_id
       LEFT JOIN practice_areas pa ON lpa.practice_area_id = pa.id
       LEFT JOIN locations loc ON l.location_id = loc.id
       WHERE l.id = ? AND l.deleted_at IS NULL
       GROUP BY l.id`,
      [id],
    );
  },

  async findBySlug(slug) {
    return queryOne(
      `SELECT l.*,
              JSON_ARRAYAGG(JSON_OBJECT('id', pa.id, 'name', pa.name, 'slug', pa.slug)) as practice_areas,
              loc.country, loc.state_region, loc.city
       FROM lawyers l
       LEFT JOIN lawyer_practice_areas lpa ON l.id = lpa.lawyer_id
       LEFT JOIN practice_areas pa ON lpa.practice_area_id = pa.id
       LEFT JOIN locations loc ON l.location_id = loc.id
       WHERE l.slug = ? AND l.deleted_at IS NULL
       GROUP BY l.id`,
      [slug],
    );
  },

  async findAll(options = {}) {
    let query = `SELECT l.*,
                        JSON_ARRAYAGG(JSON_OBJECT('id', pa.id, 'name', pa.name, 'slug', pa.slug)) as practice_areas,
                        loc.country, loc.state_region, loc.city
                 FROM lawyers l
                 LEFT JOIN lawyer_practice_areas lpa ON l.id = lpa.lawyer_id
                 LEFT JOIN practice_areas pa ON lpa.practice_area_id = pa.id
                 LEFT JOIN locations loc ON l.location_id = loc.id
                 WHERE l.deleted_at IS NULL`;

    const params = [];

    if (options.visibility) {
      query += ' AND l.visibility = ?';
      params.push(options.visibility);
    }

    if (options.is_active !== undefined) {
      query += ' AND l.is_active = ?';
      params.push(options.is_active ? 1 : 0);
    }

    if (options.is_featured) {
      query += ' AND l.is_featured = 1';
    }

    if (options.practice_area_id) {
      query += ' AND lpa.practice_area_id = ?';
      params.push(options.practice_area_id);
    }

    if (options.location_id) {
      query += ' AND l.location_id = ?';
      params.push(options.location_id);
    }

    if (options.search) {
      query += ' AND MATCH(l.name, l.short_bio, l.full_bio) AGAINST(? IN BOOLEAN MODE)';
      params.push(options.search);
    }

    query += ' GROUP BY l.id';

    if (options.sort) {
      if (options.sort === 'rating') {
        query += ' ORDER BY l.average_rating DESC';
      } else if (options.sort === 'name') {
        query += ' ORDER BY l.name ASC';
      } else if (options.sort === 'recent') {
        query += ' ORDER BY l.created_at DESC';
      }
    } else {
      query += ' ORDER BY l.name ASC';
    }

    if (options.limit) {
      const offset = options.offset || 0;
      query += ` LIMIT ${parseInt(options.limit)} OFFSET ${parseInt(offset)}`;
    }

    return queryAll(query, params);
  },

  async create(data) {
    return executeTransaction(async (connection) => {
      // Insert lawyer
      const [result] = await connection.execute(
        `INSERT INTO lawyers (
          name, slug, title, specialty, short_bio, full_bio,
          firm_name, years_of_experience, bar_admissions, education, languages,
          email, phone, website, location_id, visibility, seo_title, seo_description
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          data.slug,
          data.title || null,
          data.specialty || null,
          data.short_bio || null,
          data.full_bio || null,
          data.firm_name || null,
          data.years_of_experience || null,
          data.bar_admissions ? JSON.stringify(data.bar_admissions) : null,
          data.education ? JSON.stringify(data.education) : null,
          data.languages ? JSON.stringify(data.languages) : null,
          data.email || null,
          data.phone || null,
          data.website || null,
          data.location_id || null,
          data.visibility || 'draft',
          data.seo_title || null,
          data.seo_description || null,
        ],
      );

      const lawyerId = result.insertId;

      // Link practice areas
      if (data.practice_area_ids && data.practice_area_ids.length > 0) {
        for (const paId of data.practice_area_ids) {
          await connection.execute(
            'INSERT INTO lawyer_practice_areas (lawyer_id, practice_area_id) VALUES (?, ?)',
            [lawyerId, paId],
          );
        }
      }

      return this.findById(lawyerId);
    });
  },

  async update(id, data) {
    return executeTransaction(async (connection) => {
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
      if (data.title !== undefined) {
        fields.push('title = ?');
        values.push(data.title);
      }
      if (data.specialty !== undefined) {
        fields.push('specialty = ?');
        values.push(data.specialty);
      }
      if (data.short_bio !== undefined) {
        fields.push('short_bio = ?');
        values.push(data.short_bio);
      }
      if (data.full_bio !== undefined) {
        fields.push('full_bio = ?');
        values.push(data.full_bio);
      }
      if (data.firm_name !== undefined) {
        fields.push('firm_name = ?');
        values.push(data.firm_name);
      }
      if (data.years_of_experience !== undefined) {
        fields.push('years_of_experience = ?');
        values.push(data.years_of_experience);
      }
      if (data.bar_admissions !== undefined) {
        fields.push('bar_admissions = ?');
        values.push(data.bar_admissions ? JSON.stringify(data.bar_admissions) : null);
      }
      if (data.education !== undefined) {
        fields.push('education = ?');
        values.push(data.education ? JSON.stringify(data.education) : null);
      }
      if (data.languages !== undefined) {
        fields.push('languages = ?');
        values.push(data.languages ? JSON.stringify(data.languages) : null);
      }
      if (data.email !== undefined) {
        fields.push('email = ?');
        values.push(data.email);
      }
      if (data.phone !== undefined) {
        fields.push('phone = ?');
        values.push(data.phone);
      }
      if (data.website !== undefined) {
        fields.push('website = ?');
        values.push(data.website);
      }
      if (data.location_id !== undefined) {
        fields.push('location_id = ?');
        values.push(data.location_id);
      }
      if (data.visibility !== undefined) {
        fields.push('visibility = ?');
        values.push(data.visibility);
      }
      if (data.is_active !== undefined) {
        fields.push('is_active = ?');
        values.push(data.is_active ? 1 : 0);
      }
      if (data.is_featured !== undefined) {
        fields.push('is_featured = ?');
        values.push(data.is_featured ? 1 : 0);
      }
      if (data.seo_title !== undefined) {
        fields.push('seo_title = ?');
        values.push(data.seo_title);
      }
      if (data.seo_description !== undefined) {
        fields.push('seo_description = ?');
        values.push(data.seo_description);
      }

      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      await connection.execute(`UPDATE lawyers SET ${fields.join(', ')} WHERE id = ?`, values);

      // Update practice areas if provided
      if (data.practice_area_ids) {
        await connection.execute('DELETE FROM lawyer_practice_areas WHERE lawyer_id = ?', [id]);
        for (const paId of data.practice_area_ids) {
          await connection.execute(
            'INSERT INTO lawyer_practice_areas (lawyer_id, practice_area_id) VALUES (?, ?)',
            [id, paId],
          );
        }
      }

      return this.findById(id);
    });
  },

  async delete(id) {
    return executeQuery('UPDATE lawyers SET deleted_at = NOW() WHERE id = ?', [id]);
  },

  async countByVisibility() {
    const result = await queryOne(
      `SELECT
        SUM(CASE WHEN visibility = 'public' THEN 1 ELSE 0 END) as public_count,
        SUM(CASE WHEN visibility = 'draft' THEN 1 ELSE 0 END) as draft_count,
        SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as archived_count
       FROM lawyers WHERE deleted_at IS NULL`,
    );
    return result;
  },
};
