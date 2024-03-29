import { PopUpModal } from "../Modal/popupModal";

import { IEpochPopup } from "./types";
import Button from "../Button/Button";

function EpochPopup(props: IEpochPopup) {
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal
      onhide={closeModal}
      className="w-[400px] max-w-[400px]  md:w-[460px] md:max-w-[460px]"
    >
      {
        <>
          <div className="font-subtitle5 text-text-400 mt-2">
            You are not on the current EPOCH.{" "}
          </div>
          <div className="text-white font-subtitle4 mt-5">
            CHANGE YOUR EPOCH TO CURRENT TO START VOTING
          </div>
          <div className="mt-5">
            <Button color="primary" onClick={props.onClick}>
              CHANGE TO CURRENT EPOCH
            </Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default EpochPopup;
