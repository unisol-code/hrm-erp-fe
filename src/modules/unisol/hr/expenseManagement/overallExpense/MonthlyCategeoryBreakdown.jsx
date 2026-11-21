import { useEffect } from "react";
import { FaTags } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import useHrExpense from "../../../../../hooks/unisol/hrExpense/useHrExpense";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MonthlyCategeoryBreakdown = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { fetchExpensesCategoryBreakdown, expensesCategoryBreakdown, loading } = useHrExpense();

  useEffect(() => {
    fetchExpensesCategoryBreakdown(year, month);
  }, [year, month]);

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

  const routeYear = expensesCategoryBreakdown?.filters?.year || year;
  const displayYear = routeYear || "N/A";
  const displayMonth =
    expensesCategoryBreakdown?.filters?.month ||
    monthNumberToName[Number(month)] ||
    month ||
    "N/A";

  const categoryData =
    expensesCategoryBreakdown?.success !== false && Array.isArray(expensesCategoryBreakdown?.data)
      ? expensesCategoryBreakdown.data
      : [];
  const totalExpense = Number(
    expensesCategoryBreakdown?.totalExpense ??
      categoryData.reduce((sum, row) => sum + Number(row.total || 0), 0)
  );

  const formatCategory = (category) => {
    if (!category) return "N/A";
    const spaced = category.replace(/([A-Z])/g, " $1").trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  const downloadAsPDF = () => {
    if (!categoryData.length) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const marginX = 10;

    pdf.setFontSize(14);
    pdf.text(`Category Wise Expense Report - ${displayMonth} ${displayYear}`, marginX, 15);

    pdf.setFontSize(10);
    pdf.text("Monthly Category Breakdown", marginX, 22);

    const tableColumn = ["Sr No", "Category", "Total Expenses (₹)"];
    const tableRows = categoryData.map((row, index) => [
      index + 1,
      formatCategory(row.category),
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

    pdf.save(`Category_Wise_Expense_Report_${displayMonth}_${displayYear}.pdf`);
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
          { text: `Category Breakdown - ${displayMonth}` },
        ]}
      />

      {/* Header Section */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <FaTags style={{ color: theme.primaryColor, fontSize: 32 }} />
          <div>
            <span className="text-2xl font-bold">Monthly Category Breakdown</span>
            <p className="text-sm text-gray-500 mt-1">
              Year: {displayYear} · Month: {displayMonth}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
                <FaTags className="text-white text-xl" />
                <h2 className="font-bold text-xl text-gray-700">Category Wise Expenses</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-white">
                <div className="px-4 py-1 rounded bg-white/20">
                  <span className="font-semibold">Categories: </span>
                  {categoryData.length}
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
                      <th className="px-4">Category</th>
                      <th className="px-4">Total Expenses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      if (categoryData.length === 0) {
                        return (
                          <tr>
                            <td colSpan={3} className="py-12 text-gray-500 text-lg">
                              <div className="flex flex-col items-center gap-2">
                                <FaTags className="text-gray-300 text-4xl" />
                                <span>No category expense data available.</span>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return categoryData.map((row, index) => (
                        <tr
                          key={`${row.category}-${index}`}
                          onClick={() => {
                            if (routeYear && month && row?.category) {
                              navigate(`/expensesheet/category-monthwise-expense/${encodeURIComponent(routeYear)}/${encodeURIComponent(month)}/${encodeURIComponent(row.category)}`);
                            }
                          }}
                          className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-4 font-medium">
                            {index + 1}
                          </td>
                          <td className="px-4 font-medium text-slate-700">
                            {formatCategory(row.category)}
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
      </section>
    </div>
  );
};

export default MonthlyCategeoryBreakdown;