import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import {
  AlertContentState,
  AlertState,
  toastState,
} from "../../../state/toastState";
import useFetch from "../../useFetch";
import { allManagersAtom } from "../../../state/onBoarding/onboardingManagerState";
import { toast } from "react-toastify";

const useOnboardingManager = () => {
  const [managerList, setManagerList] = useRecoilState(allManagersAtom);
  const [loading, setLoading] = useState(false);
  const [fetchData] = useFetch();
  const fetchManagerList = async () => {
    setManagerList(null);
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getAllManagers`,
      });
      if (res) {
        setManagerList(res);
      }
    } catch (err) {
      console.log("Error while fetching manager list", err);
    } finally {
      setLoading(false);
    }
  };
  const createManager = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}employees/promoteToManager`,
        data,
      });

      if (res?.success) {
        toast.success(res.message || "Manager created successfully");
      }
    } catch (err) {
      console.log("Error while creating manager", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while creating manager";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    managerList,
    fetchManagerList,
    createManager,
  };
};

export default useOnboardingManager;
