import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useOutsideClick } from "../../utils/outSideClickHook";

export interface IDatePickerProps {
  selectedDate: Date;
  setStartDate: Function;
  isOpen: boolean;
  setIsOpen: Function;
}

export function Datepicker(props: IDatePickerProps) {
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    props.setIsOpen(false);
  });
  const years = [2022, 2023, 2024, 2025, 2026, 2027];
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
  const handleClick = (e: any) => {
    // e.preventDefault();
    e ? props.setStartDate(undefined, new Date(e).toISOString()) : "";
    props.setIsOpen(!props.isOpen);
  };
  return (
    <div ref={reff}>
      {props.isOpen && (
        <DatePicker
          onChange={handleClick}
          inline
          wrapperClassName="custom-date !hidden"
          popperClassName="bg-muted-600 absolute right-[36px] bottom-2"
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
          selected={props.selectedDate}
        />
      )}
    </div>
  );
}
