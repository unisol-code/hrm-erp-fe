import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Pagination from "../../../../../components/Pagination";
import useHrExpense from "../../../../../hooks/unisol/hrExpense/useHrExpense";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MonthWiseExpeses = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { fetchExpensesMonthlyTrend, expensesMonthlyTrend, loading } = useHrExpense();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  useEffect(() => {
    fetchExpensesMonthlyTrend(year);
  }, [year]);

  const monthlyData =
    expensesMonthlyTrend?.success !== false && Array.isArray(expensesMonthlyTrend?.data)
      ? expensesMonthlyTrend.data
      : [];
  const totalExpense = Number(
    expensesMonthlyTrend?.totalExpense ??
      monthlyData.reduce((sum, row) => sum + Number(row.total || 0), 0)
  );
  const average = Number(
    expensesMonthlyTrend?.average ??
      (monthlyData.length ? totalExpense / monthlyData.length : 0)
  );
  const displayYear = expensesMonthlyTrend?.year || year || "N/A";
  const routeYear = expensesMonthlyTrend?.year || year;

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

  const startIndex = (page - 1) * limit;
  const paginatedData = monthlyData.slice(startIndex, startIndex + limit);

  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
  };

  const downloadAsPDF = () => {
    if (!monthlyData.length) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const marginX = 10;

    pdf.setFontSize(14);
    pdf.text(`Month Wise Expense Report - ${displayYear}`, marginX, 15);

    pdf.setFontSize(10);
    pdf.text("Monthly Expense Summary", marginX, 22);

    const tableColumn = ["Sr No", "Month", "Total Expenses (₹)"];
    const tableRows = monthlyData.map((row, index) => [
      index + 1,
      row.name,
      `₹${Number(row.total || 0).toLocaleString("en-IN")}`,
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

    pdf.save(`Month_Wise_Expense_Report_${displayYear}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Expense Management", href: "/expenseApproval" },
          { text: "Overall Expenses", href: "/expensesheet" },
          { text: "Year Wise Expenses", href: "/expensesheet/yearwiseexpense" },
          { text: `Month Wise Expenses - ${displayYear}` },
        ]}
      />

      {/* Header Section */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <FaCalendarAlt style={{ color: theme.primaryColor, fontSize: 32 }} />
          <div>
            <span className="text-2xl font-bold">Month Wise Expenses</span>
            <p className="text-sm text-gray-500 mt-1">Year: {displayYear}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={1}
            type="button"
            text="Year Wise Expenses"
            onClick={() => navigate("/expensesheet/yearwiseexpense")}
          />
          <Button
            variant={1}
            type="button"
            text="Sales Team"
            onClick={() => navigate("/expensesheet")}
          />
          <Button
            variant={1}
            type="button"
            text="Category Wise Expenses"
            onClick={() => navigate("/expensesheet/categorywiseexpense")}
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
                <FaCalendarAlt className="text-white text-xl" />
                <h2 className="font-bold text-xl text-gray-700">Monthly Expense Summary</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-white">
                <div className="px-4 py-1 rounded bg-white/20">
                  <span className="font-semibold">Avg: </span>
                  ₹{Number(average).toLocaleString("en-IN")}
                </div>
                <div className="px-4 py-1 rounded bg-white/20">
                  <span className="font-semibold">Total: </span>
                  ₹{Number(totalExpense).toLocaleString("en-IN")}
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
                      <th className="px-4">Month</th>
                      <th className="px-4">Total Expenses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      if (paginatedData.length === 0) {
                        return (
                          <tr>
                            <td colSpan={3} className="py-12 text-gray-500 text-lg">
                              <div className="flex flex-col items-center gap-2">
                                <FaCalendarAlt className="text-gray-300 text-4xl" />
                                <span>No monthly expense data available.</span>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return paginatedData.map((row, index) => (
                        <tr
                          key={`${row.name}-${index}`}
                          onClick={() => {
                            const monthNumber = monthNameToNumber[row?.name] || row?.name;
                            if (routeYear && monthNumber) {
                              navigate(`/expensesheet/category-monthwise-expense/${encodeURIComponent(routeYear)}/${encodeURIComponent(monthNumber)}`);
                            }
                          }}
                          className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-4 font-medium">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-4 font-medium text-slate-700">
                            {row.name}
                          </td>
                          <td className="px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              ₹{Number(row.total || 0).toLocaleString("en-IN")}
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
          {!loading && monthlyData.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(monthlyData.length / limit) || 1}
              totalItems={monthlyData.length}
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

export default MonthWiseExpeses;