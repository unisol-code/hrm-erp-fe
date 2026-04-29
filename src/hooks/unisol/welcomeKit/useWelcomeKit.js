import { useState } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config";
import { useRecoilState } from "recoil";
import { welcomeKitDataAtom } from "../../../state/welcomeKit/welcomekitState";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useEmployeeWelcomeKit = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [welcomeKitData, setWelcomeKitData] = useRecoilState(welcomeKitDataAtom);
  const navigate = useNavigate();

  const fetchWelcomeKitById = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeWelcomeKit/getEmployeeWelcomeKitsById`,
      });
      if (res) {
        setWelcomeKitData(res.data);
      }
    } catch (err) {
      console.error("Error fetching welcome kit", err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateEmployeeWelcomeKitsAcknowledged = async (payload) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}employeeWelcomeKit/updateEmployeeWelcomeKitsAcknowledged`,
        data: payload,
      });
      if (res?.success) {
        toast.success(res.message || "Updated successfully");
        navigate("/emp/employeeOverview/employeeKit");
      }
    } catch (err) {
      console.error("Error fetching welcome kit", err);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    welcomeKitData,
    fetchWelcomeKitById,updateEmployeeWelcomeKitsAcknowledged,
  };
};

export default useEmployeeWelcomeKit;
