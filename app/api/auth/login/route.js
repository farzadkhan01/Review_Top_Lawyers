/** @format */

import { cookies } from 'next/headers';
import { authenticateUser, createSession } from '@/server/lib/auth.js';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const { sessionId, token, expiresAt } = await createSession(user.id);

    const cookieStore = await cookies();
    cookieStore.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    });
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    });

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role_name,
      },
      sessionId,
      expiresAt,
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return Response.json(
      { error: 'Login failed' },
      { status: 500 },
    );
  }
}
