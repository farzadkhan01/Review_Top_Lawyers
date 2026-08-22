/** @format */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'review_top_lawyers',
    multipleStatements: true,
  };

  console.log('[Setup] Connecting to MySQL...');
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('[Setup] Running migrations...');

    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`[Setup] Running ${file}...`);
      const statements = sql.split(';').filter((s) => s.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.query(statement);
          } catch (error) {
            if (!error.message.includes('already exists')) {
              console.error(`[Setup] Error running statement: ${error.message}`);
              throw error;
            }
          }
        }
      }
    }

    console.log('[Setup] Migrations completed successfully');

    // Create super admin if needed
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      console.log('[Setup] Creating Super Admin user...');
      const bcrypt = (await import('bcrypt')).default;
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

      try {
        const [result] = await connection.query(
          'INSERT INTO users (email, password_hash, role_id, is_active) VALUES (?, ?, 1, 1)',
          [process.env.ADMIN_EMAIL, hashedPassword],
        );
        console.log(
          `[Setup] Super Admin created: ${process.env.ADMIN_EMAIL} (ID: ${result.insertId})`,
        );
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log('[Setup] Super Admin user already exists');
        } else {
          throw error;
        }
      }
    } else {
      console.log(
        '[Setup] Skipping Super Admin creation. Set ADMIN_EMAIL and ADMIN_PASSWORD to create one.',
      );
    }
  } finally {
    await connection.end();
  }
}

runMigrations()
  .then(() => {
    console.log('[Setup] Database setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[Setup] Setup failed:', error);
    process.exit(1);
  });
