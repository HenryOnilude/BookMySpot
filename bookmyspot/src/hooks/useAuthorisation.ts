// src/hooks/useAuthorisation.ts
import { useAuth } from './useAuth';

type UserType = 'DRIVER' | 'OWNER' | 'ADMIN';

export function useAuthorisation() {
  const { user } = useAuth();

  const isOwner = () => user?.type === 'OWNER';
  const isDriver = () => user?.type === 'DRIVER';
  const isAdmin = () => user?.type === 'ADMIN';
  
  const checkAccess = (allowedTypes: UserType[]) => {
    if (!user) return false;
    return allowedTypes.includes(user.type);
  };

  return {
    isOwner,
    isDriver,
    isAdmin,
    checkAccess,
    userType: user?.type
  };
}