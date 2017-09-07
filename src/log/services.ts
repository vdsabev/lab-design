import * as firebase from 'firebase/app';
import { Log } from './index';

import { DataSnapshot } from '../firebase';

export const query: () => Promise<Log[]> = async () => {
  const snapshot: DataSnapshot<Record<string, Log>> = await firebase.database().ref(`logs`).once('value');
  if (!snapshot) return null;
  const result = snapshot.val();
  return Object.keys(result).map((id) => ({ id, ...result[id] }));
};

export const get: (id: string) => Promise<Log> = async (id: string) => {
  const snapshot: DataSnapshot<Log> = await firebase.database().ref(`logs/${id}`).once('value');
  return snapshot ? { id, ...snapshot.val() } : null;
};
