import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  empByIdForDashboardAtom,
  empByIdAtom,
  markAttendenceAtom,
  getAttendanceSummaryAtom,
  getTwoMonthAttendanceAtom,
  getweeklyAttendanceAtom,
  allMonthsAllEmpAttendanceAtom,
  monthlyAttendanceOfEmployeeAtom,
} from "../../../state/empAttendence/useAttendenceState";
import { m } from "framer-motion";

const useEmpAttendence = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);
  const [empById, setEmpById] = useRecoilState(empByIdAtom);
  const [empByIdForDashboard, setEmpByIdForDashboard] = useRecoilState(
    empByIdForDashboardAtom
  );
  const [attendence, setAttendence] = useRecoilState(markAttendenceAtom);
  const [attendenceSummary, setAttendenceSummary] = useRecoilState(
    getAttendanceSummaryAtom
  );
  const [twoMonthAttendence, setTwoMonthAttendence] = useRecoilState(
    getTwoMonthAttendanceAtom
  );
  const [weeklyAttendence, setWeeklyAttendence] = useRecoilState(
    getweeklyAttendanceAtom
  );

  const [allMonthsAllEmpAttendance, setAllMonthsAllEmpAttendance] = useRecoilState(allMonthsAllEmpAttendanceAtom);
  const [monthlyAttendanceOfEmployee, setMonthlyAttendanceOfEmployee] = useRecoilState(monthlyAttendanceOfEmployeeAtom);

  const markAttendence = async (data) => {
    setAttendence(null);
    console.log("hook data:", data);
    setLoading(true);

    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}attendance/mark`,
        data: data,
      });

      if (res) {
        setAttendence(res);
      }
    } catch (error) {
      console.error("Error while marking Attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceSummary = async (id, month) => {
    setAttendenceSummary(null);
    setLoading(true);

    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}attendance/getAttendanceSummaryByMonth/${id}`,
        params: { month },
      });

      if (res) {
        console.log("getAttendanceSummaryByMonth : ", res);
        setAttendenceSummary(res);
      }
    } catch (error) {
      console.error("Error while fetching attendance summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTwoMonthAttendance = async (id, year) => {
    setTwoMonthAttendence(null);
    setLoading(true);

    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}attendance/getTwoMonthAttendance/${id}?year=${year}`,
      });

      if (res) {
        console.log("getTwoMonthAttendance : ", res);
        setTwoMonthAttendence(res);
      }
    } catch (error) {
      console.error("Error while fetching two month attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyAttendance = async (id) => {
    setWeeklyAttendence(null)
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}attendance/weeklyAttendance/${id}`,
      }).then((res) => {
        if (res) {
          console.log("getWeeklyAttendance : ", res);
          setWeeklyAttendence(res?.data);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error while marking Attendence:", error);
      setLoading(false);
    }
  };

  // fetch emp by id
  const fetchEmpById = async (id) => {
    setEmpById(null)
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrmEmployee/getEmployeeById/${id}`,
      }).then((res) => {
        if (res) {
          setEmpById(res.data);
          console.log(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  // fetch emp by id for the attendence
  const fetchEmpByIdForDashboard = async (id) => {
    setEmpByIdForDashboard(null)
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrmEmployee/getEmployeeByIdForAttendance/${id}`,
      }).then((res) => {
        if (res) {
          setEmpByIdForDashboard(res);
          console.log(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };
  const resetEmpById = () => {
    setEmpById(null);
  }
  const resetTwoMonthAttendance = () => {
    setTwoMonthAttendence(null);
  }
  const resetWeeklyAttendance = () => {
    setWeeklyAttendence(null);
  }

  const fetchAllMonthsAllEmpAttendance = async (page, limit, department, month, year) => {
    setAllMonthsAllEmpAttendance([]);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (department) params.append('department', department);
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}attendance/getAllMonthsAllEmployeesAttendance?${params}`,
      });
      if (res) {
        setAllMonthsAllEmpAttendance(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while fetching all months all emp attendance:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyAttendanceOfEmployee = async (id, year, month, page, limit) => {
    setMonthlyAttendanceOfEmployee([]);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (year) params.append('year', year);
      if (month) params.append('month', month);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}attendance/getMonthlyAttendanceOfEmployee/${id}?${params}`,
      });
      if (res) {
        setMonthlyAttendanceOfEmployee(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while fetching monthly attendance of employee:", error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };

  return {
    loading,
    markAttendence,
    attendence,
    getAttendanceSummary,
    attendenceSummary,
    getTwoMonthAttendance,
    twoMonthAttendence,
    getWeeklyAttendance,
    weeklyAttendence,
    fetchEmpByIdForDashboard,
    empByIdForDashboard,
    fetchEmpById,
    empById,
    resetEmpById,
    resetTwoMonthAttendance,
    resetWeeklyAttendance,
    fetchAllMonthsAllEmpAttendance,
    allMonthsAllEmpAttendance, 
    fetchMonthlyAttendanceOfEmployee, 
    monthlyAttendanceOfEmployee,
  };
};
export default useEmpAttendence;
