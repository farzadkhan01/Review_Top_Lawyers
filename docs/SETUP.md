<!-- @format -->

# Development & Deployment Setup Guide

## Local Development Setup

### Prerequisites

- Node.js 18.17+ (LTS recommended)
- MySQL 8.0+
- npm or yarn

### Step 1: Clone & Install Dependencies

```bash
git clone [repository-url]
cd review-top-lawyers
npm install
```

### Step 2: Database Setup

1. **Start MySQL**

```bash
# macOS
brew services start mysql

# Ubuntu/Debian
sudo systemctl start mysql

# Windows
# MySQL should be running as a service
```

2. **Create Database**

```bash
mysql -u root
```

```sql
CREATE DATABASE review_top_lawyers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'review_user'@'localhost' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON review_top_lawyers.* TO 'review_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. **Configure Environment**

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=review_top_lawyers
DB_USER=review_user
DB_PASSWORD=your-secure-password
ADMIN_EMAIL=dev@example.com
ADMIN_PASSWORD=dev-password-123
AUTH_SECRET=dev-secret-change-in-production
```

4. **Run Database Migrations**

```bash
npm run db:setup
```

This will:
- Create all tables
- Set up default roles and permissions
- Create Super Admin user
- Seed practice areas

### Step 3: Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Step 4: Test Setup

**Test Public API:**
```bash
curl http://localhost:3000/api/public/practice-areas
```

**Test Admin Login:**
1. Navigate to `http://localhost:3000/admin/login`
2. Enter your ADMIN_EMAIL and ADMIN_PASSWORD
3. You should access the admin dashboard

**Test Database:**
```bash
mysql -u review_user -p review_top_lawyers
SELECT COUNT(*) as role_count FROM roles;
SELECT COUNT(*) as practice_area_count FROM practice_areas;
```

## Development Workflow

### Running Scripts

```bash
# Development server with hot reload
npm run dev

# Production build and test
npm run build
npm run start

# Linting
npm run lint

# Database setup (create tables and seed)
npm run db:setup

# Production build
npm run build
```

### Creating Migrations

To add a new table or modify schema:

1. Create file `server/db/migrations/007_your_migration.sql`
2. Write migration SQL
3. Run `npm run db:setup` to apply

**Migration Template:**
```sql
-- Description of what this migration does

CREATE TABLE IF NOT EXISTS new_table (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Adding API Routes

New API routes follow Next.js App Router pattern:

**File**: `app/api/[resource]/route.js`

```javascript
import { requirePermission } from '@/server/middleware/auth.js';

