import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import timer from "../../../src/assets/icon/myPortfolio/timer.svg";
import Button from "../Button/Button";
import { ILockRewardsEpochData } from "../../api/portfolio/types";
import { IMigrateExchange } from "../../api/migrate/types";

interface IConfirmMigrateProps {
  show: boolean;
  tokenIn: string;
  setShow: any;
  exchangeRes: IMigrateExchange;
  handleClick: () => void;
}
function ConfirmMigrate(props: IConfirmMigrateProps) {
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal onhide={closeModal}>
      {
        <>
          <div className="flex">
            <div className="cursor-pointer" onClick={closeModal}>
              <Image alt={"alt"} src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Migrate {props.tokenIn}</div>
          </div>
          <div className="border border-text-800 bg-card-200 py-4 mt-3 rounded-2xl">
            <div className="flex mt-[2px] items-center px-4 ">
              <div>
                <div className="text-text-400 font-body1">You will receive </div>
                <span className="font-title2 text-white mt-1">
                  {props.exchangeRes.claimableAmount?.decimalPlaces(6, 1).toString()} PLY
                </span>
              </div>
            </div>
            <div className="md:font-body3 font-body1 h-[50px] flex items-center bg-card-500 border-t border-b border-text-800/[0.5] px-5 mt-4">
              <span className="md:font-subtitle4 font-caption2 mr-1">
                {props.exchangeRes.vestedAmount?.toFixed(2)} PLY
              </span>{" "}
              will be vested for upto 05-Jan-2025{" "}
            </div>
          </div>

          <div className="mt-[16px]">
            <Button color={"primary"} onClick={props.handleClick}>
              Confirm
            </Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ConfirmMigrate;
