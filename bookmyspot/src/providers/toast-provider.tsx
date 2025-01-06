'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as UIToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function ToastProvider() {
  const { toasts } = useToast();

  return (
    <UIToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className="fixed bottom-0 right-0 z-50 flex flex-col items-end m-4 space-y-4" />
    </UIToastProvider>
  );
}
