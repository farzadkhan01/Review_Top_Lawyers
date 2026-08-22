/** @format */

import { requirePermission } from '@/server/middleware/auth.js';
import { queryAll, queryOne, executeQuery } from '@/server/lib/db.js';

export async function GET(req) {
  try {
    const user = await requirePermission('contact:read');
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM contact_submissions';
    const params = [];

    if (searchParams.get('status')) {
      query += ' WHERE status = ?';
      params.push(searchParams.get('status'));
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const submissions = await queryAll(query, params);
    return Response.json({ data: submissions });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
