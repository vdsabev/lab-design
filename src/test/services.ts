import * as firebase from 'firebase/app';
import { Test } from './index';

export const get: (id: string) => Promise<Test> = async (id: string) => {
  const test = await firebase.database().ref(`tests/${id}`).once('value');
  return test ? { id, ...test.val() } : null;
};
