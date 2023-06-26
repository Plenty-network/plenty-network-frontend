import Image from "next/image";
import * as React from "react";
import { Range, getTrackBackground } from "react-range";

import clsx from "clsx";

export interface IRangeSliderProps {
  decreaseValue: number;
  isDisabled?: boolean;
  setRemovePercentage: React.Dispatch<React.SetStateAction<number>>;
}

export function RangeSliderDecLiq(props: IRangeSliderProps) {
  const [sliderVal, setSliderVal] = React.useState<number>(props.decreaseValue);
  React.useEffect(() => {
    setSliderVal(props.decreaseValue);
  }, [props.decreaseValue]);

  const handleslider = (value: string) => {
    setSliderVal(parseInt(value));
    props.setRemovePercentage(parseInt(value));
  };
  return (
    <div className="flex gap-3">
      {
        <div className="flex items-center gap-[7.5px]">
          <Range
            step={1}
            min={0}
            max={100}
            values={[sliderVal]}
            onChange={(values) => handleslider(values[0].toString())}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="flex-1 relative w-[320px] sm:w-[521px] h-[4px] bg-text-255"
                style={{
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values: [sliderVal],
                    colors: ["#7E4ACC", "#D8DAEB"],
                    min: 0,
                    max: 100,
                  }),
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className={clsx(
                  "bg-primary-500 h-[18px] w-[18px] outline-none rounded-full border-2 border-white"
                )}
              />
            )}
          />
        </div>
      }
    </div>
  );
}
