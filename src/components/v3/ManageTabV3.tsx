import { BigNumber } from "bignumber.js";
import Image from "next/image";

import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import * as React from "react";
import { useEffect, useState } from "react";
import { POOL_TYPE } from "../../../pages/pools";
import { getPnlpOutputEstimate, getPoolShareForPnlp } from "../../api/liquidity";
import settings from "../../../src/assets/icon/swap/settings.svg";
import { ELiquidityProcess } from "../../api/liquidity/types";

import { IStakedDataResponse, IVePLYData } from "../../api/stake/types";
import { loadSwapDataWrapper } from "../../api/swap/wrappers";
import {
  getBalanceFromTzkt,
  getPnlpBalance,
  getStakedBalance,
  getTezBalance,
} from "../../api/util/balance";
import { nFormatterWithLesserNumber, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { getLPTokenPrice } from "../../api/util/price";
import { ELocksState } from "../../api/votes/types";
import playBtn from "../../assets/icon/common/playBtn.svg";
import { tzktExplorer } from "../../common/walletconnect";
import { IConfigLPToken } from "../../config/types";

import {
  FIRST_TOKEN_AMOUNT,
  SECOND_TOKEN_AMOUNT,
  TOKEN_A,
  TOKEN_B,
} from "../../constants/localStorage";
import { addLiquidity } from "../../operations/addLiquidity";
import { AppDispatch, useAppDispatch, useAppSelector } from "../../redux";
import { setFlashMessage } from "../../redux/flashMessage";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import ConfirmTransaction from "../ConfirmTransaction";
import { Flashtype } from "../FlashScreen";
import Liquidity from "../Liquidity";
import PositionsPopup from "./Positions";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
import { PopUpModal } from "../Modal/popupModal";
import { VideoModal } from "../Modal/videoModal";
import { ActiveLiquidity, ManageLiquidityHeader } from "../Pools/ManageLiquidityHeader";
import { StakingScreenType } from "../Pools/StakingScreen";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";
import TransactionSubmitted from "../TransactionSubmitted";
import LiquidityV3 from "./LiquidityV3";
import PriceRangeV3 from "./PriceRange";
import clsx from "clsx";
import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import TransactionSettingsLiquidity from "../TransactionSettings/TransactionSettingsLiq";
import ConfirmAddLiquidityv3 from "./ConfirmAddLiqV3";
import {
  setleftbrush,
  setrightbrush,
  setBcurrentPrice,
  setBleftbrush,
  setBleftRangeInput,
  setBrightbrush,
  setBRightRangeInput,
  setcurrentPrice,
  setleftRangeInput,
  setRightRangeInput,
  setTokenInOrg,
  setTokenInV3,
  setTokeOutOrg,
  setTokeOutV3,
  settopLevelSelectedToken,
} from "../../redux/poolsv3";
import IncreaseDecreaseLiqMain from "./IncreaseDecreaseliqMain";
import ConfirmIncreaseLiq from "./Confirmaddliq";
import ConfirmDecreaseLiq from "./Confirmremoveliq";
import TransactionSettingsV3 from "./TransactionSettingv3";

export interface IManageLiquidityProps {
  closeFn: (val: boolean) => void;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  tokenA: tokenParameterLiquidity;
  tokenB: tokenParameterLiquidity;
  setActiveState: React.Dispatch<React.SetStateAction<string>>;
  activeState: string;
  isGaugeAvailable: boolean;
  showLiquidityModal?: boolean;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
  filter?: POOL_TYPE | undefined;
  feeTier: string;
}
export enum ActiveIncDecState {
  Increase = "Increase liquidity",
  Decrease = "Remove liquidity",
}
export enum ActivePopUp {
  Positions = "Positions",
  NewPosition = "NewPosition",
  ManageExisting = "ManageExisting",
  ConfirmAddV3 = "ConfirmAddV3",
  ConfirmExisting = "ConfirmExisting",
}

export function ManageTabV3(props: IManageLiquidityProps) {
  // const pooldatafromsdk = new Pool(-275611, 10, new BigNumber(1251963215603107302), "", "");
  // console.log("kk", pooldatafromsdk.getInitialBoundaries());
  // const g = pooldatafromsdk.getInitialBoundaries();
  // console.log(
  //   "kk",
  //   Tick.computeSqrtPriceFromTick(g[0]).toFixed(2),
  //   Tick.computeSqrtPriceFromTick(g[1]).toFixed(2)
  // );
  const [selectedFeeTier, setSelectedFeeTier] = useState("0.01");
  useEffect(() => {
    dispatch(setleftbrush(70));
    dispatch(setrightbrush(100));
    dispatch(setleftRangeInput("70"));
    dispatch(setRightRangeInput("100"));
    dispatch(setcurrentPrice(87));
    dispatch(setBleftbrush(60));
    dispatch(setBrightbrush(100));
    dispatch(setBleftRangeInput("60"));
    dispatch(setBRightRangeInput("100"));
    dispatch(setBcurrentPrice(90));
  }, []);
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [slippage, setSlippage] = useState<string>("0.5");
  const TOKEN = useAppSelector((state) => state.config.tokens);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [activeStateIncDec, setActiveStateIncDec] = React.useState<ActiveIncDecState | string>(
    ActiveIncDecState.Increase
  );
  const [screen, setScreen] = React.useState(ActivePopUp.Positions);
  const [firstTokenAmountLiq, setFirstTokenAmountLiq] = React.useState<string | number>("");
  const [secondTokenAmountLiq, setSecondTokenAmountLiq] = React.useState<number | string>("");

  const [isAddLiquidity, setIsAddLiquidity] = useState(true);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);

  const [transactionId, setTransactionId] = useState("");
  const swapData = React.useRef<ISwapData>({
    tokenInSupply: new BigNumber(0),
    tokenOutSupply: new BigNumber(0),
    lpToken: undefined,
    lpTokenSupply: new BigNumber(0),
    isloading: true,
  });

  const dispatch = useAppDispatch();
  const [pnlpEstimates, setPnlpEstimates] = useState("");
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const [sharePool, setSharePool] = useState("");
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [pnlpBalance, setPnlpBalance] = useState("");
  const [lpTokenPrice, setLpTokenPrice] = useState(new BigNumber(0));
  const [isLoading, setIsLoading] = useState(false);

  const [contentTransaction, setContentTransaction] = useState("");

  const [settingsShow, setSettingsShow] = useState(false);
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});
  const refSettingTab = React.useRef(null);
  useEffect(() => {
    topLevelSelectedToken.symbol === props.tokenIn.symbol
      ? dispatch(setTokenInV3(props.tokenIn))
      : dispatch(setTokeOutV3(props.tokenOut));

    dispatch(setTokenInOrg(props.tokenA));
    dispatch(setTokeOutOrg(props.tokenB));
  }, [props.tokenIn, props.tokenOut]);
  useEffect(() => {
    const updateBalance = async () => {
      const balancePromises = [];

      if (walletAddress) {
        if (
          props.tokenIn.symbol.toLowerCase() === "xtz" ||
          props.tokenOut.symbol.toLowerCase() === "xtz"
        ) {
          balancePromises.push(getTezBalance(walletAddress));
        }

        props.tokenIn.symbol &&
          props.tokenIn.symbol.toLowerCase() !== "xtz" &&
          balancePromises.push(
            getBalanceFromTzkt(
              String(TOKEN[props.tokenIn.symbol]?.address),
              TOKEN[props.tokenIn.symbol].tokenId,
              TOKEN[props.tokenIn.symbol].standard,
              walletAddress,
              props.tokenIn.symbol
            )
          );
        props.tokenOut.symbol &&
          props.tokenOut.symbol.toLowerCase() !== "xtz" &&
          balancePromises.push(
            getBalanceFromTzkt(
              String(TOKEN[props.tokenOut.symbol]?.address),
              TOKEN[props.tokenOut.symbol].tokenId,
              TOKEN[props.tokenOut.symbol].standard,

              walletAddress,
              props.tokenOut.symbol
            )
          );

        const balanceResponse = await Promise.all(balancePromises);

        setUserBalances((prev) => ({
          ...prev,
          ...balanceResponse.reduce(
            (acc, cur) => ({
              ...acc,
              [cur.identifier]: cur.balance,
            }),
            {}
          ),
        }));
      }
    };
    updateBalance();
  }, [walletAddress, TOKEN, balanceUpdate, props.tokenIn.symbol, props.tokenOut.symbol]);

  useEffect(() => {
    getLPTokenPrice(props.tokenIn.name, props.tokenOut.name, {
      [props.tokenIn.name]: tokenPrice[props.tokenIn.name],
      [props.tokenOut.name]: tokenPrice[props.tokenOut.name],
    }).then((res) => {
      setLpTokenPrice(res.lpTokenPrice);
    });
    if (walletAddress) {
      const updateBalance = async () => {
        getPnlpBalance(props.tokenIn.name, props.tokenOut.name, walletAddress).then((res) => {
          setPnlpBalance(res.balance);
        });
      };
      updateBalance();
    }
  }, [
    props.tokenIn,
    props.tokenOut,
    props,
    tokenPrice[props.tokenIn.name],
    tokenPrice[props.tokenOut.name],
    TOKEN,
    balanceUpdate,
    swapData.current,
  ]);
  const [lpToken, setLpToken] = useState<IConfigLPToken | undefined>({} as IConfigLPToken);
  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(props.tokenIn, "name") &&
      Object.prototype.hasOwnProperty.call(props.tokenOut, "name")
    ) {
      setIsLoading(true);
      loadSwapDataWrapper(props.tokenIn.name, props.tokenOut.name).then((response) => {
        if (response.success) {
          setLpToken(response?.lpToken);
          swapData.current = {
            tokenInSupply: response.tokenInSupply as BigNumber,
            tokenOutSupply: response.tokenOutSupply as BigNumber,
            lpToken: response.lpToken,
            lpTokenSupply: response.lpTokenSupply,
            isloading: false,
          };
          setIsLoading(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (firstTokenAmountLiq > 0 && secondTokenAmountLiq > 0 && isAddLiquidity) {
      const res = getPnlpOutputEstimate(
        props.tokenIn.symbol,
        props.tokenOut.symbol,
        firstTokenAmountLiq.toString(),
        secondTokenAmountLiq.toString(),
        swapData.current.tokenInSupply as BigNumber,
        swapData.current.tokenOutSupply as BigNumber,
        swapData.current.lpTokenSupply
      );
      setPnlpEstimates(res.pnlpEstimate);
      const sharePool = getPoolShareForPnlp(
        res.pnlpEstimate,
        swapData.current.lpTokenSupply,
        ELiquidityProcess.ADD
      );
      setSharePool(sharePool.pnlpPoolShare);
    }
  }, [firstTokenAmountLiq, secondTokenAmountLiq, screen, balanceUpdate]);
  const resetAllValues = () => {
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");

    setBalanceUpdate(false);
  };

  const handleAddLiquidityOperation = () => {
    setContentTransaction(
      `Mint ${nFormatterWithLesserNumber(
        new BigNumber(firstTokenAmountLiq)
      )} ${tEZorCTEZtoUppercase(props.tokenIn.name)} / ${nFormatterWithLesserNumber(
        new BigNumber(secondTokenAmountLiq)
      )} ${tEZorCTEZtoUppercase(props.tokenOut.name)} `
    );
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(props.tokenIn.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(props.tokenOut.name));
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT,
      nFormatterWithLesserNumber(new BigNumber(firstTokenAmountLiq)).toString()
    );
    localStorage.setItem(
      SECOND_TOKEN_AMOUNT,
      nFormatterWithLesserNumber(new BigNumber(secondTokenAmountLiq)).toString()
    );
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    setShowConfirmTransaction(true);
    setScreen(ActivePopUp.NewPosition);
    addLiquidity(
      props.tokenIn.symbol,
      props.tokenOut.symbol,
      firstTokenAmountLiq.toString(),
      secondTokenAmountLiq.toString(),
      walletAddress,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      props.isGaugeAvailable ? props.setActiveState : undefined,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Add ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} ${localStorage.getItem(
          TOKEN_A
        )} and ${localStorage.getItem(SECOND_TOKEN_AMOUNT)} ${localStorage.getItem(TOKEN_B)}`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Add ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} ${localStorage.getItem(
                TOKEN_A
              )} and ${localStorage.getItem(SECOND_TOKEN_AMOUNT)} ${localStorage.getItem(TOKEN_B)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `${tzktExplorer}${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        // setContentTransaction("");
      } else {
        setBalanceUpdate(true);
        //resetAllValues();
        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Add ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} ${localStorage.getItem(
                TOKEN_A
              )} and ${localStorage.getItem(SECOND_TOKEN_AMOUNT)} ${localStorage.getItem(TOKEN_B)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        // setContentTransaction("");
      }
    });
  };

  const closeModal = () => {
    // props.setShowLiquidityModalPopup(false);
    props.closeFn(false);
  };
  const handleAddLiquidity = () => {
    setScreen(ActivePopUp.ConfirmAddV3);
  };
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const AddButton = React.useMemo(() => {
    if (!walletAddress) {
      return (
        <Button height="52px" onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (Number(firstTokenAmountLiq) <= 0 || Number(secondTokenAmountLiq) <= 0) {
      return (
        <Button height="52px" onClick={() => null} color={"disabled"}>
          Add
        </Button>
      );
    } else if (
      walletAddress &&
      ((firstTokenAmountLiq && firstTokenAmountLiq > Number(userBalances[props.tokenIn.name])) ||
        (secondTokenAmountLiq && secondTokenAmountLiq) > Number(userBalances[props.tokenOut.name]))
    ) {
      return (
        <Button height="52px" onClick={() => null} color={"disabled"}>
          Insufficient balance
        </Button>
      );
    } else {
      return (
        <Button height="52px" color={"primary"} onClick={handleAddLiquidity}>
          Add
        </Button>
      );
    }
  }, [props, firstTokenAmountLiq, secondTokenAmountLiq]);
  const [selectedToken, setSelectedToken] = useState({} as tokenParameterLiquidity);
  useEffect(() => {
    setSelectedToken(props.tokenIn);
  }, []);
  useEffect(() => {
    dispatch(settopLevelSelectedToken(selectedToken));
  }, [selectedToken]);
  return props.showLiquidityModal ? (
    <>
      <PopUpModal
        onhide={closeModal}
        className={clsx(
          screen === ActivePopUp.Positions
            ? "sm:w-[880px] sm:max-w-[880px]"
            : screen === ActivePopUp.ConfirmAddV3
            ? "sm:w-[602px] sm:max-w-[602px]"
            : screen === ActivePopUp.NewPosition
            ? "sm:w-[972px] sm:max-w-[972px]"
            : "sm:w-[602px] sm:max-w-[602px]",
          "w-[414px] max-w-[414px]  rounded-none sm:rounded-3xl px-4"
        )}
        footerChild={
          <div className="flex justify-center items-center gap-2 md:gap-4 px-4 md:px-0">
            <p className="font-subtitle1 md:text-f16 text-text-150">
              {props.activeState === ActiveLiquidity.Liquidity &&
                "Add liquidity, stake, and earn PLY"}
              {props.activeState === ActiveLiquidity.Staking &&
                "Add liquidity, stake, and earn PLY"}
              {props.activeState === ActiveLiquidity.Rewards &&
                "Add liquidity, stake, and earn PLY"}
            </p>
            <Image
              className="cursor-pointer hover:opacity-90"
              onClick={() => setShowVideoModal(true)}
              src={playBtn}
            />
          </div>
        }
      >
        {screen === ActivePopUp.NewPosition ? (
          <>
            <div className="flex gap-1 items-center">
              <p
                className="cursor-pointer relative top-[3px]"
                onClick={() => setScreen(ActivePopUp.Positions)}
              >
                <Image alt={"alt"} src={arrowLeft} />
              </p>
              <p className="text-white">
                {props.activeState === ActiveLiquidity.Liquidity && "Manage liquidity"}
              </p>
              <p className="ml-1 relative top-[0px]">
                <InfoIconToolTip message={"Add or remove liquidity from the selected pool."} />
              </p>
              <p className="text-primary-500 font-subtitle1 ml-auto mr-5 cursor-pointer">
                Clear All
              </p>
              <div className="border border-text-800 rounded-lg	bg-info-900 h-[27px] p-[1px] cursor-pointer flex items-center w-fit  mr-4">
                <div
                  className={clsx(
                    selectedToken.symbol === props.tokenA.symbol
                      ? "h-[23px] px-2  bg-shimmer-200 rounded-lg	"
                      : "text-text-250 px-2",
                    "font-subtitle1223"
                  )}
                  onClick={() => setSelectedToken(props.tokenA)}
                >
                  {tEZorCTEZtoUppercase(props.tokenA.symbol)}
                </div>
                <div
                  className={clsx(
                    selectedToken.symbol === props.tokenB.symbol
                      ? "h-[23px] px-2  bg-shimmer-200 rounded-lg	"
                      : "text-text-250 px-2",
                    "font-subtitle1223"
                  )}
                  onClick={() => setSelectedToken(props.tokenB)}
                >
                  {tEZorCTEZtoUppercase(props.tokenB.symbol)}
                </div>
              </div>
              <div className="flex items-center justify-between flex-row  relative mr-[48px]">
                <div
                  ref={refSettingTab}
                  className="py-1  px-2 h-8 border border-text-700 cursor-pointer rounded-[12px] "
                  onClick={() => setSettingsShow(!settingsShow)}
                >
                  <Image alt={"alt"} src={settings} height={"20px"} width={"20px"} />
                  <span className="text-white font-body4 ml-2 relative -top-[3px]">
                    {slippage ? Number(slippage) : 0.5}s
                  </span>
                </div>
                <TransactionSettingsV3
                  show={settingsShow}
                  setSlippage={setSlippage}
                  slippage={slippage}
                  setSettingsShow={setSettingsShow}
                />
              </div>
            </div>

            <div className="sm:flex  mt-4">
              <PriceRangeV3 tokenIn={props.tokenIn} tokenOut={props.tokenOut} />
              <div className="">
                <LiquidityV3
                  setSelectedFeeTier={setSelectedFeeTier}
                  selectedFeeTier={selectedFeeTier}
                  setScreen={setScreen}
                  feeTier={props.feeTier}
                  firstTokenAmount={firstTokenAmountLiq}
                  secondTokenAmount={secondTokenAmountLiq}
                  userBalances={userBalances}
                  setSecondTokenAmount={setSecondTokenAmountLiq}
                  setFirstTokenAmount={setFirstTokenAmountLiq}
                  tokenIn={props.tokenIn}
                  tokenOut={props.tokenOut}
                  setIsAddLiquidity={setIsAddLiquidity}
                  isAddLiquidity={isAddLiquidity}
                  swapData={swapData.current}
                  pnlpBalance={pnlpBalance}
                  setSlippage={setSlippage}
                  slippage={slippage}
                  lpTokenPrice={lpTokenPrice}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </>
        ) : screen === ActivePopUp.Positions ? (
          <>
            <div className="flex gap-1">
              <p className="text-white">
                {props.activeState === ActiveLiquidity.Liquidity && "Manage liquidity"}
              </p>
              <p className="ml-1 relative top-[6px]">
                <InfoIconToolTip message={"Add or remove liquidity from the selected pool."} />
              </p>
            </div>
            <PositionsPopup
              tokenIn={props.tokenIn}
              tokenOut={props.tokenOut}
              setScreen={setScreen}
            />
          </>
        ) : screen === ActivePopUp.ManageExisting ? (
          <div>
            <div className="flex items-center">
              <p
                className="cursor-pointer  relative top-[3px]"
                onClick={() => setScreen(ActivePopUp.Positions)}
              >
                <Image alt={"alt"} src={arrowLeft} />
              </p>
              <p className="text-white">
                {props.activeState === ActiveLiquidity.Liquidity && "Manage liquidity"}
              </p>
              <p className="ml-1 relative top-[0px]">
                <InfoIconToolTip message={"Add or remove liquidity from the selected pool."} />
              </p>
            </div>
            <IncreaseDecreaseLiqMain
              setActiveStateIncDec={setActiveStateIncDec}
              activeStateIncDec={activeStateIncDec}
              firstTokenAmount={firstTokenAmountLiq}
              secondTokenAmount={secondTokenAmountLiq}
              tokenIn={props.tokenIn}
              tokenOut={props.tokenOut}
              tokenPrice={tokenPrice}
              pnlpEstimates={pnlpEstimates}
              sharePool={sharePool}
              slippage={slippage}
              setScreen={setScreen}
              userBalances={userBalances}
              swapData={swapData.current}
              setSecondTokenAmount={setSecondTokenAmountLiq}
              setFirstTokenAmount={setFirstTokenAmountLiq}
            />
          </div>
        ) : null}
        {screen === ActivePopUp.NewPosition && <div className="mt-2">{AddButton}</div>}
        {props.activeState === ActiveLiquidity.Liquidity && screen === ActivePopUp.ConfirmAddV3 && (
          <>
            <ConfirmAddLiquidityv3
              setScreen={setScreen}
              firstTokenAmount={firstTokenAmountLiq}
              secondTokenAmount={secondTokenAmountLiq}
              tokenIn={props.tokenIn}
              tokenOut={props.tokenOut}
              tokenPrice={tokenPrice}
              pnlpEstimates={pnlpEstimates}
              sharePool={sharePool}
              slippage={slippage}
              handleAddLiquidityOperation={handleAddLiquidityOperation}
            />
          </>
        )}
      </PopUpModal>
      {activeStateIncDec === ActiveIncDecState.Increase &&
        screen === ActivePopUp.ConfirmExisting && (
          <ConfirmIncreaseLiq
            setScreen={setScreen}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            addTokenA={2}
            addTokenB={5}
            existingTokenA={9}
            existingTokenB={9}
            show={true}
            setShow={() => {}}
            handleClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      {activeStateIncDec === ActiveIncDecState.Decrease &&
        screen === ActivePopUp.ConfirmExisting && (
          <ConfirmDecreaseLiq
            setScreen={setScreen}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            removeTokenA={8}
            removeTokenB={9}
            show={true}
            setShow={() => {}}
            handleClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={"HtDOhje7Y5A"} />}
      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={contentTransaction}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId ? () => window.open(`${tzktExplorer}${transactionId}`, "_blank") : null
          }
          content={contentTransaction}
        />
      )}
    </>
  ) : null;
}
