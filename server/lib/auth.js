/** @format */

import { queryOne, executeQuery } from './db.js';

const AUTH_SECRET = process.env.AUTH_SECRET || 'change-me-in-production';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

let bcryptModule = null;
let jwtModule = null;

async function getBcrypt() {
  if (!bcryptModule) {
    bcryptModule = (await import('bcrypt')).default;
  }
  return bcryptModule;
}

async function getJwt() {
  if (!jwtModule) {
    jwtModule = (await import('jsonwebtoken')).default;
  }
  return jwtModule;
}

export async function hashPassword(password) {
  const bcrypt = await getBcrypt();
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  const bcrypt = await getBcrypt();
  return bcrypt.compare(password, hash);
}

export async function generateToken(userId, expiresIn = '24h') {
  const jwt = await getJwt();
  return jwt.sign({ userId }, AUTH_SECRET, { expiresIn });
}

export async function verifyToken(token) {
  try {
    const jwt = await getJwt();
    return jwt.verify(token, AUTH_SECRET);
  } catch (error) {
    return null;
  }
}

export async function createSession(userId) {
  const token = await generateToken(userId);
  const hash = await hashPassword(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  await executeQuery(
    `INSERT INTO sessions (id, user_id, token_hash, expires_at)
     VALUES (?, ?, ?, ?)`,
    [sessionId, userId, hash, expiresAt],
  );

  return { sessionId, token, expiresAt };
}

export async function validateSession(sessionId, token) {
  if (!sessionId || !token) return null;

  const session = await queryOne(
    `SELECT * FROM sessions
     WHERE id = ? AND expires_at > NOW()`,
    [sessionId],
  );

  if (!session) return null;

  const isValid = await verifyPassword(token, session.token_hash);
  if (!isValid) return null;

  return session;
}

export async function destroySession(sessionId) {
  await executeQuery('DELETE FROM sessions WHERE id = ?', [sessionId]);
}

export async function authenticateUser(email, password) {
  const user = await queryOne(
    `SELECT u.*, r.name as role_name
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id
     WHERE u.email = ? AND u.is_active = 1 AND u.deleted_at IS NULL`,
    [email],
  );

  if (!user) return null;

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) return null;

  // Update last login
  await executeQuery('UPDATE users SET last_login_at = NOW() WHERE id = ?', [
    user.id,
  ]);

  return user;
}
