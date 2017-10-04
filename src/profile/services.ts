import { getService } from '../firebase';
import { Profile } from './index';

export const ProfileServices = {
  getProfile: getService<Profile>(({ userId }) => `users/${userId}/profile`)
};
