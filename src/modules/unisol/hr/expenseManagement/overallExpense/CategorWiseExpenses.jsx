import React from 'react';
import { useEffect, useState, useMemo } from "react";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import Select from "react-select";
import { FaFileInvoice } from "react-icons/fa";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import useTotalExpenses from '../../../../../hooks/unisol/hrExpense/useTotalExpenses';

const CategoryWiseExpenses = () => {
    const {
        loading, 
        error, 
        totalCategoryWiseExpenses, 
        expenseCategoryList, 
        fetchTotalExpensesByCategory, 
        fetchExpenseCategories
    } = useTotalExpenses();
    
    const { theme } = useTheme();
    const [selectedLocation, setSelectedLocation] = useState("Inside City");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: "0.75rem",
            padding: "0.25rem 0.5rem",
            borderColor: state.isFocused ? "#60a5fa" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(96,165,250,0.3)" : "none",
            "&:hover": { borderColor: "#60a5fa" },
            backgroundColor: "white",
            minHeight: "40px",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#60a5fa"
                : state.isFocused
                    ? "#e0f2fe"
                    : "white",
            color: state.isSelected ? "white" : "#374151",
            "&:hover": {
                backgroundColor: state.isSelected ? "#60a5fa" : "#e0f2fe",
            },
        }),
    };

    useEffect(() => {
        if (expenseCategoryList && Array.isArray(expenseCategoryList)) {
            const options = expenseCategoryList.map(category => ({
                label: category.categoryName || category.name || category,
                value: category.categoryId || category.id || category
            }));
            setCategoryOptions(options);
        }
    }, [expenseCategoryList]);

    const expensesArray = useMemo(() => {
        if (!totalCategoryWiseExpenses) return [];
        
        if (totalCategoryWiseExpenses.expenses && Array.isArray(totalCategoryWiseExpenses.expenses)) {
            return totalCategoryWiseExpenses.expenses;
        }
        
        if (Array.isArray(totalCategoryWiseExpenses)) {
            return totalCategoryWiseExpenses;
        }
        
        return [];
    }, [totalCategoryWiseExpenses]);

    // Get grandTotal from response
    const responseGrandTotal = useMemo(() => {
        if (totalCategoryWiseExpenses && totalCategoryWiseExpenses.grandTotal) {
            return Number(totalCategoryWiseExpenses.grandTotal) || 0;
        }
        return 0;
    }, [totalCategoryWiseExpenses]);

    const filteredData = useMemo(() => {
        if (!expensesArray || expensesArray.length === 0) {
            return [];
        }
        
        if (!selectedCategory || !selectedCategory.value) {
            return expensesArray;
        }
        
        return expensesArray.filter(
            expense => expense.category === selectedCategory.value
        );
    }, [expensesArray, selectedCategory]);

    const filteredTotalAmount = useMemo(() => {
        if (!selectedCategory || !selectedCategory.value) {
            return responseGrandTotal;
        }
        
        return filteredData.reduce((total, expense) => {
            const amount = Number(expense.totalAmount) || 0;
            return total + amount;
        }, 0);
    }, [filteredData, selectedCategory, responseGrandTotal]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchTotalExpensesByCategory({ 
                city: selectedLocation, 
                category: selectedCategory?.value 
            });
        };
        fetchData();
    }, [selectedLocation, selectedCategory?.value]);

    useEffect(() => {
        fetchExpenseCategories({ city: selectedLocation });
    }, [selectedLocation]);

    const handleLocationChange = (location) => {
        setSelectedLocation(location);
        setSelectedCategory(null);
    };

    const formatCurrency = (amount) => {
        return `₹${Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    return (
        <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
            <Breadcrumb
                linkText={[
                    { text: "Expense Management" },
                    { text: "Overall Expense", href: "/expensesheet" },
                    { text: "Category Wise Expenses" },
                ]}
            />

            {/* Error Display */}
            {error && (
                <div className="mb-4 mx-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 font-medium">Error: {error}</p>
                </div>
            )}

            <div className="w-full mb-4 rounded-2xl bg-white shadow-lg px-8 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left section: Icon + Title */}
                    <div className="flex items-center gap-3">
                        <FaFileInvoice
                            style={{ color: theme.primaryColor, fontSize: 32 }}
                        />
                        <span className="text-2xl font-bold">
                            Category Wise Expenses
                        </span>
                    </div>

                    {/* Right section: Controls */}
                    <div className="flex items-center gap-4">
                        {/* Location Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant={selectedLocation === "Inside City" ? 1 : 3}
                                text="Inside City"
                                onClick={() => handleLocationChange("Inside City")}
                                className="px-4 py-2"
                            />
                            <Button
                                variant={selectedLocation === "Outside City" ? 1 : 3}
                                text="Outside City"
                                onClick={() => handleLocationChange("Outside City")}
                                className="px-4 py-2"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="min-w-[200px]">
                            <Select
                                placeholder="Select Category"
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                options={categoryOptions}
                                isClearable
                                isSearchable
                                styles={customStyles}
                                className="text-sm"
                                isLoading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
                <div
                    className="w-full h-[60px] flex items-center justify-between px-8"
                    style={{
                        background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    }}
                >
                    <div className="flex items-center gap-3">
                        <FaFileInvoice className="text-white text-xl" />
                        <h2 className="font-bold text-xl text-white">
                            Category Wise Expense List
                        </h2>
                    </div>
                    
                    {/* Summary Stats */}
                    {!loading && expensesArray.length > 0 && (
                        <div className="flex items-center gap-4 text-white">
                            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                Categories: {totalCategoryWiseExpenses?.totalCategories || expensesArray.length}
                            </span>
                        </div>
                    )}
                </div>

                {/* Table Section */}
                <div className="w-full">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead>
                                <tr className="font-semibold text-gray-600 h-[50px] border-b-2 border-gray-300">
                                    <th className="px-4">Sr No.</th>
                                    <th className="px-4">City Type</th>
                                    <th className="px-4">Expense Category</th>
                                    <th className="px-4">Expense Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="py-8 w-full flex items-center justify-center">
                                                <LoaderSpinner />
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-gray-500 text-lg">
                                            <div className="flex flex-col items-center gap-2">
                                                <FaFileInvoice className="text-gray-300 text-4xl" />
                                                <span>No expenses found.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((row, index) => (
                                        <tr
                                            key={row.category || index}
                                            className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 font-medium">{index + 1}</td>
                                            <td className="px-4 font-semibold text-slate-700">
                                                {row.city || selectedLocation}
                                            </td>
                                            <td className="px-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    {row.category || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4">
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    {formatCurrency(row.totalAmount || row.amount || 0)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Total Amount Section */}
                {!loading && filteredData.length > 0 && (
                    <div className="px-16 py-4 border-t-2 border-gray-300 bg-gradient-to-r from-gray-50 to-blue-50">
                        <div className="flex justify-end items-center gap-4">
                            <div className="text-right">
                                {selectedCategory && (
                                    <p className="text-sm text-gray-500 mb-1">
                                        Showing: {selectedCategory.label}
                                    </p>
                                )}
                                <span className="text-lg font-semibold text-gray-700">
                                    Total Amount:
                                </span>
                            </div>
                            <span
                                className="text-lg font-bold px-5 py-2 rounded-2xl text-white shadow-lg bg-green-400"
                            >
                                {formatCurrency(filteredTotalAmount)}
                            </span>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CategoryWiseExpenses;