import { getService } from '../firebase';
import { Profile } from './index';

export const getProfile = getService<Profile>(({ userId }) => `users/${userId}/profile`);
