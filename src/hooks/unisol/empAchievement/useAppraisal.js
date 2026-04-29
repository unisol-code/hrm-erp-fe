import React, { useState } from 'react'
import useFetch from '../../useFetch';
import { toast } from "react-toastify";
import conf from "../../../config/index";
import { useRecoilState } from "recoil";
import { appraisalGoalDropAtom, businessAppraisalDetailsAtom, businessAppraisalListAtom, empAppraisalGoalListAtom } from '../../../state/empAchievement/empAppraisalState';
import { confirmAlert } from '../../../utils/alertToast';
import Swal from 'sweetalert2';
import { set } from 'lodash';

const useAppraisal = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [empAppraisalGoalList, setEmpAppraisalGoalList] = useRecoilState(empAppraisalGoalListAtom);
    const [businessAppraisalList, setBusinessAppraisalList] = useRecoilState(businessAppraisalListAtom);
    const [businessAppraisalDetails, setBusinessAppraisalDetails] = useRecoilState(businessAppraisalDetailsAtom);
    const [appraisalGoalDrop, setAppraisalGoalDrop] = useRecoilState(appraisalGoalDropAtom);

    const fetchEmpAppraisalGoalList = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/getGoals`,
            });
            if (res) {
                setEmpAppraisalGoalList(res);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const AddAppraisalGoal = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/createGoal`,
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
    };

    const updateAppraisalGoal = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/updateGoal/${id}`,
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
    };

    const deleteGoalAppraisal = async (id) => {
        const confirm = await confirmAlert(
            "Are you sure you want to delete this goal?"
        );
        if (!confirm) return;
        setLoading(true);
        if (confirm.isConfirmed) {
            try {
                const res = await fetchData({
                    method: "DELETE",
                    url: `${conf.apiBaseUrl}adminBusinessAppraisal/deleteGoal/${id}`,
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
            } finally {
                setLoading(false);
            }
        }
    }

    const fetchAppraisalGoalDrop = async () => {
        setAppraisalGoalDrop([]);
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/getGoalsNames`,
            });
            if (res) {
                setAppraisalGoalDrop(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinessAppraisalList = async ({ page, limit, payrollGrade, goalId }) => {
        setBusinessAppraisalList([]);
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (payrollGrade) params.append("payrollGrade", payrollGrade);
            if (goalId) params.append("goalId", goalId);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/getBusinessGoals?${params}`,
            });
            if (res) {
                setBusinessAppraisalList(res);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinessAppraisalDetails = async (id) => {
        setBusinessAppraisalDetails(null);
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/getBusinessGoalById/${id}`,
            });
            if (res) {
                setBusinessAppraisalDetails(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense sales List :", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const resetBusinessAppraisalDetails = () => {
        setBusinessAppraisalDetails(null);
    }

    const setBusinessAppraisal = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/createBusinessGoal`,
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

    const updateBusinessAppraisal = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}adminBusinessAppraisal/updateBusinessGoal/${id}`,
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
                    url: `${conf.apiBaseUrl}adminBusinessAppraisal/deleteBusinessGoal/${id}`,
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
            } finally {
                setLoading(false);
            }
        }
    }

    return {
        loading, fetchEmpAppraisalGoalList, updateAppraisalGoal, deleteGoalAppraisal,
        AddAppraisalGoal, empAppraisalGoalList, fetchBusinessAppraisalList, fetchBusinessAppraisalDetails, businessAppraisalList, updateBusinessAppraisal, deleteBusinessAppraisal,
        businessAppraisalDetails, setBusinessAppraisal, fetchAppraisalGoalDrop, appraisalGoalDrop, resetBusinessAppraisalDetails
    }
}

export default useAppraisal