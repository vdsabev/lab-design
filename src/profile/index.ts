export * from './details';

import * as Services from './services';
export const ProfileServices = Services;

export interface Profile {
  id: string;
  name: string;
  imageUrl: string;
  gender: 'male' | 'female' | 'other';
  birthdate: number | Object;
  indicators: Record<string, ProfileIndicator>;
}

interface ProfileIndicator {
  id: string;
  date: number | Object;
  value: number;
}
