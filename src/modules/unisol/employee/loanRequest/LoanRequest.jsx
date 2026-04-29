import React, { useEffect, useState, useMemo } from "react";
import { IconButton } from "@mui/material";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { HandCoins } from "lucide-react";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Pagination from "../../../../components/Pagination";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import useEmpLoanRequest from "../../../../hooks/unisol/loanRequest/useEmpLoanRequest";
import useDropdown from "../../../../hooks/unisol/commonDropdown/useDropdown";
import useDebounce from "../../../../hooks/debounce/useDebounce";

const TABLE_COLUMNS = [
    { key: 'srNo', label: 'SR. NO.', width: '10%', align: 'center' },
    { key: 'loanId', label: 'Loan ID', width: '20%', align: 'start' },
    { key: 'loanType', label: 'Loan Type', width: '20%', align: 'start' },
    { key: 'loanAmount', label: 'Request Loan Amount', width: '20%', align: 'center' },
    { key: 'loanRequestDate', label: 'Loan Request Date', width: '18%', align: 'center' },
    { key: 'status', label: 'Status', width: '17%', align: 'center' },
    { key: 'requestForNillLoanAmount', label: 'Request for nil amount', width: '17%', align: 'center' },
    { key: 'action', label: 'ACTION', width: '15%', align: 'center' },
];

