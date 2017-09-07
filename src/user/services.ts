import * as firebase from 'firebase/app';
import { UserProfile } from './index';

export const getProfile = async (id: string): Promise<UserProfile> => {
  const profile = await firebase.database().ref(`users/${id}`).once('value');
  if (!(profile && profile.exists())) return null;

  return { id: profile.key, ...profile.val() };
};
