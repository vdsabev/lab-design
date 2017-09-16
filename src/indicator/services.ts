import { queryService, getService } from '../firebase';
import { Indicator } from './index';

export const query = queryService<Indicator>(() => `indicators`);

export const get = getService<Indicator>(({ indicatorId }) => `indicators/${indicatorId}`);
