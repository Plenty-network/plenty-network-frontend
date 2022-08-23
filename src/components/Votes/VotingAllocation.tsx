import dynamic from "next/dynamic";
import Protocol from "./Protocol";
const PiChart = dynamic(() => import('./PiChartComponent'), {
  loading: () => <></>,
})
function VotingAllocation() {
  return (
    <div className="md:border mt-3 rounded-xl border-text-800/[0.5] md:bg-card-400 md:py-[26px] md:px-[22px]">
      <div className="font-body3 text-white pr-2">Voting allocation</div>
      <div className="font-body3 text-white mt-[18px]">
        <Protocol />
      </div>
      <div className="flex items-center mt-5 h-[252px] justify-center border">
        <PiChart/>
      </div>
      <div className="flex items-center mt-5 h-[122px] border justify-center">
        datas
      </div>
    </div>
  );
}

export default VotingAllocation;
  