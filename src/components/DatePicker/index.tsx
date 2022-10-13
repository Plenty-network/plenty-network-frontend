import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useOutsideClick } from "../../utils/outSideClickHook";

export interface IDatePickerProps {
  selectedDate: Date;
  setStartDate: Function;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startTimeStamp: number;
  endTimeStamp: number;
  yearsToEnable: number[];
  alloweDates: number[];
}

export function Datepicker(props: IDatePickerProps) {
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    props.setIsOpen(false);
  });
  const years = props.yearsToEnable;
  const getYear = (date: string | number | Date) => {
    const Xmas = new Date(date);
    return Xmas.getFullYear();
  };
  const getMonth = (date: string | number | Date) => {
    const Xmas = new Date(date);
    return Xmas.getMonth();
  };
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(props.selectedDate);
  const handleClick = (isSetDate: boolean) => {
    // e.preventDefault();
    if (isSetDate) {
      selectedDate ? props.setStartDate(undefined, new Date(selectedDate).toISOString()) : "";
    }
    props.setIsOpen(false);
  };
  console.log(props.isOpen);
  return (
    <div ref={reff}>
      {props.isOpen && (
        <div className="react-datepicker-2">
          <DatePicker
            onChange={(e) => (e ? setSelectedDate(e) : "")}
            inline
            wrapperClassName="custom-date !hidden"
            popperClassName=" absolute right-[36px] bottom-2"
            includeDates={props.alloweDates.map((e) => new Date(e))}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="flex gap-2 justify-center items-center text-text-55">
                <div className="hover:bg-primary-900 p-2 bg-muted-600 rounded-lg ">
                  <select
                    value={months[getMonth(date)]}
                    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                    className="hover:bg-primary-900 bg-muted-600 rounded-lg outline-none "
                  >
                    {months.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hover:bg-primary-900 p-2 bg-muted-600 rounded-lg ">
                  <select
                    value={getYear(date)}
                    onChange={({ target: { value } }) => changeYear(parseInt(value))}
                    className="hover:bg-primary-900 bg-muted-600 rounded-lg outline-none"
                  >
                    {years.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            selected={selectedDate}
          />
          <div className="flex gap-2 text-f14 mt-2">
            <button
              className="bg-primary-900 items-center justify-center flex-grow py-2 rounded-lg hover:opacity-95"
              onClick={() => handleClick(false)}
            >
              Cancel
            </button>
            <button
              className="bg-primary-500 items-center justify-center flex-grow py-2 rounded-lg hover:opacity-95"
              onClick={() => handleClick(true)}
            >
              Set Date
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
