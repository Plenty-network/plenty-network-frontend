import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IVotesResponse } from "../../api/votes/types";
import { getMyAmmVotes, getTotalAmmVotes } from "../../api/votes";
import { COLORSdataChart } from "./PiChartComponent";
import Protocol from "./Protocol";
import { IAllocationProps } from "./types";
import { tEZorCTEZTtoUpperCase } from "../../utils/commonUtils";
import Image from "next/image";
import loadingLogo from "../../assets/icon/common/loadingLogo.svg";
const PiChart = dynamic(() => import("./PiChartComponent"), {
  loading: () => <></>,
});
export interface IVotingAllocationProps extends IAllocationProps {}

function VotingAllocation(props: IVotingAllocationProps) {
  const [selectedDropDown, setSelectedDropDown] = useState("");
  const [piChartData, setPiChartData] = useState<IVotesResponse>();
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(-1);
  useEffect(() => {
    if (props.epochNumber) {
      if (
        props.selectedDropDown &&
        props.selectedDropDown.tokenId &&
        props.selectedDropDown.tokenId.length > 0 &&
        selectedDropDown === "My votes"
      ) {
        getMyAmmVotes(props.epochNumber, parseInt(props.selectedDropDown.tokenId)).then((e) => {
          setPiChartData(e);
        });
      } else {
        getTotalAmmVotes(props.epochNumber).then((e) => {
          setPiChartData(e);
        });
      }
    }
  }, [props.epochNumber, props.selectedDropDown, props.show, selectedDropDown]);
  return (
    <div className="md:border mt-3 rounded-xl border-text-800/[0.5] md:bg-card-400 md:py-[26px] md:px-[22px] md:h-[calc(100vh_-_285px)] lg:h-[calc(100vh_-_225px)]">
      <div className="font-body3 text-white pr-2">Voting allocation</div>
      <div className="font-body3 text-white mt-[18px]">
        <Protocol
          isSelected={props.selectedDropDown.tokenId.length ? true : false}
          selectedDropDown={selectedDropDown}
          setSelectedDropDown={setSelectedDropDown}
        />
      </div>
      <div className="flex flex-col items-center  mt-5  gap-2 justify-center  ">
        {piChartData?.allData ? (
          <>
            {piChartData.allData.length > 0 ? (
              <PiChart
                piChartData={piChartData}
                selectedColorIndex={selectedColorIndex}
                setSelectedColorIndex={setSelectedColorIndex}
              />
            ) : (
              <div className="flex flex-col justify-center items-center pt-[60px] ">
                <div className=" flex-col felx max-w-[265px] gap-1.5 justify-center items-center  text-center">
                  <div className="text-text-200 text-f16 ">You havent voted in this Epoch</div>
                  <div className="text-text-500 text-f14">
                    Lorem Ipsum is simply dummy text of the printing and typeset.
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-[252px] flex flex-col justify-center">
            <Image alt={"alt"} height={50} width={50} src={loadingLogo} className="spin" />
          </div>
        )}
        <div className="grid grid-cols-2 justify-between   gap-[11px] gap-x-10 w-[300px]">
          {piChartData?.allData ? (
            piChartData.allData.map((e, i) => (
              <ColorText
                onClick={() => setSelectedColorIndex(i)}
                key={`e.votes` + i}
                text={`${tEZorCTEZTtoUpperCase(e.tokenOneSymbol ?? "")} ${tEZorCTEZTtoUpperCase(
                  e.tokenTwoSymbol ?? ""
                )}`}
                color={selectedColorIndex === i ? "#78F33F" : COLORSdataChart[i]}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
export interface IColorTextProps {
  text: string;
  color: string;
  onClick: Function;
}

export function ColorText(props: IColorTextProps) {
  return (
    <div
      className="flex gap-1 items-center text-f12 w-max cursor-pointer"
      onClick={() => props.onClick()}
    >
      <div className="w-[15px] h-[15px]" style={{ backgroundColor: props.color }}></div>
      <div>{props.text}</div>
    </div>
  );
}

export default VotingAllocation;
