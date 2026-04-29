/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  allSpecialDaysAtom,
  userAllNotificationAtom,
  weeklyAttendanceGraphAtom,
  companyByIdDropAtom,
  deleteNotificationAtom,
  markNotificationReadAtom,
  allTodayLeaveListAtom,
  allUpcomingLeaveListAtom,
  allTodaysMeetingListAtom,
  allUpcomingMeetListAtom,
  employeeStatusOverViewListAtom,
  allUpcomingMeetsAndHolidaysAtom,
  allCompaniesDataAtom,
  hrCompaniesAtom,
  overallMeetingStatusAtom,
} from "../../../state/hrDashboard/dashboardState";
import useFetch from "../../useFetch";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import { toastState } from "../../../state/toastState";
import { toast } from "react-toastify";
const useDashboard = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [newMeeting, setNewMeeting] = useRecoilState(toastState);

  const [weeklyAttendance, setWeeklyAttendance] = useRecoilState(
    weeklyAttendanceGraphAtom
  );
  const [companyData, setCompanyData] = useRecoilState(allCompaniesDataAtom);
  const [specialDays, setSpecialDays] = useRecoilState(allSpecialDaysAtom);
  const [allNotification, SetAllNotification] = useRecoilState(
    userAllNotificationAtom
  );
  const [markNotification, SetMarkNotification] = useRecoilState(
    markNotificationReadAtom
  );
  const [companyById, setcompanyById] = useRecoilState(companyByIdDropAtom);

  const [allTodayLeaveList, setAllTodayLeaveList] = useRecoilState(
    allTodayLeaveListAtom
  );

  const [allUpcomingLeaveList, setAllUpcomingLeaveList] = useRecoilState(
    allUpcomingLeaveListAtom
  );

  const [allTodaysMeetingList, setAllTodaysMeetingList] = useRecoilState(
    allTodaysMeetingListAtom
  );
  const [allUpcomingMeetList, setAllUpcomingMeetList] = useRecoilState(
    allUpcomingMeetListAtom
  );

  const [overallMeetingStatus, setOverallMeetingStatus] = useRecoilState(overallMeetingStatusAtom);

  const [employeeStatusOverViewList, setEmployeeStatusOverViewList] =
    useRecoilState(employeeStatusOverViewListAtom);

  const [allUpcomingMeetsAndHoliday, setAllUpcomingMeetsAndHoliday] =
    useRecoilState(allUpcomingMeetsAndHolidaysAtom);

  const [hrCompanies, setHRCompanies] = useRecoilState(hrCompaniesAtom);

  const fetchWeeklyAttendance = async (id) => {
    setWeeklyAttendance(null);
    console.log("id", id);
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/weeklyAttendance/${id}`,
      }).then((res) => {
        if (res) {
          // console.log(res);
          setWeeklyAttendance(res);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchCompaniesData = async () => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}company/getAllCompanies`,
      }).then((res) => {
        if (res) {
          // console.log("setCompanyData", res);
          setCompanyData(res);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchHRCompanies = async (employeeId) => {
    setHRCompanies(null);
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrCompany/getAllCompanyNamesForHR/${employeeId}`,
      });
      if (res?.companies) {
        setHRCompanies(res.companies);
        console.log("HR Companies:", res.companies);
      } else {
        setHRCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSpecialDay = async () => {
    setSpecialDays(null);
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getspecialDays`,
      }).then((res) => {
        if (res) {
          console.log("getspecialDays", res);
          setSpecialDays(res);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const createMeeting = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}dashboard/createMeeting`,
        data: data,
      });

      if (res) {
        toast.success(res?.message);
        setNewMeeting(res);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchCompanyById = async (id) => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}company/selectCompany/${id}`,
      }).then((res) => {
        console.log(res);
        setcompanyById(res);
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAllNotification = async (id, page, limit) => {
    console.log("userID", id);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}notification/notifications/${id}?${params}`,
      }).then((res) => {
        if (res) {
          setLoading(false);
          SetAllNotification(res);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    setLoading(true);
    try {
      await fetchData({
        method: "DELETE",
        url: `${conf.apiBaseUrl}notification/notifications/${id}`,
      }).then((res) => {
        console.log(res);
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const markNotificationRead = async (id) => {
    setLoading(true);
    try {
      await fetchData({
        method: "PATCH",
        url: `${conf.apiBaseUrl}notification/notifications/${id}/read`,
      }).then((res) => {
        console.log(res);
        SetMarkNotification(res);
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchAllTodaysMeetingList = async (id) => {
    setAllTodaysMeetingList(null)
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getAllTodaysMeetings/${id}`,
      }).then((res) => {
        if (res) {
          // console.log("response :", res);
          setAllTodaysMeetingList(res);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTodayLeaveList = async (page, limit) => {
    setAllTodayLeaveList(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/todayLeave?${params}`,
      }).then((res) => {
        if (res) {
          // console.log("response :", res);
          setAllTodayLeaveList(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const getAllUpcomingLeaveList = async (page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}leave/getUpComingLeave?${params}`,
      }).then((res) => {
        if (res) {
          setLoading(false);
          console.log("all upcoming leave api response :", res);
          setAllUpcomingLeaveList(res);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUpcomingMeetList = async (id) => {
    setAllUpcomingMeetList(null);
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getAllUpcomingMeets/${id}`,
      }).then((res) => {
        if (res) {
          // console.log("response :", res);
          setAllUpcomingMeetList(res);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverallMeetingStatus = async () => {
    setOverallMeetingStatus(null);
    setLoading(true);
    try {                               
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getSuperAdminMeetingStatus`,
      });
      if (res) {
        setOverallMeetingStatus(res?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const getEmployeeStatusOverViewList = async (page, limit) => {
    setEmployeeStatusOverViewList(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        companyName: sessionStorage.getItem("companyName"),
        page: page,
        limit: limit,
      });
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}hrmEmployee/getEmployeeComprehensiveDetails?${params}`,
      }).then((res) => {
        if (res) {
          console.log("response :", res);
          setEmployeeStatusOverViewList(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getAllUpcomingMeetsAndHoliday = async () => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getAllUpcomingMeetsAndHolidays`,
      }).then((res) => {
        if (res) {
          // console.log("response :", res);
          setAllUpcomingMeetsAndHoliday(res);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchCompaniesData,
    companyData,
    fetchWeeklyAttendance,
    fetchAllSpecialDay,
    createMeeting,
    fetchUserAllNotification,
    weeklyAttendance,
    specialDays,
    allNotification,
    fetchCompanyById,
    companyById,
    deleteNotification,
    markNotificationRead,
    fetchAllTodaysMeetingList,
    fetchAllTodayLeaveList,
    getAllUpcomingLeaveList,
    fetchAllUpcomingMeetList, fetchOverallMeetingStatus, overallMeetingStatus,
    getEmployeeStatusOverViewList,
    getAllUpcomingMeetsAndHoliday,
    allTodaysMeetingList,
    allTodayLeaveList,
    allUpcomingLeaveList,
    allUpcomingMeetList,
    employeeStatusOverViewList,
    allUpcomingMeetsAndHoliday,
    markNotification,
    fetchHRCompanies,
    hrCompanies,
  };
};

export default useDashboard;
