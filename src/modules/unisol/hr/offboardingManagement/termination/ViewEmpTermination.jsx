import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../../../components/BreadCrumb";
import useEmpTermination from "../../../../../hooks/unisol/offboardingManagement/useEmpTermination";
import { useParams, useNavigate } from "react-router-dom";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useRoles } from "../../../../../hooks/auth/useRoles";
import {
    Calendar,
    User,
    Briefcase,
    DollarSign,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Building,
    Package,
    ArrowLeft,
    Download,
    UserCog,
    Image,
    Eye,
    FileImage,
    ChevronLeft,
    ChevronRight,
    X,
    CheckSquare,
    Square,
    AlertCircle,
    Save,
    Edit,
    Check,
    X as XIcon,
    FileCheck,
    CreditCard,
    ListChecks,
    AlertTriangle,
    Ban
} from "lucide-react";
import dayjs from "dayjs";
import Button from "../../../../../components/Button";
// import toast from "react-hot-toast";

const ViewEmpTermination = () => {
    const { 
        fetchTerminatedEmpById, 
        terminatedEmpById, 
        loading, 
        approveOrRejectTermination, 
        updateTerminatedEmployee 
    } = useEmpTermination();
    const { id } = useParams();
    const navigate = useNavigate();
    const { isSuperAdmin, isHR } = useRoles();
    const role = isSuperAdmin ? "superAdmin" : "hr";
    const [selectedKitIndex, setSelectedKitIndex] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        loanRemarks: "",
        welcomeKits: []
    });
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) fetchTerminatedEmpById({ id, role });
    }, [id]);

    useEffect(() => {
        if (terminatedEmpById) {
            setFormData({
                loanRemarks: terminatedEmpById.loanDetails?.loanRemarks || "",
                welcomeKits: terminatedEmpById.welcomeKits?.map(kit => ({
                    welcomeKitId: kit.welcomeKitId,
                    isReturned: kit.isReturned
                })) || []
            });
        }
    }, [terminatedEmpById]);

    const empId = terminatedEmpById?.employeeDetails?.employeeId;
    console.log("terminatedEmpById", terminatedEmpById)

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return dayjs(dateString).format("DD MMM YYYY");
    };

    // Format date with time
    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        return dayjs(dateString).format("DD MMM YYYY, hh:mm A");
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get status badge styles
    const getStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium";

        switch (status) {
            case "approved":
                return {
                    element: (
                        <span className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
                            <CheckCircle size={14} />
                            Approved
                        </span>
                    ),
                    color: "green"
                };
            case "rejected":
                return {
                    element: (
                        <span className={`${baseClasses} bg-red-100 text-red-800 border border-red-200`}>
                            <XCircle size={14} />
                            Rejected
                        </span>
                    ),
                    color: "red"
                };
            case "pending":
                return {
                    element: (
                        <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`}>
                            <Clock size={14} />
                            Pending
                        </span>
                    ),
                    color: "yellow"
                };
            default:
                return {
                    element: (
                        <span className={`${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`}>
                            {status || "Unknown"}
                        </span>
                    ),
                    color: "gray"
                };
        }
    };

    const handleBackClick = () => {
        navigate(`/offboardingManagement/termination/emp-wise/${empId}`);
    };

    const handleViewKitImages = (kitIndex) => {
        setSelectedKitIndex(kitIndex);
        setSelectedImageIndex(0);
        setImageModalOpen(true);
    };

    const handleNextImage = () => {
        const currentKit = terminatedEmpById.welcomeKits[selectedKitIndex];
        setSelectedImageIndex((prev) =>
            prev < currentKit.photos.length - 1 ? prev + 1 : 0
        );
    };

    const handlePrevImage = () => {
        const currentKit = terminatedEmpById.welcomeKits[selectedKitIndex];
        setSelectedImageIndex((prev) =>
            prev > 0 ? prev - 1 : currentKit.photos.length - 1
        );
    };

    // Handle welcome kit checkbox change
    const handleKitCheckboxChange = (index, welcomeKitId) => {
        const updatedKits = [...formData.welcomeKits];
        const kitIndex = updatedKits.findIndex(kit => kit.welcomeKitId === welcomeKitId);
        
        if (kitIndex !== -1) {
            updatedKits[kitIndex] = {
                ...updatedKits[kitIndex],
                isReturned: !updatedKits[kitIndex].isReturned
            };
            setFormData({
                ...formData,
                welcomeKits: updatedKits
            });
        }
    };

    // Handle loan remarks change
    const handleLoanRemarksChange = (e) => {
        setFormData({
            ...formData,
            loanRemarks: e.target.value
        });
    };

    // Handle approval - FIXED URL ISSUE
    const handleApprove = async () => {
        if (!isSuperAdmin) return;
        
        try {
            setIsSubmitting(true);
            const payload = {
                status: "approve"
            };
            
            // FIX: Pass id directly, not in an object
            await approveOrRejectTermination(id, payload);
            // toast.success("Termination approved successfully!");
            fetchTerminatedEmpById({ id, role });
        } catch (error) {
            // toast.error("Failed to approve termination");
            console.error("Approval error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle rejection - FIXED URL ISSUE
    const handleReject = async () => {
        if (!isSuperAdmin || !rejectionReason.trim()) return;
        
        try {
            setIsSubmitting(true);
            const payload = {
                status: "reject",
                rejectionReason: rejectionReason.trim()
            };
            
            // FIX: Pass id directly, not in an object
            await approveOrRejectTermination(id, payload);
            // toast.success("Termination rejected successfully!");
            setShowRejectModal(false);
            setRejectionReason("");
            fetchTerminatedEmpById({ id, role });
        } catch (error) {
            // toast.error("Failed to reject termination");
            console.error("Rejection error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle form submission for HR updates - FIXED URL ISSUE
    const handleSubmit = async () => {
        if (!isHR) return;
        
        try {
            setIsSubmitting(true);
            const payload = {
                loanRemarks: formData.loanRemarks,
                welcomeKits: formData.welcomeKits
            };
            
            // FIX: Pass id directly, not in an object
            await updateTerminatedEmployee(id, payload);
            // toast.success("Employee details updated successfully!");
            setIsEditing(false);
            fetchTerminatedEmpById({ id, role });
        } catch (error) {
            // toast.error("Failed to update employee details");
            console.error("Update error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if welcome kit is selected in form data
    const isKitSelected = (welcomeKitId) => {
        const kit = formData.welcomeKits.find(k => k.welcomeKitId === welcomeKitId);
        return kit ? kit.isReturned : false;
    };

    // Check if editing is allowed based on status
    const canEdit = isHR && (terminatedEmpById?.status === "approved" || terminatedEmpById?.status === "pending");
    
    // Check if admin can approve/reject
    const showAdminActions = isSuperAdmin && terminatedEmpById?.status === "pending";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoaderSpinner />
            </div>
        );
    }

    if (!terminatedEmpById) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Data Found</h2>
                    <p className="text-gray-600 mb-6">The termination details could not be loaded.</p>
                    <button
                        onClick={handleBackClick}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const employeeDetails = terminatedEmpById.employeeDetails;
    const terminationDetails = terminatedEmpById.TerminationDetalis;
    const loanDetails = terminatedEmpById.loanDetails;
    const isRejected = terminatedEmpById.status === "rejected";
    const isApproved = terminatedEmpById.status === "approved";
    const isPending = terminatedEmpById.status === "pending";

    return (
        <>
            <div className="min-h-screen">
                <BreadCrumb
                    linkText={[
                        { text: "Offboarding Management" },
                        { text: "Employee Termination", href: "/offboardingManagement/termination" },
                        { text: "Emp's Termination Data", href: `/offboardingManagement/termination/emp-wise/${empId}` },
                        { text: "View Termination Details" }
                    ]}
                />

                <div className="max-w-7xl mx-auto space-y-4">
                    {/* Main Content Card */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* Card Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={employeeDetails.employeePhoto}
                                        alt={employeeDetails.employeeName}
                                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                                    />
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {employeeDetails.employeeName}
                                        </h1>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="inline-flex items-center gap-1.5 text-gray-600">
                                                <User size={16} />
                                                <span className="font-medium">{employeeDetails.employeeId}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-gray-600">
                                                <Briefcase size={16} />
                                                <span>{employeeDetails.designation}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-gray-600">
                                                <Building size={16} />
                                                <span>{employeeDetails.department}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {getStatusBadge(terminatedEmpById.status).element}
                                    <span className="text-sm text-gray-500">
                                        {terminatedEmpById.superAdminApprovalStatus === "approved"
                                            ? "Approved by Admin"
                                            : terminatedEmpById.superAdminApprovalStatus === "pending"
                                                ? "Pending Admin Approval"
                                                : "Rejected by Admin"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Grid Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - Employee Details */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Termination Details Card */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText className="text-blue-600" size={24} />
                                            <h2 className="text-xl font-bold text-gray-900">Termination Details</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Termination Code</label>
                                                    <p className="mt-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-mono font-bold">
                                                        {terminationDetails.terminationCode}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Offboarding Type</label>
                                                    <p className="mt-1 text-gray-900 font-medium">{terminationDetails.offboardingType}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Handled By HR</label>
                                                    <div className="mt-1 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                        <UserCog size={16} className="text-gray-500" />
                                                        <span className="text-gray-900 font-medium">{terminationDetails.hrName}</span>
                                                        <span className="text-xs text-gray-500">(ID: {terminationDetails.hr_id})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Termination Date</label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Calendar size={16} className="text-gray-500" />
                                                        <span className="text-gray-900 font-medium">
                                                            {formatDate(terminationDetails.terminationDate)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Effective Date</label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Calendar size={16} className="text-gray-500" />
                                                        <span className="text-gray-900 font-medium">
                                                            {formatDate(terminationDetails.effectiveDate)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Notice Period</label>
                                                    <p className="mt-1 text-gray-900">
                                                        {terminationDetails.noticePeriodApplicable
                                                            ? "Applicable"
                                                            : "Not Applicable"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reason and Remarks */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Termination Reason</label>
                                                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                                    <p className="text-gray-700 font-medium">{terminationDetails.terminationReason}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Additional Remarks</label>
                                                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                                                    <p className="text-gray-700 italic">
                                                        {terminationDetails.terminationRemark || "No additional remarks provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rejection Reason Section - Only show if rejected */}
                                        {isRejected && terminatedEmpById.rejectionReason && (
                                            <div className="mt-6 pt-6 border-t border-red-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <AlertTriangle className="text-red-600" size={24} />
                                                    <h3 className="text-lg font-bold text-red-900">Rejection Reason</h3>
                                                </div>
                                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-red-800 font-medium">
                                                        "{terminatedEmpById.rejectionReason}"
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                                                        <Ban size={14} />
                                                        <span>This termination request has been rejected by the administrator.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Employment Details Card */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Briefcase className="text-green-600" size={24} />
                                            <h2 className="text-xl font-bold text-gray-900">Employment Details</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Joining Date</label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Calendar size={16} className="text-gray-500" />
                                                        <span className="text-gray-900 font-medium">
                                                            {formatDate(employeeDetails.joiningDate)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Employment Type</label>
                                                    <p className="mt-1 text-gray-900">{employeeDetails.employmentType}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Designation</label>
                                                    <p className="mt-1 text-gray-900 font-medium">{employeeDetails.designation}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Department</label>
                                                    <p className="mt-1 text-gray-900">{employeeDetails.department}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Basic Salary</label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <DollarSign size={16} className="text-gray-500" />
                                                        <span className="text-gray-900 font-medium">
                                                            ₹{employeeDetails.basicSalary}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Created On</label>
                                                    <p className="mt-1 text-gray-900">
                                                        {formatDateTime(terminatedEmpById.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Loan Details Card - MOVED HERE */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="text-purple-600" size={24} />
                                                <h2 className="text-xl font-bold text-gray-900">Loan Details</h2>
                                            </div>
                                            {canEdit && !isEditing && (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                    disabled={isRejected}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Loan Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign size={18} className="text-purple-600" />
                                                    <span className="text-sm font-medium text-gray-600">Total Approved</span>
                                                </div>
                                                <p className="text-2xl font-bold text-purple-800">
                                                    {formatCurrency(loanDetails?.totalApprovedLoanAmount || 0)}
                                                </p>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ListChecks size={18} className="text-blue-600" />
                                                    <span className="text-sm font-medium text-gray-600">Active Loans</span>
                                                </div>
                                                <p className="text-2xl font-bold text-blue-800">
                                                    {loanDetails?.activeLoanDetails?.length || 0}
                                                </p>
                                            </div>
                                            <div className={`p-4 rounded-lg border ${loanDetails?.loanRepaymentActivityStatus === "Active" 
                                                ? 'bg-yellow-50 border-yellow-100' 
                                                : 'bg-green-50 border-green-100'}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock size={18} className={loanDetails?.loanRepaymentActivityStatus === "Active" 
                                                        ? 'text-yellow-600' 
                                                        : 'text-green-600'} />
                                                    <span className="text-sm font-medium text-gray-600">Repayment Status</span>
                                                </div>
                                                <p className={`text-lg font-bold ${loanDetails?.loanRepaymentActivityStatus === "Active" 
                                                    ? 'text-yellow-800' 
                                                    : 'text-green-800'}`}>
                                                    {loanDetails?.loanRepaymentActivityStatus || "Not Started"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Active Loans Table */}
                                        {loanDetails?.activeLoanDetails?.length > 0 ? (
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                    <ListChecks size={18} className="text-gray-600" />
                                                    Active Loan Details
                                                </h3>
                                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Loan Amount</th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tenure</th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Deduction Start</th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {loanDetails.activeLoanDetails.map((loan, index) => (
                                                                <tr key={loan._id} className="hover:bg-gray-50">
                                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <span className="font-bold text-gray-900">{formatCurrency(loan.loanAmount)}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                            {loan.repaymentTenureInMonths} months
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar size={14} className="text-gray-500" />
                                                                            <span className="text-gray-700">{loan.deductionStartMonth}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${loan.status === "approved" 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : loan.status === "pending"
                                                                            ? 'bg-yellow-100 text-yellow-800'
                                                                            : 'bg-gray-100 text-gray-800'}`}>
                                                                            {loan.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 mb-6 bg-gray-50 rounded-lg border border-gray-200">
                                                <CreditCard size={48} className="text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-600 font-medium">No active loans found</p>
                                                <p className="text-gray-500 text-sm mt-1">This employee has no outstanding loans</p>
                                            </div>
                                        )}

                                        {/* Loan Remarks Section */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                    <FileText size={18} className="text-gray-600" />
                                                    Loan Remarks
                                                    {canEdit && (
                                                        <span className="ml-2 text-xs font-normal text-gray-500">
                                                            {isEditing ? "(Editable)" : isRejected ? "(Cannot edit - Rejected)" : "(View only)"}
                                                        </span>
                                                    )}
                                                </label>
                                            </div>
                                            
                                            {isEditing ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={formData.loanRemarks}
                                                        onChange={handleLoanRemarksChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                        rows="4"
                                                        placeholder="Enter loan remarks or updates..."
                                                    />
                                                    <div className="text-sm text-gray-500">
                                                        Note: These remarks will be visible in the final settlement report.
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`p-4 rounded-lg ${loanDetails?.loanRemarks 
                                                    ? 'bg-gray-50 border border-gray-200' 
                                                    : 'bg-yellow-50 border border-dashed border-yellow-200'}`}>
                                                    <p className={`${loanDetails?.loanRemarks ? 'text-gray-700' : 'text-yellow-700 italic'}`}>
                                                        {loanDetails?.loanRemarks || "No loan remarks have been added yet."}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Side Cards */}
                                <div className="space-y-6">
                                    {/* Welcome Kit Card with Checkboxes */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="text-orange-600" size={24} />
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    Welcome Kits {terminatedEmpById.welcomeKits?.length ? `(${terminatedEmpById.welcomeKits.length})` : ''}
                                                </h2>
                                            </div>
                                            {canEdit && !isEditing && (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                    disabled={isRejected}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                        </div>

                                        {terminatedEmpById.welcomeKits?.length > 0 ? (
                                            <div className="space-y-4">
                                                {terminatedEmpById.welcomeKits.map((kit, index) => (
                                                    <div key={kit._id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-semibold text-gray-900">{kit.name}</h3>
                                                                    {isEditing && (
                                                                        <button
                                                                            onClick={() => handleKitCheckboxChange(index, kit.welcomeKitId)}
                                                                            className={`p-1 rounded ${isKitSelected(kit.welcomeKitId) 
                                                                                ? 'text-green-600 bg-green-50' 
                                                                                : 'text-gray-400 hover:text-gray-600'}`}
                                                                        >
                                                                            {isKitSelected(kit.welcomeKitId) ? (
                                                                                <CheckSquare size={18} />
                                                                            ) : (
                                                                                <Square size={18} />
                                                                            )}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{kit.description}</p>
                                                            </div>
                                                            {!isEditing && (
                                                                <span className={`px-2 py-1 rounded text-xs font-medium ${kit.isReturned
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"}`}>
                                                                    {kit.isReturned ? "Returned" : "Pending"}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Kit Images */}
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-600">Images ({kit.photos?.length || 0})</span>
                                                                {kit.photos?.length > 0 && (
                                                                    <button
                                                                        onClick={() => handleViewKitImages(index)}
                                                                        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                                                                    >
                                                                        <Eye size={14} />
                                                                        View All
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {kit.photos?.length > 0 ? (
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    {kit.photos.slice(0, 3).map((photo, photoIndex) => (
                                                                        <div key={photoIndex} className="aspect-square rounded overflow-hidden border border-gray-200">
                                                                            <img
                                                                                src={photo}
                                                                                alt={`${kit.name} - Image ${photoIndex + 1}`}
                                                                                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                                                                onClick={() => handleViewKitImages(index)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    {kit.photos.length > 3 && (
                                                                        <div
                                                                            className="aspect-square rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 cursor-pointer hover:border-orange-400 hover:text-orange-500"
                                                                            onClick={() => handleViewKitImages(index)}
                                                                        >
                                                                            <div className="text-center">
                                                                                <FileImage size={20} className="mx-auto mb-1" />
                                                                                <span className="text-xs font-medium">+{kit.photos.length - 3} more</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="text-center py-4 border border-dashed border-gray-300 rounded">
                                                                    <Image size={24} className="text-gray-400 mx-auto mb-2" />
                                                                    <p className="text-sm text-gray-500">No images available</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                                                <Package size={48} className="text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-600 font-medium">No welcome kits assigned</p>
                                                <p className="text-gray-500 text-sm mt-1">This employee has no welcome kits to return</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Final Settlement Card */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileCheck className="text-indigo-600" size={24} />
                                            <h2 className="text-xl font-bold text-gray-900">Final Settlement</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-600">Settlement Status</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${terminatedEmpById?.finalSettlement?.settlementStatus === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : isRejected 
                                                    ? "bg-gray-100 text-gray-800"
                                                    : "bg-yellow-100 text-yellow-800"}`}>
                                                    {isRejected ? "Cancelled" : terminatedEmpById?.finalSettlement?.settlementStatus || "Pending"}
                                                </span>
                                            </div>

                                            <div className={`p-4 rounded-lg ${isRejected 
                                                ? 'bg-gray-50 border border-gray-200' 
                                                : 'bg-blue-50 border border-blue-100'}`}>
                                                <p className={`text-sm ${isRejected ? 'text-gray-700' : 'text-blue-700'}`}>
                                                    {isRejected 
                                                        ? "Settlement process has been cancelled due to termination rejection."
                                                        : terminatedEmpById?.finalSettlement?.settlementStatus === "completed"
                                                            ? "Final settlement has been completed and processed."
                                                            : "Final settlement is pending. Please process after all clearances."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Summary Card */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Status Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">HR Status</span>
                                                {getStatusBadge(terminatedEmpById.status).element}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Admin Status</span>
                                                {getStatusBadge(terminatedEmpById.superAdminApprovalStatus).element}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Settlement</span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${terminatedEmpById?.finalSettlement?.settlementStatus === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : isRejected 
                                                    ? "bg-gray-100 text-gray-800"
                                                    : "bg-yellow-100 text-yellow-800"}`}>
                                                    {isRejected ? "Cancelled" : terminatedEmpById?.finalSettlement?.settlementStatus || "Pending"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
                                <Button
                                    variant={3}
                                    type="button"
                                    text="Back"
                                    onClick={handleBackClick}
                                    disabled={isSubmitting}
                                />
                                
                                {showAdminActions && (
                                    <>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Processing..." : "Reject Termination"}
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Processing..." : "Approve Termination"}
                                        </button>
                                    </>
                                )}

                                {canEdit && !isRejected && (
                                    <>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                    disabled={isSubmitting}
                                                >
                                                    <XIcon size={18} className="inline mr-2" />
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSubmit}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        "Saving..."
                                                    ) : (
                                                        <>
                                                            <Save size={18} className="inline mr-2" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                disabled={isRejected}
                                            >
                                                <Edit size={18} className="inline mr-2" />
                                                Edit Details
                                            </button>
                                        )}
                                    </>
                                )}

                                {isRejected && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
                                        <AlertTriangle size={18} />
                                        <span className="font-medium">This termination has been rejected</span>
                                    </div>
                                )}

                                {isApproved && !canEdit && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                                        <CheckCircle size={18} />
                                        <span className="font-medium">Termination Approved</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {imageModalOpen && selectedKitIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {terminatedEmpById.welcomeKits[selectedKitIndex].name} - Images
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {terminatedEmpById.welcomeKits[selectedKitIndex].description}
                                </p>
                            </div>
                            <button
                                onClick={() => setImageModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Main Image */}
                        <div className="relative h-96 bg-gray-100">
                            <img
                                src={terminatedEmpById.welcomeKits[selectedKitIndex].photos[selectedImageIndex]}
                                alt={`Image ${selectedImageIndex + 1}`}
                                className="w-full h-full object-contain"
                            />

                            {/* Navigation Buttons */}
                            {terminatedEmpById.welcomeKits[selectedKitIndex].photos.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black bg-opacity-70 text-white rounded-full text-sm">
                                {selectedImageIndex + 1} / {terminatedEmpById.welcomeKits[selectedKitIndex].photos.length}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {terminatedEmpById.welcomeKits[selectedKitIndex].photos.map((photo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${selectedImageIndex === index
                                            ? 'border-blue-500'
                                            : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img
                                            src={photo}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="text-red-600" size={24} />
                                <h3 className="text-lg font-bold text-gray-900">Reject Termination Request</h3>
                            </div>
                            
                            <p className="text-gray-600 mb-4">
                                Please provide a reason for rejecting this termination request.
                            </p>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rejection Reason *
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    rows="4"
                                    placeholder="Enter rejection reason..."
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason("");
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting || !rejectionReason.trim()}
                                >
                                    {isSubmitting ? "Processing..." : "Confirm Reject"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewEmpTermination;