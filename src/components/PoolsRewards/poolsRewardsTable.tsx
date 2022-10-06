import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IPoolsTableRewards } from "./types";
import ClaimPly from "./ClaimPopup";
import { IPoolsRewardsData } from "../../api/portfolio/types";
import { PLYEmission } from "./PLYEmisiion";
import { Boost } from "./Boost";
import { NoPoolsPosition } from "../Rewards/NoContent";
import { compareNumericString } from "../../utils/commonUtils";

export function PoolsTableRewards(props: IPoolsTableRewards) {
  const { valueFormat } = useTableNumberUtils();
  const [showClaimPly, setShowClaimPly] = React.useState(false);

  const [noSearchResult, setNoSearchResult] = React.useState(false);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;
  const NoData = React.useMemo(() => {
    return <NoPoolsPosition />;
  }, []);
  const mobilecolumns = React.useMemo<Column<IPoolsRewardsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        canShort: true,
        columnWidth: "w-[170px]",
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenOneSymbol"),
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
              <Image
                alt={"alt"}
                src={getImagesPath(x.tokenOneSymbol)}
                width={"20px"}
                height={"20px"}
              />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
              <Image
                alt={"alt"}
                src={getImagesPath(x.tokenTwoSymbol)}
                width={"20px"}
                height={"20px"}
              />
            </div>
            <div>
              <div className="font-body2 md:font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenOneSymbol.toString())}/
                {tEZorCTEZtoUppercase(x.tokenTwoSymbol.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Reward",
        id: "Reward",
        columnWidth: "w-[110px]",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "gaugeEmission"),
        accessor: (x: any) => <PLYEmission value={x.gaugeEmission} dollar={x.gaugeEmissionValue} />,
      },

      {
        Header: "Boost",
        id: "Boost",
        columnWidth: "w-[110px]",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "boostValue"),

        accessor: (x: any) => <Boost value={x.boostValue} />,
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IPoolsRewardsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        showOnMobile: true,
        canShort: true,
        columnWidth: "w-[200px]",
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenOneSymbol"),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
              <Image
                alt={"alt"}
                src={getImagesPath(x.tokenOneSymbol)}
                width={"24px"}
                height={"24px"}
              />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
              <Image
                alt={"alt"}
                src={getImagesPath(x.tokenTwoSymbol)}
                width={"24px"}
                height={"24px"}
              />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenOneSymbol.toString())}/
                {tEZorCTEZtoUppercase(x.tokenTwoSymbol.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Reward",
        id: "Reward",
        columnWidth: "w-[150px]",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "gaugeEmission"),
        accessor: (x: any) => <PLYEmission value={x.gaugeEmission} dollar={x.gaugeEmissionValue} />,
      },

      {
        Header: "Boost",
        id: "Boost",
        columnWidth: "w-[150px]",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "boostValue"),
        accessor: (x: any) => <Boost value={x.boostValue} />,
      },
    ],
    [valueFormat]
  );

  return (
    <>
      <div className={` overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={props.poolsData ? props.poolsData : []}
          noSearchResult={noSearchResult}
          shortby="pools"
          isFetched={props.isfetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName="poolsRewards"
          TableWidth=""
          NoData={NoData}
        />
      </div>
      {/* {showClaimPly && <ClaimPly show={showClaimPly} setShow={setShowClaimPly} />} */}
    </>
  );
}
