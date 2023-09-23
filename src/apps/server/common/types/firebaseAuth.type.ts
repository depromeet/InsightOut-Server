import type { FirebaseAuthError } from 'firebase-admin/lib/utils/error';

export const isFirebaseAuthError = (error: unknown): error is FirebaseAuthError => {
  return (error as FirebaseAuthError).code.startsWith('auth/');
};
