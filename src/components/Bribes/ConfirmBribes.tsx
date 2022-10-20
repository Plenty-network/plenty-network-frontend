import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import epoachIcon from "../../assets/icon/common/epochTimeIcon.svg";
import Button from "../Button/Button";
import React from "react";
import { IConfirmAddBribes } from "./types";

function ConfirmAddBribes(props: IConfirmAddBribes) {
  const closeModal = () => {
    props.setShow(false);
  };

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const dateFormat = (dates: number) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var date = new Date(dates);
    var month = date.getMonth();

    return `${("0" + date.getDate()).slice(-2)}-${monthNames[month]}-${date.getFullYear()}`;
  };

  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

  return (
    <>
      {props.show ? (
        <PopUpModal
          onhide={closeModal}
          isFullSizeOnMobile={true}
          Name={"addBribes"}
          className="w-[400px] max-w-[400px]  md:w-[602px] md:max-w-[602px]"
        >
          {
            <>
              <div className="flex ">
                <div className="cursor-pointer" onClick={() => props.setShow(false)}>
                  <Image alt={"alt"} src={arrowLeft} />
                </div>
                <div className="mx-2 text-white font-title3">Add bribes</div>
                {/* <div className="relative top-[2px]">
                  <Image alt={"alt"} src={info} />
                </div> */}
              </div>
              <div className="border bg-card-200 mt-3 border-text-800 rounded-2xl   ">
                <div className="flex bg-card-500 rounded-t-2xl h-[51px] items-center ">
                  <p className="text-text-50 font-body2 md:font-body4 ml-3 md:ml-5">
                    Your are adding bribes for
                  </p>
                  <p className="ml-auto pr-3 md:pr-5 flex justify-center items-center">
                    <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                      <Image
                        alt={"alt"}
                        src={getImagesPath(props.selectedPool.tokenA)}
                        width={"24px"}
                        height={"24px"}
                      />
                    </div>
                    <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                      <Image
                        alt={"alt"}
                        src={getImagesPath(props.selectedPool.tokenB)}
                        width={"24px"}
                        height={"24px"}
                      />
                    </div>
                    <div>
                      <div className="font-body4">
                        {" "}
                        {tEZorCTEZtoUppercase(props.selectedPool.tokenA.toString())}/
                        {tEZorCTEZtoUppercase(props.selectedPool.tokenB.toString())}
                      </div>
                    </div>
                  </p>
                </div>

                <div className="text-text-500 mt-[14px] font-body3 mx-3 md:mx-5">Bribe:</div>
                <div className="mx-3 md:mx-5 flex items-center mt-1.5">
                  <Image src={getImagesPath(props.token.name)} width={"25px"} height={"25px"} />
                  <span className="font-body4 ml-2">
                    {props.value} {tEZorCTEZtoUppercase(props.token.name)}
                  </span>
                  <span className="text-text-500 font-body4 ml-1">{`(${props.perEpoch}/epoch)`}</span>
                </div>
                <div className="mt-5 mx-3 md:mx-5 font-body3 text-text-500">For a period of:</div>
                <div className="mx-3 md:mx-5 flex items-center mt-1.5">
                  <Image src={epoachIcon} width={"26px"} height={"26px"} />
                  <span className="font-body4 ml-2">
                    Epoch {props.selectedDropDown.epochNumber} {!props.isSelectedEpoch && "-"}{" "}
                    {!props.isSelectedEpoch && props.selectedEndDropDown.epochNumber}
                  </span>
                </div>
                <div className="font-body3 text-text-500 mx-3 md:mx-5 mt-2 mb-5">
                  ({dateFormat(props.selectedDropDown.startTimestamp)} to{" "}
                  {props.isSelectedEpoch
                    ? dateFormat(props.selectedDropDown.endTimestamp)
                    : dateFormat(props.selectedEndDropDown.endTimestamp)}
                  )
                </div>
              </div>

              <div className="mt-[18px]">
                <Button color="primary" onClick={props.handleOperation}>
                  Confirm
                </Button>
              </div>
            </>
          }
        </PopUpModal>
      ) : null}
    </>
  );
}

export default ConfirmAddBribes;
