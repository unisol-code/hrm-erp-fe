import React from "react";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState, useEffect } from "react";
import useExpenseApproval from "../../../../../hooks/unisol/expense/useExpenseApproval";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Eye } from "lucide-react";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useRoles } from "../../../../../hooks/auth/useRoles";
import Button from "../../../../../components/Button";
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ExpenseSheet2 = () => {
  const { loading, fetchEmployeeExpenseById, expenseById } =
    useExpenseApproval();
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const monthParam = query.get("month");
  const yearParam = query.get("year");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : "hr";

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const monthParam = query.get("month");
    const yearParam = query.get("year");

    if (monthParam && yearParam) {
      return new Date(`${yearParam}-${monthParam}-01`);
    }
    return new Date();
  });


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.toLocaleString("default", { month: "long" });
      fetchEmployeeExpenseById(id, month, year, role);
    } else {
      fetchEmployeeExpenseById(id, null, null, role);
    }
  }, [id, monthParam, yearParam]);
  console.log("expenseById", expenseById);

  const handleMonthChange = (date) => {
    if (!date) {
      navigate("", { replace: true });
      setSelectedMonth(null);
      return;
    }

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    setSelectedMonth(date);

    if (month !== monthParam || year !== yearParam) {
      navigate(`?month=${month}&year=${year}`, { replace: true });
    }
  };


  const handleView = (row) => {
    const id = row?._id;
    navigate(`/expenseApproval/viewExpenseDetails/${id}`);
  };

  const getStatusStyles = (status, theme) => {
    if (!status)
      return {
        backgroundColor: `${theme.primaryColor}20`,
        color: theme.primaryColor,
      };
    switch (status.toLowerCase()) {
      case "approved":
        return { backgroundColor: "#d1fae5", color: "#059669" };
      case "rejected":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      case "pending":
        return { backgroundColor: "#fef9c3", color: "#b45309" };
      default:
        return {
          backgroundColor: `${theme.primaryColor}20`,
          color: theme.primaryColor,
        };
    }
  };

  const ready =
    (!monthParam && !yearParam) ||
    (selectedMonth &&
      monthParam &&
      yearParam &&
      selectedMonth.getMonth() + 1 === parseInt(monthParam) &&
      selectedMonth.getFullYear() === parseInt(yearParam));

  if (!ready) return <LoaderSpinner />;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}|${month}|${year}`;
  };
const downloadAsPDF = () => {
  if (!expenseById?.months?.[0]?.expenses) return;

  const pdf = new jsPDF("p", "mm", "a4");
  const marginX = 10;
  let yPosition = 15;

  // Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Expense Sheet Submission', marginX, yPosition);
  yPosition += 10;

  // Employee Details Section
  pdf.setFontSize(12);
  pdf.text('Employee Details', marginX, yPosition);
  yPosition += 7;

  const employeeDetails = [
    ['Employee Name:', expenseById?.employeeName || 'N/A'],
    ['Employee ID:', expenseById?.employeeId || 'N/A'],
    ['Grade:', expenseById?.payrollGrade || 'N/A'],
    ['Designation:', expenseById?.designation || 'N/A'],
    ['Department:', expenseById?.department || 'N/A'],
    ['Pay Period:', expenseById?.months?.[0]?.month ? (() => {
      const [month, year] = expenseById.months[0].month.split(' ');
      return `${month} | ${year}`;
    })() : 'N/A'],
    ['Status:', expenseById?.months?.[0]?.expenses?.[0]?.status || 'Pending'],
  ];

  autoTable(pdf, {
    startY: yPosition,
    body: employeeDetails,
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: marginX, right: marginX },
  });

  yPosition = pdf.lastAutoTable.finalY + 10;

  // Expense Details Section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Expense Details', marginX, yPosition);
  yPosition += 5;

  // Prepare table columns
  const tableColumn = [
    'Sr. No.',
    'Date',
    'City',
    'Category',
    'Total',
    'Status'
  ];

  // FIXED: Change filter from expenseId to _id
  const tableRows = expenseById.months[0].expenses
    .filter(row => row._id)  // ← CHANGED FROM row.expenseId
    .map((row, idx) => [
      idx + 1,
      formatDate(row.date) || '--',
      row.city || '--',  // ← ADDED city field
      row.expenseCategory || '--',
      `Rs. ${row.total || '0.00'}`,
      row.status || 'Pending',
    ]);

  // Add expenses table
  autoTable(pdf, {
    head: [tableColumn],
    body: tableRows.length > 0 ? tableRows : [['No Expense Found', '', '', '', '', '']],
    startY: yPosition,
    margin: { left: marginX, right: marginX },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      halign: 'center',
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
      4: { cellWidth: 30 },
      5: { halign: 'center', cellWidth: 30 },
    },
    didParseCell: function (data) {
      // Color code status column (now column 5, not 6)
      if (data.column.index === 5 && data.section === 'body') {
        const status = data.cell.raw?.toLowerCase();
        if (status === 'approved') {
          data.cell.styles.textColor = [5, 150, 105];
        } else if (status === 'rejected') {
          data.cell.styles.textColor = [220, 38, 38];
        } else if (status === 'pending') {
          data.cell.styles.textColor = [180, 83, 9];
        }
      }
    },
    didDrawPage: (data) => {
      // Add page numbers at bottom
      pdf.setFontSize(8);
      pdf.text(
        `Page ${pdf.getNumberOfPages()}`,
        pdf.internal.pageSize.getWidth() - 20,
        pdf.internal.pageSize.getHeight() - 10
      );
    },
  });

  // Add subtotal row manually
  const finalY = pdf.lastAutoTable.finalY + 5;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text(
    `SUBTOTAL: Rs. ${expenseById?.months?.[0]?.subtotal || '0.00'}`,
    pdf.internal.pageSize.getWidth() - marginX - 40,
    finalY,
    { align: 'right' }
  );

  // Footer note
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text(
    '*ALL EXPENSES REQUIRE LEGITIMATE RECEIPTS*',
    pdf.internal.pageSize.getWidth() / 2,
    finalY + 10,
    { align: 'center' }
  );

  // Generate filename
  const employeeName = expenseById?.employeeName || 'Employee';
  const month = expenseById?.months?.[0]?.month || 'Unknown';
  const filename = `${employeeName}_Expense_Sheet_${month.replace(' ', '_')}.pdf`;

  // Save the PDF
  pdf.save(filename);
};

  // Mobile card view for expenses
  const MobileExpenseCard = ({ row, index }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">Sr.No:</span>
          <span className="text-gray-700 font-medium">{index + 1}</span>
        </div>
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={getStatusStyles(row.status, theme)}
        >
          {row.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-500">Date</p>
          <p className="text-sm font-medium">{formatDate(row.date) || "--"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">City</p>
          <p className="text-sm font-medium">{row?.city || "--"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Category</p>
          <p className="text-sm font-medium">{row.expenseCategory}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-sm font-medium">₹{row.total || "0.00"}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleView(row)}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <Eye size={16} className="mr-1" />
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Expense Management" },
          { text: "Expense Approval", href: "/expenseApproval" },
          { text: "View Expense Sheet" },
        ]}
      />

      <div className="py-4 px-4 sm:px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ color: theme.primaryColor }}
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          <span className="text-xl sm:text-2xl font-bold">Expense Sheet Submission</span>
        </div>
      <Button
                variant={1}
                onClick={downloadAsPDF}
                text="Export"
                className="no-pdf"
              />
      </div>

      <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
        {
          loading ? (<div className="py-4 w-full flex items-center justify-center"><LoaderSpinner /></div>) : (
            <>    
            <div
              className="text-black bg-gradient-to-r from-gray-200  to-gray-100 p-4 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              style={{
                background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
              }}
            >
              <p className="text-white text-base sm:text-lg font-semibold">
                Monthly Only One Submission
              </p>
              <div className="flex gap-2 mt-3 sm:mt-0">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Month"
                    openTo="month"
                    views={["year", "month"]}
                    onChange={handleMonthChange}
                    value={selectedMonth}
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
              </div>
            </div>

              <div className="p-4 sm:p-8">
                <div
                  className="rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border"
                  style={{
                    background: `linear-gradient(135deg, ${theme.highlightColor}20 0%, #f8fafc 100%)`,
                    borderColor: `${theme.primaryColor}30`,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: theme.primaryColor }}
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                      </svg>
                      <span className="text-lg sm:text-xl font-semibold text-gray-800">
                        Employee Details
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-[2px] sm:h-[3px] bg-gradient-to-r from-gray-100  to-gray-200 rounded-full mb-4 sm:mb-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Personal Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">
                            Employee Name:
                          </span>
                          <span className="text-gray-600 text-sm sm:text-base font-semibold">
                            {expenseById?.employeeName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">
                            Employee ID:
                          </span>
                          <span className="text-gray-600 text-sm sm:text-base font-semibold">
                            {expenseById?.employeeId}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">Grade:</span>
                          <span className="text-gray-600 text-sm sm:text-base font-semibold">
                            {expenseById?.payrollGrade}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">
                            Designation:
                          </span>
                          <span className="text-gray-600 text-sm sm:text-base font-semibold">
                            {expenseById?.designation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:border-l md:border-gray-200 md:pl-6 lg:pl-8">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Department Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">
                            Department:
                          </span>
                          <span className="text-gray-600 text-sm sm:text-base font-semibold">
                            {expenseById?.department}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">Purpose:</span>
                          <span className="text-gray-600 text-sm sm:text-base font-semibold">
                            N/A
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">
                            Pay Period:
                          </span>
                          <div className="flex items-center space-x-2">
                            <span
                              className="text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium"
                              style={{ backgroundColor: theme.primaryColor }}
                            >
                              From
                            </span>
                            <span className="text-gray-600 text-sm sm:text-base font-semibold">
                              {expenseById?.months?.[0]?.month
                                ? (() => {
                                  const [month, year] =
                                    expenseById.months[0].month.split(" ");
                                  return `${month} | ${year}`;
                                })()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:border-l md:border-gray-200 md:pl-6 lg:pl-8">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Submission Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">
                            Date of Submission:
                          </span>
                          <span className="text-gray-600 text-sm sm:text-base font-semibold">
                            N/A
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">
                            Last Date of Submission:
                          </span>
                          <span className="text-gray-600 text-sm sm:text-base font-semibold">
                            N/A
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">Status:</span>
                          <span
                            className="px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-semibold"
                            style={getStatusStyles(
                              expenseById?.months?.[0]?.expenses?.[0]?.status ||
                              "Pending",
                              theme
                            )}
                          >
                            {expenseById?.months?.[0]?.expenses?.[0]?.status ||
                              "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expense Table */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: theme.primaryColor }}
                      >
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                      </svg>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Expense Details
                      </h3>
                    </div>
                  </div>

                  {/* Mobile View - Card Layout */}
                  {isMobile ? (
                    <div className="mt-3">
                      {expenseById?.months?.[0]?.expenses &&
                        expenseById.months[0].expenses.length > 0 ? (
                        expenseById.months[0].expenses.map((row, idx) =>
                          row._id ? (
                            <MobileExpenseCard key={idx} row={row} index={idx} />
                          ) : (
                            <div key={idx} className="bg-white rounded-xl p-4 mb-3 text-center text-gray-500">
                              {row?.message || "No Data Available"}
                            </div>
                          )
                        )
                      ) : (
                        <div className="bg-white rounded-xl p-4 text-center text-gray-500">
                          No Expense Found
                        </div>
                      )}

                      {/* Mobile Subtotal */}
                      <div className="bg-gray-50 rounded-xl p-4 mt-4 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">SUBTOTAL:</span>
                          <span className="font-bold text-gray-800">
                            ₹ {expenseById?.months?.[0]?.subtotal || "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Desktop View - Table Layout */
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mt-2">
                      <div
                        className="overflow-y-auto"
                        style={{
                          maxHeight: "500px",
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <style>
                          {`
                      .overflow-y-auto::-webkit-scrollbar { display: none; }
                      .sticky-footer-row {
                        position: sticky;
                        bottom: 0;
                        z-index: 2;
                         background: #fff !important;
                      }
                    `}
                        </style>
                        <table className="min-w-full table-fixed">
                          <thead
                            className="text-white"
                            style={{
                              background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            <tr>
                              <th className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-base">Sr. No.</th>
                              <th className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-base">Date</th>
                              <th className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-base">City</th>
                              <th className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-base">
                                Expense Category
                              </th>
                              <th className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-base">Total (₹)</th>
                              <th className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-base">Status</th>
                              <th className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-base">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expenseById?.months?.[0]?.expenses &&
                              expenseById.months[0].expenses.length > 0 ? (
                              expenseById.months[0].expenses.map((row, idx) =>
                                row._id ? (
                                  <tr
                                    key={idx}
                                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200"
                                  >
                                    <td className="p-3 sm:p-4 text-gray-700 font-medium text-center text-sm sm:text-base">
                                      {idx + 1}
                                    </td>
                                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">
                                      {formatDate(row.date) || "--"}
                                    </td>
                                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">
                                      {row?.city || "--"}
                                    </td>
                                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">
                                      {row.expenseCategory}
                                    </td>
                                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">
                                      ₹{row.total || "0.00"}
                                    </td>
                                    <td className="p-3 sm:p-4 text-gray-700 font-medium">
                                      <span
                                        className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium"
                                        style={getStatusStyles(row.status, theme)}
                                      >
                                        {row.status}
                                      </span>
                                    </td>
                                    <td className="p-3 sm:p-8 relative">
                                      <button
                                        variant={2}
                                        onClick={() => handleView(row)}
                                        className="hover:text-white py-1 px-2 sm:py-1 sm:px-3 bg-blue-50 rounded-full transition-transform duration-200 group-hover:scale-110 hover:bg-blue-500"
                                      >
                                        <Eye size={18} />
                                      </button>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr key={idx}>
                                    <td
                                      colSpan={7}
                                      className="p-3 sm:p-4 text-center text-gray-500 text-sm sm:text-base"
                                    >
                                      {row?.message || "No Data Available"}
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="p-3 sm:p-4 text-center text-gray-500 text-sm sm:text-base"
                                >
                                  No Expense Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot
                            className="sticky-footer-row"
                            style={{
                              position: "sticky",
                              bottom: 0,
                              zIndex: 2,
                              background: `linear-gradient(135deg, ${theme.highlightColor}20 0%, #f8fafc 100%)`,
                            }}
                          >
                            <tr>
                              <td
                                className="p-3 sm:p-4 text-right font-bold text-gray-800 text-sm sm:text-base"
                                colSpan={6}
                                style={{
                                  background: `linear-gradient(135deg, ${theme.highlightColor}20 0%, #f8fafc 100%)`,
                                }}
                              >
                                SUBTOTAL:
                              </td>
                              <td
                                className="p-3 sm:p-4 text-left font-bold text-gray-800 text-sm sm:text-base"
                                style={{
                                  background: `linear-gradient(135deg, ${theme.highlightColor}20 0%, #f8fafc 100%)`,
                                }}
                              >
                                ₹ {expenseById?.months?.[0]?.subtotal || "0.00"}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 text-orange-700 p-3 sm:p-4 rounded-r-xl mb-6 sm:mb-8">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                    <span className="font-semibold text-xs sm:text-sm">
                      *ALL EXPENSES NEED TO BE WITH LEGITIMATE RECEIPTS*
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: theme.primaryColor }}
                    >
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Authorization
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Authorized By:
                      </span>
                      <span className="text-gray-800 text-sm sm:text-base">NA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">Date:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-800 text-sm sm:text-base">DD-MM-YYYY</span>
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-1.99.9-1.99 2L2 19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V8h16v11z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-3 sm:mt-4 font-medium">
                    For Office Use Only
                  </div>
                </div>
              </div></>
          )
        }
      </section>
    </div>
  );
};

export default ExpenseSheet2;