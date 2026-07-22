import jwt from 'jsonwebtoken';
import env from '../utils/env.js';

const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRE,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
