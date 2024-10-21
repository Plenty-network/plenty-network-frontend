import Image from "next/image";
import externalLink from "../../../src/assets/icon/common/externalLink.svg";
import animation from "../../assets/animations/transaction-submitted.json";
import { PopUpModal } from "../Modal/popupModal";
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface ITransactionSubmittedProps {
  show: boolean;
  content: string;
  setShow: any;
  onBtnClick: any;
}
function TransactionSubmitted(props: ITransactionSubmittedProps) {
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal
      title="Transaction submitted"
      noGlassEffect={true}
      isAnimteToLoader={true}
      onhide={closeModal}
    >
      {
        <>
          <div className="flex justify-center mt-10">
            <Lottie
              animationData={animation}
              loop={false}
              style={{ height: "150px", width: "150px" }}
            />
          </div>
          <div className="mt-11 px-4 py-3 border border-border-100/[0.4] rounded-2xl bg-secondary-100/[0.02] flex justify-center items-center  font-subtitle4">
            {props.content}
          </div>
          <div
            className="my-3 cursor-pointer font-text-bold flex justify-center text-primary-500"
            onClick={props.onBtnClick}
          >
            View on block explorer
            <span className="ml-2">
              <Image alt={"alt"} src={externalLink} width={"12px"} height={"12px"} />
            </span>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default TransactionSubmitted;
