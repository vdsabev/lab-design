import './timeline.style.scss';

import { div, label, input } from 'compote/html';
import { FactoryComponent, redraw } from 'mithril';

import { TimelineChart } from './chart.component';
import { TimelineViewModel, IndicatorWithTimeline } from './timeline.viewmodel';

interface Attrs extends Partial<HTMLDivElement> {
}

export const Timeline: FactoryComponent<Attrs> = ({ attrs }) => {
  const vm: Readonly<TimelineViewModel> = new TimelineViewModel();

  vm.loadIndicators().then(redraw);

  const indicatorChanged = (e: Event) => {
    const el = <HTMLInputElement>e.currentTarget;
    vm.selectIndicator(el.value, el.checked).then(redraw);
  };

  return {
    view: () => (
      div({ class: 'container' }, [
        SelectIndicators(vm.indicators, indicatorChanged),
        TimelineChart(vm.series)
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
