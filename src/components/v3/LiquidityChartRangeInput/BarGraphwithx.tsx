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
        console.log(
          "yAccessor(d)",
          yAccessor(d),
          "yScale(yAccessor(d))",
          yScale(yAccessor(d)),
          "y",
          y,
          "x",
          x
        );

        const width: number = d.width;
        const barHeight: number = height - y;
        console.log("BarChart1", x, y, width, height - y);
        return (
          <rect key={index} x={x} y={y} width={20} height={barHeight} fill={styles.bar.fill} />
        );
      })}
    </g>
  );
};

export default BarChart1;
