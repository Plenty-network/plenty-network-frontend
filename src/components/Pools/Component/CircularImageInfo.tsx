import Image from "next/image";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { changeSource, imageExists } from "../../../api/util/helpers";
import { useAppSelector } from "../../../redux";
import fallback from "../../../assets/icon/pools/fallback.png";

export interface ICircularImageInfoProps {
  imageArray?: Array<any>;
  className?: string;
  isSecoundIconBorder?: boolean;
}

export function CircularImageInfo(props: ICircularImageInfoProps) {
  const { className = "" } = props;

  return (
    <div className={`pl-1 flex flex-row ${className}`}>
      {props.imageArray?.map((token, i) => {
        if (props.isSecoundIconBorder) {
          return (
            <ImageCircle
              key={`CircularImageInfo_${i}`}
              className={`border-[0.94px] border-muted-235 rounded-full z-${i}`}
              src={token}
            />
          );
        }
        return <ImageCircle key={`CircularImageInfo_${i}`} src={token} />;
      })}
    </div>
  );
}
export const CircularOverLappingImage = (props: {
  tokenA: String;
  tokenB: String;
  src1: string;
  src2: string;
}) => {
  const TOKEN = useAppSelector((state) => state.config.tokens);

  return (
    <div className=" flex justify-center items-center">
      <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
        <img
          alt={"alt"}
          src={
            imageExists(props.src1)
              ? props.src1
              : TOKEN[props.tokenA?.toString()]
              ? TOKEN[props.tokenA?.toString()].iconUrl
              : `/assets/Tokens/fallback.png`
          }
          width={isMobile ? "19px" : "24px"}
          height={isMobile ? "19px" : "24px"}
          onError={changeSource}
        />
      </div>
      <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
        <img
          alt={"alt"}
          src={
            imageExists(props.src2)
              ? props.src2
              : TOKEN[props.tokenB?.toString()]
              ? TOKEN[props.tokenB?.toString()].iconUrl
              : `/assets/Tokens/fallback.png`
          }
          width={isMobile ? "19px" : "24px"}
          height={isMobile ? "19px" : "24px"}
          onError={changeSource}
        />
      </div>
    </div>
  );
};

export interface IImageCircleProps {
  src?: any;
  width?: string;
  height?: string;
  className?: string;
}

export function ImageCircle(props: IImageCircleProps) {
  const { className = "" } = props;
  return (
    <span className={`w-[19px] h-[19px] md:w-[28px] md:h-[28px] -ml-1 ${className}`}>
      <Image
        alt={"alt"}
        src={props.src}
        width={isMobile ? "19px" : "28px"}
        height={isMobile ? "19px" : "28px"}
      />
    </span>
  );
}
