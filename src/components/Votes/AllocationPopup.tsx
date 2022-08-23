import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import ctez from "../../assets/Tokens/ctez.png";
import tez from "../../assets/Tokens/tez.png";
import lock from "../../../src/assets/icon/vote/lock.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import { ICastVoteProps } from "./types";
import VotingAllocation from "./VotingAllocation";

function AllocationPopup(props: ICastVoteProps) {
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal onhide={closeModal} className="rounded-none w-[400px] max-w-[400px] px-5 ">
      <VotingAllocation />
    </PopUpModal>
  ) : null;
}

export default AllocationPopup;
