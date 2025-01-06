'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { AuthProvider } from '@/contexts/auth';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

// Separate client component for error handling
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="rounded-lg bg-red-50 p-6 text-center max-w-md w-full">
        <h2 className="mb-2 text-xl font-bold text-red-600">Something went wrong</h2>
        <p className="text-sm text-red-500 mb-4">{error.message}</p>
        <Button
          variant="destructive"
          onClick={resetErrorBoundary}
          className="px-4 py-2 text-sm"
        >
          Try again
        </Button>
      </div>
    </div>
  );
};

export function Providers({ children, session }: ProvidersProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider session={session}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SessionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
