import * as React from 'react';
import { Column } from 'react-table';
import { usePoolsMain } from '../../api/pools/query/poolsmain.query';
import { PoolsMainPage } from '../../api/pools/types';
import { useTableNumberUtils } from '../../hooks/useTableUtils';
import Table from '../Table/Table';
import { CircularImageInfo } from './Component/CircularImageInfo';
import { ShortCardHeader } from './ShortCardHeader';
import { ShortCardList } from './ShortCardList';
import token from "../../assets/Tokens/plenty.png";
import token2 from "../../assets/Tokens/ctez.png";
import { ManageLiquidity } from './ManageLiquidity';
import { AMM_TYPE } from '../../config/types';

export interface IShortCardProps {
    className?:string;
    poolsFilter?:AMM_TYPE;
}

export function ShortCard (props: IShortCardProps) {
  const {valueFormat}=useTableNumberUtils();
  const  { data:poolTableData=[] }=usePoolsMain();
  let poolsTableData=poolTableData;
  if(props.poolsFilter){
    poolsTableData= poolsTableData.filter((e)=>e.type === props.poolsFilter)
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
  const columns = React.useMemo<Column<PoolsMainPage>[]>(
    () => [
      {
        Header: 'Pools',
        id: 'pools',
        accessor: (x:any) => (
          <div className="flex gap-2 items-center max-w-[153px]">
          <CircularImageInfo imageArray={[getImagesPath(x.token1.symbol), getImagesPath(x.token2.symbol)]} />
          <div className='flex flex-col gap-[2px]'>
          <span className="text-f14 text-white uppercase">{x.token1.symbol}/{x.token2.symbol}</span>
          <span className='text-f12 text-text-500'>Stable Pool</span>
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
          <p className='max-w-[115px] overflow-hidden '>{x.apr}</p>
        ),
      },
      {
        Header: 'Volume',
        id: 'Volume24h',
        subText: '24h',
        isToolTipEnabled:true,
        accessor: (x:any)=>(
          <p className='max-w-[115px] overflow-hidden '>{x.token1.decimals}</p>
        ),
      },
      {
        Header: 'TVL',
        id: 'TVL',
        isToolTipEnabled:true,
        accessor: (x:any)=>(
          <p className='max-w-[115px] overflow-hidden '>{x.apr}</p>
        ),
      },
      {
        Header: 'Fees',
        id: 'fees',
        subText:'current epoch',
        isToolTipEnabled:true,
        accessor: (x:any)=>(
          <p className='max-w-[115px] overflow-hidden '>{x.apr}</p>
        ),
      },
      {
        Header: 'Bribes',
        id: 'Bribes',
        isToolTipEnabled:true,
        accessor: (x:any)=>(
          <p className='max-w-[115px] overflow-hidden '>{x.bribe}</p>
        ),
      },
      {
        Header: '',
        id: 'lools',
        minWidth:151,
        accessor: (x:any)=>(
          <div className='bg-primary-500/10 cursor-pointer  text-primary-500 px-7 py-2 rounded-lg' onClick={()=>{setShowLiquidityModal(true)}}>
                Manage
          </div>
        ),
      },
    ],
    [valueFormat],
  );
 

  return (<>
    {showLiquidityModal && <ManageLiquidity closeFn={setShowLiquidityModal}/>}
    <div className={`w-full ${props.className}`}>
    
    <Table<any> columns={columns} data={poolsTableData} />
    </div>
    </>);
}
