import HeadInfo from "../HeadInfo";
import { BribesMainProps } from "./types";

import { useEffect, useState, useRef } from "react";
import { CardHeader } from "../Pools/Cardheader";
import { BribesCardHeader, BribesHeader } from "./BribesHeader";
import { IAllLocksPositionData } from "../../api/portfolio/types";
import { getAllLocksPositionData } from "../../api/portfolio/locks";
import { AppDispatch, store } from "../../redux";
import { PoolsTableBribes } from "./PoolsTableBribes";
import AddBribes from "./AddBribes";
import { tokenParameter } from "../../constants/swap";
import { MyBribesTableBribes } from "./MyBribes";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import { getPoolsDataForBribes, getUserBribeData } from "../../api/bribes";
import {
  IPoolsForBribesData,
  IPoolsForBribesResponse,
  IUserBribeData,
} from "../../api/bribes/types";
import ConfirmTransaction from "../ConfirmTransaction";
import TransactionSubmitted from "../TransactionSubmitted";
import { useDispatch } from "react-redux";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import { addBribe } from "../../operations/bribes";
import { setFlashMessage } from "../../redux/flashMessage";
import { Flashtype } from "../FlashScreen";

function BribesMain(props: BribesMainProps) {
  const [contentTransaction, setContentTransaction] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [bribeToken, setBribeToken] = useState({} as tokenParameter);
  const [bribeInputValue, setBribeInputValue] = useState("");
  const [showAddBribes, setShowAddBribes] = useState(false);
  const [selectedPool, setSelectedPool] = useState<IPoolsForBribesData>({} as IPoolsForBribesData);
  const userAddress = store.getState().wallet.address;
  const [activeStateTab, setActiveStateTab] = useState<BribesCardHeader | string>(
    BribesCardHeader.Pools
  );
  const [epochArray, setEpochArray] = useState<number[]>([] as number[]);
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const resetAllValues = () => {
    setBribeInputValue("");
    setBribeToken({} as tokenParameter);
  };
  const dispatch = useDispatch<AppDispatch>();

  const handleOperation = () => {
    setContentTransaction(`Add Bribes`);
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
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        props.setIsOperationComplete(true);
        setTimeout(() => {
          props.setIsOperationComplete(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Add Bribes`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(`https://ghostnet.tzkt.io/${transactionId}`, "_blank");
              },
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
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              headerText: "Rejected",
              trailingText: `Add Bribes`,
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
            setSelectedPool={setSelectedPool}
          />
        )}
        {activeStateTab === BribesCardHeader.Mybribes && (
          <MyBribesTableBribes
            className="md:px-5 md:py-4   py-4"
            locksPosition={props.bribesArr.data}
            isfetched={props.bribesArr.isfetched}
            setShowAddBribes={setShowAddBribes}
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
