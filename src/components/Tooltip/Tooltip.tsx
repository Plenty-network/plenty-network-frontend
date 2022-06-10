interface IToolTipProps {
  children?: any;
  message?: any;
}
function Tooltip(props: IToolTipProps) {
  return (
    <div className="relative flex flex-col items-center group ">
      {props.children}
      <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex">
        <span className="relative z-10 p-3 text-xs leading-none text-white whitespace-no-wrap bg-muted-300 shadow-lg rounded-xl border font-caption1 border-muted-50 ">
          {props.message}
        </span>
        <div className="w-3 h-3 -mt-2 z-14 rotate-45 bg-muted-300 border border-top-0 border-muted-50 "></div>
      </div>
    </div>
  );
}

export default Tooltip;
