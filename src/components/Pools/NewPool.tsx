import { BigNumber } from "bignumber.js";
import Image from "next/image";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";

import info from "../../../src/assets/icon/common/infoIcon.svg";

import { loadSwapDataWrapper } from "../../api/swap/wrappers";
import { getAllTokensBalanceFromTzkt, getPnlpBalance } from "../../api/util/balance";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { getLPTokenPrice } from "../../api/util/price";
import {
  IAllBalanceResponse,
  IAllTokensBalance,
  IAllTokensBalanceResponse,
} from "../../api/util/types";
import playBtn from "../../assets/icon/common/playBtn.svg";
import { Chain, IConfigToken, MigrateToken } from "../../config/types";
import {
  FIRST_TOKEN_AMOUNT,
  SECOND_TOKEN_AMOUNT,
  TOKEN_A,
  TOKEN_B,
} from "../../constants/localStorage";
import { tokensModalNewPool, tokenType } from "../../constants/swap";
import { deployStable, deployVolatile } from "../../operations/factory";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getConfig } from "../../redux/config/config";
import { setFlashMessage } from "../../redux/flashMessage";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import ConfirmTransaction from "../ConfirmTransaction";
import { Flashtype } from "../FlashScreen";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
import { PopUpModal } from "../Modal/popupModal";
import { VideoModal } from "../Modal/videoModal";
import SwapModal from "../SwapModal/SwapModal";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import TransactionSubmitted from "../TransactionSubmitted";
import ConfirmAddPool from "./ConfirmAddPool";
import NewPoolMain, { Pair } from "./NewPoolMain";
import { TextNewPool } from "./TextNewPool";
import TokenModalPool from "./tokenModalPool";
import tokenModal from "./tokenModalPool";

export interface IManageLiquidityProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLiquidityModal: React.Dispatch<React.SetStateAction<boolean>>;
  showLiquidityModal: boolean;
  setReFetchPool: React.Dispatch<React.SetStateAction<boolean>>;
  reFetchPool: boolean;
}

