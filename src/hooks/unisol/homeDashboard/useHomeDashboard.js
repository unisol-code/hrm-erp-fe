import React, { useState } from 'react'
import useFetch from "../../useFetch";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import { companyStatusOverViewListAtom, homeEmployeeOverviewAtom, homeNewEmployeeCountAtom, homeSpecialDaysAtom, homeTodaysEmpAttendanceAtom, homeTotalEmpAttendanceAtom, homeUpcomingMeetAndHolidayAtom, homeWeeklyDepartmentAtom } from '../../../state/homeDashboard/homeDasboardState';

const useHomeDashboard = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const [homeNewEmployeeCount, setHomeNewEmployeeCount] = useRecoilState(homeNewEmployeeCountAtom);
    const [homeTotalEmpAttendance, setHomeTotalEmpAttendance] = useRecoilState(homeTotalEmpAttendanceAtom);
    const [homeWeeklyAttendance, sethomeWeeklyAttendance] = useRecoilState(
        homeWeeklyDepartmentAtom
    );
    const [homeTodaysEmpAttendance, setHomeTodaysEmpAttendance] = useRecoilState(
        homeTodaysEmpAttendanceAtom
    )
    const [homeSpecialDays, setHomeSpecialDays] = useRecoilState(homeSpecialDaysAtom);
    const [homeCompaniesOverview, setHomeCompaniesOverview] = useRecoilState(companyStatusOverViewListAtom);
    const [homeEmployeeOverview, setHomeEmployeeOverview] = useRecoilState(homeEmployeeOverviewAtom);
    const [homeUpcomingMeetAndHoliday, setHomeUpcomingMeetAndHoliday] = useRecoilState(homeUpcomingMeetAndHolidayAtom);

    const fetchHomeNewEmployeeCount = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: `${conf.apiBaseUrl}home/newEmployees`,
                method: "GET",
            });
            if (response) {
                setHomeNewEmployeeCount(response);
            }
        } catch (error) {
            console.error("Error fetching  :", error);
            setLoading(false);
        }
    };

    const fetchHomeTotalEmpAttendance = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: `${conf.apiBaseUrl}home/totalEmployees`,
                method: "GET",
            });
            if (response) {
                setHomeTotalEmpAttendance(response);
            }
        } catch (error) {
            console.error("Error fetching  :", error);
            setLoading(false);
        }
    };

    const fetchHomeTodaysEmpAttendance = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: `${conf.apiBaseUrl}home/todaysAttendance`,
                method: "GET",
            });
            if (response) {
                setHomeTodaysEmpAttendance(response);
            }
        } catch (error) {
            console.error("Error fetching  :", error);
            setLoading(false);
        }
    };

    const fetchHomeWeeklyDeptAttendance = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: `${conf.apiBaseUrl}home/getWeeklyAttendanceByDepartment`,
                method: "GET",
            });
            if (response) {
                sethomeWeeklyAttendance(response?.data);
            }
        } catch (error) {
            console.error("Error fetching  :", error);
            setLoading(false);
        }
    };

    const fetchHomeSpecialDays = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: `${conf.apiBaseUrl}home/getspecialDays`,
                method: "GET",
            });
            if (response) {
                setHomeSpecialDays(response);
            }
        } catch (error) {
            console.error("Error fetching  :", error);
            setLoading(false);
        }
    };

    const fetchHomeCompaniesOverview = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: `${conf.apiBaseUrl}home/getCompanyStatusOverview`,
                method: "GET",
            });
            if (response) {
                setHomeCompaniesOverview(response?.companies);
            }
        } catch (error) {
            console.error("Error fetching  :", error);
            setLoading(false);
        }
    };

    const fetchHomeEmployeeOverview = async (companyName, page, limit) => {
        setLoading(true);
        try {
             const params = new URLSearchParams({
                companyName: companyName,
                page: page,
                limit: limit,
            });
            const res = await fetchData({
                url: `${conf.apiBaseUrl}home/getMoreCompanyStatusOverview?${params}`,
                method: "GET",
            });
            if (res) {
                setHomeEmployeeOverview(res);
            }
        } catch (error) {
            console.error("Error fetching  :", error);
            setLoading(false);
        }
    };

    const fetchHomeUpcomingMeetsAndHolidays = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                url: `${conf.apiBaseUrl}home/getAllUpcomingMeetsAndHolidays`,
                method: "GET",
            });
            if (res) {
                setHomeUpcomingMeetAndHoliday(res);    
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching  :", error);
            setLoading(false);
        }
    };

    return {
        homeTotalEmpAttendance, homeWeeklyAttendance, homeTodaysEmpAttendance, homeSpecialDays, homeCompaniesOverview, homeNewEmployeeCount,
        homeEmployeeOverview, homeUpcomingMeetAndHoliday,
        fetchHomeNewEmployeeCount, fetchHomeTotalEmpAttendance, fetchHomeTodaysEmpAttendance, fetchHomeWeeklyDeptAttendance, fetchHomeSpecialDays,
        fetchHomeCompaniesOverview, fetchHomeEmployeeOverview, fetchHomeUpcomingMeetsAndHolidays
    }
}

export default useHomeDashboard