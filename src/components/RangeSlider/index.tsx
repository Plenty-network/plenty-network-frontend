import Image from "next/image";
import * as React from "react";
import { Range, getTrackBackground } from "react-range";
import plus from "../../assets/icon/vote/plus.svg";
import minus from "../../assets/icon/vote/minus.svg";
import { ISelectedPool, IVotePageData } from "../../api/votes/types";
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
  index: number;
  selectedDropDown: {
    votingPower: string;
    tokenId: string;
  };
  votedata: {
    index: number;
    amm: string;
    votes: IVotePageData;
  }[];

  totalVotes1: number[];
}

export function RangeSlider(props: IRangeSliderProps) {
  const [sliderVal, setSliderVal] = React.useState(props.totalVotes1[props.index]);
  React.useEffect(() => {
    setSliderVal(props.totalVotes1[props.index]);
  }, [props.totalVotes1[props.index]]);
  const handleInputEdit = (index: number, value: string) => {
    var sum = 0;
    props.totalVotes1.forEach((item, id) => {
      if (id !== index) {
        sum += item;
      }
    });
    if (value && !isNaN(parseInt(value))) {
      if (parseInt(value) >= 0 && parseInt(value) <= 100 && sum + Number(value) <= 100) {
        props.totalVotes1[index] = parseInt(value);

        setSliderVal(parseInt(value));
      }
    } else {
      props.totalVotes1[index] = 0;
      setSliderVal(0);
    }
  };

  const handleSlider = (increment: boolean, index: number) => {
    const oldValue = props.totalVotes1[index];
    if (props.totalVotingPower < 100 && increment && props.totalVotingPower + 1 <= 100) {
      props.totalVotes1[index] = oldValue + 1 <= 100 ? oldValue + 1 : 100;
      setSliderVal((oldValue) => (oldValue + 1 <= 100 ? oldValue + 1 : 100));
    } else if (props.totalVotingPower <= 100 && !increment) {
      props.totalVotes1[index] = oldValue - 1 > 0 ? (oldValue - 1) % 100 : 0;
      setSliderVal((oldValue) => (oldValue - 1 > 0 ? (oldValue - 1) % 100 : 0));
    }
  };

  React.useEffect(() => {
    if (sliderVal >= 0) {
      let flag = true;

      props.selectedPools.forEach(function (pools, index) {
        if (pools.tokenA === props.tokenA && pools.tokenB === props.tokenB) {
          if (sliderVal === 0) {
            props.selectedPools.splice(index, 1);
          } else {
            pools.votingPower = Number(sliderVal.toFixed(0));

            flag = false;
          }
        }
      });
      props.votes.forEach(function (vote, index) {
        if (vote.amm === props.amm) {
          if (sliderVal === 0) {
            props.votes.splice(index, 1);
          } else {
            vote.votes = new BigNumber(sliderVal.toFixed(0))
              .multipliedBy(props.selectedDropDown.votingPower)
              .dividedBy(100)
              .multipliedBy(PLY_DECIMAL_MULTIPLIER)
              .decimalPlaces(0, 1);
          }
        }
      });

      if (flag && sliderVal > 0) {
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
    props.totalVotes1[props.index] = sliderVal;

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
            onClick={() => (props.isDisabled ? () => {} : handleSlider(false, props.index))}
          />
          <Range
            step={1}
            min={0}
            disabled={props.isDisabled}
            max={100}
            values={[sliderVal]}
            onChange={(values) =>
              props.isDisabled ? () => {} : handleInputEdit(props.index, values[0].toString())
            }
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="flex-1 relative w-[100px] h-[2px] bg-text-255"
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
            onClick={() => (props.isDisabled ? () => {} : handleSlider(true, props.index))}
          />
        </div>
      )}
      <div className="bg-primary-500/10 flex border  border-primary-500 text-f12 py-[9px] text-center h-[38px] w-[48px] rounded-lg px-[9px]">
        <input
          className="slider-input bg-primary-500/[0.0] w-[19px] outline-none text-center text-f12 "
          value={props.totalVotes1[props.index] ? props.totalVotes1[props.index] : ""}
          onChange={(e) =>
            props.isDisabled ? () => {} : handleInputEdit(props.index, e.target.value)
          }
          placeholder="0"
          disabled={props.isDisabled}
        />
        %
      </div>
    </div>
  );
}
