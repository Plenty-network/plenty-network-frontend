import * as React from 'react';
import { PieChart, Pie, Cell } from "recharts";


export interface IPiChartProps {
}
export const dataChart = [
    { name: "CTEZ / XTZ", value: 36 },
    { name: "CTEZ / XTZ", value: 36 },
    { name: "kUSD / USDT", value: 36 },
    { name: "CTEZ / XTZ", value: 36 },
    { name: "kUSD / USDT", value: 36 },
    { name: "CTEZ / XTZ", value: 36 },
    { name: "kUSD / USDT", value: 36 },
    { name: "CTEZ / XTZ", value: 36 },
    { name: "kUSD / USDT", value: 36 },
    { name: "Others", value: 36 }
  ];
 export const COLORSdataChart = ["#78F33F", "#4E4955", "#6B6670", "#88848C","#A4A2A8","#403A47","#5C5863","#79757E","#96939A","#B3B0B5"];
  
export default function PiChart (props: IPiChartProps) {
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
        activeShape={<h1>bhjbhj</h1>}
      >
        {dataChart.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORSdataChart[index % COLORSdataChart.length]} />
        ))}
        <p>kkk</p>
      </Pie>
    </PieChart>
    </div>
  );
}
