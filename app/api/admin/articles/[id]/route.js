/** @format */

import { requirePermission } from '@/server/middleware/auth.js';
import { ArticleRepository } from '@/server/repositories/articleRepository.js';

export async function GET(req, { params }) {
  try {
    const user = await requirePermission('article:read');
    const { id } = await params;
    const article = await ArticleRepository.findById(parseInt(id));

    if (!article) {
      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    return Response.json({ data: article });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = await requirePermission('article:update');
    const { id } = await params;
    const data = await req.json();

    const article = await ArticleRepository.findById(parseInt(id));
    if (!article) {
      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    const updated = await ArticleRepository.update(parseInt(id), data);
    return Response.json({ data: updated });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await requirePermission('article:delete');
    const { id } = await params;

    const article = await ArticleRepository.findById(parseInt(id));
    if (!article) {
      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    await ArticleRepository.delete(parseInt(id));
    return Response.json({ success: true });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
