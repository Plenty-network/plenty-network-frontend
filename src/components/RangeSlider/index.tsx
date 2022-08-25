import Image from "next/image";
import * as React from "react";
import { Range, getTrackBackground } from "react-range";
import plus from "../../assets/icon/vote/plus.svg";
import minus from "../../assets/icon/vote/minus.svg";
import { ISelectedPool } from "../../api/votes/types";

export interface IRangeSliderProps {
  isMobile: boolean;
  tokenA: string;
  tokenB: string;
  setSelectedPools: React.Dispatch<React.SetStateAction<ISelectedPool[]>>;
  selectedPools: ISelectedPool[];
}

export function RangeSlider(props: IRangeSliderProps) {
  const [sliderVal, setSliderVal] = React.useState(0);
  const handleInputEdit = (value: string) => {
    if (value && !isNaN(parseInt(value))) {
      if (parseInt(value) >= 0 && parseInt(value) <= 100) {
        setSliderVal(parseInt(value));
      }
    } else {
      setSliderVal(0);
    }
  };

  React.useEffect(() => {
    if (sliderVal > 0) {
      let v = true;

      props.selectedPools.forEach(function (pools) {
        if (pools.tokenA === props.tokenA && pools.tokenB === props.tokenB) {
          pools.votingPower = Number(sliderVal.toFixed(0));
          v = false;
        }
      });
      if (v) {
        props.setSelectedPools(
          props.selectedPools.concat({
            tokenA: props.tokenA,
            tokenB: props.tokenB,
            votingPower: Number(sliderVal.toFixed(0)),
          })
        );
      }

      console.log(props.selectedPools);
    }
  }, [sliderVal]);
  return (
    <div className="flex gap-3">
      {!props.isMobile && (
        <div className="flex items-center gap-[7.5px]">
          <Image
            src={minus}
            className="cursor-pointer"
            onClick={() =>
              setSliderVal((oldValue) => (oldValue - 10 > 0 ? (oldValue - 10) % 100 : 0))
            }
          />
          <Range
            step={0.1}
            min={0}
            max={100}
            values={[sliderVal]}
            onChange={(values) => setSliderVal(values[0])}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="flex-1 relative w-[96px] h-[2px] bg-text-255"
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
                className="bg-primary-500 h-3 w-3 outline-none rounded-full border-2 border-white"
              />
            )}
          />
          <Image
            src={plus}
            className="cursor-pointer"
            onClick={() => setSliderVal((oldValue) => (oldValue + 10 < 100 ? oldValue + 10 : 100))}
          />
        </div>
      )}
      <input
        className="bg-primary-500/10 border outline-none border-primary-500 py-[9px] text-center h-[38px] w-[48px] rounded-lg text-f12 "
        value={sliderVal.toFixed(0) + "%"}
        onChange={(e) => handleInputEdit(e.target.value.replaceAll("%", ""))}
      />
    </div>
  );
}
