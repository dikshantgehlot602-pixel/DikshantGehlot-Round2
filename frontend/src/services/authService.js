import { createMockToken } from '@/utils/mockToken';
import { ROLES, SESSION_DURATION_MS, STORAGE_KEYS } from '@/utils/constants';
import { ServiceError, simulateRequest } from './apiClient';
import { createId, readDatabase, updateDatabase } from './database';

export function toPublicUser(user) {
  const publicUser = { ...user };
  delete publicUser.password;
  return publicUser;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function readStoredSession() {
  const raw = window.localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistSession(user, rememberMe) {
  const durationMs = rememberMe ? SESSION_DURATION_MS.REMEMBER_ME : SESSION_DURATION_MS.DEFAULT;
  const expiresAt = new Date(Date.now() + durationMs).toISOString();
  const token = createMockToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.parse(expiresAt) / 1000),
  });
  const session = { token, expiresAt, user: toPublicUser(user) };
  window.localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return session;
}

export function clearStoredSession() {
  window.localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function getStoredSession() {
  const session = readStoredSession();
  if (!session?.token || !session.user?.id || !session.expiresAt) {
    clearStoredSession();
    return null;
  }
  if (Date.parse(session.expiresAt) <= Date.now()) {
    clearStoredSession();
    return null;
  }
  const user = readDatabase().users.find((item) => item.id === session.user.id);
  if (!user) {
    clearStoredSession();
    return null;
  }
  return { ...session, user: toPublicUser(user) };
}

export function login({ email, password, rememberMe = false }) {
  return simulateRequest(() => {
    const user = readDatabase().users.find((item) => item.email === normalizeEmail(email));
    if (!user || user.password !== password) {
      throw new ServiceError('Invalid email or password. Please check your details and try again.', 'INVALID_CREDENTIALS');
    }
    return persistSession(user, rememberMe);
  });
}

export function register({ name, email, password, role }) {
  return simulateRequest(() => {
    if (role !== ROLES.STUDENT && role !== ROLES.PROFESSOR) {
      throw new ServiceError('Select a valid role to continue.', 'INVALID_ROLE');
    }
    const normalized = normalizeEmail(email);
    const created = updateDatabase((database) => {
      if (database.users.some((item) => item.email === normalized)) {
        throw new ServiceError('An account with this email already exists. Try signing in instead.', 'EMAIL_TAKEN');
      }
      const user = {
        id: createId('usr'),
        name: name.trim(),
        email: normalized,
        password,
        role,
        createdAt: new Date().toISOString(),
      };
      database.users.push(user);
      return user;
    });
    return persistSession(created, false);
  });
}

export function logout() {
  clearStoredSession();
}

export function requestPasswordReset(email) {
  return simulateRequest(() => ({
    email: normalizeEmail(email),
    message: 'Demo mode: no email is sent. In a production build, a reset link would be emailed to you.',
  }));
}
