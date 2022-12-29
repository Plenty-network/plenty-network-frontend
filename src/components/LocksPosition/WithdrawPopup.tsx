import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import infoblue from "../../assets/icon/myPortfolio/Info_fill.svg";
import lock from "../../assets/icon/myPortfolio/purple_lock.svg";
import { BigNumber } from "bignumber.js";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import ply from "../../assets/Tokens/ply.png";
import Button from "../Button/Button";
import { IUnclaimedRewardsForLockData } from "../../api/portfolio/types";
import { Position, ToolTip, TooltipType } from "../Tooltip/TooltipAdvanced";

interface IWithdrawPlyProps {
  show: boolean;
  handleWithdraw: () => void;
  setShow: any;
  ply: BigNumber;
  dollarValue?: BigNumber;
  unclaimedDataTokenId: IUnclaimedRewardsForLockData;
  handleWithdrawClaimOperation: () => void;
}
function WithdrawPly(props: IWithdrawPlyProps) {
  const closeModal = () => {
    props.setShow(false);
  };
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "K";
    }

    return num.toFixed(2);
  }
  return props.show ? (
    <PopUpModal
      onhide={closeModal}
      className="w-[400px] max-w-[400px]  md:w-[602px] md:max-w-[602px]"
    >
      {
        <>
          <div className="flex">
            <div className="cursor-pointer" onClick={closeModal}>
              <Image alt={"alt"} src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Withdraw locks</div>
          </div>
          <div className="border border-text-800 bg-card-200 p-4 mt-3 rounded-2xl">
            <div className="text-text-400 font-body1 ">You will receive </div>
            <div className="flex mt-[11px] items-center">
              <Image alt={"alt"} src={ply} width={"28px"} height={"28px"} />
              <span className="text-white font-body4 ml-2">
                {props.ply ? props.ply.toNumber() : "0"}
              </span>
              <span className="text-text-500 font-body3 ml-1">PLY</span>
            </div>
          </div>
          {props.unclaimedDataTokenId.unclaimedRewardsExist && (
            <div className="mt-3 font-body2 text-text-250 pl-2 md:flex md:items-center">
              Unclaimed rewards that would be claimed before withdrawing{" "}
              <span className="flex items-center">
                <span className="text-white font-body2 ml-1">
                  $
                  {Number(
                    props.unclaimedDataTokenId.lockRewardsData.unclaimedBribesValue.plus(
                      props.unclaimedDataTokenId.lockRewardsData.unclaimedFeesValue
                    )
                  ) > 0
                    ? props.unclaimedDataTokenId.lockRewardsData.unclaimedBribesValue
                        .plus(props.unclaimedDataTokenId.lockRewardsData.unclaimedFeesValue)
                        .isLessThan(0.01)
                      ? "<0.01"
                      : nFormatter(
                          props.unclaimedDataTokenId.lockRewardsData.unclaimedBribesValue.plus(
                            props.unclaimedDataTokenId.lockRewardsData.unclaimedFeesValue
                          )
                        )
                    : "0"}{" "}
                  +
                </span>
                <span className="flex items-center font-body2">
                  <span className="ml-1 relative top-px">
                    <ToolTip
                      message={"Unclaimed inflation"}
                      id="tooltip8"
                      type={TooltipType.withoutArrowsAndTitle}
                      position={Position.top}
                    >
                      <Image
                        alt={"alt"}
                        src={lock}
                        width={"16px"}
                        height={"16px"}
                        className="cursor-pointer"
                      />
                    </ToolTip>
                  </span>
                  <span className="text-white ml-0.5">
                    {Number(props.unclaimedDataTokenId.lockRewardsData.unclaimedInflationInPLY) > 0
                      ? props.unclaimedDataTokenId.lockRewardsData.unclaimedInflationInPLY.isLessThan(
                          0.01
                        )
                        ? "<0.01"
                        : nFormatter(
                            props.unclaimedDataTokenId.lockRewardsData.unclaimedInflationInPLY
                          )
                      : "0"}{" "}
                    PLY
                  </span>
                </span>
              </span>
            </div>
          )}
          <div className="mt-[24px]">
            <Button
              color={"primary"}
              onClick={
                props.unclaimedDataTokenId.unclaimedRewardsExist
                  ? props.handleWithdrawClaimOperation
                  : props.handleWithdraw
              }
            >
              {props.unclaimedDataTokenId.unclaimedRewardsExist ? "Claim and withdraw" : "Withdraw"}
            </Button>
          </div>
          {props.unclaimedDataTokenId.unclaimedRewardsExist && (
            <div className="flex items-center mt-5 ml-1">
              <Image src={infoblue} />
              <span className="font-body2 text-info-500 ml-3">
                Rewards cannot be claimed in a single transaction due to gas limit. Please claim
                manually before withdrawing
              </span>
            </div>
          )}
        </>
      }
    </PopUpModal>
  ) : null;
}

export default WithdrawPly;
