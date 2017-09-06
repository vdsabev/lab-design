import * as firebase from 'firebase/app';
import { Report } from './index';

import { DataSnapshot } from '../firebase';

export const query: () => Promise<Report[]> = async () => {
  const reportsSnapshot: DataSnapshot<Record<string, Report>> = await firebase.database().ref(`reports`).once('value');
  if (!reportsSnapshot) return null;
  const reports = reportsSnapshot.val();
  return Object.keys(reports).map((id) => ({ id, ...reports[id] }));
};

export const get: (id: string) => Promise<Report> = async (id: string) => {
  const reportSnapshot: DataSnapshot<Report> = await firebase.database().ref(`reports/${id}`).once('value');
  return reportSnapshot ? { id, ...reportSnapshot.val() } : null;
};
