/**
 * Centralized error handling utilities for Launch Game
 * Provides consistent error handling across Firebase operations and user interactions
 */

/**
 * Firebase error codes mapped to user-friendly messages
 */
const FIREBASE_ERROR_MESSAGES = {
  'permission-denied': 'You don\'t have permission to perform this action.',
  'not-found': 'The requested data could not be found.',
  'already-exists': 'This data already exists.',
  'resource-exhausted': 'Too many requests. Please try again later.',
  'failed-precondition': 'Unable to complete this operation right now.',
  'aborted': 'Operation was interrupted. Please try again.',
  'out-of-range': 'Invalid input value.',
  'unimplemented': 'This feature is not available yet.',
  'internal': 'An internal error occurred. Please try again.',
  'unavailable': 'Service temporarily unavailable. Please check your connection.',
  'data-loss': 'Data may have been lost. Please refresh and try again.',
  'unauthenticated': 'You need to be logged in to do this.',
  'invalid-argument': 'Invalid data provided.',
  'deadline-exceeded': 'Operation timed out. Please try again.',
  'cancelled': 'Operation was cancelled.',
};

/**
 * Get user-friendly error message from Firebase error
 */
export const getFirebaseErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred.';

  // Check if it's a Firebase error with a code
  if (error.code) {
    const code = error.code.replace('firestore/', '');
    return FIREBASE_ERROR_MESSAGES[code] || error.message || 'An error occurred.';
  }

  // Network errors
  if (error.message?.includes('network') || error.message?.includes('offline')) {
    return 'Network error. Please check your internet connection.';
  }

  // Fallback to error message or generic
  return error.message || 'An unexpected error occurred.';
};

/**
 * Enhanced error logger with context
 */
export const logError = (context, error, additionalInfo = {}) => {
  console.group(`🔴 Error in ${context}`);
  console.error('Error:', error);
  console.error('Error Code:', error?.code);
  console.error('Error Message:', error?.message);

  if (Object.keys(additionalInfo).length > 0) {
    console.error('Additional Info:', additionalInfo);
  }

  console.error('Stack Trace:', error?.stack);
  console.error('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

/**
 * Retry logic for transient failures
 */
export const retryOperation = async (
  operation,
  maxRetries = 3,
  delayMs = 1000,
  backoffMultiplier = 2
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on permission or auth errors
      if (error?.code?.includes('permission') || error?.code?.includes('unauthenticated')) {
        throw error;
      }

      // Don't retry on invalid data errors
      if (error?.code?.includes('invalid-argument') || error?.code?.includes('failed-precondition')) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
        console.warn(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Check if user is online
 */
export const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

/**
 * Wait for online status
 */
export const waitForOnline = (timeoutMs = 30000) => {
  return new Promise((resolve, reject) => {
    if (isOnline()) {
      resolve(true);
      return;
    }

    const timeout = setTimeout(() => {
      window.removeEventListener('online', onlineHandler);
      reject(new Error('Timeout waiting for network connection'));
    }, timeoutMs);

    const onlineHandler = () => {
      clearTimeout(timeout);
      window.removeEventListener('online', onlineHandler);
      resolve(true);
    };

    window.addEventListener('online', onlineHandler);
  });
};

/**
 * Validate required fields
 */
export const validateRequired = (data, requiredFields) => {
  const missing = [];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missing.join(', ')}`,
      missing,
    };
  }

  return { valid: true };
};

/**
 * Validate numeric input
 */
export const validateNumber = (value, options = {}) => {
  const {
    min = -Infinity,
    max = Infinity,
    integer = false,
    fieldName = 'Value',
  } = options;

  const num = Number(value);

  if (isNaN(num)) {
    return {
      valid: false,
      message: `${fieldName} must be a valid number.`,
    };
  }

  if (integer && !Number.isInteger(num)) {
    return {
      valid: false,
      message: `${fieldName} must be a whole number.`,
    };
  }

  if (num < min) {
    return {
      valid: false,
      message: `${fieldName} must be at least ${min}.`,
    };
  }

  if (num > max) {
    return {
      valid: false,
      message: `${fieldName} cannot exceed ${max}.`,
    };
  }

  return { valid: true, value: num };
};

/**
 * Safe async wrapper that won't crash the app
 */
export const safeAsync = async (fn, fallbackValue = null, errorContext = 'Operation') => {
  try {
    return await fn();
  } catch (error) {
    logError(errorContext, error);
    return fallbackValue;
  }
};

/**
 * Error class for app-specific errors
 */
export class AppError extends Error {
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

const errorHandlingUtils = {
  getFirebaseErrorMessage,
  logError,
  retryOperation,
  isOnline,
  waitForOnline,
  validateRequired,
  validateNumber,
  safeAsync,
  AppError,
};

export default errorHandlingUtils;
