/** @format */

import { requirePermission } from '@/server/middleware/auth.js';
import { LawyerRepository } from '@/server/repositories/lawyerRepository.js';
import { validateLawyerData } from '@/server/validation/validators.js';

export async function GET(req) {
  try {
    const user = await requirePermission('lawyer:read');
    const { searchParams } = new URL(req.url);

    const options = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sort: searchParams.get('sort') || 'updated',
      is_active: searchParams.get('status') === 'inactive' ? false : true,
    };

    if (searchParams.get('search')) options.search = searchParams.get('search');
    if (searchParams.get('practice_area_id')) {
      options.practice_area_id = parseInt(searchParams.get('practice_area_id'));
    }

    const lawyers = await LawyerRepository.findAll(options);
    return Response.json({ data: lawyers });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await requirePermission('lawyer:create');
    const data = await req.json();

    const errors = validateLawyerData(data);
    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

    const lawyer = await LawyerRepository.create({
      ...data,
      visibility: 'draft',
    });

    return Response.json({ data: lawyer }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
