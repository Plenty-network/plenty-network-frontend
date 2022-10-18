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
    claimFaucet(undefined, undefined, undefined).then((res) => {
      if (res.success) {
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim faucet`,
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
            trailingText: `Claim faucet`,
            linkText: "",
            isLoading: true,
          })
        );
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  return (
    <div
      className={clsx(
        "fixed w-full gradient h-[38px] flex items-center justify-center font-subtitle1 text-white z-10",
        (!isBanner || !isB) && "hidden"
      )}
    >
      <p className="w-full text-center">
        YOU ARE LIVE ON GHOSTNET, CLAIM YOUR FAUCET{" "}
        <span className="font-subtitle2 cursor-pointer" onClick={handleFaucet}>
          HERE
        </span>
      </p>
      <p
        className="text-right mr-2 md:mr-[10px] cursor-pointer"
        onClick={() => {
          setIsB(true);
          dispatch(setIsBanner(false));
        }}
      >
        <div className="close"></div>
      </p>
    </div>
  );
}

export default Banner;
