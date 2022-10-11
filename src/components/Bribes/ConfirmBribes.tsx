import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import epoachIcon from "../../assets/icon/common/epochTimeIcon.svg";
import drop from "../../../src/assets/icon/bribes/addBribes.svg";
import checkViolet from "../../../src/assets/icon/bribes/checkViolet.svg";
import checkDisable from "../../../src/assets/icon/bribes/checkDisable.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import React, { useState, useMemo, useEffect } from "react";
import { store } from "../../redux";
import { IAddBribes, IConfirmAddBribes } from "./types";
import { EpochDropdown } from "./EpochDropdown";
import clsx from "clsx";
import TokenDropdown from "../TokenDropdown/TokenDropdown";
import { Chain } from "../../config/types";
import TokenModal from "./TokenModal";
import { BigNumber } from "bignumber.js";
import { IAllBalanceResponse, IEpochDataResponse, IEpochListObject } from "../../api/util/types";
import { getCompleteUserBalace } from "../../api/util/balance";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { tokensModal } from "../../constants/swap";
import { getNextListOfEpochs } from "../../api/util/epoch";

function ConfirmAddBribes(props: IConfirmAddBribes) {
  const closeModal = () => {
    props.setShow(false);
  };

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
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
                <div className="relative top-[2px]">
                  <Image alt={"alt"} src={info} />
                </div>
              </div>
              <div className="border bg-card-200 mt-3 border-text-800 rounded-2xl   ">
                <div className="flex bg-card-500 h-[51px] items-center mx-3 md:mx-5">
                  <p className="text-text-50 font-body2 md:font-body4">
                    Your are adding bribes for
                  </p>
                  <p className="ml-auto flex justify-center items-center">
                    <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                      <Image
                        alt={"alt"}
                        src={getImagesPath("ctez")}
                        width={"24px"}
                        height={"24px"}
                      />
                    </div>
                    <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                      <Image
                        alt={"alt"}
                        src={getImagesPath("tez")}
                        width={"24px"}
                        height={"24px"}
                      />
                    </div>
                    <div>
                      <div className="font-body4">
                        {" "}
                        {tEZorCTEZtoUppercase("ctez".toString())}/
                        {tEZorCTEZtoUppercase("tez".toString())}
                      </div>
                    </div>
                  </p>
                </div>

                <div className="text-text-500 mt-[14px] font-body3 mx-3 md:mx-5">Token:</div>
                <div className="mx-3 md:mx-5 flex items-center mt-1.5">
                  <Image src={getImagesPath("ctez")} width={"25px"} height={"25px"} />
                  <span className="font-body4 ml-2">38.90 USDT</span>
                </div>
                <div className="mt-5 mx-3 md:mx-5 font-body3 text-text-500">For a period of:</div>
                <div className="mx-3 md:mx-5 flex items-center mt-1.5">
                  <Image src={epoachIcon} width={"26px"} height={"26px"} />
                  <span className="font-body4 ml-2">Epoch 23-29 </span>
                </div>
                <div className="font-body3 text-text-500 mx-3 md:mx-5 mt-2 mb-5">
                  (29 Sep,2022 to 06 Sep,2022)
                </div>
              </div>

              <div className="mt-[18px]">
                <Button color="primary">Confirm</Button>
              </div>
            </>
          }
        </PopUpModal>
      ) : null}
    </>
  );
}

export default ConfirmAddBribes;
