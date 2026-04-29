/* eslint-disable no-unused-vars */
import { useEffect, useCallback, useState } from "react";
import { Formik, Field, Form, useFormik } from "formik";
import * as Yup from "yup";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import UploadDocumentDialog from "../../../components/Dialogs/UploadDocumentDialog";
import useEmployee from "../../../hooks/unisol/onboarding/useEmployee";
import debounce from "lodash/debounce";
import ViewUploadedDialog from "../../../components/Dialogs/ViewUploadedDialog";
import useEmployeeDoc from "../../../hooks/unisol/onboarding/useEmployeeDoc";
import Pagination from "../../../components/Pagination";
import { Box } from "@mui/material";
import Breadcrumb from "../../../components/BreadCrumb";
import { useTheme } from "../../../hooks/theme/useTheme";
import Button from "../../../components/Button";
import LoaderSpinner from "../../../components/LoaderSpinner";

const columns = [
  { id: "srNo.", label: "Sr. No.", minWidth: 170, align: "center" },
  { id: "fullName", label: "Full Name", minWidth: 170, align: "center" },
  { id: "designation", label: "Designation", minWidth: 170, align: "center" },
  { id: "assignTo", label: "Assign To", minWidth: 170, align: "center" },
  { id: "documentsSubmitted", label: "Status", minWidth: 170, align: "center" },
  { id: "action", label: "Action", minWidth: 170, align: "center" },
];

const EmployeesList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { fetchAllEmployees, fetchSearchEmployees, employee, loading } =
    useEmployee();
  const { fetchDocsByEmpID, docsByEmpID } = useEmployeeDoc();
  const { theme } = useTheme();
  console.log("employee", employee);
  const { resetEmpDoc } = useEmployeeDoc();
  useEffect(() => {
    fetchAllEmployees(page, limit);
    // fetchSearchEmployees({})
  }, [page, limit]);

  const debouncedSearch = useCallback(
    debounce((values) => {
      if (values.fullName) {
        fetchSearchEmployees(values);
      } else {
        fetchAllEmployees(page, limit);
      }
    }, 500),
    []
  );

  const formik = useFormik({
    initialValues: {
      fullName: "",
    },
    onSubmit: (values) => {
      if (values.fullName) {
        fetchSearchEmployees(values);
      } else {
        fetchAllEmployees(page, limit);
      }
    },
  });

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setPage(1);
    formik.setFieldValue("fullName", value);
    debouncedSearch({ fullName: value });
  };

  const handleUploadDocument = (employee) => {
    console.log("employee handleUploadDocument", employee);
    fetchDocsByEmpID(employee?._id);
    setOpenDocumentDialog(true);
    setSelectedEmployee(employee?._id);
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };
  return (
    <div className="w-full min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Onboarding Management", href: "/createEmployee" },
          { text: "Documents Uploads", href: "/createEmployee" },
        ]}
      />
      <div className="bg-white rounded-2xl">
        <div
          className="flex flex-wrap items-center justify-between gap-4 mt-2 py-4 px-8 rounded-t-xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h2 className="text-[#252C58] text-xl whitespace-nowrap">
            Status of Candidate Document Submissions
          </h2>
          <div className="relative">
            <input
              className="h-[40px] rounded-[10px]  pl-3 pr-4 py-2 border border-gray-500 outline-none"
              type="text"
              value={formik.values.fullName}
              onChange={handleSearchChange}
              placeholder="Quick search"
            />
          </div>
        </div>
        <Box
          sx={{ borderRadius: 2, overflow: "hidden", backgroundColor: "white" }}
        >
          <TableContainer sx={{ maxHeight: 540 }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              className="overflow-y-scroll"
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <div className="flex items-center justify-center w-full">
                        <LoaderSpinner />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  employee?.employees?.map((employee, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={employee.id || index}
                      >
                        <TableCell align="center">
                          {(page - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell align="center">
                          {employee?.fullName}
                        </TableCell>
                        <TableCell align="center">
                          {employee?.designation || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {employee?.department || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {employee?.documentsSubmitted
                            ? "Documents Submitted"
                            : "Documents Pending"}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              variant={2}
                              onClick={() => handleUploadDocument(employee)}
                              text="View Document"
                            />
                            {openDocumentDialog &&
                              selectedEmployee === employee?._id &&
                              docsByEmpID && (
                                <ViewUploadedDialog
                                  closeDialog={() => {
                                    setSelectedEmployee(null);
                                    resetEmpDoc();
                                    setOpenDocumentDialog(false);
                                  }}
                                  openDialog={openDocumentDialog}
                                  docsByEmpID={docsByEmpID}
                                ></ViewUploadedDialog>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {!loading && employee?.employees?.length > 0 && (
          <Pagination
            currentPage={employee?.pagination?.currentPage}
            totalPages={employee?.pagination?.totalPages}
            totalItems={employee?.pagination?.totalCount}
            itemsPerPage={limit}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeesList;
