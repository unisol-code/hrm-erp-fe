import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  allEmployeeAttendanceDetailsAtom,
  employeeLeaveSummaryAtom,
  employeeLeaveStatusAndApprovalAtom,
  getEmployeeLeaveListAtom,
  markLeaveApprovalAtom,
  dailyAttendancePercentageAtom,
  monthlyAttendanceAtom,
  searchEmployeeAtom,
  approvedLeavesOfEmployeeAtom,
  allEmployeeLeavesAtom,
  editLeaveResponseAtom,
  leaveDetailsByIdAtom,
  teamLeavesAtom,
} from "../../../state/attendence/attendenceState";
import { toast } from "react-toastify";

const useAttendence = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);

  const [allEmployeeAttendanceDetails, setAllEmployeeAttendanceDetails] =
    useRecoilState(allEmployeeAttendanceDetailsAtom);
  const [employeeLeaveSummary, setEmployeeLeaveSummary] = useRecoilState(
    employeeLeaveSummaryAtom
  );
  const [employeeLeaveStatusAndApproval, setEmployeeLeaveStatusAndApproval] =
    useRecoilState(employeeLeaveStatusAndApprovalAtom);

  const [employeeLeaveList, setEmployeeLeaveList] = useRecoilState(
    getEmployeeLeaveListAtom
  );
  const [leaveApproval, setLeaveApproval] = useRecoilState(
    markLeaveApprovalAtom
  );

  const [dailyAttendancePercentage, setDailyAttendancePercentage] =
    useRecoilState(dailyAttendancePercentageAtom);

  const [monthlyAttendance, setMonthlyAttendance] = useRecoilState(
    monthlyAttendanceAtom
  );

  const [searchEmployee, setSearchEmployee] =
    useRecoilState(searchEmployeeAtom);

  const [approvedLeavesOfEmployee, setApprovedLeavesOfEmployee] =
    useRecoilState(approvedLeavesOfEmployeeAtom);

  const [allEmployeeLeaves, setAllEmployeeLeaves] =
    useRecoilState(allEmployeeLeavesAtom);

  const [editLeaveResponse, setEditLeaveResponse] =
    useRecoilState(editLeaveResponseAtom);

  const [leaveDetailsById, setLeaveDetailsById] =
    useRecoilState(leaveDetailsByIdAtom);

  const [teamLeaves, setTeamLeaves] = useRecoilState(teamLeavesAtom);

  const getAllEmployeeAttendanceDetails = async (page, limit, filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
        // employeeName: search,
        department: filters?.department,
        // department: filters?.department,
        date: filters?.date,
      });
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}attendance/getAllEmployeeAttendanceDetails?${params}`,
      }).then((res) => {
        if (res) {
          setAllEmployeeAttendanceDetails(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error while fetching EmployeeAttendanceDetails:", error);
      setLoading(false);
    }
  };

  const getEmployeeLeaveSummary = async (id) => {
    setEmployeeLeaveSummary(null);
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/getEmployeeLeaveSummary/${id}`,
      }).then((res) => {
        if (res) {
          setEmployeeLeaveSummary(res);
        }
      });
    } catch (error) {
      console.error("Error while fetching EmployeeLeaveSummary:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeLeaveStatusAndApproval = async (id,year) => {
    console.log("id :", id);
    setEmployeeLeaveStatusAndApproval(null);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/getEmployeeLeaveStatusAndApproval/${id}?${params.toString()}`,
      }).then((res) => {
        if (res) {
          console.log("leave status res : ", res);
          setEmployeeLeaveStatusAndApproval(res?.data);
        }
      });
    } catch (error) {
      console.error(
        "Error while fetching EmployeeLeaveStatusAndApproval:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeLeaveList = async (page, limit, role) => {
    setEmployeeLeaveList(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        role,
        status: "Pending",
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/getEmployeeLeave?${params}`,
      });

      if (res) {
        setEmployeeLeaveList(res);
      }
    } catch (error) {
      console.error("Error while fetching EmployeeLeaveList:", error);
    } finally {
      setLoading(false);
    }
  };
  const markLeaveApproval = async (id, data) => {
    try {
      await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}leave/leaveApproval/${id}`,
        data: data,
      }).then((res) => {
        if (res) {
          setLeaveApproval(res);
          toast.success(res?.message);
        }
      });
    } catch (error) {
      console.error("Error while  leaveApproval:", error);
    }
  };

  const getMonthlyAttendance = async () => {
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}attendance/getMonthlyAttendance`,
      }).then((res) => {
        if (res) {
          setMonthlyAttendance(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error while fetching EmployeeLeaveList:", error);
      setLoading(false);
    }
  };

  const getDailyAttendancePercentage = async () => {
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}attendance/getDailyAttendancePercentage`,
      }).then((res) => {
        if (res) {
          setDailyAttendancePercentage(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error while fetching EmployeeLeaveList:", error);
      setLoading(false);
    }
  };

  const functionSearchEmployee = async (data) => {
    setSearchEmployee(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        name: data.name,
        department: data.department,
        empId: data.empId,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/searchEmployees?${params}`,
      });

      if (res) {
        setSearchEmployee(res);
        return res;
      }
    } catch (error) {
      console.error("Error while fetching searched employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const getApprovedLeavesOfEmployee = async (id, month, year) => {
    setApprovedLeavesOfEmployee(null);
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (year) params.append("year", year);

      const res = await fetchData({
        method: "GET",
        url: `${
          conf.apiBaseUrl
        }leave/getApprovedLeavesOfEmployee/${id}?${params.toString()}`,
      });

      if (res) {
        console.log(res);
        setApprovedLeavesOfEmployee(res);
      }
    } catch (error) {
      console.error("Error while fetching approvedLeavesOfEmployee:", error);
    } finally {
      setLoading(false);
    }
  };

  const remarkLeave = async (filters, data) => {
    try {
      const params = new URLSearchParams({
        date: filters?.date,
      });
      await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}attendance/changeAttendanceStatus?${params}`,
        data: data,
      }).then((res) => {
        if (res) {
          toast.success(res?.message);
        }
      });
    } catch (error) {
      console.error("Error while changing attendance status:", error);
    }
  };

  const getAllEmployeeLeaves = async (params = {}) => {
    setAllEmployeeLeaves(null);
    setLoading(true);
    try {
      const query = new URLSearchParams(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
      ).toString();
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/getAllEmployeeLeaves${query ? `?${query}` : ""}`,
      });
      if (res) {
        setAllEmployeeLeaves(res);
      }
      return res;
    } catch (error) {
      console.error("Error while fetching all employee leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const editAnyEmployeeLeave = async (empId, data) => {
    setLoading(true);
    setEditLeaveResponse(null);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}leave/editAnyEmployeeLeave/${empId}`,
        data: data,
      });
      if (res) {
        setEditLeaveResponse(res);
        toast.success(res?.message || "Leave updated successfully");
        return res;
      }
    } catch (error) {
      console.error("Error while editing employee leave:", error);
      toast.error("Failed to update leave");
    } finally {
      setLoading(false);
    }
  };

  const getLeaveDetailsById = async (empId) => {
    setLeaveDetailsById(null);
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/getLeaveDetailsById/${empId}`,
      });
      if (res) {
        setLeaveDetailsById(res?.data ?? res);
        return res;
      }
    } catch (error) {
      console.error("Error while fetching leave details by id:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTeamLeaves = async (params = {}) => {
    setTeamLeaves(null);
    setLoading(true);
    try {
      const query = new URLSearchParams(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
      ).toString();
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/getTeamLeaves${query ? `?${query}` : ""}`,
      });
      if (res) {
        setTeamLeaves(res?.data ?? []);
        return res;
      }
    } catch (error) {
      console.error("Error while fetching team leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}leave/teamapproveLeave/${id}`,
      });
      if (res) {
        setLeaveApproval(res);
        toast.success(res?.message || "Leave approved successfully");
        return res;
      }
    } catch (error) {
      console.error("Error while approving leave:", error);
      toast.error("Failed to approve leave");
    } finally {
      setLoading(false);
    }
  };

  const rejectLeave = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}leave/teamRejectLeave/${id}`,
      });
      if (res) {
        setLeaveApproval(res);
        toast.success(res?.message || "Leave rejected successfully");
        return res;
      }
    } catch (error) {
      console.error("Error while rejecting leave:", error);
      toast.error("Failed to reject leave");
    } finally {
      setLoading(false);
    }
  };

  const resetEmployeeLeaveStatusAndApproval = () => {
    setEmployeeLeaveStatusAndApproval(null);
  };


  return {
    loading,
    getAllEmployeeAttendanceDetails,
    getEmployeeLeaveSummary,
    getEmployeeLeaveStatusAndApproval,
    getEmployeeLeaveList,
    markLeaveApproval,
    resetEmployeeLeaveStatusAndApproval,
    getMonthlyAttendance,
    getDailyAttendancePercentage,
    functionSearchEmployee,
    getApprovedLeavesOfEmployee,
    remarkLeave,
    getAllEmployeeLeaves,
    editAnyEmployeeLeave,
    getLeaveDetailsById,
    getTeamLeaves,
    allEmployeeAttendanceDetails,
    employeeLeaveSummary,
    employeeLeaveStatusAndApproval,
    employeeLeaveList,
    leaveApproval,
    monthlyAttendance,
    dailyAttendancePercentage,
    searchEmployee,
    approvedLeavesOfEmployee,
    allEmployeeLeaves,
    editLeaveResponse,
    leaveDetailsById,
    teamLeaves,
    approveLeave,
    rejectLeave,
  };
};

export default useAttendence;
