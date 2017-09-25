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
  strokeWidth: 2,
  strokeOpacity: 0.8,
  radius: 2.5,
  viewBox: '',
  colors: ['red', 'green', 'blue', 'yellow', 'purple', 'brown'],
  defaultColor: 'black'
};

timelineOptions.viewBox = [
  -timelineOptions.radius,
  timelineOptions.radius,
  timelineOptions.maxX + 2 * timelineOptions.radius,
  timelineOptions.maxY + 2 * timelineOptions.radius
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
        TimelineChart(selectedIndicators, minDate, maxDate)
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

const TimelineChart = (indicators: IndicatorWithTimeline[], minX: number, maxX: number) => (
  // TODO: Type
  svg(<any>{ width: '100%', viewBox: timelineOptions.viewBox, style: { shapeRendering: 'crispedges' } }, [
    line(<any>{ x1: 0, y1: '100%', x2: '100%', y2: '100%', style: { stroke: 'black', strokeWidth: `${timelineOptions.strokeWidth}px` } }),
    line(<any>{ x1: 0, y1: '100%', x2: 0, y2: 0, style: { stroke: 'black', strokeWidth: `${timelineOptions.strokeWidth}px` } }),
    indicators.map((indicator, indicatorIndex) =>
      indicator.timeline ? [
        path(<any>{
          fill: 'none',
          style: {
            stroke: timelineOptions.colors[indicatorIndex] || timelineOptions.defaultColor,
            strokeOpacity: timelineOptions.strokeOpacity,
            shapeRendering: 'auto',
            strokeLinejoin: 'round',
            strokeWidth: `${timelineOptions.strokeWidth}px`
          },
          d: indicator.timeline.map((timeline, timelineIndex) => {
            const prefix = timelineIndex === 0 ? 'M' : 'L';
            return `${prefix}${timelineOptions.maxX * (minX - parseInt(timeline.id, 10)) / (minX - maxX)} ${timelineOptions.maxY * (indicator.reference.max - timeline.value) / (indicator.reference.max - indicator.reference.min)} `;
          }).join('')
        }),
        indicator.timeline.map((timeline) =>
          circle(<any>{
            fill: timelineOptions.colors[indicatorIndex] || timelineOptions.defaultColor,
            cx: timelineOptions.maxX * (minX - parseInt(timeline.id, 10)) / (minX - maxX),
            cy: timelineOptions.maxY * (indicator.reference.max - timeline.value) / (indicator.reference.max - indicator.reference.min),
            r: timelineOptions.radius
          })
        )
      ] : null
    )
  ])
);
