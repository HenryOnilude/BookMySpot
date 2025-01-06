'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Calendar, Clock, CreditCard } from 'lucide-react';
import { DashboardComponentProps, DriverStats } from '@/types/dashboard';

const DriverDashboard: React.FC<DashboardComponentProps> = ({ user }) => {
  const [stats, setStats] = useState<DriverStats>({
    activeBookings: 0,
    totalBookings: 0,
    totalSpent: 0
  });

  useEffect(() => {
    // Fetch driver stats
    setStats({
      activeBookings: 1,
      totalBookings: 15,
      totalSpent: 450
    });
  }, []);

  return (
    <RoleGuard allowedRoles={['DRIVER']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || 'Driver'}</h1>
        <h2 className="text-2xl font-bold">Driver Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Bookings</p>
                <h3 className="text-2xl font-bold">{stats.activeBookings}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Bookings</p>
                <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Spent</p>
                <h3 className="text-2xl font-bold">£{stats.totalSpent}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Future bookings section could be added here */}
        <div className="mt-8">
          {/* Additional content like upcoming bookings list, etc. */}
        </div>
      </div>
    </RoleGuard>
  );
};

export default DriverDashboard;