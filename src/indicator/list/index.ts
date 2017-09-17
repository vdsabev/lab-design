import './style.scss';

import { div } from 'compote/html';
import { Clock } from 'compote/components/clock';
import { classy } from 'compote/components/utils';
import { FactoryComponent, redraw } from 'mithril';
import timeago from 'timeago.js';

import { Indicator, IndicatorServices } from '../../indicator';
import { toArray } from '../../utils';

interface Attrs extends Partial<HTMLDivElement> {
  indicators: Record<string, Indicator>;
}

export const IndicatorList: FactoryComponent<Attrs> = ({ attrs: { indicators } }) => {
  let lowestValueMultiplier = 0;
  let highestValueMultiplier = 0;

  // NOTE: Firebase executes those async operations in parallel
  const indicatorsDetails: Record<string, Indicator> = {};
  Object.keys(indicators).forEach(async (indicatorId) => {
    const indicator = await IndicatorServices.get({ indicatorId });
    const indicatorDetails = indicatorsDetails[indicatorId] = { ...indicator, ...indicators[indicatorId] };
    updateMultipliers(indicatorDetails);
    redraw();
  });

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

  return {
    view: () => (
      div({ class: 'indicators' },
        toArray(indicatorsDetails).map((indicatorDetails) => IndicatorItem(indicatorDetails, { lowestValueMultiplier, highestValueMultiplier }))
      )
    )
  };
};

interface Multipliers {
  lowestValueMultiplier: number;
  highestValueMultiplier: number;
}

const IndicatorItem = (indicator: Indicator, multipliers: Multipliers) => [
  div({ class: 'indicator-name flex-row align-items-stretch' }, [
    indicator.date != null ?
      div({ title: timeago().format(new Date(indicator.date)) }, Clock(new Date(indicator.date)))
      :
      null
    ,
    indicator.name
  ]),
  div({ class: 'indicator-unit' }, indicator.unit),
  div({ class: 'indicator-bar-container' }, [
    div({ class: 'indicator-bar background' }),

    div({
      class: 'indicator-bar min-value flex-row justify-content-center align-items-stretch',
      style: { left: getValuePosition(indicator.reference.min, indicator, multipliers) + '%' }
    }, [
      div({ class: 'value-number' }, formatNumber(indicator.reference.min))
    ]),

    div({
      class: 'indicator-bar max-value flex-row justify-content-center align-items-stretch',
      style: { left: getValuePosition(indicator.reference.max, indicator, multipliers) + '%' }
    }, [
      div({ class: 'value-number' }, formatNumber(indicator.reference.max))
    ]),

    div({
      class: classy({
        'indicator-bar value flex-row justify-content-center align-items-stretch': true,
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
