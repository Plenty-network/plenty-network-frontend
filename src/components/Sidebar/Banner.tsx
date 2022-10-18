import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import close from "../../assets/icon/common/closeDefault.svg";
import { claimFaucet } from "../../operations/faucet";
import { store, useAppDispatch } from "../../redux";
import { setFlashMessage } from "../../redux/flashMessage";
import { setIsBanner, setIsLoadingWallet } from "../../redux/walletLoading";
import { Flashtype } from "../FlashScreen";

interface ISearchBarProps {}
function Banner(props: ISearchBarProps) {
  const dispatch = useAppDispatch();
  const isBanner = store.getState().walletLoading.isBanner;
  const [isB, setIsB] = useState(isBanner);
  const handleFaucet = () => {
    claimFaucet(undefined, undefined, undefined, {
      flashType: Flashtype.Info,
      headerText: "Transaction submitted",
      trailingText: `Claim test tokens on Ghostnet submitted`,
      linkText: "View in Explorer",
      isLoading: true,
      transactionId: "",
    }).then((res) => {
      if (res.success) {
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim test tokens on Ghostnet`,
              linkText: "View in Explorer",
              isLoading: true,
              transactionId: "",
            })
          );
        }, 2000);
      } else {
        dispatch(
          setFlashMessage({
            flashType: Flashtype.Rejected,
            transactionId: "",
            headerText: "Rejected",
            trailingText: `Claim test tokens on Ghostnet`,
            linkText: "",
            isLoading: true,
          })
        );
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const [isHover, setHover] = useState(false);
  return (
    <div
      className={clsx(
        "fixed w-full gradient h-[38px] flex items-center justify-center font-mobile-f1020 md:font-subtitle1 text-white z-10",
        (!isBanner || !isB) && "hidden"
      )}
    >
      <p className="w-full text-center cursor-pointer" onClick={handleFaucet}>
        YOU ARE LIVE ON GHOSTNET, CLAIM YOUR TEST TOKENS HERE{" "}
      </p>
      <p
        className="text-right mr-2 md:mr-[10px] cursor-pointer"
        onClick={() => {
          setIsB(true);
          dispatch(setIsBanner(false));
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
