/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { RiImageCircleLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import Pagination from "../../../../../components/Pagination";
import useHrExpense from "../../../../../hooks/unisol/hrExpense/useHrExpense";
import { useNavigate } from "react-router-dom";
import useEmployee from "../../../../../hooks/unisol/onboarding/useEmployee";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import Select from "react-select";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const SalesTeam = () => {
  const { fetchSalesExpList, salesList, loading } = useHrExpense();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const { fetchDepartments, departmentDrop } = useEmployee();
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchSalesExpList(1, limit, selectedDepartment?.value || "");
  }, [selectedDepartment]);

  const onPageChange = (data) => {
    setPage(data);
    fetchSalesExpList(data, limit, selectedDepartment?.value || "");
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchSalesExpList(page, data, selectedDepartment?.value || "");
  };

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    setPage(1); // Reset page when department changes
  };

  const handleView = (row) => {
    const id = row?.employee_id;
    navigate(`/expensesheet/expensesheetDetail/${id}`);
  };

  const { theme } = useTheme();

  const departmentOptions =
    departmentDrop?.map((dept) => ({
      label: dept,
      value: dept,
    })) || [];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "0.75rem",
      padding: "0.25rem 0.5rem",
      borderColor: state.isFocused ? "#60a5fa" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(96,165,250,0.3)" : "none",
      "&:hover": { borderColor: "#60a5fa" },
      backgroundColor: "white",
      minHeight: "40px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#60a5fa"
        : state.isFocused
          ? "#e0f2fe"
          : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#60a5fa" : "#e0f2fe",
      },
    }),
  };
  const downloadAsPDF = () => {
  if (!salesList?.data || salesList.data.length === 0) return;

  const pdf = new jsPDF("p", "mm", "a4");

  const marginX = 10;

  // Title
  pdf.setFontSize(14);
  pdf.text("Overall Expense", marginX, 15);

  pdf.setFontSize(10);
  pdf.text("Employee List", marginX, 22);

  const tableColumn = [
    "Sr No",
    "Employee ID",
    "Employee Name",
    "Department",
    "Total Expenses",
  ];

  const tableRows = salesList.data.map((row, index) => [
    index + 1,
    row.employeeId || "N/A",
    row.employeeName || "N/A",
    row.department || "N/A",
    `Rs.${row.totalExpenses || 0}`,
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
    didDrawPage: (data) => {
      pdf.setFontSize(9);
      pdf.text(
        `Page ${pdf.getNumberOfPages()}`,
        pdf.internal.pageSize.getWidth() - 20,
        pdf.internal.pageSize.getHeight() - 10
      );
    },
  });

  pdf.save("Overall_Expense_Report.pdf");
};
return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Expense Management", href: "/expenseApproval" },
          { text: "Overall Expenses" },
        ]}
      />

      {/* Header Section */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <FaUsers style={{ color: theme.primaryColor, fontSize: 32 }} />
          <span className="text-2xl font-bold">Overall Expense</span>
        </div>
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

      <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
        {
          loading ? (<div className="py-4 w-full flex items-center justify-center"><LoaderSpinner /></div>) : (
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
                  <h2 className="font-bold text-xl text-gray-700">Employee List</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="min-w-[180px]">
                      <Select
                        placeholder="Select Department"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        options={departmentOptions}
                        isClearable
                        styles={customStyles}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="w-full p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-center ">
                    <thead>
                      <tr className="font-semibold text-gray-600 h-[50px] border-b-2 border-gray-300">
                        <th className="px-4">Sr No.</th>
                        <th className="px-4">Employee ID</th>
                        <th className="px-4">Employee Name</th>
                        <th className="px-4">Department</th>
                        <th className="px-4">Total Expenses</th>
                        <th className="px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const dataArray = salesList?.data || [];

                        if (dataArray.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="py-12 text-gray-500 text-lg">
                                <div className="flex flex-col items-center gap-2">
                                  <FaUsers className="text-gray-300 text-4xl" />
                                  <span>No employees found.</span>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return dataArray.map((row, index) => (
                          <tr
                            key={index}
                            className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          ><td className="px-4 font-medium">
                              {(page - 1) * limit + index + 1}
                            </td>
                            <td className="px-4 font-medium">
                              {row?.employeeId || "N/A"}
                            </td>
                            <td className="px-4 mr-18">
                              <div className=" flex items-center justify-center ">
                                {/* <RiImageCircleLine
                            size={20}
                            className="text-blue-500"
                          /> */}
                                {row?.photo ? (
                                  <img
                                    src={row.photo}
                                    alt={row.employeeName || "Employee"}
                                    className="h-[40px] w-[40px] rounded-full object-cover mr-1"
                                  // h-[40px] w-[40px] rounded-full object-cover mr-2
                                  />
                                ) : (
                                  <span className="text-slate-400"><RiImageCircleLine
                                    size={25}
                                    className="text-blue-500"
                                  /></span>
                                )}
                                <span className="font-semibold text-slate-700 text-nowrap">
                                  {row?.employeeName || "N/A"}
                                </span>
                              </div>
                            </td>

                            <td className="px-4">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {row?.department || "N/A"}
                              </span>
                            </td>
                            <td className="px-4">
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                ₹{row?.totalExpenses || "0"}
                              </span>
                            </td>
                            <td className="px-4">
                              <Button
                                variant={2}
                                text="View"
                                onClick={() => handleView(row)}
                                className="hover:scale-105 transition-transform duration-200"
                              />
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )
        }

        {/* Pagination */}
        <div className="px-4 py-4">
          {
            !loading && salesList?.data?.length > 0 && (
              <Pagination
                currentPage={salesList?.pagination?.currentPage || 1}
                totalPages={salesList?.pagination?.totalPages || 1}
                totalItems={salesList?.pagination?.total || 0}
                itemsPerPageOptions={limit}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
                showRowPerPage={true}
              />
            )
          }

        </div>
      </section>
    </div>
  );
};

export default SalesTeam;
