import * as React from 'react';
import { PieChart, Pie, Cell, Sector } from "recharts";
import { IVotesResponse } from '../../api/votes/types';
import { tEZorCTEZTtoUpperCase } from '../../utils/commonUtils';


const RenderActiveShape = (props: any) => {
  function toDegrees (angle:number) {
    return angle * (180 / Math.PI);
  }
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    ply,
    value,
    name
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  return (
    <g style={{zIndex:999}}>
      <text x={cx} y={cy} dy={1} textAnchor="middle"  fill={'#FFFFFF'} fontSize={'14px'}>
        {name}
      </text>
      <text x={cx} y={cy+18} dy={1} textAnchor="middle"  fill={fill} fontSize={'14px'}>
        <a style={{fill:"#78F33F"}}>{value.toFixed(2)}%</a> <a style={{fill:'#B3B0B5'}}>({ply.toFixed(2)} PLY)</a>
      </text>
      
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={'#78F33F'}
      />
    </g>
  );
};

export interface IPiChartProps {
  piChartData:IVotesResponse;
  selectedColorIndex:number;
  setSelectedColorIndex:Function;
}
 export const COLORSdataChart = ["#4E4955", "#6B6670", "#88848C","#A4A2A8","#403A47","#5C5863","#79757E","#96939A","#B3B0B5"];
  
export default function PiChart (props: IPiChartProps) {
   const dataChart = props.piChartData.allData.map((e)=> {
     return {name: `${tEZorCTEZTtoUpperCase(e.tokenOneSymbol??'')} / ${tEZorCTEZTtoUpperCase(e.tokenTwoSymbol??'')}`, value: e.votePercentage.toNumber(),ply:e.votes}
    });
  const onPieEnter = React.useCallback(
    (_:any, index:number) => {
      props.setSelectedColorIndex(index);
    },
    [props.setSelectedColorIndex]
  );
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
        activeIndex={props.selectedColorIndex}
        onMouseEnter={onPieEnter}
        activeShape={<RenderActiveShape />}

      >
        {dataChart.map((entry, index) => (
          <Cell key={`cell-${index}`}  fill={COLORSdataChart[index % COLORSdataChart.length]} />
        ))}
        
      </Pie>
    </PieChart>
    </div>
  );
}
