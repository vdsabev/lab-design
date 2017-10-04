import { queryService, getService } from '../firebase';
import { objectDictionaryToArray } from '../utils';

import { Report } from './index';

export const ReportServices = {
  query: queryService<Report>(({ userId }) => `users/${userId}/reports`, objectDictionaryToArray),
  get: getService<Report>(({ userId, reportId }) => `users/${userId}/reports/${reportId}`)
};
