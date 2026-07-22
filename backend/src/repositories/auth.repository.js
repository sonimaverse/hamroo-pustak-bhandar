import { generateRefreshToken } from '../services/token.service.js';
import User from '../models/user.model.js';

const createRefreshToken = (userId) => {
  const payload = { userId };
  const token = generateRefreshToken(payload);

  return User.findByIdAndUpdate(userId, { refreshToken: token }, { new: true, select: '-password' });
};

const findByRefreshToken = async (token) => {
  return await User.findOne({ refreshToken: token }).select('-password');
};

const findByEmail = async (email) => {
  return await User.findOne({ email }).select('+password');
};

const findById = async (id) => {
  return await User.findById(id).select('-password');
};

const updateLastLogin = async (id) => {
  return await User.findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true }).select('-password');
};

const revokeRefreshTokens = (userId) => {
  return User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }, { new: true });
};

export { createRefreshToken, findByRefreshToken, findByEmail, findById, updateLastLogin, revokeRefreshTokens };
