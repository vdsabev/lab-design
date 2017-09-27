import { svg, line, path, circle } from 'compote/html';
import { TimelineChartSeries } from './chart.viewmodel';

const timelineChartOptions = {
  xMax: 1000,
  yMax: 500,
  strokeWidth: 2,
  strokeOpacity: 0.8,
  radius: 3,
  viewBox: '',
  colors: ['red', 'green', 'blue', 'orange', 'purple', 'brown'],
  pointFillColor: 'white'
};

timelineChartOptions.viewBox = [
  -timelineChartOptions.radius,
  timelineChartOptions.radius,
  timelineChartOptions.xMax + 2 * timelineChartOptions.radius,
  timelineChartOptions.yMax + 2 * timelineChartOptions.radius
].join(' ');

export const TimelineChart = (series: TimelineChartSeries[], options = timelineChartOptions) => (
  // TODO: Type
  svg(<any>{ width: '100%', viewBox: options.viewBox, style: { shapeRendering: 'crispedges' } }, [
    line(<any>{ x1: 0, y1: '100%', x2: '100%', y2: '100%', style: { stroke: 'black', strokeWidth: `${options.strokeWidth}px` } }),
    line(<any>{ x1: 0, y1: '100%', x2: 0, y2: 0, style: { stroke: 'black', strokeWidth: `${options.strokeWidth}px` } }),
    series.map((seriesItem, seriesItemIndex) => [
      path(<any>{
        d: seriesItem.values.map((value, valueIndex) => `${valueIndex === 0 ? 'M' : 'L'}${options.xMax * value.x} ${options.yMax * value.y} `).join(''),
        fill: 'none',
        style: {
          stroke: options.colors[seriesItemIndex % options.colors.length],
          strokeOpacity: options.strokeOpacity,
          shapeRendering: 'auto',
          strokeLinejoin: 'round',
          strokeWidth: `${options.strokeWidth}px`
        }
      }),
      seriesItem.values.map((value) => (
        circle(<any>{
          fill: options.pointFillColor,
          cx: options.xMax * value.x,
          cy: options.yMax * value.y,
          r: options.radius,
          style: {
            shapeRendering: 'auto',
            stroke: options.colors[seriesItemIndex % options.colors.length],
            strokeWidth: `${options.strokeWidth}px`
          }
        })
      ))
    ])
  ])
);
