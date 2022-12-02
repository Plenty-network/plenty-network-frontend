import React from "react";
import clsx from "clsx";
import { useMemo } from "react";
import { ImageCircle } from "./Component/CircularImageInfo";
import Button from "../Button/Button";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { AppDispatch, store, useAppSelector } from "../../redux";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";

export interface IRewardsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  tokenInAmount: string;
  tokenOutAmount: string;
  rewardToken: string;
  handleOperation: () => void;
}
export function RewardsScreen(props: IRewardsProps) {
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  // const walletAddress = store.getState().wallet.address;
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };

  const harvestButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect Wallet
        </Button>
      );
    } else if (
      (walletAddress &&
        props.tokenInAmount &&
        props.tokenOutAmount &&
        Number(props.tokenInAmount) === 0) ||
      Number(props.tokenOutAmount) === 0
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Insufficient Balance
        </Button>
      );
    } else if (Number(props.rewardToken) === 0) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          No rewards yet
        </Button>
      );
    } else {
      return (
        <Button color={"primary"} onClick={props.handleOperation}>
          Harvest Rewards
        </Button>
      );
    }
  }, [props]);
  function InnerTab(token: any, text: number, className: string, tokenName: string) {
    return (
      <div className="flex gap-2 items-center">
        <ImageCircle src={token} className={className} />
        {!isNaN(text) ? (
          <div className="text-f14 text-white h-5 font-medium">{text}</div>
        ) : (
          <div className=" w-12 mr-2  h-[18px] rounded animate-pulse bg-shimmer-100"></div>
        )}

        <div
          className={clsx(
            "text-f14 ml-px h-5 font-medium",
            tokenName === "PLY" ? "text-text-500" : "text-white"
          )}
        >
          {tEZorCTEZtoUppercase(tokenName)}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex border rounded-2xl border-text-800 bg-card-200 p-4 flex-col gap-[15px]">
        <div className="text-text-400 text-f12">Your Deposits</div>

        <div className="flex flex-col">
          {InnerTab(
            props.tokenIn.image,
            props.tokenInAmount ? Number(props.tokenInAmount) : 0,
            "",
            props.tokenIn.symbol
          )}
          {InnerTab(
            props.tokenOut.image,
            props.tokenOutAmount ? Number(props.tokenOutAmount) : 0,
            "-mt-1",
            props.tokenOut.symbol
          )}
        </div>
      </div>

      <div className="flex border rounded-2xl border-text-800 bg-card-200 p-4 flex-col gap-[15px]">
        <div className="text-text-400 text-f12">Your Rewards</div>
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <ImageCircle src={getImagesPath("PLY")} />
            {!isNaN(Number(props.rewardToken)) ? (
              <div className="text-f14 text-white h-5 font-medium">
                {Number(props.rewardToken).toFixed(6)}
              </div>
            ) : (
              <div className=" w-12 mr-2  h-[18px] rounded animate-pulse bg-shimmer-100"></div>
            )}

            <div className={clsx("text-f14 ml-px h-5 font-medium", "text-white")}>
              {tEZorCTEZtoUppercase("PLY")}
            </div>
          </div>
        </div>
      </div>

      {harvestButton}
    </div>
  );
}
