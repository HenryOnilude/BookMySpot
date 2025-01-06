'use client';

import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

interface ToastWrapperProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
  onDismiss?: () => void;
  children: React.ReactNode;
}

export function ToastWrapper({
  title,
  description,
  variant = 'default',
  duration = 5000,
  onDismiss,
  children
}: ToastWrapperProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (title || description) {
      toast({
        title,
        description,
        variant,
        duration,
        onOpenChange: (open) => {
          if (!open && onDismiss) {
            onDismiss();
          }
        }
      });
    }
  }, [title, description, variant, duration, onDismiss, toast]);

  return <>{children}</>;
}
