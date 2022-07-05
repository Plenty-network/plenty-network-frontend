import { useState } from "react"

export const useStateAnimate=(innitiAlState:any,time:number)=>{
   const [state,setState]=useState(innitiAlState);
   const [animationState,setAnimationState]=useState(false);

   const setNewState=(dataState:any)=>{
       setAnimationState(!animationState);
       setTimeout(()=>setState(dataState),time)
   }
   
    return [
        state,
        setNewState,
        animationState
    ]
}