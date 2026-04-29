import { useEffect, useState } from "react";
import { RiImageCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useAttendence from "../../../../hooks/unisol/attendence/useAttendence";
import Pagination from "../../../../components/Pagination";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/Button";
import ViewDetailsLeave from "../../../../components/Dialogs/attendance/ViewDetailsLeave";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { useRoles } from "../../../../hooks/auth/useRoles";
import Profile from "../../../../assets/images/profile-image.png"

const HRLeaveManagement = () => {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewDetailsLeave, setViewDetailsLeave] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const { getEmployeeLeaveList, markLeaveApproval, employeeLeaveList, loading } = useAttendence();
  const { isSuperAdmin, isHR } = useRoles();
  // const hrID = sessionStorage.getItem("empId");
  // console.log("hrID", hrID);

  console.log("isSuperAdmin", isSuperAdmin, "isHR", isHR);
  const role = isSuperAdmin ? "superAdmin" : "hr";

  useEffect(() => {
    getEmployeeLeaveList(page, limit, role);
  }, [page, limit]);


  const handleApprove = async (empId) => {
    setActionLoading(`approve-${empId}`);
    try {
      await markLeaveApproval(empId, { status: "Approve", role: role });
      getEmployeeLeaveList(page, limit, role);
    } catch (error) {
      console.error("Approve failed:", error);
    } finally {
      setActionLoading("");
    }
  };
  const handleReject = async (empId) => {
    setActionLoading(`reject-${empId}`);
    try {
      await markLeaveApproval(empId, { status: "Reject", role: role });
      getEmployeeLeaveList(page, limit, role);
    } catch (error) {
      console.error("Reject failed:", error);
    } finally {
      setActionLoading("");
    }
  };

  const handlePassToSuperAdmin = async (empId) => {
    setActionLoading(`passedToSuperAdmin-${empId}`);
    try {
      await markLeaveApproval(empId, { status: "PassedToSuperAdmin", role: role });
      getEmployeeLeaveList(page, limit, role);
    } catch (error) {
      console.error("Pass to Super Admin failed:", error);
    } finally {
      setActionLoading("");
    }
  };

  const handleOnClick = (id) => {
    navigate(`/leaveManagement/leaveManagementDetails/${id}`);
  };

  const onPageChange = (data) => {
    setPage(data);
    getEmployeeLeaveList(data, limit);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    getEmployeeLeaveList(page, data);
  };

  return (
    <>
      <div className="w-full min-h-screen">
        <Breadcrumb
          linkText={[
            { text: "Attendance Management" },
            { text: "Leave Management" },
          ]}
        />

        <div className="w-full rounded-2xl h-auto bg-white">
          {/* Top Heading & Button Section */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-8 rounded-t-xl" style={{ backgroundColor: theme.secondaryColor }}>
            <h1 className="text-[#252C58] text-xl whitespace-nowrap">Employee Leave Overview</h1>
            <Button variant={1} text="View Leave Details" onClick={() => setViewDetailsLeave(true)} />
          </div>

          {/* Modal */}
          {viewDetailsLeave && (
            <ViewDetailsLeave onClose={() => setViewDetailsLeave(false)} />
          )}

          {/* Table Section */}
          <div className="h-[485px] overflow-y-auto pb-8">
            {loading ? (<div className="py-4 w-full flex items-center justify-center">
              <LoaderSpinner />
            </div>) : (
              employeeLeaveList && employeeLeaveList?.data?.employees?.length > 0 ? (
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
                    {employeeLeaveList?.data?.employees?.map((list) => (
                      <tr key={list?._id} className="border-b border-gray-300">
                        <td className="p-4">
                          <div className="flex items-center">
                            {/* <RiImageCircleLine size={24} className="mr-2" /> */}
                            <img
                              src={
                                list?.photo || Profile
                              }
                              alt="img"
                              className="h-[40px] w-[40px] rounded-full object-cover mr-2"
                            />
                            {list?.employeeName}
                          </div>
                        </td>
                        <td className="p-4">{list?.leaveType}</td>
                        <td className="p-4">{list?.startDate.split("T")[0]}</td>
                        <td className="p-4">{list?.endDate.split("T")[0]}</td>
                        <td className="p-4">{list?.totalDays}</td>
                        <td className="p-4">
                          <div className="flex justify-center space-x-2">
                            {list?.hrApprovalStatus === "PassedToSuperAdmin" && isHR ? (
                              <span className="px-2 py-1 rounded-full text-white bg-purple-600">Passed to Super Admin</span>
                            ) :
                              <>
                                <button
                                  className="bg-green-500 py-2 px-4 rounded-md text-white disabled:opacity-70"
                                  onClick={() => handleApprove(list._id)}
                                  disabled={actionLoading === `approve-${list._id}`}
                                >
                                  {actionLoading === `approve-${list._id}`
                                    ? "Approving..."
                                    : "Approve"}
                                </button>
                                <button
                                  className="bg-red-500 py-2 px-4 rounded-md text-white disabled:opacity-70"
                                  onClick={() => handleReject(list._id)}
                                  disabled={actionLoading === `reject-${list._id}`}
                                >
                                  {actionLoading === `reject-${list._id}`
                                    ? "Rejecting..."
                                    : "Reject"}
                                </button>
                              </>
                            }


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
                          <div className="flex flex-col items-start space-y-2">
                            <Button variant={2} onClick={() => handleOnClick(list.emp_id)} text="View Details" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-2xl text-center justify-center flex mx-auto w-full mt-24 text-gray-500">
                  No Employee Leave Requests Found.
                </div>
              )
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={employeeLeaveList?.data?.pagination?.currentPage}
            totalPages={employeeLeaveList?.data?.pagination?.totalPages}
            totalItems={employeeLeaveList?.data?.pagination?.totalCount}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div >
      </div >
    </>
  );
};

export default HRLeaveManagement;
