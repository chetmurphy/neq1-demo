import * as d3 from "d3";
import * as React from "react";

// https://swizec.com/blog/declarative-d3-charts-react-16-3/swizec/8353

export interface IBarChartProps {
  x: number
  y: number
  width: number
  height: number
  data: number[]
}

export interface IBarChartState {
  widthScale: any;
  heightScale: any;
}

export class BarChart extends React.Component<IBarChartProps, IBarChartState> {

  public static getDerivedStateFromProps(nextProps: IBarChartProps, prevState: IBarChartState) {
    const { widthScale, heightScale } = prevState;

    widthScale.domain(d3.range(0, nextProps.data.length));
    heightScale.domain([0, d3.max(nextProps.data)]);

    prevState = { ...prevState, widthScale, heightScale };
    return prevState;
  }

  public state: IBarChartState = {
    widthScale: d3
      .scaleBand()
      .domain([''])
      .range([0, this.props.width]),
    heightScale: d3
      .scaleLinear()
      .domain([0, d3.max(this.props.data) as number])
      .range([0, this.props.height])
  }

  constructor(props: IBarChartProps) {
    super(props);
  }

  public render() {
    const { x, y, data, height } = this.props
    const { widthScale, heightScale } = this.state;

    return (
      <g
        transform={`translate(${x}, ${y})`}
      >
        {data.map((d, i) => (
          <rect
            x={widthScale(i)}
            y={height - heightScale(d)}
            width={widthScale.bandwidth()-10}
            height={heightScale(d)}
            style={{
              fill: 'black'
            }} 
            key={i}
          />
        ))}
      </g>
    );
  }
}

