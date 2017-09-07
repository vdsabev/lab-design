import * as firebase from 'firebase/app';
import { Report } from './index';

import { DataSnapshot } from '../firebase';

export const query: () => Promise<Report[]> = async () => {
  const snapshot: DataSnapshot<Record<string, Report>> = await firebase.database().ref(`reports`).once('value');
  if (!snapshot) return null;
  const result = snapshot.val();
  return Object.keys(result).map((id) => ({ id, ...result[id] }));
};

export const get: (id: string) => Promise<Report> = async (id: string) => {
  const snapshot: DataSnapshot<Report> = await firebase.database().ref(`reports/${id}`).once('value');
  return snapshot ? { id, ...snapshot.val() } : null;
};
