import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useTheme } from "../hooks/theme/useTheme";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showRowPerPage = false, // ✅ new optional prop
}) => {
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage ?? 10);
  const [pageInput, setPageInput] = useState(currentPage);
  const { theme } = useTheme();

  useEffect(() => {
    if (itemsPerPage !== undefined && itemsPerPage !== itemsPerPageState) {
      setItemsPerPageState(itemsPerPage);
    }
  }, [itemsPerPage, itemsPerPageState]);

  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      setPageInput(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      setPageInput(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setItemsPerPageState(value);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(value);
    }
  };

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
    setPageInput(pageNumber);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) endPage = 4;
      if (currentPage >= totalPages - 2) startPage = totalPages - 3;
      if (startPage > 2) pages.push("...");

      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (!currentPage || !totalPages) return null;

  return (
    <div
      className="flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-3 gap-3 w-full bg-white border-t-4"
      style={{ borderColor: theme.highlightColor }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <p className="text-gray-700 font-medium">
          Showing {(currentPage - 1) * itemsPerPageState + 1} to{" "}
          {Math.min(currentPage * itemsPerPageState, totalItems)} of {totalItems} Entries
        </p>

        {/* ✅ Conditionally visible "Rows per page" */}
        {showRowPerPage && (
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <span>Rows per page:</span>
            <select
              value={itemsPerPageState}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-md px-2 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {[5, 10, 15, 20, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          className={`text-base px-4 py-2 rounded-md border ${
            currentPage === 1 ? "cursor-not-allowed opacity-70" : ""
          }`}
          style={{
            backgroundColor: theme.primaryColor,
            borderColor: theme.primaryColor,
            color: "white",
          }}
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = theme.highlightColor;
              e.currentTarget.style.color = "black";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = theme.primaryColor;
              e.currentTarget.style.color = "white";
            }
          }}
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex space-x-2 mx-4">
          {renderPageNumbers().map((page, index) => (
            <button
              key={index}
              className="w-[30px] h-[30px] flex items-center justify-center rounded-sm text-sm font-medium"
              style={{
                backgroundColor:
                  page === currentPage ? theme.primaryColor : "white",
                color:
                  page === "..."
                    ? "#9CA3AF"
                    : page === currentPage
                    ? "white"
                    : theme.primaryColor,
                cursor: page === "..." ? "not-allowed" : "pointer",
                opacity: page === "..." ? 0.6 : 1,
              }}
              onClick={() => typeof page === "number" && handlePageClick(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          className={`text-base px-4 py-2 rounded-md border ${
            currentPage === totalPages || totalPages === 0
              ? "cursor-not-allowed opacity-70"
              : ""
          }`}
          style={{
            backgroundColor: theme.primaryColor,
            borderColor: theme.primaryColor,
            color: "white",
          }}
          onClick={handleNextClick}
          disabled={currentPage === totalPages || totalPages === 0}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = theme.highlightColor;
              e.currentTarget.style.color = "black";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = theme.primaryColor;
              e.currentTarget.style.color = "white";
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
