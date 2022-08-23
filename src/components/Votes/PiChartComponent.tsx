import * as React from 'react';
import { PieChart, Pie, Cell } from "recharts";


export interface IPiChartProps {
}
const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 }
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  
export default function PiChart (props: IPiChartProps) {
  return (
    <div>
       <PieChart width={252} height={252}>
      <Pie
        data={data}
        cx={122}
        cy={122}
        innerRadius={80}
        outerRadius={120}
        fill="#8884d8"
        paddingAngle={0.5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
    </div>
  );
}
