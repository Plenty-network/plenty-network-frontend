import { ISimpleButtonProps, SimpleButton } from "./Component/SimpleButton";
import React, { useState, useMemo, useEffect, useRef } from "react";
import fromExponential from "from-exponential";
import clsx from "clsx";
import walletIcon from "../../assets/icon/pools/wallet.svg";
import { SwitchWithIcon } from "../SwitchCheckbox/switchWithIcon";
import { InputText } from "./Component/InputText";
import {
  BtnwithBoost,
  BtnWithStakeIcon,
  BtnWithUnStakeIcon,
  BtnWithWalletIcon,
  BtnWithWalletIconEnd,
} from "./Component/BtnWithWalletIcon";

import { BigNumber } from "bignumber.js";
import Button from "../Button/Button";
import { CircularImageInfo } from "./Component/CircularImageInfo";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { AppDispatch, store, useAppSelector } from "../../redux";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { IStakedDataResponse, IVePLYData } from "../../api/stake/types";

import { VePLY } from "../DropDown/VePLY";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IConfigLPToken } from "../../config/types";
import nFormatter, {
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";

export enum StakingScreenType {
  Staking = "Staking",
  Unstaking = "Unstaking",
  ConfirmStake = "ConfirmStake",
  ConfirmUnStake = "ConfirmUnStake",
}
export interface IStakingScreenProps {
  boost: IStakedDataResponse | undefined;
  tokenIn: tokenParameterLiquidity;
  handleDetach: () => void;
  tokenOut: tokenParameterLiquidity;
  stakingScreen: StakingScreenType;
  lpTokenPrice: BigNumber;
  pnlpBalance: string;
  stakeInput: string | number;
  unStakeInput: string | number;
  setStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setUnStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  stakedToken: string;
  setStakingScreen: React.Dispatch<React.SetStateAction<StakingScreenType>>;
  setSelectedDropDown: React.Dispatch<React.SetStateAction<IVePLYData>>;
  selectedDropDown: IVePLYData;
  vePLYOptions: IVePLYData[];
  isListLoading: boolean;
  lpToken: IConfigLPToken | undefined;
}
export interface IStakingProps {
  boost: IStakedDataResponse | undefined;
  setStakingScreen: Function;
  stakingScreen: StakingScreenType;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  lpTokenPrice: BigNumber;
  pnlpBalance: string;
  stakeInput: string | number;
  setStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  stakedToken: string;
  setSelectedDropDown: React.Dispatch<React.SetStateAction<IVePLYData>>;
  selectedDropDown: IVePLYData;
  vePLYOptions: IVePLYData[];
  isListLoading: boolean;
  handleDetach: () => void;
  lpToken: IConfigLPToken | undefined;
}

export interface IUnstakingProps {
  setStakingScreen: Function;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  stakingScreen: StakingScreenType;
  lpTokenPrice: BigNumber;
  pnlpBalance: string;
  unStakeInput: string | number;
  setUnStakeInput: React.Dispatch<React.SetStateAction<string | number>>;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  stakedToken: string;
  lpToken: IConfigLPToken | undefined;
}
export function StakingScreen(props: IStakingScreenProps) {
  return (
    <>
      {props.stakingScreen === StakingScreenType.Staking && (
        <Staking
          setStakingScreen={props.setStakingScreen}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          lpTokenPrice={props.lpTokenPrice}
          pnlpBalance={props.pnlpBalance}
          stakeInput={props.stakeInput}
          setStakeInput={props.setStakeInput}
          setScreen={props.setScreen}
          stakedToken={props.stakedToken}
          stakingScreen={props.stakingScreen}
          setSelectedDropDown={props.setSelectedDropDown}
          selectedDropDown={props.selectedDropDown}
          vePLYOptions={props.vePLYOptions}
          isListLoading={props.isListLoading}
          handleDetach={props.handleDetach}
          boost={props.boost}
          lpToken={props.lpToken}
        />
      )}
      {props.stakingScreen === StakingScreenType.Unstaking && (
        <Unstaking
          setStakingScreen={props.setStakingScreen}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          lpTokenPrice={props.lpTokenPrice}
          pnlpBalance={props.pnlpBalance}
          unStakeInput={props.unStakeInput}
          setUnStakeInput={props.setUnStakeInput}
          setScreen={props.setScreen}
          stakedToken={props.stakedToken}
          stakingScreen={props.stakingScreen}
          lpToken={props.lpToken}
        />
      )}
    </>
  );
}

export function Staking(props: IStakingProps) {
  const walletAddress = useAppSelector((state) => state.wallet.address);

  const handleInputPercentage = (value: number) => {
    const decimal = new BigNumber(value * Number(props.pnlpBalance)).decimalPlaces();

    if (
      decimal !== null &&
      props.lpToken &&
      new BigNumber(decimal).isGreaterThan(props.lpToken?.decimals)
    ) {
      props.setStakeInput(
        new BigNumber(value * Number(props.pnlpBalance))
          .decimalPlaces(props.lpToken.decimals, 1)
          .toString()
      );
    } else {
      props.setStakeInput((value * Number(props.pnlpBalance)).toString());
    }
  };
  const [errorMessage, setErrorMessage] = useState("");
  const handleStakeInput = async (input: string | number) => {
    if (input == ".") {
      props.setStakeInput("0.");

      return;
    }
    if (input === "" || isNaN(Number(input))) {
      props.setStakeInput("");

      return;
    } else {
      const decimal = new BigNumber(input).decimalPlaces();
      if (
        decimal !== null &&
        props.lpToken &&
        new BigNumber(decimal).isGreaterThan(props.lpToken?.decimals)
      ) {
        setErrorMessage(
          `The Precision of ${tEZorCTEZtoUppercase(
            props.tokenIn.symbol
          )} token cant be greater than ${props.lpToken?.decimals} decimals`
        );
      } else {
        props.setStakeInput(input);
      }
    }
  };

  const onClickAmount = () => {
    handleStakeInput(props.pnlpBalance);
  };
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const previous = useRef("");
  useEffect(() => {
    previous.current = props.selectedDropDown.tokenId;
  }, []);

  const stakeButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (Number(props.stakeInput) <= 0 && props.selectedDropDown.boostValue === "") {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Stake
        </Button>
      );
    } else if (
      walletAddress &&
      props.stakeInput &&
      Number(props.stakeInput) > Number(props.pnlpBalance)
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Insufficient balance
        </Button>
      );
    } else {
      return (
        <Button
          color={"primary"}
          onClick={() => {
            props.setScreen("2");
          }}
        >
          {props.stakeInput <= 0 && props.selectedDropDown.tokenId !== previous.current.toString()
            ? "Update Boost veNFT"
            : "Stake"}
        </Button>
      );
    }
  }, [props]);
  return (
    <div className="flex flex-col">
      <div className="border rounded-2xl border-text-800 bg-card-200 px-[10px] md:px-3.5 pt-4 pb-6  mb-5">
        <div className="flex items-center justify-between flex-row  relative ">
          <div className="flex gap-2 items-center">
            <span className="relative ml-2 top-[3px]">
              <SwitchWithIcon
                isChecked={false}
                onChange={() => props.setStakingScreen(StakingScreenType.Unstaking)}
              />
            </span>

            <p className="text-f16 text-white relative -top-0.5">Stake Liquidity</p>
          </div>
        </div>

        {/* Start Of text and btn */}
        <div className="flex justify-between items-center py-2 md:px-4">
          <div className="font-body2 md:font-body4  text-text-500">How much PNLP to stake?</div>
          <div className="ml-auto flex font-body2">
            <p
              className={clsx(
                "cursor-pointer rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex",
                props.stakeInput === 0.25 * Number(props.pnlpBalance) &&
                  "border-primary-500 bg-primary-500/[0.20]"
              )}
              {...(!walletAddress || Number(props.pnlpBalance) === 0
                ? {}
                : { onClick: () => handleInputPercentage(0.25) })}
            >
              25%
            </p>
            <p
              className={clsx(
                "cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex",
                props.stakeInput === 0.5 * Number(props.pnlpBalance) &&
                  "border-primary-500 bg-primary-500/[0.20]"
              )}
              {...(!walletAddress || Number(props.pnlpBalance) === 0
                ? {}
                : { onClick: () => handleInputPercentage(0.5) })}
            >
              50%
            </p>
            <p
              className={clsx(
                "cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md: h-[32px] px-[8.5px] md:px-[13px] items-center flex",
                props.stakeInput === 0.75 * Number(props.pnlpBalance) &&
                  "border-primary-500 bg-primary-500/[0.20]"
              )}
              {...(!walletAddress || Number(props.pnlpBalance) === 0
                ? {}
                : { onClick: () => handleInputPercentage(0.75) })}
            >
              75%
            </p>
          </div>
        </div>
        {/* end of text and btn */}
        {/* Start of Wallet app section */}
        <div className="border flex  items-center bg-muted-200/10 border-border-500/50 rounded-2xl">
          <div className=" flex flex-col py-3.5 px-4 flex-auto w-0">
            <InputText value={fromExponential(props.stakeInput)} onChange={handleStakeInput} />
            <div className="font-body2 md:font-body4 text-text-400">
              ~$
              {!isNaN(Number(props.lpTokenPrice))
                ? Number(Number(props.stakeInput) * Number(props.lpTokenPrice)).toFixed(2)
                : "0.00"}
            </div>
          </div>
          {walletAddress && (
            <div className="pr-2 md:pr-5 ">
              <BtnWithWalletIcon
                text={`${nFormatterWithLesserNumber(new BigNumber(props.pnlpBalance))} PNLP`}
                onClick={onClickAmount}
              />
            </div>
          )}
        </div>
        {/* end of Waller app section */}
        {/* dropDown And InfoTab */}
        <div className="flex py-2 px-2 mt-2 rounded-2xl md:px-2.5 justify-between bg-primary-850 border border-secondary-300">
          <VePLY
            Options={props.vePLYOptions}
            selectedText={props.selectedDropDown}
            onClick={props.setSelectedDropDown}
            isListLoading={props.isListLoading}
          />

          <div className="font-mobile-f9 md:text-f12 text-text-400 ml-2 max-w-[280px] md:max-w-[321px] text-center">
            Based on how much voting power the veNFT has, you may be able to boost your PLY rewards
            up to 2.5x
          </div>
        </div>
        {/* End of dropDown info */}
      </div>
      {/* Button Stake */}
      {stakeButton}
      {/* end of Button Stake */}

      {/* start of notification panel */}

      <div className="border mt-4 rounded-2xl flex flex-col justify-between items-center pr-2 py-1.5 border-border-500 bg-card-300 ">
        {Number(props.stakedToken) > 0 ? (
          <>
            <div className="flex w-full justify-between">
              <div className="flex gap-1 md:gap-2 items-center pl-2 md:pl-4">
                <CircularImageInfo imageArray={[props.tokenIn.image, props.tokenOut.image]} />
                <span className="font-body2 md:text-f14 text-white ">
                  {tEZorCTEZtoUppercase(props.tokenIn.symbol)} /
                  {tEZorCTEZtoUppercase(props.tokenOut.symbol)}
                </span>
              </div>
              <div className="flex gap-1 md:gap-2">
                <div className="md:block hidden">
                  {props.boost?.stakedData.isBoosted && (
                    <BtnwithBoost
                      text={`${props.boost.stakedData.boostValue} x`}
                      onClick={props.handleDetach}
                      tokenid={props.boost.stakedData.boostedLockId.toString()}
                    />
                  )}
                </div>
                <BtnWithWalletIconEnd
                  text={`${nFormatterWithLesserNumber(new BigNumber(props.pnlpBalance))}
                    PNLP`}
                />
                <BtnWithStakeIcon
                  text={`${nFormatterWithLesserNumber(new BigNumber(props.stakedToken))} PNLP`}
                />
              </div>
            </div>
            <div className="ml-auto block md:hidden">
              {props.boost?.stakedData.isBoosted && (
                <BtnwithBoost
                  text={`${props.boost.stakedData.boostValue} x`}
                  onClick={props.handleDetach}
                  tokenid={props.boost.stakedData.boostedLockId.toString()}
                />
              )}
            </div>
          </>
        ) : (
          <div className="font-body2 text-white py-2 pl-4">No staked positions</div>
        )}
      </div>

      {/* end of notification panel */}
    </div>
  );
}
export function Unstaking(props: IUnstakingProps) {
  // const walletAddress = store.getState().wallet.address;
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const handleInputPercentage = (value: number) => {
    const decimal = new BigNumber(value * Number(props.stakedToken)).decimalPlaces();

    if (
      decimal !== null &&
      props.lpToken &&
      new BigNumber(decimal).isGreaterThan(props.lpToken?.decimals)
    ) {
      props.setUnStakeInput(
        new BigNumber(value * Number(props.stakedToken))
          .decimalPlaces(props.lpToken.decimals, 1)
          .toString()
      );
    } else {
      props.setUnStakeInput(value * Number(props.stakedToken));
    }
  };
  const handleUnStakeInput = async (input: string | number) => {
    if (input == ".") {
      props.setUnStakeInput("0.");

      return;
    }
    if (input === "" || isNaN(Number(input))) {
      props.setUnStakeInput("");

      return;
    } else {
      const decimal = new BigNumber(input).decimalPlaces();
      if (
        decimal !== null &&
        props.lpToken &&
        new BigNumber(decimal).isGreaterThan(props.lpToken?.decimals)
      ) {
      } else {
        props.setUnStakeInput(input);
      }
    }
  };
  const onClickAmount = () => {
    handleUnStakeInput(props.stakedToken);
  };
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const UnstakeButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (Number(props.unStakeInput) <= 0) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Unstake
        </Button>
      );
    } else if (
      walletAddress &&
      props.unStakeInput &&
      Number(props.unStakeInput) > Number(props.stakedToken)
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Insufficient balance
        </Button>
      );
    } else {
      return (
        <Button
          color={"primary"}
          onClick={() => {
            props.setScreen("3");
          }}
        >
          Unstake
        </Button>
      );
    }
  }, [props]);
  return (
    <div className="border rounded-2xl border-text-800 bg-card-200 px-3.5 pt-4 pb-6  ">
      {/* staking UnStaking Switch */}
      <div className="flex items-center justify-between flex-row  relative">
        <div className="flex gap-2 items-center">
          <span className="relative ml-2 top-[3px]">
            <SwitchWithIcon
              isChecked={true}
              onChange={() => props.setStakingScreen(StakingScreenType.Staking)}
            />
          </span>
          <p className="text-f16 text-white relative -top-0.5">Unstake Liquidity</p>
        </div>
      </div>
      {/* end of switch */}

      {/* Start Of text and btn */}
      <div className="flex justify-between items-center py-2 md:px-4">
        <div className="font-body2 md:font-body4 text-text-500">How much PNLP to unstake?</div>
        <div className="ml-auto flex font-body2">
          <p
            className={clsx(
              "cursor-pointer rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex",
              props.unStakeInput === 0.25 * Number(props.stakedToken) &&
                "border-primary-500 bg-primary-500/[0.20]"
            )}
            {...(!walletAddress || Number(props.stakedToken) === 0
              ? {}
              : { onClick: () => handleInputPercentage(0.25) })}
          >
            25%
          </p>
          <p
            className={clsx(
              "cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex",
              props.unStakeInput === 0.5 * Number(props.stakedToken) &&
                "border-primary-500 bg-primary-500/[0.20]"
            )}
            {...(!walletAddress || Number(props.stakedToken) === 0
              ? {}
              : { onClick: () => handleInputPercentage(0.5) })}
          >
            50%
          </p>
          <p
            className={clsx(
              "cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md: h-[32px] px-[8.5px] md:px-[13px] items-center flex",
              props.unStakeInput === 0.75 * Number(props.stakedToken) &&
                "border-primary-500 bg-primary-500/[0.20]"
            )}
            {...(!walletAddress || Number(props.stakedToken) === 0
              ? {}
              : { onClick: () => handleInputPercentage(0.75) })}
          >
            75%
          </p>
        </div>
      </div>
      {/* end of text and btn */}

      {/* Start of Wallet app section */}
      <div className="border flex  items-center bg-muted-200/10 border-border-500/50 mb-5 rounded-2xl">
        <div className=" flex flex-col py-3.5 px-4 flex-auto w-0">
          <InputText value={fromExponential(props.unStakeInput)} onChange={handleUnStakeInput} />
          <div className="font-body2 md:font-body4 text-text-400">
            ~$
            {!isNaN(Number(props.lpTokenPrice))
              ? Number(Number(props.unStakeInput) * Number(props.lpTokenPrice)).toFixed(2)
              : "0.00"}
          </div>
        </div>
        {walletAddress && (
          <div className="pr-2 md:pr-5 cursor-pointer ">
            <ToolTip
              disable={Number(props.stakedToken) > 0 ? false : true}
              message={fromExponential(props.stakedToken)}
              id="tooltip8"
              position={Position.top}
            >
              <BtnWithUnStakeIcon
                text={`${nFormatterWithLesserNumber(new BigNumber(props.stakedToken))} PNLP`}
                onClick={onClickAmount}
              />
            </ToolTip>
          </div>
        )}
      </div>
      {/* end of Waller app section */}

      {UnstakeButton}
    </div>
  );
}
