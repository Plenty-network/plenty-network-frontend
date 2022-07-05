import { useState } from "react"

export const useStateAnimate=(innitiAlState:any,time:number)=>{
   const [state,setState]=useState(innitiAlState);
   const [animationState,setAnimationState]=useState(false);

   const setNewState=(dataState:any)=>{
       if(dataState===true){
       setAnimationState(dataState);
       setState(dataState)
    }else{
       setAnimationState(dataState);
       setTimeout(()=>setState(dataState),time)
    }
   }
   
    return [
        state,
        setNewState,
        animationState
    ]
}