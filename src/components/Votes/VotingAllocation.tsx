import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IVotesData } from "../../api/votes/types";
import { getMyAmmVotes, getTotalAmmVotes } from "../../api/votes";
import { COLORSdataChart } from "./PiChartComponent";
import Protocol from "./Protocol";
import { IAllocationProps } from "./types";
import Image from "next/image";
import loadingLogo from "../../assets/icon/common/loadingLogo.svg";
import { useAppSelector } from "../../redux";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";
const PiChart = dynamic(() => import("./PiChartComponent"), {
  loading: () => <></>,
});
export interface IVotingAllocationProps extends IAllocationProps {}

function VotingAllocation(props: IVotingAllocationProps) {
  const [selectedDropDown, setSelectedDropDown] = useState("Protocol");
  const [piChartData, setPiChartData] = useState<IVotesData[]>();
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const userAddress = useAppSelector((state) => state.wallet.address);
  useEffect(() => {
    if (props.epochNumber) {
      if (
        props.selectedDropDown &&
        props.selectedDropDown.tokenId !== "" &&
        props.selectedDropDown.tokenId.length > 0 &&
        selectedDropDown === "My votes"
      ) {
        getMyAmmVotes(props.epochNumber, parseInt(props.selectedDropDown.tokenId)).then((e) => {
          if (e.success) {
            if (e.isOtherDataAvailable) {
              setPiChartData(e.topAmmData.concat(e.otherData as IVotesData));
            } else {
              setPiChartData(e.allData);
            }
          } else {
            setPiChartData(e.allData);
          }
          // setPiChartData(e);
        });
      } else {
        getTotalAmmVotes(props.epochNumber).then((e) => {
          console.log(e);
          if (e.success) {
            if (e.isOtherDataAvailable) {
              setPiChartData(e.topAmmData.concat(e.otherData as IVotesData));
            } else {
              setPiChartData(e.allData);
            }
          } else {
            setPiChartData(e.allData);
          }
          // setPiChartData(e);
        });
      }
    }
  }, [
    props.epochNumber,
    props.selectedDropDown,
    props.show,
    selectedDropDown,
    props.castVoteOperation,
    props.show,
  ]);
  console.log(piChartData);
  useEffect(() => {
    setSelectedDropDown("Protocol");
  }, [props.epochNumber, userAddress]);
  let Options = ["My votes", "Protocol"];

  return (
    <div className="md:border my-3 pb-3 rounded-xl border-text-800/[0.5] md:bg-card-400 md:py-[26px] md:px-[22px] md:h-[calc(100vh_-_278px)] lg:h-[calc(100vh_-_278px)] lg:min-h-[530px]">
      <div className="font-body3 text-white pr-2">Voting allocation</div>
      <div className="font-body3 text-white mt-[18px]">
        <Protocol
          isSelected={props.selectedDropDown.tokenId.length ? true : false}
          selectedDropDown={selectedDropDown}
          setSelectedDropDown={setSelectedDropDown}
          Options={Options}
        />
      </div>
      <div className="flex flex-col items-center  mt-5  gap-2 justify-center  ">
        {piChartData ? (
          <>
            {piChartData.length > 0 ? (
              <PiChart
                piChartData={piChartData}
                selectedColorIndex={selectedColorIndex}
                setSelectedColorIndex={setSelectedColorIndex}
              />
            ) : (
              <div className="min-h-[252px] flex flex-col justify-center items-center  ">
                <div className=" flex-col felx max-w-[265px] gap-1.5 justify-center items-center  text-center">
                  {selectedDropDown === "My votes" ? (
                    <div className="text-text-200 font-body4 ">
                      You haven&apos;t voted in this epoch
                    </div>
                  ) : (
                    <div className="text-text-200 font-body4">No votes in this epoch</div>
                  )}
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
          {piChartData ? (
            piChartData.map((e, i) => (
              <ColorText
                onClick={() => setSelectedColorIndex(i)}
                key={`e.votes` + i}
                text={
                  e.tokenOneSymbol && e.tokenTwoSymbol
                    ? `${tEZorCTEZtoUppercase(e.tokenOneSymbol ?? "")} / ${tEZorCTEZtoUppercase(
                        e.tokenTwoSymbol ?? ""
                      )}`
                    : "Others"
                }
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
      onMouseEnter={() => props.onClick()}
    >
      <div className="w-[15px] h-[15px]" style={{ backgroundColor: props.color }}></div>
      <div>{props.text}</div>
    </div>
  );
}

export default VotingAllocation;
