'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  Auth,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase';
import { emailSchema, passwordSchema } from '@/utils/security';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  scansRemaining: number;
  scansThisMonth: number;
  createdAt: Date;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      // Firebase not initialized (missing config)
      setState({ user: null, loading: false, error: null });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setState((prev) => ({ ...prev, user, loading: false }));

      if (user) {
        const db = getFirebaseDb();
        if (db) {
          // Fetch user profile from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as UserProfile);
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();

      if (!auth || !db) {
        return { success: false, error: 'Firebase not configured' };
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Validate inputs
        const validatedEmail = emailSchema.parse(email);
        passwordSchema.parse(password);

        // Create user
        const { user } = await createUserWithEmailAndPassword(auth, validatedEmail, password);

        // Update profile with display name
        if (displayName) {
          await updateProfile(user, { displayName });
        }

        // Send email verification
        await sendEmailVerification(user);

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: validatedEmail,
          displayName: displayName || null,
          plan: 'free',
          scansRemaining: 3, // Free tier: 3 scans per month
          scansThisMonth: 0,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });

        setState((prev) => ({ ...prev, loading: false }));
        return { success: true, user };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Sign up failed';
        setState((prev) => ({ ...prev, loading: false, error: message }));
        return { success: false, error: message };
      }
    },
    []
  );

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();

    if (!auth) {
      return { success: false, error: 'Firebase not configured' };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Validate email format
      const validatedEmail = emailSchema.parse(email);

      const { user } = await signInWithEmailAndPassword(auth, validatedEmail, password);

      // Update last login
      if (db) {
        await setDoc(
          doc(db, 'users', user.uid),
          { lastLoginAt: serverTimestamp() },
          { merge: true }
        );
      }

      setState((prev) => ({ ...prev, loading: false }));
      return { success: true, user };
    } catch (err: unknown) {
      let message = 'Sign in failed';
      if (err instanceof Error) {
        // Map Firebase error codes to user-friendly messages
        if (err.message.includes('auth/invalid-credential')) {
          message = 'Invalid email or password';
        } else if (err.message.includes('auth/too-many-requests')) {
          message = 'Too many failed attempts. Please try again later.';
        } else if (err.message.includes('auth/user-disabled')) {
          message = 'This account has been disabled';
        } else {
          message = err.message;
        }
      }
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();

    if (!auth) {
      return { success: false, error: 'Firebase not configured' };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await firebaseSignOut(auth);
      setState({ user: null, loading: false, error: null });
      setUserProfile(null);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    const auth = getFirebaseAuth();

    if (!auth) {
      return { success: false, error: 'Firebase not configured' };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const validatedEmail = emailSchema.parse(email);
      await sendPasswordResetEmail(auth, validatedEmail);
      setState((prev) => ({ ...prev, loading: false }));
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    user: state.user,
    userProfile,
    loading: state.loading,
    error: state.error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
    isAuthenticated: !!state.user,
    isEmailVerified: state.user?.emailVerified ?? false,
  };
}
