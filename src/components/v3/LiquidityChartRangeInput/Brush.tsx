// import { brushHandleAccentPath, brushHandlePath, OffScreenHandle } from 'components/LiquidityChartRangeInput/svg'
import { Tick } from "@plenty-labs/v3-sdk";
import { BrushBehavior, brushX, D3BrushEvent, ScaleLinear, select } from "d3";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../../redux";
import { setBleftbrush, setBrightbrush, setleftbrush, setrightbrush } from "../../../redux/poolsv3";

import { brushHandleAccentPath, brushHandlePath, OffScreenHandle } from "./svg";
import usePrevious from "./usePrevious";

// const Handle = styled.path<{ color: string }>`
//   cursor: ew-resize;
//   pointer-events: none;

//   stroke-width: 3;
//   stroke: ${({ color }) => color};
//   fill: ${({ color }) => color};
// `;

// const HandleAccent = styled.path`
//   cursor: ew-resize;
//   pointer-events: none;

//   stroke-width: 1.5;
//   stroke: #ffffff;
//   opacity: 1;
// `;

// const LabelGroup = styled.g<{ visible: boolean }>`
//   opacity: ${({ visible }) => (visible ? "1" : "0")};
//   transition: opacity 300ms;
//   fill: #211336;
// `;

// const TooltipBackground = styled.rect`
//   fill: #211336;
// `;

// const Tooltip = styled.text`
//   text-anchor: middle;
//   font-size: 13px;
//   fill: #cfced1;
// `;

// flips the handles draggers when close to the container edges
const FLIP_HANDLE_THRESHOLD_PX = 20;

// margin to prevent tick snapping from putting the brush off screen
const BRUSH_EXTENT_MARGIN_PX = 2;

/**
 * Returns true if every element in `a` maps to the
 * same pixel coordinate as elements in `b`
 */
const compare = (
  a: [number, number],
  b: [number, number],
  xScale: ScaleLinear<number, number>
): boolean => {
  // normalize pixels to 1 decimals
  const aNorm = a.map((x) => xScale(x)?.toFixed(1));
  const bNorm = b.map((x) => xScale(x)?.toFixed(1));
  return aNorm.every((v, i) => v === bNorm[i]);
};

