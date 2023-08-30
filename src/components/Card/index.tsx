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
          " rounded-lg	justify-between flex-col landingBottom ml-6 mr-8 md:mx-6  p-4 md:px-2.5 md:py-[14px] w-auto  md:w-[184px] h-[194px] md:h-[105px] cursor-pointer "
        )}
        onClick={() => props.setShowTutorial(true)}
      >
        <div className=" w-[175px] md:w-[113px] text-white font-title-f20 md:font-body1">
          Explore V3 and it features
        </div>

        <div className="h-[38px] md:h-[36px] w-fit bg-black rounded text-blue-700  text-center px-[22px] font-subtitle4 md:font-caption2  mt-2 py-2.5 cursor-pointer">
          Get started with V3
        </div>
      </div>
    </>
  );
}

export default BottomCard;
