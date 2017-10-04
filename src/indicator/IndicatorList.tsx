import './IndicatorList.scss';

import { Clock } from 'compote/components/clock';
import { classy } from 'compote/components/utils';
import { redraw } from 'mithril';
import timeago from 'timeago.js';

import { objectDictionaryToArray } from '../utils';
import { Indicator, ValueIndicator, IndicatorServices } from './index';

export const IndicatorList: FnComponent<{ indicators: Record<string, ValueIndicator> }> = ({ attrs: { indicators } }) => {
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
    view: () =>
      <div class="indicators">
        {objectDictionaryToArray(indicatorsDetails).map((indicatorDetails) => IndicatorItem(indicatorDetails, { lowestValueMultiplier, highestValueMultiplier }))}
      </div>
  };
};

interface Multipliers {
  lowestValueMultiplier: number;
  highestValueMultiplier: number;
}

const IndicatorItem = (indicator: Indicator, multipliers: Multipliers) => [
  <div class="indicator-name flex-row align-items-stretch">
    {indicator.date != null ?
      <div title={timeago().format(new Date(indicator.date))}>
        {Clock(new Date(indicator.date))}
      </div>
      :
      null}
    {indicator.name}
  </div>,

  <div class="indicator-unit">{indicator.unit}</div>,

  <div class="indicator-bar-container">
    <div class="indicator-bar background"></div>

    <div
      class="indicator-bar min-value flex-row justify-content-center align-items-stretch"
      style={{ left: getValuePosition(indicator.reference.min, indicator, multipliers) + '%' }}
    >
      <div class="value-number">{formatNumber(indicator.reference.min)}</div>
    </div>

    <div
      class="indicator-bar max-value flex-row justify-content-center align-items-stretch"
      style={{ left: getValuePosition(indicator.reference.max, indicator, multipliers) + '%' }}
    >
      <div class="value-number">{formatNumber(indicator.reference.max)}</div>
    </div>

    <div
      class={classy({
        'indicator-bar value flex-row justify-content-center align-items-stretch': true,
        'low-value': indicator.value < indicator.reference.min,
        'high-value' : indicator.value > indicator.reference.max
      })}
      style={{ left: getValuePosition(indicator.value, indicator, multipliers) + '%' }}
    >
      <div class="value-number">{formatNumber(indicator.value)}</div>
    </div>
  </div>
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
