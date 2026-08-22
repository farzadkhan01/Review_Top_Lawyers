/** @format */

import { requirePermission } from '@/server/middleware/auth.js';
import { PracticeAreaRepository } from '@/server/repositories/practiceAreaRepository.js';

export async function GET(req) {
  try {
    const user = await requirePermission('practice-area:read');
    const areas = await PracticeAreaRepository.findAll({ is_active: undefined });
    return Response.json({ data: areas });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await requirePermission('practice-area:create');
    const data = await req.json();
    const area = await PracticeAreaRepository.create(data);
    return Response.json({ data: area }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
