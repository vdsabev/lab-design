import { Indicator } from './index';

import { queryService, getService } from '../firebase';
import { objectDictionaryToArray } from '../utils';

export const IndicatorServices = {
  query: queryService<Indicator>(() => `indicators`, objectDictionaryToArray),
  get: getService<Indicator>(({ indicatorId }) => `indicators/${indicatorId}`)
};
