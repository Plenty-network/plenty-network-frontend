import { ScaleLinear, select, zoom, ZoomBehavior, zoomIdentity, ZoomTransform } from "d3";
import Image from "next/image";
import React, { useEffect, useMemo, useRef } from "react";
import { RefreshCcw, ZoomIn, ZoomOut } from "react-feather";

import zoomin from "../../../assets/icon/poolsv3/zoomin.svg";
import zoomout from "../../../assets/icon/poolsv3/zoomout.svg";
import Button from "../../Button/Button";

import { ZoomLevels } from "./types";

// const Wrapper = styled.div<{ count: number }>`
//   display: grid;
//   grid-template-columns: repeat(${({ count }) => count.toString()}, 1fr);
//   grid-gap: 6px;

//   position: absolute;
//   top: -63px;
//   right: 0;
// `;

// const Button = styled(Button)`
//   &:hover {
//     background-color: ${({ theme }) => theme.backgroundInteractive};
//     color: ${({ theme }) => theme.textPrimary};
//   }

//   width: 32px;
//   height: 32px;
//   padding: 4px;
// `;

// export const ZoomOverlay = styled.rect`
//   fill: transparent;
//   cursor: grab;

//   &:active {
//     cursor: grabbing;
//   }
// `;

export default function Zoom({
  svg,
  xScale,
  setZoom,
  width,
  height,
  resetBrush,
  showResetButton,
  zoomLevels,
}: {
  svg: SVGElement | null;
  xScale: ScaleLinear<number, number>;
  setZoom: (transform: ZoomTransform) => void;
  width: number;
  height: number;
  resetBrush: () => void;
  showResetButton: boolean;
  zoomLevels: ZoomLevels;
}) {
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>();

  const [zoomIn, zoomOut, zoomInitial, zoomReset] = useMemo(
    () => [
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 2),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .call(zoomBehavior.current.transform, zoomIdentity.translate(0, 0).scale(1))
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
    ],
    [svg]
  );

  useEffect(() => {
    if (!svg) return;

    zoomBehavior.current = zoom()
      .scaleExtent([zoomLevels.min, zoomLevels.max])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", ({ transform }: { transform: ZoomTransform }) => setZoom(transform));

    select(svg as Element).call(zoomBehavior.current);
  }, [
    height,
    width,
    setZoom,
    svg,
    xScale,
    zoomBehavior,
    zoomLevels,
    zoomLevels.max,
    zoomLevels.min,
  ]);

  useEffect(() => {
    // reset zoom to initial on zoomLevel change
    zoomInitial();
  }, [zoomInitial, zoomLevels]);

  return (
    <div className="gap-2 absolute top-[-63px] right-0 flex">
      {showResetButton && (
        <div
          onClick={() => {
            resetBrush();
            zoomReset();
          }}
        >
          <RefreshCcw size={16} />
        </div>
      )}
      <div
        onClick={zoomIn}
        className="cursor-pointer bg-shimmer-100 p-2 rounded-full hover:bg-shimmer-200/[0.8]"
      >
        <ZoomIn size={13} />
      </div>
      <div
        onClick={zoomOut}
        className="cursor-pointer bg-shimmer-100 p-2 rounded-full hover:bg-shimmer-200/[0.8]"
      >
        <ZoomOut size={13} />
      </div>
    </div>
  );
}
