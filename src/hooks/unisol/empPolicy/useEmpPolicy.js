import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
// import { toast } from "react-toastify";
import {
  policyListAtom,
  policyDetailAtom,
} from "../../../state/empPolicy/empPolicyState";

const useEmpPolicy = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);
  const [empPolicyList, setEmpPolicyList] = useRecoilState(policyListAtom);
  const [empPolicyById, setEmpPolicyById] = useRecoilState(policyDetailAtom);

  const fetchEmpPolicyList = async (page, limit, search) => {
    setEmpPolicyById(null);
    
    setLoading(true);
    try {
        const params = new URLSearchParams({
          page: page,
          limit: limit,
          search: search,
          grade: sessionStorage.getItem("payrollGrade"),
        });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeePolicyModuleRoute/getAllPolicies?${params}`,
      });
      if (res) {
        setEmpPolicyList(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };
  const fetchEmpPolicyById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeePolicyModuleRoute/getPolicyById/${id}`,
      });
      if (res) {
        setEmpPolicyById(res?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  return {
    fetchEmpPolicyList,
    empPolicyList,
    fetchEmpPolicyById,
    empPolicyById,
    loading,
  };
};

export default useEmpPolicy;
