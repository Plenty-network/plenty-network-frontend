import { usePoolsMain2 } from "../api/pools/query/poolsmain.query";

export const usePoolsTableFilter=(filterText:string | 'MyPools' | undefined ,address:string | undefined )=>{
    const  { data:poolTableData=[],isFetched=false }=usePoolsMain2(); 
    if(poolTableData.length){
        if(filterText === 'MyPools'){
            return {data:poolTableData,isFetched} 
        }
    if(filterText){         
       const newpoolTableData= poolTableData.filter((e)=>e.poolType===filterText);
       return {data:newpoolTableData,isFetched}
    }
    return {data:poolTableData,isFetched}
    }
   return {data:poolTableData,isFetched}
}