import './Timeline.scss';

import { redraw } from 'mithril';

import { TimelineViewModel, IndicatorWithTimeline } from './Timeline.ViewModel';
import { TimelineChart } from './TimelineChart';

export const Timeline: FnComponent = ({ attrs }) => {
  const vm: Readonly<TimelineViewModel> = new TimelineViewModel();

  vm.loadIndicators().then(redraw);

  const indicatorChanged = (e: Event) => {
    const el = e.currentTarget as HTMLInputElement;
    vm.selectIndicator(el.value, el.checked).then(redraw);
  };

  return {
    view: () => (
      <div class="container">
        {SelectIndicators(vm.indicators, indicatorChanged)}
        {TimelineChart(vm.series)}
      </div>
    )
  };
};

const SelectIndicators = (indicators: IndicatorWithTimeline[], indicatorChanged: (e: Event) => any) =>
  <div class="timeline-indicators width-100p height-xxl overflow-auto mb-md bg-neutral-lighter">
    {indicators.map((indicator) =>
      <label class="block">
        <input type="checkbox" value={indicator.id} onchange={indicatorChanged} />
        {indicator.name}
      </label>
    )}
  </div>
;
