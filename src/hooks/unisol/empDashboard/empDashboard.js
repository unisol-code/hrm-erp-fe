import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  getOverallMeetingStatusAtom,
  getUpComingMeetingAtom,
  getAllParticipantListAtom,
  getAllHolidayListAtom,
  getMeetingDetailsAtom,
  getAllMeetingsAtom,
} from "../../../state/empDashboard/empDashboardState";
const useEmpDashboard = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);

  // const [newMeeting, setNewMeeting] = useRecoilState(createNewMeetingAtom);
  const [overallMeetingStatus, setOverallMeetingStatus] = useRecoilState(
    getOverallMeetingStatusAtom
  );
  const [allUpcomingMeetings, setAllUpcomingMeetings] = useRecoilState(
    getUpComingMeetingAtom
  );

  const [allParticipantList, setAllParticipantList] = useRecoilState(
    getAllParticipantListAtom
  );
  const [allHolidayList, setAllHolidayList] = useRecoilState(
    getAllHolidayListAtom
  );

  const [meetingDetails, setMeetingDetails] = useRecoilState(
    getMeetingDetailsAtom
  );
  const [allMeetings, setAllMeetings] = useRecoilState(getAllMeetingsAtom);

  /* const CreateNewMeeting = async (data) => {
    console.log("data :", data);
    setLoading(true);
    try {
      fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}dashboard/createMeeting`,
        data: data,
      }).then((res) => {
        if (res) {
          console.log("res : ", res);
          setLoading(false);
          setNewMeeting(res);
        }
      });
    } catch (error) {
      console.error("Error while creating meeting:", error);
      setLoading(false);
    }
  }; */

  /* fetch all participants list */
  const FetchAllParticipantList = async () => {
    setLoading(true);
    try {
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getEmailAndName`,
      }).then((res) => {
        if (res) {
          setAllParticipantList(res);
        }
      });
    } catch (error) {
      console.error("Error while fetching all participants list", error);
      setLoading(false);
    }
  };

  const FetchAllUpcomingMeeting = async (id) => {
    setAllUpcomingMeetings(null)
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getAllUpcomingMeets/${id}`,
      }).then((res) => {
        if (res) {
          setAllUpcomingMeetings(res);
        }
      });
    } catch (error) {
      console.error("Error while fetching all upcoming meetings", error);
    }
    finally {
      setLoading(false)
    }
  };

  const fetchOverallMeetingStatus = async (id) => {
    setOverallMeetingStatus(null);
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/getOverallMeetingStatus/${id}`,
      })
      if (res) {
        setOverallMeetingStatus(res);
      }
    }
  catch (error) {
    console.error("Error while fetching all meeting status:", error);
  }
  finally {
    setLoading(false)
  }
};

const fetchAllHolidayList = async () => {
  setLoading(true);
  try {
    fetchData({
      method: "GET",
      url: `${conf.apiBaseUrl}dashboard/getOverallMeetingStatus/`,
    }).then((res) => {
      if (res) {
        setAllHolidayList(res);
      }
    });
  } catch (error) {
    console.error("Error while fetching all holiday list:", error);
    setLoading(false);
  }
};

const getMeetingDetails = async (id) => {
  setLoading(true);
  try {
    fetchData({
      method: "GET",
      url: `${conf.apiBaseUrl}dashboard/getMeetingDetail/${id}`,
    }).then((res) => {
      if (res) {
        setLoading(false);
        setMeetingDetails(res);
      }
    });
  } catch (error) {
    console.error("Error while fetching meeting details:", error);
    setLoading(false);
  }
};

const resetMeetingDetails = async () => {
  setMeetingDetails(null);
};

const getAllMeetings = async (id, month, year) => {
  setAllMeetings(null);
  setLoading(true);
  try {
    const res = await fetchData({
      method: "GET",
      url: `${conf.apiBaseUrl}dashboard/getAllMeets/${id}?month=${month}&year=${year}`,
    });
    if (res) {
      setLoading(false);
      setAllMeetings(res);
    }
  } catch (error) {
    console.error("Error while fetching all meeting :", error);
  } finally {
    setLoading(false);
  }
};

return {
  loading,
  // CreateNewMeeting,
  fetchOverallMeetingStatus,
  FetchAllUpcomingMeeting,
  FetchAllParticipantList,
  fetchAllHolidayList,
  getMeetingDetails,
  resetMeetingDetails,
  // newMeeting,
  overallMeetingStatus,
  allUpcomingMeetings,
  allParticipantList,
  allHolidayList,
  meetingDetails,
  allMeetings,
  getAllMeetings,
};
};

export default useEmpDashboard;
