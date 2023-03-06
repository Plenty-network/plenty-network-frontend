import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import { isMobile } from "react-device-detect";
import drop from "../../../src/assets/icon/bribes/addBribes.svg";
import checkViolet from "../../../src/assets/icon/bribes/checkViolet.svg";
import checkDisable from "../../../src/assets/icon/bribes/checkDisable.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import React, { useState, useMemo, useEffect } from "react";
import { AppDispatch, store, useAppSelector } from "../../redux";
import { IAddBribes } from "./types";
import { EpochDropdown } from "./EpochDropdown";
import clsx from "clsx";
import TokenDropdown from "../TokenDropdown/TokenDropdown";
import { Chain, MigrateToken } from "../../config/types";
import TokenModal from "./TokenModal";
import { BigNumber } from "bignumber.js";
import { IEpochDataResponse, IEpochListObject } from "../../api/util/types";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { tokensModal } from "../../constants/swap";
import { getNextListOfEpochs } from "../../api/util/epoch";
import ConfirmAddBribes from "./ConfirmBribes";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tokenIcons } from "../../constants/tokensList";
import fromExponential from "from-exponential";

function AddBribes(props: IAddBribes) {
  const [swapModalShow, setSwapModalShow] = useState(false);
  const tokens = useAppSelector((state) => state.config.tokens);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const userAddress = useAppSelector((state) => state.wallet.address);
  //const userAddress = "tz1VKAzp3FoerqzvKZTv8aRrg2AD16NjNx9S";
  const [isFirstInputFocus, setIsFirstInputFocus] = useState(false);

  const [listofEpoch, setListofEpoch] = useState<IEpochDataResponse>({} as IEpochDataResponse);
  const [listofendEpoch, setListofendEpoch] = useState<IEpochListObject[]>(
    [] as IEpochListObject[]
  );
  const [isSelectedEpoch, setIsSelectedEpoch] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  useEffect(() => {
    getNextListOfEpochs().then((res) => {
      setListofEpoch(res);
    });
  }, []);
  const tokensArray = Object.entries(tokens);
  const tokensListConfig = useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1].symbol}.png`,

      chainType: token[1].originChain as Chain,
      address: token[1].address,
    }));
  }, [tokens]);
  useEffect(() => {
    tokensListConfig.sort(
      (a, b) => Number(props.allBalance[b.name]) - Number(props.allBalance[a.name])
    );
  }, [tokensListConfig, props.allBalance]);

  const closeModal = () => {
    props.setShow(false);
  };
  const handleTokenInput = (input: string | number) => {
    if (input === "" || isNaN(Number(input))) {
      props.setBribeInputValue("");
    } else {
      props.setBribeInputValue(input.toString().trim());
    }
  };
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "b";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "m";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "k";
    }

    return num.toFixed(2);
  }

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
  const dispatch = useDispatch<AppDispatch>();

  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const onClickAmount = () => {
    props.setBribeInputValue("");

    props.bribeToken.name === "tez"
      ? handleTokenInput(Number(props.allBalance[props.bribeToken.name]?.balance) - 0.02)
      : handleTokenInput(props.allBalance[props.bribeToken.name]?.balance.toString());
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
      });
    }
  }, [selectedDropDown.epochNumber]);

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const handleTokenType = () => {
    props.setBalanceUpdate(false);
    setSwapModalShow(true);
  };
  const selectToken = (token: tokensModal) => {
    props.setBribeToken({
      name: token.name,
      image: token.image,
    });

    setSwapModalShow(false);
  };
  const [bottomValue, setBottomValue] = useState<Number | string>("0");
  useEffect(() => {
    props.setEpochArray([]);
    if (isSelectedEpoch) {
      setBottomValue(props.bribeInputValue);
      setSelectedEndDropDown({} as IEpochListObject);
      if (selectedDropDown.epochNumber > 0) {
        props.setEpochArray([selectedDropDown.epochNumber]);
      }
    } else if (
      selectedEndDropDown.epochNumber > 0 &&
      selectedDropDown.epochNumber > 0 &&
      Number(props.bribeInputValue) > 0
    ) {
      setBottomValue(
        (selectedEndDropDown.epochNumber - selectedDropDown.epochNumber + 1) *
          Number(props.bribeInputValue)
      );
      for (let i = selectedDropDown.epochNumber; i <= selectedEndDropDown.epochNumber; i++) {
        // props.epochArray.push(i);
        props.setEpochArray((prevArray: number[]) => [...prevArray, i]);
      }
    } else {
      setBottomValue(0);
      props.setEpochArray([]);
    }
  }, [
    selectedDropDown.epochNumber,
    selectedEndDropDown.epochNumber,
    props.bribeInputValue,
    isSelectedEpoch,
  ]);
  const BribesButton = useMemo(() => {
    if (userAddress) {
      if (
        (Number(props.bribeInputValue) > 0 &&
          new BigNumber(props.bribeInputValue).isGreaterThan(
            props.allBalance[props.bribeToken.name]?.balance
          )) ||
        Number(bottomValue) > Number(props.allBalance[props.bribeToken.name]?.balance)
      ) {
        return (
          <Button color="disabled" width="w-full">
            InSufficient Balance
          </Button>
        );
      } else if (
        Number(props.bribeInputValue) > 0 &&
        new BigNumber(props.bribeInputValue)
          .multipliedBy(new BigNumber(tokenPrice[props.bribeToken.name]))
          .isLessThan(20)
      ) {
        return (
          <Button color="disabled" width="w-full">
            Minimum $20 bribe
          </Button>
        );
      } else if (
        Number(props.bribeInputValue) > 0 &&
        (!isSelectedEpoch ? selectedEndDropDown.epochNumber > 0 : selectedDropDown.epochNumber > 0)
      ) {
        return (
          <Button
            color="primary"
            width="w-full"
            onClick={() => {
              setIsConfirm(true);
            }}
          >
            Add bribes
          </Button>
        );
      } else {
        return (
          <Button color="disabled" width="w-full">
            Add Bribes
          </Button>
        );
      }
    } else {
      return (
        <Button color="primary" onClick={connectTempleWallet} width="w-full">
          Connect wallet
        </Button>
      );
    }
  }, [
    props.bribeInputValue,
    selectedDropDown.epochNumber,
    selectedEndDropDown.epochNumber,
    isSelectedEpoch,
    bottomValue,
  ]);

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
                  <ToolTip
                    id="tooltip2"
                    position={Position.top}
                    toolTipChild={
                      <div className="w-[100px] md:w-[250px]">
                        Bribe voters to direct emissions towards your pool.
                      </div>
                    }
                  >
                    <Image alt={"alt"} src={info} className="cursor-pointer" />
                  </ToolTip>
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
                    isDisabled={selectedDropDown.epochNumber == undefined || isSelectedEpoch}
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
                    " mt-4 h-[102px] border   mx-4  rounded-2xl px-4 ",

                    (Number(props.bribeInputValue) > 0 &&
                      new BigNumber(props.bribeInputValue).isGreaterThan(
                        props.allBalance[props.bribeToken.name]?.balance
                      )) ||
                      Number(bottomValue) >
                        Number(props.allBalance[props.bribeToken.name]?.balance) ||
                      (Number(props.bribeInputValue) > 0 &&
                        new BigNumber(props.bribeInputValue)
                          .multipliedBy(new BigNumber(tokenPrice[props.bribeToken.name]))
                          .isLessThan(20))
                      ? "border-error-500/[0.4] bg-error-500/[0.01]"
                      : "border-text-700 bg-muted-200/[0.1] hover:border-text-700"
                  )}
                >
                  <div className="flex ">
                    <div
                      className={clsx(
                        " mt-4",
                        Object.keys(props.bribeToken).length !== 0 ? "flex-none" : "w-full"
                      )}
                    >
                      {Object.keys(props.bribeToken).length !== 0 ? (
                        <TokenDropdown
                          onClick={() => handleTokenType()}
                          tokenIcon={props.bribeToken.image}
                          tokenName={tEZorCTEZtoUppercase(props.bribeToken.name)}
                          tokenSymbol={props.bribeToken.name}
                        />
                      ) : (
                        <TokenDropdown
                          tokenName="Select a token"
                          onClick={() => handleTokenType()}
                          tokenSymbol=""
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
                              "text-white bg-card-500/[0.1] text-right border-0 font-medium2  lg:font-medium1 outline-none w-[100%] placeholder:text-text-500"
                            )}
                            placeholder="0.0"
                            lang="en"
                            onChange={(e) => props.setBribeInputValue(e.target.value.trim())}
                            value={fromExponential(props.bribeInputValue)}
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
                      <span className="font-body4 text-primary-500 cursor-pointer">
                        {Number(props.allBalance[props.bribeToken.name]?.balance) >= 0 ? (
                          <ToolTip
                            message={props.allBalance[props.bribeToken.name]?.balance.toString()}
                            disable={
                              Number(props.allBalance[props.bribeToken.name]?.balance) > 0
                                ? false
                                : true
                            }
                            id="tooltip8"
                            position={Position.right}
                          >
                            {Number(props.allBalance[props.bribeToken.name]?.balance) > 0
                              ? Number(props.allBalance[props.bribeToken.name]?.balance).toFixed(4)
                              : 0}
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
                        <img
                          alt={"alt"}
                          src={
                            tokenIcons[props.selectedPool.tokenA]
                              ? tokenIcons[props.selectedPool.tokenA].src
                              : tokens[props.selectedPool.tokenA.toString()]?.iconUrl
                              ? tokens[props.selectedPool.tokenA.toString()].iconUrl
                              : `/assets/Tokens/fallback.png`
                          }
                          width={"24px"}
                          height={"24px"}
                          onError={changeSource}
                        />
                      </div>
                      <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                        <img
                          alt={"alt"}
                          src={
                            tokenIcons[props.selectedPool.tokenB]
                              ? tokenIcons[props.selectedPool.tokenB].src
                              : tokens[props.selectedPool.tokenB.toString()]?.iconUrl
                              ? tokens[props.selectedPool.tokenB.toString()].iconUrl
                              : `/assets/Tokens/fallback.png`
                          }
                          width={"24px"}
                          height={"24px"}
                          onError={changeSource}
                        />
                      </div>
                    </span>
                    <span className="text-white font-body4  relative top-[1px]">
                      {tEZorCTEZtoUppercase(props.selectedPool.tokenA)}/
                      {tEZorCTEZtoUppercase(props.selectedPool.tokenB)}
                    </span>
                  </div>
                  <div className="ml-auto font-body4 text-white flex items-center">
                    <Image src={drop} />$
                    {Number(props.selectedPool.liquidity) > 0
                      ? props.selectedPool.liquidity.isLessThan(0.01)
                        ? "<0.01"
                        : nFormatter(props.selectedPool.liquidity)
                      : "0"}
                  </div>
                </div>
                {bottomValue > 0 && (
                  <div className="font-body2 text-text-250 mt-4 mx-5">
                    You are adding a bribe of
                    <span
                      className={clsx(
                        "ml-1",
                        Number(bottomValue) >
                          Number(props.allBalance[props.bribeToken.name]?.balance)
                          ? "text-error-500"
                          : "text-white"
                      )}
                    >
                      {Number(bottomValue)} {tEZorCTEZtoUppercase(props.bribeToken.name)}
                    </span>{" "}
                    from Epoch {selectedDropDown.epochNumber} {!isSelectedEpoch && "-"}{" "}
                    {!isSelectedEpoch && selectedEndDropDown.epochNumber} (
                    {dateFormat(selectedDropDown.startTimestamp)} to{" "}
                    {isSelectedEpoch
                      ? dateFormat(selectedDropDown.endTimestamp)
                      : dateFormat(selectedEndDropDown.endTimestamp)}
                    )
                  </div>
                )}
              </div>

              <div className="mt-[18px]">{BribesButton}</div>
            </>
          }
        </PopUpModal>
      ) : null}
      <TokenModal
        tokens={tokensListConfig.filter((e: any) => {
          return (
            e.name.toLowerCase() !== MigrateToken.PLENTY.toLowerCase() &&
            e.name.toLowerCase() !== MigrateToken.WRAP.toLowerCase()
          );
        })}
        show={swapModalShow}
        allBalance={props.allBalance}
        isSucess={props.isSucess}
        selectToken={selectToken}
        onhide={setSwapModalShow}
        tokenIn={props.bribeToken}
      />
      <ConfirmAddBribes
        show={isConfirm}
        setShow={setIsConfirm}
        selectedPool={props.selectedPool}
        value={bottomValue.toString()}
        perEpoch={props.bribeInputValue}
        token={props.bribeToken}
        selectedDropDown={selectedDropDown}
        selectedEndDropDown={selectedEndDropDown}
        isSelectedEpoch={isSelectedEpoch}
        handleOperation={props.handleOperation}
      />
    </>
  );
}

export default AddBribes;
