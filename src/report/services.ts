import { queryService, getService } from '../firebase';
import { Report } from './index';

import { objectDictionaryToArray } from '../utils';

export const query = queryService<Report>(({ userId }) => `users/${userId}/reports`, objectDictionaryToArray);

export const get = getService<Report>(({ userId, reportId }) => `users/${userId}/reports/${reportId}`);
