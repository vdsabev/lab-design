import { TimelineChartSeries } from './chart.viewmodel';
import * as TimelineServices from './services';

import { Indicator, IndicatorServices } from '../indicator';
import * as notify from '../notify';
import { store } from '../store';

export interface Timeline {
  id: string;
  value: number;
}

export interface IndicatorWithTimeline extends Indicator {
  timeline?: Timeline[];
  timelineLoaded?: boolean;
}

export const TimelineViewModel = () => {
  let indicators: IndicatorWithTimeline[] = [];
  let selectedIndicators: IndicatorWithTimeline[] = [];
  let series: TimelineChartSeries[] = [];

  const loadIndicators = () => IndicatorServices.query().then((data) => indicators = data);

  const selectIndicator = async (selectedIndicatorId: string, checked: boolean) => {
    const selectedIndicator = indicators.find((indicator) => indicator.id === selectedIndicatorId);
    if (!selectedIndicator) throw new Error(`Invalid selected indicator: ${selectedIndicatorId}`);

    if (checked) {
      if (selectedIndicators.indexOf(selectedIndicator) === -1) {
        selectedIndicators = [...selectedIndicators, selectedIndicator];
        await loadTimelineForIndicators(selectedIndicators);
        series = indicatorsToSeries(selectedIndicators);
      }
    }
    else {
      if (selectedIndicators.indexOf(selectedIndicator) !== -1) {
        selectedIndicators = selectedIndicators.filter((indicator) => indicator !== selectedIndicator);
        series = indicatorsToSeries(selectedIndicators);
      }
    }
  };

  return {
    getIndicators: () => indicators,
    getSeries: () => series,
    loadIndicators,
    selectIndicator
  };
};

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
