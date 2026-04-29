import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import { analyticsAppraisalDetailsAtom, analyticsAppraisalTrendAtom, analyticsAttendanceTrendsAtom, analyticsEmpAttendanceAtom, analyticsExpensesDetailsAtom, analyticsExpensesTrendAtom, analyticsLeaveDetailsAtom, analyticsLeaveDistributionAtom, analyticsloanDetailsAtom, analyticsLoanTrendAtom, analyticsYearAtom, empAnalyticsCardsAtom } from "../../../state/analytics/analyticsState";

const useAnalytics = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [empAnalyticsCards, setEmpAnalyticsCards] = useRecoilState(empAnalyticsCardsAtom);
    const [analyticsYear, setAnalyticsYear] = useRecoilState(analyticsYearAtom);
    const [analyticsAttendanceTrends, setAnalyticsAttendanceTrends] = useRecoilState(analyticsAttendanceTrendsAtom);
    const [analyticsEmpAttendance, setAnalyticsEmpAttendance] = useRecoilState(analyticsEmpAttendanceAtom);
    const [analyticsLeaveDistribution, setAnalyticsLeaveDistribution] = useRecoilState(analyticsLeaveDistributionAtom);
    const [analyticsLeaveDetails, setAnalyticsLeaveDetails] = useRecoilState(analyticsLeaveDetailsAtom);
    const [analyticsExpensesTrend, setAnalyticsExpensesTrend] = useRecoilState(analyticsExpensesTrendAtom);
    const [analyticsExpensesDetails, setAnalyticsExpensesDetails] = useRecoilState(analyticsExpensesDetailsAtom);
    const [analyticsLoanTrend, setAnalyticsLoanTrend] = useRecoilState(analyticsLoanTrendAtom);
    const [analyticsLoanDetails, setAnalyticsLoanDetails] = useRecoilState(analyticsloanDetailsAtom);
    const [analyticsAppraisalTrend, setAnalyticsAppraisalTrend] = useRecoilState(analyticsAppraisalTrendAtom);
    const [analyticsAppraisalDetails, setAnalyticsAppraisalDetails] = useRecoilState(analyticsAppraisalDetailsAtom);

    const fetchEmpAnalytics = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/cards`,
                params
            });
            if (res) {
                setEmpAnalyticsCards(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Employee Analytics Cards:", error);
            setLoading(false);
        }
    };

    const fetchAnalyticsYear = async () => {
        setLoading(true)
        try {
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/years-dropdown`,
            });
            if (res) {
                setAnalyticsYear(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Year:", error);
            setLoading(false);
        }
    };

    const fetchAnalyticsAttendanceTrends = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/attendance-trend`,
                params
            });
            if (res) {
                setAnalyticsAttendanceTrends(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Attendance Trends:", error);
            setLoading(false);
        }
    }

    const fetchAnalyticsEmpAttendance = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/getAllEmployeesAttendance`,
                params
            });
            if (res) {
                setAnalyticsEmpAttendance(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Employee Attendance:", error);
            setLoading(false);
        }
    }

    const fetchAnalyticsLeaveDistribution = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/leave-distribution`,
                params
            });
            if (res) {
                setAnalyticsLeaveDistribution(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Leave Distribution:", error);
            setLoading(false);
        }
    }

    const fetchAnalyticsLeaveDetails = async (year, month, page, limit) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/leave-details`,
                params
            });
            if (res) {
                setAnalyticsLeaveDetails(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Leave Details:", error);
            setLoading(false);
        }
    }

    const fetchAnalyticsExpensesTrend = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/expenses-trend`,
                params
            });
            if (res) {
                setAnalyticsExpensesTrend(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Expenses Trend:", error);
            setLoading(false);
        }
    }

    const fetchAnalyticsExpensesDetails = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/expense-details`,
                params
            });
            if (res) {
                setAnalyticsExpensesDetails(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Expenses Details:", error);
            setLoading(false);
        }
    }

    const fetchAnalyticsLoanTrend = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/loan-trend`,
                params
            });
            if (res) {
                setAnalyticsLoanTrend(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Loan Trend:", error);
            setLoading(false);
        }
    }

    const fetchAnalyticsLoanDetails = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/loan-details`,
                params
            });
            if (res) {
                setAnalyticsLoanDetails(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Loan Details:", error);
            setLoading(false);
        }
    }

    const fetchAnalyticsAppraisalTrend = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/appraisal-trend`,
                params
            });
            if (res) {
                setAnalyticsAppraisalTrend(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Appraisal Trend:", error);
            setLoading(false);
        }
    }

    const fetchAnalyticsAppraisalDetails = async (year, month) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (month) params.append("month", month);
            const res = await fetchData({
                url: `${conf.apiBaseUrl}analytics/appraisal-details`,
                params
            });
            if (res) {
                setAnalyticsAppraisalDetails(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching Analytics Appraisal Details:", error);
            setLoading(false);
        }
    }   

    return {
        loading, empAnalyticsCards, analyticsYear, fetchEmpAnalytics,
        fetchAnalyticsYear, fetchAnalyticsAttendanceTrends, analyticsAttendanceTrends,
        fetchAnalyticsEmpAttendance, analyticsEmpAttendance, fetchAnalyticsLeaveDistribution, analyticsLeaveDistribution,
        fetchAnalyticsLeaveDetails, analyticsLeaveDetails, fetchAnalyticsExpensesTrend, analyticsExpensesTrend,
        fetchAnalyticsExpensesDetails, analyticsExpensesDetails, fetchAnalyticsLoanTrend, analyticsLoanTrend,
        fetchAnalyticsLoanDetails, analyticsLoanDetails, fetchAnalyticsAppraisalTrend, analyticsAppraisalTrend, fetchAnalyticsAppraisalDetails, analyticsAppraisalDetails
    };
};

export default useAnalytics