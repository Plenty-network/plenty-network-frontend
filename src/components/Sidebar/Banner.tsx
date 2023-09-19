import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { claimFaucet } from "../../operations/faucet";
import { useAppDispatch, useAppSelector } from "../../redux";
import { setFlashMessage } from "../../redux/flashMessage";
import { setbannerClicked, setIsBanner, setIsLoadingWallet } from "../../redux/walletLoading";
import { Flashtype } from "../FlashScreen";

interface IBanner {
  isBanner: boolean;

  setIsBanner: React.Dispatch<React.SetStateAction<boolean>>;
}
function Banner(props: IBanner) {
  const dispatch = useAppDispatch();
  const percentage = useAppSelector((state) => state.rewardsApr.rewardsAprEstimate);

  // const handleFaucet = () => {
  //   claimFaucet(undefined, undefined, undefined, {
  //     flashType: Flashtype.Info,
  //     headerText: "Transaction submitted",
  //     trailingText: `Claim test tokens on Ghostnet `,
  //     linkText: "View in block explorer",
  //     isLoading: true,
  //     transactionId: "",
  //   }).then((res) => {
  //     if (res.success) {
  //       setTimeout(() => {
  //         dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
  //         dispatch(
  //           setFlashMessage({
  //             flashType: Flashtype.Success,
  //             headerText: "Success",
  //             trailingText: `Claim test tokens on Ghostnet`,
  //             linkText: "View in block explorer",
  //             isLoading: true,
  //             transactionId: "",
  //           })
  //         );
  //       }, 6000);
  //     } else {
  //       dispatch(
  //         setFlashMessage({
  //           flashType: Flashtype.Rejected,
  //           transactionId: "",
  //           headerText: "Rejected",
  //           trailingText:
  //             res.error === "NOT_ENOUGH_TEZ"
  //               ? `You do not have enough tez`
  //               : `Claim test tokens on Ghostnet`,
  //           linkText: "",
  //           isLoading: true,
  //         })
  //       );
  //       dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
  //     }
  //   });
  // };
  const [isHover, setHover] = useState(false);
  const handleClick = () => {
    dispatch(setbannerClicked(true));
  };
  const handleClose = () => {
    dispatch(setIsBanner(false));
  };
  return (
    <div
      className={clsx(
        "fixed w-full gradient h-[38px] flex items-center justify-center font-f11-500 md:font-subtitle1 text-white z-10",
        !props.isBanner && "hidden"
      )}
    >
      <Link href={"/vote"}>
        <p className="w-full h-[38px] pt-[10px] text-center cursor-pointer" onClick={handleClick}>
          {!isMobile
            ? `Earn up to ${
                Number(percentage) > 0 ? Number(percentage)?.toFixed(1) : "-"
              }% APR in bribes and fee rewards by locking PLY for 4 years and voting every week.`
            : `Earn up to ${
                Number(percentage) > 0 ? Number(percentage)?.toFixed(1) : "-"
              }% APR by vote locking your PLY`}
        </p>
      </Link>
      <p
        className="text-right mr-2 md:mr-[10px] cursor-pointer"
        onClick={() => {
          handleClose();
        }}
      >
        <div
          className={clsx(
            "w-[18px] h-[18px] rounded-full flex items-center justify-center ",
            isHover ? "bg-info-200 closeboxShadow" : "bg-info-100"
          )}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className={clsx(isHover ? "closeHover" : "close")}></div>
        </div>
      </p>
    </div>
  );
}

export default Banner;
