import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PayslipDialog from "../../../../components/Dialogs/paySlip/PayslipDialog";
import { CiSearch } from "react-icons/ci";
import usePayrollManagement from "../../../../hooks/unisol/payrollManagement/payrollManagement";
import Pagination from "../../../../components/Pagination";
import { Box } from "@mui/material";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { useSignIn } from "../../../../hooks/auth/useSignIn";
import { usePermissions } from "../../../../hooks/auth/usePermissions";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { useNavigate } from "react-router-dom";

const EmpList = () => {
  const [view, setView] = useState(false);
  const [payslip, payslipView] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewPayslip, setViewPayslip] = useState(false);
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { hrDetails } = useSignIn();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    hrDetails,
    "Employee List - Pay slip"
  );

  const { theme } = useTheme();
  const {
    FetchEmployeePaySlipList,
    resetEmployeePaySlipDetails,
    employeePaySlipList,
    loading,
  } = usePayrollManagement();

  useEffect(() => {
    FetchEmployeePaySlipList(page, limit, searchTerm);
  }, [page, limit]);

  const handleViewDetails = (id) => {
    setSelectedId(id);
    setView(true);
  };

  const onPageChange = (data) => {
    setPage(data);
    FetchEmployeePaySlipList(data, limit, searchTerm);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
    FetchEmployeePaySlipList(page, data, searchTerm);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    FetchEmployeePaySlipList(1, limit, value);
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[{ text: "Payroll Management" }, { text: "Employee List" }]}
      />

      <div className="w-full bg-white rounded-2xl">
        {/* Heading, Search, Button in one row */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 mt-2 py-4 px-8 rounded-t-xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h1 className="text-[#252C58] text-xl whitespace-nowrap">
            Employee List for Pay Slip
          </h1>
          <div className="flex justify-end">
            <button
              onClick={() => payslipView(true)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.highlightColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = theme.primaryColor)
              }
              className="text-base px-4 py-2 rounded-md text-white hover:text-black border"
              style={{
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor,
              }}
            >
              Payslip Download Options
            </button>
            {payslip && <PayslipDialog onClose={() => payslipView(false)} />}
          </div>
        </div>

        {/* Employee Table */}
        <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
          <TableContainer sx={{ height: 540 }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              className="overflow-y-scroll"
            >
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#374151",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    Sr. No.
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#374151",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    Employee Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#374151",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    Employee ID
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#374151",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    Salary
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#374151",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    Designation
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#374151",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                 {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <div className="flex w-full items-center justify-center">
                        <LoaderSpinner/>
                      </div>
                    </TableCell>
                  </TableRow>
                 ) : employeePaySlipList?.data?.employees?.length > 0 ? (
                 employeePaySlipList?.data?.employees?.map(
                  (employeePaySlip, index) => (
                    <TableRow
                      key={employeePaySlip?._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell align="center">
                        {employeePaySlip?.fullName}
                      </TableCell>
                      <TableCell align="center">
                        {employeePaySlip?.employeeId}
                      </TableCell>
                      <TableCell align="center">
                        {employeePaySlip?.salary || "-"}
                      </TableCell>
                      <TableCell align="center">
                        {employeePaySlip?.designation || "-"}
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex flex-col items-center space-y-2 ">
                          <button
                            onClick={()=>navigate(`/emplist/generatePayslip/${employeePaySlip?._id}`)}
                            className="text-black px-4 py-2 rounded-md"
                            style={{ backgroundColor: theme.secondaryColor }}
                          >
                            Generate Payslip
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                ))
                  : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" className="py-4 text-lg">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {!loading && employeePaySlipList?.data?.employees?.length > 0 && (
            <Pagination
              currentPage={employeePaySlipList?.data?.pagination?.currentPage}
              totalPages={employeePaySlipList?.data?.pagination?.totalPages}
              totalItems={employeePaySlipList?.data?.pagination?.totalCount}
              itemsPerPage={limit}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          )}
        </Box>
      </div>
    </div>
  );
};

export default EmpList;
