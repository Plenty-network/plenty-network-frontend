import * as React from 'react';
import { Column } from 'react-table';
import {
  usePoolsMain,
} from '../../api/pools/query/poolsmain.query';
import {
  IPoolsDataWrapperResponse,
} from '../../api/pools/types';
import { useTableNumberUtils } from '../../hooks/useTableUtils';
import Table from '../Table/Table';
import { CircularImageInfo } from './Component/CircularImageInfo';
import { ManageLiquidity } from './ManageLiquidity';
import { tokenParameterLiquidity } from '../Liquidity/types';
import { AprInfo } from './Component/AprInfo';
import { PoolsText, PoolsTextWithTooltip } from './Component/PoolsText';
import { isMobile } from 'react-device-detect';
import { AMM_TYPE } from '../../../pages/pools';
import { usePoolsTableFilter } from '../../hooks/usePoolsTableFilter';
import { usePoolsTableSearch } from '../../hooks/usePoolsTableSearch';
import { ActiveLiquidity } from './ManageLiquidityHeader';
import Liquidity from '../Liquidity';

export interface IShortCardProps {
  className?: string;
  poolsFilter?: AMM_TYPE;
  isConnectWalletRequired?: boolean;
  searchValue: string;
  setSearchValue?: Function;
}
export interface IManageBtnProps {
  isLiquidityAvailable: boolean;
  isStakeAvailable: boolean;
}

export function ShortCard(props: IShortCardProps) {
  const { valueFormat } = useTableNumberUtils();
  const { data: poolTableData = [], isFetched: isFetch = false } =
    usePoolsTableFilter(props.poolsFilter, '');
  const [poolsTableData, isFetched] = usePoolsTableSearch(
    poolTableData,
    props.searchValue,
    isFetch
  );
  const [activeState, setActiveState] = React.useState<
    ActiveLiquidity | string
  >(ActiveLiquidity.Liquidity);
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return '';
  };
  const [tokenIn, setTokenIn] = React.useState<tokenParameterLiquidity>({
    name: 'USDC.e',
    image: `/assets/tokens/USDC.e.png`,
    symbol: 'USDC.e',
  });
  const [tokenOut, setTokenOut] = React.useState<tokenParameterLiquidity>({
    name: 'USDT.e',
    image: `/assets/tokens/USDT.e.png`,
    symbol: 'USDT.e',
  });
  const mobilecolumns = React.useMemo<Column<IPoolsDataWrapperResponse>[]>(
    () => [
      {
        Header: 'Pools',
        id: 'pools',
        showOnMobile: true,
        accessor: (x: any) => (
          <div className="flex gap-1 items-center max-w-[153px]">
            <CircularImageInfo
              className="w-7 h-7"
              imageArray={[getImagesPath(x.tokenA), getImagesPath(x.tokenB)]}
            />
            <div className="flex flex-col gap-[2px]">
              <span className="text-f14 text-white ">
                {x.tokenA}/{x.tokenB}
              </span>
              <span className="text-f12 text-text-500">Stable Pool</span>
            </div>
          </div>
        ),
      },
      {
        Header: 'APR',
        id: 'apr',
        subText: 'current Epoch',
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => (
          <AprInfo
            currentApr={x.apr.toString()}
            previousApr={x.prevApr.toString()}
            boostedApr={x.boostedApr.toString()}
            isMobile={true}
          />
        ),
      },
      {
        Header: '',
        id: 'lools',
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            isLiquidityAvailable={x.isLiquidityAvailable}
            isStakeAvailable={x.isStakeAvailable}
          />
        ),
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IPoolsDataWrapperResponse>[]>(
    () => [
      {
        Header: 'Pools',
        id: 'pools',
        showOnMobile: true,
        accessor: (x: any) => (
          <div className="flex gap-2 items-center max-w-[153px]">
            <CircularImageInfo
              imageArray={[getImagesPath(x.tokenA), getImagesPath(x.tokenB)]}
            />
            <div className="flex flex-col gap-[2px]">
              <span className="text-f14 text-white ">
                {x.tokenA}/{x.tokenB}
              </span>
              <span className="text-f12 text-text-500">Stable Pool</span>
            </div>
          </div>
        ),
      },
      {
        Header: 'APR',
        id: 'apr',
        subText: 'current Epoch',
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => (
          <AprInfo
            currentApr={x.apr.toString()}
            previousApr={x.prevApr.toString()}
            boostedApr={x.boostedApr.toString()}
          />
        ),
      },
      {
        Header: 'Volume',
        id: 'Volume24h',
        subText: '24h',
        isToolTipEnabled: true,
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={x.volume}
            token1={x.volumeTokenA.toString()}
            token2={x.volumeTokenB.toString()}
          />
        ),
      },
      {
        Header: 'TVL',
        id: 'TVL',
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={x.tvl}
            token1={x.tvlTokenA.toString()}
            token2={x.tvlTokenB.toString()}
          />
        ),
      },
      {
        Header: 'Fees',
        id: 'fees',
        subText: 'current epoch',
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={x.fees}
            token1={x.feesTokenA.toString()}
            token2={x.feesTokenB.toString()}
          />
        ),
      },
      {
        Header: 'Bribes',
        id: 'Bribes',
        isToolTipEnabled: true,
        accessor: (x) => <PoolsText text={x.bribeUSD.toString()} />,
      },
      {
        Header: '',
        id: 'lools',
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            isLiquidityAvailable={x.isLiquidityAvailable}
            isStakeAvailable={x.isStakeAvailable}
          />
        ),
      },
    ],
    [valueFormat]
  );

  function ManageBtn(props: IManageBtnProps): any {
    return (
      <div
        className="bg-primary-500/10 cursor-pointer  text-primary-500 px-7 py-2 rounded-lg"
        onClick={() => {
          props.isLiquidityAvailable
            ? props.isStakeAvailable
              ? setActiveState(ActiveLiquidity.Rewards)
              : setActiveState(ActiveLiquidity.Staking)
            : setActiveState(ActiveLiquidity.Liquidity);
          setShowLiquidityModal(true);
          setTokenIn({
            name: 'USDC.e',
            image: `/assets/tokens/USDC.e.png`,
            symbol: 'USDC.e',
          });
          setTokenOut({
            name: 'USDT.e',
            image: `/assets/tokens/USDT.e.png`,
            symbol: 'USDT.e',
          });
        }}
      >
        Manage
      </div>
    );
  }
  return (
    <>
      {showLiquidityModal && (
        <ManageLiquidity
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={setShowLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
        />
      )}
      <div className={`w-full  ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={poolsTableData}
          shortby="fees"
          isFetched={isFetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
        />
      </div>
    </>
  );
}
