import {
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  Loader2,
  type LucideIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  mapPin: MapPin,
  calendar: Calendar,
  creditCard: CreditCard,
  shield: Shield,
  spinner: Loader2,
} as const;
