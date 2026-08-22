/** @format */

import { PracticeAreaRepository } from '@/server/repositories/practiceAreaRepository.js';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const options = {
      is_active: true,
      limit: parseInt(searchParams.get('limit') || '100'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    const areas = await PracticeAreaRepository.findAll(options);

    return Response.json({
      data: areas,
      pagination: {
        limit: options.limit,
        offset: options.offset,
      },
    });
  } catch (error) {
    console.error('[API] Get practice areas error:', error);
    return Response.json(
      { error: 'Failed to fetch practice areas' },
      { status: 500 },
    );
  }
}
