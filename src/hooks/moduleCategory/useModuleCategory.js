/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config";
import useFetch from "../useFetch";
import {
  moduleCategoryDetailsState,
  moduleCategoryState,
  payrollGradeState,
} from "../../state/moduleCategory/useModuleCategoryState";
import { toast } from "react-toastify";

const useModuleCategory = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);
  const [payrollGrade, setPayrollGrade] = useRecoilState(payrollGradeState);
  const [moduleCategory, setModuleCategory] =
    useRecoilState(moduleCategoryState);
  const [moduleCategoryDetails, setModuleCategoryDetails] = useRecoilState(
    moduleCategoryDetailsState
  );
  const fetchPayrollGrade = async () => {
    setLoading(true);

    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/payrollGrade`,
      });
      if (res) {;
        console.log(res);
        setPayrollGrade(res?.payrollGrade);
      }
    } catch (error) {
      console.error("Fetching Expense sales List :", error);
    }
    finally{
      setLoading(false);
    }
  };

  const fetchAllModuleCategory = async (limit,page,grade) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit,page,grade
      })
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}trainingModule/getAllTrainingModules?${params}`,
      });
      if (res) {
        console.log(res);
        setLoading(false);
        setModuleCategory(res);
      }
    } catch (error) {
      console.error("Fetching Expense sales List :", error);
      setLoading(false);
    }
  };

  const fetchModuleCategoryDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}trainingModule/getTrainingModuleById/${id}`,
      });
      if (res) {
        setLoading(false);
        setModuleCategoryDetails(res);
      }
    } catch (error) {
      console.error("Fetching Expense sales List :", error);
      setLoading(false);
    }
  };

  const createModuleCategory = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}trainingModule/addTrainingModule`,
        data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(res?.error || "Unexecpted Error");
      console.error("Fetching Expense sales List :", error);
      setLoading(false);
    }
  };

  const updateModuleCategory = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}trainingModule/updateTrainingModule/${id}`,
        data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(res?.error || "Unexecpted Error");
      console.error("Fetching Expense sales List :", error);
      setLoading(false);
    }
  };

  const deleteModuleCategory = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "DELETE",
        url: `${conf.apiBaseUrl}trainingModule/deleteTrainingModule/${id}`,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(res?.error || "Unexecpted Error");
      console.error("Fetching Expense sales List :", error);
      setLoading(false);
    }
  };
  
  const resetModuleCategoryDetails = () => {
    setModuleCategoryDetails(null);
  }

  return {
    fetchPayrollGrade,
    payrollGrade,
    createModuleCategory,
    updateModuleCategory,
    fetchAllModuleCategory,
    fetchModuleCategoryDetails,
    moduleCategory,
    moduleCategoryDetails,
    deleteModuleCategory,
    loading,
    resetModuleCategoryDetails
  };
};

export default useModuleCategory;
