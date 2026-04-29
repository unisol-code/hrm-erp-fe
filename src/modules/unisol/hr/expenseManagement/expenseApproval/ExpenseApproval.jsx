import { useNavigate } from "react-router-dom";
import Pagination from "../../../../../components/Pagination";
import { useEffect, useState } from "react";
import { RiImageCircleLine } from "react-icons/ri";
import useExpenseApproval from "../../../../../hooks/unisol/expense/useExpenseApproval";
import { debounce } from "lodash";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import Select from "react-select";
import useEmployee from "../../../../../hooks/unisol/onboarding/useEmployee";
import { FaFileInvoice, FaSearch, FaFilter } from "react-icons/fa";
import { useRoles } from "../../../../../hooks/auth/useRoles";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const ExpenseApproval = () => {
  const {
    fetchEmpApprovalList,
    empApprovalList,
    loading,
    fetchEmployeeExpenseById,
  } = useExpenseApproval();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  console.log("empApprovalList", empApprovalList);
  console.log("empApprovalList type:", typeof empApprovalList);
  console.log("empApprovalList isArray:", Array.isArray(empApprovalList));
  const [empName, setEmpName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : "hr";

  const {
    departmentDrop,
    employeeByDept,
    fetchDepartments,
    fetchEmployeeByDept,
  } = useEmployee();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchEmployeeByDept(selectedDepartment.value);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    fetchEmpApprovalList(
      page,
      limit,
      selectedDepartment?.value,
      selectedCandidate?.value,
      role
    );

  }, [selectedDepartment, selectedCandidate, page, limit]);
  console.log("empApprovalList", empApprovalList);

  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };

  const handleView = (row) => {
    const id = row?.employee_id;
    // fetchEmployeeExpenseById(id);
    navigate(`/expenseApproval/expense-sheet-2/${id}`);
  };

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    setSelectedCandidate(null);
    setPage(1); // Reset page when department changes
  };

  const handleCandidateChange = (selectedOption) => {
    setSelectedCandidate(selectedOption);
    setPage(1); // Reset page when candidate changes
  };

  const { theme } = useTheme();

  const departmentOptions =
    departmentDrop?.map((dept) => ({
      label: dept,
      value: dept,
    })) || [];

  const candidateOptions =
    (Array.isArray(employeeByDept)
      ? employeeByDept
      : employeeByDept?.employees || employeeByDept?.data || []
    )?.map((emp) => ({
      label: emp.fullName || emp.name || emp.employeeName,
      value: emp.fullName || emp.name || emp.employeeName,
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

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Expense Management" },
          { text: "Expense Approval" },
        ]}
      />

      {/* Header Section */}
      <div className="w-full mb-4 rounded-2xl bg-white shadow-lg px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Left section: Icon + Title */}
          <div className="flex items-center gap-3">
            <FaFileInvoice
              style={{ color: theme.primaryColor, fontSize: 32 }}
            />
            <span className="text-2xl font-bold">
              Expense Approval Management
            </span>
          </div>

          {/* Right section: Button */}
         
        </div>
      </div>


      <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
        {/* Section Header - Gradient, Icon, Title */}
        <div
          className="w-full h-[60px] flex items-center justify-between px-8 bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff]"
          style={{
            background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
          }}
        >
          <div className="flex items-center gap-3">
            <FaFileInvoice className="text-white text-xl" />
            <h2 className="font-bold text-xl text-gray-700">Approval List</h2>
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

            <div className="min-w-[180px]">
              <Select
                placeholder="Select Employee"
                value={selectedCandidate}
                onChange={handleCandidateChange}
                options={candidateOptions}
                isClearable
                isDisabled={!selectedDepartment}
                styles={customStyles}
                className="text-sm"
              />
            </div>
            {/* <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name"
                value={empName}
                onChange={handleSearchEmpName}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-600 transition w-64 shadow-sm"
              />
            </div> */}
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="font-semibold text-gray-600 h-[50px] border-b-2 border-gray-300">
                   <th className="px-4">Sr No.</th>
                  <th className="px-4">Employee Id</th>
                  <th className="px-4">Employee Name</th>
                  <th className="px-4">Department</th>
                  <th className="px-4">Expense Category</th>
                  <th className="px-4">Pending Expense</th>
                  {/* <th className="px-4">Date</th> */}
                  <th className="px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="py-4 w-full flex items-center justify-center"><LoaderSpinner /></div>
                    </td>
                  </tr>
                ) : (() => {
                  let dataArray = [];

                  if (Array.isArray(empApprovalList)) {
                    dataArray = empApprovalList;
                  } else if (
                    empApprovalList &&
                    typeof empApprovalList === "object" &&
                    empApprovalList.data
                  ) {
                    dataArray = Array.isArray(empApprovalList.data)
                      ? empApprovalList.data
                      : [];
                  }

                  if (!Array.isArray(dataArray)) {
                    console.warn("dataArray is not an array:", dataArray);
                    dataArray = [];
                  }

                  if (dataArray.length === 0) {
                    return (
                      <tr>
                        <td colSpan={7} className="py-12 text-gray-500 text-lg">
                          <div className="flex flex-col items-center gap-2">
                            <FaFileInvoice className="text-gray-300 text-4xl" />
                            <span>No expense approvals found.</span>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return dataArray.map((row, index) => (
                    <tr
                      key={index}
                      className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 font-medium">
                              {(page - 1) * limit + index + 1}
                            </td>
                      <td className="px-4 font-medium">
                        {row?.employeeId || "N/A"}
                      </td>
                      <td className="px-4">
                        <div className="flex items-center justify-start gap-2">
                          {row?.photo ? (
                            <img
                              src={row.photo}
                              alt={row.employeeName || "Employee"}
                              className="h-[40px] w-[40px] rounded-full object-cover"
                            // h-[40px] w-[40px] rounded-full object-cover mr-2
                            />
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                          <span className="font-semibold text-slate-700 ">
                            {row?.employeeName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 items-center justify-center">{row?.department || "N/A"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2 items-start justify-center max-w-md mx-auto">
                          {row?.expensesCategory?.map((cat, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium whitespace-nowrap"
                            >
                              {cat || "N/A"}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4">
                        <span className="px-3 py-1 bg-yellow-100 text-green-800 rounded-full text-sm font-medium">
                          {row?.pendingExpenseCount ?? "N/A"}
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
                })()
                }
              </tbody>

            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 ">
          {
            !loading && empApprovalList?.data?.length > 0 && (
              <Pagination
                currentPage={empApprovalList?.pagination?.currentPage}
                totalPages={empApprovalList?.pagination?.totalPages}
                totalItems={empApprovalList?.pagination?.total}
                itemsPerPageOptions={[limit]}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
              />
            )
          }

        </div>
      </section>
    </div>
  );
};

export default ExpenseApproval;
