import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IPoolsTableRewards } from "./types";
import { IPoolsRewardsData } from "../../api/portfolio/types";
import { PLYEmission } from "./PLYEmisiion";
import { Boost } from "./Boost";
import { NoPoolsPosition } from "../Rewards/NoContent";
import { compareNumericString } from "../../utils/commonUtils";
import { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tokenIcons } from "../../constants/tokensList";
import { useAppSelector } from "../../redux";

export function PoolsTableRewards(props: IPoolsTableRewards) {
  const { valueFormat } = useTableNumberUtils();
  const [showClaimPly, setShowClaimPly] = React.useState(false);
  const tokens = useAppSelector((state) => state.config.tokens);
  const [noSearchResult, setNoSearchResult] = React.useState(false);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };

  const NoData = React.useMemo(() => {
    return (
      <NoPoolsPosition
        h1={"No PLY emissions"}
        subText={"You do not have unclaimed PLY rewards for your LPs."}
        cta={"View pools"}
        page={"v2"}
      />
    );
  }, []);
  const mobilecolumns = React.useMemo<Column<IPoolsRewardsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        canShort: true,
        columnWidth: "w-[170px]",
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenOneSymbol", true),
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center overflow-hidden">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.tokenOneSymbol.toString()) === "CTEZ"
                    ? tokenIcons[x.tokenTwoSymbol]
                      ? tokenIcons[x.tokenTwoSymbol].src
                      : tokens[x.tokenTwoSymbol.toString()]?.iconUrl
                      ? tokens[x.tokenTwoSymbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.tokenOneSymbol]
                    ? tokenIcons[x.tokenOneSymbol].src
                    : tokens[x.tokenOneSymbol.toString()]?.iconUrl
                    ? tokens[x.tokenOneSymbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"20px"}
                height={"20px"}
                onError={changeSource}
              />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center overflow-hidden">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.tokenOneSymbol.toString()) === "CTEZ"
                    ? tokenIcons[x.tokenOneSymbol]
                      ? tokenIcons[x.tokenOneSymbol].src
                      : tokens[x.tokenOneSymbol.toString()]?.iconUrl
                      ? tokens[x.tokenOneSymbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.tokenTwoSymbol]
                    ? tokenIcons[x.tokenTwoSymbol].src
                    : tokens[x.tokenTwoSymbol.toString()]?.iconUrl
                    ? tokens[x.tokenTwoSymbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"20px"}
                height={"20px"}
                onError={changeSource}
              />
            </div>
            <div>
              <div className="font-body2 md:font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenOneSymbol.toString()) === "CTEZ"
                  ? ` ${tEZorCTEZtoUppercase(x.tokenTwoSymbol.toString())} / ${tEZorCTEZtoUppercase(
                      x.tokenOneSymbol.toString()
                    )}`
                  : ` ${tEZorCTEZtoUppercase(x.tokenOneSymbol.toString())} / ${tEZorCTEZtoUppercase(
                      x.tokenTwoSymbol.toString()
                    )}`}
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
        tooltipMessage: "PLY emission through the gauge.",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "gaugeEmission"),
        accessor: (x: any) => <PLYEmission value={x.gaugeEmission} dollar={x.gaugeEmissionValue} />,
      },

      {
        Header: "Boost",
        id: "Boost",
        columnWidth: "w-[110px]",
        tooltipMessage: "Multiplier received on the APR.",
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenOneSymbol", true),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center overflow-hidden">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.tokenOneSymbol.toString()) === "CTEZ"
                    ? tokenIcons[x.tokenTwoSymbol]
                      ? tokenIcons[x.tokenTwoSymbol].src
                      : tokens[x.tokenTwoSymbol.toString()]?.iconUrl
                      ? tokens[x.tokenTwoSymbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.tokenOneSymbol]
                    ? tokenIcons[x.tokenOneSymbol].src
                    : tokens[x.tokenOneSymbol.toString()]?.iconUrl
                    ? tokens[x.tokenOneSymbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center overflow-hidden">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.tokenOneSymbol.toString()) === "CTEZ"
                    ? tokenIcons[x.tokenOneSymbol]
                      ? tokenIcons[x.tokenOneSymbol].src
                      : tokens[x.tokenOneSymbol.toString()]?.iconUrl
                      ? tokens[x.tokenOneSymbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.tokenTwoSymbol]
                    ? tokenIcons[x.tokenTwoSymbol].src
                    : tokens[x.tokenTwoSymbol.toString()]?.iconUrl
                    ? tokens[x.tokenTwoSymbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenOneSymbol.toString()) === "CTEZ"
                  ? ` ${tEZorCTEZtoUppercase(x.tokenTwoSymbol.toString())} / ${tEZorCTEZtoUppercase(
                      x.tokenOneSymbol.toString()
                    )}`
                  : ` ${tEZorCTEZtoUppercase(x.tokenOneSymbol.toString())} / ${tEZorCTEZtoUppercase(
                      x.tokenTwoSymbol.toString()
                    )}`}
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
        tooltipMessage: "PLY emission through the gauge.",
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
        tooltipMessage: "Multiplier received on the APR.",
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
