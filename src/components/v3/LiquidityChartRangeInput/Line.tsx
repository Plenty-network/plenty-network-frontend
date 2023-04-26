import { ScaleLinear } from "d3";
import React, { useMemo } from "react";
//import styled from "styled-components";

// const StyledLine = styled.line`
//   opacity: 1;
//   stroke-width: 4;
//   stroke: #a8a8a8;
//   fill: none;
// `;

export const Line = ({
  value,
  xScale,
  innerHeight,
}: {
  value: number;
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}) =>
  useMemo(
    () => (
      <line
        opacity={1}
        strokeWidth={4}
        stroke={"#a8a8a8"}
        fill={"none"}
        x1={xScale(value)}
        y1="0"
        x2={xScale(value)}
        y2={innerHeight}
      />
    ),
    [value, xScale, innerHeight]
  );
