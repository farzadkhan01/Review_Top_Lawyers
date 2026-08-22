<!-- @format -->

# Database Setup & Documentation

## MySQL Version

**Required**: MySQL 8.0 or higher

Features used:
- InnoDB storage engine
- Foreign keys with constraints
- JSON functions for relationships
- FULLTEXT indexes for search
- Transactions with rollback
- Prepared statements
- UTF-8MB4 encoding

## Setup Instructions

### 1. Install MySQL

**macOS (Homebrew)**:
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Windows**:
- Download MySQL Community Server from mysql.com
- Run installer, choose Development Machine setup
- Configure MySQL Server as service
- Run MySQL Command Line Client

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
```

### 2. Create Database User

```sql
CREATE USER 'review_user'@'localhost' IDENTIFIED BY 'secure-password-here';
GRANT ALL PRIVILEGES ON review_top_lawyers.* TO 'review_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=review_top_lawyers
DB_USER=review_user
DB_PASSWORD=secure-password-here
ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD=secure-initial-password
AUTH_SECRET=generate-random-secret-here
```

Generate AUTH_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run Database Setup

```bash
npm install
node server/db/setup.js
```

This will:
1. Create all tables
2. Create default roles and permissions
3. Populate practice areas
4. Create Super Admin user (if ADMIN_EMAIL and ADMIN_PASSWORD set)

### 5. Verify Setup

```bash
mysql -u review_user -p review_top_lawyers

SHOW TABLES;
SELECT * FROM roles;
SELECT * FROM users;
SELECT COUNT(*) FROM practice_areas;
```

## Database Structure

### Authentication & Access Control

**users** (Admin users)
```
id (PK)
email (UNIQUE)
password_hash
role_id (FK -> roles)
is_active
last_login_at
created_at
updated_at
deleted_at
```

**roles**
```
id (PK)
name (UNIQUE)
description
created_at
updated_at
```

**permissions**
```
id (PK)
name (UNIQUE)
description
category
created_at
```

**role_permissions** (Many-to-many)
```
role_id (FK -> roles)
permission_id (FK -> permissions)
PRIMARY KEY (role_id, permission_id)
```

**sessions** (Active user sessions)
```
id (PK)
user_id (FK -> users)
token_hash (UNIQUE)
expires_at
created_at
updated_at
```

### Content

**practice_areas**
```
id (PK)
name (UNIQUE)
slug (UNIQUE)
description
seo_title
seo_description
is_active
created_at
updated_at
deleted_at
```

**locations**
```
id (PK)
country
state_region
city
postal_code
full_address
latitude
longitude
created_at
updated_at
UNIQUE (country, state_region, city)
```

**lawyers**
```
id (PK)
name
slug (UNIQUE)
title
specialty
short_bio
full_bio
profile_image_id (FK -> media)
firm_name
years_of_experience
bar_admissions (JSON)
education (JSON)
languages (JSON)
email
phone
website
location_id (FK -> locations)
is_featured
is_active
visibility (ENUM: public, draft, archived)
average_rating (DECIMAL)
total_reviews (INT)
seo_title
seo_description
created_at
updated_at
deleted_at
FULLTEXT INDEX (name, short_bio, full_bio)
```

**lawyer_practice_areas** (Many-to-many)
```
lawyer_id (FK -> lawyers)
practice_area_id (FK -> practice_areas)
created_at
PRIMARY KEY (lawyer_id, practice_area_id)
```

**articles**
```
id (PK)
title
slug (UNIQUE)
excerpt
content (LONGTEXT)
featured_image_id (FK -> media)
category
author_id (FK -> users)
status (ENUM: draft, published, archived)
published_at
seo_title
seo_description
canonical_url
created_at
updated_at
deleted_at
FULLTEXT INDEX (title, content)
```

**article_practice_areas** (Many-to-many)
```
article_id (FK -> articles)
practice_area_id (FK -> practice_areas)
created_at
PRIMARY KEY (article_id, practice_area_id)
```

**article_lawyers** (Many-to-many)
```
article_id (FK -> articles)
lawyer_id (FK -> lawyers)
created_at
PRIMARY KEY (article_id, lawyer_id)
```

### Reviews & Feedback

**reviews**
```
id (PK)
lawyer_id (FK -> lawyers)
reviewer_name
reviewer_email
rating (INT 1-5, CHECK)
review_text
status (ENUM: pending, approved, rejected)
moderator_id (FK -> users, nullable)
rejection_reason
helpful_count (INT)
created_at
updated_at
deleted_at
```

**contact_submissions**
```
id (PK)
name
email
phone
subject
message
status (ENUM: new, read, replied, archived)
created_at
updated_at
```

### Files & Media

**media**
```
id (PK)
original_filename
filename (UNIQUE)
file_path
url
mime_type
file_size (INT bytes)
width (INT pixels)
height (INT pixels)
entity_type (VARCHAR: lawyer, article, etc.)
entity_id (INT)
uploaded_by (FK -> users, nullable)
created_at
updated_at
deleted_at
```

### Audit Logging

**audit_logs**
```
id (PK)
user_id (FK -> users, nullable)
action (VARCHAR)
entity_type (VARCHAR)
entity_id (INT)
entity_slug (VARCHAR)
metadata (JSON)
ip_address (VARCHAR)
user_agent (TEXT)
created_at
```

## Migrations

Migrations run in order from `server/db/migrations/`:

1. **001_initial_schema.sql** - Users, roles, permissions, sessions, audit
2. **002_practice_areas_locations.sql** - Practice areas and locations
3. **003_lawyers.sql** - Lawyer and lawyer_practice_areas tables
4. **004_articles.sql** - Articles and relationships
5. **005_reviews_media.sql** - Reviews, contact, and media tables
6. **006_seed_data.sql** - Default roles, permissions, practice areas

To rerun migrations, delete tables in reverse order then run setup again.

## Data Import

### From Existing Mock Data

Current mock data in `data/lawyers.js` and `data/articles.js` can be imported:

```javascript
import { LawyerRepository } from '@/server/repositories/lawyerRepository.js';
import { lawyers } from '@/data/lawyers.js';

