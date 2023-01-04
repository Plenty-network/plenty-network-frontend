import React, { useState } from "react";

import { isMobile } from "react-device-detect";

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
        marginLeft: "auto",
        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isMobile && (
        <>
          <div>
            <span style={{ color: "#6F6E84" }}>Rows per page:</span>
            <select
              value={pageNumber}
              className="rowperpage"
              onChange={(e) => handleOnChangePageSize(e.target.value)}
            >
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
          <span>
            {page + 1} of {Math.ceil(count)}
          </span>
          <div>
            <span
              onClick={page === 0 ? () => {} : handleBackButtonClick}
              aria-label="previous page"
            >
              right
            </span>
            <span
              onClick={page >= Math.ceil(count) - 1 ? () => {} : handleNextButtonClick}
              className="ml-3"
              aria-label="next page"
            >
              left
            </span>
          </div>{" "}
        </>
      )}
      {/* {isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
            {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </span>
          <span component="span">
            {page + 1} of {Math.ceil(count)}
          </span>
          <span
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count) - 1}
            aria-label="next page"
          >
            {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </span>
        </div>
      )} */}
    </div>
  );
};

export default TablePagination;
