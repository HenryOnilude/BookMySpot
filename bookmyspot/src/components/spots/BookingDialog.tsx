'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Clock, Calendar, PoundSterling, Info } from 'lucide-react';
import PaymentForm from '@/components/payments/PaymentForm';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  spotId: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
}

const BookingDialog = ({
  isOpen,
  onClose,
  spotId,
  startTime,
  endTime,
  totalPrice,
}: BookingDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const handleProceedToPayment = async () => {
    if (status === 'loading') return;

    if (!session?.user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to book a parking spot',
        variant: 'warning',
        duration: 6000,
        onOpenChange: (open) => {
          if (!open) {
            router.push('/login');
          }
        }
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(data.error || 'This spot is already booked for the selected time period');
        }
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      toast({
        title: 'Booking Error',
        description: error instanceof Error ? error.message : 'Failed to initialize payment',
        variant: 'destructive',
        duration: 5000,
      });
      onClose(); // Close the dialog on conflict error
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return format(date, "dd/MM/yyyy, HH:mm");
  };

  const calculateDuration = () => {
    const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };

  if (clientSecret) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Complete Payment
            </DialogTitle>
          </DialogHeader>
          <PaymentForm
            clientSecret={clientSecret}
            onSuccess={() => {
              toast({
                title: 'Payment Successful',
                description: 'Your booking has been confirmed!',
                variant: 'success',
              });
              onClose();
              router.refresh();
            }}
            onError={(error) => {
              toast({
                title: 'Payment Failed',
                description: error.message,
                variant: 'destructive',
              });
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center pb-4 text-gray-900 dark:text-white">
            Confirm Booking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Details Section */}
          <div className="space-y-4 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-100 dark:border-slate-600">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Duration</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{calculateDuration()}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-500 dark:text-blue-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Start Time</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDateTime(startTime)}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">End Time</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDateTime(endTime)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <PoundSterling className="w-5 h-5 text-blue-500 dark:text-blue-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Price</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-300">£{totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg border border-blue-100 dark:border-blue-500/20">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 dark:text-blue-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Important Information</p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc list-inside mt-1 space-y-1">
                  <li>Please arrive on time for your booking</li>
                  <li>Cancellations are free up to 24 hours before</li>
                  <li>Your spot number will be provided after payment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between space-x-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-white dark:bg-transparent border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceedToPayment}
            disabled={isLoading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
