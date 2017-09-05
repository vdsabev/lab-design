import * as firebase from 'firebase/app';
import { Report } from './index';

export const get: (id: string) => Promise<Report> = async (id: string) => {
  const report = await firebase.database().ref(`reports/${id}`).once('value');
  return report ? { id, ...report.val() } : null;
};
