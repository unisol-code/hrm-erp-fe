import React, { useEffect, useState, useMemo } from 'react'
import { useTheme } from '../../../../../hooks/theme/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
import useDropdown from '../../../../../hooks/unisol/commonDropdown/useDropdown';
import useAdminLoanRequest from '../../../../../hooks/unisol/loanRequest/useAdminLoanRequest';
import useDebounce from '../../../../../hooks/debounce/useDebounce';
import { useRoles } from '../../../../../hooks/auth/useRoles';
import BreadCrumb from '../../../../../components/BreadCrumb';
import Select from 'react-select';
import Pagination from '../../../../../components/Pagination';
import LoaderSpinner from '../../../../../components/LoaderSpinner';
import { FaEye } from 'react-icons/fa';
import { Eye } from 'lucide-react';
import { h } from '@fullcalendar/core/preact.js';

const PerEmpLoanReq = () => {
    const { statusOptions, fetchStatusOptions } = useDropdown();
    const { fetchPerticularEmpLoanReqList, perticularEmpLoanReqList, loading } = useAdminLoanRequest();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { employeeId } = useParams();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const { isSuperAdmin, isHR } = useRoles();
    const role = isSuperAdmin ? "superAdmin" : "hr";

    useEffect(() => {
        fetchStatusOptions(role);
    }, []);

    useEffect(() => {
        if (employeeId) {
            fetchPerticularEmpLoanReqList(employeeId, page, limit, debouncedSearch, role, status);
        }
    }, [employeeId, page, limit, debouncedSearch, role, status]);

    const handlePageChange = (newPage) => setPage(newPage);

    const handleItemsPerPageChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (selectedOption) => {
        setStatus(selectedOption?.value || "");
        setPage(1);
    }

    const handleViewDetails = (loanId) => {
        // Navigate to loan details page
        navigate(`/emp_loan_RequestList/per_Emp_Loan_Request/emp_view_Loan_Request/${loanId}`);
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'  
        });
    };

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        const colorClasses = {
            'approved': 'text-green-600 bg-green-50',
            'pending': 'text-yellow-700 bg-yellow-100', 
            'yes': 'text-yellow-700 bg-yellow-100',
            'rejected': 'text-red-600 bg-red-50',
        };

        const baseClass = colorClasses[statusLower] || 'text-slate-600 bg-slate-50';
        return `${baseClass} px-3 py-1 rounded-full`;
    };

    // Theme-based styles
    const themeStyles = useMemo(() => ({
        headerBg: { backgroundColor: theme.secondaryColor },
        searchBorder: { borderColor: `${theme.primaryColor}40` },
        searchFocus: {
            borderColor: theme.primaryColor,
            boxShadow: `0 0 0 1px ${theme.primaryColor}`
        },
        tableRowHover: { backgroundColor: `${theme.primaryColor}08` },
        viewButton: {
            backgroundColor: `${theme.primaryColor}10`,
            color: theme.primaryColor,
        },
        viewButtonHover: {
            backgroundColor: `${theme.primaryColor}20`,
        },
        statsBg: { backgroundColor: `${theme.primaryColor}10` },
        statsText: { color: theme.primaryColor },
        tableHeaderBg: { backgroundColor: `${theme.primaryColor}05` },
        tableHeaderText: { color: theme.primaryColor },
        tableBorder: { borderBottom: `2px solid ${theme.primaryColor}20` },
        cardShadow: {
            boxShadow: `0 4px 6px -1px ${theme.primaryColor}10, 0 2px 4px -1px ${theme.primaryColor}05`
        }
    }), [theme]);

    // Select options and styles
    const selectOptions = useMemo(() =>
        statusOptions?.map(option => ({
            value: option,
            label: option.charAt(0).toUpperCase() + option.slice(1)
        })) || [],
        [statusOptions]
    );

    const currentStatusOption = useMemo(() =>
        selectOptions.find(option => option.value === status) || null,
        [selectOptions, status]
    );

    const selectStyles = useMemo(() => ({
        control: (base, state) => ({
            ...base,
            minHeight: '40px',
            borderColor: state.isFocused ? theme.primaryColor : '#d1d5db',
            borderWidth: '1px',
            '&:hover': {
                borderColor: theme.primaryColor,
            },
            boxShadow: state.isFocused ? `0 0 0 1px ${theme.primaryColor}` : 'none',
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? theme.primaryColor :
                state.isFocused ? `${theme.primaryColor}15` : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:hover': {
                backgroundColor: `${theme.primaryColor}20`,
            },
        }),
    }), [theme.primaryColor]);

    // Render table rows
    const renderTableRows = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={6} className="py-8 text-center">
                        <div className="flex justify-center">
                            <LoaderSpinner />
                        </div>
                    </td>
                </tr>
            );
        }

        if (!perticularEmpLoanReqList?.data?.length) {
            return (
                <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                        No data found
                    </td>
                </tr>
            );
        }

        return perticularEmpLoanReqList.data.map((loan, index) => (
            <tr
                key={loan._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                style={{
                    "&:hover": themeStyles.tableRowHover,
                }}
            >
                <td className="px-6 py-4 text-center">
                    {(page - 1) * limit + index + 1}
                </td>
                <td className="px-6 py-4">
                    <span className="font-medium">
                        {loan.loanId}
                    </span>
                </td>
                <td className="px-6 py-4">
                    {loan.loanType}
                </td>
                <td className="px-6 py-4 text-center font-semibold">
                    {formatCurrency(loan.loanAmount)}
                </td>
                <td className="px-6 py-4 text-center">
                    {formatDate(loan.loanRequestDate)}
                </td>
                <td className="px-6 py-4 text-center">
                    <span className={getStatusColor(loan.status)}>
                        {loan.status?.charAt(0).toUpperCase() + loan.status?.slice(1)}
                    </span>
                </td>
                <td className="px-6 py-4 text-center">
                    <span className={getStatusColor(loan.pendingRequestForNillLoanAmount)}>
                        {loan.pendingRequestForNillLoanAmount === "yes" ? 'Yes' : 'No'}
                    </span>
                </td>
                <td className="px-6 py-4 text-center">
                    <button
                        onClick={() => handleViewDetails(loan._id)}
                        className="p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200"
                        style={{ color: theme.primaryColor }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.primaryColor}20`}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${theme.primaryColor}10`}
                    >
                        <Eye size={20} />
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="min-h-screen">
            <BreadCrumb
                linkText={[
                    { text: "Payroll Management" },
                    { text: "Loan Management", href: "/emp_loan_RequestList" },
                    { text: `${perticularEmpLoanReqList?.employeeName}'s Loan Requests` }
                ]}
            />

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl overflow-hidden" style={themeStyles.cardShadow}>
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100" style={themeStyles.headerBg}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                                {perticularEmpLoanReqList?.employeeName}'s Loan Requests
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {perticularEmpLoanReqList?.data?.[0]?.employeeName ||
                                    "View and manage individual employee loan applications"}
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by Loan ID and Type"
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="pl-4 pr-4 py-2.5 border rounded-lg focus:outline-none transition-all duration-200 w-full sm:w-64 shadow-sm"
                                    style={themeStyles.searchBorder}
                                    onFocus={(e) => Object.assign(e.target.style, themeStyles.searchFocus)}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = `${theme.primaryColor}40`;
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="w-48">
                                <Select
                                    options={selectOptions}
                                    value={currentStatusOption}
                                    onChange={handleStatusChange}
                                    placeholder="Filter by status"
                                    isClearable
                                    styles={selectStyles}
                                    className="text-sm"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xm" style={themeStyles.tableHeaderBg}>
                            <tr>
                                <th className="px-6 py-4 text-center">
                                    Sr. No.
                                </th>
                                <th className="px-6 py-4">
                                    Loan ID
                                </th>
                                <th className="px-6 py-4">
                                    Loan Type
                                </th>
                                <th className="px-6 py-4 text-center">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-center">
                                    Request Date
                                </th>
                                <th className="px-6 py-4 text-center">
                                    Status
                                </th>
                                 <th className="px-6 py-4 text-center">
                                    Is requested for nil loan amt
                                </th>
                                <th className="px-6 py-4 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows()}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && perticularEmpLoanReqList?.data?.length > 0 && (
                    <Pagination
                        currentPage={perticularEmpLoanReqList?.currentPage || 1}
                        totalPages={perticularEmpLoanReqList?.totalPages || 1}
                        totalItems={perticularEmpLoanReqList?.totalRequests || 0}
                        itemsPerPage={limit}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </div>
        </div>
    );
}

export default PerEmpLoanReq;