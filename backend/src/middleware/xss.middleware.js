import xss from 'xss';

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return xss(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const sanitized = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitized[key] = sanitizeValue(value[key]);
      }
    }
    return sanitized;
  }
  return value;
};

export const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};
