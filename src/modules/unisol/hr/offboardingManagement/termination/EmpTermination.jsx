import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from "@mui/material";
import Select from "react-select";

import BreadCrumb from "../../../../../components/BreadCrumb";
import Pagination from "../../../../../components/Pagination";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useSignIn } from "../../../../../hooks/auth/useSignIn.js";
import { usePermissions } from "../../../../../hooks/auth/usePermissions.js";
import useDebounce from "../../../../../hooks/debounce/useDebounce";
import Profile from "../../../../../assets/images/profile-image.png";
import { useRoles } from "../../../../../hooks/auth/useRoles";
import useEmployee from "../../../../../hooks/unisol/onboarding/useEmployee.js";
import useEmpTermination from "../../../../../hooks/unisol/offboardingManagement/useEmpTermination.js";

const EmpTermination = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { fetchDepartments, departmentDrop, designationByDept, fetchDesignation, loading: queryLoading } = useEmployee();
  const { fetchTerminatedEmpsList, terminatedEmpsList, loading: empLoading } = useEmpTermination();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const debouncedSearch = useDebounce(search, 500);
  const { hrDetails } = useSignIn();
  const { canRead } = usePermissions(hrDetails, "Termination");
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : isHR ? "hr" : "employee";

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (departmentDrop?.length > 0) {
      const options = departmentDrop.map((dept) => ({
        value: dept,
        label: dept
      }));
      setDepartmentOptions(options);
    }
  }, [departmentDrop]);

  useEffect(() => {
    if (selectedDepartment) {
      fetchDesignation(selectedDepartment);
    } else {
      setDesignationOptions([]);
      setSelectedDesignation(null);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (designationByDept?.length > 0) {
      const options = designationByDept.map((desig) => ({
        value: desig,
        label: desig
      }));
      setDesignationOptions(options);
    } else {
      setDesignationOptions([]);
    }
  }, [designationByDept]);

  useEffect(() => {
    fetchTerminatedEmpsList({
      page,
      limit,
      debouncedSearch,
      role,
      department: selectedDepartment,
      designation: selectedDesignation
    });
  }, [page, limit, debouncedSearch, selectedDepartment, selectedDesignation]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption?.value || null);
    setSelectedDesignation(null);
    setPage(1);
  };

  const handleDesignationChange = (selectedOption) => {
    setSelectedDesignation(selectedOption?.value || null);
    setPage(1);
  };

  const handleTerminateEmployee = () => {
    navigate("/offboardingManagement/termination/terminate-emp");
  };

  const handleViewClick = (employeeId) => {
    navigate(`/offboardingManagement/termination/emp-wise/${employeeId}`);
  };

  const renderTableRow = (employee, index) => {
    return (
      <TableRow
        key={employee._id}
        sx={{
          "&:hover": {
            backgroundColor: `${theme.primaryColor}08`,
            cursor: "pointer"
          }
        }}
        onClick={() => canRead && handleViewClick(employee.employeeId)}
      >
        <TableCell align="center">
          {(page - 1) * limit + index + 1}
        </TableCell>

        <TableCell align="center">
          <span className="font-medium text-blue-600">
            {employee.employeeId || "-"}
          </span>
        </TableCell>

        <TableCell align="center">
          <div className="flex items-center justify-start gap-3 px-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <img
                src={employee.photo || Profile}
                alt={employee.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Profile;
                }}
              />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">{employee.fullName || "-"}</p>
              <p className="text-sm text-gray-500">{employee.email || ""}</p>
            </div>
          </div>
        </TableCell>

        <TableCell align="center">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            {employee.department || "-"}
          </span>
        </TableCell>

        <TableCell align="center">
          <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm">
            {employee.designation || "-"}
          </span>
        </TableCell>

        <TableCell align="center">
          <span className="font-semibold">
            {employee.requestCount || 0}
          </span>
        </TableCell>

        {/* <TableCell align="center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${employee.settlementStatus === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : employee.settlementStatus === "Completed"
                ? "bg-green-100 text-green-800"
                : employee.settlementStatus === "In Progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
          >
            {employee.settlementStatus || "Pending"}
          </span>
        </TableCell> */}

        <TableCell align="center">
          <button
            aria-label="View"
            title={canRead ? "View Details" : "No permission to view"}
            className={`p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200 ${!canRead ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={!canRead}
            style={{ color: theme.primaryColor }}
            onClick={(e) => {
              e.stopPropagation();
              handleViewClick(employee.employeeId);
            }}
          >
            <Eye size={20} />
          </button>
        </TableCell>
      </TableRow>
    );
  };

  const renderTableBody = () => {
    if (empLoading) {
      return (
        <TableRow>
          <TableCell colSpan={9} sx={{ py: 8 }}>
            <div className="flex justify-center items-center min-h-[200px]">
              <LoaderSpinner size={40} />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (!terminatedEmpsList?.data?.length) {
      return (
        <TableRow>
          <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FaSearch className="text-gray-400 text-2xl" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 font-medium text-lg mb-1">
                  No termination records found
                </p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return terminatedEmpsList.data.map(renderTableRow);
  };

  return (
    <div className="min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Offboarding Management", path: "/offboardingManagement" },
          { text: "Employee Termination" }
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div
          className="p-6 border-b border-gray-200"
          style={{ backgroundColor: theme.secondaryColor || "#f8fafc" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Title */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Terminated <br /> Employees</h1>
            </div>

            {/* Search and Filters */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[280px]">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by ID, Name..."
                    className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 transition-all duration-200 bg-white"
                    style={{
                      minHeight: '48px',
                      borderColor: search ? theme.primaryColor : '#D1D5DB',
                      '--tw-ring-color': theme.primaryColor
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <Select
                  name="department"
                  placeholder="Department"
                  isLoading={queryLoading}
                  options={departmentOptions}
                  classNamePrefix="react-select"
                  isClearable
                  value={departmentOptions.find(option => option.value === selectedDepartment) || null}
                  onChange={handleDepartmentChange}
                  className="w-full"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: state.isFocused ? theme.primaryColor : '#D1D5DB',
                      borderWidth: '1px',
                      boxShadow: state.isFocused ? `0 0 0 1px ${theme.primaryColor}` : 'none',
                      minHeight: '48px',
                      '&:hover': {
                        borderColor: theme.primaryColor
                      }
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#9CA3AF'
                    })
                  }}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <Select
                  name="designation"
                  placeholder="Designation"
                  isLoading={queryLoading}
                  options={designationOptions}
                  classNamePrefix="react-select"
                  isClearable
                  isDisabled={!selectedDepartment}
                  value={designationOptions.find(option => option.value === selectedDesignation) || null}
                  onChange={handleDesignationChange}
                  className="w-full"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: state.isFocused ? theme.primaryColor : '#D1D5DB',
                      borderWidth: '1px',
                      boxShadow: state.isFocused ? `0 0 0 1px ${theme.primaryColor}` : 'none',
                      minHeight: '48px',
                      backgroundColor: !selectedDepartment ? '#F9FAFB' : 'white',
                      '&:hover': {
                        borderColor: theme.primaryColor
                      }
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: !selectedDepartment ? '#9CA3AF' : '#9CA3AF'
                    })
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={handleTerminateEmployee}
                className="px-6 py-3 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap min-h-[48px] flex items-center justify-center"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Terminate Employee
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Box className="overflow-x-auto">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  {[
                    "Sr. No.",
                    "Employee ID",
                    "Employee Name",
                    "Department",
                    "Designation",
                    "Request Count",
                    "Action"
                  ].map((head) => (
                    <TableCell
                      key={head}
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: "#374151",
                        borderBottom: "2px solid #e5e7eb",
                        padding: "16px"
                      }}
                    >
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
        {!empLoading && terminatedEmpsList?.data?.length > 0 && (
          <div className="border-t border-gray-200">
            <Pagination
              currentPage={terminatedEmpsList?.pagination?.page || 1}
              totalPages={terminatedEmpsList?.pagination?.totalPages || 1}
              totalItems={terminatedEmpsList?.pagination?.total || 0}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpTermination;