import React, { useEffect, useState } from "react";
import FilterExpense from "../../../../../../components/Dialogs/expense/FilterExpense";
import ExpenseDetails from "../../../../../../components/Dialogs/expense/ExpenseDetails";
import useEmpExpense from "../../../../../../hooks/unisol/empExpense/useEmpExpense";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRegClock,
  FaFileInvoice,
  FaEdit,
} from "react-icons/fa";
import LoaderSpinner from "../../../../../../components/LoaderSpinner";
import Button from "../../../../../../components/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTheme } from "../../../../../../hooks/theme/useTheme";
import Pagination from "../../../../../../components/Pagination";
import { Eye } from "lucide-react";
import EditExpense from "../../../../../../components/Dialogs/expense/EditExpense";
import { MdDelete } from "react-icons/md";

const ViewStatus = () => {
  const [viewExpenseDetail, setViewExpenseDetail] = useState(false);
  const [editExpenseDetail, setEditExpenseDetail] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState([]);
  const { fetchExpenseStatus, expStatus, loading, updateExpense,
    deleteExpense } = useEmpExpense();

  const empId = sessionStorage.getItem("empId");

  console.log("expStatus", expStatus);

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="inline mr-2 text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="inline mr-2 text-red-500" />;
      default:
        return <FaRegClock className="inline mr-2 text-yellow-500" />;
    }
  };

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthYear, setMonthYear] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { theme } = useTheme();

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  useEffect(() => {
    if (!monthYear || !empId) return;

    const date = new Date(monthYear.year, monthYear.month);
    const monthWord = date.toLocaleString("en-US", { month: "long" });

    fetchExpenseStatus(empId, monthWord, monthYear.year, filterStatus, page, limit);
  }, [empId, monthYear, filterStatus, page, limit]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (newValue) => {
    if (!newValue) return;
    setMonthYear({
      month: newValue.getMonth(),
      year: newValue.getFullYear(),
    });
    setSelectedDate(newValue);
    setFilterStatus([]);
    setPage(1);
  };

  const handleFilterChange = (statuses) => {
    setFilterStatus(statuses);
    setPage(1);
  };

  const refreshExpenseStatus = () => {
    const date = new Date(monthYear.year, monthYear.month);
    const monthWord = date.toLocaleString("en-US", { month: "long" });

    fetchExpenseStatus(
      empId,
      monthWord,
      monthYear.year,
      filterStatus,
      page,
      limit
    );
  };

  const handleDeleteClick = async (expenseId) => {
    await deleteExpense(expenseId);
    fetchExpenseStatus(empId, monthWord, monthYear.year, filterStatus, page, limit);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="w-full flex items-center justify-between px-8 mb-4 py-4" style={{ backgroundColor: theme.secondaryColor }}>
        <h2 className="font-bold text-xl text-[#2d3a4a] flex items-center gap-2">
          <FaFileInvoice className="text-[#2d3a4a]" />
          Expense Submission Status
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
          <FilterExpense selectedFilters={filterStatus} onFilterChange={handleFilterChange} />
        </div>
      </div>
      {/* Expense Table */}
      <div className="max-h-[680px] pb-8">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="font-semibold text-gray-600 h-[40px] sticky top-0 z-20 bg-white border-b-2 border-gray-300 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.08)]">
                <th className="px-3 py-3 text-left w-[5%]">Sr. No.</th>
                <th className="px-4 py-3 text-left w-[15%]">Date</th>
                <th className="px-3 py-3 text-left w-[15%]">Expense Type</th>
                <th className="px-6 py-3 text-left w-[15%]">City</th>
                <th className="px-3 py-3 text-left w-[15%]">Amount</th>
                <th className="px-3 py-3 text-center w-[15%]">Status</th>
                <th className="px-3 py-3 text-center w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex items-center justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : !loading && Array.isArray(expStatus?.data) && expStatus?.data?.length > 0 ? (
                expStatus.data?.map((expense, index) => (
                  <tr
                    key={index}
                    className="bg-white hover:bg-blue-50 transition-colors h-14 border-b border-gray-100 last:border-b-0"
                  >
                    {/* Sr. No */}
                    <td className="px-4 py-3 font-medium text-gray-700 text-left">
                      {(page - 1) * limit + index + 1}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-3 font-medium text-gray-700 text-left">
                      {formatDate(expense.date) || "-"}
                    </td>

                    {/* Expense Type */}
                    <td className="px-6 py-3 text-gray-700 text-left truncate">
                      {expense.expenseCategory || "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-700 text-left truncate">
                      {expense?.city || "-"}
                    </td>
                    {/* Amount */}
                    <td className="px-6 py-3 text-gray-700 text-left">
                      ₹{Number(expense.amount).toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold
                    ${expense.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : expense.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                  `}
                      >
                        {getStatusIcon(expense.status)}
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-3 flex py-6 text-left justify-center gap-1 relative">
                      <button
                        onClick={() => {
                          setViewExpenseDetail(true);
                          setSelectedId(index);
                        }}
                        className="p-1 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200 group relative"
                        style={{ color: theme.primaryColor }}
                      ><Eye size={18} />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          View
                        </span>
                      </button>

                      {/* Edit Button with conditional styling */}
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (expense.isEditable) {
                              setEditExpenseDetail(true);
                              setSelectedId(index);
                            }
                          }}
                          className={`p-1 rounded-full transition-all duration-200 ${expense.isEditable
                            ? "hover:bg-blue-100 hover:scale-105 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                            }`}
                          style={{ color: expense.isEditable ? theme.primaryColor : "#9CA3AF" }}
                          disabled={!expense.isEditable}
                        >
                          <FaEdit size={18} />
                        </button>
                        {/* Tooltip */}
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {expense.isEditable ? "Edit" : "No permission"}
                        </span>
                      </div>

                      {/* Delete Button with conditional styling */}
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (expense.isDeletable) {
                              handleDeleteClick(expense._id);
                            }
                          }}
                          className={`p-1 rounded-full transition-all duration-200 ${expense.isDeletable
                            ? "hover:bg-red-100 hover:scale-105 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                            }`}
                          style={{ color: expense.isDeletable ? theme.primaryColor : "#9CA3AF" }}
                          disabled={!expense.isDeletable}
                        >
                          <MdDelete size={18} />
                        </button>
                        {/* Tooltip */}
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {expense.isDeletable ? "Delete" : "No permission"}
                        </span>
                      </div>
                      {viewExpenseDetail && selectedId === index && (
                        <ExpenseDetails
                          openDialog={viewExpenseDetail}
                          onClose={() => {
                            setViewExpenseDetail(false);
                            setSelectedId(null);
                          }}
                          expense={expense}
                          loading={loading}
                        />
                      )}
                      {editExpenseDetail && selectedId === index && (
                        <EditExpense
                          openDialog={editExpenseDetail}
                          onClose={() => {
                            setEditExpenseDetail(false);
                            setSelectedId(null);
                          }}
                          expense={expense}
                          onUpdated={refreshExpenseStatus} 
                          loading={loading}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-lg text-gray-500 font-medium">
                    No data found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && expStatus?.data?.length > 0 && (
          <div className="mt-4 px-3">
            <Pagination
              currentPage={expStatus?.pagination?.currentPage}
              totalPages={expStatus?.pagination?.totalPages}
              totalItems={expStatus?.pagination?.totalRecords}
              itemsPerPage={limit}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStatus;
