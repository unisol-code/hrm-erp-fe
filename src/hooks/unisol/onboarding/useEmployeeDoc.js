import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import conf from "../../../config/index";
import {
  AlertContentState,
  AlertState,
  toastState,
} from "../../../state/toastState";
import useFetch from "../../useFetch";
import { useNavigate } from "react-router-dom";
import { docsByEmpIDAtom } from "../../../state/onBoarding/empDocState";
import { toast } from "react-toastify";

const useEmployeeDoc = () => {
  const [fetchData] = useFetch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const setAlertContent = useSetRecoilState(AlertContentState);
  const setAlertState = useSetRecoilState(AlertState);
  const [uploadDocById, setUploadDocById] = useRecoilState(toastState);
  const [sendDocAlert, setSendDocAlert] = useRecoilState(toastState);
  const [docsByEmpID, setDocsByEmpID] = useRecoilState(docsByEmpIDAtom);

  const uploadEmployeeDoc = async (id, data) => {
    setLoading(true);
    setErrors("");
    try {
      console.log("Uploading documents...", data);

      // Log request details
      console.log("Request URL:", `${conf.apiBaseUrl}employees/upload/${id}`);
      console.log("Request Method:", "PUT");
      console.log("Request Headers:", {
        "Content-Type": "multipart/form-data",
      });
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}employees/upload/${id}`,
        data: data,
      });
      if (res) {
        console.log("uploaded response", res);
        setLoading(false);
        setUploadDocById(res);
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocsByEmpID = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employees/getallDocument/${id}`,
      });
      if (res) {
        setLoading(false);
        setDocsByEmpID(res?.documents);
        // console.log("Response for docsByEmpID:", res?.documents);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating email template:", error);
      setLoading(false);
    }
  };

  const documentReminderEmail = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}employees/sendMail`,
        data: data,
      });
      if (res) {
        setLoading(false);
        console.log("Response in SendAlertEmail", res);
        setSendDocAlert(res?.message);
        navigate("/onBoardingTaskVerification/onBoardingWorkflow");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating email template:", error);
      setLoading(false);
    }
  };

  const resetEmpDoc = () => {
    setDocsByEmpID(null);
  };

  return {
    uploadDocById,
    uploadEmployeeDoc,
    documentReminderEmail,
    loading,
    errors,
    sendDocAlert,
    resetEmpDoc,
    fetchDocsByEmpID,
    docsByEmpID,
  };
};

export default useEmployeeDoc;
