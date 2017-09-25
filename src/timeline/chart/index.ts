import { svg, line, path, circle } from 'compote/html';

const timelineChartOptions = {
  xMax: 1000,
  yMax: 500,
  strokeWidth: 2,
  strokeOpacity: 0.8,
  radius: 2.5,
  viewBox: '',
  colors: ['red', 'green', 'blue', 'yellow', 'purple', 'brown'],
  defaultColor: 'black'
};

timelineChartOptions.viewBox = [
  -timelineChartOptions.radius,
  timelineChartOptions.radius,
  timelineChartOptions.xMax + 2 * timelineChartOptions.radius,
  timelineChartOptions.yMax + 2 * timelineChartOptions.radius
].join(' ');

export type TimelineChartSeries = { values: { x: number, y: number }[] };

export const TimelineChart = (series: TimelineChartSeries[], options = timelineChartOptions) => (
  // TODO: Type
  svg(<any>{ width: '100%', viewBox: options.viewBox, style: { shapeRendering: 'crispedges' } }, [
    line(<any>{ x1: 0, y1: '100%', x2: '100%', y2: '100%', style: { stroke: 'black', strokeWidth: `${options.strokeWidth}px` } }),
    line(<any>{ x1: 0, y1: '100%', x2: 0, y2: 0, style: { stroke: 'black', strokeWidth: `${options.strokeWidth}px` } }),
    series.map((seriesItem, seriesItemIndex) => [
      path(<any>{
        d: seriesItem.values.map((value, valueIndex) => `${valueIndex === 0 ? 'M' : 'L'}${timelineChartOptions.xMax * value.x} ${timelineChartOptions.yMax * value.y} `).join(''),
        fill: 'none',
        style: {
          stroke: options.colors[seriesItemIndex] || options.defaultColor,
          strokeOpacity: options.strokeOpacity,
          shapeRendering: 'auto',
          strokeLinejoin: 'round',
          strokeWidth: `${options.strokeWidth}px`
        }
      }),
      seriesItem.values.map((value) => (
        circle(<any>{
          fill: options.colors[seriesItemIndex] || options.defaultColor,
          cx: timelineChartOptions.xMax * value.x,
          cy: timelineChartOptions.yMax * value.y,
          r: options.radius
        })
      ))
    ])
  ])
);
