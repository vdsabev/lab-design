import './style.scss';

import { div, label, input } from 'compote/html';
import { FactoryComponent, redraw } from 'mithril';

import * as Services from './services';
export const TimelineServices = Services;

import { TimelineChartSeries, TimelineChart } from './chart';

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

export const Timeline: FactoryComponent<Attrs> = ({ attrs }) => {
  let indicators: IndicatorWithTimeline[] = [];
  let selectedIndicators: IndicatorWithTimeline[] = [];
  let series: TimelineChartSeries[] = [];

  IndicatorServices.query().then((data) => {
    indicators = data;
    redraw();
  });

  const indicatorChanged = (e: Event) => {
    const el = <HTMLInputElement>e.currentTarget;
    const indicatorId = el.value;
    const selectedIndicator = indicators.find((indicator) => indicator.id === indicatorId);
    if (!selectedIndicator) throw new Error(`Invalid indicator selected: ${indicatorId}`);

    selectIndicator(selectedIndicator, el.checked);
  };

  const selectIndicator = async (indicator: IndicatorWithTimeline, checked: boolean) => {
    if (checked) {
      if (selectedIndicators.indexOf(indicator) === -1) {
        selectedIndicators = [...selectedIndicators, indicator];
        await loadTimelineForIndicators(selectedIndicators);
        series = indicatorsToSeries(selectedIndicators);
        redraw();
      }
    }
    else {
      if (selectedIndicators.indexOf(indicator) !== -1) {
        selectedIndicators = selectedIndicators.filter((selectedIndicator) => selectedIndicator !== indicator);
        series = indicatorsToSeries(selectedIndicators);
        redraw();
      }
    }
  };

  return {
    view: () => (
      div({ class: 'container' }, [
        SelectIndicators(indicators, indicatorChanged),
        TimelineChart(series)
      ])
    )
  };
};

const SelectIndicators = (indicators: IndicatorWithTimeline[], indicatorChanged: (e: Event) => any) => (
  div({ class: 'timeline-indicators width-100p height-xxl overflow-auto mb-md bg-neutral-lighter' },
    indicators.map((indicator) => (
      label({ class: 'block' }, [
        input({ type: 'checkbox', value: indicator.id, onchange: indicatorChanged }),
        indicator.name
      ])
    ))
  )
);

const loadTimelineForIndicators = (indicators: IndicatorWithTimeline[]): Promise<any[]> => {
  const { currentUser } = store.getState();
  return Promise.all(indicators.map(async (indicator) => {
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

const indicatorsToSeries = (indicators: IndicatorWithTimeline[]) => {
  const dates: number[] = indicators.reduce((result, indicator) => {
    if (!indicator.timeline) return result;
    return result.concat(indicator.timeline.map((timeline) => parseInt(timeline.id, 10)));
  }, []);
  const [xMin, xMax] = [Math.min(...dates), Math.max(...dates)];

  return indicators.map((indicator) => ({
    values: indicator.timeline.map((timeline) => ({
      x: (xMin - parseInt(timeline.id, 10)) / (xMin - xMax),
      y: (indicator.reference.max - timeline.value) / (indicator.reference.max - indicator.reference.min)
    }))
  }));
};
