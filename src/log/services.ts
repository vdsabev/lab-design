import { queryService, getService } from '../firebase';
import { Log } from './index';

import { objectDictionaryToArray } from '../utils';

export const query = queryService<Log>(({ userId }) => `users/${userId}/logs`, objectDictionaryToArray);

export const get = getService<Log>(({ userId, logId }) => `users/${userId}/logs/${logId}`);
