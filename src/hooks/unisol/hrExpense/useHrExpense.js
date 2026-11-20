/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import {
  salesExpenseAtom,
  screeningExpenseAtom,
  expenseSheetAtom,
  empWiseYearsAtom,
  yearWiseMonthsAtom,
  expensesMonthlyTrendAtom,
  expensesCategoryBreakdownAtom,
  categoryWiseEmployeeExpensesAtom,
} from "../../../state/hrExpense/useHrExpenseState";

const useHrExpense = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(true);
  const [salesList, setSalesList] = useRecoilState(salesExpenseAtom);
  const [expenseList, setExpenseList] = useRecoilState(screeningExpenseAtom);
  const [expenseSheet, setExpenseSheet] = useRecoilState(expenseSheetAtom);
  const [empWiseYears, setEmpWiseYears] = useRecoilState(empWiseYearsAtom);
  const [yearWiseMonths, setYearWiseMonths] = useRecoilState(yearWiseMonthsAtom);
  const [expensesMonthlyTrend, setExpensesMonthlyTrend] = useRecoilState(expensesMonthlyTrendAtom);
  const [expensesCategoryBreakdown, setExpensesCategoryBreakdown] = useRecoilState(expensesCategoryBreakdownAtom);
  const [categoryWiseEmployeeExpenses, setCategoryWiseEmployeeExpenses] = useRecoilState(categoryWiseEmployeeExpensesAtom);

  const fetchEmpWiseYears = async (id) => {
    setEmpWiseYears([])
    setLoading();
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}users/getYearsFromExpenseOfEmployee/${id}`,
      })
      if (res) {
        setEmpWiseYears(res?.years);
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetching Expense years List :", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchYearWiseMonth = async (id, year) => {
    setYearWiseMonths([]);
    setLoading();
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}users/getMonthsFromExpenseOfEmployee/${id}/${year}`,
      })
      if(res) {
        setYearWiseMonths(res?.months);
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetching Expense years List :", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchExpensesMonthlyTrend = async (year) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}analytics/getExpensesMonthlyTrend?${params}`,
      });
      if (res) {
        setExpensesMonthlyTrend(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetching Expenses Monthly Trend:", error);
      setLoading(false);
    }
  };

  const fetchExpensesCategoryBreakdown = async (year, month) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month) params.append("month", month);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}analytics/getExpensesCategoryBreakdown?${params}`,
      });
      if (res) {
        setExpensesCategoryBreakdown(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetching Expenses Category Breakdown:", error);
      setLoading(false);
    }
  };

  const fetchCategoryWiseEmployeeExpenses = async (year, month, category) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month) params.append("month", month);
      if (category) params.append("category", category);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}analytics/getCategoryWiseEmployeeExpenses?${params}`,
      });
      if (res) {
        setCategoryWiseEmployeeExpenses(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetching Category Wise Employee Expenses:", error);
      setLoading(false);
    }
  };

  const fetchSalesExpList = async (page, limit, department) => {
    setExpenseList(null);
    setLoading(true);
    console.log("Department: ", department);

    try {
      const params = new URLSearchParams({
        page,
        limit,
        department,
      });

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}users/getEmployeeNameForOverallExpenses?${params}`,
      });

      if (res) {
        setSalesList(res);
      }
    } catch (error) {
      console.error("Fetching Expense sales List :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScreeningExpList = async (page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}manageExpense/getEmployeeListsForScreening?${params}`,
      }).then((res) => {
        if (res) {
          setExpenseList(res);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Fetching Expense screening List  :", error);
      setLoading(false);
    }
  };
  const fetchExpenseSheet = async (id, month, year) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (year) params.append("year", year);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}users/getExpenseSheetSubmission/${id}?${params}`,
      });
      if (res) {
        setExpenseSheet(res);
        setLoading(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating email template:", error);
      setLoading(false);
    }
  };
  const resetExpenseSheet = () => {
    setExpenseSheet([]);
  };

  return {
    fetchSalesExpList,
    salesList,
    fetchScreeningExpList,
    expenseList,
    fetchExpenseSheet,
    expenseSheet,
    resetExpenseSheet,
    loading,
    fetchEmpWiseYears,
    empWiseYears,
    fetchYearWiseMonth,
    yearWiseMonths,
    fetchExpensesMonthlyTrend,
    expensesMonthlyTrend,
    fetchExpensesCategoryBreakdown,
    expensesCategoryBreakdown,
    fetchCategoryWiseEmployeeExpenses,
    categoryWiseEmployeeExpenses,
  };
};

export default useHrExpense;
