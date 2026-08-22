-- ============================================================
-- 003: Lawyers
-- ============================================================

CREATE TABLE IF NOT EXISTS lawyers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255),
  specialty VARCHAR(255),
  short_bio TEXT,
  full_bio TEXT,
  profile_image_id INT,

  -- Professional information
  firm_name VARCHAR(255),
  years_of_experience INT,
  bar_admissions TEXT,
  education TEXT,
  languages TEXT,

  -- Contact information
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),

  -- Location
  location_id INT,

  -- Directory information
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  visibility ENUM('public', 'draft', 'archived') NOT NULL DEFAULT 'draft',

  -- Rating (calculated from reviews)
  average_rating DECIMAL(3, 2),
  total_reviews INT NOT NULL DEFAULT 0,

  -- SEO
  seo_title VARCHAR(255),
  seo_description VARCHAR(500),

  -- Lifecycle
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,

  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (profile_image_id) REFERENCES media(id) ON DELETE SET NULL,

  INDEX idx_slug (slug),
  INDEX idx_visibility (visibility),
  INDEX idx_is_active (is_active),
  INDEX idx_is_featured (is_featured),
  INDEX idx_location_id (location_id),
  INDEX idx_deleted_at (deleted_at),
  FULLTEXT KEY ft_name_bio (name, short_bio, full_bio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lawyer - Practice Area relationship (many-to-many)
CREATE TABLE IF NOT EXISTS lawyer_practice_areas (
  lawyer_id INT NOT NULL,
  practice_area_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (lawyer_id, practice_area_id),
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (practice_area_id) REFERENCES practice_areas(id) ON DELETE CASCADE,

  INDEX idx_practice_area_id (practice_area_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
