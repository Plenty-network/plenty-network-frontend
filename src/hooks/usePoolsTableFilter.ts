import { usePoolsMain2 } from "../api/pools/query/poolsmain.query";

export const usePoolsTableFilter=(filterText:string | 'MyPools' | undefined ,address:string | undefined )=>{
    const  { data:poolTableData=[],isFetched }=usePoolsMain2(); 
    if(poolTableData.length){
        if(filterText === 'MyPools'){

            const newpoolTableData= poolTableData.filter((e)=>e.isLiquidityAvailable);
             return {data:newpoolTableData,isFetched:isFetched}
        }
    if(filterText){         
       const newpoolTableData= poolTableData.filter((e)=>e.poolType===filterText);
       return {data:newpoolTableData,isFetched:isFetched}
    }
    return {data:poolTableData,isFetched:isFetched}
    }
   return {data:poolTableData,isFetched:isFetched}
}