import { AppDispatch, useAppSelector } from "../../redux";
import Button from "../Button/Button";
import clsx from "clsx";

import { useEffect, useState, useMemo } from "react";
import { ChainAirdrop } from "./Disclaimer";
import Progress from "./Progress";
import Steps from "./Steps";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { IClaimDataResponse } from "../../api/airdrop/types";
import { TOKEN_A } from "../../constants/localStorage";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import { claimAirdrop } from "../../operations/airdrop";
import { Flashtype } from "../FlashScreen";
import { setFlashMessage } from "../../redux/flashMessage";
import ConfirmTransaction from "../ConfirmTransaction";
import TransactionSubmitted from "../TransactionSubmitted";
export interface ITezosChain {
  setChain: React.Dispatch<React.SetStateAction<ChainAirdrop>>;
  res: {
    airdropClaimData: IClaimDataResponse;
    setClaimed: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

function TezosChain(props: ITezosChain) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const handleAirdropOperation = () => {
    localStorage.setItem(TOKEN_A, "0");
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));

    claimAirdrop(
      props.res.airdropClaimData.claimData,

      transactionSubmitModal,
      undefined,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim airdrop`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setTimeout(() => {
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim airdrop`,
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

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      } else {
        setShowConfirmTransaction(false);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Claim airdrop
              `,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const ClaimButton = useMemo(() => {
    if (userAddress) {
      if (
        props.res.airdropClaimData.eligible &&
        props.res.airdropClaimData.pendingClaimableAmount.isGreaterThanOrEqualTo(0)
      ) {
        return (
          <button
            className={clsx("bg-primary-500 h-13 text-black w-full rounded-2xl font-title3-bold")}
            onClick={handleAirdropOperation}
          >
            Claim {props.res.airdropClaimData.pendingClaimableAmount.toFixed(2)}
          </button>
        );
      } else if (
        props.res.airdropClaimData.eligible === false ||
        props.res.airdropClaimData.success === false
      ) {
        return (
          <Button color="disabled" width="w-full">
            Not eligible
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
  }, [props, userAddress, props.res]);

  return (
    <>
      <div className="mt-3 border border-muted-300 bg-muted-400 rounded-xl py-5">
        <Progress claimData={props.res.airdropClaimData} />
        <div className="border-t border-text-800 my-3"></div>
        <Steps claimData={props.res.airdropClaimData} />
      </div>
      <div className="mt-[18px]">{ClaimButton}</div>
      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={"Claim airdrop"}
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
          content={"Claim airdrop"}
        />
      )}
    </>
  );
}

export default TezosChain;
