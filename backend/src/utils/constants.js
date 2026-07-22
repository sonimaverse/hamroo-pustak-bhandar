export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
};

export const USER_ROLES = {
  GUEST: 'guest',
  WHOLESALE_PENDING: 'wholesale_pending',
  WHOLESALE_APPROVED: 'wholesale_approved',
  ADMIN: 'admin',
};

export const WHOLESALE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
};

export const ALLOWED_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Textbook',
  'Children',
  'Comics',
  'Academic',
  'Religious',
  'Biography',
  'Science',
  'History',
  'Poetry',
  'Other',
];
