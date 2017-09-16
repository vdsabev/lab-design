import { queryService, getService } from '../firebase';
import { Report } from './index';

export const query = queryService<Report>(({ userId }) => `users/${userId}/reports`);

export const get = getService<Report>(({ userId, reportId }) => `users/${userId}/reports/${reportId}`);
