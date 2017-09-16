import { queryService, getService } from '../firebase';
import { Log } from './index';

export const query = queryService<Log>(({ userId }) => `users/${userId}/logs`);

export const get = getService<Log>(({ userId, logId }) => `users/${userId}/logs/${logId}`);
