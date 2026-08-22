/** @format */

import { getCurrentUser } from '@/server/middleware/auth.js';

export async function GET(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({
      user: { id: user.id, email: user.email, role: user.role_name },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
