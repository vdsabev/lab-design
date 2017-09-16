import * as firebase from 'firebase/app';
import 'firebase/database';

import { toArray } from './utils';

export interface DataSnapshot<T> extends firebase.database.DataSnapshot {
  val(): T;
}

export function initializeFirebaseApp(options = {
  apiKey: process.env.GOOGLE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
}) {
  firebase.initializeApp(options);
}

type Params = Record<string, string>;

export const queryService = <T extends { id: string }>(getPath: (params: Params) => string) => async (params: Params): Promise<T[]> => {
  const snapshot: DataSnapshot<Record<string, T>> = await firebase.database().ref(getPath(params)).once('value');
  if (!(snapshot && snapshot.exists())) return null;
  return toArray(snapshot.val());
};

export const getService = <T extends { id: string }>(getPath: (params: Params) => string) => async (params: Params): Promise<T> => {
  const snapshot: DataSnapshot<T> = await firebase.database().ref(getPath(params)).once('value');
  if (!(snapshot && snapshot.exists())) return null;
  return { id: snapshot.key, ...<any>snapshot.val() };
};
