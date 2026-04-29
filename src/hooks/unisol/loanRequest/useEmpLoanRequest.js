import React, { useState } from 'react'
import useFetch from '../../useFetch';
import { useRecoilState } from 'recoil';
import { empBasicDetailAtom, empLoanRequestDetailAtom, empLoanRequestListAtom } from '../../../state/loanRequest/loanRequestState';
import conf from '../../../config';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { confirmAlert } from '../../../utils/alertToast';

const useEmpLoanRequest = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [empBasicDetail, setEmpBasicDetail] = useRecoilState(empBasicDetailAtom);
  const [empLoanRequestList, setEmpLoanRequestList] = useRecoilState(empLoanRequestListAtom);
  const [empLoanRequestDetail, setEmpLoanRequestDetail] = useRecoilState(empLoanRequestDetailAtom);

  const fetchEmpBasicDetail = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeLoanRequest/getEmployeeDetails`,
      });
      if (res) {
        setEmpBasicDetail(res?.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error while fetching Reward Program list:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const applyLoanRequest = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}employeeLoanRequest/createLoanRequest`,
        data: data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error Fetching :", error);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpLoanRequestList = async ({ page, limit, debouncedSearch, status }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (status) params.append("status", status);

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeLoanRequest/getEmployeeLoanRequests?${params}`,
      });

      if (res) {
        setEmpLoanRequestList(res);
      }
    } catch (error) {
      console.log("Error while fetching Loan Request list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpLoanRequestDetail = async (id) => {
    setEmpLoanRequestDetail(null)
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}employeeLoanRequest/getLoanRequestById/${id}`,
      });
      if (res) {
        setLoading(false);
        setEmpLoanRequestDetail(res?.data);
      }
    } catch (error) {
      console.log("Error while fetching Reward Program list:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateLoanRequest = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}employeeLoanRequest/updateLoanRequest/${id}`,
        data: data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error Fetching :", error);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const reqNilLoanAmount = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}employeeLoanRequest/requestForNillLoanAmount/${id}`,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
      }
    } catch (error) {
      console.error("Error Fetching :", error);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const deleteLoanRequest = async (id) => {
    const confirmResult = await confirmAlert(
      "Are you sure you want to delete this Loan Request?"
    );
    if (!confirmResult?.isConfirmed) return;
    setLoading(true);
    try {
      const res = await fetchData({
        method: "DELETE",
        url: `${conf.apiBaseUrl}employeeLoanRequest/deleteLoanRequest/${id}`,
      });
      if (res?.success) {
        await Swal.fire({
          title: "Deleted!",
          text: res?.message,
          icon: "success",
          confirmButtonText: "OK",
        });

        return true;
      }
      return false;
    } catch (error) {

      toast.error(error?.response?.data?.message);

      return false;
    }
    finally {
      setLoading(false);
    }
  }

  return {
    loading, empBasicDetail, fetchEmpBasicDetail,
    applyLoanRequest, empLoanRequestList, fetchEmpLoanRequestList,
    fetchEmpLoanRequestDetail, empLoanRequestDetail, updateLoanRequest, deleteLoanRequest, reqNilLoanAmount
  }
}

export default useEmpLoanRequest;