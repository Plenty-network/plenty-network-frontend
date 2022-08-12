import { useEffect, useState } from "react";

export const usePoolsTableSearch=(poolsTable:any,searchText:string,isFetched:boolean)=>{
 const [poolsTableData,setPoolsTableData]=useState(poolsTable)
  useEffect(()=>{
   if(searchText && searchText.length){
    const _poolsTableData= poolsTableData.filter((e:any)=>{
       return (e.tokenA.toLowerCase().includes(searchText) || e.tokenB.toLowerCase().includes(searchText))    
    });
    setPoolsTableData(_poolsTableData);
   }else{
    setPoolsTableData(poolsTable);
   }
},[searchText])  
   return [poolsTableData,isFetched]
}