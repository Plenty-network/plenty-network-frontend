import React from "react";
import { ChartEntry } from "./types";

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
  console.log("BarChart1", data);
  return (
    <g>
      {data.map((d: ChartEntry, index: number) => {
        const x: number = xScale(xAccessor(d));
        const y: number = yScale(yAccessor(d));

        const width: number = d.width;
        const barHeight: number = height - y;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={barHeight}
            fill={"rgba(21,112,241,0.2)"}
            stroke={"#1570F1"}
          />
        );
      })}
    </g>
  );
};

export default BarChart1;
