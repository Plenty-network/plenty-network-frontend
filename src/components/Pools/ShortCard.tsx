import * as React from 'react';
import { Column } from 'react-table';
import { usePoolsMain } from '../../api/pools/query/poolsmain.query';
import { PoolsMainPage } from '../../api/pools/types';
import { useTableNumberUtils } from '../../hooks/useTableUtils';
import Table from '../Table/Table';
import { CircularImageInfo } from './Component/CircularImageInfo';
import { ManageLiquidity } from './ManageLiquidity';
import { AMM_TYPE } from '../../config/types';
import { tokenParameterLiquidity } from '../Liquidity/types';
import { AprInfo } from './Component/AprInfo';
import { PoolsText, PoolsTextWithTooltip } from './Component/poolsText';

export interface IShortCardProps {
    className?:string;
    poolsFilter?:AMM_TYPE;
    isConnectWalletRequired?:boolean;
    searchValue?:string;
    setSearchValue?:Function
}

export function ShortCard (props: IShortCardProps) {
  const {valueFormat}=useTableNumberUtils();
  const  { data:poolTableData=[],isFetched=false }=usePoolsMain();
  let poolsTableData=poolTableData;
  if(props.poolsFilter){
    poolsTableData= poolsTableData.filter((e)=>e.type === props.poolsFilter);
   }else{
    poolsTableData=poolTableData;
   }

  const [showLiquidityModal,setShowLiquidityModal]=React.useState(false);
  const getImagesPath = (name: string,isSvg?: boolean) => {
    if(isSvg)
    return `/assets/tokens/${name}.svg`;
    if(name)
    return `/assets/tokens/${name.toLowerCase()}.png`;
    else
    return '';
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
  const columns = React.useMemo<Column<PoolsMainPage>[]>(
    () => [
      {
        Header: 'Pools',
        id: 'pools',
        accessor: (x:any) => (
          <div className="flex gap-2 items-center max-w-[153px]">
            <CircularImageInfo
              imageArray={[
                getImagesPath(x.token1.symbol),
                getImagesPath(x.token2.symbol),
              ]}
            />
            <div className="flex flex-col gap-[2px]">
              <span className="text-f14 text-white uppercase">
                {x.token1.symbol}/{x.token2.symbol}
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
        isToolTipEnabled:true,
        canShort:true,
        accessor: (x:any)=>(
          <AprInfo/>
        ),
      },
      {
        Header: 'Volume',
        id: 'Volume24h',
        subText: '24h',
        isToolTipEnabled:true,
        accessor: (x)=>(
           <PoolsTextWithTooltip
             text={x.volume24H.value}
             token1={x.volume24H.token1}
             token2={x.volume24H.token2}
           />
        ),
      },
      {
        Header: 'TVL',
        id: 'TVL',
        isToolTipEnabled:true,
        canShort:true,
        accessor: (x)=>(
          <PoolsTextWithTooltip
             text={x.tvl.value}
             token1={x.tvl.token1}
             token2={x.tvl.token2}
           />
        ),
      },
      {
        Header: 'Fees',
        id: 'fees',
        subText:'current epoch',
        isToolTipEnabled:true,
        canShort:true,
        accessor: (x)=>(
          <PoolsTextWithTooltip
          text={x.feesEpoch.value}
          token1={x.feesEpoch.token1}
          token2={x.feesEpoch.token2}
        />
        ),
      },
      {
        Header: 'Bribes',
        id: 'Bribes',
        isToolTipEnabled:true,
        accessor: (x)=>(
          <PoolsText
          text={'$234.5'}
        />
        ),
      },
      {
        Header: '',
        id: 'lools',
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn/>
        ),
      },
    ],
    [valueFormat]
  );
function ManageBtn(): any {
    return <div
      className="bg-primary-500/10 cursor-pointer  text-primary-500 px-7 py-2 rounded-lg"
      onClick={() => {
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
      } }
    >
      Manage
    </div>;
  }
  return (
    <>
      {showLiquidityModal && (
        <ManageLiquidity
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={setShowLiquidityModal}
        />
      )}
      <div className={`w-full ${props.className}`}>
        <Table<any> columns={columns} data={poolsTableData} shortby='fees' isFetched={isFetched} isConnectWalletRequired={props.isConnectWalletRequired} />
      </div>
    </>
  );

  
}
