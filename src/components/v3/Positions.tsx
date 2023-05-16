import Image from "next/image";
import * as React from "react";

import { useMemo, useRef, useState } from "react";

import Button from "../Button/Button";

import { AppDispatch, useAppSelector } from "../../redux";

import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
import { CircularImageInfo } from "../Pools/Component/CircularImageInfo";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";
import PositionsTable from "./PositionsTable";
import feeimg from "../../assets/icon/poolsv3/feeMP.svg";
import dollarimg from "../../assets/icon/poolsv3/dollarMP.svg";
import { ActivePopUp } from "./ManageTabV3";

interface IPositionsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
}
function PositionsPopup(props: IPositionsProps) {
  const walletAddress = useAppSelector((state) => state.wallet.address);

  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const ButtonComp = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button height="52px" onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (false) {
      return (
        <Button height="52px" onClick={() => null} color={"disabled"}>
          New position
        </Button>
      );
    } else if (true) {
      return (
        <Button
          height="52px"
          onClick={() => props.setScreen(ActivePopUp.NewPosition)}
          color={"primary"}
        >
          New position
        </Button>
      );
    }
  }, [props]);

  return (
    <>
      <div className=" mt-4 rounded-2xl flex flex-col justify-between items-center h-[64px] px-3 sm:px-[25px] py-1.5 border-text-800  border-2 bg-secondary-400 ">
        {
          <>
            <div className="flex w-full justify-between">
              <div className="flex gap-1 md:gap-2 items-center pl-0 md:pl-4">
                <CircularImageInfo imageArray={[props.tokenIn.image, props.tokenOut.image]} />
                <span className="font-body2 md:text-f14 text-white ">
                  {tEZorCTEZtoUppercase(props.tokenIn.symbol)} /
                  {tEZorCTEZtoUppercase(props.tokenOut.symbol)}
                </span>
              </div>
              <div className="text-white rounded-lg text-center	 bg-info-800 flex items-center justify-center w-[90px] h-[44px] ml-auto">
                <Image src={feeimg} />
                <span className="ml-1 font-title3">0.05%</span>
              </div>
              <div className="text-white rounded-lg text-center	 bg-info-800 flex items-center justify-center w-[90px] h-[44px] ml-3">
                <Image src={dollarimg} />
                <span className="ml-1 font-title3">$3.45</span>
              </div>
            </div>
          </>
        }
      </div>
      <PositionsTable
        setScreen={props.setScreen}
        tokenIn={props.tokenIn}
        tokenOut={props.tokenOut}
      />
      <div className="mt-2">{ButtonComp}</div>
    </>
  );
}

export default PositionsPopup;