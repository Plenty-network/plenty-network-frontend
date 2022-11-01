import clsx from "clsx";
import "animate.css";
import { isMobile } from "react-device-detect";
import fromExponential from "from-exponential";
import Button from "../Button/Button";
import TokenDropdown from "../TokenDropdown/TokenDropdown";
import { useEffect, useMemo, useRef, useState } from "react";
import { ERRORMESSAGES, tokenParameter, tokensModal, tokenType } from "../../../src/constants/swap";
import { BigNumber } from "bignumber.js";
import ctez from "../../assets/Tokens/ctez.png";

import ConfirmTransaction from "../ConfirmTransaction";
import TransactionSubmitted from "../TransactionSubmitted";
import { AppDispatch, store, useAppDispatch, useAppSelector } from "../../redux";
import { setLoading } from "../../redux/isLoading/action";
import { Position, ToolTip, TooltipType } from "../Tooltip/TooltipAdvanced";
import { getCompleteUserBalace } from "../../api/util/balance";
import { IAllBalanceResponse } from "../../api/util/types";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { MigrateTokens } from "../../constants/MigrateToken";
import TokenModalMigrate from "./TokensSelect";
import exchange from "../../assets/icon/migrate/exchange.svg";
import Image from "next/image";
import ConfirmMigrate from "./ConfirmMigrate";

interface IMigrateProps {}

