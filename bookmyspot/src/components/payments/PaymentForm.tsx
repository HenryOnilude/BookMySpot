'use client';

import { useEffect, useState } from 'react';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import type {
  Stripe as StripeType,
  StripeElementsOptions,
  PaymentIntent,
  StripePaymentElementOptions,
  StripeError,
  PaymentIntentResult,
} from '@stripe/stripe-js';
import { getStripe } from '@/lib/payment-client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Type definition for supported countries
const SUPPORTED_COUNTRIES = ['GB', 'US', 'CA', 'AU', 'NZ'] as const;
type SupportedCountry = typeof SUPPORTED_COUNTRIES[number];

// Interface definitions for field validation
interface BaseFieldValidation {
  required: boolean;
  minLength?: number;
  pattern?: RegExp;
}

interface PhoneValidation extends BaseFieldValidation {
  formats: Record<SupportedCountry, string>;
}

interface FieldValidations {
  name: BaseFieldValidation;
  email: BaseFieldValidation;
  phone: PhoneValidation;
}

// Field validation configuration
const FIELD_VALIDATION: FieldValidations = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: false,
    pattern: /^\+?[1-9]\d{1,14}$/,
    formats: {
      GB: '+44 xxxx xxxxxx',
      US: '+1 (xxx) xxx-xxxx',
      CA: '+1 (xxx) xxx-xxxx',
      AU: '+61 xxx xxx xxx',
      NZ: '+64 xx xxx xxxx',
    },
  },
};

// Stripe Payment Element configuration with proper typing
// Configuration for Stripe Payment Element
const PAYMENT_ELEMENT_OPTIONS: StripePaymentElementOptions = {
  layout: 'tabs',
  defaultValues: {
    billingDetails: {
      name: '',
      email: '',
      phone: '',
    }
  },
  wallets: {
    applePay: 'auto',
    googlePay: 'auto',
  },
};

// Constants for messages
const ERROR_MESSAGES = {
  NOT_READY: 'Please wait while we initialize the payment system.',
  PAYMENT_FAILED: 'Unable to process your payment. Please check your card details and try again.',
  PAYMENT_INTENT_NOT_FOUND: 'Payment session expired. Please refresh and try again.',
  GENERAL_ERROR: 'Something went wrong. Please try again or contact support.',
  PROCESSING_ERROR: 'Error processing payment. Please try again.',
  VALIDATION_ERROR: 'Please fill in all required fields correctly.',
  NETWORK_ERROR: 'Connection lost. Please check your internet and try again.',
  CARD_ERROR: 'Your card was declined. Please try another card.',
} as const;

const SUCCESS_MESSAGES = {
  PAYMENT_SUCCESSFUL: 'Your payment was successful! A confirmation email is on its way.',
  PAYMENT_PROCESSING: 'Please wait while we process your payment...',
  PAYMENT_CONFIRMED: 'Payment confirmed! Thank you for your purchase.',
} as const;

// Toast duration configuration
const TOAST_DURATION = {
  DEFAULT: 5000,
  LOADING: undefined,
  ERROR: 10000,
  SUCCESS: 7000,
} as const;

// Interface definitions for component props and state
interface PaymentFormProps {
  clientSecret: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  returnUrl?: string;
}

interface PaymentError {
  message: string;
  type?: string;
  code?: string;
}

interface ToastRef {
  id: string;
  dismiss: () => void;
}

