import { queryService } from '../firebase';
import { valueDictionaryToArray } from '../utils';

import { Timeline } from './Timeline.ViewModel';

export const TimelineServices = {
  get: queryService<Timeline>(({ userId, indicatorId }) => `users/${userId}/timelines/${indicatorId}`, valueDictionaryToArray)
};
