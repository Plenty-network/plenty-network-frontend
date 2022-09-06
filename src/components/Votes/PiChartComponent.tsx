import * as React from 'react';
import { PieChart, Pie, Cell } from "recharts";
import { IVotesResponse } from '../../api/votes/types';


export interface IPiChartProps {
  piChartData:IVotesResponse;
  selectedColorIndex:number;
  setSelectedColorIndex:Function;
}
// export const dataChart = [
//     { name: "CTEZ / XTZ", value: 36 },
//     { name: "CTEZ / XTZ", value: 36 },
//     { name: "kUSD / USDT", value: 36 },
//     { name: "CTEZ / XTZ", value: 36 },
//     { name: "kUSD / USDT", value: 36 },
//     { name: "CTEZ / XTZ", value: 36 },
//     { name: "kUSD / USDT", value: 36 },
//     { name: "CTEZ / XTZ", value: 36 },
//     { name: "kUSD / USDT", value: 36 },
//     { name: "Others", value: 36 }
//   ];
 export const COLORSdataChart = ["#4E4955", "#6B6670", "#88848C","#A4A2A8","#403A47","#5C5863","#79757E","#96939A","#B3B0B5"];
  
export default function PiChart (props: IPiChartProps) {
   const dataChart = props.piChartData.allData.map((e)=> {
     return {name: `${e.tokenOneSymbol} ${e.tokenTwoSymbol}`, value: e.votePercentage.toNumber()}
    });
  return (
    <div className='flex flex-col items-center' >
       <PieChart width={252} height={252}>
      <Pie
        data={dataChart}
        cx={122}
        cy={122}
        innerRadius={80}
        outerRadius={120}
        fill="#8884d8"
        paddingAngle={0.5}
        dataKey="value"
        stroke='#ff000000'
      >
        {dataChart.map((entry, index) => (
          <Cell key={`cell-${index}`} onMouseEnter={()=>props.setSelectedColorIndex(index)} fill={props.selectedColorIndex ===index?'#78F33F' :COLORSdataChart[index % COLORSdataChart.length]} />
        ))}
        
      </Pie>
    </PieChart>
    </div>
  );
}
