import './style.scss';

import { div, h1 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { classy } from 'compote/components/utils';
import { FactoryComponent, redraw } from 'mithril';

import { Indicator, IndicatorServices } from '../indicator';
import { Report } from '../report';

interface Multipliers {
  lowestValueMultiplier: number;
  highestValueMultiplier: number;
}

export const ReportDetails: FactoryComponent<HTMLDivElement & { report: Report }> = ({ attrs: { report } }) => {
  let lowestValueMultiplier = 0;
  let highestValueMultiplier = 0;

  const loadIndicators = (indicators: Record<string, Indicator>) => {
    Object.keys(indicators).forEach(async (indicatorId) => {
      const indicator = await IndicatorServices.get(indicatorId);
      const reportIndicator = report.indicators[indicatorId] = { ...indicator, ...indicators[indicatorId] };
      updateMultipliers(reportIndicator);
      redraw();
    });
  };

  const updateMultipliers = (indicator: Indicator) => {
    const valueRange = indicator.reference.max - indicator.reference.min;

    if (indicator.value < indicator.reference.min) {
      const lowMultiplier = (indicator.reference.min - indicator.value) / valueRange;
      if (lowMultiplier > lowestValueMultiplier) {
        lowestValueMultiplier = lowMultiplier;
      }
    }

    if (indicator.value > indicator.reference.max) {
      const highMultiplier = (indicator.value - indicator.reference.max) / valueRange;
      if (highMultiplier > highestValueMultiplier) {
        highestValueMultiplier = highMultiplier;
      }
    }
  };

  loadIndicators(report.indicators);
  report.indicators = {};

  return {
    view: () => (
      div({ class: 'container fade-in-animation' }, [
        h1({ class: 'mb-md' }, report.id),
        div({ class: 'mb-md' }, report.text),
        div({ class: 'mb-lg' }, [
          Timeago(new Date(<number>report.date))
        ]),
        div({ class: 'report-details' },
          Object.keys(report.indicators).map((indicatorId) => ReportIndicator(report.indicators[indicatorId], { lowestValueMultiplier, highestValueMultiplier }))
        )
      ])
    )
  };
};

const ReportIndicator = (indicator: Indicator, multipliers: Multipliers) => [
  div({ class: 'report-indicator-name' }, indicator.name),
  div({ class: 'report-indicator-unit' }, indicator.unit),
  div({ class: 'report-indicator-bar-container' }, [
    div({ class: 'report-indicator-bar background' }),

    div({
      class: 'report-indicator-bar min-value flex-row justify-content-center align-items-stretch',
      style: { left: getValuePosition(indicator.reference.min, indicator, multipliers) + '%' }
    }, [
      div({ class: 'value-number' }, formatNumber(indicator.reference.min))
    ]),

    div({
      class: 'report-indicator-bar max-value flex-row justify-content-center align-items-stretch',
      style: { left: getValuePosition(indicator.reference.max, indicator, multipliers) + '%' }
    }, [
      div({ class: 'value-number' }, formatNumber(indicator.reference.max))
    ]),

    div({
      class: classy({
        'report-indicator-bar value flex-row justify-content-center align-items-stretch': true,
        'low-value': indicator.value < indicator.reference.min,
        'high-value' : indicator.value > indicator.reference.max
      }),
      style: { left: getValuePosition(indicator.value, indicator, multipliers) + '%' }
    }, [
      div({ class: 'value-number' }, formatNumber(indicator.value))
    ])
  ])
];

const getValuePosition = (
  value: number,
  { reference: { min, max } }: Indicator,
  { lowestValueMultiplier, highestValueMultiplier }: Multipliers
): number => {
  const valueRange = max - min;
  const lowestValue = min - valueRange * lowestValueMultiplier;
  const highestValue = max + valueRange * highestValueMultiplier;
  return 100 * (value - lowestValue) / (highestValue - lowestValue);
};

const formatNumber = (value: number) => value.toFixed(2);
