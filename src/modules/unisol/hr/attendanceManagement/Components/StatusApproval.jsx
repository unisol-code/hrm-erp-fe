import { useEffect, useState } from "react";
import { IoMdClose, IoMdCheckmarkCircleOutline, IoMdCreate, IoMdEye } from "react-icons/io";
import { MdPending } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useAttendence from "../../../../../hooks/unisol/attendence/useAttendence";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const formatDateInput = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB");
};

const StatusAndApproval = () => {
    const { empId } = useParams();
    const { theme } = useTheme();
    const isSuperAdmin = sessionStorage.getItem("isSuperAdminLogin") === "true";

    const {
        getEmployeeLeaveStatusAndApproval,
        employeeLeaveStatusAndApproval,
        loading,
        getLeaveDetailsById,
        editAnyEmployeeLeave,
        leaveDetailsById,
    } = useAttendence();

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        if (empId) {
            getEmployeeLeaveStatusAndApproval(empId, selectedYear);
        }
    }, [empId, selectedYear]);

    const handleView = async (id) => {
        await getLeaveDetailsById(id);
        setViewOpen(true);
    };

    const handleEdit = async (id) => {
        const res = await getLeaveDetailsById(id);
        const data = res?.data ?? res;
        setEditData(data);
        setEditOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editData) return;
        setEditLoading(true);
        const payload = {
            fromDate: editData.fromDate,
            toDate: editData.toDate,
            reason: editData.reason,
        };
        await editAnyEmployeeLeave(editData._id, payload);
        setEditLoading(false);
        setEditOpen(false);
        setEditData(null);
        if (empId) {
            getEmployeeLeaveStatusAndApproval(empId, selectedYear);
        }
        toast.success("Leave updated successfully");
    };

    const leaveForView = leaveDetailsById;

    const statusBadge = (status) => {
        if (status === "Pending") return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium"><MdPending className="w-3 h-3" /> Pending</span>;
        if (status === "Approve") return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium"><IoMdCheckmarkCircleOutline className="w-3 h-3" /> Approved</span>;
        if (status === "Reject") return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium"><IoMdClose className="w-3 h-3" /> Rejected</span>;
        return <span className="text-xs font-medium text-gray-600">{status}</span>;
    };

    return (
        <div className="w-full rounded-2xl mt-4 h-[570px] bg-white shadow-md">
            {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <LoaderSpinner />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden">
                    
                {/* Header */}
                <div
                    className="py-4 px-8 flex items-center justify-between gap-4"
                    style={{ backgroundColor: theme.secondaryColor }}
                >
                    <div className="flex flex-col">
                        <h1 className="text-black/80 text-lg font-semibold">
                            Status & Approval
                        </h1>

                        <p className="text-sm text-gray-600 font-medium mt-0.5">
                            Employee: {employeeLeaveStatusAndApproval?.[0]?.employeeName || "Employee"}
                        </p>
                    </div>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2"
                        style={{ "--tw-ring-color": theme.primaryColor }}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Table Section */}
                <div className="flex-1 overflow-y-auto">
                    {employeeLeaveStatusAndApproval?.length > 0 ? (
                        <table className="min-w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-100 text-gray-700 shadow-sm">
                                <tr>
                                    <th className="font-semibold px-4 py-3">Leave Date</th>
                                    <th className="font-semibold px-4 py-3">Leave Type</th>
                                    <th className="font-semibold px-4 py-3">Reason</th>
                                    <th className="font-semibold px-4 py-3">Status</th>
                                    {isSuperAdmin && (
                                        <th className="font-semibold px-4 py-3">Action</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {employeeLeaveStatusAndApproval.map((leave) => (
                                    <tr
                                        key={leave._id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {formatDateDisplay(leave.startDate)} –{" "}
                                            {formatDateDisplay(leave.endDate)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{leave.leaveType}</td>
                                        <td className="px-4 py-3 text-gray-600 line-clamp-1 max-w-[200px]">{leave.reason}</td>
                                        <td className="px-4 py-3">
                                            {leave.status === "Approve" ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                                                    <IoMdCheckmarkCircleOutline className="text-lg" />
                                                    Approved
                                                </span>
                                            ) : leave.status === "Reject" ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 font-medium">
                                                  <IoMdClose className="text-lg"/>
                                                  Rejected
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 font-medium">
                                                <MdPending className="text-lg"/>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        {isSuperAdmin && (
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(leave._id);
                                                        }}
                                                        className="p-2 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                                                        title="Edit"
                                                    >
                                                        <IoMdCreate className="text-lg" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleView(leave._id);
                                                        }}
                                                        className="p-2 rounded-md text-green-600 hover:bg-green-50 hover:text-green-800 transition"
                                                        title="View"
                                                    >
                                                        <IoMdEye className="text-lg" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 text-xl font-medium">
                            <p>No leave requests found.</p>
                        </div>
                    )}
                </div>
                </div>
            )}

            {/* View Dialog */}
            <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
                <div
                    className="flex items-center justify-between px-4 py-3 rounded-t-md relative"
                    style={{ backgroundColor: theme.secondaryColor }}
                >
                    <h2 className="text-lg font-semibold">Leave Details</h2>
                    <button
                        onClick={() => setViewOpen(false)}
                        className="text-white hover:text-gray-200 transition"
                        title="Close"
                    >
                        <IoMdClose className="text-2xl" />
                    </button>
                </div>
                <DialogContent dividers className="p-4 space-y-4">
                    {leaveForView ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">Leave ID</span>
                                    <span className="text-sm font-medium text-gray-800">{leaveForView._id}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                                    {statusBadge(leaveForView.status)}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">Employee</span>
                                    <span className="text-sm font-medium text-gray-800">
                                        {leaveForView.employee?.fullName} ({leaveForView.employee?.employeeId})
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">Department</span>
                                    <span className="text-sm font-medium text-gray-800">{leaveForView.employee?.department}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">Designation</span>
                                    <span className="text-sm font-medium text-gray-800">{leaveForView.employee?.designation}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">Leave Type</span>
                                    <span className="text-sm font-medium text-gray-800">{leaveForView.leaveType}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">From Date</span>
                                    <span className="text-sm font-medium text-gray-800">{formatDateDisplay(leaveForView.fromDate)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">To Date</span>
                                    <span className="text-sm font-medium text-gray-800">{formatDateDisplay(leaveForView.toDate)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-gray-500 uppercase">Total Days</span>
                                <span className="text-sm font-medium text-gray-800">{leaveForView.totalDays}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-gray-500 uppercase">Reason</span>
                                <span className="text-sm font-medium text-gray-800 whitespace-pre-line">{leaveForView.reason}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">HR Approval</span>
                                    <span className="text-sm font-medium text-gray-800">{leaveForView.hrApprovalStatus}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase">Applied On</span>
                                    <span className="text-sm font-medium text-gray-800">{formatDateDisplay(leaveForView.appliedDate)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Loading leave details...</p>
                    )}
                </DialogContent>
                <DialogActions className="px-4 py-3 border-t border-gray-200 justify-end">
                    <Button onClick={() => setViewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
                <div
                    className="flex items-center justify-between px-4 py-3 rounded-t-md relative"
                    style={{ backgroundColor: theme.secondaryColor }}
                >
                    <h2 className="text-lg font-semibold">Edit Leave</h2>
                    <button
                        onClick={() => setEditOpen(false)}
                        className="text-white hover:text-gray-200 transition"
                        title="Close"
                    >
                        <IoMdClose className="text-2xl" />
                    </button>
                </div>
                <form onSubmit={handleEditSubmit}>
                <DialogContent dividers className="p-4 space-y-4">
                    {editData ? (
                        <div className="space-y-3">
                            <TextField
                                label="Leave Type"
                                value={editData.leaveType || ""}
                                disabled
                                fullWidth
                                size="small"
                                margin="dense"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <TextField
                                    label="From Date"
                                    type="date"
                                    value={formatDateInput(editData.fromDate)}
                                    onChange={(e) => setEditData({ ...editData, fromDate: e.target.value })}
                                    fullWidth
                                    size="small"
                                    margin="dense"
                                    inputProps={{ min: "2020-01-01" }}
                                />
                                <TextField
                                    label="To Date"
                                    type="date"
                                    value={formatDateInput(editData.toDate)}
                                    onChange={(e) => setEditData({ ...editData, toDate: e.target.value })}
                                    fullWidth
                                    size="small"
                                    margin="dense"
                                    inputProps={{ min: "2020-01-01" }}
                                />
                            </div>
                            <TextField
                                label="Reason"
                                value={editData.reason || ""}
                                onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                                fullWidth
                                size="small"
                                margin="dense"
                                rows={2}
                            />
                            <TextField
                                label="Status (Read Only)"
                                value={editData.status || ""}
                                disabled
                                fullWidth
                                size="small"
                                margin="dense"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Loading leave data...</p>
                    )}
                </DialogContent>
                <DialogActions className="px-4 py-3 border-t border-gray-200 justify-end gap-2">
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={editLoading}
                    >
                        {editLoading ? "Updating..." : "Update Leave"}
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
        </div>
    );

};

export default StatusAndApproval;
