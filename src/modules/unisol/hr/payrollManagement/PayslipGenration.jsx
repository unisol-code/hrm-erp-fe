import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
// import black from "../../../assets/images/black-Path 2.png";
// import blue from "../../../assets/images/blue-Path 2.png";
import { CiSearch } from "react-icons/ci";
import usePayrollManagement from "../../../../hooks/unisol/payrollManagement/payrollManagement";
import Pagination from "../../../../components/Pagination";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const PayslipGenration = () => {
  const { theme } = useTheme();
  const [slip, slipView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    FetchPayslipGenerationStatusList,
    payslipGenerationStatusList,
    loading,
  } = usePayrollManagement();

  console.log("payslipGenerationStatusList : ", payslipGenerationStatusList);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    FetchPayslipGenerationStatusList(page, limit, searchTerm);
  }, []);
  const onPageChange = (data) => {
    console.log("data", data);
    setPage(data);
    FetchPayslipGenerationStatusList(data, limit, searchTerm);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
    FetchPayslipGenerationStatusList(page, data, searchTerm);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      FetchPayslipGenerationStatusList(page, limit, searchTerm);
    } else {
      console.log("Please enter a search term.");
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Breadcrumb
        linkText={[
          { text: "Payroll Management" },
          { text: "Pay Slip Generation Status" },
        ]}
      />
      <div className="w-full bg-white rounded-2xl overflow-hidden">
        <div
          className="flex flex-wrap rounded-t-xl items-center justify-between gap-4 py-8 px-8"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          {/* Search box */}
          <div className="relative">
            <CiSearch
              onClick={handleSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl cursor-pointer hover:scale-[1.1] transition duration-300 hover:text-black"
            />
            <input
              type="text"
              placeholder="Search by employee name"
              className="h-[40px] rounded-[10px] pl-12 pr-4 py-2 border border-gray-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
        </div>

        {/* Wrap in another div for border radius to apply visually */}
        <div className="overflow-hidden rounded-b-2xl">
          <TableContainer sx={{ maxHeight: 475 }}>
            <Table
              stickyHeader
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, fontSize: "16px" }}
                  >
                    Employee Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, fontSize: "16px" }}
                  >
                    Employee ID
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, fontSize: "16px" }}
                  >
                    Pay Slip Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, fontSize: "16px" }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <div className="flex w-full items-center justify-center">
                        <LoaderSpinner />
                      </div>
                    </TableCell>
                  </TableRow>
                 ) : payslipGenerationStatusList?.data?.employees?.length > 0 ? (
                  payslipGenerationStatusList?.data?.employees?.map((list) => (
                    <TableRow key={list?.empId}>
                      <TableCell align="center">{list?.fullName}</TableCell>
                      <TableCell align="center">{list?.employeeId}</TableCell>
                      <TableCell align="center">
                        <button
                          className={`py-1 px-4 rounded-md ${
                            list?.paySlipStatus === "Generated"
                              ? "text-[#0764E6] bg-[#E6EFFC]"
                              : "text-[#715300] bg-[#FFE9AC]"
                          }`}
                        >
                          {list?.paySlipStatus}
                        </button>
                      </TableCell>
                      <TableCell align="center">
                        <button
                          onClick={() => slipView(true)}
                          className="text-black px-4 py-2 rounded-md"
                          style={{ backgroundColor: theme.secondaryColor }}
                        >
                          Download PaySlip
                        </button>
                        {slip && <PaySlip onClose={() => slipView(false)} />}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <div className="py-4 text-lg font-medium w-full text-center">
                        No Records Found.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {!loading &&
          payslipGenerationStatusList?.data?.employees.length > 0 && (
            <Pagination
              currentPage={
                payslipGenerationStatusList?.data?.pagination?.currentPage
              }
              totalPages={
                payslipGenerationStatusList?.data?.pagination?.totalPages
              }
              totalItems={payslipGenerationStatusList?.data?.pagination?.totalCount}
              itemsPerPage={limit}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          )}
      </div>
    </div>
  );
};

export default PayslipGenration;
