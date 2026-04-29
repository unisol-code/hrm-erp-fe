/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../config";
import useFetch from "../useFetch";
import {
  policiesCategoryDetailsState,
  policiesCategoryState,
  payrollGradeState,
} from "../../state/policiesCategory/usePoliciesCategory";
import { toast } from "react-toastify";

const usePoliciesCatagory = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);
  const [payrollGrade, setPayrollGrade] = useRecoilState(payrollGradeState);
  const [PoliciesCategory, setPoliciesCategory] = useRecoilState(
    policiesCategoryState
  );
  const [PoliciesCategoryDetails, setPoliciesCategoryDetails] = useRecoilState(
    policiesCategoryDetailsState
  );
  const fetchPayrollGrade = async () => {
    setLoading(true);

    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/payrollGrade`,
      });
      if (res) {
        setLoading(false);
        console.log(res);
        setPayrollGrade(res?.payrollGrade);
      }
    } catch (error) {
      console.error("Fetching Expense sales List :", error);
      setLoading(false);
    }
  };

  const fetchAllPoliciesCategory = async (limit, page, grade) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit,
        page,
        grade,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}policyModule/getAllPolicyModules?${params}`,
      });
      if (res) {
        console.log(res);
        setLoading(false);
        setPoliciesCategory(res);
      }
    } catch (error) {
      console.error("Fetching PoliciesCatagory List :", error);
      setLoading(false);
    }
  };

  const fetchPoliciesCategoryDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}policyModule/getPolicyModuleById/${id}`,
      });
      if (res) {
        setLoading(false);
        setPoliciesCategoryDetails(res);
      }
    } catch (error) {
      console.error("Fetching Expense sales List :", error);
      setLoading(false);
    }
  };

  const createPoliciesCategory = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}policyModule/addPolicyModule`,
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

  const updatePoliciesCategory = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}policyModule/updatePolicyModule/${id}`,
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

  const deletePoliciesCategory = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "DELETE",
        url: `${conf.apiBaseUrl}policyModule/deletePolicyModule/${id}`,
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

  const resetPoliciesCategoryDetails = () => {
    setPoliciesCategoryDetails(null);
  };

  return {
    fetchPayrollGrade,
    payrollGrade,
    createPoliciesCategory,
    updatePoliciesCategory,
    fetchAllPoliciesCategory,
    fetchPoliciesCategoryDetails,
    PoliciesCategory,
    PoliciesCategoryDetails,
    deletePoliciesCategory,
    loading,
    resetPoliciesCategoryDetails,
  };
};

export default usePoliciesCatagory;
