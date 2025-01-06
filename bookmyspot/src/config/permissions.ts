// src/config/permissions.ts
import { UserType } from '@prisma/client';

export type Permission = 
  | 'view:dashboard'
  | 'manage:spots'
  | 'book:spots'
  | 'manage:users'
  | 'view:reports'
  | 'manage:bookings';

export const ROLE_PERMISSIONS: Record<UserType, Permission[]> = {
  ADMIN: [
    'view:dashboard',
    'manage:spots',
    'manage:users',
    'view:reports',
    'manage:bookings'
  ],
  OWNER: [
    'view:dashboard',
    'manage:spots',
    'view:reports',
  ],
  DRIVER: [
    'view:dashboard',
    'book:spots',
    'manage:bookings'
  ]
};

export const hasPermission = (userType: UserType, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userType]?.includes(permission) ?? false;
};

export const hasAnyPermission = (userType: UserType, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userType, permission));
};

export const hasAllPermissions = (userType: UserType, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userType, permission));
};