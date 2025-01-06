'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { 
  CircleDot as ParkingCircle, 
  CalendarCheck, 
  DollarSign,
  Loader2
} from 'lucide-react';
import { DashboardComponentProps, OwnerStats } from '@/types/dashboard';

const OwnerDashboard: React.FC<DashboardComponentProps> = ({ user }) => {
  const [stats, setStats] = useState<OwnerStats>({
    totalSpots: 0,
    activeBookings: 0,
    earnings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerStats = async () => {
      try {
        // In a real application, this would be an API call
        // For now, we'll simulate an API response
        setStats({
          totalSpots: 5,
          activeBookings: 3,
          earnings: 1200
        });
      } catch (error) {
        console.error('Failed to fetch owner stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnerStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['OWNER']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Owner Dashboard</h2>
          <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center">
              <ParkingCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Your Spots</p>
                <h3 className="text-2xl font-bold">{stats.totalSpots}</h3>
                <p className="text-xs text-gray-400 mt-1">Total parking spaces</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <CalendarCheck className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Bookings</p>
                <h3 className="text-2xl font-bold">{stats.activeBookings}</h3>
                <p className="text-xs text-gray-400 mt-1">Currently occupied spots</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Earnings</p>
                <h3 className="text-2xl font-bold">£{stats.earnings}</h3>
                <p className="text-xs text-gray-400 mt-1">Revenue this month</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional sections can be added here */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Recent bookings and updates will appear here</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Quick access to common actions will appear here</p>
            </div>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
};

export default OwnerDashboard;