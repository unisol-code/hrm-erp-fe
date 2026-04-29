import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserMinus, Calendar, User, FileText,
  Clock, Briefcase, Building, X, AlertCircle, ArrowLeft, CheckCircle, AlertTriangle,
  Package, Gift
} from "lucide-react";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useEmpResignRequest from "../../../../../hooks/unisol/offboardingManagement/useEmpResign";
import { useRoles } from "../../../../../hooks/auth/useRoles";

const ViewResignationHR = () => {
  const {
    empResignReqDetailToAdmin,
    fetchEmpResignReqDetailToAdmin,
    approveOrRejectResignRequest,
    loading
  } = useEmpResignRequest();
  const [actionLoading, setActionLoading] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : "hr";

  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEmpResignReqDetailToAdmin(id, role);
    }
  }, [id, role]);

  if (loading || !empResignReqDetailToAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: theme.primaryColor, borderTopColor: 'transparent' }}>
          </div>
          <p className="text-slate-600">Loading resignation details...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCurrentStatus = () => {
    if (isSuperAdmin) {
      return empResignReqDetailToAdmin?.superAdminApprovalStatus || "pending";
    } else if (isHR) {
      return empResignReqDetailToAdmin?.hrApprovalStatus || "pending";
    }
    return empResignReqDetailToAdmin?.status || "pending";
  };

  const canTakeAction = () => {
    const currentStatus = getCurrentStatus();
    return currentStatus === "pending";
  };

  const isRejected = () => {
    const currentStatus = getCurrentStatus();
    return currentStatus === "rejected";
  };

  const handleAction = async (status) => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const data = {
        role,
        status
      };

      if (status === "reject") {
        if (!rejectionReason.trim()) {
          toast.error("Please provide a rejection reason");
          setActionLoading(false);
          return;
        }
        data.rejectionReason = rejectionReason;
      }

      await approveOrRejectResignRequest(id, data);
      await fetchEmpResignReqDetailToAdmin(id, role);
      setShowRejectPopup(false);
      setRejectionReason("");

    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = () => {
    setShowRejectPopup(true);
  };

  const handleApprove = () => {
    handleAction("approve");
  };

  const handlePassToSuperAdmin = () => {
    handleAction("passToSuperAdmin");
  };

  const handleClosePopup = () => {
    setShowRejectPopup(false);
    setRejectionReason("");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const InfoField = ({ label, value, icon: Icon, className = "" }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {label}
      </label>
      <div className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm ${className}`}>
        {value || "-"}
      </div>
    </div>
  );

  const SectionHeader = ({ number, title, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-lg">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-lg shadow-sm"
        style={{ backgroundColor: theme.primaryColor }}
      >
        {number}
      </div>
      <div className="flex items-center gap-3">
        {Icon && <Icon size={24} style={{ color: theme.primaryColor }} />}
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
          {title}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );

  // Welcome Kit Component with proper image handling
  const WelcomeKitItem = ({ item, index }) => {
    const isReturned = item.isReturned;
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    return (
      <div className="flex items-start gap-5 p-5 rounded-xl border-2 border-slate-200 transition-all duration-200 "
        style={{ backgroundColor: "#f8fafc" }}
      >
        {/* Item Image */}
        <div className="flex-shrink-0">
          {item.photo && !imageError ? (
            <div className="relative">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-xl">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={item.photo}
                alt={item.name}
                className="w-28 h-28 rounded-xl object-cover border-2 border-white shadow-lg"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </div>
          ) : (
            <div
              className={`w-28 h-28 rounded-xl flex items-center justify-center shadow-lg ${isReturned ? 'bg-green-200 text-green-700' : 'bg-amber-200 text-amber-700'
                }`}
            >
              <Package size={40} strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 text-xl mb-2">{item.name}</h4>
              {item.description && (
                <p className="flex flex-wrap text-sm text-slate-600 leading-relaxed">{item.description}</p>
              )}
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap ${isReturned
              ? 'bg-green-100 text-green-700 border border-green-300 shadow-sm'
              : 'bg-amber-100 text-amber-700 border border-amber-300 shadow-sm'
              }`}>
              {isReturned ? (
                <>
                  <CheckCircle size={16} />
                  Returned
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  Pending Return
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen">
        <Breadcrumb
          linkText={[
            { text: "Offboarding Management" },
            { text: "Employee Resignation", href: "/offboardingManagement/resignation" },
            { text: "View Resignation Details" },
          ]}
        />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${theme.primaryColor}15` }}>
                <UserMinus size={28} style={{ color: theme.primaryColor }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Resignation Details</h1>
                <p className="text-slate-500 text-sm">
                  Resignation Id: <span className="font-mono font-semibold">{empResignReqDetailToAdmin.resignationCode}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-600">Status:</span>
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm border ${getStatusColor(
                    empResignReqDetailToAdmin.status
                  )}`}
                >
                  {empResignReqDetailToAdmin.status}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Notice Period"
              value={`${empResignReqDetailToAdmin.noticePeriodDays} Days`}
              icon={Clock}
              color={theme.primaryColor}
            />
            <StatCard
              title="Resignation Date"
              value={formatDate(empResignReqDetailToAdmin.resignationDate)}
              icon={Calendar}
              color="#10B981"
            />
            {empResignReqDetailToAdmin.status === "approved" && (
              <StatCard
                title="Last Working Date"
                value={formatDate(empResignReqDetailToAdmin.noticeperiodEndDate)}
                icon={Calendar}
                color="#3B82F6"
              />
            )}
          </div>
          {/* Rejection Reason Display - Only show if rejected */}
          {isRejected() && empResignReqDetailToAdmin.rejectionReason && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-red-800">Rejection Reason</h3>
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                      Rejected on {formatDate(empResignReqDetailToAdmin.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-2 p-3 bg-white border border-red-100 rounded-lg">
                    <p className="text-slate-700 whitespace-pre-line">
                      {empResignReqDetailToAdmin.rejectionReason}
                    </p>
                  </div>
                  {empResignReqDetailToAdmin.updatedBy && (
                    <p className="text-xs text-slate-500 mt-2">
                      Rejected by: {empResignReqDetailToAdmin.updatedBy}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Employee Information & Resignation Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Employee Information */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <SectionHeader number="1" title="Employee Information" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Employee ID"
                  value={empResignReqDetailToAdmin.employeeId}
                  icon={User}
                />
                <InfoField
                  label="Employee Name"
                  value={empResignReqDetailToAdmin.fullName}
                  icon={User}
                />
                <InfoField
                  label="Department"
                  value={empResignReqDetailToAdmin.department}
                  icon={Building}
                />
                <InfoField
                  label="Designation"
                  value={empResignReqDetailToAdmin.designation}
                  icon={Briefcase}
                />
                <InfoField
                  label="Employment Type"
                  value={empResignReqDetailToAdmin.employmentType}
                  icon={Briefcase}
                />
                <InfoField
                  label="Joining Date"
                  value={formatDate(empResignReqDetailToAdmin.joiningDate)}
                  icon={Calendar}
                />
                <InfoField
                  label="Reporting Manager"
                  value={empResignReqDetailToAdmin.onboardingManager}
                  icon={User}
                />
              </div>
            </div>

            {/* Resignation Details */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <SectionHeader number="2" title="Resignation Details" icon={FileText} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Offboarding Type"
                  value={empResignReqDetailToAdmin.offboardingtype}
                  icon={FileText}
                />
                <InfoField
                  label="Resignation Reason"
                  value={empResignReqDetailToAdmin.resignationReason}
                  icon={FileText}
                />
                <InfoField
                  label="Resignation Date"
                  value={formatDate(empResignReqDetailToAdmin.resignationDate)}
                  icon={Calendar}
                />
                <InfoField
                  label="Notice Period"
                  value={`${empResignReqDetailToAdmin.noticePeriodDays} Days`}
                  icon={Clock}
                />
              </div>
              <div className="mt-4">
                <InfoField
                  label="Detailed Remarks"
                  value={empResignReqDetailToAdmin.detailedRemarks}
                  icon={FileText}
                />
              </div>
             

            </div>

            {/* Loan/Advance Details */}

          </div>

          {/* Right Column - Status Summary & Quick Stats */}
          <div className="space-y-4">
            {/* Outstanding Loan Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={20} style={{ color: theme.primaryColor }} />
                Outstanding Loan
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">
                    Any Active Loan/Advance?
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {empResignReqDetailToAdmin.anyActiveLoan ? "Yes" : "No"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">
                    Agree to Settlement via Final Pay?
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {empResignReqDetailToAdmin.finalSettlement ? "Yes" : "No"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">
                    Loan Amount:
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    ₹ {empResignReqDetailToAdmin.outstandingLoanAmount.toLocaleString('en-IN')}
                  </p>
                </div>

              </div>
            </div>

            {/* Status Summary Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle size={20} style={{ color: theme.primaryColor }} />
                Status Summary
              </h3>
              <div className="space-y-3 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Approval Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(empResignReqDetailToAdmin.status)}`}>
                    {empResignReqDetailToAdmin.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">HR Approval:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(empResignReqDetailToAdmin.hrApprovalStatus)}`}>
                    {empResignReqDetailToAdmin.hrApprovalStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">SuperAdmin Approval:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(empResignReqDetailToAdmin.superAdminApprovalStatus)}`}>
                    {empResignReqDetailToAdmin.superAdminApprovalStatus}
                  </span>
                </div>
              </div>
             </div>

            {/* Welcome Kit Quick Summary */}
            {empResignReqDetailToAdmin.welcomeKits && empResignReqDetailToAdmin.welcomeKits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Gift size={20} style={{ color: theme.primaryColor }} />
                  Welcome Kit Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm text-blue-700 font-medium">Total Items</span>
                    <span className="text-lg font-bold text-blue-800">
                      {empResignReqDetailToAdmin.welcomeKits.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm text-green-700 font-medium">Returned</span>
                    <span className="text-lg font-bold text-green-800">
                      {empResignReqDetailToAdmin.welcomeKits.filter(k => k.isReturned).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-sm text-amber-700 font-medium">Pending</span>
                    <span className="text-lg font-bold text-amber-800">
                      {empResignReqDetailToAdmin.welcomeKits.filter(k => !k.isReturned).length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Kit Section - Full Width */}
        {empResignReqDetailToAdmin.welcomeKits && empResignReqDetailToAdmin.welcomeKits.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
            <SectionHeader
              number={empResignReqDetailToAdmin.anyActiveLoan ? "4" : "3"}
              title="Welcome Kit Items to be Returned"
              icon={Package}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {empResignReqDetailToAdmin.welcomeKits.map((kit, index) => (
                <WelcomeKitItem key={kit.welcomeKitId || index} item={kit} index={index} />
              ))}
            </div>

            {/* Alert for pending returns */}
            {empResignReqDetailToAdmin.welcomeKits.some(kit => !kit.isReturned) && (
              <div className="mt-6 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle size={24} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-base font-semibold text-amber-800 mb-1">Pending Returns Alert</p>
                    <p className="text-sm text-amber-700">
                      Employee must return all pending items before final settlement can be processed.
                      Please ensure all items are collected and marked as returned in the system.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success message when all returned */}
            {empResignReqDetailToAdmin.welcomeKits.every(kit => kit.isReturned) && (
              <div className="mt-6 p-5 bg-green-50 border-l-4 border-green-400 rounded-r-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-base font-semibold text-green-800 mb-1">All Items Returned</p>
                    <p className="text-sm text-green-700">
                      All welcome kit items have been successfully returned. Ready for final settlement processing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Action Buttons */}
        {canTakeAction() && (
          <div className="mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl mx-auto">
                  <button
                    onClick={handleBack}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-200 border border-slate-300 min-w-[150px]"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                    style={{ backgroundColor: "#EF4444" }}
                  >
                    <AlertCircle size={18} />
                    {isProcessing ? "Processing..." : "Reject"}
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                    style={{ backgroundColor: "#10B981" }}
                  >
                    <CheckCircle size={18} />
                    {isProcessing ? "Processing..." : "Approve"}
                  </button>

                  { isHR && (<button
                    onClick={handlePassToSuperAdmin}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                    style={{ backgroundColor: "#F59E0B" }}
                  >
                    <Building size={18} />
                    {isProcessing ? "Processing..." : "Pass to Super Admin"}
                  </button>
                )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Popup */}
      {showRejectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="text-red-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Reject Resignation</h3>
                    <p className="text-sm text-slate-500">Please provide a reason for rejection</p>
                  </div>
                </div>
                <button
                  onClick={handleClosePopup}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rejection Reason
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please explain why this resignation is being rejected..."
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 resize-none"
                    required
                  />
                  {!rejectionReason.trim() && (
                    <p className="text-xs text-red-500 mt-1">Rejection reason is required</p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Important</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Once rejected, this action cannot be undone. The employee will be notified about the rejection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-between gap-3">
                <button
                  onClick={handleClosePopup}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-slate-700 hover:bg-white transition-colors duration-200 border border-slate-300 flex-1"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={!rejectionReason.trim() || isProcessing}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} />
                      Confirm Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewResignationHR;