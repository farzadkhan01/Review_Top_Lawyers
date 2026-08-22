<!-- @format -->

# Backend Architecture

## Overview

Review Top Lawyers backend is a Node.js + MySQL production-ready system built within the Next.js application using the App Router's server-side capabilities.

The architecture separates concerns into distinct layers:
- API Routes (request handling)
- Middleware (authentication & authorization)
- Services/Repositories (data access)
- Database (MySQL)

## Architecture Layers

### 1. API Routes (`app/api/`)

Entry points for HTTP requests. Next.js API routes handle requests and delegate to services.

**Public Routes** (`app/api/public/`):
- `GET /api/public/lawyers` - List public lawyers with filtering
- `GET /api/public/lawyers/[slug]` - Get lawyer by slug
- `GET /api/public/practice-areas` - List practice areas
- `GET /api/public/articles` - List published articles

**Admin Routes** (to be implemented in Phase 2):
- `POST /api/admin/lawyers` - Create lawyer
- `PUT /api/admin/lawyers/[id]` - Update lawyer
- `DELETE /api/admin/lawyers/[id]` - Delete/archive lawyer
- Similar endpoints for articles, reviews, practice areas

**Auth Routes** (`app/api/auth/`):
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Destroy session

### 2. Middleware (`server/middleware/`)

**auth.js**
- `getCurrentUser()` - Get authenticated user from session
- `requireAuth()` - Require authentication (throws if not authenticated)
- `requirePermission(permissionName)` - Require specific permission
- `hasPermission(user, permissionName)` - Check if user has permission

### 3. Repositories (`server/repositories/`)

Data access layer. Repositories abstract database operations and provide clean APIs to services.

**LawyerRepository**:
- `findById(id)` - Get lawyer with relationships
- `findBySlug(slug)` - Get lawyer by URL slug
- `findAll(options)` - List lawyers with filtering, search, pagination
- `create(data)` - Create lawyer with practice areas
- `update(id, data)` - Update lawyer
- `delete(id)` - Soft-delete lawyer

**ArticleRepository**:
- `findById(id)` - Get article with relationships
- `findBySlug(slug)` - Get article by slug
- `findAll(options)` - List articles with filtering
- `create(data)` - Create article
- `update(id, data)` - Update article
- `delete(id)` - Soft-delete article
- `publish(id)` - Publish article
- `archive(id)` - Archive article

**PracticeAreaRepository**:
- `findById(id)` - Get practice area
- `findBySlug(slug)` - Get by slug
- `findAll(options)` - List practice areas
- `create(data)` - Create
- `update(id, data)` - Update
- `delete(id)` - Soft-delete

### 4. Authentication & Authorization (`server/lib/auth.js`)

**Password Management**:
- `hashPassword(password)` - Hash password with bcrypt
- `verifyPassword(password, hash)` - Verify password

**Session Management**:
- `createSession(userId)` - Create session token
- `validateSession(sessionId, token)` - Validate session
- `destroySession(sessionId)` - Delete session

**User Authentication**:
- `authenticateUser(email, password)` - Authenticate user, update last_login

**Token Management**:
- `generateToken(userId, expiresIn)` - Generate JWT token
- `verifyToken(token)` - Verify JWT token

### 5. Database (`server/lib/db.js`)

Connection pool management and query execution.

**Functions**:
- `getDbPool()` - Get or create connection pool
- `executeQuery(sql, values)` - Execute query with parameters
- `queryOne(sql, values)` - Execute, return single row
- `queryAll(sql, values)` - Execute, return all rows
- `executeTransaction(callback)` - Transaction with rollback support

**Key Features**:
- Connection pooling (10 connections max)
- Parameterized queries (SQL injection prevention)
- Transaction support with automatic rollback
- UTF-8MB4 charset for full Unicode support

### 6. Validation (`server/validation/validators.js`)

Input validation utilities.

**Validators**:
- `isEmail(value)` - Email format
- `isSlug(value)` - URL slug format
- `isPhone(value)` - Phone number format
- `isURL(value)` - URL format
- `isNotEmpty(value)` - Not empty string
- `minLength(value, length)` - Minimum length
- `maxLength(value, length)` - Maximum length
- `isNumber(value)` - Valid number
- `isRating(value)` - Rating 1-5

**Validation Functions**:
- `validateLawyerData(data)` - Validate lawyer input
- `validateArticleData(data)` - Validate article input
- `validateReviewData(data)` - Validate review input

## Database Schema

### Core Tables

**users**
- Stores admin users
- Contains email, hashed password, role_id
- Tracks last_login_at, created_at, updated_at, deleted_at

**roles**
- SUPER_ADMIN, ADMIN, MODERATOR, VIEWER
- Links to permissions via role_permissions junction table

