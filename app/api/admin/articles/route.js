/** @format */

import { requirePermission } from '@/server/middleware/auth.js';
import { ArticleRepository } from '@/server/repositories/articleRepository.js';
import { validateArticleData } from '@/server/validation/validators.js';

export async function GET(req) {
  try {
    const user = await requirePermission('article:read');
    const { searchParams } = new URL(req.url);

    const options = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sort: 'recent',
    };

    if (searchParams.get('search')) options.search = searchParams.get('search');
    if (searchParams.get('status')) options.status = searchParams.get('status');
    if (searchParams.get('category')) options.category = searchParams.get('category');

    const articles = await ArticleRepository.findAll(options);
    return Response.json({ data: articles });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await requirePermission('article:create');
    const data = await req.json();

    const errors = validateArticleData(data);
    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

    const article = await ArticleRepository.create({
      ...data,
      author_id: user.id,
      status: data.status || 'draft',
    });

    return Response.json({ data: article }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
