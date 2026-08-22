/** @format */

import mysql from 'mysql2/promise';

let pool = null;

export async function getDbPool() {
  if (pool) {
    return pool;
  }

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'review_top_lawyers',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  };

  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('[DB] Connected to MySQL successfully');
    return pool;
  } catch (error) {
    console.error('[DB] Connection failed:', error);
    throw error;
  }
}

export async function executeQuery(sql, values = []) {
  const pool = await getDbPool();
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

export async function queryOne(sql, values = []) {
  const results = await executeQuery(sql, values);
  return results[0] || null;
}

export async function queryAll(sql, values = []) {
  return executeQuery(sql, values);
}

export async function executeTransaction(callback) {
  const pool = await getDbPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
