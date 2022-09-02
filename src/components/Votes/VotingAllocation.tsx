import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IVotesResponse } from "../../api/votes/types";
import { getMyAmmVotes, getTotalAmmVotes } from "../../api/votes/votesKiran";
import { COLORSdataChart } from "./PiChartComponent";
import Protocol from "./Protocol";
import { IAllocationProps } from "./types";
const PiChart = dynamic(() => import("./PiChartComponent"), {
  loading: () => <></>,
});
export interface IVotingAllocationProps extends IAllocationProps {
 
}

function VotingAllocation (props: IVotingAllocationProps) {
  const [selectedDropDown, setSelectedDropDown] = useState('');
  const [piChartData,setPiChartData]=useState<IVotesResponse>();
  useEffect(()=>{
    if(props.epochNumber){
    if(props.selectedDropDown && props.selectedDropDown.tokenId && props.selectedDropDown.tokenId.length>0){
      getMyAmmVotes(props.epochNumber,parseInt(props.selectedDropDown.tokenId))
    }else{
      getTotalAmmVotes(props.epochNumber).then((e)=>{
        setPiChartData(e)});     
    }  
    }
  },[props.epochNumber,props.selectedDropDown,props.show,selectedDropDown])
  return (
    <div className="md:border mt-3 rounded-xl border-text-800/[0.5] md:bg-card-400 md:py-[26px] md:px-[22px]">
      <div className="font-body3 text-white pr-2">Voting allocation</div>
      <div className="font-body3 text-white mt-[18px]">
        <Protocol 
        isSelected={props.selectedDropDown.tokenId.length?true:false}
        selectedDropDown={selectedDropDown}
         setSelectedDropDown={setSelectedDropDown}
        />
      </div>
      <div className="flex flex-col items-center  mt-5  gap-2 justify-center w-[350px] ">
        {piChartData?.allData &&  <PiChart piChartData={piChartData}/>}
        <div className="grid grid-cols-2 justify-between   gap-[11px] gap-x-10 w-[300px]" >
        {piChartData?.allData ? piChartData.allData.map((e,i)=><ColorText key={`e.votes`+i} text={`${e.tokenOneSymbol} ${e.tokenTwoSymbol}`} color={COLORSdataChart[i]} />) :<></>}
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
    <div className="flex gap-1 items-center text-f12 w-max">
    <div className="w-[15px] h-[15px]" style={{backgroundColor:props.color}}></div>
    <div>{props.text}</div>
 </div>
  );
}

export default VotingAllocation;
