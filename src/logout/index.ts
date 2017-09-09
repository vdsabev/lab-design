import * as firebase from 'firebase/app';
import { route } from 'mithril';

import * as notify from '../notify';

export const logout = () => firebase.auth().signOut().catch(notify.error).then(() => route.set('/login'));
