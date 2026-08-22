/** @format */

import { cookies } from 'next/headers';
import { destroySession } from '@/server/lib/auth.js';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    if (sessionId) {
      await destroySession(sessionId);
    }

    cookieStore.delete('sessionId');
    cookieStore.delete('token');

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
