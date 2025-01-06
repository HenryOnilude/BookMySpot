'use client';

import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This ensures client-side navigation works properly
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return children;
}
