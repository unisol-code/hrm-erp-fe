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

  const getEmployeeLeaveStatusAndApproval = async (id) => {
    console.log("id :", id);
    setEmployeeLeaveStatusAndApproval(null);
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/getEmployeeLeaveStatusAndApproval/${id}`,
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
    allEmployeeAttendanceDetails,
    employeeLeaveSummary,
    employeeLeaveStatusAndApproval,
    employeeLeaveList,
    leaveApproval,
    monthlyAttendance,
    dailyAttendancePercentage,
    searchEmployee,
    approvedLeavesOfEmployee,
  };
};

export default useAttendence;
