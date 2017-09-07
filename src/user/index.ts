import { User as FirebaseUser } from 'firebase/app';

import * as Services from './services';
export const UserServices = Services;

export interface CurrentUser {
  auth: FirebaseUser;
  profile: UserProfile;
}

export interface UserProfile {
  id: string;
  name: string;
  imageUrl: string;
  gender: 'male' | 'female' | 'other';
  birthdate: number | Object;
}

export const isLoggedIn = (currentUser: CurrentUser) => currentUser != null && currentUser.auth != null;
