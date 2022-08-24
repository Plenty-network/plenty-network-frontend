import dynamic from "next/dynamic";
import { COLORSdataChart, dataChart } from "./PiChartComponent";
import Protocol from "./Protocol";
const PiChart = dynamic(() => import("./PiChartComponent"), {
  loading: () => <></>,
});
function VotingAllocation() {
  return (
    <div className="md:border mt-3 rounded-xl border-text-800/[0.5] md:bg-card-400 md:py-[26px] md:px-[22px]">
      <div className="font-body3 text-white pr-2">Voting allocation</div>
      <div className="font-body3 text-white mt-[18px]">
        <Protocol />
      </div>
      <div className="flex flex-col  mt-5  gap-2 justify-center w-[350px] ">
        <PiChart />
        <div className="grid grid-cols-2 justify-between px-6 gap-[11px]">
          {dataChart.map((e, i) => (
            <ColorText text={e.name} color={COLORSdataChart[i]} />
          ))}
        </div>
      </div>
    </div>
  );
}
export interface IColorTextProps {
  text: string;
  color: string;
}

export function ColorText(props: IColorTextProps) {
  return (
    <div className="flex gap-1 items-center text-f12">
      <div className="w-[15px] h-[15px]" style={{ backgroundColor: props.color }}></div>
      <div>{props.text}</div>
    </div>
  );
}

export default VotingAllocation;
