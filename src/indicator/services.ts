import * as firebase from 'firebase/app';

import { Indicator } from './index';
import { DataSnapshot } from '../firebase';

export const get = async (id: string): Promise<Indicator> => {
  const snapshot: DataSnapshot<Indicator> = await firebase.database().ref(`indicators/${id}`).once('value');
  return snapshot ? { id, ...snapshot.val() } : null;
};