**permissions**
- Named permissions (lawyer:read, article:create, etc.)
- Organized by category

**lawyers**
- Main lawyer records
- Includes profile, professional info, contact, SEO
- Soft-delete with deleted_at
- Tracks average_rating and total_reviews (calculated from reviews)

**practice_areas**
- Legal practice categories
- Linked to lawyers via lawyer_practice_areas

**lawyer_practice_areas**
- Many-to-many relationship between lawyers and practice areas

**articles**
- Blog/content articles
- Status: draft, published, archived
- Linked to practice areas and related lawyers

**article_practice_areas** & **article_lawyers**
- Many-to-many relationships for articles

**reviews**
- User reviews for lawyers
- Status: pending, approved, rejected
- Includes moderator_id for tracking moderation

**contact_submissions**
- Public contact form submissions
- Status tracking: new, read, replied, archived

**media**
- File/image records
- Stores path, MIME type, dimensions
- Tracks uploader and entity associations

**sessions**
- Active user sessions
- Contains token hash and expiration
- Supports session termination

**audit_logs**
- Activity tracking for all admin actions
- JSON metadata for flexible logging
- Tracks user, action, entity, IP, user agent

## Authentication Flow

### Login Flow

1. User submits email + password to `POST /api/auth/login`
2. API looks up user by email
3. Verifies password hash with bcrypt
4. Creates session record in database
5. Generates JWT token
6. Sets httpOnly cookies (sessionId, token)
7. Returns user info and session data

### Request Authentication

1. Middleware reads cookies (sessionId, token)
2. Validates session exists and token hash matches
3. Retrieves user and role information
4. Makes user available to route handlers
5. Routes can check permissions before proceeding

### Logout Flow

1. User submits `POST /api/auth/logout`
2. API deletes session record
3. Clears cookies
4. User is no longer authenticated

## Authorization

Role-based access control (RBAC):

**SUPER_ADMIN**
- All permissions
- Can manage all content and users

**ADMIN**
- lawyer:*, article:*, review:*, practice-area:*, contact:*, media:*
- Can manage most content

**MODERATOR**
- review:read, review:approve, review:reject
- Limited to review moderation

**VIEWER**
- \*:read, audit:read
- Read-only access

Check permissions in API routes:
```javascript
const user = await requirePermission('lawyer:create');
```

## Error Handling

API routes return standardized JSON responses:

**Success** (200):
```json
{
  "data": { ... },
  "pagination": { "limit": 20, "offset": 0 }
}
```

**Errors**:
- 400: Bad request (validation, missing required fields)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (authenticated but lacks permission)
- 404: Not found
- 500: Server error

## Soft Deletion

Most content tables include `deleted_at` timestamp:
- NULL = active/public
- Non-NULL = deleted/archived
- Queries filter WHERE deleted_at IS NULL

Update soft-deleted content without losing history.

## Ratings System

Lawyer ratings are calculated from approved reviews:

1. Review is created with status='pending'
2. Admin approves review
3. Trigger/service recalculates lawyer.average_rating and total_reviews
4. Calculation: AVG(rating) WHERE status='approved' AND deleted_at IS NULL
5. Stores calculated values for query performance

Avoid manually editing lawyer.average_rating.

## Audit Logging

Audit logs track admin activity:

```javascript
const audit = {
  user_id: user.id,
  action: 'lawyer:created',
  entity_type: 'lawyer',
  entity_id: lawyer.id,
  entity_slug: lawyer.slug,
  metadata: { name: lawyer.name },
  ip_address: req.ip,
  user_agent: req.headers['user-agent'],
};
```

Query audit logs:
```javascript
const logs = await queryAll(
  'SELECT * FROM audit_logs WHERE entity_type = ? ORDER BY created_at DESC',
  ['lawyer']
);
```

## Future Considerations

### Image Storage

Currently designed for local file storage:
- Path: `public/uploads/[entity_type]/[id]/[filename]`
- URL: `/uploads/[entity_type]/[id]/[filename]`

To migrate to cloud storage (S3, Cloudinary, etc.):
1. Update media.file_path storage logic
2. Implement pre-signed URLs or redirect
3. Update security validation rules
4. No schema changes needed

### Scaling

Database optimizations for growth:
- Use read replicas for reporting/analytics
- Archive old audit logs
- Implement media cleanup jobs
- Add query caching (Redis) for:
  - Lawyer directory listings
  - Published articles
  - Practice areas

### Notifications

Email notifications framework ready:
- Use existing EmailJS for contact form
- Add admin email notifications for:
  - New reviews pending approval
  - New contact submissions
  - Scheduled digests

## Testing

Future test strategy:
- Unit tests for repositories (mock DB)
- Integration tests with real DB
- API endpoint tests
- Permission/authorization tests
- Load testing for production readiness
