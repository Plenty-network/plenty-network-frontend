import Image from "next/image";
import * as React from "react";
import clsx from "clsx";
import epoachIcon from "../../assets/icon/common/epochTimeIcon.svg";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";
import vectorDown from "../../assets/icon/common/vector.svg";
import { useCountdown } from "../../hooks/useCountDown";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { getListOfEpochs } from "../../api/votes/votesKiran";
import { IEpochListObject } from "../../api/votes/types";
import { EPOCH_DURATION_TESTNET } from "../../constants/global";

export interface IEpochProps {
  Options: Array<string>;
  onClick: Function;
  selectedText: string;
  className?: string;
  title?: string;
}

export function Epoch(props: IEpochProps) {
  const [isDropDownActive, setIsDropDownActive] = React.useState(false);
  const [epochData, setEpochData] = React.useState<IEpochListObject[]>([]);
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    setIsDropDownActive(false);
  });
  React.useEffect(() => {
    getListOfEpochs().then((res) => {
      console.log(res.epochData);
      setEpochData(res.epochData);
    });
    setInterval(() => {
      getListOfEpochs().then((res) => {
        setEpochData(res.epochData);
      });
    }, EPOCH_DURATION_TESTNET);
  }, []);

  function Options(props: {
    onClick: Function;
    startDate: number;
    epochNumber: number;
    isCurrent?: boolean;
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
      "Decr",
    ];

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    return (
      <div
        onClick={() => {
          // props.onClick(props.text);
          setIsDropDownActive(false);
        }}
        className="hover:bg-primary-700 px-4 flex font-body4 text-text-50 items-center h-[36px] cursor-pointer"
      >
        Epoch{props.epochNumber} ({day}-{monthNames[month]}-{year.toString().substr(-2)})
      </div>
    );
  }
  const [days, hours, minutes, seconds] = useCountdown(
    epochData[0]?.startTimestamp ? epochData[0].startTimestamp : 654754468476474
  );
  return (
    <>
      <div className="relative flex gap-[10px] p-[14px]">
        <Image src={epoachIcon} />
        <div className="flex flex-col gap-[6px]">
          <div className="flex gap-1">
            <p className="text-text-250 text-f12">
              Epoch <span className="text-white">23</span>
            </p>
            <InfoIconToolTip message="Epoch lipsum" />
            <Image
              className="rotate-180"
              src={vectorDown}
              onClick={() => setIsDropDownActive(!isDropDownActive)}
            />
          </div>
          <div className="flex gap-2 text-f12 text-white font-semibold cursor-pointer">
            <span className="flex gap-1">
              <span>{days} d</span>:<span>{hours} h</span>:<span>{minutes} m</span>:
              <span>{seconds} s</span>
            </span>
          </div>
        </div>
        {isDropDownActive && (
          <div
            className={clsx(
              "absolute  top-[60px]   z-50  mt-2 py-4 w-full bg-muted-600  rounded-2xl flex flex-col gap-1"
            )}
          >
            {epochData.map((text, i) => (
              <Options
                onClick={props.onClick}
                key={`${text.epochNumber}_${i}`}
                startDate={text.startTimestamp}
                epochNumber={text.epochNumber}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
