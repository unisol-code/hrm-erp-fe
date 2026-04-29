import { useRef, useState } from "react";
import useEmpExpense from "../../../../../../hooks/unisol/empExpense/useEmpExpense";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRegClock,
  FaFileInvoice,
} from "react-icons/fa";
import { useTheme } from "../../../../../../hooks/theme/useTheme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "../../../../../../components/Button";
import LoaderSpinner from "../../../../../../components/LoaderSpinner";
import Pagination from "../../../../../../components/Pagination";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExpenseHistory = () => {
  const { fetchExpenseHistory, expHistory, loading } = useEmpExpense();
  const empId = sessionStorage.getItem("empId");
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const tableRef = useRef(null)
  useEffect(() => {
    if (!selectedDate || !empId) return;

    const monthWord = selectedDate.toLocaleString("en-US", { month: "long" });
    const year = selectedDate.getFullYear();

    fetchExpenseHistory(empId, monthWord, year, page, limit);
  }, [empId, selectedDate, page, limit]);

  const handleDateChange = (newValue) => {
    if (!newValue) return;
    setSelectedDate(newValue);
    setPage(1);
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };
  const downloadAsPDF = async () => {
    const input = tableRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        width: input.scrollWidth,
        height: input.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const margin = 15;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const contentWidth = pdfWidth - 2 * margin;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);

      const month = selectedDate.toLocaleString('en-US', { month: 'long' });
      const year = selectedDate.getFullYear();
      pdf.save(`Expense_History_${month}_${year}.pdf`);

    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };
  const { theme } = useTheme();
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="w-full py-6 flex items-center justify-between px-8" style={{ backgroundColor: theme.secondaryColor }}>
        <h2 className="font-bold text-xl text-[#2d3a4a] flex items-center gap-2">
          <FaFileInvoice className="text-[#2d3a4a]" />
          Approved Expense History
        </h2>
        <div className="flex items-center justify-center gap-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Month"
              openTo="month"
              maxDate={today}
              views={["year", "month"]}
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  className: "bg-white rounded-lg shadow-sm",
                  size: "small",
                  sx: {
                    "& .MuiInputLabel-root": {
                      fontSize: "0.9rem",
                      color: "#374151",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
          <Button variant={1} text="Download Report" onClick={() => downloadAsPDF()} />
        </div>
      </div>
      <div className="overflow-x-auto pb-8 w-full" ref={tableRef}>
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr className="font-semibold text-black-600 border-b-2">
              <th className="px-6 py-3 text-left">Sr. No.</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Expense Type</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Remark</th>
            </tr>
          </thead>
          <tbody>
            {
              loading ? (<tr><td colSpan={4}><div className="py-4 flex items-center w-full justify-center"><LoaderSpinner /></div></td></tr>) : (
                expHistory?.totalExpenseHistory?.length > 0 ? (
                  expHistory?.totalExpenseHistory?.map((expense, index) => (
                    <tr
                      key={index}
                      className="bg-white shadow-sm hover:bg-blue-50 transition-colors h-16 rounded-xl"
                      style={{ borderRadius: "1rem" }}
                    >
                      <td className="px-6 py-3 font-medium text-gray-700 text-left rounded-l-xl">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-700 text-left rounded-l-xl">
                        {formatDate(expense?.date)}
                      </td>
                      <td className="px-6 py-3 text-gray-700 text-left">
                        {expense?.category}
                      </td>
                      <td className="px-6 py-3 text-gray-700 text-left">
                        {expense?.amount}
                      </td>
                      <td className="px-6 py-3 text-gray-700 text-left">
                        {expense?.description || "-"}
                      </td>
                    </tr>
                  ))) : (<tr><td colSpan={4}><div className="py-4 w-full flex items-center justify-center text-lg font-semibold">No Data Found.</div></td></tr>)
              )
            }
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {!loading && expHistory?.totalExpenseHistory?.length > 0 && (
        <div className="mt-4 px-3">
          <Pagination
            currentPage={expHistory?.pagination?.currentPage}
            totalPages={expHistory?.pagination?.totalPages}
            totalItems={expHistory?.pagination?.totalRecords}
            itemsPerPage={limit}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
            showRowPerPage={true}
          />
        </div>
      )}
    </div>
  );
};

export default ExpenseHistory;
