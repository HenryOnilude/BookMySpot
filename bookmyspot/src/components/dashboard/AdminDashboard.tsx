'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { 
  Users, 
  ParkingCircle, 
  CalendarCheck, 
  TrendingUp,
  Loader2 
} from 'lucide-react';
import { DashboardComponentProps, DashboardStats } from '@/types/dashboard';

const AdminDashboard: React.FC<DashboardComponentProps> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSpots: 0,
    activeBookings: 0,
    revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // In a real application, this would be an API call
        // Simulating API response for now
        setStats({
          totalUsers: 150,
          totalSpots: 45,
          activeBookings: 28,
          revenue: 15000
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome, {user.name}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                  <p className="text-xs text-gray-400 mt-1">Registered accounts</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <ParkingCircle className="h-6 w-6 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Spots</p>
                  <h3 className="text-2xl font-bold">{stats.totalSpots}</h3>
                  <p className="text-xs text-gray-400 mt-1">Available parking spaces</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <CalendarCheck className="h-6 w-6 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Active Bookings</p>
                  <h3 className="text-2xl font-bold">{stats.activeBookings}</h3>
                  <p className="text-xs text-gray-400 mt-1">Current reservations</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold">£{stats.revenue}</h3>
                  <p className="text-xs text-gray-400 mt-1">Platform earnings</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional admin sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Overview</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">System statistics and metrics will appear here</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Latest platform activities will be shown here</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default AdminDashboard;