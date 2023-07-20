import React from "react";
import { ChartEntry } from "./types";

// Assuming you have defined appropriate types for data and styles

type BarChartProps = {
  data: ChartEntry[];
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  xAccessor: (d: ChartEntry) => number;
  yAccessor: (d: ChartEntry) => number;
  height: number;
  styles: {
    bar: {
      fill: string;
    };
  };
};

const BarChart1: React.FC<BarChartProps> = ({
  data,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  height,
  styles,
}) => {
  return (
    <g>
      {data.map((d: ChartEntry, index: number) => {
        const x: number = xScale(xAccessor(d));
        const y: number = yScale(yAccessor(d));
        const barHeight: number = height - y;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={xScale?.bandwidth ? xScale.bandwidth() : 10}
            height={barHeight}
            fill={styles.bar.fill}
          />
        );
      })}
    </g>
  );
};

export default BarChart1;
