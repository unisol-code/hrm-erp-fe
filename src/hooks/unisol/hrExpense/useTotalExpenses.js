import { useState } from "react";
import { useRecoilState } from "recoil";
import conf from "../../../config/index";
import useFetch from "../../useFetch";
import { totalExpensesByCategoryAtom, expenseCategoryListAtom } from "../../../state/expense/expenseApprovalState";

const useTotalExpenses = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(true);
    const [totalCategoryWiseExpenses, setTotalCategoryWiseExpenses] = useRecoilState(totalExpensesByCategoryAtom);
    const [expenseCategoryList, setExpenseCategoryList] = useRecoilState(expenseCategoryListAtom);
    const [error, setError] = useState(null);

    const fetchTotalExpensesByCategory = async ({city, category}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (city) params.append("city", city);
            if (category) params.append("category", category);

            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminExpense/getExpensesByCategory?${params}`,
            });
            if (res) {
                setTotalCategoryWiseExpenses(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Total Expenses By Category: ", error);
            setError(error);
            setLoading(false);
        }
    };

    const fetchExpenseCategories = async ({city}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (city) params.append("city", city);

            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminExpense/getExpenseCategories?${params}`,
            });
            if (res) {
                setExpenseCategoryList(res?.categories);
                setLoading(false);
            }
        } catch (error) {
            console.error("Fetching Expense Categories: ", error);
            setError(error);
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        totalCategoryWiseExpenses,
        expenseCategoryList,
        fetchTotalExpensesByCategory,
        fetchExpenseCategories
    };
}

export default useTotalExpenses