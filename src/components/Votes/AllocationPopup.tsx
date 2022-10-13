import { PopUpModal } from "../Modal/popupModal";
import { IAllocationProps, ICastVoteProps } from "./types";
import VotingAllocation from "./VotingAllocation";

function AllocationPopup(props: IAllocationProps) {
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal onhide={closeModal} className="rounded-none w-[400px] max-w-[400px]">
      <VotingAllocation
        show={props.show}
        setShow={props.setShow}
        castVoteOperation={props.castVoteOperation}
        selectedDropDown={props.selectedDropDown} // veNFT selected
        epochData={props.epochData} // epoch data
        alreadyVoted={props.alreadyVoted}
        epochNumber={props.epochNumber}
      />
    </PopUpModal>
  ) : null;
}

export default AllocationPopup;
