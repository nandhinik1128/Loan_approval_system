import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { comparePassword, createUser, findUserByEmail, findUserById, updateUser } from './store.js';

const maskEmail = (email) => email.replace(/(^.).*(@.*$)/, '$1***$2');

export async function registerUser(payload) {
  const existing = await findUserByEmail(payload.email);
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const user = await createUser(payload);
  return buildSession(user);
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return buildSession(user);
}

export async function requestPasswordOtp({ email }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('No account found for this email');
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  await updateUser(user.id, {
    otpCode: otp,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  return {
    message: `OTP sent to ${maskEmail(email)}.`,
    otpForDemo: otp
  };
}

export async function resetPassword({ email, otp, newPassword }) {
  const user = await findUserByEmail(email);
  if (!user || !user.otpCode || user.otpCode !== otp || new Date(user.otpExpiresAt).getTime() < Date.now()) {
    throw new Error('Invalid or expired OTP');
  }

  await updateUser(user.id, {
    passwordHash: await bcrypt.hash(newPassword, 10),
    otpCode: null,
    otpExpiresAt: null,
    passwordResetAt: new Date()
  });

  return { message: 'Password updated successfully' };
}

export async function getProfile(userId) {
  return findUserById(userId);
}

function buildSession(user) {
  const token = jwt.sign({ role: user.role, email: user.email }, env.jwtSecret, {
    subject: String(user.id),
    expiresIn: env.jwtExpiresIn
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  };
}
