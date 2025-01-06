'use client';

import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
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
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
