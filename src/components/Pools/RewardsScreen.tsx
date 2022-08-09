import React from "react";
import { ImageCircle } from "./Component/CircularImageInfo";
import token from "../../assets/Tokens/plenty.png";
import token2 from "../../assets/Tokens/ctez.png";
import Button from "../Button/Button";


export function RewardsScreen({}) {
  function InnerTab(token:any,text:string,className:string) {
    return <div className="flex gap-2 items-center">
        <ImageCircle src={token} className={className} />
        <div className="text-f14 text-white h-5 font-medium">{text}</div>
      </div>;
  }
  return <div className="flex flex-col gap-3">
         <div className="flex border rounded-2xl border-text-800 bg-card-200 p-4 flex-col gap-[15px]">
            
            <div className="text-text-400 text-f12">
            Your Deposits
            </div>

            <div className="flex flex-col" >
              {InnerTab(token,'3332','')}
              {InnerTab(token2,'3332','-mt-1')}
            </div>

         </div>

         <div className="flex border rounded-2xl border-text-800 bg-card-200 p-4 flex-col gap-[15px]">
         <div className="text-text-400 text-f12">
         Your Rewards
        </div>
           <div className="flex flex-col" >
              {InnerTab(token,'3332','')}
            </div>
         </div>

         <Button color={"primary"} onClick={() => {}}>
         Harvest Rewards
        </Button>
  </div>;

  
}
  