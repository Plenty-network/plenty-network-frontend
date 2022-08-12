import { usePoolsMainwithAddress } from './../api/pools/query/poolsmain.query';
import { usePoolsMain2 } from "../api/pools/query/poolsmain.query";

export const usePoolsTableFilter=(filterText:string | 'MyPools' | undefined ,address:string | undefined )=>{
    if(filterText === 'MyPools' && address){
    const  { data:poolTableData=[],isFetched }=usePoolsMainwithAddress(address);  
    if(poolTableData.length)
        return {data:poolTableData,isFetched:isFetched} 
    }
    else{
    const  { data:poolTableData=[],isFetched }=usePoolsMain2();  
    if(poolTableData.length){
    if(filterText){         
       const newpoolTableData= poolTableData.filter((e)=>e.poolType===filterText);
       return {data:newpoolTableData,isFetched:isFetched}
    }
    return {data:poolTableData,isFetched:isFetched}
    }
   return {data:poolTableData,isFetched:isFetched}
    }
return {data:[],isFetched:false}
}