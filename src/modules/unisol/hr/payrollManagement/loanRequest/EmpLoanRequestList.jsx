import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSearch } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from "@mui/material";

import Breadcrumb from "../../../../../components/BreadCrumb";
import Pagination from "../../../../../components/Pagination";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

import { useTheme } from "../../../../../hooks/theme/useTheme";
import useDebounce from "../../../../../hooks/debounce/useDebounce";
import useAdminLoanRequest from "../../../../../hooks/unisol/loanRequest/useAdminLoanRequest";
import { useRoles } from "../../../../../hooks/auth/useRoles";

import Profile from "../../../../../assets/images/profile-image.png";
import { Eye } from "lucide-react";
import { usePermissions } from "../../../../../hooks/auth/usePermissions";
import { useSignIn } from "../../../../../hooks/auth/useSignIn";

const EmpLoanRequestList = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();  

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const debouncedSearch = useDebounce(search, 500);
  const { hrDetails } = useSignIn();
  const { canRead } = usePermissions(
    hrDetails,
    "Loan Request"
  );
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : isHR ? "hr" : "employee";

  const {
    fetchEmpLoanReqListToAdmin,
    forAdminEmpLoanRequestList,
    loading
  } = useAdminLoanRequest();

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    fetchEmpLoanReqListToAdmin(page, limit, debouncedSearch, role);
  }, [page, limit, debouncedSearch, role, selectedEmployee]);

  /* ---------------- Handlers ---------------- */
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleViewClick = (employeeId) => {
    navigate(`/emp_loan_RequestList/per_Emp_Loan_Request/${employeeId}`);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedEmployee(null);
    setPage(1);
  };

  /* ---------------- Utils ---------------- */
  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  /* ---------------- Render Rows ---------------- */
  const renderTableRow = (employee, index) => {
    const requestAmount = employee.totalRequestAmount || 0;

    return (
      <TableRow
        key={employee._id}
        sx={{
          "&:hover": { backgroundColor: `${theme.primaryColor}08` }
        }}
      >
        <TableCell align="center">
          {(page - 1) * limit + index + 1}
        </TableCell>

        <TableCell align="center">
          {employee.employeeId}
        </TableCell>

        <TableCell align="center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border">
              <img
                src={employee.photo || Profile}
                alt={employee.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-medium">{employee.fullName}</p>
            </div>
          </div>
        </TableCell>

        <TableCell align="center">
          <a
            href={`mailto:${employee.email}`}
            className="text-blue-600 hover:underline"
          >
            {employee.email}
          </a>
        </TableCell>

        <TableCell align="center">
          {employee.department || "-"}
        </TableCell>

        <TableCell align="center">
          <span
            className={`px-3 py-1 rounded-full text-sm ${employee.loanCount > 0
              ? "bg-yellow-100 text-red-800"
              : "bg-gray-100 text-gray-800"
              }`}
          >
            {employee.loanCount || 0}
          </span>
        </TableCell>

        <TableCell align="center">
          <span
            className={`px-3 py-1 rounded-full text-sm ${employee.pendingNillLoanRequests > 0
              ? "bg-yellow-100 text-red-800"
              : "bg-gray-100 text-gray-800"
              }`}
          >
            {employee.pendingNillLoanRequests || 0}
          </span>
        </TableCell>

        <TableCell align="center">
          <button
            aria-label="View"
            title={canRead ? "View" : "No permission"}
            className={`p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200 ${!canRead ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={!canRead}
            style={{ color: theme.primaryColor }}
            onClick={() => handleViewClick(employee.employeeId)}
          >
            <Eye size={20} />
          </button>
        </TableCell>
      </TableRow>
    );
  };

  /* ---------------- Render Body ---------------- */
  const renderTableBody = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} sx={{ py: 8 }}>
            <div className="flex justify-center items-center min-h-[200px]">
              <LoaderSpinner />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (!forAdminEmpLoanRequestList?.data?.length) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
            <div className="flex flex-col items-center gap-3">
              <FaSearch className="text-gray-400 text-2xl" />
              <p className="text-gray-500 font-medium">
                No employee loan requests found
              </p>
              {(search || selectedEmployee) && (
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return forAdminEmpLoanRequestList.data.map(renderTableRow);
  };

  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Loan Management" },
          { text: "Employee Loan Requests" }
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-4 border-b"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Left side: Title */}
            <div>
              <h1 className="text-2xl font-bold">Employee Loan Requests</h1>
              <p className="text-gray-600">
                View and manage loan applications from employees
              </p>
            </div>

            {/* Right side: Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name"
                className="pl-12 pr-4 py-3 border rounded-md w-full sm:w-72 transition-colors duration-200 focus:outline-none focus:ring-1"
                style={{
                  borderColor: theme.primaryColor,
                  borderWidth: '1px',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 1px ${theme.primaryColor}`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  {[
                    "Sr. No.",
                    "Employee ID",
                    "Employee Name",
                    "Email",
                    "Department",
                    "Pending Loan Request Count",
                    "Pending Nil Amt Request Count",
                    "Action"
                  ].map((head) => (
                    <TableCell key={head} align="center" sx={{ fontWeight: "bold" }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Pagination */}
        {!loading && forAdminEmpLoanRequestList?.data?.length > 0 && (
          <Pagination
            currentPage={forAdminEmpLoanRequestList?.pagination?.page || 1}
            totalPages={forAdminEmpLoanRequestList?.pagination?.totalPages || 1}
            totalItems={forAdminEmpLoanRequestList?.pagination?.total || 0}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default EmpLoanRequestList;
