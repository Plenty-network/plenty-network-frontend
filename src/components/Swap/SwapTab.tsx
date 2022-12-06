import clsx from "clsx";
import "animate.css";
import { isMobile } from "react-device-detect";
import fromExponential from "from-exponential";
import refresh from "../../../src/assets/icon/swap/refresh.svg";
import settings from "../../../src/assets/icon/swap/settings.svg";
import arrowDown from "../../../src/assets/icon/swap/arrowDown.svg";
import ratesrefresh from "../../../src/assets/icon/swap/ratesrefresh.svg";
import info from "../../../src/assets/icon/swap/info.svg";
import router from "../../../src/assets/icon/swap/router.svg";
import stableSwap from "../../../src/assets/icon/swap/stableswapViolet.svg";
import switchsvg from "../../../src/assets/icon/swap/switch.svg";
import Image from "next/image";
import Lottie from "lottie-react";
import Button from "../Button/Button";
import TokenDropdown from "../TokenDropdown/TokenDropdown";
import TransactionSettings from "../TransactionSettings/TransactionSettings";
import { useEffect, useMemo, useRef, useState } from "react";
import { ERRORMESSAGES, tokensModal, tokenType } from "../../../src/constants/swap";
import { useStateAnimate } from "../../hooks/useAnimateUseState";
import loader from "../../assets/animations/shimmer-swap.json";
import { BigNumber } from "bignumber.js";
import { allSwapWrapper } from "../../operations/swap";
import ExpertModePopup from "../ExpertMode";
import ConfirmSwap from "./ConfirmSwap";
import ConfirmTransaction from "../ConfirmTransaction";
import TransactionSubmitted from "../TransactionSubmitted";
import {
  FIRST_TOKEN_AMOUNT,
  SECOND_TOKEN_AMOUNT,
  TOKEN_A,
  TOKEN_B,
} from "../../constants/localStorage";
import { store, useAppDispatch, useAppSelector } from "../../redux";
import { setLoading } from "../../redux/isLoading/action";
import { Position, ToolTip, TooltipType } from "../Tooltip/TooltipAdvanced";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import { setFlashMessage } from "../../redux/flashMessage";
import { Flashtype } from "../FlashScreen";
import { percentageChange, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { IAllTokensBalanceResponse } from "../../api/util/types";
import { Chain } from "../../config/types";

interface ISwapTabProps {
  className?: string;
  walletAddress: string | "";
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  connectWallet: () => void;
  tokenIn: { name: string; image: any };
  tokenOut: {
    name: string;
    image: any;
  };
  tokens: {
    name: string;
    image: string;
    chainType: Chain;
    address: string | undefined;
  }[];
  handleTokenType: (type: tokenType) => void;

  setSlippage: any;
  tokenPrice: {
    [id: string]: number;
  };
  slippage: number;
  setRecepient: any;
  recepient: string;
  handleClose: () => void;
  changeTokenLocation: () => void;
  setSecondTokenAmount: any;
  setFirstTokenAmount: any;
  setTokenIn: any;
  setTokenType: any;
  allPath: string[];
  setTokenOut: any;
  handleSwapTokenInput: (input: string | number, tokenType: "tokenIn" | "tokenOut") => void;
  showConfirmSwap: boolean;
  setShowConfirmSwap: any;
  showConfirmTransaction: any;
  setShowConfirmTransaction: any;
  showTransactionSubmitModal: boolean;
  setShowTransactionSubmitModal: any;

  loading: {
    isLoadingfirst?: boolean;
    isLoadingSecond?: boolean;
  };
  refreshAllData?: (value: boolean) => void;
  isRefresh?: boolean;
  resetAllValues: () => void;
  routeDetails: {
    path: string[];
    minimumOut: BigNumber;
    minimumTokenOut: BigNumber[];
    priceImpact: BigNumber;
    finalFeePerc: BigNumber;
    feePerc: BigNumber[];
    isStable: boolean[];
    exchangeRate: BigNumber;
    success: boolean;
  };
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
  setEnableMultiHop: React.Dispatch<React.SetStateAction<boolean>>;
  enableMultiHop: boolean;
  setBalanceUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  allBalance: IAllTokensBalanceResponse;
  isSwitchClicked: boolean;
}

function SwapTab(props: ISwapTabProps) {
  const userSettings = useAppSelector((state) =>
    state.userSettings.settings[props.walletAddress ? props.walletAddress : ""]
      ? state.userSettings.settings[props.walletAddress ? props.walletAddress : ""]
      : state.userSettings.settings[""]
  );

  const [settingsShow, setSettingsShow] = useState(false);
  const refSettingTab = useRef(null);
  const [transactionId, setTransactionId] = useState("");
  const [openSwapDetails, setOpenSwapDetails, animateOpenSwapDetails] = useStateAnimate(false, 180);
  const [showRecepient, setShowRecepient] = useState(false);

  const [expertMode, setExpertMode] = useState(userSettings.expertMode);
  const [showExpertPopup, setShowExpertPopup] = useState(false);
  const [isSecondInputFocus, setIsSecondInputFocus] = useState(false);
  const [isFirstInputFocus, setIsFirstInputFocus] = useState(false);
  const dispatch = useAppDispatch();
  const [isRefresh, setRefresh] = useState(false);
  const refreshAllData = (value: boolean) => {
    setRefresh(value);
    setTimeout(() => {
      props.handleSwapTokenInput(props.firstTokenAmount, "tokenIn");
      setRefresh(false);
    }, 500);
  };
  const [priceDiff, setpriceDiff] = useState("");
  useEffect(() => {
    if (
      props.tokenIn.name &&
      props.tokenOut.name &&
      Number(props.firstTokenAmount) > 0 &&
      Number(props.secondTokenAmount) > 0
    ) {
      const res = percentageChange(
        new BigNumber(
          Number(props.firstTokenAmount) * Number(props.tokenPrice[props.tokenIn.name] ?? 0)
        ),
        new BigNumber(
          Number(props.secondTokenAmount) * Number(props.tokenPrice[props.tokenOut.name] ?? 0)
        )
      );
      setpriceDiff(res.toFixed(2));
    } else {
      setpriceDiff("");
    }
  }, [props.firstTokenAmount, props.secondTokenAmount]);
  useEffect(() => {
    setExpertMode(userSettings.expertMode);
  }, [props.walletAddress, userSettings]);
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    props.setShowTransactionSubmitModal(true);
  };
  const [isConvert, setConvert] = useState(false);
  const handleSwap = () => {
    !expertMode && props.setShowConfirmSwap(true);
    expertMode && handleConfirmSwap();
  };
  const convertRates = (e: any) => {
    e.stopPropagation();
    setConvert(!isConvert);
  };
  const handleConfirmSwap = () => {
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(props.tokenIn.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(props.tokenOut.name));
    localStorage.setItem(FIRST_TOKEN_AMOUNT, props.firstTokenAmount.toString());
    props.setBalanceUpdate(false);
    localStorage.setItem(SECOND_TOKEN_AMOUNT, props.secondTokenAmount.toString());
    !expertMode && props.setShowConfirmSwap(false);
    const recepientAddress = props.recepient ? props.recepient : props.walletAddress;
    !expertMode && props.setShowConfirmTransaction(true);
    allSwapWrapper(
      new BigNumber(props.firstTokenAmount),
      props.routeDetails.path,
      props.routeDetails.minimumTokenOut,
      props.walletAddress,
      recepientAddress,
      transactionSubmitModal,
      props.resetAllValues,
      !expertMode && props.setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Swap ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} ${localStorage.getItem(
          TOKEN_A
        )} for ${localStorage.getItem(SECOND_TOKEN_AMOUNT)} ${localStorage.getItem(TOKEN_B)} `,
        linkText: "View in Explorer",
        isLoading: true,
        onClick: () => {
          window.open(`https://ghostnet.tzkt.io/${transactionId}`, "_blank");
        },
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        props.setBalanceUpdate(true);
        props.resetAllValues;
        setTimeout(() => {
          props.setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Swap ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_A)} for ${localStorage.getItem(
                SECOND_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_B)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      } else {
        props.setBalanceUpdate(true);
        props.resetAllValues;
        props.setShowConfirmTransaction(false);
        setTimeout(() => {
          props.setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Swap ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_A)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };

  const swapRoute = useMemo(() => {
    if (props.routeDetails.path?.length >= 2) {
      return props.routeDetails.path.map((tokenName) =>
        props.tokens.find((token) => {
          return token.name === tokenName;
        })
      );
    }

    return null;
  }, [props.routeDetails.path]);

  const SwapButton = useMemo(() => {
    if (props.walletAddress) {
      if (Object.keys(props.tokenOut).length === 0) {
        return (
          <Button color="disabled" width="w-full">
            Select a token
          </Button>
        );
      } else if (props.errorMessage !== "") {
        return (
          <Button color="disabled" width="w-full">
            Swap
          </Button>
        );
      } else if (
        (Object.keys(props.tokenOut).length !== 0 && props.firstTokenAmount === "") ||
        Number(props.firstTokenAmount) === 0
      ) {
        return (
          <Button color="disabled" width="w-full">
            Enter an amount
          </Button>
        );
      } else if (
        props.firstTokenAmount >
        Number(props.allBalance?.allTokensBalances[props.tokenIn.name]?.balance)
      ) {
        return (
          <Button color="disabled" width="w-full">
            Insufficient balance
          </Button>
        );
      } else if (expertMode && Number(props.routeDetails.priceImpact) > 3) {
        return (
          <Button color="error" width="w-full" onClick={handleSwap}>
            Swap Anyway
          </Button>
        );
      } else {
        return (
          <Button color="primary" width="w-full" onClick={handleSwap}>
            Swap
          </Button>
        );
      }
    } else {
      return (
        <Button color="primary" onClick={props.connectWallet} width="w-full">
          Connect Wallet
        </Button>
      );
    }
  }, [props]);

  const onClickAmount = () => {
    props.setSecondTokenAmount("");

    props.tokenIn.name === "tez"
      ? props.handleSwapTokenInput(
          Number(props.allBalance?.allTokensBalances[props.tokenIn.name]?.balance) - 0.02,
          "tokenIn"
        )
      : props.handleSwapTokenInput(
          Number(props.allBalance?.allTokensBalances[props.tokenIn.name]?.balance),
          "tokenIn"
        );
  };

  return (
    <>
      <div className="flex items-center flex-row px-5 lg:px-9 relative">
        <div className="font-title2">Swap</div>
        <div
          className="py-1 cursor-pointer px-15 h-8 border border-text-700 rounded-[21px] ml-auto"
          onClick={() => refreshAllData(true)}
        >
          <Image alt={"alt"} src={refresh} height={"14px"} width={"15px"} />
        </div>
        <div
          ref={refSettingTab}
          className="py-1 px-2 h-8 border border-text-700 cursor-pointer rounded-[12px] ml-2"
          onClick={() => setSettingsShow(!settingsShow)}
        >
          <Image alt={"alt"} src={settings} height={"20px"} width={"20px"} />
          <span className="text-white font-body4 ml-2 relative -top-[3px]">
            {props.slippage ? props.slippage : "0.5"}%
          </span>
        </div>
        <TransactionSettings
          show={settingsShow}
          setSlippage={props.setSlippage}
          slippage={props.slippage}
          setSettingsShow={setSettingsShow}
          setShowRecepient={setShowRecepient}
          setExpertMode={setExpertMode}
          expertMode={expertMode}
          setShowExpertPopup={setShowExpertPopup}
          setEnableMultiHop={props.setEnableMultiHop}
          enableMultiHop={props.enableMultiHop}
        />
      </div>
      <div
        className={clsx(
          "lg:w-580 mt-4 h-[102px] border bg-muted-200/[0.1]  mx-5 lg:mx-[30px] rounded-2xl px-4 hover:border-text-700",
          (props.firstTokenAmount >
            Number(props.allBalance?.allTokensBalances[props.tokenIn.name]?.balance) ||
            props.errorMessage) &&
            "border-errorBorder hover:border-errorBorder bg-errorBg",
          isFirstInputFocus ? "border-text-700" : "border-text-800 "
        )}
      >
        <div className="flex ">
          <div
            className={clsx(
              " mt-4",
              "flex-none"
              // Object.keys(props.tokenIn).length !== 0 ? "flex-[0_0_38%]" : "flex-[0_0_45%]"
            )}
          >
            {Object.keys(props.tokenIn).length !== 0 ? (
              <TokenDropdown
                onClick={() => props.handleTokenType("tokenIn")}
                tokenIcon={`/assets/tokens/${props.tokenIn.name.toLowerCase()}.png`}
                tokenName={tEZorCTEZtoUppercase(props.tokenIn.name)}
              />
            ) : (
              <TokenDropdown
                tokenName="Select a token"
                onClick={() => props.handleTokenType("tokenIn")}
              />
            )}
          </div>
          <div className="flex-auto my-3 ">
            <div className="text-right font-body1 text-text-400">YOU PAY</div>
            <div>
              {Object.keys(props.tokenIn).length !== 0 ? (
                props.loading.isLoadingfirst ? (
                  <p className=" my-[4px] ml-auto w-[100px] h-[32px] rounded animate-pulse bg-shimmer-100"></p>
                ) : (
                  <input
                    type="text"
                    className={clsx(
                      "text-white bg-card-500 text-right border-0 font-medium2  lg:font-medium1 outline-none w-[100%] placeholder:text-text-500"
                    )}
                    placeholder="0.0"
                    lang="en"
                    disabled={props.errorMessage === ERRORMESSAGES.SWAPROUTER}
                    onChange={(e) => props.handleSwapTokenInput(e.target.value, "tokenIn")}
                    value={props.firstTokenAmount}
                    onFocus={() => setIsFirstInputFocus(true)}
                    onBlur={() => setIsFirstInputFocus(false)}
                  />
                )
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
              {Number(props.allBalance?.allTokensBalances[props.tokenIn.name]?.balance) >= 0 ? (
                <ToolTip
                  message={fromExponential(
                    props.allBalance?.allTokensBalances[props.tokenIn.name]?.balance.toString()
                  )}
                  disable={
                    Number(props.allBalance?.allTokensBalances[props.tokenIn.name]?.balance) > 0
                      ? false
                      : true
                  }
                  id="tooltip8"
                  position={Position.right}
                >
                  {Number(props.allBalance?.allTokensBalances[props.tokenIn.name]?.balance) > 0
                    ? props.allBalance?.allTokensBalances[props.tokenIn.name]?.balance.toFixed(4)
                    : 0}
                </ToolTip>
              ) : (
                "--"
              )}
            </span>
          </div>
          <div className="text-right ml-auto font-body2 text-text-400">
            ~$
            {props.firstTokenAmount && props.tokenPrice[props.tokenIn.name]
              ? Number(
                  Number(props.firstTokenAmount) * Number(props.tokenPrice[props.tokenIn.name])
                ).toFixed(2)
              : "0.00"}
          </div>
        </div>
      </div>
      {props.errorMessage !== "" && (
        <div className="mt-3 mx-5 lg:mr-[30px] lg:ml-[50px] font-body2 lg:font-body3 text-error-500">
          {props.errorMessage}
        </div>
      )}
      <div
        className=" -mt-[25px] cursor-pointer relative top-[26px] bg-switchBorder w-[70px] h-[70px] p-px  mx-auto rounded-2xl "
        onClick={
          Object.keys(props.tokenOut).length !== 0
            ? () => props.changeTokenLocation()
            : () => props.changeTokenLocation()
        }
      >
        <div className="p-[11.5px] bg-card-500 rounded-2xl  w-[68px] h-[68px]">
          <div className="bg-primary-500 p-2  w-[46px] h-[46px] rounded-lg ">
            <Image alt={"alt"} src={switchsvg} height={"32px"} width={"32px"} />
          </div>
        </div>
      </div>
      <div className=" pt-[41px]  pb-5 border border-primary-500/[0.2] mx-px md:mx-2 lg:mx-2  px-5 lg:px-[22px] rounded-3xl bg-primary-500/[0.04]">
        <div
          className={clsx(
            "lg:w-580 secondtoken h-[102px] border border-text-800 rounded-2xl  px-4 border-primary-500/[0.2] hover:border-primary-500/[0.6] bg-card-500 hover:bg-primary-500/[0.02]",
            isSecondInputFocus && "border-text-700"
          )}
        >
          <div className=" flex ">
            <div
              className={clsx(
                " mt-4",
                "flex-none"
                // Object.keys(props.tokenOut).length !== 0 ? "flex-[0_0_38%]" : "flex-[0_0_45%]"
              )}
            >
              {Object.keys(props.tokenOut).length !== 0 ? (
                <TokenDropdown
                  onClick={() => props.handleTokenType("tokenOut")}
                  tokenIcon={`/assets/tokens/${props.tokenOut?.name?.toLowerCase()}.png`}
                  tokenName={tEZorCTEZtoUppercase(props.tokenOut.name)}
                />
              ) : (
                <TokenDropdown
                  tokenName="Select a token"
                  onClick={() => props.handleTokenType("tokenOut")}
                />
              )}
            </div>
            <div className=" my-3 flex-auto">
              <div className="text-right font-body1 text-text-400">YOU RECEIVE</div>
              <div>
                {Object.keys(props.tokenOut).length !== 0 ? (
                  isRefresh ||
                  props.loading.isLoadingSecond ||
                  (props.isSwitchClicked && props.secondTokenAmount === "") ? (
                    <p className="ml-auto my-[4px] w-[100px]  h-[32px] rounded animate-pulse bg-shimmer-100"></p>
                  ) : (
                    <input
                      type="text"
                      className={clsx(
                        "text-primary-500  inputSecond text-right border-0 font-input-text lg:font-medium1 outline-none w-[100%] placeholder:text-primary-500 "
                      )}
                      placeholder="0.0"
                      disabled={props.errorMessage === ERRORMESSAGES.SWAPROUTER}
                      onChange={(e) => props.handleSwapTokenInput(e.target.value, "tokenOut")}
                      value={fromExponential(props.secondTokenAmount)}
                      onFocus={() => setIsSecondInputFocus(true)}
                      onBlur={() => setIsSecondInputFocus(false)}
                    />
                  )
                ) : (
                  <input
                    type="text"
                    className={clsx(
                      "text-primary-700 inputSecond  text-right border-0 w-[100%]  font-input-text lg:font-medium1 outline-none "
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
            <div className="text-left">
              <span className="text-text-600 font-body3">Balance:</span>{" "}
              <span className="font-body4 text-text-500 ">
                {Object.keys(props.tokenOut).length !== 0 &&
                Number(props.allBalance?.allTokensBalances[props.tokenOut.name]?.balance) >= 0 ? (
                  <ToolTip
                    message={fromExponential(
                      props.allBalance?.allTokensBalances[props.tokenOut.name]?.balance.toString()
                    )}
                    disable={
                      Number(props.allBalance?.allTokensBalances[props.tokenOut.name]?.balance) > 0
                        ? false
                        : true
                    }
                    id="tooltip9"
                    position={Position.right}
                  >
                    {Number(props.allBalance?.allTokensBalances[props.tokenOut.name]?.balance) > 0
                      ? Number(
                          props.allBalance?.allTokensBalances[props.tokenOut.name]?.balance
                        ).toFixed(4)
                      : 0}
                  </ToolTip>
                ) : (
                  "--"
                )}
              </span>
            </div>
            <div className="text-right ml-auto font-body2 text-text-400">
              {Number(priceDiff) !== 0 && (
                <span
                  className={clsx(
                    "mr-1",
                    Number(priceDiff) < 0 ? "text-error-500" : "text-success-500"
                  )}
                >
                  ({priceDiff}%)
                </span>
              )}
              ~$
              {Object.keys(props.tokenOut).length !== 0 &&
              props.secondTokenAmount &&
              props.tokenPrice[props.tokenOut.name]
                ? Number(
                    Number(props.secondTokenAmount) * Number(props.tokenPrice[props.tokenOut.name])
                  ).toFixed(2)
                : "0.00"}
            </div>
          </div>
        </div>
        {showRecepient && (
          <div className="bg-card-500/[0.02] mt-2.5 rounded-2xl border border-primary-500/[0.2] h-[78px] py-3 px-[18px]">
            <div className="font-caption1 text-text-400">Send</div>
            <div>
              <input
                type="text"
                className={clsx(
                  "text-white  bg-card-500/[0.02] border-0 font-title1  outline-none w-[100%] placeholder:text-text-800/[0.8] "
                )}
                placeholder="Receipient address"
                onChange={(e) => props.setRecepient(e.target.value)}
                value={props.recepient}
              />
            </div>
          </div>
        )}

        {props.routeDetails.success && (
          <div
            className="h-12 mt-3 cursor-pointer px-4 pt-[13px] pb-[15px] rounded-2xl bg-muted-600 border border-primary-500/[0.2] items-center flex "
            onClick={() => setOpenSwapDetails(!openSwapDetails)}
          >
            {isRefresh ||
            props.loading.isLoadingSecond ||
            (props.isSwitchClicked && props.secondTokenAmount === "") ? (
              <div className="flex relative top-[8px]">
                <span className="ml-[6px] font-text-bold mr-[7px]"> Fetching best price</span>
                <span className="relative -top-[5px]">
                  <Lottie
                    animationData={loader}
                    loop={true}
                    style={{ height: "32px", width: "32px" }}
                  />
                </span>
              </div>
            ) : (
              <>
                <div>
                  <span className="relative top-0.5">
                    <ToolTip
                      id="tooltip1"
                      position={isMobile ? Position.right : Position.top}
                      toolTipChild={
                        <p>
                          <div
                            className={`w-[277px]   rounded-3xl 
                            }`}
                          >
                            <div className="flex mt-2">
                              <div className="font-body1  md:font-body3 ">
                                <span className="mr-[5px]">Minimum received</span>
                              </div>

                              <div className="ml-auto font-body2 md:font-subtitle4">
                                {` ${Number(props.routeDetails.minimumOut).toFixed(
                                  4
                                )} ${tEZorCTEZtoUppercase(props.tokenOut.name)}`}
                              </div>
                            </div>

                            <div className="flex mt-3">
                              <div className="font-body1 md:font-body3 ">
                                <span className="mr-[5px]">Price impact</span>
                              </div>

                              <div
                                className={clsx(
                                  "ml-auto font-body2 md:font-subtitle4",
                                  Number(props.routeDetails.priceImpact) > 3 && "text-error-500"
                                )}
                              >
                                {`${props.routeDetails.priceImpact.toFixed(4)} %`}
                              </div>
                            </div>
                            <div className="flex mt-3 mb-2">
                              <div className="font-body1 md:font-body3 ">
                                <span className="mr-[5px]">Fee</span>
                              </div>

                              <div className="ml-auto font-body2 md:font-subtitle4">
                                {`${props.routeDetails.finalFeePerc.toFixed(2)}  %`}
                              </div>
                            </div>
                          </div>
                        </p>
                      }
                    >
                      <Image
                        alt={"alt"}
                        src={info}
                        className="cursor-pointer"
                        width={"15px"}
                        height={"15px"}
                      />
                    </ToolTip>
                  </span>
                  <span className="ml-[9.25px] font-bold3 lg:font-text-bold mr-[7px]">
                    1{" "}
                    {!isConvert
                      ? tEZorCTEZtoUppercase(props.tokenIn.name)
                      : tEZorCTEZtoUppercase(props.tokenOut.name)}{" "}
                    =
                    <ToolTip
                      message={
                        !isConvert
                          ? props.routeDetails.exchangeRate.toString()
                          : (1 / Number(props.routeDetails.exchangeRate)).toString()
                      }
                      id="tooltip7"
                      position={Position.top}
                    >
                      {!isConvert
                        ? ` ${props.routeDetails.exchangeRate.toFixed(3)} 
                            ${tEZorCTEZtoUppercase(props.tokenOut.name)}`
                        : `${Number(1 / Number(props.routeDetails.exchangeRate)).toFixed(
                            3
                          )} ${tEZorCTEZtoUppercase(props.tokenIn.name)}`}
                    </ToolTip>
                  </span>
                  <span className="relative top-px">
                    <Image alt={"alt"} src={ratesrefresh} onClick={(e) => convertRates(e)} />
                  </span>
                </div>
                <div className="ml-auto">
                  <ToolTip
                    id="tooltip9"
                    type={isMobile ? TooltipType.swapRoute : TooltipType.swap}
                    position={Position.top}
                    toolTipChild={
                      <div
                        className={clsx(
                          swapRoute && swapRoute?.length > 3
                            ? "w-[360px] md:w-[500px]"
                            : "w-[360px] md:w-[400px]"
                        )}
                      >
                        <div className="mt-2 ">
                          <div className="font-subtitle2 md:font-subtitle4">
                            {" "}
                            <span className="mr-[5px]">Route</span>
                          </div>

                          <>
                            <div className="border-dashed relative top-[20px] md:top-[24px]   border-t-2 border-muted-50 mx-2"></div>
                            <div className="mt-2 flex justify-between ">
                              {swapRoute?.map((token, idx) => {
                                const index = idx + 1;
                                return (
                                  <>
                                    {(idx === 0 || idx === swapRoute.length - 1) && (
                                      <div className="flex items-center " key={token?.name}>
                                        {idx === swapRoute.length - 1 && (
                                          <div className="w-0.5 md:w-1.5 h-2 bg-primary-750 z-50"></div>
                                        )}
                                        <div className="relative  z-100 w-[24px]  h-[24px] md:w-[32px] md:h-[32px]  p-0.5 bg-card-600 rounded-full">
                                          <span className="w-[24px] md:w-[28px] h-[28px] md:h-[28px]">
                                            <Image
                                              src={`/assets/tokens/${token?.name}.png`}
                                              width={isMobile ? "21px" : "28px"}
                                              height={isMobile ? "21px" : "28px"}
                                            />
                                          </span>
                                        </div>
                                        {idx === 0 && (
                                          <div className="w-0.5 md:w-1.5 h-2 bg-primary-750 z-50"></div>
                                        )}
                                      </div>
                                    )}

                                    {idx !== swapRoute.length - 1 && (
                                      <div className="flex items-center">
                                        <div className="w-0.5 md:w-1.5 h-2 bg-primary-750 z-50"></div>
                                        <div
                                          className={clsx(
                                            "relative  rounded-2xl h-[24px] md:h-[32px] bg-card-600 p-px flex",
                                            props.routeDetails.isStable[idx]
                                              ? "w-[91px] md:w-[130px]"
                                              : "w-[81px] md:w-[114px]"
                                          )}
                                        >
                                          <span className=" flex items-center">
                                            {props.routeDetails.isStable[idx] && (
                                              <div className="border-1 md:border-2 border-primary-500/[0.2] z-50 w-[21px] md:w-[28px] h-[21px] md:h-[28px]  flex justify-center items-center bg-card-600 rounded-full">
                                                <span className="w-[15px] md:w-[18px] h-[15px] md:h-[18px]">
                                                  <Image
                                                    src={stableSwap}
                                                    width={isMobile ? "15px" : "18px"}
                                                    height={isMobile ? "15px" : "18px"}
                                                  />
                                                </span>
                                              </div>
                                            )}
                                            <div
                                              className={clsx(
                                                "relative   z-40 w-[24px]  h-[24px] md:w-[32px] md:h-[32px]   p-0.5 bg-card-600 rounded-full",
                                                props.routeDetails.isStable[idx] && "right-[10px]"
                                              )}
                                            >
                                              <span className="w-[24px] md:w-[28px] h-[28px] md:h-[28px]">
                                                <Image
                                                  src={`/assets/tokens/${token?.name}.png`}
                                                  width={isMobile ? "21px" : "28px"}
                                                  height={isMobile ? "21px" : "28px"}
                                                />
                                              </span>
                                            </div>
                                            <div
                                              className={clsx(
                                                "relative  z-30 w-[24px]  h-[24px] md:w-[32px] md:h-[32px]   p-0.5 bg-card-600 rounded-full",
                                                props.routeDetails.isStable[idx]
                                                  ? "right-5"
                                                  : "right-[10px]"
                                              )}
                                            >
                                              <span className="w-[24px] md:w-[28px] h-[28px] md:h-[28px]">
                                                <Image
                                                  src={`/assets/tokens/${swapRoute[index]?.name}.png`}
                                                  width={isMobile ? "21px" : "28px"}
                                                  height={isMobile ? "21px" : "28px"}
                                                />
                                              </span>
                                            </div>
                                            <div
                                              className={clsx(
                                                "relative right-[22px] ml-[2px] md:ml-[5px] h-6 px-[4.5px] pt-[5px] md:pt-[3px] bg-muted-100 rounded-xl font-mobile-700 md:font-subtitle4",
                                                props.routeDetails.isStable[idx]
                                                  ? "right-[22px]"
                                                  : "right-[12px]"
                                              )}
                                            >
                                              {Number(props.routeDetails.feePerc[idx]).toFixed(2)}%
                                            </div>
                                          </span>
                                        </div>
                                        <div className="w-0.5 md:w-1.5 h-2 bg-primary-750 z-50"></div>
                                      </div>
                                    )}
                                  </>
                                );
                              })}
                            </div>
                          </>
                          <div className="mt-3 text-text-50 font-body1">
                            This route optimises your total output by considering all the Volatile
                            and Flat AMMs on Plenty Network.
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="mr-2.5 lg:mr-6 h-[36px] flex justify-center rounded bg-shimmer-100 p-2">
                      <Image alt={"alt"} src={router} width={"20px"} height={"20px"} />
                      <span className="ml-1 font-bold3 lg:font-subtitle4 text-primary-500">{`${Number(
                        props.routeDetails.finalFeePerc
                      ).toFixed(2)} %`}</span>
                    </div>
                  </ToolTip>
                </div>
                <div className=" relative top-[3px]">
                  <Image
                    src={arrowDown}
                    className={animateOpenSwapDetails ? "rotate-180" : "rotate-0"}
                    width={"24px"}
                    height={"24px"}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {openSwapDetails && props.routeDetails.success && (
          <div
            className={`bg-card-500 border border-text-700/[0.5] py-[14px] lg:py-5 px-[15px] lg:px-[22px] h-[218px] rounded-3xl mt-2 animate__animated ${
              animateOpenSwapDetails ? "animate__fadeInDown animate__faster" : "animate__fadeOutUp"
            }`}
          >
            <div className="flex">
              <div className="font-mobile-400 md:font-body3 ">
                <span className="mr-[5px]">Minimum received</span>
                <span className="relative top-1 lg:top-0.5">
                  <ToolTip
                    position={Position.top}
                    id="tooltip2"
                    toolTipChild={
                      <div className="w-[200px] md:w-[323px]">
                        The minimum amount you are guaranteed to receive. If the price slips any
                        further, your transaction will revert.
                      </div>
                    }
                  >
                    <Image alt={"alt"} src={info} className="infoIcon cursor-pointer" />
                  </ToolTip>
                </span>
              </div>
              {isRefresh ||
              props.loading.isLoadingSecond ||
              (props.isSwitchClicked && props.secondTokenAmount === "") ? (
                <div className=" ml-auto h-[19px] rounded animate-pulse bg-shimmer-100 text-shimmer-100">
                  999999999999
                </div>
              ) : (
                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  <ToolTip
                    message={fromExponential(props.routeDetails.minimumOut.toNumber())}
                    id="tooltip6"
                    disable={Number(props.routeDetails.minimumOut) < 0}
                    position={isMobile ? Position.left : Position.top}
                  >
                    {Number(props.routeDetails.minimumOut) < 0
                      ? `0 ${tEZorCTEZtoUppercase(props.tokenOut.name)}`
                      : ` ${Number(props.routeDetails.minimumOut).toFixed(
                          4
                        )} ${tEZorCTEZtoUppercase(props.tokenOut.name)}`}
                  </ToolTip>
                </div>
              )}
            </div>

            <div className="flex mt-2">
              <div className="font-mobile-400 md:font-body3 ">
                <span className="mr-[5px]">Price impact</span>
                <span className="relative top-1 lg:top-0.5">
                  <ToolTip
                    id="tooltip4"
                    position={isMobile ? Position.right : Position.top}
                    toolTipChild={
                      <div className="w-[200px]  md:w-[323px]">
                        The difference between the market price and estimated price due to trade
                        size.
                      </div>
                    }
                  >
                    <Image alt={"alt"} src={info} className="infoIcon cursor-pointer" />
                  </ToolTip>
                </span>
              </div>
              {isRefresh ||
              props.loading.isLoadingSecond ||
              (props.isSwitchClicked && props.secondTokenAmount === "") ? (
                <div className=" ml-auto h-[19px] rounded animate-pulse bg-shimmer-100 text-shimmer-100">
                  99999999
                </div>
              ) : (
                <div
                  className={clsx(
                    "ml-auto font-mobile-700 md:font-subtitle4",
                    Number(props.routeDetails.priceImpact) > 5 && "text-error-500"
                  )}
                >
                  <ToolTip
                    message={fromExponential(props.routeDetails.priceImpact.toString())}
                    id="tooltip5"
                    position={isMobile ? Position.left : Position.top}
                  >
                    {`${props.routeDetails.priceImpact.toFixed(4)} %`}{" "}
                  </ToolTip>
                </div>
              )}
            </div>
            <div className="flex mt-2">
              <div className="font-mobile-400 md:font-body3 ">
                <span className="mr-[5px]">Fee</span>
                <span className="relative top-1 lg:top-0.5">
                  <ToolTip
                    id="tooltip3"
                    position={isMobile ? Position.right : Position.top}
                    toolTipChild={
                      <div className="w-[200px] md:w-[323px]">
                        Fees is 0.05% for both volatile and stable swap
                      </div>
                    }
                  >
                    <Image alt={"alt"} src={info} className="infoIcon cursor-pointer" />
                  </ToolTip>
                </span>
              </div>
              {isRefresh ||
              props.loading.isLoadingSecond ||
              (props.isSwitchClicked && props.secondTokenAmount === "") ? (
                <div className=" ml-auto h-[19px] rounded animate-pulse bg-shimmer-100 text-shimmer-100">
                  999999999999
                </div>
              ) : (
                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  {`${props.routeDetails.finalFeePerc.toFixed(2)}  %`}
                </div>
              )}
            </div>
            <div className="border-t border-text-800 mt-[18px]"></div>

            <div className="mt-4 ">
              <div className="font-subtitle2 md:font-subtitle4">
                {" "}
                <span className="mr-[5px]">Route</span>
                <span className="relative top-1 lg:top-0.5">
                  <ToolTip
                    id="tooltip4"
                    position={isMobile ? Position.right : Position.top}
                    toolTipChild={
                      <div className="w-[200px] md:w-[323px]">
                        Routing through these tokens results in the best price for your trade.
                      </div>
                    }
                  >
                    <Image alt={"alt"} src={info} className="infoIcon cursor-pointer" />
                  </ToolTip>
                </span>
              </div>
              {isRefresh ||
              props.loading.isLoadingSecond ||
              (props.isSwitchClicked && props.secondTokenAmount === "") ? (
                <div className=" w-[110px] mt-2 h-[35px] rounded animate-pulse bg-shimmer-100 text-shimmer-100">
                  99999999
                </div>
              ) : (
                <div className="">
                  <div className="swap overflow-x-auto pb-2 min-w-[305px] md:min-w-[338px]">
                    <div className="border-dashed relative top-[24px]   border-t-2 border-muted-50 mx-2"></div>
                    <div className="mt-2 flex justify-between ">
                      {swapRoute?.map((token, idx) => {
                        const index = idx + 1;
                        return (
                          <>
                            {(idx === 0 || idx === swapRoute.length - 1) && (
                              <div className="flex items-center " key={token?.name}>
                                {idx === swapRoute.length - 1 && (
                                  <div className="w-1.5 h-2 bg-card-500 z-50"></div>
                                )}
                                <div className="relative  z-100 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full">
                                  <span className="w-[28px] h-[28px]">
                                    <Image
                                      alt={"alt"}
                                      src={`/assets/tokens/${token?.name}.png`}
                                      width={"28px"}
                                      height={"28px"}
                                    />
                                  </span>
                                </div>
                                {idx === 0 && <div className="w-1.5 h-2 bg-card-500 z-50"></div>}
                              </div>
                            )}

                            {idx !== swapRoute.length - 1 && (
                              <div className="flex items-center">
                                <div className="w-1.5 h-2 bg-card-500 z-50"></div>
                                <div
                                  className={clsx(
                                    "relative  rounded-2xl h-[32px] bg-card-600 p-px flex",
                                    props.routeDetails.isStable[idx] ? "w-[130px]" : "w-[114px]"
                                  )}
                                >
                                  <span className=" flex items-center">
                                    {props.routeDetails.isStable[idx] && (
                                      <div className="border-2 border-primary-500/[0.2] z-50 w-[28px] h-[28px]  flex justify-center items-center bg-card-600 rounded-full">
                                        <span className="w-[18px] h-[18px]">
                                          <Image
                                            alt={"alt"}
                                            src={stableSwap}
                                            width={"18px"}
                                            height={"18px"}
                                          />
                                        </span>
                                      </div>
                                    )}
                                    <div
                                      className={clsx(
                                        "relative   z-40 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full",
                                        props.routeDetails.isStable[idx] && "right-[10px]"
                                      )}
                                    >
                                      <span className="w-[28px] h-[28px]">
                                        <Image
                                          alt={"alt"}
                                          src={`/assets/tokens/${token?.name}.png`}
                                          width={"28px"}
                                          height={"28px"}
                                        />
                                      </span>
                                    </div>
                                    <div
                                      className={clsx(
                                        "relative  z-30 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full",
                                        props.routeDetails.isStable[idx]
                                          ? "right-5"
                                          : "right-[10px]"
                                      )}
                                    >
                                      <span className="w-[28px] h-[28px]">
                                        <Image
                                          src={`/assets/tokens/${swapRoute[index]?.name}.png`}
                                          width={"28px"}
                                          height={"28px"}
                                        />
                                      </span>
                                    </div>
                                    <div
                                      className={clsx(
                                        "relative right-[22px] ml-[5px] h-6 px-[4.5px] pt-[3px] bg-muted-100 rounded-xl font-subtitle4",
                                        props.routeDetails.isStable[idx]
                                          ? "right-[22px]"
                                          : "right-[12px]"
                                      )}
                                    >
                                      {Number(props.routeDetails.feePerc[idx]).toFixed(2)}%
                                    </div>
                                  </span>
                                </div>
                                <div className="w-1.5 h-2 bg-card-500 z-50"></div>
                              </div>
                            )}
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mt-5">{SwapButton}</div>
      </div>
      {showExpertPopup && (
        <ExpertModePopup
          show={showExpertPopup}
          setShow={setShowExpertPopup}
          setExpertMode={setExpertMode}
        />
      )}
      {props.showConfirmSwap && (
        <ConfirmSwap
          show={props.showConfirmSwap}
          tokens={props.tokens}
          setShow={props.setShowConfirmSwap}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          firstTokenAmount={props.firstTokenAmount}
          secondTokenAmount={props.secondTokenAmount.toString()}
          routeDetails={props.routeDetails}
          onClick={handleConfirmSwap}
        />
      )}
      {props.showConfirmTransaction && (
        <ConfirmTransaction
          show={props.showConfirmTransaction}
          setShow={props.setShowConfirmTransaction}
          content={`Swap ${Number(props.firstTokenAmount).toFixed(2)} ${tEZorCTEZtoUppercase(
            props.tokenIn.name
          )} for ${Number(props.secondTokenAmount).toFixed(4)} ${tEZorCTEZtoUppercase(
            props.tokenOut.name
          )} `}
        />
      )}
      {props.showTransactionSubmitModal && (
        <TransactionSubmitted
          show={props.showTransactionSubmitModal}
          setShow={props.setShowTransactionSubmitModal}
          onBtnClick={
            transactionId
              ? () => window.open(`https://ghostnet.tzkt.io/${transactionId}`, "_blank")
              : null
          }
          content={`Swap ${Number(localStorage.getItem(FIRST_TOKEN_AMOUNT)).toFixed(
            2
          )} ${localStorage.getItem(TOKEN_A)} for ${Number(
            localStorage.getItem(SECOND_TOKEN_AMOUNT)
          ).toFixed(4)} ${localStorage.getItem(TOKEN_B)} `}
        />
      )}
    </>
  );
}

export default SwapTab;
