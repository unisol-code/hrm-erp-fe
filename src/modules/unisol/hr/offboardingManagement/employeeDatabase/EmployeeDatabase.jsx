import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import Select from "react-select";
import BreadCrumb from "../../../../../components/BreadCrumb";
import Pagination from "../../../../../components/Pagination";
import Profile from "../../../../../assets/images/profile-image.png";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import useEmployee from "../../../../../hooks/unisol/onboarding/useEmployee";
import useExEmpDB from "../../../../../hooks/unisol/offboardingManagement/useExEmpDB";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import useDebounce from "../../../../../hooks/debounce/useDebounce";

const EmployeeDatabase = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const {
    departmentDrop,
    fetchDepartments,
    fetchDesignation,
    designationByDept,
  } = useEmployee();

  const { loading, inActiveEmpList, fetchInactiveEmpDB } = useExEmpDB();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchInactiveEmpDB({
      page,
      limit,
      debouncedSearch,
      department,
      designation,
    });
  }, [page, limit, debouncedSearch, department, designation]);

  useEffect(() => {
    if (department) {
      fetchDesignation(department);
    }
  }, [department]);

  const departmentOptions =
    departmentDrop?.map((dept) => ({
      value: dept,
      label: dept,
    })) || [];

  const designationOptions =
    designationByDept?.map((desig) => ({
      value: desig,
      label: desig,
    })) || [];

  const selectStyles = (theme) => ({
    control: (base) => ({
      ...base,
      minHeight: "48px",
      borderRadius: "6px",
      borderColor: theme.primaryColor,
      boxShadow: "none",
      "&:hover": {
        borderColor: theme.primaryColor,
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 12px",
    }),
    indicatorSeparator: () => ({ display: "none" }),
  });

  const employeeData = inActiveEmpList?.data || [];

  const handlePageChange = (newPage) => setPage(newPage);
  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const renderTableRow = (employee, index) => (
    <TableRow
      key={employee.employeeId}
      sx={{ "&:hover": { backgroundColor: `${theme.primaryColor}08` } }}
    >
      <TableCell align="center">
        {(page - 1) * limit + index + 1}
      </TableCell>

      <TableCell align="center">{employee.employeeId}</TableCell>

      <TableCell align="center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border">
            <img
              src={employee.photo || Profile}
              alt={employee.employeeName}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-medium">{employee.employeeName}</p>
        </div>
      </TableCell>

      <TableCell align="center">{employee.department}</TableCell>
      <TableCell align="center">{employee.designation}</TableCell>
      <TableCell align="center">{employee.joiningDate}</TableCell>
      <TableCell align="center">{employee.relievingDate}</TableCell>

      <TableCell align="center">
        <button
          className="p-2 rounded-full hover:bg-yellow-100"
          style={{ color: theme.primaryColor }}
          onClick={() =>
            navigate(
              `/offboardingManagement/employeeDatabase/view/${employee?._id}`
            )
          }
        >
          <Eye size={20} />
        </button>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Employee Management" },
          { text: "Employee Database" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div
          className="p-6 border-b"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Employee Database</h1>
              <p className="text-gray-600">
                View all inactive employees
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name"
                  className="pl-12 pr-4 py-3 border rounded-md w-60"
                  style={{ borderColor: theme.primaryColor }}
                />
              </div>

              <div className="w-52">
                <Select
                  options={departmentOptions}
                  placeholder="Select department"
                  styles={selectStyles(theme)}
                  value={departmentOptions.find(
                    (opt) => opt.value === department
                  )}
                  onChange={(selected) => {
                    setDepartment(selected?.value || "");
                    setDesignation("");
                  }}
                  isClearable
                />
              </div>

              <div className="w-60">
                <Select
                  options={designationOptions}
                  placeholder="Select designation"
                  styles={selectStyles(theme)}
                  value={designationOptions.find(
                    (opt) => opt.value === designation
                  )}
                  onChange={(selected) =>
                    setDesignation(selected?.value || "")
                  }
                  isClearable
                />
              </div>
            </div>
          </div>
        </div>

        <Box>
          {loading ? (
            <div className="w-full py-4 flex justify-center"><LoaderSpinner /></div>
          ) : (
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
                      "Joining Date",
                      "Relieving Date",
                      "Action",
                    ].map((head) => (
                      <TableCell
                        key={head}
                        align="center"
                        sx={{ fontWeight: "bold" }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {employeeData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        No employee records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    employeeData.map(renderTableRow)
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* Pagination */}
        {employeeData.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={inActiveEmpList?.pagination?.totalPages || 1}
            totalItems={inActiveEmpList?.pagination?.total || 0}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeDatabase;
