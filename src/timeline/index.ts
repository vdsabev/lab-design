import { div, pre, svg, line, circle } from 'compote/html';
import { FactoryComponent, redraw } from 'mithril';

import * as Services from './services';
export const TimelineServices = Services;

import { Indicator, IndicatorServices } from '../indicator';
import { store } from '../store';

export interface Timeline {
  id: string;
  value: number;
}

interface IndicatorWithTimeline extends Indicator {
  timeline: Timeline[];
}

// TODO: Allow user to select indicators from dropdown, then draw SVG timeline chart with data
// https://www.highcharts.com/demo/spline-irregular-time
interface Attrs extends Partial<HTMLDivElement> {
}

export const Timeline: FactoryComponent<Attrs> = ({ attrs }) => {
  const { currentUser } = store.getState();
  const indicatorId = 'thrombocytes';
  let timelines: Record<string, Partial<IndicatorWithTimeline>> = {
    [indicatorId]: {}
  };

  IndicatorServices.get({ indicatorId }).then((data) => timelines[indicatorId] = { ...timelines[indicatorId], ...data }).then(redraw);
  TimelineServices.get({ userId: currentUser.auth.uid, indicatorId }).then((data) => timelines[indicatorId].timeline = data).then(redraw);

  const radius = 5;

  return {
    view: () => (
      div({ class: 'container' }, [
        pre(JSON.stringify(timelines, null, 2)),
        svg(<any>{ width: '100%', viewBox: `${-radius} ${radius} 1000 500` }, [
          circle(<any>{ cx: 0, cy: '100%', fill: 'black', r: radius }),
          line(<any>{ x1: 0, y1: '100%', x2: '100%', y2: '100%', fill: 'black', style: { strokeWidth: '2px' } }),
          line(<any>{ x1: 0, y1: '100%', x2: 0, y2: 0, fill: 'black', style: { strokeWidth: '2px' } }),
          Object.keys(timelines).map((iid) =>
            timelines[iid].timeline ? timelines[iid].timeline.map((timeline, index) =>
              circle(<any>{ cx: (100 * index), cy: timeline.value, r: radius, fill: 'red' })
            ) : null
          )
        ])
      ])
    )
  };
};
