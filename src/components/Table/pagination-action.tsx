import React, { useState } from "react";
import left from "../../assets/icon/common/page-left.svg";

import right from "../../assets/icon/common/page-right.svg";
import { isMobile } from "react-device-detect";
import Image from "next/image";
import clsx from "clsx";

type TOnClickHandler = React.MouseEventHandler<HTMLButtonElement>;

interface ITablePaginationProps {
  count: number;
  onChangePage: (page: number) => void;
  page: number;
  rowsPerPage: number;
  setPageSize: any;
}

const TablePagination: React.FC<ITablePaginationProps> = (props) => {
  const { count, page, rowsPerPage, onChangePage, setPageSize } = props;
  const [pageNumber, setpageNum] = useState(10);
  const handleFirstPageButtonClick: TOnClickHandler = () => {
    onChangePage(0);
  };

  const handleBackButtonClick: TOnClickHandler = () => {
    onChangePage(page - 1);
  };
  const handleOnChangePageSize = (val: any) => {
    setPageSize(val);
    setpageNum(val);
  };
  const handleNextButtonClick: TOnClickHandler = () => {
    onChangePage(page + 1);
  };

  const handleLastPageButtonClick: TOnClickHandler = () => {
    onChangePage(Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div
      style={{
        display: "flex",

        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <>
        <div className="flex items-center justify-center">
          <span
            onClick={page === 0 ? () => {} : handleBackButtonClick}
            aria-label="previous page"
            className={clsx("relative top-[3px] cursor-pointer", page === 0 && "opacity-[0.5]")}
          >
            <Image src={left} />
          </span>
          <span className="mx-2 font-body4">
            {page + 1} <span className="text-text-400">of {Math.ceil(count)}</span>
          </span>
          <span
            onClick={page >= Math.ceil(count) - 1 ? () => {} : handleNextButtonClick}
            aria-label="next page"
            className={clsx(
              "relative top-[3px]  cursor-pointer",
              page >= Math.ceil(count) - 1 && "opacity-[0.5]"
            )}
          >
            <Image src={right} />
          </span>
        </div>{" "}
      </>
    </div>
  );
};

export default TablePagination;
