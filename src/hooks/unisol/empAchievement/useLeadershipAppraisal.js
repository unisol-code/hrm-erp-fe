import React, { useState } from 'react'
import useFetch from '../../useFetch';
import { toast } from "react-toastify";
import conf from "../../../config/index";
import { useRecoilState } from "recoil";
import { empAppraisalListAtom, empWiseAppraisalDetailsAtom, empWiseAppraisalFinalRatingAtom, empWiseAppraisalListAtom, empWiseAppraisalYearAtom, leadershipAppraisalByIdFromEmpAtom, ledershipAppraisalListDetailsAtom } from '../../../state/empAchievement/empAppraisalState';
import Swal from 'sweetalert2';
import { confirmAlert } from '../../../utils/alertToast';

const useLeadershipAppraisal = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [empAppraisalList, setEmpAppraisalList] = useRecoilState(empAppraisalListAtom);
    const [empWiseAppraisalList, setEmpWiseAppraisalList] = useRecoilState(empWiseAppraisalListAtom);
    const [empWiseAppraisalDetails, setEmpWiseAppraisalDetails] = useRecoilState(empWiseAppraisalDetailsAtom);
    const [empWiseAppraisalYear, setEmpWiseAppraisalYear] = useRecoilState(empWiseAppraisalYearAtom);
    const [empWiseAppraisalFinalRating, setEmpWiseAppraisalFinalRating] = useRecoilState(empWiseAppraisalFinalRatingAtom);

    const [ledershipAppraisalList, setLeadershipAppraisalList] = useRecoilState(ledershipAppraisalListDetailsAtom);
    const [ledershipAppraisalListDetails, setLeadershipAppraisalListDetails] = useRecoilState(ledershipAppraisalListDetailsAtom);
    const [leadershipAppraisalByIdFromEmp, setLeadershipAppraisalByIdFromEmp] = useRecoilState(leadershipAppraisalByIdFromEmpAtom)

    const fetchEmpAppraisalList = async ({ page, limit, department, debouncedSearch }) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit
            });
            if (department) params.append("department", department);
            if (debouncedSearch) params.append("fullName", debouncedSearch);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/getEmployeeListForAppraisals?${params}`,
            });
            if (res) {
                setEmpAppraisalList(res);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmpWiseAppraisalList = async ({ id, year, cycle1, cycle2 }) => {
        console.log(id, year, cycle1, cycle2)
        setEmpWiseAppraisalList([]);
        setLoading(true);
        try {
            const params = new URLSearchParams()
            if (year) params.append("year", year);
            if (cycle1) params.append("cycle1", cycle1);
            if (cycle2) params.append("cycle2", cycle2);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/getEmployeeAppraisals/${id}?${params}`,
            });
            if (res) {
                setEmpWiseAppraisalList(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmpWiseAppraisalYear = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/getYearsFromAppraisalsOfEmployee/${id}`,
                method: "GET",
            });
            if (res) {
                setEmpWiseAppraisalYear(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmpWiseAppraisalDetails = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/getEmployeeBusinessAppraisal/${id}`,
                method: "GET",
            });
            if (res) {
                setEmpWiseAppraisalDetails(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const giveFinalRatingToEmp = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/giveFinalRatingOnEmployeeBusinessAppraisal/${id}`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const setLeadershipAppraisal = (data) => {
        setLoading(true);
        try {
            const res = fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}adminLeadershipAppraisal/addLeadershipAppraisal`,
                data: data
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const fetchLeadershipAppraisalList = async ({ title }) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (title) params.append("title", title);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminLeadershipAppraisal/getLeadershipAppraisals?${params}`,
            });
            if (res) {
                setLeadershipAppraisalList(res);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const fetchLeadershipAppraisalListDetails = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminLeadershipAppraisal/getLeadershipAppraisalById/${id}`,
            });
            if (res) {
                setLeadershipAppraisalListDetails(res);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const updateLeadershipAppraisal = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}adminLeadershipAppraisal/updateLeadershipAppraisal/${id}`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const deleteLeadershipAppraisal = async (id) => {
        const result = await confirmAlert(
            "Are you sure you want to delete this record?"
        );
        if (!result.isConfirmed) return false;
        setLoading(true);
        try {
            const res = await fetchData({
                method: "DELETE",
                url: `${conf.apiBaseUrl}adminLeadershipAppraisal/deleteLeadershipAppraisal/${id}`,
            });

            if (res) {
                await Swal.fire({
                    title: "Deleted!",
                    text: res?.message || "Record deleted successfully",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                return true;
            }
        } catch (error) {
            console.error("Delete Leadership Error:", error);
            toast.error(error?.response?.data?.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

   const fetchEmpsLeadershipAppraisalbyId = async(id) => {
    setLoading(true);
    try{
        const res = await fetchData({
            method: "GET",
            url: `${conf.apiBaseUrl}adminBusinessAppraisal/getEmployeeLeadershipAppraisal/${id}`,
        });
        if (res) {
            setLeadershipAppraisalByIdFromEmp(res?.data);
            setLoading(false);
        }
    } catch (error) {
        console.error("Fetching Expense sales List :", error);
        toast.error(error?.response?.data?.message);
        setLoading(false);
        return false;
    } finally {
        setLoading(false);
    }
    }

    const giveFinalRatingOnEmployeeLeadershipAppraisal = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/giveFinalRatingOnEmployeeLeadershipAppraisal/${id}`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const fetchEmpWiseAppraisalFinalRating = async (id, year, cycle1, cycle2) => {
        setEmpWiseAppraisalFinalRating(null);
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (year) params.append("year", year);
            if (cycle1) params.append("cycle1", cycle1);
            if (cycle2) params.append("cycle2", cycle2);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/getFinalRatingOfEmployeeAppraisals/${id}?${params}`,
            });
            if (res) {
                setEmpWiseAppraisalFinalRating(res?.data);
                setLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }


    return {
        loading, empAppraisalList, fetchEmpAppraisalList, empWiseAppraisalList, fetchEmpWiseAppraisalList,
        fetchEmpWiseAppraisalYear, empWiseAppraisalYear, fetchEmpWiseAppraisalDetails, empWiseAppraisalDetails,
        giveFinalRatingToEmp, ledershipAppraisalList,
        setLeadershipAppraisal, ledershipAppraisalListDetails,
        fetchLeadershipAppraisalList, deleteLeadershipAppraisal,
        fetchLeadershipAppraisalListDetails, fetchEmpsLeadershipAppraisalbyId, leadershipAppraisalByIdFromEmp, 
        updateLeadershipAppraisal, giveFinalRatingOnEmployeeLeadershipAppraisal, fetchEmpWiseAppraisalFinalRating, empWiseAppraisalFinalRating
    }
}

export default useLeadershipAppraisal