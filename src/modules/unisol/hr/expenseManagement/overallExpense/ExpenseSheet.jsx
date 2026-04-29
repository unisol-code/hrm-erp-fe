import { useEffect, useState } from "react";
import useHrExpense from "../../../../../hooks/unisol/hrExpense/useHrExpense";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { Eye } from "lucide-react";
import { FiArrowLeftCircle } from "react-icons/fi";
import Button from "../../../../../components/Button";
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import { IconButton } from "@mui/material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ExpenseSheet = () => {
  const {
    fetchExpenseSheet,
    expenseSheet,
    resetExpenseSheet,
    fetchEmpWiseYears,
    empWiseYears,
    fetchYearWiseMonth,
    yearWiseMonths,
  } = useHrExpense();

  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const monthParam = query.get("month");
  const yearParam = query.get("year");
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchEmpWiseYears(id);
  }, [id]);

  useEffect(() => {
    if (yearParam && monthParam) {
      setSelectedYear(yearParam);
      setSelectedMonth(monthParam);
    }
  }, []);

  useEffect(() => {
    if (empWiseYears?.length > 0 && !selectedYear) {
      setSelectedYear(empWiseYears[0]);
    }
  }, [empWiseYears]);

  useEffect(() => {
    if (selectedYear) {
      fetchYearWiseMonth(id, selectedYear);
      setSelectedMonth('');
    }
  }, [selectedYear]);

  useEffect(() => {
    if (yearWiseMonths?.length > 0 && !selectedMonth) {
      setSelectedMonth(yearWiseMonths[0]);
    }
  }, [yearWiseMonths]);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchExpenseSheet(id, selectedMonth, selectedYear);

      navigate(
        `?year=${selectedYear}&month=${selectedMonth}`,
        { replace: true }
      );
    }
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
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

  const handleView = (row) => {
    const id = row?.expenseId;
    navigate(`/expensesheet/viewExpenseSheet/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}|${month}|${year}`;
  };

  const downloadAsPDF = () => {
    console.log('expenseSheet:', expenseSheet);
    console.log('expenses:', expenseSheet?.months?.[0]?.expenses);

    if (!expenseSheet?.months?.[0]) {
      console.error('No month data available');
      alert('No expense data available to export');
      return;
    }

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
      ['Employee Name:', expenseSheet?.employeeName || 'N/A'],
      ['Employee ID:', expenseSheet?.employeeId || 'N/A'],
      ['Grade:', expenseSheet?.payrollGrade || 'N/A'],
      ['Designation:', expenseSheet?.designation || 'N/A'],
      ['Department:', expenseSheet?.department || 'N/A'],
      ['Pay Period:', expenseSheet?.months?.[0]?.month ? (() => {
        const [month, year] = expenseSheet.months[0].month.split(' ');
        return `${month} | ${year}`;
      })() : 'N/A'],
      ['Status:', expenseSheet?.months?.[0]?.expenses?.[0]?.status || 'Pending'],
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
      'Category',
      'Per Day Allowance',
      'Total',
      'Status'
    ];

    const expenses = expenseSheet?.months?.[0]?.expenses || [];

    const tableRows = expenses.length > 0
      ? expenses
        .filter(row => row.expenseId)
        .map((row, idx) => {
          return [
            idx + 1,
            formatDate(row.date) || '--',
            row.expenseCategory || '--',
            `Rs. ${row.perDayAllowance || '0.00'}`,
            `Rs. ${row.total || '0.00'}`,
            row.status || 'Pending',
          ];
        })
      : [];

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
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
        5: { halign: 'center', cellWidth: 25 },
      },
      didParseCell: function (data) {
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
        pdf.setFontSize(8);
        pdf.text(
          `Page ${pdf.getNumberOfPages()}`,
          pdf.internal.pageSize.getWidth() - 20,
          pdf.internal.pageSize.getHeight() - 10
        );
      },
    });

    const finalY = pdf.lastAutoTable.finalY + 5;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      `SUBTOTAL: Rs. ${expenseSheet?.months?.[0]?.subtotal || '0.00'}`,
      pdf.internal.pageSize.getWidth() - marginX - 40,
      finalY,
      { align: 'right' }
    );

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text(
      '*ALL EXPENSES REQUIRE LEGITIMATE RECEIPTS*',
      pdf.internal.pageSize.getWidth() / 2,
      finalY + 10,
      { align: 'center' }
    );

    const employeeName = expenseSheet?.employeeName || 'Employee';
    const month = expenseSheet?.months?.[0]?.month || 'Unknown';
    const filename = `${employeeName}_Expense_Sheet_${month.replace(' ', '_')}.pdf`;
    pdf.save(filename);
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Expense Management", href: "/expenseApproval" },
          { text: "Overall Expenses", href: "/expensesheet" },
          { text: "Expense Sheet Submission" }
        ]}
      />

      <div className="py-4 px-8 flex flex-col md:flex-row md:items-start rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Link
            to="/expensesheet"
            className="flex items-center rounded-full p-1 transition-colors"
          >
            <FiArrowLeftCircle className="text-4xl text-black" />
          </Link>
          <span className="text-2xl font-bold">Expense Sheet Submission</span>
        </div>
        <Button
          variant={1}
          onClick={downloadAsPDF}
          text="Export"
          className="no-pdf"
        />
      </div>

      <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
        <div
          className="text-white p-4 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
          }}
        >
          <p className="text-white text-lg font-semibold">
            Monthly Wise Submission
          </p>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <div className="flex gap-2">
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="h-10 px-3 rounded-xl border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
              >
                <option value="" disabled>Select Year</option>
                {empWiseYears?.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                disabled={!selectedYear || !yearWiseMonths?.length}
                className="h-10 px-3 rounded-xl border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="" disabled>Select Month</option>
                {yearWiseMonths?.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div
            className="rounded-2xl p-6 mb-8 border"
            style={{
              background: `linear-gradient(135deg, ${theme.highlightColor}20 0%, #f8fafc 100%)`,
              borderColor: `${theme.primaryColor}30`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: theme.primaryColor }}
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span className="text-xl font-semibold text-gray-800">
                  Employee Details
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">
                      Employee Name:
                    </span>
                    <span className="text-gray-600 font-semibold">
                      {expenseSheet?.employeeName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">
                      Employee ID:
                    </span>
                    <span className="text-gray-600 font-semibold">
                      {expenseSheet?.employeeId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">Grade:</span>
                    <span className="text-gray-600 font-semibold">
                      {expenseSheet?.payrollGrade || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Designation:
                    </span>
                    <span className="text-gray-600 text-md font-semibold">
                      {expenseSheet?.designation || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:border-l md:pl-8 border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Department Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">
                      Department:
                    </span>
                    <span className="text-gray-600 font-semibold">
                      {expenseSheet?.department || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">
                      Pay Period:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-white px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        From
                      </span>
                      <span className="text-gray-600 text-md font-semibold">
                        {selectedMonth && selectedYear
                          ? `${selectedMonth} | ${selectedYear}`
                          : expenseSheet?.months?.[0]?.month
                            ? (() => {
                              const [month, year] =
                                expenseSheet.months[0].month.split(" ");
                              return `${month} | ${year}`;
                            })()
                            : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:border-l md:border-gray-200 md:pl-8">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Submission Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Date of Submission:
                    </span>
                    <span className="text-gray-600 text-md font-semibold">
                      N/A
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Last Date of Submission:
                    </span>
                    <span className="text-gray-600 text-md font-semibold">
                      N/A
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span
                      className="px-3 py-1 rounded-md text-sm font-semibold"
                      style={getStatusStyles(
                        expenseSheet?.months?.[0]?.expenses?.[0]?.status ||
                        "Pending",
                        theme
                      )}
                    >
                      {expenseSheet?.months?.[0]?.expenses?.[0]?.status ||
                        "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Table */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: theme.primaryColor }}
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">
                  Expense Details
                </h3>
              </div>
            </div>
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
                <table className="w-full">
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
                      <th className="p-4 text-left font-semibold">Sr. No.</th>
                      <th className="p-4 text-left font-semibold">Date</th>
                      <th className="p-4 text-left font-semibold">Expense Category</th>
                      <th className="p-4 text-left font-semibold">Per Day Allowance (₹)</th>
                      <th className="p-4 text-left font-semibold">Total (₹)</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseSheet?.months?.[0]?.expenses &&
                      expenseSheet.months[0].expenses.length > 0 ? (
                      expenseSheet.months[0].expenses.map((row, idx) =>
                        row.expenseId ? (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200"
                          >
                            <td className="p-4 text-gray-700 font-medium text-center pr-12">
                              {idx + 1}
                            </td>
                            <td className="p-4 text-gray-700">
                              {formatDate(row.date) || "--"}
                            </td>
                            <td className="p-4 text-gray-700">
                              {row.expenseCategory}
                            </td>
                            <td className="p-4 text-gray-700">
                              ₹{row.perDayAllowance || "0.00"}
                            </td>
                            <td className="p-4 text-gray-700">
                              ₹{row.total || "0.00"}
                            </td>
                            <td className="p-4 text-gray-700 font-medium">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={getStatusStyles(row.status, theme)}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="p-8 relative">
                              <IconButton onClick={() => handleView(row)}>
                                <Eye
                                  size={20}
                                  style={{ color: theme.primaryColor }}
                                />
                              </IconButton>
                            </td>
                          </tr>
                        ) : (
                          <tr key={idx}>
                            <td
                              colSpan={7}
                              className="p-4 text-center text-gray-500"
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
                          className="p-4 text-center text-gray-500"
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
                        className="p-4 text-right font-bold text-gray-800"
                        colSpan={6}
                        style={{
                          background: `linear-gradient(135deg, ${theme.highlightColor}20 0%, #f8fafc 100%)`,
                        }}
                      >
                        SUBTOTAL:
                      </td>
                      <td
                        className="p-4 text-left font-bold text-gray-800"
                        style={{
                          background: `linear-gradient(135deg, ${theme.highlightColor}20 0%, #f8fafc 100%)`,
                        }}
                      >
                        ₹ {expenseSheet?.months?.[0]?.subtotal || "0.00"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-6 text-center font-medium">
            *ALL EXPENSES REQUIRE LEGITIMATE RECEIPTS*
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpenseSheet;