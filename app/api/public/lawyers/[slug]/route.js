/** @format */

import { LawyerRepository } from '@/server/repositories/lawyerRepository.js';

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const lawyer = await LawyerRepository.findBySlug(slug);

    if (!lawyer || lawyer.visibility !== 'public') {
      return Response.json(
        { error: 'Lawyer not found' },
        { status: 404 },
      );
    }

    return Response.json({ data: lawyer });
  } catch (error) {
    console.error('[API] Get lawyer error:', error);
    return Response.json(
      { error: 'Failed to fetch lawyer' },
      { status: 500 },
    );
  }
}