const LoanRequest = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { statusOptions, fetchStatusOptions } = useDropdown();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");

    const {
        fetchEmpLoanRequestList,
        loading,
        empLoanRequestList,
        deleteLoanRequest
    } = useEmpLoanRequest();

    const debouncedSearch = useDebounce(search, 500);

    // Initialize data
    useEffect(() => {
        fetchStatusOptions();
    }, []);

    // Fetch data when filters change
    useEffect(() => {
        fetchEmpLoanRequestList({ page, limit, debouncedSearch, status });
    }, [page, limit, debouncedSearch, status]);

    // Event handlers
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

    const handleAddLoanRequest = () => {
        navigate("/emp/loanrequest/addloanrequest");
    }

    const handleViewLoanRequest = (id) => {
        navigate(`/emp/loanrequest/viewloanrequest/${id}`);
    };

    const handleEditLoanRequest = (id, currentStatus) => {
        if (currentStatus !== "approved" && currentStatus !== "rejected") {
            navigate(`/emp/loanrequest/editloanrequest/${id}`);
        }
    };

    const handleDeleteLoanRequest = async (id, currentStatus) => {
        if (currentStatus !== "approved" && currentStatus !== "rejected") {
            const isDeleted = await deleteLoanRequest(id);
            if (isDeleted) {
                fetchEmpLoanRequestList({ search, page, limit });
            }
        }
    };

    // Utility functions
    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        const colorClasses = {
            'approved': 'text-green-600 bg-green-50',
            'pending': 'text-yellow-600 bg-yellow-50',
            'rejected': 'text-red-600 bg-red-50',
        };
        const baseClass = colorClasses[statusLower] || 'text-slate-600 bg-slate-50';
        return `${baseClass} px-3 py-1 rounded-full`;
    };

    const getNillLoanStatusColor = (requestForNillLoanAmount) => {
        const nillStatusLower = requestForNillLoanAmount?.toLowerCase();
        const colorClasses = {
            'approve': 'text-green-600 bg-green-50',
            'requested': 'text-yellow-600 bg-yellow-50',
            'reject': 'text-red-600 bg-red-50',
        };
        const baseClass = colorClasses[nillStatusLower] || 'text-slate-600 bg-slate-50';
        return `${baseClass} px-3 py-1 rounded-full`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    const loanRequests = useMemo(() =>
        empLoanRequestList?.data || [],
        [empLoanRequestList]
    );

    const hasLoanRequests = useMemo(() =>
        loanRequests.length > 0,
        [loanRequests]
    );

    const selectStatusOptions = useMemo(() =>
        statusOptions?.map(option => ({
            value: option,
            label: option.charAt(0).toUpperCase() + option.slice(1)
        })) || [],
        [statusOptions]
    );

    const currentStatusOption = useMemo(() =>
        selectStatusOptions.find(option => option.value === status) || null,
        [selectStatusOptions, status]
    );

    const buttonStyle = useMemo(() => ({
        backgroundColor: theme.primaryColor,
    }), [theme.primaryColor]);

    const selectStyles = useMemo(() => ({
        control: (base, state) => ({
            ...base,
            minHeight: '42px',
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
            position: 'absolute',
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? theme.primaryColor : state.isFocused ? `${theme.primaryColor}20` : 'white',
            color: state.isSelected ? 'white' : 'inherit',
            '&:hover': {
                backgroundColor: `${theme.primaryColor}20`,
            },
        }),
    }), [theme.primaryColor]);

    // Render functions
    const renderTableHeader = () => (
        <thead className="bg-slate-100 sticky top-0 z-10">
            <tr>
                {TABLE_COLUMNS.map((col) => (
                    <th
                        key={col.key}
                        className={`px-4 py-3 font-semibold tracking-wider text-${col.align}`}
                        style={{ width: col.width }}
                    >
                        {col.label}
                    </th>
                ))}
            </tr>
        </thead>
    );

    const renderTableRow = (item, index) => {
        const isApproved = item.status?.toLowerCase() === "approved" || item.status?.toLowerCase() === "rejected";
        const disabledStyle = isApproved
            ? { cursor: "not-allowed", opacity: 0.4 }
            : { cursor: "pointer", opacity: 1 };

        return (
            <tr
                key={`${item._id}-${index}`}
                className="border-b border-slate-200 hover:bg-slate-50 text-center"
            >
                <td className="w-[10%] px-4 py-4 font-medium">
                    {(page - 1) * limit + index + 1}
                </td>
                <td className="w-[20%] px-4 py-4 font-medium text-left">
                    {item.loanId}
                </td>
                <td className="w-[20%] px-4 py-4 font-medium text-left">
                    {item.loanType}
                </td>
                <td className="w-[20%] px-4 py-4 font-medium">
                    {formatCurrency(item.loanAmount)}
                </td>
                <td className="w-[18%] px-4 py-4 font-medium">
                    {item.loanRequestDate}
                </td>
                <td className="w-[17%] px-4 py-4 font-medium">
                    <span className={getStatusColor(item.status)}>
                        {item.status}
                    </span>
                </td>
                <td className="w-[17%] px-4 py-4 font-medium">
                    <span className={getNillLoanStatusColor(item.requestForNillLoanAmount)}>
                        {item.requestForNillLoanAmount}
                    </span>
                </td>
                <td className="w-[15%] px-4 py-4 font-medium text-center">
                    <div className="flex justify-center">
                        <IconButton onClick={() => handleViewLoanRequest(item._id)}>
                            <FaEye size={20} style={{ color: theme.primaryColor }} />
                        </IconButton>
                        <IconButton
                            onClick={() => handleEditLoanRequest(item._id, item.status)}
                            style={disabledStyle}
                        >
                            <FaEdit size={20} style={{ color: theme.primaryColor }} />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDeleteLoanRequest(item._id, item.status)}
                            style={disabledStyle}
                        >
                            <MdDelete size={20} style={{ color: theme.primaryColor }} />
                        </IconButton>
                    </div>
                </td>
            </tr>
        );
    };

    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={TABLE_COLUMNS.length} className="py-8 text-center">
                        <div className="flex justify-center">
                            <LoaderSpinner />
                        </div>
                    </td>
                </tr>
            );
        }

        if (!hasLoanRequests) {
            return (
                <tr>
                    <td colSpan={TABLE_COLUMNS.length} className="text-center py-8 text-slate-500">
                        No Loan Request Found.
                    </td>
                </tr>
            );
        }

        return loanRequests.map(renderTableRow);
    };

    return (
        <div>
            <Breadcrumb linkText={[{ text: "Loan Request" }]} />

            {/* Header Section */}
            <div className="relative py-4 px-8 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
                <div className="flex items-center gap-3">
                    <HandCoins style={{ color: theme.primaryColor, fontSize: 32 }} />
                    <span className="text-2xl font-bold">Loan Request List</span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search Input with theme border color */}
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search"
                        className="border rounded-md px-3 py-2 transition-colors duration-200 focus:outline-none focus:ring-1"
                        style={{
                            borderColor: theme.primaryColor,
                            borderWidth: '1px',
                        }}
                        onFocus={(e) => {
                            e.target.style.boxShadow = `0 0 0 1px ${theme.primaryColor}`;
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = 'none';
                        }}
                    />

                    {/* Status Dropdown with theme border color */}
                    <div className="relative z-50">
                        <Select
                            options={selectStatusOptions}
                            value={currentStatusOption}
                            onChange={handleStatusChange}
                            placeholder="Select Status"
                            isClearable
                            className="min-w-[200px]"
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                    </div>

                    <button
                        onClick={handleAddLoanRequest}
                        className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200 hover:opacity-90"
                        style={buttonStyle}
                    >
                        Apply Loan Request
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="py-4 bg-white pb-4 rounded-2xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-700">
                        {renderTableHeader()}
                        <tbody className="w-full">
                            {renderTableBody()}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {hasLoanRequests && (
                    <Pagination
                        currentPage={empLoanRequestList?.currentPage}
                        totalPages={empLoanRequestList?.totalPages}
                        totalItems={empLoanRequestList?.totalRequests}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default LoanRequest;