import './style.scss';

import { div, label, input, svg, line, path, circle } from 'compote/html';
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
  strokeWidth: 1,
  radius: 2.5,
  viewBox: '',
  colors: ['red', 'green', 'blue', 'yellow', 'purple', 'brown'],
  defaultColor: 'black'
};

timelineOptions.viewBox = [
  -(timelineOptions.radius + timelineOptions.strokeWidth),
  timelineOptions.radius + timelineOptions.strokeWidth,
  timelineOptions.maxX + 2 * (timelineOptions.radius + timelineOptions.strokeWidth),
  timelineOptions.maxY + 2 * (timelineOptions.radius + timelineOptions.strokeWidth)
].join(' ');

export const Timeline: FactoryComponent<Attrs> = ({ attrs }) => {
  let indicators: IndicatorWithTimeline[] = [];
  let selectedIndicators: IndicatorWithTimeline[] = [];
  let minDate = 0;
  let maxDate = 0;

  IndicatorServices.query().then((data) => {
    indicators = data;
    redraw();
  });

  const selectIndicator = async (e: Event) => {
    const el = <HTMLInputElement>e.currentTarget;
    const indicatorId = el.value;
    const selectedIndicator = indicators.find((indicator) => indicator.id === indicatorId);
    if (!selectedIndicator) throw new Error(`Invalid indicator selected: ${indicatorId}`);

    if (el.checked) {
      if (selectedIndicators.indexOf(selectedIndicator) === -1) {
        selectedIndicators = [...selectedIndicators, selectedIndicator];
        await getTimeline();
        setMinMaxValues();
      }
    }
    else {
      if (selectedIndicators.indexOf(selectedIndicator) !== -1) {
        selectedIndicators = selectedIndicators.filter((indicator) => indicator !== selectedIndicator);
        setMinMaxValues();
      }
    }
  };

  const setMinMaxValues = () => {
    const selectedDates: number[] = selectedIndicators.reduce((dates, indicator) => {
      if (!indicator.timeline) return dates;
      return dates.concat(indicator.timeline.map((timeline) => parseInt(timeline.id, 10)));
    }, []);
    [minDate, maxDate] = [Math.min(...selectedDates), Math.max(...selectedDates)];
    redraw();
  };

  const getTimeline = (): Promise<void[]> => {
    const { currentUser } = store.getState();
    return Promise.all(selectedIndicators.map(async (indicator) => {
      if (indicator.timelineLoaded) return;

      indicator.timelineLoaded = true;
      try {
        indicator.timeline = await TimelineServices.get({ userId: currentUser.auth.uid, indicatorId: indicator.id });
      }
      catch (error) {
        indicator.timelineLoaded = false;
        notify.error(error);
      }
    }));
  };

  return {
    view: () => (
      div({ class: 'container' }, [
        SelectIndicators(indicators, selectIndicator),
        TimeLineChart(selectedIndicators, minDate, maxDate)
      ])
    )
  };
};

const SelectIndicators = (indicators: IndicatorWithTimeline[], selectIndicator: (e: Event) => void) => (
  div({ class: 'timeline-indicators width-100p height-xxl overflow-auto mb-md bg-neutral-lighter' },
    indicators.map((indicator) => (
      label({ class: 'block' }, [
        input({ type: 'checkbox', value: indicator.id, onchange: selectIndicator }),
        indicator.name
      ])
    ))
  )
);

const TimeLineChart = (indicators: IndicatorWithTimeline[], minX: number, maxX: number) => (
  // TODO: Type
  svg(<any>{ width: '100%', viewBox: timelineOptions.viewBox }, [
    line(<any>{ x1: 0, y1: '100%', x2: '100%', y2: '100%', stroke: 'black', 'stroke-width': timelineOptions.strokeWidth }),
    line(<any>{ x1: 0, y1: '100%', x2: 0, y2: 0, stroke: 'black', 'stroke-width': timelineOptions.strokeWidth }),
    indicators.map((indicator, indicatorIndex) =>
      indicator.timeline ? [
        path(<any>{
          fill: 'none',
          stroke: timelineOptions.defaultColor,
          'stroke-linejoin': 'round',
          'stroke-width': timelineOptions.strokeWidth,
          d: indicator.timeline.map((timeline, index) => {
            const prefix = index === 0 ? 'M' : 'L';
            return `${prefix}${timelineOptions.maxX * (minX - parseInt(timeline.id, 10)) / (minX - maxX)} ${timelineOptions.maxY * (indicator.reference.max - timeline.value) / (indicator.reference.max - indicator.reference.min)} `;
          }).join('')
        }),
        indicator.timeline.map((timeline) =>
          circle(<any>{
            fill: timelineOptions.colors[indicatorIndex] || timelineOptions.defaultColor,
            stroke: timelineOptions.defaultColor,
            'stroke-width': timelineOptions.strokeWidth,
            cx: timelineOptions.maxX * (minX - parseInt(timeline.id, 10)) / (minX - maxX),
            cy: timelineOptions.maxY * (indicator.reference.max - timeline.value) / (indicator.reference.max - indicator.reference.min),
            r: timelineOptions.radius
          })
        )
      ] : null
    )
  ])
);
