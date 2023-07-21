import clsx from "clsx";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { useAppSelector } from "../../redux";
import { checkPoolExistence } from "../../api/v3/factory";

interface IFeeTierMainProps {
  setSelectedFeeTier: React.Dispatch<React.SetStateAction<string>>;
  selectedFeeTier: string;
  feeTier: string;
}
function FeeTierMain(props: IFeeTierMainProps) {
  const [isExist, setIsExist] = React.useState<any>();
  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const tokenoutorg = useAppSelector((state) => state.poolsv3.tokenOutOrg);
  React.useEffect(() => {
    if (tokeninorg.name && tokenoutorg.name) {
      checkPoolExistence(tokeninorg.name, tokenoutorg.name).then((res) => {
        // if (tokeninorg.name != res.tokenA) {

        // }
        setIsExist(res);
      });
    }
  }, [tokeninorg.name, tokenoutorg.name]);

  const fee = [
    {
      percentage: "0.01",
      text: "Best for very stable pairs",
      selectPercentage: "46",
    },
    {
      percentage: "0.05",
      text: "Best for stable pairs",
      selectPercentage: "46",
    },
    {
      percentage: "0.3",
      text: "Best for volatile pairs",
      selectPercentage: "46",
    },
    {
      percentage: "1",
      text: "Best for exotic pairs",
      selectPercentage: "46",
    },
  ];
  return (
    <div className="flex gap-[7px]  items-center justify-center">
      {fee.map((feeInd, index) => {
        return (
          <div
            key={index}
            className={clsx(
              !isExist?.feeTier?.includes((Number(feeInd.percentage) * 100).toString())
                ? "cursor-not-allowed border-text-800"
                : props.selectedFeeTier == feeInd.percentage
                ? "border-blue-700 cursor-pointer"
                : "border-text-800 hover:border-text-400 cursor-pointer",
              "border fade-in-light w-[95px] sm:w-[127px] rounded-2xl   bg-card-200   mb-5 sm:h-[128px] h-[120px]  py-[12px] sm:pl-[14px] pl-2  sm:pr-3 pr-1 "
            )}
            onClick={
              isExist?.feeTier?.includes((Number(feeInd.percentage) * 100).toString())
                ? () => props.setSelectedFeeTier(feeInd.percentage)
                : () => {}
            }
          >
            <div
              className={clsx(
                props.selectedFeeTier == feeInd.percentage ? "text-blue-700" : "text-text-250",
                "font-caption2 sm:font-subtitle4 "
              )}
            >
              {feeInd.percentage}% {!isMobile && " fee tier"}
            </div>
            <div className="mt-2 font-mobile-400 sm:font-body1 text-text-250">{feeInd.text}</div>
            <div className="mt-[12px]">
              <span className="text-white rounded-xl	bg-shimmer-100 px-2 items-center flex w-fit text-[8px]  md:font-caption2 h-[24px]">
                {isExist?.feeTier?.includes((Number(feeInd.percentage) * 100).toString())
                  ? feeInd.selectPercentage + "%"
                  : "Not created"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FeeTierMain;
