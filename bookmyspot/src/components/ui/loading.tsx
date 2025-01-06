'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullHeight?: boolean;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  fullHeight = false,
  text
}: LoadingSpinnerProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[20rem] w-full',
      className
    )}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      <p className="mt-4 text-gray-600">{text || 'Loading...'}</p>
    </div>
  );
}
