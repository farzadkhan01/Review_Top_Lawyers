/** @format */

import { requirePermission } from '@/server/middleware/auth.js';
import { LawyerRepository } from '@/server/repositories/lawyerRepository.js';
import { validateLawyerData } from '@/server/validation/validators.js';

export async function GET(req, { params }) {
  try {
    const user = await requirePermission('lawyer:read');
    const { id } = await params;
    const lawyer = await LawyerRepository.findById(parseInt(id));

    if (!lawyer) {
      return Response.json({ error: 'Lawyer not found' }, { status: 404 });
    }

    return Response.json({ data: lawyer });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = await requirePermission('lawyer:update');
    const { id } = await params;
    const data = await req.json();

    const lawyer = await LawyerRepository.findById(parseInt(id));
    if (!lawyer) {
      return Response.json({ error: 'Lawyer not found' }, { status: 404 });
    }

    const updated = await LawyerRepository.update(parseInt(id), data);
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
    const user = await requirePermission('lawyer:delete');
    const { id } = await params;

    const lawyer = await LawyerRepository.findById(parseInt(id));
    if (!lawyer) {
      return Response.json({ error: 'Lawyer not found' }, { status: 404 });
    }

    await LawyerRepository.delete(parseInt(id));
    return Response.json({ success: true });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
