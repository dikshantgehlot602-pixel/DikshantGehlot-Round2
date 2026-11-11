import { SERVICE_LATENCY_MS } from '@/utils/constants';

export class ServiceError extends Error {
  constructor(message, code = 'ERROR') {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
  }
}

export function simulateRequest(operation) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, SERVICE_LATENCY_MS);
  });
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error instanceof ServiceError ? error.message : fallback;
}
