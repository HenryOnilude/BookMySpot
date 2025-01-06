// src/hooks/usePermissions.ts
'use client';

import { useAuth } from './useAuth';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from '@/config/permissions';

export function usePermissions() {
  const { user } = useAuth();

  return {
    can: (permission: Permission) => 
      user ? hasPermission(user.type, permission) : false,
    
    canAny: (permissions: Permission[]) => 
      user ? hasAnyPermission(user.type, permissions) : false,
    
    canAll: (permissions: Permission[]) => 
      user ? hasAllPermissions(user.type, permissions) : false,
  };
}