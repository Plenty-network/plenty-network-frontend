import dynamic from 'next/dynamic';
import { PopUpModal } from "../Modal/popupModal";
import loader from "../../assets/animations/loader.json";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface IConfirmTransactionProps {
  show: boolean;
  content: string;
  setShow: any;
  clainText?: string;
}
function ConfirmTransaction(props: IConfirmTransactionProps) {
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal title="Confirm transaction">
      {
        <>
          <div className="flex justify-center mt-10">
            <Lottie
              animationData={loader}
              loop={true}
              style={{ height: "150px", width: "150px" }}
            />
          </div>
          <div className="mt-11 border px-4 py-3 border-border-100/[0.4] rounded-2xl bg-secondary-100/[0.02] flex justify-center items-center font-subtitle4">
            {props.content}
          </div>
          <div className="my-3  font-caption1 flex text-center justify-center text-text-300">
            {props.clainText !== "" ? props.clainText : "Confirm the transaction in your wallet"}
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ConfirmTransaction;
