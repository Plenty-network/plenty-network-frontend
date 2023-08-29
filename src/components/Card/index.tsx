import Image from "next/image";
import close from "../../assets/icon/common/closeIcon.svg";
import clsx from "clsx";
import "animate.css";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../redux";
import { FIRST_TIME_DISCLAIMER } from "../../constants/localStorage";
import Tutorial from "../Tutorial";

interface ILandingPageProps {
  setShowTutorial: React.Dispatch<React.SetStateAction<boolean>>;
}
function BottomCard(props: ILandingPageProps) {
  const dispatch = useAppDispatch();

  return (
    <>
      <div
        className={clsx(
          " rounded-lg	 landingBottom mx-6   px-2.5 py-[14px]  w-[184px] h-[105px] cursor-pointer "
        )}
        onClick={() => props.setShowTutorial(true)}
      >
        <div className=" w-[113px] text-white  font-body1">Explore V3 and it features</div>

        <div className=" h-[36px] bg-black rounded text-blue-700  text-center px-[22px] font-caption2  mt-2 py-2.5 cursor-pointer">
          Get started with V3
        </div>
      </div>
    </>
  );
}

export default BottomCard;
