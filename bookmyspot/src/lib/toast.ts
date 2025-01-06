import { toast } from '@/components/ui/use-toast';

interface ToastOptions {
  duration?: number;
  onDismiss?: () => void;
}

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast({
      title: 'Success',
      description: message,
      variant: 'success',
      duration: options?.duration || 4000,
      onDismiss: options?.onDismiss,
    });
  },
  error: (message: string, options?: ToastOptions) => {
    return toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
      duration: options?.duration || 4000,
      onDismiss: options?.onDismiss,
    });
  },
  loading: (message: string, options?: ToastOptions) => {
    return toast({
      title: 'Loading',
      description: message,
      duration: options?.duration || 4000,
      onDismiss: options?.onDismiss,
    });
  },
  dismiss: () => {
    // Note: With Radix UI toast system, we don't need to manually dismiss
    // as it handles auto-dismissal based on duration
  }
};