// Main Payment Form Content Component
function PaymentFormContent({
  clientSecret,
  onSuccess,
  onError,
  returnUrl,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [error, setError] = useState<PaymentError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastRef, setToastRef] = useState<ToastRef | null>(null);

  // Cleanup toasts on unmount
  useEffect(() => {
    return () => {
      if (toastRef) {
        toastRef.dismiss();
      }
    };
  }, [toastRef]);

  // Error handler function
  const handleError = (err: unknown): PaymentError => {
    console.error('Payment error:', err);
    
    if (typeof err === 'object' && err !== null && 'type' in err) {
      const stripeError = err as StripeError;
      return {
        message: stripeError.message || ERROR_MESSAGES.GENERAL_ERROR,
        type: stripeError.type,
        code: stripeError.code,
      };
    }
    
    if (err instanceof Error) {
      return {
        message: err.message,
        type: 'error',
        code: 'unknown_error',
      };
    }
    
    return {
      message: ERROR_MESSAGES.GENERAL_ERROR,
      type: 'error',
      code: 'unknown_error',
    };
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError({
        message: ERROR_MESSAGES.NOT_READY,
        type: 'validation_error',
        code: 'stripe_not_ready'
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast({
      title: "Processing Payment",
      description: (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="font-medium text-blue-600">
            {SUCCESS_MESSAGES.PAYMENT_PROCESSING}
          </span>
        </div>
      ),
      duration: TOAST_DURATION.LOADING,
    });

    setToastRef({ id: loadingToast.id, dismiss: loadingToast.dismiss });

    try {
      setIsLoading(true);
      setError(null);

      // Validate the payment element
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/payment/confirmation`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw confirmError;
      }

      // Handle successful payment
      if (paymentIntent?.status === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: (
            <div className="flex flex-col gap-2">
              <p className="text-green-600 font-medium">
                {SUCCESS_MESSAGES.PAYMENT_CONFIRMED}
              </p>
              <p className="text-sm text-muted-foreground">
                Transaction ID: {paymentIntent.id}
              </p>
            </div>
          ),
          duration: TOAST_DURATION.SUCCESS,
        });
        onSuccess?.();
      }
    } catch (err) {
      const paymentError = handleError(err);
      setError(paymentError);
      onError?.(err instanceof Error ? err : new Error(paymentError.message));
      
      // Show error toast
      toast({
        title: "Payment Failed",
        description: (
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 text-red-600">
              <span className="text-red-500 mt-0.5">✕</span>
              <div className="flex-1">
                <p className="text-red-600 font-medium">
                  {paymentError.type === 'card_error'
                    ? ERROR_MESSAGES.CARD_ERROR
                    : ERROR_MESSAGES.PAYMENT_FAILED}
                </p>
                <p className="text-red-500">
                  {paymentError.message}
                </p>
                {paymentError.code && (
                  <p className="text-xs text-red-400 mt-1">
                    Error code: {paymentError.code}
                  </p>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1.5">
              {paymentError.type && (
                <p>Type: <span className="font-medium">{paymentError.type}</span></p>
              )}
              {paymentError.code && (
                <p>Code: <span className="font-mono text-xs">{paymentError.code}</span></p>
              )}
              {paymentError.message && (
                <p>Details: <span className="text-slate-700">{paymentError.message}</span></p>
              )}
            </div>
            {paymentError.type !== 'validation_error' && (
              <div className="flex items-center gap-2 mt-2 text-sm border-t pt-2 border-slate-200">
                <span className="h-4 w-4 text-blue-600">ℹ</span>
                <span>Need help? <button
                  type="button"
                  className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                  onClick={() => window.location.href = '/support'}
                >
                  Contact support
                </button></span>
              </div>
            )}
          </div>
        ),
        variant: "destructive",
        duration: TOAST_DURATION.ERROR,
      });
    } finally {
      setIsLoading(false);
      if (toastRef) {
        toastRef.dismiss();
        setToastRef(null);
      }
    }
  };

  // Payment element change handler
  const handleElementChange = (event: any) => {
    if (event.error) {
      setError({
        message: event.error.message || 'An error occurred',
        type: event.error.type || 'validation_error',
        code: event.error.code || 'unknown',
      });
    } else {
      setError(null);
    }
  };

  // Loading state renderer
  if (!stripe || !elements) {
    return (
      <div className="flex justify-center items-center min-h-[200px] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Initializing payment system...
          </p>
        </div>
      </div>
    );
  }

  // Main form renderer
  return (
    <Card className="w-full max-w-lg p-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="payment-element" className="block text-sm font-medium text-gray-700">
            Card details
          </label>
          <div
            id="payment-element"
            className="p-3 border rounded-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500"
          >
            <PaymentElement
              options={PAYMENT_ELEMENT_OPTIONS}
              onChange={handleElementChange}
              className="w-full"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600" role="alert">
              {error.message}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!stripe || !elements || isLoading || Boolean(error)}
          className={cn(
            "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm",
            "text-sm font-medium text-white bg-blue-600 hover:bg-blue-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            error ? "bg-red-500 hover:bg-red-600" : "",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </span>
          ) : error?.type === 'validation_error' ? (
            'Fix errors to continue'
          ) : (
            'Pay now'
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
          <span className="h-4 w-4">🔒</span>
          Secure payment powered by Stripe
        </p>
      </form>
    </Card>
  );
}

// Wrapper component that provides Stripe Elements context
export default function PaymentForm(props: PaymentFormProps) {
  const stripePromise = getStripe();
  const options: StripeElementsOptions = {
    clientSecret: props.clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
      variables: {
        colorPrimary: '#0F172A',
        colorBackground: '#ffffff',
        colorText: '#1e293b',
        colorDanger: '#ef4444',
        colorTextSecondary: '#64748b',
        colorBackgroundText: '#f8fafc',
        fontFamily: '-apple-system, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px',
        fontSizeBase: '14px',
        fontWeightNormal: '400',
        fontWeightMedium: '500',
      },
      rules: {
        '.Input': {
          borderWidth: '1px',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          transition: 'all 0.15s ease'
        },
        '.Input:hover': {
          borderColor: '#94a3b8',
          transform: 'translateY(-1px)'
        },
        '.Input:focus': {
          borderColor: '#0F172A',
          boxShadow: '0 0 0 1px #0F172A, 0 2px 4px 0 rgb(0 0 0 / 0.05)'
        },
        '.Input--invalid': {
          borderColor: '#ef4444',
          boxShadow: '0 0 0 1px #ef4444'
        },
        '.Label': {
          fontWeight: '500',
          color: '#64748b'
        },
        '.Label--floating': {
          transform: 'scale(0.85) translateY(-0.5rem)'
        }
      }
    }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent {...props} />
    </Elements>
  );
}