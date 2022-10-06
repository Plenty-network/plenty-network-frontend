import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import lock from "../../../src/assets/icon/vote/lock.svg";

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
import { IAllBalanceResponse } from "../../api/util/types";
import { getCompleteUserBalace } from "../../api/util/balance";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { tokensModal } from "../../constants/swap";

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
  const [selectedDropDown, setSelectedDropDown] = useState("");
  const dateFormat = useMemo(() => {
    var date = new Date(currentEpoch.endTimestamp);
    return `${("0" + date.getUTCDate()).slice(-2)}/${("0" + (date.getUTCMonth() + 1)).slice(
      -2
    )}/${date.getUTCFullYear()}, ${("0" + date.getUTCHours()).slice(-2)}:${(
      "0" + date.getUTCMinutes()
    ).slice(-2)}`;
  }, [currentEpoch.endTimestamp]);
  let Options = ["My votes", "Protocol"];

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
      {" "}
      props.show ? (
      <PopUpModal
        onhide={closeModal}
        className="w-[400px] max-w-[400px] px-4 md:px-6 md:w-[602px] md:max-w-[602px]"
      >
        {
          <>
            <div className="flex ">
              {/* <div className="cursor-pointer" onClick={() => props.setShow(false)}>
              <Image alt={"alt"} src={arrowLeft} />
            </div> */}
              <div className="mx-2 text-white font-title3">Add bribes</div>
              <div className="relative top-[2px]">
                <Image alt={"alt"} src={info} />
              </div>
            </div>
            <div className="border bg-card-200 mt-3 border-text-800 rounded-2xl  pt-[16px] pb-[20px]">
              <div className="text-text-250 font-body4 px-3 md:px-4">Select epochs</div>
              <div className="flex items-center mt-[14px] px-[18px]">
                <Image src={checkDisable} />
                <span className="text-text-500 font-body2 ml-[7px]">
                  Bribe for the selected epoch only{" "}
                </span>
              </div>
              <div className="px-5 mt-2.5 flex gap-2.5">
                <EpochDropdown
                  title="Select your start epoch"
                  Options={Options}
                  selectedText={selectedDropDown}
                  onClick={setSelectedDropDown}
                  className=""
                />
                <EpochDropdown
                  title="Select your end epoch"
                  Options={Options}
                  selectedText={selectedDropDown}
                  onClick={setSelectedDropDown}
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
                  <div className={clsx(" mt-4", "w-full sm:w-auto")}>
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
                      <TokenDropdown tokenName="Select a token" onClick={() => handleTokenType()} />
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
                          Number(props.bribeInputValue) * Number(tokenPrice[props.bribeToken.name])
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
                <div className="ml-auto font-body4 text-white">$23.34</div>
              </div>
              <div className="font-body2 text-text-250 mt-4 mx-5">
                You are adding a bribe of
                <span className="text-white ml-1">150 USDT</span> from Epoch 23-26 ( 29 Sep,2022 to
                12 Oct 2022)
              </div>
            </div>

            <div className="mt-[18px]">
              <Button color="primary">Add bribes</Button>
            </div>
          </>
        }
      </PopUpModal>
      ) : null;
      <TokenModal
        tokens={tokensListConfig}
        show={swapModalShow}
        allBalance={allBalance.userBalance}
        selectToken={selectToken}
        onhide={setSwapModalShow}
        tokenIn={props.bribeToken}
      />
    </>
  );
}

export default AddBribes;
