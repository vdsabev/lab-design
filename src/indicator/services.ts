import { queryService, getService } from '../firebase';
import { Indicator } from './index';

import { objectDictionaryToArray } from '../utils';

export const query = queryService<Indicator>(() => `indicators`, objectDictionaryToArray);

export const get = getService<Indicator>(({ indicatorId }) => `indicators/${indicatorId}`);
