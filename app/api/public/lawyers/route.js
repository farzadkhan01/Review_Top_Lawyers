/** @format */

import { LawyerRepository } from '@/server/repositories/lawyerRepository.js';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const options = {
      visibility: 'public',
      is_active: true,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sort: searchParams.get('sort') || 'name',
    };

    if (searchParams.get('search')) {
      options.search = searchParams.get('search');
    }

    if (searchParams.get('practice_area_id')) {
      options.practice_area_id = parseInt(searchParams.get('practice_area_id'));
    }

    if (searchParams.get('featured') === 'true') {
      options.is_featured = true;
    }

    const lawyers = await LawyerRepository.findAll(options);

    return Response.json({
      data: lawyers,
      pagination: {
        limit: options.limit,
        offset: options.offset,
      },
    });
  } catch (error) {
    console.error('[API] Get lawyers error:', error);
    return Response.json(
      { error: 'Failed to fetch lawyers' },
      { status: 500 },
    );
  }
}
