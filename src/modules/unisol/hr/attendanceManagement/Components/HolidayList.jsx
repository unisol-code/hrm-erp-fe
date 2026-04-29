import { useEffect } from "react";
import useEmpHoliday from "../../../../../hooks/unisol/empHoliday/useEmpHoliday";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import Button from "../../../../../components/Button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HolidayList = () => {
  const { allHolidayDetails, allHoliday, loading } = useEmpHoliday();

  useEffect(() => {
    allHolidayDetails();
  }, []);

  const hexToRgb = (hex) => {
    if (!hex) return [0, 0, 0]; // fallback black if empty
    hex = hex.replace(/^#/, "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const handleExportPDF = () => {
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
        fillColor: hexToRgb(theme.secondaryColor),
        textColor: [0, 0, 0], // white text
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Save PDF
    doc.save("Holiday_List.pdf");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(/ /g, "-");
  };

  const formatDay = (date) => {
    const dayDate = new Date(date);
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(dayDate);
    return dayName;
  };

  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="w-full rounded-2xl mt-4 h-[570px] bg-white shadow-lg border border-gray-200 flex flex-col">
      <div
        className="flex justify-between items-center w-full px-8 py-5 rounded-t-2xl"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <h1 className="text-black text-xl font-semibold tracking-wide">
          Holiday List
        </h1>
        <Button variant={1} text="Export" onClick={handleExportPDF} />
      </div>
      {/* Holiday Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse border border-gray-300">
          {/* Table Header */}
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="text-left">
              <th className="px-4 py-2">Sr.No</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Day</th>
              <th className="px-4 py-2">Occasion</th>
            </tr>
          </thead>
          <tbody>
            {allHoliday?.companyHolidays?.length > 0 ? (
              allHoliday.companyHolidays
                .flatMap((row) => row?.holidays || [])
                .map((holiday, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{formatDate(holiday?.date)}</td>
                    <td className="px-4 py-2">
                      {holiday?.day || formatDay(holiday?.date)}
                    </td>
                    <td className="px-4 py-2">{holiday?.holidayTitle}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No holidays available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HolidayList;
