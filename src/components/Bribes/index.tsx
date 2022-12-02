import HeadInfo from "../HeadInfo";
import { BribesMainProps } from "./types";

import { BigNumber } from "bignumber.js";
import { useEffect, useState } from "react";
import { BribesCardHeader, BribesHeader } from "./BribesHeader";
import { AppDispatch, store, useAppSelector } from "../../redux";
import { PoolsTableBribes } from "./PoolsTableBribes";
import AddBribes from "./AddBribes";
import { tokenParameter } from "../../constants/swap";
import { MyBribesTableBribes } from "./MyBribes";
import { SideBarHOC } from "../Sidebar/SideBarHOC";

import { IPoolsForBribesData } from "../../api/bribes/types";
import ConfirmTransaction from "../ConfirmTransaction";
import TransactionSubmitted from "../TransactionSubmitted";
import { useDispatch } from "react-redux";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import { addBribe } from "../../operations/bribes";
import { setFlashMessage } from "../../redux/flashMessage";
import { Flashtype } from "../FlashScreen";
import { getAllTokensBalanceFromTzkt } from "../../api/util/balance";
import {
  IAllBalanceResponse,
  IAllTokensBalance,
  IAllTokensBalanceResponse,
} from "../../api/util/types";
import { TOKEN_A, TOKEN_B } from "../../constants/localStorage";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";

function BribesMain(props: BribesMainProps) {
  const [contentTransaction, setContentTransaction] = useState("");

  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [bribeToken, setBribeToken] = useState({} as tokenParameter);
  const [bribeInputValue, setBribeInputValue] = useState("");
  const [showAddBribes, setShowAddBribes] = useState(false);
  const [selectedPool, setSelectedPool] = useState<IPoolsForBribesData>({} as IPoolsForBribesData);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const [activeStateTab, setActiveStateTab] = useState<BribesCardHeader | string>(
    BribesCardHeader.Pools
  );
  const tokens = useAppSelector((state) => state.config.tokens);
  const [epochArray, setEpochArray] = useState<number[]>([] as number[]);
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
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
  }, [userAddress, tokens, balanceUpdate]);
  const resetAllValues = () => {
    setBribeInputValue("");
    setBribeToken({} as tokenParameter);
  };
  const dispatch = useDispatch<AppDispatch>();

  const handleOperation = () => {
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(selectedPool.tokenA));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(selectedPool.tokenB));
    setContentTransaction(
      `Add bribe for ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(TOKEN_B)} pool`
    );
    setShowAddBribes(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    // localStorage.setItem(FIRST_TOKEN_AMOUNT, plyInput);
    // localStorage.setItem(TOKEN_A, dateFormat(lockingEndData.lockingDate * 1000));

    addBribe(
      selectedPool.tokenA,
      selectedPool.tokenB,
      epochArray,
      bribeToken.name,
      bribeInputValue,
      userAddress,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      selectedPool.amm,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Add bribe for ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
          TOKEN_B
        )} pool`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        props.setIsOperationComplete(true);
        setBalanceUpdate(true);
        setTimeout(() => {
          props.setIsOperationComplete(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Add bribe for ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
                TOKEN_B
              )} pool`,
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

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      } else {
        resetAllValues();
        setShowConfirmTransaction(false);
        setBalanceUpdate(true);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Add bribe for ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
                TOKEN_B
              )} pool
              `,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };

  return (
    <SideBarHOC isBribes={true} makeTopBarScroll>
      <div>
        <HeadInfo
          className="px-2 md:px-5"
          title="Bribes"
          toolTipContent=""
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <BribesHeader
          activeStateTab={activeStateTab}
          setActiveStateTab={setActiveStateTab}
          className="md:px-3"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        {activeStateTab === BribesCardHeader.Pools && (
          <PoolsTableBribes
            className="md:px-5 md:py-4   py-4"
            locksPosition={props.poolsArr.data.poolsData}
            isfetched={props.poolsArr.isfetched}
            setShowAddBribes={setShowAddBribes}
            searchValue={searchValue}
            setSelectedPool={setSelectedPool}
          />
        )}
        {activeStateTab === BribesCardHeader.Mybribes && (
          <MyBribesTableBribes
            className="md:px-5 md:py-4   py-4"
            locksPosition={props.bribesArr.data}
            isfetched={props.bribesArr.isfetched}
            searchValue={searchValue}
            setShowAddBribes={setShowAddBribes}
            setActiveStateTab={setActiveStateTab}
          />
        )}
        {showAddBribes && (
          <AddBribes
            show={showAddBribes}
            setEpochArray={setEpochArray}
            setShow={setShowAddBribes}
            setBribeInputValue={setBribeInputValue}
            bribeInputValue={bribeInputValue}
            setBribeToken={setBribeToken}
            bribeToken={bribeToken}
            selectedPool={selectedPool}
            epochArray={epochArray}
            handleOperation={handleOperation}
            allBalance={allBalance.allTokensBalances}
            isSucess={allBalance.success}
            balanceUpdate={balanceUpdate}
            setBalanceUpdate={setBalanceUpdate}
          />
        )}
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
              transactionId
                ? () => window.open(`https://ghostnet.tzkt.io/${transactionId}`, "_blank")
                : null
            }
            content={contentTransaction}
          />
        )}
      </div>
    </SideBarHOC>
  );
}

export default BribesMain;
