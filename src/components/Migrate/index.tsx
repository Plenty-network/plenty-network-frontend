import clsx from "clsx";
import "animate.css";
import { isMobile } from "react-device-detect";
import fromExponential from "from-exponential";
import Button from "../Button/Button";
import TokenDropdown from "../TokenDropdown/TokenDropdown";
import { useEffect, useMemo, useRef, useState } from "react";
import { ERRORMESSAGES, tokenParameter, tokensModal, tokenType } from "../../../src/constants/swap";

import info from "../../assets/icon/swap/info.svg";
import { BigNumber } from "bignumber.js";
import ply from "../../assets/Tokens/ply.png";

import ConfirmTransaction from "../ConfirmTransaction";
import TransactionSubmitted from "../TransactionSubmitted";
import { AppDispatch, store, useAppDispatch, useAppSelector } from "../../redux";
import { Position, ToolTip, TooltipType } from "../Tooltip/TooltipAdvanced";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { MigrateTokens } from "../../constants/MigrateToken";
import TokenModalMigrate from "./TokensSelect";
import exchange1 from "../../assets/icon/migrate/exchange.svg";
import Image from "next/image";
import ConfirmMigrate from "./ConfirmMigrate";
import { getMigrateExchangeAmount } from "../../api/migrate";
import { MigrateToken } from "../../config/types";
import { IMigrateExchange } from "../../api/migrate/types";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import { exchange } from "../../operations/veSwap";
import { Flashtype } from "../FlashScreen";
import { setFlashMessage } from "../../redux/flashMessage";
import Config from "../../config/config";
import { FIRST_TOKEN_AMOUNT, TOKEN_A } from "../../constants/localStorage";
import { IAllTokensBalanceResponse } from "../../api/util/types";
import { tzktExplorer } from "../../common/walletconnect";
import { nFormatterWithLesserNumber } from "../../api/util/helpers";

interface IMigrateProps {
  allBalance: {
    [key: string]: string;
  };
}

