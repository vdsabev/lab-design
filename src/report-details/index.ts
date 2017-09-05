import './style.scss';

import { div, h1 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { classy } from 'compote/components/utils';
import { FactoryComponent, redraw } from 'mithril';

import { Report } from '../report';
import { Test, TestServices } from '../test';

interface Multipliers {
  lowestValueMultiplier: number;
  highestValueMultiplier: number;
}

export const ReportDetails: FactoryComponent<HTMLDivElement & { report: Report }> = ({ attrs: { report } }) => {
  let lowestValueMultiplier = 0;
  let highestValueMultiplier = 0;

  const loadTests = (tests: Record<string, Test>) => {
    Object.keys(tests).forEach(async (testId) => {
      const test = await TestServices.get(testId);
      const reportTest = report.tests[testId] = { ...test, ...tests[testId] };
      updateMultipliers(reportTest);
      redraw();
    });
  };

  const updateMultipliers = (test: Test) => {
    const valueRange = test.maxValue - test.minValue;

    if (test.value < test.minValue) {
      const lowMultiplier = (test.minValue - test.value) / valueRange;
      if (lowMultiplier > lowestValueMultiplier) {
        lowestValueMultiplier = lowMultiplier;
      }
    }

    if (test.value > test.maxValue) {
      const highMultiplier = (test.value - test.maxValue) / valueRange;
      if (highMultiplier > highestValueMultiplier) {
        highestValueMultiplier = highMultiplier;
      }
    }
  };

  loadTests(report.tests);
  report.tests = {};

  return {
    view: () => (
      div({ class: 'container fade-in-animation' }, [
        h1({ class: 'mb-md' }, `Report Details: ${report.id}`),
        div({ class: 'mb-md' }, report.description),
        div({ class: 'mb-lg' }, [
          Timeago(new Date(<number>report.date))
        ]),
        div({ class: 'report-details' },
          Object.keys(report.tests).map((testId) => ReportTest(report.tests[testId], { lowestValueMultiplier, highestValueMultiplier }))
        )
      ])
    )
  };
};

const ReportTest = (test: Test, multipliers: Multipliers) => [
  div({ class: 'report-test-name' }, test.name),
  div({ class: 'report-test-unit' }, test.unit),
  div({ class: 'report-test-bar-container' }, [
    div({ class: 'report-test-bar background' }),

    div({
      class: 'report-test-bar min-value flex-row justify-content-center align-items-stretch',
      style: { left: getValuePosition(test.minValue, test, multipliers) + '%' }
    }, [
      div({ class: 'value-number' }, formatNumber(test.minValue))
    ]),

    div({
      class: 'report-test-bar max-value flex-row justify-content-center align-items-stretch',
      style: { left: getValuePosition(test.maxValue, test, multipliers) + '%' }
    }, [
      div({ class: 'value-number' }, formatNumber(test.maxValue))
    ]),

    div({
      class: classy({
        'report-test-bar value flex-row justify-content-center align-items-stretch': true,
        'low-value': test.value < test.minValue,
        'high-value' : test.value > test.maxValue
      }),
      style: { left: getValuePosition(test.value, test, multipliers) + '%' }
    }, [
      div({ class: 'value-number' }, formatNumber(test.value))
    ])
  ])
];

const getValuePosition = (
  value: number,
  { minValue, maxValue }: Test,
  { lowestValueMultiplier, highestValueMultiplier }: Multipliers
): number => {
  const valueRange = maxValue - minValue;
  const lowestValue = minValue - valueRange * lowestValueMultiplier;
  const highestValue = maxValue + valueRange * highestValueMultiplier;
  return 100 * (value - lowestValue) / (highestValue - lowestValue);
};

const formatNumber = (value: number) => value.toFixed(2);
