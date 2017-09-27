import { queryService } from '../firebase';
import { Timeline } from './timeline.viewmodel';

import { valueDictionaryToArray } from '../utils';

export const get = queryService<Timeline>(({ userId, indicatorId }) => `users/${userId}/timelines/${indicatorId}`, valueDictionaryToArray);
