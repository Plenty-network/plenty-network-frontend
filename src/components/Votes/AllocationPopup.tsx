import { useAppSelector } from "../../redux";
import { PopUpModal } from "../Modal/popupModal";
import { IAllocationProps } from "./types";
import VotingAllocation from "./VotingAllocation";

function AllocationPopup(props: IAllocationProps) {
  const selectedEpoch = useAppSelector((state) => state.epoch.selectedEpoch);
  const selectedDropDown = useAppSelector((state) => state.veNFT.selectedDropDown);
  const epochData = useAppSelector((state) => state.epoch.epochData);
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal onhide={closeModal} className="rounded-3xl  w-[400px] max-w-[400px]">
      <VotingAllocation
        show={props.show}
        setShow={props.setShow}
        castVoteOperation={props.castVoteOperation}
        selectedDropDown={selectedDropDown} // veNFT selected
        epochData={epochData} // epoch data
        alreadyVoted={props.alreadyVoted}
        epochNumber={selectedEpoch ? selectedEpoch.epochNumber : 0}
      />
    </PopUpModal>
  ) : null;
}

export default AllocationPopup;