export function NewPool(props: IManageLiquidityProps) {
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [slippage, setSlippage] = useState<string>("0.5");
  const TOKEN = useAppSelector((state) => state.config.tokens);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [pair, setPair] = useState("");
  const [firstTokenAmountLiq, setFirstTokenAmountLiq] = React.useState<string | number>("");
  const [secondTokenAmountLiq, setSecondTokenAmountLiq] = React.useState<number | string>("");

  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});

  const [isAddLiquidity, setIsAddLiquidity] = useState(true);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [burnAmount, setBurnAmount] = React.useState<string | number>("");
  const [transactionId, setTransactionId] = useState("");
  const swapData = React.useRef<ISwapData>({
    tokenInSupply: new BigNumber(0),
    tokenOutSupply: new BigNumber(0),
    lpToken: undefined,
    lpTokenSupply: new BigNumber(0),
    isloading: true,
  });

  const [removeTokenAmount, setRemoveTokenAmount] = useState({
    tokenOneAmount: "",
    tokenTwoAmount: "",
  });
  const tokens = useAppSelector((state) => state.config.tokens);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const tokensArray = Object.entries(tokens);
  const dispatch = useAppDispatch();
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [pnlpBalance, setPnlpBalance] = useState("");

  const [lpTokenPrice, setLpTokenPrice] = useState(new BigNumber(0));
  const [isLoading, setIsLoading] = useState(false);

  const [showConfirmPool, setShowConfirmPool] = useState(false);

  const [contentTransaction, setContentTransaction] = useState("");

  const [tokenIn, setTokenIn] = React.useState<tokenParameterLiquidity>(
    {} as tokenParameterLiquidity
  );
  const [tokenOut, setTokenOut] = React.useState<tokenParameterLiquidity>(
    {} as tokenParameterLiquidity
  );
  const [tokenInOp, setTokenInOp] = React.useState<IConfigToken>({} as IConfigToken);
  const [tokenOutOp, setTokenOutOp] = React.useState<IConfigToken>({} as IConfigToken);

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenIn, "symbol") &&
      Object.prototype.hasOwnProperty.call(tokenOut, "symbol")
    ) {
      getLPTokenPrice(tokenIn.symbol, tokenOut.symbol, {
        [tokenIn.symbol]: tokenPrice[tokenIn.symbol],
        [tokenOut.symbol]: tokenPrice[tokenOut.symbol],
      }).then((res) => {
        setLpTokenPrice(res.lpTokenPrice);
      });
    }
  }, [
    tokenIn,
    tokenOut,
    props,
    tokenPrice[tokenIn.name],
    tokenPrice[tokenOut.name],
    TOKEN,
    balanceUpdate,
    swapData.current,
  ]);

  const [swapModalShow, setSwapModalShow] = useState(false);

  const [tokenType, setTokenType] = useState<tokenType>("tokenIn");
  const selectToken = (token: tokensModalNewPool) => {
    if ((tokenType === "tokenOut" || tokenType === "tokenIn") && firstTokenAmountLiq !== "") {
      setSecondTokenAmountLiq("");
    }
    if (tokenType === "tokenIn") {
      setTokenInOp(token.interface);
      setTokenIn({
        name: token.name,
        symbol: token.name,
        image: token.image,
      });
    } else {
      setTokenOutOp(token.interface);
      setTokenOut({
        name: token.name,
        symbol: token.name,
        image: token.image,
      });
    }
    handleClose();
  };
  const handleClose = () => {
    setSwapModalShow(false);
    setSearchQuery("");
  };

  const resetAllValues = () => {
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");

    setBalanceUpdate(false);
  };

  const closeModal = () => {
    props.setShow(false);
    setTokenIn({} as tokenParameterLiquidity);
    setTokenOut({} as tokenParameterLiquidity);
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");
    setPair("");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [allBalance, setAllBalance] = useState<IAllTokensBalanceResponse>({
    success: false,
    allTokensBalances: {} as IAllTokensBalance,
  });
  useEffect(() => {
    setAllBalance({
      success: false,
      allTokensBalances: {} as IAllTokensBalance,
    });
    if (userAddress) {
      getAllTokensBalanceFromTzkt(Object.values(tokens), userAddress).then(
        (response: IAllTokensBalanceResponse) => {
          setAllBalance(response);
        }
      );
    } else {
      setAllBalance({
        success: false,
        allTokensBalances: {} as IAllTokensBalance,
      });
    }
  }, [userAddress, TOKEN, balanceUpdate]);
  const tokensListConfig = useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1].symbol}.png`,

      chainType: token[1].originChain as Chain,
      address: token[1].address,
      interface: token[1],
    }));
  }, [tokens]);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    if (refetch) {
      dispatch(getConfig());
    }
  }, [refetch]);
  useEffect(() => {
    if (
      (Object.keys(allBalance),
      length !== 0 && allBalance.success && Object.keys(allBalance.allTokensBalances).length !== 0)
    ) {
      tokensListConfig.sort(
        (a, b) =>
          Number(
            allBalance.allTokensBalances[b.name]?.balance
              ? allBalance.allTokensBalances[b.name]?.balance
              : 0
          ) -
          Number(
            allBalance.allTokensBalances[a.name]?.balance
              ? allBalance.allTokensBalances[a.name]?.balance
              : 0
          )
      );
    }
  }, [tokensListConfig, allBalance.allTokensBalances]);

  const handleTokenType = (type: tokenType) => {
    setBalanceUpdate(false);
    setSwapModalShow(true);
    setTokenType(type);
  };

  const handleAddNewPoolOperation = () => {
    setShowConfirmPool(false);
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(tokenIn.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(tokenOut.name));
    localStorage.setItem(FIRST_TOKEN_AMOUNT, pair === Pair.VOLATILE ? "volatile" : "stable");

    setContentTransaction(`new pool`);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    props.setReFetchPool(false);
    setRefetch(false);
    setShowConfirmTransaction(true);
    if (pair === Pair.VOLATILE) {
      deployVolatile(
        tokenInOp,
        tokenOutOp,
        userAddress,
        new BigNumber(firstTokenAmountLiq),
        new BigNumber(secondTokenAmountLiq),
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        {
          flashType: Flashtype.Info,
          headerText: "Transaction submitted",
          trailingText: `Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
            TOKEN_B
          )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool confirmed
          `,
          linkText: "View in Explorer",
          isLoading: true,
          transactionId: "",
        }
      ).then((response) => {
        if (response.success) {
          closeModal();
          setBalanceUpdate(true);
          resetAllValues();
          setTimeout(() => {
            setShowTransactionSubmitModal(false);
            dispatch(
              setFlashMessage({
                flashType: Flashtype.Success,
                headerText: "Success",
                trailingText: `Addition of new ${localStorage.getItem(
                  TOKEN_A
                )}/${localStorage.getItem(TOKEN_B)} ${localStorage.getItem(
                  FIRST_TOKEN_AMOUNT
                )} pool confirmed`,
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
            setRefetch(true);
          }, 6000);

          setTimeout(() => {
            props.setReFetchPool(true);
          }, 7000);
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setContentTransaction("");
        } else {
          setBalanceUpdate(true);
          closeModal();
          //resetAllValues();
          setShowConfirmTransaction(false);
          setTimeout(() => {
            setShowTransactionSubmitModal(false);
            dispatch(
              setFlashMessage({
                flashType: Flashtype.Rejected,
                transactionId: "",
                headerText: "Rejected",
                trailingText: `Addition of new ${localStorage.getItem(
                  TOKEN_A
                )}/${localStorage.getItem(TOKEN_B)} ${localStorage.getItem(
                  FIRST_TOKEN_AMOUNT
                )} pool rejected`,
                linkText: "",
                isLoading: true,
              })
            );
          }, 2000);

          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setContentTransaction("");
        }
      });
    } else if (pair === Pair.STABLE) {
      deployStable(
        tokenInOp,
        tokenOutOp,
        userAddress,
        new BigNumber(firstTokenAmountLiq),
        new BigNumber(secondTokenAmountLiq),
        transactionSubmitModal,
        resetAllValues,
        setShowConfirmTransaction,
        {
          flashType: Flashtype.Info,
          headerText: "Transaction submitted",
          trailingText: `Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
            TOKEN_B
          )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool confirmed`,
          linkText: "View in Explorer",
          isLoading: true,
          transactionId: "",
        }
      ).then((response) => {
        if (response.success) {
          closeModal();
          setBalanceUpdate(true);
          resetAllValues();
          setTimeout(() => {
            setShowTransactionSubmitModal(false);
            dispatch(
              setFlashMessage({
                flashType: Flashtype.Success,
                headerText: "Success",
                trailingText: `Addition of new ${localStorage.getItem(
                  TOKEN_A
                )}/${localStorage.getItem(TOKEN_B)} ${localStorage.getItem(
                  FIRST_TOKEN_AMOUNT
                )} pool confirmed`,
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
          setContentTransaction("");
        } else {
          closeModal();
          setBalanceUpdate(true);
          resetAllValues();
          setShowConfirmTransaction(false);
          setTimeout(() => {
            setShowTransactionSubmitModal(false);
            dispatch(
              setFlashMessage({
                flashType: Flashtype.Rejected,
                transactionId: "",
                headerText: "Rejected",
                trailingText: `Addition of new ${localStorage.getItem(
                  TOKEN_A
                )}/${localStorage.getItem(TOKEN_B)} ${localStorage.getItem(
                  FIRST_TOKEN_AMOUNT
                )} pool rejected`,
                linkText: "",
                isLoading: true,
              })
            );
          }, 2000);

          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setContentTransaction("");
        }
      });
    }
  };
  return (
    <>
      {props.show && (
        <PopUpModal
          onhide={closeModal}
          className="w-[390px] max-w-[390px] md:w-[620px] md:max-w-[620px] rounded-none md:rounded-3xl "
          footerChild={
            <div className="flex justify-center items-center gap-2 md:gap-4 px-4 md:px-0">
              <p className="font-subtitle1 md:text-f16 text-text-150"></p>
              <Image
                className="cursor-pointer hover:opacity-90"
                onClick={() => setShowVideoModal(true)}
                src={playBtn}
              />
            </div>
          }
        >
          <>
            <div className="flex ">
              <div className="mx-2 text-white font-title3">Add new pool</div>
              <div className="relative top-[2px]">
                <ToolTip
                  id="tooltip2"
                  position={Position.top}
                  toolTipChild={
                    <div className="w-[100px] md:w-[250px]">
                      Create a new liquidity pool for a token pair.
                    </div>
                  }
                >
                  <Image alt={"alt"} src={info} />
                </ToolTip>
              </div>
            </div>
            <div className="flex gap-1">
              <p className="ml-1 relative top-[6px]"></p>
            </div>
            <TextNewPool />
            <div className="">
              <NewPoolMain
                setShowConfirmPool={setShowConfirmPool}
                firstTokenAmount={firstTokenAmountLiq}
                secondTokenAmount={secondTokenAmountLiq}
                userBalances={allBalance.allTokensBalances}
                setSecondTokenAmount={setSecondTokenAmountLiq}
                setFirstTokenAmount={setFirstTokenAmountLiq}
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                setIsAddLiquidity={setIsAddLiquidity}
                isAddLiquidity={isAddLiquidity}
                pnlpBalance={pnlpBalance}
                setBurnAmount={setBurnAmount}
                burnAmount={burnAmount}
                setRemoveTokenAmount={setRemoveTokenAmount}
                removeTokenAmount={removeTokenAmount}
                setSlippage={setSlippage}
                slippage={slippage}
                lpTokenPrice={lpTokenPrice}
                isLoading={isLoading}
                handleTokenType={handleTokenType}
                setPair={setPair}
                pair={pair}
                setShowLiquidityModal={props.setShowLiquidityModal}
                showLiquidityModal={props.showLiquidityModal}
              />
            </div>
          </>
        </PopUpModal>
      )}
      {showConfirmPool && (
        <ConfirmAddPool
          show={showConfirmPool}
          pair={pair}
          setShow={setShowConfirmPool}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          firstTokenAmount={firstTokenAmountLiq}
          secondTokenAmount={secondTokenAmountLiq}
          onClick={handleAddNewPoolOperation}
          routeDetails={
            {} as {
              path: string[];
              minimumOut: BigNumber;
              minimumTokenOut: BigNumber[];
              priceImpact: BigNumber;
              finalFeePerc: BigNumber;
              feePerc: BigNumber[];
              isStable: boolean[];
              exchangeRate: BigNumber;
              success: boolean;
            }
          }
        />
      )}
      <TokenModalPool
        tokens={tokensListConfig.filter((e: any) => {
          return (
            e.name.toLowerCase() !== MigrateToken.PLENTY.toLowerCase() &&
            e.name.toLowerCase() !== MigrateToken.WRAP.toLowerCase()
          );
        })}
        show={swapModalShow}
        isLoading={allBalance.success}
        allBalance={allBalance.allTokensBalances}
        selectToken={selectToken}
        onhide={handleClose}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        tokenType={tokenType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={`Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
            TOKEN_B
          )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool confirmed`}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId
              ? () => window.open(`https://ghostnet.tzkt.io/${transactionId}`, "_blank")
              : null
          }
          content={`Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
            TOKEN_B
          )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool confirmed`}
        />
      )}
    </>
  );
}
