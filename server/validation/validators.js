/** @format */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PHONE_PATTERN = /^[\d\s\-\+\(\)]+$/;
const URL_PATTERN = /^https?:\/\/.+\..+/i;

export const Validators = {
  isEmail(value) {
    return EMAIL_PATTERN.test(String(value).toLowerCase());
  },

  isSlug(value) {
    return SLUG_PATTERN.test(String(value));
  },

  isPhone(value) {
    return PHONE_PATTERN.test(String(value));
  },

  isURL(value) {
    return URL_PATTERN.test(String(value));
  },

  isNotEmpty(value) {
    return String(value).trim().length > 0;
  },

  minLength(value, length) {
    return String(value).length >= length;
  },

  maxLength(value, length) {
    return String(value).length <= length;
  },

  isNumber(value) {
    return !Number.isNaN(Number(value));
  },

  isInteger(value) {
    return Number.isInteger(Number(value));
  },

  isInRange(value, min, max) {
    const num = Number(value);
    return num >= min && num <= max;
  },

  isRating(value) {
    const num = Number(value);
    return Number.isInteger(num) && num >= 1 && num <= 5;
  },

  isOneOf(value, allowedValues) {
    return allowedValues.includes(value);
  },
};

export function validateLawyerData(data) {
  const errors = {};

  if (!Validators.isNotEmpty(data.name)) {
    errors.name = 'Name is required';
  } else if (!Validators.maxLength(data.name, 255)) {
    errors.name = 'Name must be 255 characters or less';
  }

  if (!Validators.isNotEmpty(data.slug)) {
    errors.slug = 'Slug is required';
  } else if (!Validators.isSlug(data.slug)) {
    errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
  } else if (!Validators.maxLength(data.slug, 255)) {
    errors.slug = 'Slug must be 255 characters or less';
  }

  if (data.email && !Validators.isEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (data.phone && !Validators.isPhone(data.phone)) {
    errors.phone = 'Invalid phone format';
  }

  if (data.website && !Validators.isURL(data.website)) {
    errors.website = 'Invalid website URL';
  }

  if (data.years_of_experience !== undefined) {
    if (!Validators.isInteger(data.years_of_experience)) {
      errors.years_of_experience = 'Years of experience must be an integer';
    } else if (!Validators.isInRange(data.years_of_experience, 0, 70)) {
      errors.years_of_experience = 'Years of experience must be between 0 and 70';
    }
  }

  return errors;
}

export function validateArticleData(data) {
  const errors = {};

  if (!Validators.isNotEmpty(data.title)) {
    errors.title = 'Title is required';
  } else if (!Validators.maxLength(data.title, 255)) {
    errors.title = 'Title must be 255 characters or less';
  }

  if (!Validators.isNotEmpty(data.slug)) {
    errors.slug = 'Slug is required';
  } else if (!Validators.isSlug(data.slug)) {
    errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
  } else if (!Validators.maxLength(data.slug, 255)) {
    errors.slug = 'Slug must be 255 characters or less';
  }

  if (!Validators.isNotEmpty(data.content)) {
    errors.content = 'Content is required';
  } else if (!Validators.minLength(data.content, 100)) {
    errors.content = 'Content must be at least 100 characters';
  }

  if (data.status && !Validators.isOneOf(data.status, ['draft', 'published', 'archived'])) {
    errors.status = 'Invalid status';
  }

  return errors;
}

export function validateReviewData(data) {
  const errors = {};

  if (!Validators.isNotEmpty(data.reviewer_name)) {
    errors.reviewer_name = 'Reviewer name is required';
  } else if (!Validators.maxLength(data.reviewer_name, 255)) {
    errors.reviewer_name = 'Reviewer name must be 255 characters or less';
  }

  if (!Validators.isNotEmpty(data.review_text)) {
    errors.review_text = 'Review text is required';
  } else if (!Validators.minLength(data.review_text, 10)) {
    errors.review_text = 'Review must be at least 10 characters';
  }

  if (!Validators.isRating(data.rating)) {
    errors.rating = 'Rating must be an integer between 1 and 5';
  }

  if (data.reviewer_email && !Validators.isEmail(data.reviewer_email)) {
    errors.reviewer_email = 'Invalid email format';
  }

  return errors;
}
