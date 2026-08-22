-- ============================================================
-- 006: Seed Data - Roles, Permissions, Initial Admin Setup
-- ============================================================

-- Insert default roles
INSERT IGNORE INTO roles (id, name, description) VALUES
(1, 'SUPER_ADMIN', 'Super Administrator with full access'),
(2, 'ADMIN', 'Administrator with limited access'),
(3, 'MODERATOR', 'Content moderator'),
(4, 'VIEWER', 'Read-only access');

-- Insert permissions
INSERT IGNORE INTO permissions (name, description, category) VALUES
-- Lawyer permissions
('lawyer:read', 'Read lawyers', 'lawyer'),
('lawyer:create', 'Create lawyers', 'lawyer'),
('lawyer:update', 'Update lawyers', 'lawyer'),
('lawyer:delete', 'Delete/archive lawyers', 'lawyer'),

-- Article permissions
('article:read', 'Read articles', 'article'),
('article:create', 'Create articles', 'article'),
('article:update', 'Update articles', 'article'),
('article:delete', 'Delete/archive articles', 'article'),
('article:publish', 'Publish articles', 'article'),

-- Review permissions
('review:read', 'Read reviews', 'review'),
('review:approve', 'Approve reviews', 'review'),
('review:reject', 'Reject reviews', 'review'),
('review:delete', 'Delete reviews', 'review'),

-- Practice area permissions
('practice-area:read', 'Read practice areas', 'practice-area'),
('practice-area:create', 'Create practice areas', 'practice-area'),
('practice-area:update', 'Update practice areas', 'practice-area'),
('practice-area:delete', 'Delete practice areas', 'practice-area'),

-- Contact permissions
('contact:read', 'Read contact submissions', 'contact'),
('contact:update', 'Update contact submission status', 'contact'),
('contact:delete', 'Delete contact submissions', 'contact'),

-- User permissions
('user:read', 'Read users', 'user'),
('user:create', 'Create users', 'user'),
('user:update', 'Update users', 'user'),
('user:delete', 'Delete users', 'user'),

-- Audit permissions
('audit:read', 'Read audit logs', 'audit'),

-- Media permissions
('media:upload', 'Upload media', 'media'),
('media:delete', 'Delete media', 'media');

-- Assign all permissions to SUPER_ADMIN role
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Assign common permissions to ADMIN role
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions
WHERE category IN ('lawyer', 'article', 'review', 'practice-area', 'contact', 'media');

-- Assign review moderation permissions to MODERATOR role
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions
WHERE name IN ('review:read', 'review:approve', 'review:reject');

-- Assign read-only permissions to VIEWER role
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions
WHERE name LIKE '%:read' OR name = 'audit:read';

-- Insert default practice areas
INSERT IGNORE INTO practice_areas (name, slug, description, is_active) VALUES
('Personal Injury', 'personal-injury', 'Personal injury law including negligence, accidents, and civil litigation', 1),
('Auto Accident', 'auto-accident', 'Automobile accident claims and injury litigation', 1),
('Real Estate', 'real-estate', 'Real estate transactions, disputes, and property law', 1),
('Business Law', 'business-law', 'Corporate law, contracts, and business transactions', 1),
('Family Law', 'family-law', 'Divorce, custody, adoption, and family matters', 1),
('Criminal Defense', 'criminal-defense', 'Criminal defense and prosecution representation', 1),
('Tax Law', 'tax-law', 'Tax planning, compliance, and disputes', 1),
('Intellectual Property', 'intellectual-property', 'Patents, trademarks, copyrights, and IP disputes', 1),
('Employment Law', 'employment-law', 'Employment contracts, disputes, and workplace law', 1),
('Estate Planning', 'estate-planning', 'Wills, trusts, probate, and estate management', 1);

-- Note: The SUPER_ADMIN user will be created separately with hashed password
-- during application setup via the initialization script.
-- Do NOT insert a plaintext password here.