for (const lawyer of lawyers) {
  await LawyerRepository.create({
    name: lawyer.name,
    slug: lawyer.slug,
    // ... map mock fields to schema
  });
}
```

## Maintenance

### Backup

```bash
mysqldump -u review_user -p review_top_lawyers > backup.sql
```

### Restore

```bash
mysql -u review_user -p review_top_lawyers < backup.sql
```

### Archive Old Data

```sql
-- Archive old audit logs (over 1 year old)
DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### Optimize Tables

```sql
OPTIMIZE TABLE lawyers;
OPTIMIZE TABLE articles;
OPTIMIZE TABLE reviews;
```

## Performance Considerations

### Indexes

Key indexes are already created:
- Foreign keys (automatic)
- Email (users, unique)
- Slug (unique lookups)
- Visibility (filtering)
- Status (filtering)
- Timestamps (sorting)
- FULLTEXT (search)

### Query Optimization

Example queries use:
- Prepared statements (SQL injection prevention)
- JSON aggregation (relationships in one query)
- LIMIT/OFFSET (pagination)
- WHERE clauses (filtering before fetch)

### Scaling

For 100k+ lawyers/articles:
1. Implement query result caching (Redis)
2. Add read replicas for reporting
3. Archive old audit logs monthly
4. Use connection pooling (already implemented)

## Troubleshooting

### Connection Refused

```bash
# Check MySQL is running
mysql --version
systemctl status mysql

# Verify credentials
mysql -u review_user -p -h localhost
```

### Duplicate Entry Error

Schema has UNIQUE constraints on:
- users.email
- roles.name
- permissions.name
- lawyers.slug
- articles.slug
- practice_areas.slug

To fix: Update instead of insert, or use INSERT IGNORE.

### Foreign Key Constraint Failure

Ensure:
1. Referenced record exists
2. FK column matches referenced type
3. No cascading deletes on soft-deleted records
4. FOREIGN_KEY_CHECKS is ON

### FULLTEXT Search Not Working

FULLTEXT indexes are on:
- lawyers (name, short_bio, full_bio)
- articles (title, content)

Queries must use:
```sql
WHERE MATCH(field) AGAINST(search IN BOOLEAN MODE)
```

Not standard LIKE searches.

## Security

### Password Storage

Passwords are hashed with bcrypt (salt 12 rounds):
- Never store plaintext
- Use hashPassword() utility
- verifyPassword() handles comparison

### SQL Injection Prevention

All queries use parameterized statements:
```javascript
// Good - prevents injection
executeQuery('SELECT * FROM users WHERE email = ?', [email]);

// Bad - vulnerable
executeQuery(`SELECT * FROM users WHERE email = '${email}'`);
```

### Session Security

- Sessions are database-backed
- Tokens are JWT (expires 24h)
- Cookies are httpOnly, secure, sameSite=lax
- Session destruction removes token from database

### Soft Deletion Security

Soft-deleted records:
- Cannot be queried directly (WHERE deleted_at IS NULL)
- Are invisible to public API
- Can be recovered by setting deleted_at = NULL
- Preserve referential integrity

## Next Steps

After database setup:

1. Test Super Admin login at `/admin/login`
2. Verify you can access admin dashboard
3. Test public API: `curl http://localhost:3000/api/public/lawyers`
4. Review audit logs for activity tracking
5. Deploy with production database credentials
