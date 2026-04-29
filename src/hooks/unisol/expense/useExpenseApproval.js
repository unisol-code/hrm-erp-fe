import React from "react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  empApprovalListAtom,
  expenseByIdAtom,
  expenseDetailsAtom,
} from "../../../state/expense/expenseApprovalState";
import { toast } from "react-toastify";

const useExpenseApproval = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);
  const [empApprovalList, setEmpApprovalList] =
    useRecoilState(empApprovalListAtom);
  const [expenseById, setExpenseById] = useRecoilState(expenseByIdAtom);
  const [expenseDetails, setExpenseDetails] =
    useRecoilState(expenseDetailsAtom);

  const fetchEmpApprovalList = async (
    page,
    limit,
    selectedDepartment,
    selectedCandidate,
    role
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
        department: selectedDepartment ? selectedDepartment : "",
        name: selectedCandidate ? selectedCandidate : "",
        role: role,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}users/getAllExpenseApprovals?${params}`,
      });
      if (res) {
        setEmpApprovalList(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeExpenseById = async (id, month, year, role) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (year) params.append("year", year);
      if (role) params.append("role", role);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}users/getExpenseApprovalByEmployeeId/${id}?${params}`,
      });
      if (res) {
        setExpenseById(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const approvalAction = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}users/approveOrRejectExpense/${id}`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
      }
    } catch (error) {
      console.error("Error updating :", error);
      toast.error(error.response?.data?.error);
    }
  };

  const fetchExpenseData = async (id, role) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}users/getParticularExpenseApproval/${id}?role=${role}`,
      });
      if (res) {
        setExpenseDetails(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating :", error);
      toast.error(error.response?.data?.error);
      setLoading(false);
    }
  };

  const resetApprvalEmployee = () => {
    setExpenseById(null);
    setExpenseDetails(null);
  };

  return {
    fetchEmpApprovalList,
    empApprovalList,
    loading,
    fetchEmployeeExpenseById,
    expenseById,
    approvalAction,
    resetApprvalEmployee,
    fetchExpenseData,
    expenseDetails,
  };
};

export default useExpenseApproval;
