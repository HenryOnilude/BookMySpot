'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { UserList } from '@/components/admin/UserList';
import { SpotList } from '@/components/admin/SpotList';
import { User, Spot } from '@prisma/client';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch users and spots data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, spotsResponse] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/spots')
        ]);

        const [usersData, spotsData] = await Promise.all([
          usersResponse.json(),
          spotsResponse.json()
        ]);

        setUsers(usersData);
        setSpots(spotsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Only allow ADMIN users
  if (user?.type !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-600">You do not have permission to access this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-24 min-h-screen mb-20">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users and parking spots</p>
        </header>

        <Tabs defaultValue="users" className="mb-16">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="spots">Parking Spots</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <UserList users={users} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="spots" className="mt-6">
            <SpotList spots={spots} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  );
}
