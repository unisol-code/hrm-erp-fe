import { useEffect } from "react";
import { IoMdClose, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdPending } from "react-icons/md";
import useAttendence from "../../../../../hooks/unisol/attendence/useAttendence";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useParams } from "react-router-dom";

const StatusAndApproval = () => {
    const { empId } = useParams();
    const { theme } = useTheme();

    const {
        getEmployeeLeaveStatusAndApproval,
        employeeLeaveStatusAndApproval,
        loading,
    } = useAttendence();

    console.log("loading :", loading);

    useEffect(() => {
        getEmployeeLeaveStatusAndApproval(empId);
        console.log("loading :", loading);
    }, []);

    console.log(
        "employeeLeaveStatusAndApproval : ",
        employeeLeaveStatusAndApproval
    );

    function createData(field, details) {
        return { field, details };
    }



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
                        className="py-4 px-8"
                        style={{ backgroundColor: theme.secondaryColor }}
                    >
                        <h1 className="text-black/80 text-lg font-semibold">
                            Status & Approval
                        </h1>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeLeaveStatusAndApproval.map((leave) => (
                                        <tr
                                            key={leave._id}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {new Date(leave.startDate).toLocaleDateString("en-GB")} –{" "}
                                                {new Date(leave.endDate).toLocaleDateString("en-GB")}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{leave.leaveType}</td>
                                            <td className="px-4 py-3 text-gray-600">{leave.reason}</td>
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
        </div>

    );

};

export default StatusAndApproval;
