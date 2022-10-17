import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import close from "../../assets/icon/common/closeDefault.svg";
import { store, useAppDispatch } from "../../redux";
import { setIsBanner } from "../../redux/walletLoading";

interface ISearchBarProps {}
function Banner(props: ISearchBarProps) {
  const dispatch = useAppDispatch();
  const isBanner = store.getState().walletLoading.isBanner;
  const [isB, setIsB] = useState(isBanner);

  return (
    <div
      className={clsx(
        "fixed w-full gradient h-[38px] flex items-center justify-center font-subtitle1 text-white z-10",
        (!isBanner || !isB) && "hidden"
      )}
    >
      <p className="w-full text-center">YOU ARE LIVE ON GHOSTNET, CLAIM YOUR FAUCET HERE</p>
      <p
        className="text-right mr-2 md:mr-[10px]"
        onClick={() => {
          setIsB(true);
          dispatch(setIsBanner(false));
        }}
      >
        <Image src={close} />
      </p>
    </div>
  );
}

export default Banner;
