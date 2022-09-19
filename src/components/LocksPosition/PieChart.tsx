import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { IPieChartProps } from "./types";
export default function PieChartButton(props: IPieChartProps) {
  const COLORS = ["#9D5CFF", "#372159"];
  const pieData = [
    {
      name: "violet",
      value: props.violet,
    },
    {
      name: "transaparent",
      value: props.transparent,
    },
  ];

  return (
    <PieChart width={16} height={16}>
      <Pie
        data={pieData}
        color="#000000"
        dataKey="value"
        nameKey="name"
        cx={"50%"}
        cy={"50%"}
        stroke="#ff000000"
        outerRadius={8}
        fill="#9D5CFF"
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
