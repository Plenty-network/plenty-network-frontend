import { BigNumber } from "bignumber.js";
import Image from "next/image";
import * as React from "react";

import fallback from "../../assets/icon/pools/fallback.png";
import { useEffect, useState, useMemo } from "react";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import { getAllTokensBalanceFromTzkt, getPnlpBalance } from "../../api/util/balance";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { getTokenDataFromTzkt } from "../../api/util/tokens";
import { IAllTokensBalance, IAllTokensBalanceResponse } from "../../api/util/types";
import playBtn from "../../assets/icon/common/playBtn.svg";
import { Chain, IConfigToken, MigrateToken } from "../../config/types";
import { FIRST_TOKEN_AMOUNT, TOKEN_A, TOKEN_B } from "../../constants/localStorage";
import { tokensModalNewPool, tokenType } from "../../constants/swap";
import { deployStable, deployTezPair, deployVolatile } from "../../operations/factory";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getConfig } from "../../redux/config/config";
import { setFlashMessage } from "../../redux/flashMessage";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import ConfirmTransaction from "../ConfirmTransaction";
import { Flashtype } from "../FlashScreen";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
import { PopUpModal } from "../Modal/popupModal";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import TransactionSubmitted from "../TransactionSubmitted";
import ConfirmAddPool from "./ConfirmAddPool";
import NewPoolMain, { Pair } from "./NewPoolMain";
import { TextNewPool } from "./TextNewPool";
import TokenModalPool from "./tokenModalPool";
import { tzktExplorer } from "../../common/walletconnect";

export interface IManageLiquidityProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLiquidityModal: (val: boolean) => void;
  showLiquidityModal: boolean;
  setReFetchPool: React.Dispatch<React.SetStateAction<boolean>>;
  reFetchPool: boolean;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
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

  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [burnAmount, setBurnAmount] = React.useState<string | number>("");
  const [transactionId, setTransactionId] = useState("");

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
  const closeModal = () => {
    props.setShow(false);
    setTokenIn({} as tokenParameterLiquidity);
    setTokenOut({} as tokenParameterLiquidity);
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");
    setPair("");
  };
  const resetAllValues = () => {
    closeModal();
    setPair("");
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");

    setBalanceUpdate(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [allBalance, setAllBalance] = useState<IAllTokensBalanceResponse>({
    success: false,
    allTokensBalances: {} as IAllTokensBalance,
  });
  useEffect(() => {
    if (props.show && userAddress) {
      getAllTokensBalanceFromTzkt(Object.values(tokens), userAddress).then(
        (response: IAllTokensBalanceResponse) => {
          console.log("newpool", response);
          setAllBalance(response);
        }
      );
    } else {
      setAllBalance({
        success: false,
        allTokensBalances: {} as IAllTokensBalance,
      });
    }
  }, [userAddress, TOKEN, balanceUpdate, tokenIn.name, tokenOut.name, props.show]);
  const [contractTokenBalance, setContractTokenBalance] = useState<IAllTokensBalance>(
    {} as IAllTokensBalance
  );

  useEffect(() => {
    if (searchQuery !== "" && searchQuery.length > 8) {
      getTokenDataFromTzkt(searchQuery.trim()).then((res) => {
        if (res.allTokensList.length !== 0) {
          getAllTokensBalanceFromTzkt(res.allTokensList, userAddress).then((res) => {
            // contractTokenBalance.push(res.allTokensBalances);
            setContractTokenBalance(res.allTokensBalances);
          });
        }
      });
    }
  }, [searchQuery]);
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
  useEffect(() => {
    setPair("");
    if (
      (tokenIn.name === "XTZ" && tokenOut.name !== "CTez") ||
      (tokenOut.name === "XTZ" && tokenIn.name !== "CTez")
    ) {
      setPair(Pair.VOLATILE);
    } else if (
      (tokenIn.name === "XTZ" && tokenOut.name === "CTez") ||
      (tokenOut.name === "XTZ" && tokenIn.name === "CTez")
    ) {
      setPair(Pair.STABLE);
    }
  }, [tokenIn.name, tokenOut.name]);

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
    if (pair === Pair.VOLATILE && tokenIn.name !== "XTZ" && tokenOut.name !== "XTZ") {
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
          )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool`,
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
                )} pool`,
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
                trailingText:
                  response.error === "NOT_ENOUGH_TEZ"
                    ? `You do not have enough tez`
                    : `Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
                        TOKEN_B
                      )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool`,
                linkText: "",
                isLoading: true,
              })
            );
          }, 2000);

          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setContentTransaction("");
        }
      });
    } else if (pair === Pair.VOLATILE && (tokenIn.name === "XTZ" || tokenOut.name === "XTZ")) {
      deployTezPair(
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
          )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool`,
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
                )} pool`,
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
                trailingText:
                  response.error === "NOT_ENOUGH_TEZ"
                    ? `You do not have enough tez`
                    : `Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
                        TOKEN_B
                      )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool`,
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
          )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool`,
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
                )} pool`,
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
                trailingText:
                  response.error === "NOT_ENOUGH_TEZ"
                    ? `You do not have enough tez`
                    : `Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
                        TOKEN_B
                      )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool`,
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
          className="w-[390px] max-w-[390px] sm:w-[620px] sm:max-w-[620px] rounded-none sm:rounded-3xl "
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
                  <Image alt={"alt"} src={info} className="cursor-pointer" />
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
                setShowLiquidityModalPopup={props.setShowLiquidityModalPopup}
                setSecondTokenAmount={setSecondTokenAmountLiq}
                setFirstTokenAmount={setFirstTokenAmountLiq}
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                pnlpBalance={pnlpBalance}
                setBurnAmount={setBurnAmount}
                burnAmount={burnAmount}
                setRemoveTokenAmount={setRemoveTokenAmount}
                removeTokenAmount={removeTokenAmount}
                setSlippage={setSlippage}
                slippage={slippage}
                isLoading={isLoading}
                handleTokenType={handleTokenType}
                setPair={setPair}
                pair={pair}
                setShowLiquidityModal={props.setShowLiquidityModal}
                showLiquidityModal={props.showLiquidityModal}
                contractTokenBalance={contractTokenBalance}
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
            // e.name.toLowerCase() !== "XTZ".toLowerCase() &&
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
          )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool`}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId ? () => window.open(`${tzktExplorer}${transactionId}`, "_blank") : null
          }
          content={`Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
            TOKEN_B
          )} ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} pool`}
        />
      )}
    </>
  );
}
