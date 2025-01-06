'use client';

import { useState } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { UserType } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';
import type { ToastProps } from '@/components/ui/toast';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  type: UserType;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthError {
  message: string;
  code?: string;
}

interface AuthResult {
  success: boolean;
  error?: AuthError;
}

interface UseAuthReturn {
  // User state
  user: AuthUser | undefined;
  isLoading: boolean;
  error: AuthError | null;
  
  // Authentication methods
  login: (credentials: Credentials) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  clearError: () => void;
}

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

interface ToastOptions {
  title: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastRef {
  readonly id: string;
  dismiss: () => void;
  update: (props: Partial<ToastOptions>) => void;
}

const TOAST_DURATION = {
  DEFAULT: 5000,
  LONG: 7000,
  SHORT: 3000,
  ERROR: 10000,
  INFINITE: Infinity
} as const;

const TOAST_VARIANT: Record<string, ToastVariant> = {
  SUCCESS: 'success',
  ERROR: 'destructive',
  DEFAULT: 'default',
  WARNING: 'warning'
} as const;

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const { toast } = useToast();

  const createToast = (options: ToastOptions): ToastRef => {
    const { title, description, variant = TOAST_VARIANT.DEFAULT, duration = TOAST_DURATION.DEFAULT } = options;

    const result = toast({
      title,
      description,
      variant,
      duration,
    });

    return {
      get id() { return result.id; },
      dismiss: result.dismiss,
      update: (props: Partial<ToastOptions>) => {
        result.update({
          id: result.id,
          title: props.title ?? title,
          description: props.description ?? description,
          variant: props.variant ?? variant,
          duration: props.duration ?? duration,
        });
      }
    };
  };

  const createLoadingToast = (title: string, description: string): ToastRef => {
    return createToast({
      title,
      description,
      variant: TOAST_VARIANT.DEFAULT,
      duration: TOAST_DURATION.INFINITE
    });
  };

  const createSuccessToast = (title: string, description: string): ToastRef => {
    return createToast({
      title,
      description,
      variant: TOAST_VARIANT.SUCCESS,
      duration: TOAST_DURATION.SHORT
    });
  };

  const createErrorToast = (title: string, description: string): ToastRef => {
    return createToast({
      title,
      description,
      variant: TOAST_VARIANT.ERROR,
      duration: TOAST_DURATION.ERROR
    });
  };

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
    if (isLoading) {
      return {
        success: false,
        error: { message: 'Login already in progress' }
      };
    }

    let toastRef: ToastRef | undefined;

    try {
      setIsLoading(true);
      setError(null);

      toastRef = createLoadingToast(
        "Signing in...",
        "Please wait while we log you in"
      );

      const result = await nextAuthSignIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      createSuccessToast(
        "Welcome back!",
        "Successfully signed in"
      );

      return { success: true };
    } catch (err) {
      const authError = handleAuthError(err);
      setError(authError);

      createErrorToast(
        "Sign In Error",
        authError.message
      );

      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
      toastRef?.dismiss();
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    if (isLoading) {
      return {
        success: false,
        error: { message: 'Sign out already in progress' }
      };
    }

    let toastRef: ToastRef | undefined;

    try {
      setIsLoading(true);
      setError(null);

      toastRef = createLoadingToast(
        "Signing out...",
        "Please wait while we log you out"
      );

      localStorage.removeItem('user-preferences');
      sessionStorage.clear();

      await nextAuthSignOut({ 
        redirect: false,
        callbackUrl: '/' 
      });

      createSuccessToast(
        "Goodbye!",
        "Successfully signed out"
      );

      window.location.href = '/';

      return { success: true };
    } catch (err) {
      const authError = handleAuthError(err);
      setError(authError);

      createErrorToast(
        "Sign Out Error",
        authError.message
      );

      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
      toastRef?.dismiss();
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || '',
      type: session.user.type
    } : undefined,
    isLoading,
    error,
    login,
    signOut,
    clearError,
  };
}
