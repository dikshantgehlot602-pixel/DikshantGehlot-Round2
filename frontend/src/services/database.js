import { createSeedDatabase, SEED_DATABASE_VERSION } from '@/data/seedData';
import { DATA_CHANGED_EVENT, STORAGE_KEYS } from '@/utils/constants';

function isUsableDatabase(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    value.version === SEED_DATABASE_VERSION &&
    Array.isArray(value.users) &&
    Array.isArray(value.courses) &&
    Array.isArray(value.assignments) &&
    Array.isArray(value.groups) &&
    Array.isArray(value.submissions)
  );
}

export function writeDatabase(database) {
  window.localStorage.setItem(STORAGE_KEYS.DATABASE, JSON.stringify(database));
}

export function readDatabase() {
  const raw = window.localStorage.getItem(STORAGE_KEYS.DATABASE);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (isUsableDatabase(parsed)) return parsed;
    } catch {
      // Corrupted storage falls through to a fresh seed below.
    }
  }
  const seed = createSeedDatabase();
  writeDatabase(seed);
  return seed;
}

export function updateDatabase(mutate) {
  const database = readDatabase();
  const result = mutate(database);
  writeDatabase(database);
  window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
  return result;
}

export function resetDatabase() {
  writeDatabase(createSeedDatabase());
  window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
}

export function createId(prefix) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}${random}`;
}
