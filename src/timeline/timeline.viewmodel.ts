import { Indicator, IndicatorServices } from '../indicator';
import * as notify from '../notify';
import { store } from '../store';

import { TimelineServices } from './index';
import { TimelineChartSeries } from './TimelineChart';

export interface Timeline {
  id: string;
  value: number;
}

export interface IndicatorWithTimeline extends Indicator {
  timeline?: Timeline[];
  timelineLoaded?: boolean;
}

export class TimelineViewModel {
  private static loadTimelineForIndicators(indicators: IndicatorWithTimeline[]): Promise<any[]> {
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
  }

  private static indicatorsToSeries(indicators: IndicatorWithTimeline[]) {
    const dates: number[] = indicators.reduce((result, indicator) => {
      if (!indicator.timeline) return result;
      return result.concat(indicator.timeline.map((timeline) => parseInt(timeline.id, 10)));
    }, []);
    const [xMin, xMax] = [Math.min(...dates), Math.max(...dates)];

    return indicators.map((indicator) => ({
      values: indicator.timeline.map((timeline) => ({
        x: (xMin - parseInt(timeline.id, 10)) / (xMin - xMax),
        y: (indicator.reference.max - timeline.value) / (indicator.reference.max - indicator.reference.min),
        label: `${timeline.value} ${indicator.unit}`
      })),
      label: indicator.name
    }));
  }

  private selectedIndicators: IndicatorWithTimeline[] = [];

  indicators: IndicatorWithTimeline[] = [];
  series: TimelineChartSeries[] = [];

  loadIndicators() {
    return IndicatorServices.query().then((data) => this.indicators = data);
  }

  async selectIndicator(selectedIndicatorId: string, checked: boolean) {
    const selectedIndicator = this.indicators.find((indicator) => indicator.id === selectedIndicatorId);
    if (!selectedIndicator) throw new Error(`Invalid selected indicator: ${selectedIndicatorId}`);

    if (checked) {
      if (this.selectedIndicators.indexOf(selectedIndicator) === -1) {
        this.selectedIndicators = [...this.selectedIndicators, selectedIndicator];
        await TimelineViewModel.loadTimelineForIndicators(this.selectedIndicators);
        this.series = TimelineViewModel.indicatorsToSeries(this.selectedIndicators);
      }
    }
    else {
      if (this.selectedIndicators.indexOf(selectedIndicator) !== -1) {
        this.selectedIndicators = this.selectedIndicators.filter((indicator) => indicator !== selectedIndicator);
        this.series = TimelineViewModel.indicatorsToSeries(this.selectedIndicators);
      }
    }
  }
}
