import Image from "next/image";
import { PopUpModal } from "../Modal/popupModal";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import * as React from "react";
import vectorDown from "../../assets/icon/common/vector.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import { AppDispatch, useAppSelector } from "../../redux";
import { useDispatch } from "react-redux";
import { useCountdown } from "../../hooks/useCountDown";
import { IEpochListObject } from "../../api/util/types";
import { useInterval } from "../../hooks/useInterval";
import { getEpochData, setSelectedEpoch } from "../../redux/epoch/epoch";
import { useRouter } from "next/router";
import clsx from "clsx";
interface IEpochMobileProps {
  show: boolean;

  setShow: any;
}
function EpochMobile(props: IEpochMobileProps) {
  const epochData = useAppSelector((state) => state.epoch.epochData);
  const currentEpoch = useAppSelector((state) => state.epoch.currentEpoch);
  const selectedEpoch = useAppSelector((state) => state.epoch.selectedEpoch);
  const dispatch = useDispatch<AppDispatch>();
  const indexOfCurrent = epochData.findIndex((data: IEpochListObject) => data.isCurrent === true);
  const [days, hours, minutes, seconds] = useCountdown(
    currentEpoch?.endTimestamp ? currentEpoch.endTimestamp : Date.now()
  );
  const dateFormat = (startDate: number) => {
    var date = new Date(startDate);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    return `(${day}-${monthNames[month]}-${year.toString().substr(-2)})`;
  };
  React.useEffect(() => {
    dispatch(setSelectedEpoch(currentEpoch));
  }, [epochData[indexOfCurrent]?.epochNumber, currentEpoch?.endTimestamp]);
  useInterval(() => {
    if (minutes < 0 || seconds < 0) {
      dispatch(getEpochData());
      dispatch(setSelectedEpoch(epochData[indexOfCurrent]));
    }
  }, 5000);
  const router = useRouter();
  const closeModal = () => {
    props.setShow(false);
  };
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  function Options(props: {
    startDate: number;
    epochNumber: number;
    isCurrent?: boolean;
    epoch: IEpochListObject;
  }) {
    var date = new Date(props.startDate);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    const dispatch = useDispatch<AppDispatch>();
    return (
      <div
        onClick={() => {
          dispatch(setSelectedEpoch(props.epoch));
          setIsDropDownActive(false);
        }}
        className="hover:bg-primary-700 px-5 flex font-body4 text-white items-center h-[36px] cursor-pointer flex"
      >
        {props.isCurrent ? `Epoch ${props.epochNumber} ` : `Epoch ${props.epochNumber} `}
        <span className="font-body2 text-text-250 ml-1">
          {selectedEpoch?.epochNumber === epochData[indexOfCurrent]?.epochNumber
            ? " (current) "
            : dateFormat(selectedEpoch?.startTimestamp)}
        </span>
      </div>
    );
  }

  return props.show ? (
    <PopUpModal onhide={closeModal}>
      <div className="flex ">
        <div className="mx-2 text-white font-title3">Epoch</div>
        <div className="relative top-[2px]">
          <ToolTip
            id="tooltip2"
            position={Position.top}
            toolTipChild={
              <div className="w-[100px] md:w-[250px]">
                Bribe voters to direct emissions towards your pool.
              </div>
            }
          >
            <Image alt={"alt"} src={info} className="cursor-pointer" />
          </ToolTip>
        </div>
      </div>
      <div className="mt-5 border border-text-800 rounded-2xl bg-card-200 p-4 flex ">
        <div>
          {!router.pathname.includes("vote")
            ? epochData[indexOfCurrent]?.epochNumber
            : selectedEpoch?.epochNumber
            ? selectedEpoch.epochNumber
            : epochData[indexOfCurrent]?.epochNumber
            ? epochData[indexOfCurrent].epochNumber
            : 0}
          <span className="font-body2 text-text-250 ml-1">
            {selectedEpoch?.epochNumber === epochData[indexOfCurrent]?.epochNumber
              ? " (current) "
              : dateFormat(selectedEpoch?.startTimestamp)}
          </span>
        </div>
        <div
          className="flex ml-auto gap-2  text-f12 text-white font-semibold "
          {...(router.pathname.includes("vote")
            ? { onClick: () => setIsDropDownActive(!isDropDownActive) }
            : {})}
        >
          <span className="flex items-center gap-1 bg-background-400 rounded-lg py-2 px-3">
            <span>{days} d</span>:<span>{hours} h</span>:<span>{minutes} m</span>:
            <span>{seconds} s</span>
            {router.pathname.includes("vote") && (
              <span className="relative -top-[0px] ml-2">
                <Image alt={"alt"} className="rotate-180" src={vectorDown} />
              </span>
            )}
          </span>
        </div>
        {isDropDownActive && (
          <div
            className={clsx(
              "absolute  top-[115px] right-[23px] max-w-[220px] w-[210px] z-50  mt-2 py-4 w-full bg-muted-600  rounded-2xl flex flex-col gap-1"
            )}
          >
            {epochData.map((text, i) => (
              <Options
                key={`${text.epochNumber}_${i}`}
                startDate={text.startTimestamp}
                epochNumber={text.epochNumber}
                isCurrent={text.isCurrent}
                epoch={text}
              />
            ))}
          </div>
        )}
      </div>
    </PopUpModal>
  ) : null;
}

export default EpochMobile;
