'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession, signIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { User, UserType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import type { ToastProps } from '@/components/ui/toast';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  type: UserType;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthError {
  message: string;
}

interface AuthResult {
  success: boolean;
  error?: AuthError;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthState {
  loading: boolean;
  user: AuthUser | null;
  error: AuthError | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: Credentials) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  clearError: () => void;
}

interface SessionUser extends Omit<User, 'createdAt' | 'updatedAt'> {
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface ToastRef {
  readonly id: string;
  dismiss: () => void;
  update: (props: Partial<ToastProps>) => void;
}

const initialState: AuthState = {
  loading: true,
  user: null,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOAST_DURATION = {
  DEFAULT: 5000,
  LONG: 7000,
  SHORT: 3000,
  ERROR: 10000,
  INFINITE: Infinity
} as const;

const TOAST_VARIANT = {
  SUCCESS: 'success',
  ERROR: 'destructive',
  DEFAULT: 'default',
  WARNING: 'warning'
} as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Helper function to safely parse dates with validation
  const parseDateString = (dateStr?: string | Date): Date => {
    if (!dateStr) {
      return new Date();
    }
    if (dateStr instanceof Date) {
      return dateStr;
    }
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  // Helper function to create and track toast
  const createLoadingToast = (title: string, description: string): ToastRef => {
    const result = toast({
      title,
      description,
      variant: TOAST_VARIANT.DEFAULT,
      duration: TOAST_DURATION.INFINITE,
    });

    return {
      get id() { return result.id; },
      dismiss: result.dismiss,
      update: (props: Partial<ToastProps>) => {
        result.update({
          id: result.id,
          ...props,
        });
      }
    };
  };

  useEffect(() => {
    if (status === 'loading') {
      setState(prev => ({ ...prev, loading: true }));
      return;
    }

    if (!session?.user) {
      setState(prev => ({
        ...prev,
        loading: false,
        user: null,
        error: null
      }));
      return;
    }

    const user = session.user as SessionUser;
    setState(prev => ({
      ...prev,
      loading: false,
      user: {
        id: user.id,
        email: user.email || '',
        name: user.name || '',
        type: user.type,
        emailVerified: user.emailVerified ? parseDateString(user.emailVerified) : null,
        createdAt: parseDateString(user.createdAt),
        updatedAt: parseDateString(user.updatedAt)
      },
      error: null
    }));
  }, [session, status]);

  const handleAuthError = (error: unknown): AuthError => {
    if (error instanceof Error) {
      return { message: error.message };
    }
    if (typeof error === 'string') {
      return { message: error };
    }
    return { message: 'An unexpected error occurred' };
  };

  const login = async (credentials: Credentials): Promise<AuthResult> => {
    if (state.loading) {
      return {
        success: false,
        error: { message: 'Authentication in progress' }
      };
    }

    let loadingToast: ToastRef | undefined;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      loadingToast = createLoadingToast(
        "Signing in...",
        "Please wait while we log you in"
      );

      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
        variant: TOAST_VARIANT.SUCCESS,
        duration: TOAST_DURATION.DEFAULT,
      });

      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? { message: err.message } : { message: 'An unexpected error occurred' };
      
      setState(prev => ({ ...prev, error }));

      toast({
        title: "Sign In Error",
        description: error.message,
        variant: TOAST_VARIANT.ERROR,
        duration: TOAST_DURATION.ERROR,
      });

      return { success: false, error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
      loadingToast?.dismiss();
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    if (state.loading) {
      return {
        success: false,
        error: { message: 'Sign out in progress' }
      };
    }

    let loadingToast: ToastRef | undefined;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      loadingToast = createLoadingToast(
        "Signing out...",
        "Please wait while we log you out"
      );

      // Clear any stored data
      localStorage.removeItem('user-preferences');
      sessionStorage.clear();

      await nextAuthSignOut({
        redirect: false,
        callbackUrl: '/'
      });

      toast({
        title: "Goodbye!",
        description: "Successfully signed out",
        variant: TOAST_VARIANT.SUCCESS,
        duration: TOAST_DURATION.DEFAULT,
      });

      // Force reload to clear all state
      router.push('/');

      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? { message: err.message } : { message: 'An unexpected error occurred' };
      
      setState(prev => ({ ...prev, error }));

      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: TOAST_VARIANT.ERROR,
        duration: TOAST_DURATION.ERROR,
      });

      return { success: false, error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
      loadingToast?.dismiss();
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value = {
    ...state,
    login,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