function Migrate(props: IMigrateProps) {
  const [firstTokenAmount, setFirstTokenAmount] = useState("");
  const [secondTokenAmount, setSecondTokenAmount] = useState("");
  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });

  const tokens = useAppSelector((state) => state.config.standard);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  useEffect(() => {
    setAllBalance({ success: false, userBalance: {} });
    if (userAddress) {
      getCompleteUserBalace(userAddress).then((response: IAllBalanceResponse) => {
        setAllBalance(response);
      });
    } else {
      setAllBalance({ success: true, userBalance: {} });
    }
  }, [userAddress, tokens, balanceUpdate]);
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [tokenIn, setTokenIn] = useState<tokenParameter>({
    name: MigrateTokens[0].name,
    image: MigrateTokens[0].image,
  });

  const [tokenOut, setTokenOut] = useState<tokenParameter>({
    name: "PLY",
    image: ctez,
  });
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
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
      } else if (
        new BigNumber(firstTokenAmount).isGreaterThan(allBalance.userBalance[tokenIn.name])
      ) {
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
          Connect Wallet
        </Button>
      );
    }
  }, [props]);
  const handleTokenInput = (input: string | number) => {
    if (input == ".") {
      setFirstTokenAmount("0.");
      return;
    } else if (input === "" || isNaN(Number(input))) {
      setFirstTokenAmount("");
    } else {
      setFirstTokenAmount(input.toString());
    }
  };
  const [isFirstInputFocus, setIsFirstInputFocus] = useState(false);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  const [errorMessage, setErrorMessage] = useState("");
  const onClickAmount = () => {
    setSecondTokenAmount("");

    handleTokenInput(allBalance.userBalance[tokenIn.name].toNumber());
  };

  const handleTokenType = () => {
    setBalanceUpdate(false);
    setTokenModal(true);
  };
  return (
    <>
      <div className="lg:w-640  md:mx-auto mt-[36px]">
        <div className="flex  border border-text-800 bg-card-500 h-[48px] items-center  px-5 md:rounded-2xl gap-1.5 md:gap-2.5 md:w-[400px]">
          <Image src={exchange} />
          <span className="font-body1">Exchange rate:</span>
          <span className="font-body4">1 WRAP=2 PLY</span>
          <span className="border-r border-text-250 h-[18px] w-px"></span>
          <span className="font-body4">1 PLENTY=2 PLY</span>
        </div>
      </div>
      <div
        className={clsx(
          "bg-card-500 md:border border-y border-text-800 mt-[16px]  md:rounded-3xl  text-white lg:w-640 pt-5 pb-2 mx-auto fade-in"
        )}
      >
        <div className="flex items-center flex-row px-5 lg:px-9 relative">
          <div className="font-title2">Migrate</div>
        </div>
        <div
          className={clsx(
            "lg:w-580 mt-4 h-[102px] border bg-muted-200/[0.1]  mx-5 lg:mx-[30px] rounded-2xl px-4 hover:border-text-700",
            (new BigNumber(firstTokenAmount).isGreaterThan(allBalance.userBalance[tokenIn.name]) ||
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
              />
            </div>
            <div className="flex-auto my-3 ">
              <div className="text-right font-body1 text-text-400">YOU PAY</div>
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
          <div className="flex -mt-[12px]">
            <div className="text-left cursor-pointer" onClick={onClickAmount}>
              <span className="text-text-600 font-body3">Balance:</span>{" "}
              <span className="font-body4 text-primary-500 ">
                {Number(allBalance.userBalance[tokenIn.name]) >= 0 ? (
                  <ToolTip
                    message={fromExponential(allBalance.userBalance[tokenIn.name].toString())}
                    disable={Number(allBalance.userBalance[tokenIn.name]) > 0 ? false : true}
                    id="tooltip8"
                    position={Position.right}
                  >
                    {Number(allBalance.userBalance[tokenIn.name]) > 0
                      ? Number(allBalance.userBalance[tokenIn.name]).toFixed(4)
                      : 0}
                  </ToolTip>
                ) : (
                  "--"
                )}
              </span>
            </div>
            <div className="text-right ml-auto font-body2 text-text-400">
              ~$
              {firstTokenAmount && tokenPrice[tokenIn.name]
                ? Number(Number(firstTokenAmount) * Number(tokenPrice[tokenIn.name])).toFixed(2)
                : "0.00"}
            </div>
          </div>
        </div>
        {errorMessage !== "" && (
          <div className="mt-3 mx-5 lg:mr-[30px] lg:ml-[50px] font-body2 lg:font-body3 text-error-500">
            {errorMessage}
          </div>
        )}

        <div className=" pt-[41px] mt-[24px] pb-5 border border-primary-500/[0.2] mx-px md:mx-2 lg:mx-2  px-5 lg:px-[22px] rounded-3xl bg-primary-500/[0.04]">
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
                />
              </div>
              <div className=" my-3 flex-auto">
                <div className="text-right font-body1 text-text-400">YOU RECEIVE</div>
                <div>
                  {secondTokenAmount === "" ? (
                    <p className="ml-auto my-[4px] w-[100px]  h-[32px] rounded animate-pulse bg-shimmer-100"></p>
                  ) : (
                    <input
                      type="text"
                      className={clsx(
                        "text-primary-500  inputSecond text-right border-0 font-input-text lg:font-medium1 outline-none w-[100%] placeholder:text-primary-500 "
                      )}
                      placeholder="0.0"
                      value={secondTokenAmount}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex -mt-[12px]">
              <div className="text-left">
                <span className="text-text-600 font-body3">Balance:</span>{" "}
                <span className="font-body4 text-text-500 ">
                  {Number(allBalance.userBalance[tokenOut.name]) >= 0 ? (
                    <ToolTip
                      message={fromExponential(allBalance.userBalance[tokenOut.name].toString())}
                      disable={Number(allBalance.userBalance[tokenOut.name]) > 0 ? false : true}
                      id="tooltip9"
                      position={Position.right}
                    >
                      {Number(allBalance.userBalance[tokenOut.name]) > 0
                        ? Number(allBalance.userBalance[tokenOut.name]).toFixed(4)
                        : 0}
                    </ToolTip>
                  ) : (
                    "--"
                  )}
                </span>
              </div>
              <div className="text-right ml-auto font-body2 text-text-400">
                ~$
                {secondTokenAmount && tokenPrice[tokenOut.name]
                  ? Number(Number(secondTokenAmount) * Number(tokenPrice[tokenOut.name])).toFixed(2)
                  : "0.00"}
              </div>
            </div>
          </div>

          <div className="mt-5">{MigrateButton}</div>
        </div>
      </div>
      <div className="font-body2 text-text-250 mt-4 mx-2 md:mx-auto md:w-[568px] text-center">
        Tip: Convert PLENTY/WRAP to PLY. By staking PLY, you’re earning the usual rewards from
        vePLY, plus a share of 10% of the LPs’ boosted PLY earnings, and bribe tokens on top of
        that.
      </div>

      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={`Migrate`}
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
          content={`Migrate`}
        />
      )}
      <TokenModalMigrate
        tokens={MigrateTokens.sort(
          (a, b) => Number(allBalance.userBalance[b.name]) - Number(allBalance.userBalance[a.name])
        )}
        show={tokenModal}
        allBalance={allBalance.userBalance}
        selectToken={selectToken}
        onhide={setTokenModal}
        tokenIn={tokenIn}
      />
      <ConfirmMigrate
        show={confirmMigratePopup}
        setShow={setConfirmMigratePopup}
        handleClick={() => {}}
      />
    </>
  );
}

export default Migrate;