export const Brush = ({
  id,
  xScale,
  interactive,
  brushLabelValue,
  brushExtent,
  setBrushExtent,
  innerWidth,
  innerHeight,
  westHandleColor,
  eastHandleColor,
}: {
  id: string;
  xScale: ScaleLinear<number, number>;
  interactive: boolean;
  brushLabelValue: (d: "w" | "e", x: number) => string;
  brushExtent: [number, number];
  setBrushExtent: (extent: [number, number], mode: string | undefined) => void;
  innerWidth: number;
  innerHeight: number;
  westHandleColor: string;
  eastHandleColor: string;
}) => {
  //const tick = new Tick();

  const brushRef = useRef<SVGGElement | null>(null);
  const brushBehavior = useRef<BrushBehavior<SVGGElement> | null>(null);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const tokenIn = useAppSelector((state) => state.poolsv3.tokenIn);
  const tokenOut = useAppSelector((state) => state.poolsv3.tokenOut);
  const tickSpacing = 10;
  // only used to drag the handles on brush for performance
  const [localBrushExtent, setLocalBrushExtent] = useState<[number, number] | null>(brushExtent);
  const [showLabels, setShowLabels] = useState(false);
  const [hovering, setHovering] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const previousBrushExtent = usePrevious(brushExtent);
  const brushed = useCallback(
    (event: D3BrushEvent<unknown>) => {
      const { type, selection, mode } = event;
      if (!selection) {
        setLocalBrushExtent(null);
        return;
      }

      const scaled = (selection as [number, number]).map(xScale.invert) as [number, number];

      // avoid infinite render loop by checking for change
      if (type === "end" && !compare(brushExtent, scaled, xScale)) {
        topLevelSelectedToken.symbol === tokenIn.symbol
          ? dispatch(setleftbrush(scaled[0]))
          : dispatch(setBleftbrush(scaled[0]));
        topLevelSelectedToken.symbol === tokenIn.symbol
          ? dispatch(setrightbrush(scaled[1]))
          : dispatch(setBrightbrush(scaled[1]));
        console.log(
          "hj",
          Tick.nearestUsableTick(scaled[0], 10),
          Tick.nearestUsableTick(scaled[1], 10)
        );

        setBrushExtent(
          [Tick.nearestUsableTick(scaled[0], 10), Tick.nearestUsableTick(scaled[1], 10)],
          mode
        );
      }

      setLocalBrushExtent([
        Tick.nearestUsableTick(scaled[0], 10),
        Tick.nearestUsableTick(scaled[1], 10),
      ]);
    },
    [xScale, brushExtent, setBrushExtent]
  );

  //keep local and external brush extent in sync
  //i.e. snap to ticks on bruhs end
  useEffect(() => {
    setLocalBrushExtent(brushExtent);
  }, [brushExtent]);

  // initialize the brush
  useEffect(() => {
    if (!brushRef.current) return;

    brushBehavior.current = brushX<SVGGElement>()
      .extent([
        [Math.max(0 + BRUSH_EXTENT_MARGIN_PX, xScale(0)), 0],
        [innerWidth - BRUSH_EXTENT_MARGIN_PX, innerHeight],
      ])
      .handleSize(30)
      .filter(() => interactive)
      .on("brush end", brushed);

    brushBehavior.current(select(brushRef.current));

    if (previousBrushExtent && compare(brushExtent, previousBrushExtent, xScale)) {
      select(brushRef.current)
        .transition()
        .call(brushBehavior.current.move as any, brushExtent.map(xScale));
    }

    // brush linear gradient
    select(brushRef.current)
      .selectAll(".selection")
      .attr("stroke", "none")
      .attr("fill-opacity", "0.2")
      .attr("fill", "#1570F1");
  }, [brushExtent, brushed, id, innerHeight, innerWidth, interactive, previousBrushExtent, xScale]);

  // respond to xScale changes only
  useEffect(() => {
    if (!brushRef.current || !brushBehavior.current) return;

    brushBehavior.current.move(select(brushRef.current) as any, brushExtent.map(xScale) as any);
  }, [brushExtent, xScale]);

  // show labels when local brush changes
  useEffect(() => {
    setShowLabels(true);
    const timeout = setTimeout(() => setShowLabels(false), 1500);
    return () => clearTimeout(timeout);
  }, [localBrushExtent]);

  // variables to help render the SVGs
  const flipWestHandle = localBrushExtent && xScale(localBrushExtent[0]) > FLIP_HANDLE_THRESHOLD_PX;
  const flipEastHandle =
    localBrushExtent && xScale(localBrushExtent[1]) > innerWidth - FLIP_HANDLE_THRESHOLD_PX;

  const showWestArrow =
    localBrushExtent && (xScale(localBrushExtent[0]) < 0 || xScale(localBrushExtent[1]) < 0);
  const showEastArrow =
    localBrushExtent &&
    (xScale(localBrushExtent[0]) > innerWidth || xScale(localBrushExtent[1]) > innerWidth);

  const westHandleInView =
    localBrushExtent &&
    xScale(localBrushExtent[0]) >= 0 &&
    xScale(localBrushExtent[0]) <= innerWidth;
  const eastHandleInView =
    localBrushExtent &&
    xScale(localBrushExtent[1]) >= 0 &&
    xScale(localBrushExtent[1]) <= innerWidth;

  return useMemo(
    () => (
      <>
        <defs>
          <linearGradient id={`${id}-gradient-selection`} x1="0%" y1="100%" x2="100%" y2="100%">
            <stop stopColor={westHandleColor} />
            <stop stopColor={eastHandleColor} offset="1" />
          </linearGradient>

          {/* clips at exactly the svg area */}
          <clipPath id={`${id}-brush-clip`}>
            <rect x="0" y="0" width={innerWidth} height={innerHeight} />
          </clipPath>
        </defs>

        {/* will host the d3 brush */}
        <g
          ref={brushRef}
          clipPath={`url(#${id}-brush-clip)`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        />

        {/* custom brush handles */}
        {localBrushExtent && (
          <>
            {/* west handle */}
            {westHandleInView ? (
              <g
                transform={`translate(${Math.max(0, xScale(localBrushExtent[0]))}, 0), scale(${
                  flipWestHandle ? "-1" : "1"
                }, 1)`}
              >
                <g>
                  <path
                    cursor={"ew-resiz"}
                    pointerEvents={"none"}
                    strokeWidth={3}
                    stroke={westHandleColor}
                    fill={westHandleColor}
                    color={westHandleColor}
                    d={brushHandlePath(innerHeight)}
                  />

                  <path
                    cursor={"ew-resiz"}
                    pointerEvents={"none"}
                    strokeWidth={1.5}
                    stroke={"#ffffff"}
                    opacity={1}
                    d={brushHandleAccentPath()}
                  />
                </g>

                <g
                  opacity={1}
                  fill={"#211336"}
                  transform={`translate(50,0), scale(${flipWestHandle ? "1" : "-1"}, 1)`}
                >
                  <rect y="0" x="-30" height="30" width="60" rx="8" fill={"#211336"} />
                  <text
                    fontSize={"13px"}
                    fill={"#cfced1"}
                    textAnchor={"middle"}
                    transform="scale(-1, 1)"
                    y="15"
                    dominantBaseline="middle"
                  >
                    {brushLabelValue("w", localBrushExtent[0])}
                  </text>
                </g>
              </g>
            ) : null}

            {/* east handle */}
            {eastHandleInView ? (
              <g
                transform={`translate(${xScale(localBrushExtent[1])}, 0), scale(${
                  flipEastHandle ? "-1" : "1"
                }, 1)`}
              >
                <g>
                  <path
                    cursor={"ew-resiz"}
                    pointerEvents={"none"}
                    strokeWidth={3}
                    stroke={eastHandleColor}
                    fill={eastHandleColor}
                    color={eastHandleColor}
                    d={brushHandlePath(innerHeight)}
                  />
                  <path
                    cursor={"ew-resiz"}
                    pointerEvents={"none"}
                    strokeWidth={1.5}
                    stroke={"#ffffff"}
                    opacity={1}
                    d={brushHandleAccentPath()}
                  />
                </g>

                <g
                  opacity={1}
                  fill={"#211336"}
                  transform={`translate(50,0), scale(${flipEastHandle ? "-1" : "1"}, 1)`}
                >
                  <rect y="0" x="-30" height="30" width="60" rx="8" fill={"#211336"} />
                  <text
                    fontSize={"13px"}
                    fill={"#cfced1"}
                    textAnchor={"middle"}
                    y="15"
                    dominantBaseline="middle"
                  >
                    {brushLabelValue("e", localBrushExtent[1])}
                  </text>
                </g>
              </g>
            ) : null}

            {showWestArrow && <OffScreenHandle color={westHandleColor} />}

            {showEastArrow && (
              <g transform={`translate(${innerWidth}, 0) scale(-1, 1)`}>
                <OffScreenHandle color={eastHandleColor} />
              </g>
            )}
          </>
        )}
      </>
    ),
    [
      brushLabelValue,
      eastHandleColor,
      eastHandleInView,
      flipEastHandle,
      flipWestHandle,
      hovering,
      id,
      innerHeight,
      innerWidth,
      localBrushExtent,
      showEastArrow,
      showLabels,
      showWestArrow,
      westHandleColor,
      westHandleInView,
      xScale,
    ]
  );
};
