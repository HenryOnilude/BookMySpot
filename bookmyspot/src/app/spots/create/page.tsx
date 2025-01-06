'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import SpotForm from '@/components/spots/SpotForm';
import type { SpotFormData } from '@/types';

export default function CreateSpotPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SpotFormData) => {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a spot',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create spot');
      }

      toast({
        title: 'Success',
        description: 'Your parking spot has been listed successfully',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create spot. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You must be logged in as an owner to list a parking spot.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">List Your Parking Spot</h1>
        <SpotForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </Card>
    </div>
  );
}
