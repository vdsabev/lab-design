import * as firebase from 'firebase/app';
import { Report } from './index';

import { DataSnapshot } from '../firebase';

export const query = async (userId: string): Promise<Report[]> => {
  const snapshot: DataSnapshot<Record<string, Report>> = await firebase.database().ref(`reports/${userId}`).once('value');
  if (!snapshot) return null;
  const result = snapshot.val();
  return Object.keys(result).map((id) => ({ id, ...result[id] }));
};

export const get = async (userId: string, reportId: string): Promise<Report> => {
  const snapshot: DataSnapshot<Report> = await firebase.database().ref(`reports/${userId}/${reportId}`).once('value');
  return snapshot ? { id: reportId, ...snapshot.val() } : null;
};