function Migrate(props: IMigrateProps) {
  const [firstTokenAmount, setFirstTokenAmount] = useState("");
  const [secondTokenAmount, setSecondTokenAmount] = useState("");

  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [tokenIn, setTokenIn] = useState<tokenParameter>({
    name: MigrateTokens[1].name,
    image: MigrateTokens[1].image,
  });

  const [tokenOut, setTokenOut] = useState<tokenParameter>({
    name: "PLY",
    image: ply,
  });
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  useEffect(() => {
    if (firstTokenAmount !== "") {
      handleTokenInput(firstTokenAmount);
    }
  }, [tokenIn.name]);
  const [tokenModal, setTokenModal] = useState(false);
  const [confirmMigratePopup, setConfirmMigratePopup] = useState(false);
  const selectToken = (token: tokensModal) => {
    setSecondTokenAmount("");

    setTokenIn({
      name: token.name,
      image: token.image,
    });
    setTokenModal(false);
  };
  const MigrateButton = useMemo(() => {
    if (userAddress) {
      if (firstTokenAmount === "" || Number(firstTokenAmount) === 0) {
        return (
          <Button color="disabled" width="w-full">
            Enter an amount
          </Button>
        );
      } else if (new BigNumber(firstTokenAmount).isGreaterThan(props.allBalance[tokenIn.name])) {
        return (
          <Button color="disabled" width="w-full">
            Insufficient balance
          </Button>
        );
      } else {
        return (
          <Button color="primary" width="w-full" onClick={() => setConfirmMigratePopup(true)}>
            Migrate
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
  }, [firstTokenAmount, props.allBalance.allTokensBalances, tokenIn]);
  const [exchangeRes, setExchangeRes] = useState<IMigrateExchange>({} as IMigrateExchange);
  const handleTokenInput = (input: string | number) => {
    if (input == ".") {
      setFirstTokenAmount("0.");
      return;
    } else if (input === "" || isNaN(Number(input))) {
      setFirstTokenAmount("");
      setSecondTokenAmount("");
      setExchangeRes({} as IMigrateExchange);
    } else {
      setFirstTokenAmount(input.toString().trim());
      const res = getMigrateExchangeAmount(
        new BigNumber(input),
        tokenIn.name === "PLENTY" ? MigrateToken.PLENTY : MigrateToken.WRAP
      );
      setExchangeRes(res);
      setSecondTokenAmount(res.claimableAmount.decimalPlaces(6, 1).toString());
    }
  };
  const [isFirstInputFocus, setIsFirstInputFocus] = useState(false);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  const [errorMessage, setErrorMessage] = useState("");
  const onClickAmount = () => {
    setSecondTokenAmount("");

    handleTokenInput(props.allBalance[tokenIn.name]);
  };

  const handleTokenType = () => {
    setBalanceUpdate(false);
    setTokenModal(true);
  };
  const resetAllValues = () => {
    setFirstTokenAmount("");
    setSecondTokenAmount("");
    setExchangeRes({} as IMigrateExchange);
  };
  const handleExchangeOperation = () => {
    setConfirmMigratePopup(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));

    localStorage.setItem(TOKEN_A, tokenIn.name);
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT,
      new BigNumber(firstTokenAmount).decimalPlaces(4, 1).toString()
    );
    exchange(
      tokenIn.name === "PLENTY" ? MigrateToken.PLENTY : MigrateToken.WRAP,
      new BigNumber(firstTokenAmount),
      userAddress,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Migration of ${localStorage.getItem(
          FIRST_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_A)} `,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Migration of ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_A)}`,
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

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);

        dispatch(
          setFlashMessage({
            flashType: Flashtype.Rejected,
            headerText: "Rejected",
            trailingText: `Migration of ${localStorage.getItem(
              FIRST_TOKEN_AMOUNT
            )} ${localStorage.getItem(TOKEN_A)} `,
            linkText: "",
            isLoading: true,
            transactionId: "",
          })
        );
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  return (
    <>
      <div className="lg:w-640  md:mx-auto mt-[36px]">
        <div className="flex  border border-text-800 bg-card-500 h-[48px] items-center  px-3 md:rounded-2xl gap-1 md:gap-2.5 md:w-[460px]">
          <Image src={exchange1} />
          <span className="font-body1">Exchange rate:</span>
          <span className="md:font-body4 font-body2">
            1 WRAP = {Config.EXCHANGE_TOKENS.WRAP.exchangeRate} PLY
          </span>
          <span className="border-r border-text-250 h-[18px] w-px"></span>
          <span className="md:font-body4 font-body2">
            1 PLENTY = {Config.EXCHANGE_TOKENS.PLENTY.exchangeRate} PLY
          </span>
        </div>
      </div>
      <div
        className={clsx(
          "bg-card-500 md:border border-y border-text-800 mt-[16px]  md:rounded-3xl  text-white lg:w-640 pt-[24px] pb-2 mx-auto fade-in"
        )}
      >
        {/* <div className="flex items-center flex-row px-5 lg:px-9 relative">
          <div className="font-title2">Migrate</div>
        </div> */}
        <div
          className={clsx(
            "lg:w-580  h-[102px] border bg-muted-200/[0.1]  mx-5 lg:mx-[30px] rounded-2xl px-4 hover:border-text-700",
            (new BigNumber(firstTokenAmount).isGreaterThan(props.allBalance[tokenIn.name]) ||
              errorMessage !== "") &&
              "border-errorBorder hover:border-errorBorder bg-errorBg",
            isFirstInputFocus ? "border-text-700" : "border-text-800 "
          )}
        >
          <div className="flex ">
            <div className={clsx(" mt-4", "flex-none")}>
              <TokenDropdown
                onClick={() => handleTokenType()}
                tokenIcon={tokenIn.image}
                tokenName={tokenIn.name}
                tokenSymbol={tokenIn.name}
              />
            </div>
            <div className="flex-auto my-3 ml-2 ">
              <div className="text-right font-body1 text-text-400 ">YOU PAY</div>
              <div>
                <input
                  type="text"
                  className={clsx(
                    "text-white bg-card-500 text-right border-0 font-medium2  lg:font-medium1 outline-none w-[100%] placeholder:text-text-500"
                  )}
                  placeholder="0.0"
                  onChange={(e) => handleTokenInput(e.target.value)}
                  value={firstTokenAmount}
                  onFocus={() => setIsFirstInputFocus(true)}
                  onBlur={() => setIsFirstInputFocus(false)}
                />
              </div>
            </div>
          </div>
          <div className="flex -mt-[20px]">
            <div className="text-left cursor-pointer" onClick={onClickAmount}>
              <span className="text-text-600 font-body3">Balance:</span>{" "}
              <span className="font-body4 cursor-pointer text-primary-500 ">
                {Number(props.allBalance[tokenIn.name]) >= 0 ? (
                  <ToolTip
                    message={fromExponential(props.allBalance[tokenIn.name].toString())}
                    disable={Number(props.allBalance[tokenIn.name]) > 0 ? false : true}
                    id="tooltip8"
                    position={Position.right}
                  >
                    {Number(props.allBalance[tokenIn.name]) > 0
                      ? Number(props.allBalance[tokenIn.name])?.toFixed(4)
                      : 0}
                  </ToolTip>
                ) : (
                  "--"
                )}
              </span>
            </div>
            {/* <div className="text-right ml-auto font-body2 text-text-400">
              ~$
              {firstTokenAmount && tokenPrice[tokenIn.name]
                ? Number(Number(firstTokenAmount) * Number(tokenPrice[tokenIn.name])).toFixed(2)
                : "0.00"}
            </div> */}
          </div>
        </div>
        {errorMessage !== "" && (
          <div className="mt-3 mx-5 lg:mr-[30px] lg:ml-[50px] font-body2 lg:font-body3 text-error-500">
            {errorMessage}
          </div>
        )}

        <div className=" pt-[24px] mt-[24px] pb-5 border border-primary-500/[0.2] mx-px md:mx-2 lg:mx-2  px-5 lg:px-[22px] rounded-3xl bg-primary-500/[0.04]">
          <div
            className={clsx(
              "lg:w-580 secondtoken h-[102px] border border-text-800 rounded-2xl  px-4 border-primary-500/[0.2] hover:border-primary-500/[0.6] bg-card-500 hover:bg-primary-500/[0.02]"
            )}
          >
            <div className=" flex ">
              <div className={clsx(" mt-4", "flex-none")}>
                <TokenDropdown
                  tokenIcon={tokenOut.image}
                  tokenName={tokenOut.name}
                  isArrow={true}
                  tokenSymbol={tokenOut.name}
                />
              </div>
              <div className=" my-3 flex-auto ml-2">
                <div className="text-right font-body1 text-text-400 ">YOU RECEIVE</div>
                <div>
                  <input
                    type="text"
                    className={clsx(
                      "text-primary-500  inputSecond text-right border-0 font-input-text lg:font-medium1 outline-none w-[100%] placeholder:text-primary-500 cursor-not-allowed"
                    )}
                    disabled
                    placeholder="0.0"
                    value={secondTokenAmount}
                  />
                </div>
              </div>
            </div>
            <div className="flex -mt-[12px]">
              <div className="text-left flex">
                <span className="font-body3 text-text-500">1 {tokenIn.name} =</span>
                <span className="font-body4 text-text-250 ml-1">
                  {tokenIn.name === "PLENTY"
                    ? Config.EXCHANGE_TOKENS.PLENTY.exchangeRate
                    : Config.EXCHANGE_TOKENS.WRAP.exchangeRate}{" "}
                  PLY
                </span>
              </div>
              <div className="text-right ml-auto font-body2 text-text-400 flex">
                {exchangeRes.vestedAmount ? (
                  <>
                    <span className="text-white mr-1">
                      + {nFormatterWithLesserNumber(exchangeRes?.vestedAmount)} PLY
                    </span>{" "}
                    vested <span className="md:block hidden ml-1">for upto 05-Jan-2025</span>
                    {/* <span className="md:hidden relative top-1">
                      <Image src={info} />
                    </span> */}
                  </>
                ) : (
                  "--"
                )}
              </div>
            </div>
          </div>

          <div className="mt-5">{MigrateButton}</div>
        </div>
      </div>
      {/* <div className="font-body2 text-text-250 mt-4 mx-2 md:mx-auto md:w-[568px] text-center mb-5">
        Tip: Convert PLENTY/WRAP to PLY. By locking PLY, you&apos;re earning fees and bribe rewards
        from your veNFT, plus you may boost your gauge rewards.
      </div> */}

      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={`Migration of ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} ${localStorage.getItem(
            TOKEN_A
          )} `}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId ? () => window.open(`${tzktExplorer}${transactionId}`, "_blank") : null
          }
          content={`Migration of ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} ${localStorage.getItem(
            TOKEN_A
          )}`}
        />
      )}
      <TokenModalMigrate
        tokens={MigrateTokens.sort(
          (a, b) => Number(props.allBalance[b.name]) - Number(props.allBalance[a.name])
        )}
        show={tokenModal}
        allBalance={props.allBalance}
        isSuccess={true}
        selectToken={selectToken}
        onhide={setTokenModal}
        tokenIn={tokenIn}
      />
      <ConfirmMigrate
        show={confirmMigratePopup}
        setShow={setConfirmMigratePopup}
        handleClick={handleExchangeOperation}
        exchangeRes={exchangeRes}
        tokenIn={tokenIn.name}
      />
    </>
  );
}

export default Migrate;
