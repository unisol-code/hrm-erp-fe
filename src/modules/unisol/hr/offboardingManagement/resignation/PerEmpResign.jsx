import React, { useEffect, useState, useMemo } from 'react'
import { useTheme } from '../../../../../hooks/theme/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
import useDebounce from '../../../../../hooks/debounce/useDebounce';
import { useRoles } from '../../../../../hooks/auth/useRoles';
import BreadCrumb from '../../../../../components/BreadCrumb';
import Pagination from '../../../../../components/Pagination';
import LoaderSpinner from '../../../../../components/LoaderSpinner';
import { Eye } from 'lucide-react';
import useEmpResignRequest from '../../../../../hooks/unisol/offboardingManagement/useEmpResign';


const PerEmpResign = () => {

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
    const { fetchParticularEmpResignReqList, particularEmpResignReqList, loading } = useEmpResignRequest();

    useEffect(() => {
        if (employeeId) {
            fetchParticularEmpResignReqList(employeeId, page, limit, debouncedSearch, role, status);
        }
    }, [employeeId, page, limit, debouncedSearch, role, status]);

    const handlePageChange = (newPage) => setPage(newPage);

    const handleItemsPerPageChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };
     const handleViewDetails = (_id) => {
       
        navigate(`/offboardingManagement/resignation/viewresignation/${_id}`);
    }

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
            'rejected': 'text-red-600 bg-red-50',
        };

        const baseClass = colorClasses[statusLower] || 'text-slate-600 bg-slate-50';
        return `${baseClass} px-3 py-1 rounded-full`;
    };
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

    const renderTableRows = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={7} className="py-8 text-center">
                        <div className="flex justify-center">
                            <LoaderSpinner />
                        </div>
                    </td>
                </tr>
            );
        }

        if (!particularEmpResignReqList?.data?.length) {
            return (
                <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                        No data found
                    </td>
                </tr>
            );
        }

        return particularEmpResignReqList.data.map((resignation, index) => (
            <tr
                key={resignation._id}
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
                        {resignation.resignationCode || "-"}
                    </span>
                </td>

                <td className="px-6 py-4">
                    {resignation.resignationReason}
                </td>
                <td className="px-6 py-4 text-center">
                    {formatDate(resignation.resignationDate)}
                </td>
                <td className="px-6 py-4 text-center">
                    <span className={getStatusColor(resignation.status)}>
                        {resignation.status}
                    </span>
                </td>
                <td className="px-6 py-4 text-center">
                    <button
                        onClick={() => handleViewDetails(resignation._id)}
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
                    { text: "Offboarding Management" },
                    { text: "Employee Resignation", href: "/offboardingManagement/resignation" },
                    { text: `${particularEmpResignReqList.data?.[0]?.fullName || 'Employee'}'s Resignation Requests` }
                ]}
            />

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl overflow-hidden" style={themeStyles.cardShadow}>
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-100" style={themeStyles.headerBg}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                                {particularEmpResignReqList?.data?.[0].fullName || 'Employee'}'s Resignation Requests
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {particularEmpResignReqList?.data?.[0]?.employeeName ||
                                    "View and manage individual employee resignation applications"}
                            </p>
                        </div>


                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xm text-gray-700" style={themeStyles.tableHeaderBg}>
                            <tr>
                                <th className="px-6 py-4 text-center">
                                    Sr. No.
                                </th>
                                <th className="px-6 py-4">
                                    Resignation ID
                                </th>
                                <th className="px-6 py-4">
                                    Reason of Resign
                                </th>
                                <th className="px-6 py-4 text-center">
                                    Request Date
                                </th>
                                <th className="px-6 py-4 text-center">
                                    Status
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


                {!loading && particularEmpResignReqList?.data?.length > 0 && (
                    <Pagination
                        currentPage={particularEmpResignReqList?.pagination?.page}
                        totalPages={particularEmpResignReqList?.pagination?.totalPages}
                        totalItems={particularEmpResignReqList?.pagination?.total}
                        itemsPerPage={limit}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </div>
        </div>
    );
}

export default PerEmpResign;