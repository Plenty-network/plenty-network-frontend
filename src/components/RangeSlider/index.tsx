import Image from "next/image";
import * as React from "react";
import { Range, getTrackBackground } from "react-range";
import plus from "../../assets/icon/vote/plus.svg";
import minus from "../../assets/icon/vote/minus.svg";
import { ISelectedPool } from "../../api/votes/types";
import { IVotes } from "../../operations/types";
import { BigNumber } from "bignumber.js";
import clsx from "clsx";
import { PLY_DECIMAL_MULTIPLIER } from "../../constants/global";

export interface IRangeSliderProps {
  isMobile: boolean;
  tokenA: string;
  tokenB: string;
  setSelectedPools: React.Dispatch<React.SetStateAction<ISelectedPool[]>>;
  selectedPools: ISelectedPool[];
  setTotalVotingPower: React.Dispatch<React.SetStateAction<number>>;
  totalVotingPower: number;
  isDisabled?: boolean;
  amm: string;
  setVotes: React.Dispatch<React.SetStateAction<IVotes[]>>;
  votes: IVotes[];
  totalVotesPercentage: number;
  selectedDropDown: {
    votingPower: string;
    tokenId: string;
  };
}

export function RangeSlider(props: IRangeSliderProps) {
  const [sliderVal, setSliderVal] = React.useState(props.totalVotesPercentage);

  const handleInputEdit = (value: string) => {
    if (value && !isNaN(parseInt(value))) {
      if (
        parseInt(value) >= 0 &&
        parseInt(value) <= 100 &&
        props.totalVotingPower < 100 &&
        props.totalVotingPower + Number(value) <= 100
      ) {
        setSliderVal(parseInt(value));
      }
    } else {
      setSliderVal(0);
    }
  };
  const handleSlider = (increment: boolean) => {
    if (props.totalVotingPower < 100 && increment && props.totalVotingPower + 10 <= 100) {
      setSliderVal((oldValue) => (oldValue + 10 < 100 ? oldValue + 10 : 100));
    } else if (props.totalVotingPower < 100 && !increment) {
      setSliderVal((oldValue) => (oldValue - 10 > 0 ? (oldValue - 10) % 100 : 0));
    }
  };

  React.useEffect(() => {
    if (sliderVal > 0) {
      let v = true;

      props.selectedPools.forEach(function (pools) {
        if (pools.tokenA === props.tokenA && pools.tokenB === props.tokenB) {
          console.log("if");
          pools.votingPower = Number(sliderVal.toFixed(0));
          v = false;
        }
      });
      props.votes.forEach(function (vote) {
        if (vote.amm === props.amm) {
          vote.votes = new BigNumber(sliderVal.toFixed(0))
            .multipliedBy(props.selectedDropDown.votingPower)
            .dividedBy(100)
            .multipliedBy(PLY_DECIMAL_MULTIPLIER)
            .decimalPlaces(0, 1);
        }
      });
      if (v) {
        console.log(props.selectedPools);
        props.setSelectedPools(
          props.selectedPools.concat({
            tokenA: props.tokenA,
            tokenB: props.tokenB,
            votingPower: Number(sliderVal.toFixed(0)),
          })
        );

        props.setVotes(
          props.votes.concat({
            amm: props.amm,
            votes: new BigNumber(sliderVal.toFixed(0))
              .multipliedBy(props.selectedDropDown.votingPower)
              .dividedBy(100)
              .multipliedBy(PLY_DECIMAL_MULTIPLIER)
              .decimalPlaces(0, 1),
          })
        );
      }
    }

    var d = 0;
    props.selectedPools.forEach((pool) => (d += pool.votingPower));
    props.setTotalVotingPower(d);
  }, [sliderVal]);
  React.useEffect(() => {
    var d = 0;
    props.selectedPools.forEach((pool) => (d += pool.votingPower));
    props.setTotalVotingPower(d);
  }, [props.selectedPools.toString()]);

  return (
    <div className="flex gap-3">
      {!props.isMobile && (
        <div className="flex items-center gap-[7.5px]">
          <Image
            src={minus}
            className={clsx(props.isDisabled ? "cursor-not-allowed" : "cursor-pointer")}
            onClick={() => (props.isDisabled ? () => {} : handleSlider(false))}
          />
          <Range
            step={0.1}
            min={0}
            disabled={props.totalVotingPower >= 100}
            max={100}
            values={[sliderVal]}
            onChange={(values) => (props.isDisabled ? () => {} : setSliderVal(values[0]))}
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
            className={clsx(props.isDisabled ? "cursor-not-allowed" : "cursor-pointer")}
            onClick={() => (props.isDisabled ? () => {} : handleSlider(true))}
          />
        </div>
      )}
      <div className="bg-primary-500/10 flex border  border-primary-500 text-f12 py-[9px] text-center h-[38px] w-[48px] rounded-lg px-[9px]">
        <input
          className="bg-primary-500/[0.0] w-[19px] outline-none text-center text-f12 "
          value={sliderVal.toFixed(0)}
          onChange={(e) => (props.isDisabled ? () => {} : handleInputEdit(e.target.value))}
          disabled={props.isDisabled}
        />
        %
      </div>
    </div>
  );
}
