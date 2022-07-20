interface IToolTipProps {
  children?: any;
  message?: any;
  right?: boolean;
  width?: string;
}
function Tooltip(props: IToolTipProps) {
  return (
    <div
      className={`relative flex ${
        props.right ? 'flex-row' : 'flex-col'
      } items-center group `}
    >
      {props.children}
      <div
        className={`absolute bottom-0 hidden flex-row items-center  ${
          props.right ? 'ml-8' : 'mb-6'
        }  group-hover:flex`}
      >
        {props.right ? (
          <div className=" w-3 h-3 -mr-2  z-14 rotate-45 bg-muted-300 border border-top-0 border-muted-50 "></div>
        ) : null}

        <span
          className={` ${props.right ? 'w-max ' : ''} ${
            props.width ? props.width : ''
          }  relative z-10 p-3 text-xs leading-none text-white whitespace-no-wrap bg-muted-300 shadow-lg rounded-xl border font-caption1 border-muted-50 `}
        >
          {props.message}
        </span>
        {props.right ? null : (
          <div className="w-3 h-3 -mt-2 z-14 rotate-45 bg-muted-300 border border-top-0 border-muted-50 "></div>
        )}
      </div>
    </div>
  );
}

export default Tooltip;
