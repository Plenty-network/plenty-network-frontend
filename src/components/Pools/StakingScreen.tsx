import { ISimpleButtonProps, SimpleButton } from "./Component/SimpleButton";
import React, { useState, useMemo, useEffect } from "react";
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
import { AppDispatch, store } from "../../redux";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { IStakedDataResponse, IVePLYData } from "../../api/stake/types";

import { VePLY } from "../DropDown/VePLY";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { detachLockFromGauge } from "../../operations/locks";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import { setFlashMessage } from "../../redux/flashMessage";
import { Flashtype } from "../FlashScreen";
import { getStakedData } from "../../api/stake";
import { FIRST_TOKEN_AMOUNT, TOKEN_A, TOKEN_B } from "../../constants/localStorage";

export enum StakingScreenType {
  Staking = "Staking",
  Unstaking = "Unstaking",
  ConfirmStake = "ConfirmStake",
  ConfirmUnStake = "ConfirmUnStake",
}
export interface IStakingScreenProps {
  tokenIn: tokenParameterLiquidity;
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
}
export interface IStakingProps {
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
        />
      )}
    </>
  );
}

export function Staking(props: IStakingProps) {
  const walletAddress = store.getState().wallet.address;
  const handleInputPercentage = (value: number) => {
    props.setStakeInput(value * Number(props.pnlpBalance));
  };
  const [boost, setBoost] = useState<IStakedDataResponse>();
  useEffect(() => {
    if (walletAddress) {
      getStakedData(props.tokenIn.name, props.tokenOut.name, walletAddress).then((res) => {
        setBoost(res);
      });
    }
  }, []);

  const handleStakeInput = async (input: string | number) => {
    if (input == ".") {
      props.setStakeInput("0.");

      return;
    }
    if (input === "" || isNaN(Number(input))) {
      props.setStakeInput("");

      return;
    } else {
      props.setStakeInput(input);
    }
  };
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;
  const onClickAmount = () => {
    handleStakeInput(props.pnlpBalance);
  };
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const handleDetach = () => {
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(props.tokenIn.symbol));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(props.tokenOut.symbol));
    if (boost?.stakedData.boostedLockId) {
      localStorage.setItem(
        FIRST_TOKEN_AMOUNT,
        boost ? boost?.stakedData?.boostedLockId.toString() : ""
      );
    }
    detachLockFromGauge(
      props.tokenIn.name,
      props.tokenOut.name,
      undefined,
      undefined,
      undefined
    ).then((response) => {
      if (response.success) {
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: ` Detach # ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} from ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(TOKEN_B)} pool
              `,
              linkText: "View in Explorer",
              isLoading: true,
              transactionId: "",
            })
          );
        }, 6000);
      } else {
        dispatch(
          setFlashMessage({
            flashType: Flashtype.Rejected,
            transactionId: "",
            headerText: "Rejected",
            trailingText: `Detach # ${localStorage.getItem(
              FIRST_TOKEN_AMOUNT
            )} from ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(TOKEN_B)} pool`,
            linkText: "",
            isLoading: true,
          })
        );
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const stakeButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect Wallet
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
          Insufficient Balance
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
          {props.stakeInput <= 0 && props.selectedDropDown.tokenId !== "" ? "Boost" : "Stake"}
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
        {/* dropDown And InfoTab */}
        <div className="flex py-2 px-2 rounded-2xl md:px-2.5 justify-between bg-primary-850 border border-secondary-300">
          <VePLY
            Options={props.vePLYOptions}
            selectedText={props.selectedDropDown}
            onClick={props.setSelectedDropDown}
            isListLoading={props.isListLoading}
          />

          <div className="font-mobile-f9 md:text-f12 text-text-400 ml-2 max-w-[321px] text-center">
            Based on how much voting power the veNFT has, you may be able to boost your PLY rewards
            up to 2.5x
          </div>
        </div>
        {/* End of dropDown info */}

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
            <InputText value={props.stakeInput} onChange={handleStakeInput} />
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
                text={`${
                  Number(props.pnlpBalance) > 0 ? Number(props.pnlpBalance).toFixed(2) : 0
                } PNLP`}
                onClick={onClickAmount}
              />
            </div>
          )}
        </div>
        {/* end of Waller app section */}
      </div>
      {/* Button Stake */}
      {stakeButton}
      {/* end of Button Stake */}

      {/* start of notification panel */}

      <div className="border mt-4 rounded-2xl flex flex-col justify-between items-center pr-2 py-1.5 border-border-500 bg-card-300 ">
        {Number(props.stakedToken) > 0 ? (
          <>
            <div className="flex justify-between">
              <div className="flex gap-1 md:gap-2 items-center pl-2 md:pl-4">
                <CircularImageInfo imageArray={[props.tokenIn.image, props.tokenOut.image]} />
                <span className="font-body2 md:text-f14 text-white ">
                  {tEZorCTEZtoUppercase(props.tokenIn.symbol)} /
                  {tEZorCTEZtoUppercase(props.tokenOut.symbol)}
                </span>
              </div>
              <div className="ml-5 flex gap-1 md:gap-2">
                <div className="md:block hidden">
                  {boost?.stakedData.isBoosted && (
                    <BtnwithBoost
                      text={`${boost.stakedData.boostValue} x`}
                      onClick={handleDetach}
                      tokenid={boost.stakedData.boostedLockId.toString()}
                    />
                  )}
                </div>
                <BtnWithWalletIconEnd
                  text={`${
                    Number(props.pnlpBalance) > 0 ? Number(props.pnlpBalance).toFixed(2) : 0
                  } PNLP`}
                />
                <BtnWithStakeIcon text={`${Number(props.stakedToken).toFixed(4)} PNLP`} />
              </div>
            </div>
            <div className="ml-auto block md:hidden">
              {boost?.stakedData.isBoosted && (
                <BtnwithBoost
                  text={`${boost.stakedData.boostValue} x`}
                  onClick={handleDetach}
                  tokenid={boost.stakedData.boostedLockId.toString()}
                />
              )}
            </div>
          </>
        ) : (
          <div className="font-body2 text-white pl-4">No Staked positions</div>
        )}
      </div>

      {/* end of notification panel */}
    </div>
  );
}
export function Unstaking(props: IUnstakingProps) {
  const walletAddress = store.getState().wallet.address;
  const handleInputPercentage = (value: number) => {
    props.setUnStakeInput(value * Number(props.stakedToken));
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
      props.setUnStakeInput(input);
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
          Connect Wallet
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
          Insufficient Balance
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
          <InputText value={props.unStakeInput} onChange={handleUnStakeInput} />
          <div className="font-body2 md:font-body4 text-text-400">
            ~$
            {!isNaN(Number(props.lpTokenPrice))
              ? Number(Number(props.unStakeInput) * Number(props.lpTokenPrice)).toFixed(2)
              : "0.00"}
          </div>
        </div>
        {walletAddress && (
          <div className="pr-2 md:pr-5  ">
            <ToolTip
              disable={Number(props.stakedToken) > 0 ? false : true}
              message={fromExponential(props.stakedToken)}
              id="tooltip8"
              position={Position.top}
            >
              <BtnWithUnStakeIcon
                text={`${
                  Number(props.stakedToken) > 0 ? Number(props.stakedToken).toFixed(2) : 0
                } PNLP`}
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
