import { useState } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config";
import { useRecoilState } from "recoil";
import { resignationAtom } from "../../../state/resignation/resignationState";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { confirmAlert } from "../../../utils/alertToast";

const useResignation = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [resignationData, setResignationData] = useRecoilState(resignationAtom);
  const [loanDetails, setLoanDetails] = useState(null);
  const navigate = useNavigate();

  const fetchAllDataResignation = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeResignation/getAllResgnationofthisemployee`,
      });
      if (res) {
        setResignationData(res.data);
      }
    } catch (err) {
      console.error("Error fetching welcome kit", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeLoanResignationDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeResignation/getEmployeeLoandetailsforResignation`,
      });
      if (res) {
        setLoanDetails(res.data);
      }
    } catch (err) {
      console.error("Error fetching welcome kit", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResignationDetailById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeResignation/getResignationById/${id}`,
      });
      if (res) {
        setResignationData(res.data);
      }
    } catch (err) {
      console.error("Error fetching welcome kit", err);
    } finally {
      setLoading(false);
    }
  };

  const createResignation = async (payload) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}employeeResignation/createResignation`,
        data: payload,
      });

      if (res?.success) {
        toast.success(res.message || "Resignation submitted successfully");
        navigate("/emp/resignation");
      }
    } catch (err) {
      console.error("Error creating resignation", err);
      toast.error(err?.response?.data?.message || "Failed to submit resignation");
    } finally {
      setLoading(false);
    }
  };

  const updateResignationById = async (id, payload) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}employeeResignation/updateResignationById/${id}`,
        data: payload,
      });

      if (res?.success) {
        toast.success(res.message || "Resignation updated successfully");
        navigate("/emp/resignation");
      }
    } catch (err) {
      console.error("Error updating resignation", err);
      toast.error("Failed to update resignation");
    } finally {
      setLoading(false);
    }
  };

  const deleteResignationById = async (id) => {
    const confirm = await confirmAlert(
      "Are you sure you want to delete this Resignation?"
    );
    if (!confirm) return;
    setLoading(true);
    if (confirm.isConfirmed) {
      try {
        const res = await fetchData({
          method: "DELETE",
          url: `${conf.apiBaseUrl}employeeResignation/deleteResignationById/${id}`,
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
        if (res?.success) {
          Swal.fire("Deleted!", "Resignation request deleted.", "success");   // reload list
          await fetchAllDataResignation();
        }
      } catch (error) {
        console.error("Error while deleting Expense:", error);
        toast.error(error?.response?.data?.message);
        setLoading(false);
        return false;
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    fetchAllDataResignation,
    resignationData,
    fetchResignationDetailById,
    fetchEmployeeLoanResignationDetails,
    loanDetails,
    deleteResignationById,
    createResignation,
    updateResignationById,
  };
};

export default useResignation;
