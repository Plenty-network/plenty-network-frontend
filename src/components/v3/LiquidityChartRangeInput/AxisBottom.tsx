import { Axis as d3Axis, axisBottom, NumberValue, ScaleLinear, select } from "d3";
import React, { useMemo } from "react";
//import styled from "styled-components";

// const StyledGroup = styled.g`
//   line {
//     color: #ffffff;
//   }

//   text {
//     color: "#ffffff";
//     transform: translateY(5px);
//   }
// `;

const Axis = ({ axisGenerator }: { axisGenerator: d3Axis<NumberValue> }) => {
  const axisRef = (axis: SVGGElement) => {
    axis &&
      select(axis)
        .call(axisGenerator)
        .call((g) => g.select(".domain").remove());
  };

  return <g ref={axisRef} />;
};

export const AxisBottom = ({
  xScale,
  innerHeight,
  offset = 0,
}: {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
  offset?: number;
}) =>
  useMemo(
    () => (
      <g color={"#ffffff"} transform={`translate(0, ${innerHeight + offset})`}>
        <Axis axisGenerator={axisBottom(xScale).ticks(6)} />
      </g>
    ),
    [innerHeight, offset, xScale]
  );
