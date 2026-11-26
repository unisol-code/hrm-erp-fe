import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAttendence from "../../../../hooks/unisol/attendence/useAttendence";
import Pagination from "../../../../components/Pagination";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/Button";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { useRoles } from "../../../../hooks/auth/useRoles";
import Profile from "../../../../assets/images/profile-image.png";
import { IoMdCheckmarkCircleOutline, IoMdClose  , IoMdEye, } from "react-icons/io";

const HRLeaveManagement = () => {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingLimit, setPendingLimit] = useState(10);
  const [showPending, setShowPending] = useState(false);
  const [teamPendingData, setTeamPendingData] = useState(null);
  const [actionLoading, setActionLoading] = useState("");
  const navigate = useNavigate();
  const {
    getAllEmployeeLeaves,
    allEmployeeLeaves,
    getEmployeeLeaveList,
    employeeLeaveList,
    markLeaveApproval,
    loading,
    getTeamLeaves,
    approveLeave,
    rejectLeave,
  } = useAttendence();
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : "hr";

  useEffect(() => {
    getAllEmployeeLeaves({ page, limit });
  }, [page, limit]);

  useEffect(() => {
    if (showPending) {
      if (isSuperAdmin) {
        getTeamLeaves({ page: pendingPage, limit: pendingLimit }).then((res) => {
          setTeamPendingData(res?.data ?? null);
        });
      } else {
        getEmployeeLeaveList(pendingPage, pendingLimit, role);
      }
    }
  }, [showPending, pendingPage, pendingLimit, role, isSuperAdmin]);

  const handleApprove = async (empId) => {
    setActionLoading(`approve-${empId}`);
    try {
      await markLeaveApproval(empId, { status: "Approve", role });
      getEmployeeLeaveList(pendingPage, pendingLimit, role);
    } catch (error) {
      console.error("Approve failed:", error);
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (empId) => {
    setActionLoading(`reject-${empId}`);
    try {
      await markLeaveApproval(empId, { status: "Reject", role });
      getEmployeeLeaveList(pendingPage, pendingLimit, role);
    } catch (error) {
      console.error("Reject failed:", error);
    } finally {
      setActionLoading("");
    }
  };

  const handlePassToSuperAdmin = async (empId) => {
    setActionLoading(`passedToSuperAdmin-${empId}`);
    try {
      await markLeaveApproval(empId, { status: "PassedToSuperAdmin", role });
      getEmployeeLeaveList(pendingPage, pendingLimit, role);
    } catch (error) {
      console.error("Pass to Super Admin failed:", error);
    } finally {
      setActionLoading("");
    }
  };

  const handleTeamApprove = async (id) => {
    setActionLoading(`teamApprove-${id}`);
    try {
      await approveLeave(id);
      getTeamLeaves({ page: pendingPage, limit: pendingLimit }).then((res) => {
        setTeamPendingData(res?.data ?? null);
      });
    } catch (error) {
      console.error("Team leave approve failed:", error);
    } finally {
      setActionLoading("");
    }
  };

  const handleTeamReject = async (id) => {
    setActionLoading(`teamReject-${id}`);
    try {
      await rejectLeave(id);
      getTeamLeaves({ page: pendingPage, limit: pendingLimit }).then((res) => {
        setTeamPendingData(res?.data ?? null);
      });
    } catch (error) {
      console.error("Team leave reject failed:", error);
    } finally {
      setActionLoading("");
    }
  };

  const handleOnClick = (id) => {
    navigate(`/leaveManagement/leaveManagementDetails/${id}`);
  };

  const summaryData = allEmployeeLeaves?.data;
  const pendingData = employeeLeaveList?.data;

  return (
    <div className="w-full min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Attendance Management" },
          { text: "Leave Management" },
        ]}
      />

      <div className="w-full rounded-2xl h-auto bg-white">
        <div
          className="flex flex-wrap items-center justify-between gap-4 py-4 px-8 rounded-t-xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h1 className="text-[#252C58] text-xl whitespace-nowrap">
            {showPending ? "Assigned Leave Details" : "Employee Leave Overview"}
          </h1>
          <div className="flex gap-3">
            {showPending ? (
              <Button
                variant={1}
                text="Back to Overview"
                onClick={() => setShowPending(false)}
              />
            ) : (
              <Button
                variant={1}
                text="Assigned Leave Details"
                onClick={() => {
                  setPendingPage(1);
                  setShowPending(true);
                }}
              />
            )}
          </div>
        </div>

        <div className="h-[485px] overflow-y-auto pb-8">
          {loading ? (
            <div className="py-4 w-full flex items-center justify-center">
              <LoaderSpinner />
            </div>
          ) : showPending ? (
            isSuperAdmin ? (
              <div className="h-[485px] overflow-y-auto pb-8">
                {teamPendingData?.leaves?.length > 0 ? (
                  <table className="min-w-[650px] w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-base font-semibold text-gray-700">Employee</th>
                        <th className="p-4 text-base font-semibold text-gray-700">Leave Type</th>
                        <th className="p-4 text-base font-semibold text-gray-700">Start Date</th>
                        <th className="p-4 text-base font-semibold text-gray-700">End Date</th>
                        <th className="p-4 text-base font-semibold text-gray-700">Total Days</th>
                        <th className="p-4 text-base font-semibold text-gray-700 text-center">Status</th>
                        <th className="p-4 text-base font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamPendingData.leaves.map((list) => (
                        <tr key={list?._id} className="border-b border-gray-300">
                          <td className="p-4">
                            <div className="flex items-center">
                              <img
                                src={list?.photo || Profile}
                                alt="img"
                                className="h-[40px] w-[40px] rounded-full object-cover mr-2"
                              />
                              {list?.employeeName}
                            </div>
                          </td>
                          <td className="p-4">{list?.leaveType || "-"}</td>
                          <td className="p-4">
                            {list?.startDate ? String(list.startDate).split("T")[0] : "-"}
                          </td>
                          <td className="p-4">
                            {list?.endDate ? String(list.endDate).split("T")[0] : "-"}
                          </td>
                          <td className="p-4">{list?.totalDays ?? "-"}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${list?.status?.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-700" : list?.status?.toLowerCase() === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                            >
                              {list?.status}
                            </span>
                          </td>
                          <td className="p-4">
                        <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOnClick(list._id)}
                                className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                                title="View Details"
                              >
                                <IoMdEye size={16} />
                              </button>
                              {list?.status?.toLowerCase() === "pending" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleTeamApprove(list._id)}
                                    disabled={
                                      actionLoading === `teamApprove-${list._id}`
                                    }
                                    className="px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    title="Approve"
                                  >
                                    {actionLoading === `teamApprove-${list._id}` ? (
                                      <span className="text-[10px]">...</span>
                                    ) : (
                                      <IoMdCheckmarkCircleOutline size={16} />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleTeamReject(list._id)}
                                    disabled={
                                      actionLoading === `teamReject-${list._id}`
                                    }
                                    className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    title="Reject"
                                  >
                                    {actionLoading === `teamReject-${list._id}` ? (
                                      <span className="text-[10px]">...</span>
                                    ) : (
                                      <IoMdClose size={16} />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-2xl text-center justify-center flex mx-auto w-full mt-24 text-gray-500">
                    No Team Leave Requests Found.
                  </div>
                )}
                <Pagination
                  currentPage={teamPendingData?.pagination?.currentPage}
                  totalPages={teamPendingData?.pagination?.totalPages}
                  totalItems={teamPendingData?.pagination?.totalCount}
                  itemsPerPage={pendingLimit}
                  onPageChange={setPendingPage}
                  onItemsPerPageChange={(val) => {
                    setPendingLimit(val);
                    setPendingPage(1);
                  }}
                />
              </div>
            ) : (
              <>
                {pendingData?.employees?.length > 0 ? (
                  <table className="min-w-[650px] w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-base font-semibold text-gray-700">Employee</th>
                        <th className="p-4 text-base font-semibold text-gray-700">Leave Type</th>
                        <th className="p-4 text-base font-semibold text-gray-700">Start Date</th>
                        <th className="p-4 text-base font-semibold text-gray-700">End Date</th>
                        <th className="p-4 text-base font-semibold text-gray-700">Total Days</th>
                        <th className="p-4 text-base font-semibold text-gray-700 text-center">Mark Status</th>
                        <th className="p-4 text-base font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingData.employees.map((list) => (
                        <tr key={list?._id} className="border-b border-gray-300">
                          <td className="p-4">
                            <div className="flex items-center">
                              <img
                                src={list?.photo || Profile}
                                alt="img"
                                className="h-[40px] w-[40px] rounded-full object-cover mr-2"
                              />
                              {list?.employeeName}
                            </div>
                          </td>
                          <td className="p-4">{list?.leaveType || "-"}</td>
                          <td className="p-4">
                            {list?.startDate ? String(list.startDate).split("T")[0] : "-"}
                          </td>
                          <td className="p-4">
                            {list?.endDate ? String(list.endDate).split("T")[0] : "-"}
                          </td>
                          <td className="p-4">{list?.totalDays ?? "-"}</td>
                          <td className="p-4">
                            <div className="flex justify-center space-x-2">
                              {list?.hrApprovalStatus === "PassedToSuperAdmin" && isHR ? (
                                <span className="px-2 py-1 rounded-full text-white bg-purple-600">
                                  Passed to Super Admin
                                </span>
                              ) : (
                                <>
                                  <button
                                    className="bg-green-500 py-2 px-4 rounded-md text-white disabled:opacity-70"
                                    onClick={() => handleApprove(list._id)}
                                    disabled={actionLoading === `approve-${list._id}`}
                                  >
                                    {actionLoading === `approve-${list._id}` ? "Approving..." : "Approve"}
                                  </button>
                                  <button
                                    className="bg-red-500 py-2 px-4 rounded-md text-white disabled:opacity-70"
                                    onClick={() => handleReject(list._id)}
                                    disabled={actionLoading === `reject-${list._id}`}
                                  >
                                    {actionLoading === `reject-${list._id}` ? "Rejecting..." : "Reject"}
                                  </button>
                                </>
                              )}
                              {list?.hrApprovalStatus === "Pending" && isHR && (
                                <button
                                  className="bg-yellow-500 py-2 px-4 rounded-md text-white disabled:opacity-70"
                                  onClick={() => handlePassToSuperAdmin(list._id)}
                                  disabled={actionLoading === `passedToSuperAdmin-${list._id}`}
                                >
                                  {actionLoading === `passedToSuperAdmin-${list._id}`
                                    ? "Passing..."
                                    : "Pass to Super Admin"}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Button
                              variant={2}
                              onClick={() => handleOnClick(list.emp_id)}
                              text="View Details"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-2xl text-center justify-center flex mx-auto w-full mt-24 text-gray-500">
                    No Pending Leave Requests Found.
                  </div>
                )}
                {!isSuperAdmin && (
                  <Pagination
                    currentPage={pendingData?.pagination?.currentPage}
                    totalPages={pendingData?.pagination?.totalPages}
                    totalItems={pendingData?.pagination?.totalCount}
                    itemsPerPage={pendingLimit}
                    onPageChange={setPendingPage}
                    onItemsPerPageChange={(val) => {
                      setPendingLimit(val);
                      setPendingPage(1);
                    }}
                  />
                )}
              </>
            )
          ) : (
            <>
              {summaryData?.employees?.length > 0 ? (
                <table className="min-w-[900px] w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-base font-semibold text-gray-700">Employee</th>
                      <th className="p-4 text-base font-semibold text-gray-700">Department</th>
                      <th className="p-4 text-base font-semibold text-gray-700">Designation</th>
                      <th className="p-4 text-base font-semibold text-gray-700 text-center">Total</th>
                      <th className="p-4 text-base font-semibold text-gray-700 text-center">Approved</th>
                      <th className="p-4 text-base font-semibold text-gray-700 text-center">Pending</th>
                      <th className="p-4 text-base font-semibold text-gray-700 text-center">Rejected</th>
                      <th className="p-4 text-base font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.employees.map((emp) => (
                      <tr key={emp?._id} className="border-b border-gray-300">
                        <td className="p-4">
                          <div className="flex items-center">
                            <img
                              src={emp?.photo || Profile}
                              alt="img"
                              className="h-[40px] w-[40px] rounded-full object-cover mr-2"
                            />
                            <div>
                              <p className="font-medium text-gray-800">{emp?.employeeName}</p>
                              <p className="text-sm text-gray-500">{emp?.employeeId || "-"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{emp?.department || "-"}</td>
                        <td className="p-4">{emp?.designation || "-"}</td>
                        <td className="p-4 text-center">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {emp?.totalLeaveRequests ?? 0}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            {emp?.approvedLeaveRequests ?? 0}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                            {emp?.pendingLeaveRequests ?? 0}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                            {emp?.rejectedLeaveRequests ?? 0}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button
                            variant={2}
                            onClick={() => handleOnClick(emp._id)}
                            text="View Details"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-2xl text-center justify-center flex mx-auto w-full mt-24 text-gray-500">
                  No Employee Leave Data Found.
                </div>
              )}
              <Pagination
                currentPage={summaryData?.pagination?.currentPage}
                totalPages={summaryData?.pagination?.totalPages}
                totalItems={summaryData?.pagination?.totalEmployees}
                itemsPerPage={limit}
                onPageChange={setPage}
                onItemsPerPageChange={(val) => {
                  setLimit(val);
                  setPage(1);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRLeaveManagement;
