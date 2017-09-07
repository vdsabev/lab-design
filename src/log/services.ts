import * as firebase from 'firebase/app';
import { Log } from './index';

import { DataSnapshot } from '../firebase';

export const query = async (userId: string): Promise<Log[]> => {
  const snapshot: DataSnapshot<Record<string, Log>> = await firebase.database().ref(`logs/${userId}`).once('value');
  if (!snapshot) return null;
  const result = snapshot.val();
  return Object.keys(result).map((id) => ({ id, ...result[id] }));
};

export const get = async (userId: string, logId: string): Promise<Log> => {
  const snapshot: DataSnapshot<Log> = await firebase.database().ref(`logs/${userId}/${logId}`).once('value');
  return snapshot ? { id: logId, ...snapshot.val() } : null;
};
