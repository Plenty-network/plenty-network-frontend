import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";

import { isMobile } from "react-device-detect";
import drop from "../../../src/assets/icon/bribes/addBribes.svg";
import checkViolet from "../../../src/assets/icon/bribes/checkViolet.svg";
import checkDisable from "../../../src/assets/icon/bribes/checkDisable.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import React, { useState, useMemo, useEffect } from "react";
import { store } from "../../redux";
import { IAddBribes } from "./types";
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
import ConfirmAddBribes from "./ConfirmBribes";

function AddBribes(props: IAddBribes) {
  const [swapModalShow, setSwapModalShow] = useState(false);
  const tokens = store.getState().config.standard;
  const tokenPrice = store.getState().tokenPrice.tokenPrice;
  const userAddress = store.getState().wallet.address;
  const [isFirstInputFocus, setIsFirstInputFocus] = useState(false);
  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });
  useEffect(() => {
    if (userAddress) {
      getCompleteUserBalace(userAddress).then((response: IAllBalanceResponse) => {
        setAllBalance(response);
      });
    } else {
      setAllBalance({ success: false, userBalance: {} });
    }
  }, [userAddress, tokens]);
  const [listofEpoch, setListofEpoch] = useState<IEpochDataResponse>({} as IEpochDataResponse);
  const [listofendEpoch, setListofendEpoch] = useState<IEpochListObject[]>(
    [] as IEpochListObject[]
  );
  const [isSelectedEpoch, setIsSelectedEpoch] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  useEffect(() => {
    getNextListOfEpochs().then((res) => {
      setListofEpoch(res);
      console.log(res);
    });
  }, []);
  const tokensArray = Object.entries(tokens);
  const tokensListConfig = useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1].symbol}.png`,
      new: token[1].extras?.isNew as boolean,
      chainType: token[1].extras?.chain as Chain,
      address: token[1].address,
    }));
  }, [tokens]);
  const currentEpoch = store.getState().epoch.currentEpoch;
  const closeModal = () => {
    props.setShow(false);
  };
  const handleTokenInput = (input: string | number) => {
    if (input === "" || isNaN(Number(input))) {
      props.setBribeInputValue("");
    } else {
      props.setBribeInputValue(input.toString());
    }
  };
  const onClickAmount = () => {
    props.setBribeInputValue("");

    props.bribeToken.name === "tez"
      ? handleTokenInput(Number(allBalance.userBalance[props.bribeToken.name]) - 0.02)
      : handleTokenInput(allBalance.userBalance[props.bribeToken.name].toNumber());
  };
  const [selectedDropDown, setSelectedDropDown] = useState<IEpochListObject>(
    {} as IEpochListObject
  );
  const [selectedEndDropDown, setSelectedEndDropDown] = useState<IEpochListObject>(
    {} as IEpochListObject
  );
  useEffect(() => {
    if (selectedDropDown.epochNumber) {
      getNextListOfEpochs().then((res) => {
        const d = res.epochData.filter((e: IEpochListObject) => {
          return e.epochNumber > selectedDropDown.epochNumber;
        });
        setListofendEpoch(d);
        console.log(d);
      });
    }
  }, [selectedDropDown.epochNumber]);

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const handleTokenType = () => {
    setSwapModalShow(true);
  };
  const selectToken = (token: tokensModal) => {
    props.setBribeToken({
      name: token.name,
      image: token.image,
    });

    setSwapModalShow(false);
  };
  return (
    <>
      {props.show ? (
        <PopUpModal
          onhide={closeModal}
          isFullSizeOnMobile={true}
          Name={"addBribes"}
          className="  md:w-[602px] md:max-w-[602px]"
        >
          {
            <>
              <div className="flex ">
                <div className="mx-2 text-white font-title3">Add bribes</div>
                <div className="relative top-[2px]">
                  <Image alt={"alt"} src={info} />
                </div>
              </div>
              <div className="border bg-card-200 mt-3 border-text-800 rounded-2xl  pt-[16px] pb-[20px]">
                <div className="text-text-250 font-body4 px-3 md:px-4">Select epochs</div>
                <div className="flex items-center mt-[14px] px-[18px] cursor-pointer">
                  {!isSelectedEpoch ? (
                    <Image
                      alt={"alt"}
                      src={checkDisable}
                      onClick={() => setIsSelectedEpoch(true)}
                    />
                  ) : (
                    <Image
                      alt={"alt"}
                      src={checkViolet}
                      onClick={() => setIsSelectedEpoch(false)}
                    />
                  )}

                  <span
                    className={clsx(
                      " font-body2 ml-[7px]",
                      isSelectedEpoch ? "text-white" : "text-text-500"
                    )}
                  >
                    Bribe for the selected epoch only{" "}
                  </span>
                </div>
                <div className="px-5 mt-2.5 flex gap-2.5">
                  <EpochDropdown
                    title={isMobile ? "Select start epoch" : "Select your start epoch"}
                    Options={listofEpoch?.epochData}
                    selectedText={selectedDropDown}
                    onClick={setSelectedDropDown}
                    className=""
                  />
                  <EpochDropdown
                    title={isMobile ? "Select end epoch" : "Select your end epoch"}
                    Options={listofendEpoch}
                    isDisabled={isSelectedEpoch}
                    selectedText={selectedEndDropDown}
                    onClick={setSelectedEndDropDown}
                    className=""
                  />
                </div>
                <div className="mt-4 border-t border-text-800/[0.5]"></div>
                <div className="mt-4 text-text-250 font-body4 px-4">
                  Choose your token and add bribe amount for each epoch
                </div>
                <div
                  className={clsx(
                    " mt-4 h-[102px] border bg-muted-200/[0.1]  mx-4  rounded-2xl px-4 hover:border-text-700",

                    true ? "border-text-700" : "border-text-800 "
                  )}
                >
                  <div className="flex ">
                    <div className={clsx(" mt-4", "w-full ")}>
                      {Object.keys(props.bribeToken).length !== 0 ? (
                        <TokenDropdown
                          onClick={() => handleTokenType()}
                          tokenIcon={props.bribeToken.image}
                          tokenName={
                            props.bribeToken.name === "tez"
                              ? "TEZ"
                              : props.bribeToken.name === "ctez"
                              ? "CTEZ"
                              : props.bribeToken.name
                          }
                        />
                      ) : (
                        <TokenDropdown
                          tokenName="Select a token"
                          onClick={() => handleTokenType()}
                        />
                      )}
                    </div>
                    <div className="flex-auto my-3 ">
                      <div className="text-right font-body1 text-text-400">YOU PAY</div>
                      <div>
                        {Object.keys(props.bribeToken).length !== 0 ? (
                          <input
                            type="text"
                            className={clsx(
                              "text-white bg-card-500 text-right border-0 font-medium2  lg:font-medium1 outline-none w-[100%] placeholder:text-text-500"
                            )}
                            placeholder="0.0"
                            lang="en"
                            onChange={(e) => props.setBribeInputValue(e.target.value)}
                            value={props.bribeInputValue}
                            onFocus={() => setIsFirstInputFocus(true)}
                            onBlur={() => setIsFirstInputFocus(false)}
                          />
                        ) : (
                          <input
                            type="text"
                            className={clsx(
                              "text-primary-500 inputSecond  text-right border-0 w-[100%]  font-input-text lg:font-medium1 outline-none "
                            )}
                            placeholder="--"
                            disabled
                            value={"--"}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex -mt-[12px]">
                    <div className="text-left cursor-pointer" onClick={onClickAmount}>
                      <span className="text-text-600 font-body3">Balance:</span>{" "}
                      <span className="font-body4 text-primary-500 ">
                        {Number(allBalance.userBalance[props.bribeToken.name]) >= 0 ? (
                          <ToolTip
                            message={allBalance.userBalance[props.bribeToken.name].toString()}
                            id="tooltip8"
                            position={Position.right}
                          >
                            {Number(allBalance.userBalance[props.bribeToken.name]).toFixed(4)}
                          </ToolTip>
                        ) : (
                          "--"
                        )}
                      </span>
                    </div>
                    <div className="text-right ml-auto font-body2 text-text-400">
                      ~$
                      {props.bribeInputValue && tokenPrice[props.bribeToken.name]
                        ? Number(
                            Number(props.bribeInputValue) *
                              Number(tokenPrice[props.bribeToken.name])
                          ).toFixed(2)
                        : "0.00"}
                    </div>
                  </div>
                </div>
                <div className="flex h-[50px] items-center border-t border-b border-text-800/[0.5] bg-card-500 mt-[22px] px-5">
                  <div className="flex items-center ">
                    <span className="flex">
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
                    </span>
                    <span className="text-white font-body4  relative top-[1px]">CTEZ/TEZ</span>
                  </div>
                  <div className="ml-auto font-body4 text-white flex items-center">
                    <Image src={drop} />
                    $23.34
                  </div>
                </div>
                <div className="font-body2 text-text-250 mt-4 mx-5">
                  You are adding a bribe of
                  <span className="text-white ml-1">150 USDT</span> from Epoch 23-26 ( 29 Sep,2022
                  to 12 Oct 2022)
                </div>
              </div>

              <div className="mt-[18px]">
                <Button color="primary" onClick={() => setIsConfirm(true)}>
                  Add bribes
                </Button>
              </div>
            </>
          }
        </PopUpModal>
      ) : null}
      <TokenModal
        tokens={tokensListConfig}
        show={swapModalShow}
        allBalance={allBalance.userBalance}
        selectToken={selectToken}
        onhide={setSwapModalShow}
        tokenIn={props.bribeToken}
      />
      <ConfirmAddBribes show={isConfirm} setShow={setIsConfirm} />
    </>
  );
}

export default AddBribes;
