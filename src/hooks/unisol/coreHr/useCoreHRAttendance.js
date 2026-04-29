import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import { useState } from "react";
import useFetch from "../../useFetch";
import {
  newEmployeeCountAtom,
  todaysEmpAttendanceAtom,
  totalEmpAttendanceAtom,
  weeklydeptAttendanceAtom,
} from "../../../state/coreHR/coreHRAttendance";

const useCoreHRAttendance = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [todaysEmpAttendance, setTodaysEmpAttendance] = useRecoilState(
    todaysEmpAttendanceAtom
  );
  const [totalEmpAttendance, setTotalEmpAttendance] = useRecoilState(
    totalEmpAttendanceAtom
  );
  const [weeklydeptAttendance, setWeeklydeptAttendance] = useRecoilState(
    weeklydeptAttendanceAtom
  );
  const [newEmployeeCount, setNewEmployeeCount] =
    useRecoilState(newEmployeeCountAtom);

  const fetchTodaysEmpAttendance = async () => {
    setTodaysEmpAttendance(null);
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/dailyAttendance`,
      }).then((res) => {
        if (res) {
          setTodaysEmpAttendance(res);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalEmpAttendance = async () => {
    setTotalEmpAttendance(null);
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getTotalNumOfEmp`,
      }).then((res) => {
        if (res) {
          setTotalEmpAttendance(res);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewEmployeeCount = async () => {
    setNewEmployeeCount(null);
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getEmployeeCountForCurrentMonth`,
      }).then((res) => {
        if (res) {
          setNewEmployeeCount(res);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklydeptAttendance = async () => {
    setWeeklydeptAttendance(null);
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getDepartmentChart`,
      }).then((res) => {
        if (res) {
          setWeeklydeptAttendance(res?.data);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    todaysEmpAttendance,
    fetchTodaysEmpAttendance,
    loading,
    errors,
    totalEmpAttendance,
    fetchTotalEmpAttendance,
    fetchWeeklydeptAttendance,
    weeklydeptAttendance,
    fetchNewEmployeeCount,
    newEmployeeCount,
  };
};

export default useCoreHRAttendance;
