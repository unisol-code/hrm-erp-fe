import React from "react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  expenseCategoryAtom,
  nameAndDepartmentAtom,
  expenseStatusAtom,
  expenseHistoryAtom,
  cityHQAtom,
  mealTypeAtom,
  modeOfTransportAtom,
  addFoodExpenseAtom,
  addDailyAllowanceAtom,
  expenseDetailsAtom,
  addTravelExpenseAtom,
  addLodgingExpenseAtom,
  attendaceExpenseAtom
} from "../../../state/empExpense/useEmpExpense";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { confirmAlert } from "../../../utils/alertToast";

const useEmpExpense = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useRecoilState(expenseCategoryAtom);
  const [attendaceExpense, setAttendanceExpense] = useRecoilState(attendaceExpenseAtom);
  const [cityHQ, setCityHQ] = useRecoilState(cityHQAtom);
  const [mealType, setMealType] = useRecoilState(mealTypeAtom);
  const [modeOfTransport, setModeOfTransport] =
    useRecoilState(modeOfTransportAtom);
  const [nameDeptManager, setNameDeptManager] = useRecoilState(
    nameAndDepartmentAtom
  );
  const [expStatus, setExpStatus] = useRecoilState(expenseStatusAtom);
  const [expHistory, setExpHistory] = useRecoilState(expenseHistoryAtom);
  const [expenseDetails, setExpenseDetails] = useRecoilState(expenseDetailsAtom);
  const [addFoodExpense, setAddFoodExpense] = useRecoilState(addFoodExpenseAtom);
  const [addDailyAllowance, setDailyAllowance] = useRecoilState(addDailyAllowanceAtom);
  const [addTravelExpense, setAddTravelExpense] = useRecoilState(addTravelExpenseAtom);
  const [addLodgingExpense, setAddLodgingExpense] = useRecoilState(addLodgingExpenseAtom);

  const expenseCategory = async (date, locationType) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date: new Date(date).toLocaleDateString("en-CA"),
        locationType: locationType,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}manageExpense/getExpenseCategory?${params}`,
      });
      if (res) {
        const safeCategory = Array.isArray(res)
          ? res
          : Array.isArray(res?.categories)
            ? res.categories
            : [];
        setCategory(safeCategory);
        setAttendanceExpense(res?.attendanceStatus)
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchCityHQ = async () => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}manageExpense/getCurrentLocationType`,
      }).then((res) => {
        if (res) {
          setCityHQ(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchMealType = async (locationType) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        locationType: locationType,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}manageExpense/getFoodMealType?${params}`,
      });
      if (res) {
        setMealType(res?.mealTypes);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchModeOfTransport = async () => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}manageExpense/getModeOfTransportationForTravel`,
      }).then((res) => {
        if (res) {
          setModeOfTransport(res?.modes);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetachNameAndDepartment = async (id) => {
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}manageExpense/getEmployeeNameAndDepartment/${id}`,
      }).then((res) => {
        if (res) {
          setNameDeptManager(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching  :", error);
      setLoading(false);
    }
  };

  const fetchExpenseStatus = async (id, month, year, status, page, limit) => {
    setExpStatus(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        year,
      });
      if (month !== undefined && month !== null) {
        params.append("month", month);
      }
      if (page && limit) {
        params.append("page", page);
        params.append("limit", limit);
      }
      if (status) {
        params.append("status", status);
      }

      const url = `${conf.apiBaseUrl}manageExpense/getExpenseStatus/${id}?${params.toString()}`;

      const response = await fetchData({
        method: "GET",
        url,
      });

      if (response) {
        setExpStatus(response);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching expense status:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}manageExpense/updateExpense/${id}`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        // setExpStatus(res);
        setLoading(false)
        return true;
      }
    } catch (error) {
      console.error("Error while updating Expense:", error);
      toast.error(error?.response?.data?.message);
      setLoading(false)
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    const confirm = await confirmAlert(
      "Are you sure you want to delete this Expense?"
    );
    if (!confirm) return;
    setLoading(true);
    if (confirm.isConfirmed) {
      try {
        const res = await fetchData({
          method: "DELETE",
          url: `${conf.apiBaseUrl}manageExpense/deleteExpense/${id}`,
        });
        if (res) {
          Swal.fire({
            title: "Deleted!",
            text: res?.message,
            icon: "success",
            confirmButtonText: "OK",
          });
          setLoading(false)
          return true;
        }
      } catch (error) {
        console.error("Error while deleting Expense:", error);
        toast.error(error?.response?.data?.message);
        setLoading(false)
        return false;
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchExpenseHistory = async (id, month, year, page, limit) => {
    setExpHistory(null)
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}manageExpense/getExpenseHistory/${id}?month=${month}&year=${year}&page=${page}&limit=${limit}`,
      }).then((res) => {
        if (res) {
          setExpHistory(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching:", error);
      setLoading(false);
    }
    finally {
      setLoading(false)
    }

  };

  const createExpenseTravel = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}manageExpense/addTravelExpense`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        setLoading(false)
        return true;
      }
    } catch (error) {
      console.error("Error while Expense Travel:", error);
      setAddTravelExpense(error?.response?.data);
      toast.error(error?.response?.data?.message);
      setLoading(false)
      return false;
    }
    finally {
      setLoading(false)
    }
  };

  const createExpenseLodging = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}manageExpense/addLodgingExpense`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        setLoading(false)
        return true;
      }
    } catch (error) {
      console.error("Error while Expense Travel:", error);
      toast.error(error?.response?.data?.message);
      setAddLodgingExpense(error?.response?.data);
      setLoading(false)
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createExpenseFood = async (data) => {
    setLoading(true);
    try {
      // Ensure fetchData is awaited
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}manageExpense/addFoodExpense`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Error while adding Food Expense:", error);
      setAddFoodExpense(error?.response?.data);
      // Extract error message safely
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createExpenseGift = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}manageExpense/manageExpenseForGifts`,
        data: data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
        return true;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      console.error("Error while Expense Gift:", error);
      setLoading(false);
    }
  };

  const createExpenseStationary = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}manageExpense/manageExpenseForStationary`,
        data: data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
        return true;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      console.error("Error while Expense Stationary:", error);
    }
    finally {
      setLoading(false)
    }
  };

  const createExpenseOther = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}manageExpense/manageExpenseForOther`,
        data: data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
        return true;
      }
    } catch (error) {
      console.error("Error while Expense Travel:", error);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  const createExpenseDA = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}manageExpense/manageExpenseForDailyAllowance`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Error while adding Daily Allowance Expense:", error);
      setDailyAllowance(error?.response?.data);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      return false;
    }
    finally {
      setLoading(false)
    }
  };

  const createAdvanceExpense = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}advanceExpense/addAdvanceExpense`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while Advance Expense:", error);
      setLoading(false);
    }
  };

  const fetchExpenseDetails = async (id) => {
    setExpenseDetails(null)
    setLoading(true);
    try {
      await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}manageExpense/getExpenseStatusById/${id}`,
      }).then((res) => {
        if (res) {
          setExpenseDetails(res);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching:", error);
      setLoading(false)
    }
    finally {
      setLoading(false)
    }
  }

  const resetCategory = () => {
    setCategory([]);
  };

  const resetMealType = () => {
    setMealType([]);
  };
  const resetAddFoodExpense = () => {
    setAddFoodExpense(null)
  }
  const resetAddDAExpense = () => {
    setDailyAllowance(null)
  }

  const resetAddTravelExpense = () => {
    setAddTravelExpense(null)
  }

  const resetAddLodgingExpense = () => {
    setAddLodgingExpense(null)
  }

  return {
    expenseCategory,
    category, attendaceExpense,
    fetachNameAndDepartment,
    nameDeptManager,
    fetchExpenseStatus,
    expStatus,
    fetchExpenseHistory,
    expHistory,
    createExpenseStationary,
    createExpenseOther,
    createExpenseTravel,
    createExpenseLodging,
    createExpenseDA,
    createExpenseFood,
    createExpenseGift,
    createAdvanceExpense,
    fetchCityHQ,
    fetchMealType,
    resetCategory,
    fetchModeOfTransport,
    resetMealType,
    createExpenseDA,
    fetchExpenseDetails,
    mealType,
    expenseDetails,
    cityHQ,
    modeOfTransport,
    loading,
    addDailyAllowance,
    addFoodExpense,
    addTravelExpense,
    addLodgingExpense,
    resetAddDAExpense,
    resetAddFoodExpense,
    resetAddTravelExpense,
    resetAddLodgingExpense,
    updateExpense,
    deleteExpense
  };
};

export default useEmpExpense;
