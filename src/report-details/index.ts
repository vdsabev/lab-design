import './style.scss';

import { div, h1, h4 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { FactoryComponent, redraw } from 'mithril';

import { Report } from '../report';
import { Test, TestServices } from '../test';

// TODO: Use firebase in services to guarantee load order
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
        h4({ class: 'mb-md' }, report.description),
        div({ class: 'mb-lg' }, [
          Timeago(new Date(<number>report.date))
        ]),
        div({ class: 'report-details' },
          Object.keys(report.tests).map((testId) => ReportTest(report.tests[testId], lowestValueMultiplier, highestValueMultiplier))
        )
      ])
    )
  };
};

const ReportTest = (test: Test, lowestValueMultiplier: number, highestValueMultiplier: number) => [
  div({ class: 'report-test-name' }, test.name),
  div({ class: 'report-test-unit' }, test.unit),
  div({ class: 'report-test-bar-container' }, [
    div({ class: 'report-test-bar background' }),

    div({ class: 'report-test-bar min-value flex-row justify-content-center align-items-stretch', style: { left: getValuePosition(test.minValue, test, lowestValueMultiplier, highestValueMultiplier) + '%' } }, [
      div({ class: 'value-number' }, formatNumber(test.minValue))
    ]),

    div({ class: 'report-test-bar max-value flex-row justify-content-center align-items-stretch', style: { left: getValuePosition(test.maxValue, test, lowestValueMultiplier, highestValueMultiplier) + '%' } }, [
      div({ class: 'value-number' }, formatNumber(test.maxValue))
    ]),

    div({
      class: `report-test-bar value flex-row justify-content-center align-items-stretch ${test.value < test.minValue ? 'low-value' : ''} ${test.value > test.maxValue ? 'high-value' : ''}`,
      style: { left: getValuePosition(test.value, test, lowestValueMultiplier, highestValueMultiplier) + '%' }
    }, [
      div({ class: 'value-number' }, formatNumber(test.value))
    ])
  ])
];

const getValuePosition = (
  value: number,
  test: Test,
  lowestValueMultiplier: number,
  highestValueMultiplier: number
): number => {
  const valueRange = test.maxValue - test.minValue;
  const maxLowValue = test.minValue - valueRange * lowestValueMultiplier;
  const maxHighValue = test.maxValue + valueRange * highestValueMultiplier;
  return 100 * (value - maxLowValue) / (maxHighValue - maxLowValue);
};

const formatNumber = (value: number) => value.toFixed(2);
