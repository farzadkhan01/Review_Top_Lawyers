/** @format */

import { ArticleRepository } from '@/server/repositories/articleRepository.js';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const options = {
      status: 'published',
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sort: 'recent',
    };

    if (searchParams.get('search')) {
      options.search = searchParams.get('search');
    }

    if (searchParams.get('category')) {
      options.category = searchParams.get('category');
    }

    if (searchParams.get('practice_area_id')) {
      options.practice_area_id = parseInt(searchParams.get('practice_area_id'));
    }

    const articles = await ArticleRepository.findAll(options);

    return Response.json({
      data: articles,
      pagination: {
        limit: options.limit,
        offset: options.offset,
      },
    });
  } catch (error) {
    console.error('[API] Get articles error:', error);
    return Response.json(
      { error: 'Failed to fetch articles' },
      { status: 500 },
    );
  }
}
