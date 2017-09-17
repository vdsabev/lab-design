export * from './details';

import * as Services from './services';
export const ProfileServices = Services;

import { ValueIndicator } from '../indicator';

export interface Profile {
  id: string;
  name: string;
  imageUrl: string;
  gender: 'male' | 'female' | 'other';
  birthdate: number;
  indicators: Record<string, ValueIndicator>;
}
