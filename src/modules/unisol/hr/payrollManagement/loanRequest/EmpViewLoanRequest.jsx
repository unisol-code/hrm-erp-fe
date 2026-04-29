import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HandCoins, Download, Calendar, User, FileText, DollarSign,
  Clock, Briefcase, Building, X, AlertCircle, ArrowLeft, CheckCircle, AlertTriangle
} from "lucide-react";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useAdminLoanRequest from "../../../../../hooks/unisol/loanRequest/useAdminLoanRequest";
import { format } from "date-fns";
import { useRoles } from "../../../../../hooks/auth/useRoles";

const EmpViewLoanRequest = () => {
  const {
    fetchEmpLoanReqDetailToAdmin,
    loading,
    empLoanReqDetailToAdmin,
    approveOrRejectLoanRequest,
    approveOrRejectNilLoanRequest
  } = useAdminLoanRequest();
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : "hr";
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showNillAmountRejectPopup, setShowNillAmountRejectPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [nillAmountRejectionReason, setNillAmountRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [nillActionLoading, setNillActionLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // "loan", "nillAmount"

  useEffect(() => {
    if (id) {
      fetchEmpLoanReqDetailToAdmin(id, role);
    }
  }, [id, role]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${Number(amount).toLocaleString('en-IN')}`;
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
      return empLoanReqDetailToAdmin?.superAdminApprovalStatus || "pending";
    } else if (isHR) {
      return empLoanReqDetailToAdmin?.hrApprovalStatus || "pending";
    }
    return empLoanReqDetailToAdmin?.status || "pending";
  };

  // Check if can take action on loan approval/rejection
  const canTakeAction = () => {
    const currentStatus = getCurrentStatus();
    return currentStatus === "pending";
  };

  // Check if can take action on Nill Amount request
  const canTakeNillAmountAction = () => {
    const isApproved = getCurrentStatus() === "approved";
    const hasNillAmountRequest = empLoanReqDetailToAdmin?.requestForNillLoanAmount === "requested";
    const nillAmountStatus = empLoanReqDetailToAdmin?.nillLoanAmountStatus;

    return isApproved && hasNillAmountRequest && (!nillAmountStatus || nillAmountStatus === "pending");
  };

  // Check if nill amount was rejected
  const isNillAmountRejected = () => {
    return empLoanReqDetailToAdmin?.requestForNillLoanAmount === "reject";
  };

  const isRejected = () => {
    const currentStatus = getCurrentStatus();
    return currentStatus === "rejected";
  };

  const handleAction = async (status, type = "loan") => {
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

      await approveOrRejectLoanRequest(id, data);

      await fetchEmpLoanReqDetailToAdmin(id, role);

      if (type === "loan") {
        setShowRejectPopup(false);
        setRejectionReason("");
      }

    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // New function to handle nil loan amount actions
  const handleNilLoanAction = async (action) => {
    if (nillActionLoading) return;

    setNillActionLoading(true);
    try {
      let data = {};

      if (action === "reject") {
        if (!nillAmountRejectionReason.trim()) {
          toast.error("Please provide a rejection reason");
          setNillActionLoading(false);
          return;
        }
        data = {
          status: "reject",
          loanNillAmountRejectionReason: nillAmountRejectionReason
        };
      } else {
        data = {
          status: "approve"
        };
      }

      // Use the dedicated nil loan request hook
      await approveOrRejectNilLoanRequest(id, data);

      // Refresh the data
      await fetchEmpLoanReqDetailToAdmin(id, role);

      // Reset states
      setShowNillAmountRejectPopup(false);
      setNillAmountRejectionReason("");

    } catch (error) {
      console.error("Error performing nil loan action:", error);
    } finally {
      setNillActionLoading(false);
    }
  };

  const handleRejectClick = () => {
    setActionType("loan");
    setShowRejectPopup(true);
  };

  const handleNillAmountRejectClick = () => {
    setActionType("nillAmount");
    setShowNillAmountRejectPopup(true);
  };

  const handleApprove = () => {
    handleAction("approve");
  };

  const handleNillAmountApprove = () => {
    handleNilLoanAction("approve");
  };

  const handlePassToSuperAdmin = () => {
    handleAction("passToSuperAdmin");
  };

  const handleClosePopup = () => {
    setShowRejectPopup(false);
    setShowNillAmountRejectPopup(false);
    setRejectionReason("");
    setNillAmountRejectionReason("");
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

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primaryColor }}></div>
      </div>
    );
  }

  if (!empLoanReqDetailToAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <HandCoins className="text-red-500" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Loan Request Not Found</h3>
          <p className="text-slate-500 mb-4">The requested loan application could not be found.</p>
          <button
            onClick={() => navigate("/emp_loan_RequestList")}
            className="px-6 py-2 rounded-lg font-semibold text-white"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <Breadcrumb
          linkText={[
            { text: "Payroll Management" },
            { text: "Loan Request", href: "/emp_loan_RequestList" },
            { text: `${empLoanReqDetailToAdmin.employeeName}'s Loan Request`, href: `/emp_loan_RequestList/per_Emp_Loan_Request/${empLoanReqDetailToAdmin.employeeId}` },
            { text: `View Loan Request Details` },  
          ]}
        />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${theme.primaryColor}15` }}>
                <HandCoins size={28} style={{ color: theme.primaryColor }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Loan Request Details</h1>
                <p className="text-slate-500 text-sm">
                  Application ID: <span className="font-mono font-semibold">{empLoanReqDetailToAdmin.loanId}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-600">Status:</span>
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm border ${getStatusColor(
                    getCurrentStatus()
                  )}`}
                >
                  {getCurrentStatus() || "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Loan Amount"
              value={formatCurrency(empLoanReqDetailToAdmin.loanAmount)}
              icon={DollarSign}
              color={theme.primaryColor}
            />
            <StatCard
              title="Monthly Deduction"
              value={formatCurrency(empLoanReqDetailToAdmin.monthlyDeductionAmount)}
              icon={Calendar}
              color="#10B981"
            />
            <StatCard
              title="Repayment Tenure"
              value={empLoanReqDetailToAdmin.repaymentTenureInMonths ? `${empLoanReqDetailToAdmin.repaymentTenureInMonths} Months` : "-"}
              icon={Clock}
              color="#3B82F6"
            />
            <StatCard
              title="Request Date"
              value={formatDate(empLoanReqDetailToAdmin.loanRequestDate)}
              icon={Calendar}
              color="#8B5CF6"
            />
          </div>

          {/* Nill Amount Request Status - Show for both "requested" and "reject" */}
          {(empLoanReqDetailToAdmin.requestForNillLoanAmount === "requested" || 
            empLoanReqDetailToAdmin.requestForNillLoanAmount === "reject") && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-blue-800">Zero Loan Amount Request</h3>
                      <p className="text-sm text-blue-600">
                        {empLoanReqDetailToAdmin.requestForNillLoanAmount === "requested" 
                          ? "Employee has requested to process the loan with zero amount"
                          : "Zero amount request was rejected"}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      empLoanReqDetailToAdmin.requestForNillLoanAmount === "reject" ? "rejected" : 
                      empLoanReqDetailToAdmin.nillLoanAmountStatus
                    )}`}>
                      {empLoanReqDetailToAdmin.requestForNillLoanAmount === "reject" ? "Rejected" : 
                       empLoanReqDetailToAdmin.nillLoanAmountStatus || "Pending"}
                    </span>
                  </div>

                  {/* Nill Amount Rejection Reason Display - Show when rejected */}
                  {(empLoanReqDetailToAdmin.requestForNillLoanAmount === "reject" || 
                    empLoanReqDetailToAdmin.nillLoanAmountStatus === "rejected") && 
                    empLoanReqDetailToAdmin.loanNillAmountRejectionReason && (
                    <div className="mt-3 p-3 bg-white border border-red-100 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason:</p>
                          <p className="text-sm text-slate-700 whitespace-pre-line">
                            {empLoanReqDetailToAdmin.loanNillAmountRejectionReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rejection Reason Display - Only show if rejected */}
          {isRejected() && empLoanReqDetailToAdmin.rejectionReason && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-red-800">Rejection Reason</h3>
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                      Rejected on {formatDate(empLoanReqDetailToAdmin.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-2 p-3 bg-white border border-red-100 rounded-lg">
                    <p className="text-slate-700 whitespace-pre-line">
                      {empLoanReqDetailToAdmin.rejectionReason}
                    </p>
                  </div>
                  {empLoanReqDetailToAdmin.updatedBy && (
                    <p className="text-xs text-slate-500 mt-2">
                      Rejected by: {empLoanReqDetailToAdmin.updatedBy}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Employee Information & Loan Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Employee Information */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <SectionHeader number="1" title="Employee Information" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Employee ID"
                  value={empLoanReqDetailToAdmin.employeeId}
                  icon={User}
                />
                <InfoField
                  label="Employee Name"
                  value={empLoanReqDetailToAdmin.employeeName}
                  icon={User}
                />
                <InfoField
                  label="Department"
                  value={empLoanReqDetailToAdmin.department}
                  icon={Building}
                />
                <InfoField
                  label="Designation"
                  value={empLoanReqDetailToAdmin.designation}
                  icon={Briefcase}
                />
                <InfoField
                  label="Employment Type"
                  value={empLoanReqDetailToAdmin.employmentType}
                  icon={Briefcase}
                />
                <InfoField
                  label="Joining Date"
                  value={formatDate(empLoanReqDetailToAdmin.joiningDate)}
                  icon={Calendar}
                />
                <InfoField
                  label="Monthly Salary"
                  value={formatCurrency(empLoanReqDetailToAdmin.salary)}
                  icon={DollarSign}
                />
                <InfoField
                  label="Loan Type"
                  value={empLoanReqDetailToAdmin.loanType}
                  icon={Briefcase}
                />
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <SectionHeader number="2" title="Loan Details" icon={DollarSign} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Required Loan Amount"
                  value={formatCurrency(empLoanReqDetailToAdmin.loanAmount)}
                  icon={DollarSign}
                />
                <InfoField
                  label="Repayment Method"
                  value={empLoanReqDetailToAdmin.preferredRepaymentMethod}
                  icon={Calendar}
                />
                <InfoField
                  label="Repayment Tenure"
                  value={empLoanReqDetailToAdmin.repaymentTenureInMonths ? `${empLoanReqDetailToAdmin.repaymentTenureInMonths} Months` : "-"}
                  icon={Clock}
                />
                <InfoField
                  label="Monthly Deduction"
                  value={formatCurrency(empLoanReqDetailToAdmin.monthlyDeductionAmount)}
                  icon={DollarSign}
                />
              </div>
              <div className="mt-4">
                <InfoField
                  label="Reason for Loan"
                  value={empLoanReqDetailToAdmin.reasonForLoan}
                  icon={FileText}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Timeline, Status & Supporting Documents */}
          <div className="space-y-4">
            {/* Timeline Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={20} style={{ color: theme.primaryColor }} />
                Application Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: theme.primaryColor }}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Application Submitted</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(empLoanReqDetailToAdmin.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Summary Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle size={20} style={{ color: theme.primaryColor }} />
                Status Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Overall Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(getCurrentStatus())}`}>
                    {getCurrentStatus()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">HR Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(empLoanReqDetailToAdmin.hrApprovalStatus)}`}>
                    {empLoanReqDetailToAdmin.hrApprovalStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Super Admin Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(empLoanReqDetailToAdmin.superAdminApprovalStatus)}`}>
                    {empLoanReqDetailToAdmin.superAdminApprovalStatus}
                  </span>
                </div>

                {/* Nill Loan Amount Status - Show for both requested and rejected */}
                {(empLoanReqDetailToAdmin.requestForNillLoanAmount === "requested" || 
                  empLoanReqDetailToAdmin.requestForNillLoanAmount === "reject") && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Zero Amount Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      empLoanReqDetailToAdmin.requestForNillLoanAmount === "reject" ? "rejected" : 
                      empLoanReqDetailToAdmin.nillLoanAmountStatus
                    )}`}>
                      {empLoanReqDetailToAdmin.requestForNillLoanAmount === "reject" ? "Rejected" : 
                       empLoanReqDetailToAdmin.nillLoanAmountStatus || "Pending"}
                    </span>
                  </div>
                )}

                {empLoanReqDetailToAdmin.rejectionReason && (
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={14} className="text-red-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-red-700 mb-1">Rejection Details:</p>
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 whitespace-pre-line">
                          {empLoanReqDetailToAdmin.rejectionReason}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Last updated: {formatDate(empLoanReqDetailToAdmin.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Supporting Documents - Grid Layout */}
            {empLoanReqDetailToAdmin.documents && empLoanReqDetailToAdmin.documents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
                <SectionHeader number="3" title="Supporting Documents" icon={FileText} />

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {empLoanReqDetailToAdmin.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    >
                      {/* Document Info */}
                      <div className="flex items-start gap-3 mb-4 flex-1">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0"
                          style={{ backgroundColor: theme.highlightColor }}
                        >
                          <FileText size={20} style={{ color: theme.primaryColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md mb-2"
                              style={{
                                color: theme.primaryColor,
                                backgroundColor: `${theme.primaryColor}15`
                              }}>
                              Document {index + 1}
                            </span>
                          </div>
                          <p className="font-medium text-slate-800 text-sm md:text-base truncate">
                            {doc.split('/').pop()}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Uploaded: {formatDate(empLoanReqDetailToAdmin.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Action Button - Always at bottom */}
                      <div className="mt-auto pt-4 border-t border-slate-200">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-sm w-full group"
                          style={{
                            color: theme.primaryColor,
                            backgroundColor: `${theme.primaryColor}15`,
                          }}
                        >
                          <Download size={16} className="group-hover:animate-bounce" />
                          <span>Download Document</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Document Summary Footer */}
                {empLoanReqDetailToAdmin.documents.length > 1 && (
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-center sm:text-left">
                      <p className="text-sm font-medium text-slate-700">
                        {empLoanReqDetailToAdmin.documents.length} documents available
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Click on any document to view/download
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        // Open all documents in new tabs
                        empLoanReqDetailToAdmin.documents.forEach((doc, i) => {
                          setTimeout(() => {
                            window.open(doc, '_blank');
                          }, i * 200);
                        });
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-sm"
                      style={{
                        color: "#ffffff",
                        backgroundColor: theme.primaryColor,
                      }}
                    >
                      <Download size={16} />
                      Open All Documents
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        {(canTakeAction() || canTakeNillAmountAction()) && (
          <div className="mt-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col items-center">
                <div className={`flex flex-wrap justify-center gap-4 w-full max-w-3xl mx-auto ${(isHR && canTakeAction()) ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
                  <button
                    onClick={handleBack}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-200 border border-slate-300 min-w-[150px]"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>

                  {/* Loan Approval/Rejection Buttons */}
                  {canTakeAction() && (
                    <>
                      <button
                        onClick={handleRejectClick}
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                        style={{ backgroundColor: "#EF4444" }}
                      >
                        <AlertCircle size={18} />
                        {actionLoading ? "Processing..." : "Reject Loan"}
                      </button>

                      <button
                        onClick={handleApprove}
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                        style={{ backgroundColor: "#10B981" }}
                      >
                        <CheckCircle size={18} />
                        {actionLoading ? "Processing..." : "Approve Loan"}
                      </button>

                      {isHR && (
                        <button
                          onClick={handlePassToSuperAdmin}
                          disabled={actionLoading}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                          style={{ backgroundColor: "#F59E0B" }}
                        >
                          <Building size={18} />
                          {actionLoading ? "Processing..." : "Pass to Super Admin"}
                        </button>
                      )}
                    </>
                  )}

                  {/* Nill Amount Request Buttons - Only show if requested and not already rejected */}
                  {canTakeNillAmountAction() && (
                    <>
                      <button
                        onClick={handleNillAmountRejectClick}
                        disabled={nillActionLoading}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                        style={{ backgroundColor: "#DC2626" }}
                      >
                        <X size={18} />
                        {nillActionLoading ? "Processing..." : "Reject Zero Amount"}
                      </button>

                      <button
                        onClick={handleNillAmountApprove}
                        disabled={nillActionLoading}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                        style={{ backgroundColor: "#059669" }}
                      >
                        <CheckCircle size={18} />
                        {nillActionLoading ? "Processing..." : "Approve Zero Amount"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loan Rejection Popup */}
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
                    <h3 className="text-lg font-bold text-slate-800">Reject Loan Request</h3>
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
                    placeholder="Please explain why this loan request is being rejected..."
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
                  onClick={() => handleAction("reject", "loan")}
                  disabled={!rejectionReason.trim() || actionLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  {actionLoading ? (
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

      {/* Nill Amount Rejection Popup */}
      {showNillAmountRejectPopup && (
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
                    <h3 className="text-lg font-bold text-slate-800">Reject Zero Amount Request</h3>
                    <p className="text-sm text-slate-500">Please provide a reason for rejecting the zero amount request</p>
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
                    value={nillAmountRejectionReason}
                    onChange={(e) => setNillAmountRejectionReason(e.target.value)}
                    placeholder="Please explain why the zero amount request is being rejected..."
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 resize-none"
                    required
                  />
                  {!nillAmountRejectionReason.trim() && (
                    <p className="text-xs text-red-500 mt-1">Rejection reason is required</p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Important</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        This will reject only the zero amount request. The approved loan will continue with the original amount.
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
                  onClick={() => handleNilLoanAction("reject")}
                  disabled={!nillAmountRejectionReason.trim() || nillActionLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  {nillActionLoading ? (
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

export default EmpViewLoanRequest;