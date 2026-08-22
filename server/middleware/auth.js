/** @format */

import { cookies } from 'next/headers';
import { queryOne } from '@/server/lib/db.js';
import { validateSession } from '@/server/lib/auth.js';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    const token = cookieStore.get('token')?.value;

    if (!sessionId || !token) return null;

    const session = await validateSession(sessionId, token);
    if (!session) return null;

    const user = await queryOne(
      `SELECT u.*, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [session.user_id],
    );

    return user;
  } catch (error) {
    console.error('[Auth] getCurrentUser error:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requirePermission(requiredPermission) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const permission = await queryOne(
    `SELECT p.* FROM permissions p
     INNER JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = ? AND p.name = ?`,
    [user.role_id, requiredPermission],
  );

  if (!permission) {
    throw new Error('Forbidden');
  }

  return user;
}

export async function hasPermission(user, permissionName) {
  if (!user) return false;

  const permission = await queryOne(
    `SELECT p.* FROM permissions p
     INNER JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = ? AND p.name = ?`,
    [user.role_id, permissionName],
  );

  return !!permission;
}
