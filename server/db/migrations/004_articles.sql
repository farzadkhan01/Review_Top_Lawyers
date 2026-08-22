-- ============================================================
-- 004: Articles
-- ============================================================

CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  featured_image_id INT,

  -- Categorization
  category VARCHAR(100),
  author_id INT,

  -- Status
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP NULL,

  -- SEO
  seo_title VARCHAR(255),
  seo_description VARCHAR(500),
  canonical_url VARCHAR(500),

  -- Lifecycle
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,

  FOREIGN KEY (featured_image_id) REFERENCES media(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,

  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_category (category),
  INDEX idx_deleted_at (deleted_at),
  FULLTEXT KEY ft_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article - Practice Area relationship (many-to-many)
CREATE TABLE IF NOT EXISTS article_practice_areas (
  article_id INT NOT NULL,
  practice_area_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (article_id, practice_area_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (practice_area_id) REFERENCES practice_areas(id) ON DELETE CASCADE,

  INDEX idx_practice_area_id (practice_area_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article - Lawyer relationship (many-to-many)
CREATE TABLE IF NOT EXISTS article_lawyers (
  article_id INT NOT NULL,
  lawyer_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (article_id, lawyer_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,

  INDEX idx_lawyer_id (lawyer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
