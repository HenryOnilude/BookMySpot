'use client';

import { useState } from 'react';
import { Spot } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, MapPin, Banknote, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SpotListProps {
  spots: Spot[];
  isLoading: boolean;
}

export function SpotList({ spots, isLoading }: SpotListProps) {
  const { toast } = useToast();
  const [localSpots, setLocalSpots] = useState(spots);

  const handleUpdateSpotStatus = async (spotId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/spots/${spotId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update spot');

      setLocalSpots(prevSpots =>
        prevSpots.map(spot =>
          spot.id === spotId ? { ...spot, isActive } : spot
        )
      );

      toast({
        title: 'Success',
        description: `Spot ${isActive ? 'activated' : 'deactivated'} successfully`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update spot status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!localSpots.length) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">No parking spots found</h3>
        <p className="mt-1 text-sm text-gray-500">There are no parking spots in the system.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {localSpots.map((spot) => (
        <Card key={spot.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {spot.title}
                </h3>
                <Badge variant={spot.isActive ? 'default' : 'destructive'}>
                  {spot.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {spot.address}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Banknote className="h-4 w-4 mr-2" />
                  £{spot.pricePerHour}/hour
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  Owner ID: {spot.ownerId}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleUpdateSpotStatus(spot.id, true)}
                  disabled={spot.isActive}
                >
                  Activate Spot
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateSpotStatus(spot.id, false)}
                  disabled={!spot.isActive}
                >
                  Deactivate Spot
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  );
}
