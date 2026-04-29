import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import { toast } from "react-toastify";
import { appraisalYearAtom, businessAppraisalGoalListAtom, selfAppraisalDataAtom, submittedBusinessAppraisalAtom, submittedBusinessAppraisalDetailsAtom } from "../../../state/appraisal/appraisalState";
import Swal from "sweetalert2";
import { confirmAlert } from '../../../utils/alertToast';

const useEmpBusinessAppraisal = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(true);
    const [businessAppraisalGoalList, setBusinessAppraisalGoalList] = useRecoilState(businessAppraisalGoalListAtom);
    const [submittedBusinessAppraisal, setSubmittedBusinessAppraisal] = useRecoilState(submittedBusinessAppraisalAtom);
    const [submittedBusinessAppraisalDetails, setSubmittedBusinessAppraisalDetails] = useRecoilState(submittedBusinessAppraisalDetailsAtom);
    const [appraisalYear, setAppraisalYear] = useRecoilState(appraisalYearAtom);

    const fetchBusinessAppraisalGoalList = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employeeBusinessAppraisal/getAllBusinessGoals`,
            });
            if (res) {
                setBusinessAppraisalGoalList(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching business appraisal goal list", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const giveBusinessAppraisal = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}employeeBusinessAppraisal/giveSelfRatingAndAchievement`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Error while giving business appraisal", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmittedBusinessAppraisal = async ({ page, limit, year, cycle1, cycle2 }) => {
        setSubmittedBusinessAppraisal([]);
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit
            });
            if (year) params.append("year", year);
            if (cycle1) params.append("cycle1", cycle1);
            if (cycle2) params.append("cycle2", cycle2);

            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employeeBusinessAppraisal/getSubmittedBusinessAppraisals?${params}`,
            });
            if (res) {
                setSubmittedBusinessAppraisal(res);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching submitted business appraisal", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmittedBusinessAppraisalDetails = async (id) => {
        setSubmittedBusinessAppraisalDetails(null);
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employeeBusinessAppraisal/getSubmittedBusinessAppraisalById/${id}`,
            });
            if (res) {
                setSubmittedBusinessAppraisalDetails(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching submitted business appraisal details", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }


    const updateBusinessAppraisal = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}employeeBusinessAppraisal/updateSubmittedBusinessAppraisal/${id}`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Error while updating business appraisal", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const deleteBusinessAppraisal = async (id) => {
        const confirm = await confirmAlert(
            "Are you sure you want to delete this appraisal?"
        );
        if (!confirm) return;
        setLoading(true);
        if (confirm.isConfirmed) {
            try {
                const res = await fetchData({
                    method: "DELETE",
                    url: `${conf.apiBaseUrl}employeeBusinessAppraisal/deleteSubmittedBusinessAppraisal/${id}`,
                });
                if (res) {
                    Swal.fire({
                        title: "Deleted!",
                        text: res?.message,
                        icon: "success",
                        confirmButtonText: "OK",
                    });
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
    }

    const resetBusinessAppraisal = () => {
        setSubmittedBusinessAppraisalDetails(null);
    }

    const resetBusinessAppraisalList = () => {
        setSubmittedBusinessAppraisal([]);
    }
    const fetchAppraisalYears = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}employeeBusinessAppraisal/getYearsFromSubmittedBusinessAppraisal`,
            });
            if (res) {
                setAppraisalYear(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error while fetching appraisal years", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading, fetchBusinessAppraisalGoalList, businessAppraisalGoalList, giveBusinessAppraisal,
        fetchAppraisalYears, fetchSubmittedBusinessAppraisal, submittedBusinessAppraisal, appraisalYear,
        fetchSubmittedBusinessAppraisalDetails, submittedBusinessAppraisalDetails, resetBusinessAppraisal,
        updateBusinessAppraisal, resetBusinessAppraisalList, deleteBusinessAppraisal
    };
}

export default useEmpBusinessAppraisal