import React, { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import useEmpHoliday from "../../hooks/unisol/empHoliday/useEmpHoliday";
import { useTheme } from "../../hooks/theme/useTheme";
import LoaderSpinner from "../LoaderSpinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}|${month}|${year}`;
};
const formatDay = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { weekday: "long" });
};

const CompanyHoliday = ({ onClose }) => {
  const { allHolidayDetails, allHoliday, loading } = useEmpHoliday();
  const { theme, switchTheme } = useTheme();
  const companyName = sessionStorage.getItem("companyName");
  const dialogRef = useRef(null);

  useEffect(() => {
    if (companyName) {
      switchTheme(companyName);
    }
  }, [companyName, switchTheme]);

  useEffect(() => {
    allHolidayDetails();
    // console.log("Holiday res:", allHoliday);
  }, []);

  // Close dialog when clicking outside the dialog
  useEffect(() => {
    const handleDialogClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleDialogClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDialogClickOutside);
    };
  }, [onClose]);

  // ✅ Add this helper above handleDownloadPDF
  const hexToRgb = (hex) => {
    if (!hex) return [204, 204, 204]; // fallback grey
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b]; // jsPDF expects [r,g,b]
  };

  const handleDownloadPDF = () => {
    if (!allHoliday?.companyHolidays?.length) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(16);
    doc.text("Holiday List", pageWidth / 2, 15, { align: "center" });

    // Prepare table data
    let count = 1;
    const tableData = [];
    allHoliday.companyHolidays.forEach((row) => {
      row?.holidays?.forEach((holiday) => {
        tableData.push([
          count++,
          formatDate(holiday?.date),
          holiday?.day || formatDay(holiday?.date),
          holiday?.holidayTitle,
        ]);
      });
    });

    // Table
    autoTable(doc, {
      startY: 25,
      head: [["Sr.No", "Date", "Day", "Occasion"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: hexToRgb(theme?.secondaryColor || "#cccccc"),
        textColor: [0, 0, 0],
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Save PDF
    doc.save("Holiday_List.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-start justify-center z-50 min-h-screen overflow-y-auto">
      <div className="w-full min-h-screen flex justify-center items-start pt-24 pb-8">
        <div
          ref={dialogRef}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp border border-blue-100"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-8 py-6"
            style={{
              background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
            }}
          >
            <div className="flex items-center gap-3 text-2xl font-bold text-[#4533d1]">
              <FaCalendarAlt className="text-blue-600" /> Company Holiday
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded-full shadow transition"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Content Section */}
          <div className="bg-white px-4 sm:px-8 py-8 rounded-b-2xl max-h-[70vh] overflow-auto scrollbar-hide">
            <h1 className="text-lg font-semibold mb-6 text-[#4533d1]">
              Company Holiday List{" "}
              {allHoliday?.year ? `for ${allHoliday.year}` : ""}
            </h1>

            {/* Holiday List */}
            <div className="space-y-6 min-h-[180px]">
              {loading ? (
                <div className="py-4 flex w-full h-full items-center justify-center">
                  <LoaderSpinner></LoaderSpinner>
                </div>
              ) : allHoliday?.companyHolidays?.length ? (
                allHoliday.companyHolidays.map((row, index) => (
                  <div
                    key={index}
                    className="bg-[#f6f7fb] rounded-xl p-4 shadow-md flex flex-col gap-2"
                  >
                    <div className="font-semibold text-base text-[#4533d1] mb-1">
                      {row?.month}
                    </div>
                    <div className="flex flex-col gap-2">
                      {row?.holidays.map((data, i) => (
                        <div
                          className="flex flex-row items-center justify-between px-2 py-1"
                          key={i}
                        >
                          <span className="flex items-center w-2/3 text-left truncate">
                            <span className="text-lg mr-2 text-gray-400">
                              •
                            </span>
                            <span className="font-medium text-gray-700">
                              {data?.holidayTitle}
                            </span>
                          </span>
                          <span className="text-gray-700 w-1/3 text-right">
                            {formatDate(data?.date)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-lg">
                  <FaCalendarAlt className="text-4xl mb-2 text-blue-200" />
                  No holidays to display.
                </div>
              )}
            </div>

            {/* Download Button */}
            <div className="flex justify-center w-full mt-10">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 hover:scale-105"
                style={{ background: theme?.primaryColor || "#4533d1" }}
              >
                <MdOutlineFileDownload size={22} /> Download List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHoliday;
