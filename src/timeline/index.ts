import './style.scss';

import { div, label, input, svg, circle, line } from 'compote/html';
import { FactoryComponent, redraw } from 'mithril';

import * as Services from './services';
export const TimelineServices = Services;

import { Indicator, IndicatorServices } from '../indicator';
import * as notify from '../notify';
import { store } from '../store';

export interface Timeline {
  id: string;
  value: number;
}

interface IndicatorWithTimeline extends Indicator {
  timeline?: Timeline[];
  timelineLoaded?: boolean;
}

interface Attrs extends Partial<HTMLDivElement> {
}

const timelineOptions = {
  maxX: 1000,
  maxY: 500,
  radius: 2.5,
  colors: ['red', 'green', 'blue', 'yellow'],
  defaultColor: 'black'
};

export const Timeline: FactoryComponent<Attrs> = ({ attrs }) => {
  let indicators: IndicatorWithTimeline[] = [];
  let selectedIndicators: IndicatorWithTimeline[] = [];

  IndicatorServices.query().then((data) => {
    indicators = data;
    redraw();
  });

  const selectIndicator = (e: Event) => {
    const el = <HTMLInputElement>e.currentTarget;
    const indicatorId = el.value;
    const selectedIndicator = indicators.find((indicator) => indicator.id === indicatorId);
    if (!selectedIndicator) throw new Error(`Invalid indicator selected: ${indicatorId}`);

    if (el.checked) {
      if (selectedIndicators.indexOf(selectedIndicator) === -1) {
        selectedIndicators = [...selectedIndicators, selectedIndicator];
        getTimeline();
      }
    }
    else {
      if (selectedIndicators.indexOf(selectedIndicator) !== -1) {
        selectedIndicators = selectedIndicators.filter((indicator) => indicator !== selectedIndicator);
      }
    }
  };

  const getTimeline = () => {
    const { currentUser } = store.getState();
    selectedIndicators.forEach(async (indicator) => {
      if (indicator.timelineLoaded) return;

      indicator.timelineLoaded = true;
      try {
        indicator.timeline = await TimelineServices.get({ userId: currentUser.auth.uid, indicatorId: indicator.id })
        redraw();
      }
      catch (error) {
        indicator.timelineLoaded = false;
        notify.error(error);
      }
    });
  };

  return {
    view: () => (
      div({ class: 'container' }, [
        div({ class: 'timeline-indicators width-100p height-xxl overflow-auto mb-md bg-neutral-lighter' },
          indicators.map((indicator) => (
            label({ class: 'block' }, [
              input({ type: 'checkbox', value: indicator.id, onchange: selectIndicator }),
              indicator.name
            ])
          ))
        ),

        svg(<any>{ width: '100%', viewBox: `0 0 ${timelineOptions.maxX} ${timelineOptions.maxY}` }, [
          line(<any>{ x1: 0, y1: '100%', x2: '100%', y2: '100%', stroke: 'black', style: { strokeWidth: 1 } }),
          line(<any>{ x1: 0, y1: '100%', x2: 0, y2: 0, stroke: 'black', style: { strokeWidth: 1 } }),
          selectedIndicators.map((indicator, indicatorIndex) =>
            indicator.timeline ? indicator.timeline.map((timeline, timelineIndex) =>
              circle(<any>{
                cx: (100 * timelineIndex),
                cy: timelineOptions.maxY - timeline.value,
                r: timelineOptions.radius,
                fill: timelineOptions.colors[indicatorIndex] || timelineOptions.defaultColor
              })
            ) : null
          )
        ])
      ])
    )
  };
};
