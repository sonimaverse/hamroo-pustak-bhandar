import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/apiError.js';
import { generateAccessToken, generateRefreshToken } from '../services/token.service.js';
import User from '../models/user.model.js';
import { findByEmail, createRefreshToken, updateLastLogin, revokeRefreshTokens, findById, findByRefreshToken } from '../repositories/auth.repository.js';

const register = async (userData) => {
  const existingUser = await findByEmail(userData.email);
  if (existingUser) {
    throw new ApiError('Email already registered', 409);
  }

  const user = await User.create(userData);
  const accessToken = generateAccessToken({ userId: user._id, role: user.role });

  const refreshTokenDoc = await createRefreshToken(user._id);
  const refreshToken = refreshTokenDoc.refreshToken;

  const { password, ...userWithoutPassword } = user.toObject();

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const login = async (email, password) => {
  const user = await findByEmail(email);
  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError('Invalid email or password', 401);
  }

  const accessToken = generateAccessToken({ userId: user._id, role: user.role });
  const refreshTokenDoc = await createRefreshToken(user._id);
  const refreshToken = refreshTokenDoc.refreshToken;

  await updateLastLogin(user._id);

  const { password: _, ...userWithoutPassword } = user.toObject();

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const refresh = async (token) => {
  const user = await findByRefreshToken(token);
  if (!user) {
    throw new ApiError('Invalid refresh token', 401);
  }

  const payload = { userId: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshTokenDoc = await createRefreshToken(user._id);

  return {
    accessToken,
    refreshToken: refreshTokenDoc.refreshToken,
  };
};

const logout = async (userId) => {
  await revokeRefreshTokens(userId);
};

const getProfile = async (userId) => {
  const user = await findById(userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  return user;
};

export { register, login, refresh, logout, getProfile };