export async function GET(req) {
  try {
    // No auth required for public routes
    // const user = await requirePermission('resource:read');
    
    // Handler logic
    return Response.json({ data: [] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await requirePermission('resource:create');
    const data = await req.json();
    
    // Validation
    // Database operation
    
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Repository Pattern

Data access goes in repositories (`server/repositories/`):

```javascript
export const ResourceRepository = {
  async findById(id) {
    return queryOne('SELECT * FROM resources WHERE id = ? AND deleted_at IS NULL', [id]);
  },

  async findAll(options = {}) {
    let query = 'SELECT * FROM resources WHERE deleted_at IS NULL';
    // Build query with filters
    return queryAll(query, params);
  },

  async create(data) {
    // Validate
    // Insert
    // Return created record
  },
};
```

## Production Deployment

### Prerequisites

- Production MySQL database (managed hosting recommended)
- Node.js 18.17+ LTS server
- SSL certificate
- Domain name

### Environment Variables

Create `.env.production.local` (never commit):

```bash
NODE_ENV=production

DB_HOST=prod-mysql-host.aws.rds.amazonaws.com
DB_PORT=3306
DB_NAME=review_top_lawyers
DB_USER=prod_user
DB_PASSWORD=very-secure-production-password

AUTH_SECRET=very-random-secret-64-chars-minimum
ADMIN_EMAIL=admin@reviewtoplayyers.com
ADMIN_PASSWORD=very-secure-admin-password

UPLOAD_DIR=/var/www/review-top-lawyers/uploads
MAX_FILE_SIZE=5242880

NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

### Database Migration

Before deploying to production:

1. **Backup existing database** (if any)
```bash
mysqldump -h prod-host -u user -p database > backup-before-migration.sql
```

2. **Run migrations on production database**
```bash
# Via SSH on production server
npm run db:setup
```

Or manually execute migration files in order:
```bash
for file in server/db/migrations/*.sql; do
  mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < "$file"
done
```

### Deployment Steps

1. **Push code to repository**

```bash
git add .
git commit -m "Phase 1: Backend foundation"
git push origin main
```

2. **SSH into production server**

```bash
ssh user@production-server
cd /var/www/review-top-lawyers
```

3. **Update code and install dependencies**

```bash
git pull origin main
npm ci --production  # Use ci for reproducible installs
```

4. **Set production environment variables**

```bash
# Create .env.production.local with production values
nano .env.production.local
```

5. **Run database migrations** (if not already done)

```bash
npm run db:setup
```

6. **Build production bundle**

```bash
npm run build
```

7. **Start production server** (using process manager)

```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start npm --name "review-top-lawyers" -- start
pm2 startup
pm2 save

# Or using systemd (see below)
```

### Systemd Service (Linux)

Create `/etc/systemd/system/review-top-lawyers.service`:

```ini
[Unit]
Description=Review Top Lawyers
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/review-top-lawyers
Environment="NODE_ENV=production"
EnvironmentFile=/var/www/review-top-lawyers/.env.production.local
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable review-top-lawyers
sudo systemctl start review-top-lawyers
sudo systemctl status review-top-lawyers
```

### Nginx Configuration

Example reverse proxy configuration:

```nginx
server {
    listen 80;
    server_name reviewtoplawyears.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name reviewtoplawyears.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        alias /var/www/review-top-lawyers/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Monitoring

Monitor production application:

```bash
# Check service status
systemctl status review-top-lawyers

# View logs
journalctl -u review-top-lawyers -f

# Check database connections
mysql> SHOW PROCESSLIST;

# Monitor disk usage
df -h /var/www/review-top-lawyers
```

### Backups

Set up automated backups:

```bash
#!/bin/bash
# /var/backups/backup-review-lawyers.sh

BACKUP_DIR="/var/backups/review-lawyers"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/review-lawyers-$DATE.sql"

mkdir -p $BACKUP_DIR

mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

# Upload to remote storage (S3, etc.)
# aws s3 cp $BACKUP_FILE s3://backup-bucket/

echo "Backup completed: $BACKUP_FILE"
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /var/backups/backup-review-lawyers.sh
```

## Troubleshooting

### Build Fails

```bash
# Clear build cache
rm -rf .next
npm run build
```

### Database Connection Error

```bash
# Check connectivity
mysql -h $DB_HOST -u $DB_USER -p $DB_NAME -e "SELECT 1"

# Verify .env variables
cat .env.production.local | grep DB_
```

### Performance Issues

Check database query performance:
```sql
SET GLOBAL log_queries_not_using_indexes = 'ON';
SET GLOBAL slow_query_log = 'ON';
SHOW GLOBAL VARIABLES LIKE 'slow%';
```

### Admin Can't Login

Verify Super Admin exists:
```sql
SELECT * FROM users WHERE email = 'admin@example.com';
```

Reset password:
```bash
mysql -h localhost -u review_user -p review_top_lawyers
UPDATE users SET password_hash = 'hash-goes-here' WHERE email = 'admin@example.com';
```

## Rollback Procedure

If something breaks in production:

1. **Revert code**
```bash
git revert HEAD
npm ci --production
npm run build
systemctl restart review-top-lawyers
```

2. **Restore database backup** (if needed)
```bash
mysql -h prod-host -u user -p database < backup.sql
```

3. **Verify service is running**
```bash
curl https://reviewtoplawyears.com/api/public/lawyers
```

## Next Phase

Phase 2 will:
- Connect admin UI to backend APIs
- Implement file upload
- Add review moderation interface
- Build admin management screens
- Implement real-time updates where applicable
