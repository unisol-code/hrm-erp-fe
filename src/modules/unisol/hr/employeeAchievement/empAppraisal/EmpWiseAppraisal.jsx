import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaUser,
    FaUserTie,
    FaCalendarAlt,
    FaIdCard,
    FaBriefcase,
    FaChartLine,
    FaStar,
    FaRegClock,
    FaCheckCircle
} from "react-icons/fa";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { Eye } from "lucide-react";
import Select from "react-select";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import useLeadershipAppraisal from "../../../../../hooks/unisol/empAchievement/useLeadershipAppraisal";
import EmpWiseFinalRating from "./setAppraisal/EmpWiseFinalRating";
// import EmpWiseFinalRating from "./EmpWiseFinalRating";

// Custom Tooltip component to replace MUI
const Tooltip = ({ children, title }) => (
    <div className="relative group">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {title}
        </div>
    </div>
);

// Custom IconButton to replace MUI
const IconButton = ({ children, onClick, className = "" }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-full transition-all duration-200 hover:bg-opacity-20 ${className}`}
    >
        {children}
    </button>
);

const EmpWiseAppraisal = () => {
    const {
        loading,
        empWiseAppraisalList,
        fetchEmpWiseAppraisalList,
        fetchEmpWiseAppraisalYear,
        empWiseAppraisalYear, fetchEmpWiseAppraisalFinalRating,
        empWiseAppraisalFinalRating,
    } = useLeadershipAppraisal();
    const navigate = useNavigate();
    const { id } = useParams();
    const { theme } = useTheme();

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedCycle, setSelectedCycle] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [activeTab, setActiveTab] = useState("business");
    const [hoveredRow, setHoveredRow] = useState(null);
    const [isFinalRatingOpen, setIsFinalRatingOpen] = useState(false);

    // Fetch available years when component mounts
    useEffect(() => {
        if (id) {
            fetchEmpWiseAppraisalYear(id);
        }
    }, [id]);

    console.log("empWiseAppraisalList", empWiseAppraisalList)
    // Fetch appraisal data when filters change
    useEffect(() => {
        if (id) {
            const params = {
                id,
                year: selectedYear,
                cycle1: selectedCycle === "cycle1" ? true : undefined,
                cycle2: selectedCycle === "cycle2" ? true : undefined
            };
            fetchEmpWiseAppraisalList(params);
        }
    }, [id, selectedYear, selectedCycle]);

    useEffect(() => {
        if (isFinalRatingOpen && id && selectedYear && selectedCycle) {
            fetchEmpWiseAppraisalFinalRating(
                id,
                selectedYear,
                selectedCycle === "cycle1",
                selectedCycle === "cycle2"
            );
        }
    }, [isFinalRatingOpen, id, selectedYear, selectedCycle]);

    const handleCloseFinalRating = () => {
        setIsFinalRatingOpen(false);
    };

    // Extract employee data from the first appraisal item
    useEffect(() => {
        if (empWiseAppraisalList?.employee) {
            setEmployeeData(empWiseAppraisalList.employee);
        }
    }, [empWiseAppraisalList]);

    // Year options - use fetched years or generate default
    const yearOptions = empWiseAppraisalYear?.length > 0
        ? empWiseAppraisalYear.map(year => ({ value: year, label: year.toString() }))
        : Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => ({
            value: year,
            label: year.toString()
        }));

    // Cycle options
    const cycleOptions = [
        { value: "cycle1", label: "Cycle 1 (Jan-Jun)" },
        { value: "cycle2", label: "Cycle 2 (Jul-Dec)" },
    ];

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Filter Component with theme colors
    const FilterSection = () => (
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
            <Select
                options={yearOptions}
                value={yearOptions.find(opt => opt.value === selectedYear)}
                onChange={(option) => setSelectedYear(option ? option.value : currentYear)}
                placeholder="Select Year"
                menuPortalTarget={document.body}
                styles={{
                    container: (base) => ({ ...base, minWidth: 120 }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({
                        ...base,
                        borderColor: theme.secondaryColor,
                        borderRadius: '0.75rem',
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: theme.primaryColor,
                            boxShadow: `0 0 0 2px ${theme.primaryColor}20`
                        }
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? theme.primaryColor : state.isFocused ? `${theme.primaryColor}20` : 'white',
                        color: state.isSelected ? 'white' : 'inherit',
                        '&:active': {
                            backgroundColor: theme.primaryColor
                        }
                    })
                }}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: theme.primaryColor,
                        primary25: `${theme.primaryColor}20`,
                    },
                })}
            />
            <Select
                options={cycleOptions}
                value={cycleOptions.find(opt => opt.value === selectedCycle)}
                onChange={(option) => setSelectedCycle(option ? option.value : null)}
                placeholder="Select Cycle"
                isClearable
                menuPortalTarget={document.body}
                styles={{
                    container: (base) => ({ ...base, minWidth: 180 }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({
                        ...base,
                        borderColor: theme.secondaryColor,
                        borderRadius: '0.75rem',
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: theme.primaryColor,
                            boxShadow: `0 0 0 2px ${theme.primaryColor}20`
                        }
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? theme.primaryColor : state.isFocused ? `${theme.primaryColor}20` : 'white',
                        color: state.isSelected ? 'white' : 'inherit',
                        '&:active': {
                            backgroundColor: theme.primaryColor
                        }
                    })
                }}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: theme.primaryColor,
                        primary25: `${theme.primaryColor}20`,
                    },
                })}
            />

            {/* View Final Rating Button with Tooltip */}
            <div className="relative group">
                <button
                    onClick={() => setIsFinalRatingOpen(true)}
                    disabled={!selectedCycle}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${selectedCycle
                        ? 'text-white hover:opacity-90 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    style={{
                        backgroundColor: selectedCycle ? theme.primaryColor : undefined,
                        boxShadow: selectedCycle ? `0 2px 8px ${theme.primaryColor}40` : 'none'
                    }}
                >
                    <FaStar className="w-4 h-4" />
                    View Final Rating
                </button>

                {/* Tooltip message for disabled state */}
                {!selectedCycle && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                        <div className="flex items-center gap-2">
                            <FaRegClock className="w-4 h-4 text-yellow-300" />
                            <span>Please select a cycle period first</span>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                )}
            </div>
        </div>
    );

    const FinalRatingOverlay = () => {
        if (!isFinalRatingOpen) return null;

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={handleCloseFinalRating}
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div
                        className="px-6 py-4 flex justify-between items-center border-b"
                        style={{
                            background: `linear-gradient(135deg, ${theme.primaryColor}10, ${theme.secondaryColor}10)`,
                            borderColor: theme.secondaryColor
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${theme.primaryColor}20` }}
                            >
                                <FaStar className="w-5 h-5" style={{ color: theme.primaryColor }} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Final Rating Details</h2>
                                <p className="text-sm text-gray-500">
                                    {employeeData?.fullName} • {selectedYear} • {selectedCycle === 'cycle1' ? 'Cycle 1 (Jan-Jun)' : 'Cycle 2 (Jul-Dec)'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCloseFinalRating}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                        <EmpWiseFinalRating
                            data={empWiseAppraisalFinalRating}
                            loading={loading}
                            theme={theme}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const onView = (id, type) => {
        const base = "/hr/employeeAchievement/appraisalList";

        const route =
            type === "business"
                ? `${base}/viewAppraisalDetails/${id}`
                : `${base}/empWiseAppraisal/view-leadership-Appraisal/${id}`;

        navigate(route);
    };

    const AppraisalTable = ({ type = "business" }) => {
        const appraisalData =
            type === "business"
                ? empWiseAppraisalList?.businessAppraisals || []
                : empWiseAppraisalList?.leadershipAppraisals || [];

        if (appraisalData.length === 0) {
            return (
                <div className="text-center py-16 px-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                        <FaRegClock className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-2">No Appraisal Data Available</p>
                    <p className="text-sm text-gray-400">
                        {selectedYear && selectedCycle
                            ? `No ${type} appraisal data found for the selected filters`
                            : "Please select filters to view appraisal data"}
                    </p>
                </div>
            );
        }

        const getStatusColorClass = (status) => {
            switch (status) {
                case 'submitted': return 'text-green-600 bg-green-100';
                case 'pending': return 'text-yellow-600 bg-yellow-100';
                default: return 'text-red-600 bg-red-100';
            }
        };

        return (
            <div className="w-full">
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{ backgroundColor: theme.secondaryColor }}>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700">#</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Cycle 1</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Cycle 2</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Year</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                    {type === "business" ? "Business Rating" : "GLP Rating"}
                                </th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appraisalData.map((data, index) => {
                                const isHovered = hoveredRow === data._id;
                                const rating = type === "business" ? data.totalBusinessRating : data.totalFinalGLPRating;
                                const statusColorClass = getStatusColorClass(data.finalRatingStatus);

                                return (
                                    <tr
                                        key={data._id}
                                        className={`border-b border-gray-100 transition-all duration-200 ${isHovered ? 'scale-[1.01] shadow-md' : 'bg-white'
                                            }`}
                                        style={{
                                            backgroundColor: isHovered ? `${theme.primaryColor}10` : 'white',
                                            boxShadow: isHovered ? `0 4px 12px ${theme.primaryColor}20` : 'none'
                                        }}
                                        onMouseEnter={() => setHoveredRow(data._id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(data.date)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {data.cycle1 ? (
                                                <Tooltip title="Completed">
                                                    <div className="inline-flex items-center justify-center">
                                                        <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl animate-pulse" />
                                                    </div>
                                                </Tooltip>
                                            ) : (
                                                <span className="text-gray-300 text-xl">−</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {data.cycle2 ? (
                                                <Tooltip title="Completed">
                                                    <div className="inline-flex items-center justify-center">
                                                        <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl animate-pulse" />
                                                    </div>
                                                </Tooltip>
                                            ) : (
                                                <span className="text-gray-300 text-xl">−</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-700">{data.year}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium`}>
                                                    <span>{rating || '-'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColorClass}`}>
                                                {data.finalRatingStatus === 'submitted' && <FaCheckCircle className="w-3 h-3" />}
                                                {data.finalRatingStatus || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    onClick={() => onView(data._id, type)}
                                                    style={{
                                                        backgroundColor: isHovered ? theme.primaryColor : 'transparent',
                                                        color: isHovered ? 'white' : theme.primaryColor
                                                    }}
                                                    className="hover:scale-110 transition-transform"
                                                >
                                                    <Eye size={18}
                                                        style={{ color: theme.primaryColor }} />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <Breadcrumb
                linkText={[
                    { text: "Employee Achievement" },
                    { text: "Employee's Appraisal List", href: "/hr/employeeAchievement/appraisalList" },
                    { text: "Employee Wise Appraisal" },
                ]}
            />

            <div className="pb-8">
                {loading && !employeeData ? (
                    <div className="flex justify-center items-center w-full min-h-[60vh]">
                        <LoaderSpinner />
                    </div>
                ) : employeeData ? (
                    <div className="space-y-4">
                        {/* Employee Profile Card */}
                        <div
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border"
                            style={{ borderColor: theme.secondaryColor }}
                        >
                            {/* Header with theme gradient */}
                            <div
                                className="h-24"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                                }}
                            />

                            <div className="px-4 pb-4 relative">
                                {/* Profile Image - Positioned to overlap header */}
                                <div className="flex flex-col md:flex-row gap-8 -mt-12">
                                    <div className="flex-shrink-0">
                                        <div className="relative group">
                                            {employeeData.photo ? (
                                                <img
                                                    src={employeeData.photo}
                                                    alt={employeeData.fullName}
                                                    className="w-32 h-32 rounded-2xl object-cover shadow-xl border-4 border-white transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div
                                                    className="w-32 h-32 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transition-transform group-hover:scale-105"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${theme.secondaryColor}, ${theme.primaryColor})`
                                                    }}
                                                >
                                                    <FaUser className="w-16 h-16 text-white" />
                                                </div>
                                            )}
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-2 border-white" />
                                        </div>
                                    </div>

                                    <div className="flex-grow pt-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                                                    {employeeData.fullName}
                                                </h1>
                                                <div className="flex items-center gap-3 text-gray-500">
                                                    <FaIdCard className="w-4 h-4" style={{ color: theme.accentColor }} />
                                                    <span className="font-medium">{employeeData.employeeId}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                    <FaBriefcase className="w-4 h-4" style={{ color: theme.accentColor }} />
                                                    <span>{employeeData.designation}</span>
                                                </div>
                                            </div>

                                            {/* Quick Stats */}
                                            <div className="flex gap-3">
                                                <div className="px-4 py-2 rounded-lg bg-gray-100">
                                                    <p className="text-xs text-gray-500">Years of Service</p>
                                                    <p className="text-lg font-bold text-gray-800">
                                                        {employeeData.yearsOfService}
                                                    </p>
                                                </div>
                                                <div className="px-4 py-2 rounded-lg bg-gray-100">
                                                    <p className="text-xs text-gray-500">Basic Salary</p>
                                                    <p className="text-lg font-bold text-gray-800">
                                                        {employeeData.basicSalary}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                                <FaUserTie className="w-5 h-5" style={{ color: theme.primaryColor }} />
                                                <div>
                                                    <p className="text-xs text-gray-500">Payroll Grade</p>
                                                    <p className="font-medium text-gray-800">
                                                        {employeeData.payrollGrade || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                                <FaBriefcase className="w-5 h-5" style={{ color: theme.primaryColor }} />
                                                <div>
                                                    <p className="text-xs text-gray-500">Employment Type</p>
                                                    <p className="font-medium text-gray-800">
                                                        {employeeData.employmentType || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                                <FaCalendarAlt className="w-5 h-5" style={{ color: theme.primaryColor }} />
                                                <div>
                                                    <p className="text-xs text-gray-500">Joining Date</p>
                                                    <p className="font-medium text-gray-800">
                                                        {formatDate(employeeData.joiningDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs and Filters in one row */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Tabs */}
                            <div
                                className="bg-white rounded-xl p-1 shadow-sm inline-flex self-start border"
                                style={{ borderColor: theme.secondaryColor }}
                            >
                                <button
                                    onClick={() => setActiveTab("business")}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === "business"
                                        ? "text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    style={{
                                        backgroundColor: activeTab === "business" ? theme.primaryColor : 'transparent'
                                    }}
                                >
                                    <FaChartLine className="w-4 h-4" />
                                    Business Appraisal
                                </button>
                                <button
                                    onClick={() => setActiveTab("leadership")}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === "leadership"
                                        ? "text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    style={{
                                        backgroundColor: activeTab === "leadership" ? theme.primaryColor : 'transparent'
                                    }}
                                >
                                    <FaStar className="w-4 h-4" />
                                    Leadership Appraisal
                                </button>
                            </div>

                            {/* Filters */}
                            <FilterSection />
                        </div>

                        {/* Appraisal Tables */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            {activeTab === "business" ? (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaChartLine className="w-5 h-5" style={{ color: theme.primaryColor }} />
                                        <h2 className="text-lg font-semibold text-gray-700">
                                            Business Appraisal History
                                        </h2>
                                    </div>
                                    <AppraisalTable type="business" />
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaStar className="w-5 h-5" style={{ color: theme.primaryColor }} />
                                        <h2 className="text-lg font-semibold text-gray-700">
                                            Leadership Appraisal History
                                        </h2>
                                    </div>
                                    <AppraisalTable type="leadership" />
                                </div>
                            )}
                        </div>

                        <FinalRatingOverlay />
                    </div>
                ) : (
                    <div className="flex justify-center items-center w-full min-h-[60vh]">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-4">
                                <FaUser className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-xl font-medium text-gray-600 mb-2">No Employee Data Found</p>
                            <p className="text-gray-400">The requested employee information is not available</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmpWiseAppraisal;