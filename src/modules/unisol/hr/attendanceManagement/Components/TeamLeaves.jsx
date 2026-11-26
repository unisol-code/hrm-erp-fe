import { useEffect, useState } from "react";
import { MdPending } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import Pagination from "../../../../../components/Pagination";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useAttendence from "../../../../../hooks/unisol/attendence/useAttendence";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB");
};

const getStatusBadge = (status) => {
  const value = status?.toLowerCase();
  let classes = "bg-gray-100 text-gray-600";

  if (value === "pending")
    classes = "bg-yellow-50 text-yellow-600";
  else if (value === "reject" || value === "rejected")
    classes = "bg-red-50 text-red-600";
  else if (value === "approve" || value === "approved")
    classes = "bg-green-50 text-green-600";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${classes}`}>
      {value || "N/A"}
    </span>
  );
};

const TeamLeaves = () => {
  const { theme } = useTheme();
  const {
    getTeamLeaves,
    teamLeaves,
    loading,
    approveLeave,
    rejectLeave,
  } = useAttendence();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState({});

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    getTeamLeaves({ page, limit });
  }, [page, limit]);

  /* ---------------- Handlers ---------------- */
  const handleApprove = async (id) => {
    setIsSubmitting((prev) => ({ ...prev, [id]: true }));
    try {
      await approveLeave(id);
      getTeamLeaves({ page, limit });
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error("Team leave approve error:", error);
      toast.error("Failed to approve leave");
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    setIsSubmitting((prev) => ({ ...prev, [id]: true }));
    try {
      await rejectLeave(id);
      getTeamLeaves({ page, limit });
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error("Team leave reject error:", error);
      toast.error("Failed to reject leave");
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const leaves = teamLeaves?.leaves || [];
  const pagination = teamLeaves?.pagination || {};

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-4 border-b"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Team Leaves</h1>
              <p className="text-gray-600">
                View and manage team leave applications
              </p>
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
                    "Photo",
                    "Employee",
                    "Leave Type",
                    "From Date",
                    "To Date",
                    "Total Days",
                    "Status",
                    "Reason",
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                      <div className="flex justify-center items-center min-h-[200px]">
                        <LoaderSpinner />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : leaves.length ? (
                  leaves.map((leave, index) => (
                    <TableRow
                      key={leave._id || leave.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: `${theme.primaryColor}08`,
                        },
                      }}
                    >
                      <TableCell align="center">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>

                      <TableCell align="center">
                        {leave.photo ? (
                          <img
                            src={leave.photo}
                            alt={leave.employeeName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500">
                              {leave.employeeName?.charAt(0) || "U"}
                            </span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        <div className="text-left">
                          <p className="font-medium">
                            {leave.employeeName || "-"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {leave.employeeId || "-"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell align="center">
                        {leave.leaveType || "-"}
                      </TableCell>

                      <TableCell align="center">
                        {formatDate(leave.startDate)}
                      </TableCell>

                      <TableCell align="center">
                        {formatDate(leave.endDate)}
                      </TableCell>

                      <TableCell align="center">
                        {leave.totalDays || "-"}
                      </TableCell>

                      <TableCell align="center">
                        {getStatusBadge(leave.status)}
                      </TableCell>

                      <TableCell align="center">
                        <span className="text-gray-600 text-sm">
                          {leave.reason || "—"}
                        </span>
                      </TableCell>

                      <TableCell align="center">
                        {leave.status?.toLowerCase() === "pending" ? (
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => handleApprove(leave._id)}
                              disabled={isSubmitting[leave._id]}
                              className={`p-2 rounded-full hover:bg-green-100 hover:scale-105 transition-all duration-200 ${isSubmitting[leave._id] ? "opacity-50 cursor-not-allowed" : ""}`}
                              style={{ color: theme.primaryColor }}
                              title="Approve"
                            >
                              {isSubmitting[leave._id] ? (
                                <span className="text-[10px]">...</span>
                              ) : (
                                <IoMdCheckmarkCircleOutline size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(leave._id)}
                              disabled={isSubmitting[leave._id]}
                              className={`p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200 ${isSubmitting[leave._id] ? "opacity-50 cursor-not-allowed" : ""}`}
                              style={{ color: theme.primaryColor }}
                              title="Reject"
                            >
                              {isSubmitting[leave._id] ? (
                                <span className="text-[10px]">...</span>
                              ) : (
                                <IoMdClose size={18} />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                      <div className="flex flex-col items-center gap-3">
                        <MdPending className="text-gray-400 text-2xl" />
                        <p className="text-gray-500 font-medium">
                          No team leave requests found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Pagination */}
        {!loading && leaves.length > 0 && (
          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            totalItems={pagination?.totalCount || pagination?.totalItems || 0}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default TeamLeaves;
