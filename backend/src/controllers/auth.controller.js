import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { register, login, refresh, logout, getProfile } from '../services/auth.service.js';

const registerUser = asyncHandler(async (req, res) => {
  const result = await register(req.body);
  
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseDuration(process.env.REFRESH_TOKEN_EXPIRE),
  });

  ApiResponse(res, 201, 'User registered successfully', { user: result.user, accessToken: result.accessToken });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await login(email, password);
  
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseDuration(process.env.REFRESH_TOKEN_EXPIRE),
  });

  ApiResponse(res, 200, 'Login successful', { user: result.user, accessToken: result.accessToken });
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError('Refresh token is required', 401);
  }

  const result = await refresh(token);
  
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseDuration(process.env.REFRESH_TOKEN_EXPIRE),
  });

  ApiResponse(res, 200, 'Token refreshed', { accessToken: result.accessToken });
});

const logoutUser = asyncHandler(async (req, res) => {
  await logout(req.user._id);
  
  res.clearCookie('refreshToken');
  ApiResponse(res, 200, 'Logout successful');
});

const getMe = asyncHandler(async (req, res) => {
  ApiResponse(res, 200, 'Profile fetched successfully', { user: req.user });
});

const parseDuration = (str) => {
  if (typeof str !== 'string') return parseInt(str) || 0;
  
  if (str.endsWith('d')) {
    return parseInt(str) * 24 * 60 * 60 * 1000;
  }
  if (str.endsWith('h')) {
    return parseInt(str) * 60 * 60 * 1000;
  }
  if (str.endsWith('m')) {
    return parseInt(str) * 60 * 1000;
  }
  if (str.endsWith('s')) {
    return parseInt(str) * 1000;
  }
  return parseInt(str);
};

export { registerUser, loginUser, refreshToken, logoutUser, getMe };
