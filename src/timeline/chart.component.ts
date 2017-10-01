import { svg, g, line, path, circle, rect, text } from 'compote/html';
import { TimelineChartSeries } from './chart.viewmodel';

const timelineChartOptions = {
  xMax: 1000,
  yMax: 500,
  strokeWidth: 2,
  strokeOpacity: 0.8,
  radius: 3,
  viewBox: '',
  colors: ['red', 'green', 'blue', 'orange', 'purple', 'brown'],
  pointFillColor: 'white',
  tooltip: {
    width: 50,
    height: 20,
    padding: 5
  }
};

timelineChartOptions.viewBox = [
  0,
  0,
  timelineChartOptions.xMax,
  timelineChartOptions.yMax
].join(' ');

// For a well-done example, see:
// https://www.highcharts.com/demo/spline-irregular-time
export const TimelineChart = (series: TimelineChartSeries[], options = timelineChartOptions) => (
  // TODO: Type
  svg(<any>{ width: '100%', viewBox: options.viewBox, style: { shapeRendering: 'crispedges', overflow: 'visible' } }, [
    line(<any>{ x1: 0, y1: '100%', x2: '100%', y2: '100%', style: { stroke: 'black', strokeWidth: `${options.strokeWidth}px` } }),
    line(<any>{ x1: 0, y1: '100%', x2: 0, y2: 0, style: { stroke: 'black', strokeWidth: `${options.strokeWidth}px` } }),
    series.map((seriesItem, seriesItemIndex) => [
      seriesItem.values && seriesItem.values.length > 0 ? text(<any>{
        oncreate(vnode: any) {
          vnode.dom.style.transform = `translate(-${vnode.dom.getComputedTextLength() + 2 * options.tooltip.padding}px, ${options.tooltip.padding}px)`;
        },
        fill: options.colors[seriesItemIndex % options.colors.length],
        x: options.xMax * seriesItem.values[0].x,
        y: options.yMax * seriesItem.values[0].y
      }, seriesItem.label) : null,
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
      seriesItem.values.map((value, valueIndex) => [
        g([
          rect(<any>{
            id: `timeline-chart-value-tooltip-${seriesItemIndex}-${valueIndex}`,
            fill: options.pointFillColor,
            x: options.xMax * value.x,
            y: options.yMax * value.y,
            width: options.tooltip.width,
            height: options.tooltip.height,
            rx: options.radius,
            ry: options.radius,
            style: {
              shapeRendering: 'auto',
              stroke: options.colors[seriesItemIndex % options.colors.length],
              strokeWidth: `${options.strokeWidth}px`
            }
          }),
          text(<any>{
            oncreate(vnode: any) {
              const tooltip: SVGRectElement = <any>document.getElementById(`timeline-chart-value-tooltip-${seriesItemIndex}-${valueIndex}`);
              if (tooltip) {
                tooltip.style.width = vnode.dom.getComputedTextLength() + 2 * options.tooltip.padding;
              }
            },
            fill: options.colors[seriesItemIndex % options.colors.length],
            x: options.xMax * value.x + options.tooltip.padding,
            y: options.yMax * value.y + options.tooltip.height - options.tooltip.padding
          }, value.label)
        ]),
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
      ])
    ])
  ])
);
