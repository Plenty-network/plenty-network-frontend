interface ITooltipVioletProps {
  rate1: string;
  rate2: string;
}
function TooltipViolet(props: ITooltipVioletProps) {
  return (
    <div className="font-caption1">
      <div className="bg-blue-400 px-2 py-1 rounded">{props.rate1}</div>
      <div className="bg-blue-400 px-2 py-1 mt-2 rounded">{props.rate2}</div>
    </div>
  );
}

export default TooltipViolet;
