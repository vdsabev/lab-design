export * from './ProfileDetails';
export * from './services';

import { ValueIndicator } from '../indicator';

export interface Profile {
  id: string;
  name: string;
  imageUrl: string;
  gender: 'male' | 'female' | 'other';
  birthdate: number;
  indicators: Record<string, ValueIndicator>;
}
