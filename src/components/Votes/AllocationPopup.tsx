import { useAppSelector } from "../../redux";
import { PopUpModal } from "../Modal/popupModal";
import { IAllocationProps } from "./types";
import VotingAllocation from "./VotingAllocation";

function AllocationPopup(props: IAllocationProps) {
  const selectedEpoch = useAppSelector((state) => state.epoch.selectedEpoch);
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal onhide={closeModal} className="rounded-3xl  w-[400px] max-w-[400px]">
      <VotingAllocation
        show={props.show}
        setShow={props.setShow}
        castVoteOperation={props.castVoteOperation}
        selectedDropDown={props.selectedDropDown} // veNFT selected
        epochData={props.epochData} // epoch data
        alreadyVoted={props.alreadyVoted}
        epochNumber={selectedEpoch ? selectedEpoch.epochNumber : 0}
      />
    </PopUpModal>
  ) : null;
}

export default AllocationPopup;
