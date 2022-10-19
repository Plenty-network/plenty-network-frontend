import Image from "next/image";
import * as React from "react";
import { isMobile } from "react-device-detect";

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
export const CircularOverLappingImage = (props: { src1: string; src2: string }) => {
  return (
    <div className=" flex justify-center items-center">
      <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
        <Image
          alt={"alt"}
          src={props.src1}
          width={isMobile ? "19px" : "24px"}
          height={isMobile ? "19px" : "24px"}
        />
      </div>
      <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
        <Image
          alt={"alt"}
          src={props.src2}
          width={isMobile ? "19px" : "24px"}
          height={isMobile ? "19px" : "24px"}
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
