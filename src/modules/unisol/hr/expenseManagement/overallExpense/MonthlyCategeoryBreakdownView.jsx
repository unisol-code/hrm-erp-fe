import { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Pagination from "../../../../../components/Pagination";
import useHrExpense from "../../../../../hooks/unisol/hrExpense/useHrExpense";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MonthlyCategeoryBreakdownView = () => {
  const { year, month, category } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { fetchCategoryWiseEmployeeExpenses, categoryWiseEmployeeExpenses, loading } = useHrExpense();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const monthNameToNumber = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
  };
  const monthNumberToName = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  };

  const routeMonth = monthNameToNumber[month] || month;
  const routeYear = categoryWiseEmployeeExpenses?.filters?.year || year;
  const displayYear = routeYear || "N/A";
  const displayMonth =
    categoryWiseEmployeeExpenses?.filters?.month ||
    monthNumberToName[Number(routeMonth)] ||
    month ||
    "N/A";
  const displayCategory = categoryWiseEmployeeExpenses?.filters?.category || category || "N/A";

  useEffect(() => {
    fetchCategoryWiseEmployeeExpenses(year, routeMonth, category);
  }, [year, routeMonth, category]);

  const employeeData =
    categoryWiseEmployeeExpenses?.success !== false && Array.isArray(categoryWiseEmployeeExpenses?.data)
      ? categoryWiseEmployeeExpenses.data
      : [];
  const summary = categoryWiseEmployeeExpenses?.summary || {};
  const totalEmployees = Number(summary.totalEmployees ?? employeeData.length);
  const totalCash = Number(
    summary.totalCash ?? employeeData.reduce((sum, row) => sum + Number(row.totalCash || 0), 0)
  );
  const totalOnline = Number(
    summary.totalOnline ?? employeeData.reduce((sum, row) => sum + Number(row.totalOnline || 0), 0)
  );
  const totalExpense = Number(
    summary.totalExpense ?? employeeData.reduce((sum, row) => sum + Number(row.totalExpense || 0), 0)
  );

  const formatCurrency = (amount) => `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

  const formatCategory = (value) => {
    if (!value) return "N/A";
    const spaced = value.replace(/([A-Z])/g, " $1").trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  const startIndex = (page - 1) * limit;
  const paginatedData = employeeData.slice(startIndex, startIndex + limit);

  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
  };

  const downloadAsPDF = () => {
    if (!employeeData.length) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const marginX = 10;

    pdf.setFontSize(14);
    pdf.text(`Category Wise Employee Expenses - ${displayCategory}`, marginX, 15);

    pdf.setFontSize(10);
    pdf.text(`${displayMonth} ${displayYear}`, marginX, 22);

    const tableColumn = ["Sr No", "Employee ID", "Employee Name", "Cash", "Online", "Total Expense"];
    const tableRows = employeeData.map((row, index) => [
      index + 1,
      row.employeeId || "N/A",
      row.employeeName || "N/A",
      formatCurrency(row.totalCash),
      formatCurrency(row.totalOnline),
      formatCurrency(row.totalExpense),
    ]);

    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      margin: { left: marginX, right: marginX },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        halign: "center",
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: 20,
        fontStyle: "bold",
      },
      didDrawPage: () => {
        pdf.setFontSize(9);
        pdf.text(
          `Page ${pdf.getNumberOfPages()}`,
          pdf.internal.pageSize.getWidth() - 20,
          pdf.internal.pageSize.getHeight() - 10
        );
      },
    });

    pdf.save(`Category_Wise_Employee_Expenses_${displayCategory}_${displayMonth}_${displayYear}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Expense Management", href: "/expenseApproval" },
          { text: "Overall Expenses", href: "/expensesheet" },
          { text: "Year Wise Expenses", href: "/expensesheet/yearwiseexpense" },
          {
            text: `Month Wise Expenses - ${displayYear}`,
            href: routeYear ? `/expensesheet/monthwise-expense/${encodeURIComponent(routeYear)}` : "/expensesheet/yearwiseexpense",
          },
          {
            text: `Category Breakdown - ${displayMonth}`,
            href: routeYear && routeMonth
              ? `/expensesheet/category-monthwise-expense/${encodeURIComponent(routeYear)}/${encodeURIComponent(routeMonth)}`
              : "/expensesheet/yearwiseexpense",
          },
          { text: `Category Wise Employee Expenses - ${formatCategory(displayCategory)}` },
        ]}
      />

      {/* Header Section */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <FaUsers style={{ color: theme.primaryColor, fontSize: 32 }} />
          <div>
            <span className="text-2xl font-bold">Category Wise Employee Expenses</span>
            <p className="text-sm text-gray-500 mt-1">
              Year: {displayYear} · Month: {displayMonth} · Category: {formatCategory(displayCategory)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={1}
            type="button"
            text="Category Breakdown"
            onClick={() =>
              navigate(
                routeYear && routeMonth
                  ? `/expensesheet/category-monthwise-expense/${encodeURIComponent(routeYear)}/${encodeURIComponent(routeMonth)}`
                  : "/expensesheet/yearwiseexpense"
              )
            }
          />
          <Button
            variant={1}
            type="button"
            text="Month Wise Expenses"
            onClick={() =>
              navigate(
                routeYear
                  ? `/expensesheet/monthwise-expense/${encodeURIComponent(routeYear)}`
                  : "/expensesheet/yearwiseexpense"
              )
            }
          />
          <Button
            variant={1}
            onClick={downloadAsPDF}
            text="Export"
            className="no-pdf"
          />
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
        {loading ? (
          <div className="py-4 w-full flex items-center justify-center">
            <LoaderSpinner />
          </div>
        ) : (
          <>
            {/* Section Header - Gradient, Icon, Title */}
            <div
              className="w-full h-[60px] flex items-center justify-between px-8 bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff]"
              style={{
                background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
              }}
            >
              <div className="flex items-center gap-3">
                <FaUsers className="text-white text-xl" />
                <h2 className="font-bold text-xl text-gray-700">Employee Expenses</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white">
                <div className="px-3 py-1 rounded bg-white/20">
                  <span className="font-semibold">Employees: </span>
                  {totalEmployees}
                </div>
                <div className="px-3 py-1 rounded bg-white/20">
                  <span className="font-semibold">Cash: </span>
                  {formatCurrency(totalCash)}
                </div>
                <div className="px-3 py-1 rounded bg-white/20">
                  <span className="font-semibold">Online: </span>
                  {formatCurrency(totalOnline)}
                </div>
                <div className="px-3 py-1 rounded bg-white/20">
                  <span className="font-semibold">Total: </span>
                  {formatCurrency(totalExpense)}
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="w-full p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-center">
                  <thead>
                    <tr className="font-semibold text-gray-600 h-[50px] border-b-2 border-gray-300">
                      <th className="px-4">Sr No.</th>
                      <th className="px-4">Employee ID</th>
                      <th className="px-4">Employee Name</th>
                      <th className="px-4">Cash</th>
                      <th className="px-4">Online</th>
                      <th className="px-4">Total Expense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      if (paginatedData.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-12 text-gray-500 text-lg">
                              <div className="flex flex-col items-center gap-2">
                                <FaUsers className="text-gray-300 text-4xl" />
                                <span>No employee expense data available.</span>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return paginatedData.map((row, index) => (
                        <tr
                          key={`${row.employeeId}-${index}`}
                          className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 font-medium">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-4 font-medium text-slate-700">
                            {row.employeeId || "N/A"}
                          </td>
                          <td className="px-4 font-medium text-slate-700">
                            {row.employeeName || "N/A"}
                          </td>
                          <td className="px-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {formatCurrency(row.totalCash)}
                            </span>
                          </td>
                          <td className="px-4">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              {formatCurrency(row.totalOnline)}
                            </span>
                          </td>
                          <td className="px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {formatCurrency(row.totalExpense)}
                            </span>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="px-4 py-4">
          {!loading && employeeData.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(employeeData.length / limit) || 1}
              totalItems={employeeData.length}
              itemsPerPage={limit}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
              showRowPerPage={true}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default MonthlyCategeoryBreakdownView;