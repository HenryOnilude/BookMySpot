'use client';

import { useState } from 'react';
import { User, UserType } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Mail, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface UserListProps {
  users: User[];
  isLoading: boolean;
}

export function UserList({ users, isLoading }: UserListProps) {
  const { toast } = useToast();
  const [localUsers, setLocalUsers] = useState(users);

  const handleUpdateUserType = async (userId: string, newType: UserType) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: newType }),
      });

      if (!response.ok) throw new Error('Failed to update user');

      setLocalUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, type: newType } : user
        )
      );

      toast({
        title: 'Success',
        description: 'User type updated successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user type',
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

  if (!localUsers.length) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
        <p className="mt-1 text-sm text-gray-500">There are no users in the system.</p>
      </Card>
    );
  }

  const getUserTypeColor = (type: UserType) => {
    switch (type) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'OWNER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {localUsers.map((user) => (
        <Card key={user.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name}
                </h3>
                <Badge className={getUserTypeColor(user.type)}>
                  {user.type}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
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
                  onClick={() => handleUpdateUserType(user.id, 'USER')}
                  disabled={user.type === 'USER'}
                >
                  Set as User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateUserType(user.id, 'OWNER')}
                  disabled={user.type === 'OWNER'}
                >
                  Set as Owner
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateUserType(user.id, 'ADMIN')}
                  disabled={user.type === 'ADMIN'}
                >
                  Set as Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  );
}
