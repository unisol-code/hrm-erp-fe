import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useExpenseApproval from "../../../../../hooks/unisol/expense/useExpenseApproval";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useRoles } from "../../../../../hooks/auth/useRoles";
import LoaderSpinner from "../../../../../components/LoaderSpinner"; 

const getStatusStyles = (status, theme = { primaryColor: "#318bb1" }) => {
  if (!status)
    return {
      backgroundColor: `${theme.primaryColor}20`,
      color: theme.primaryColor,
    };
  switch (status.toLowerCase()) {
    case "approved":
      return { backgroundColor: "#d1fae5", color: "#059669" };
    case "rejected":
      return { backgroundColor: "#fee2e2", color: "#dc2626" };
    case "pending":
      return { backgroundColor: "#fef9c3", color: "#b45309" };
    default:
      return {
        backgroundColor: `${theme.primaryColor}20`,
        color: theme.primaryColor,
      };
  }
};

const ViewExpenseDetails = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const {
    fetchExpenseData,
    expenseDetails,
    approvalAction,
    loading,
    resetApprvalEmployee,
  } = useExpenseApproval();
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [remark, setRemark] = useState("");
  const navigate = useNavigate();
  const [remarkError, setRemarkError] = useState(false);
  const [remarkErrorMsg, setRemarkErrorMsg] = useState("");
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : "hr";

  useEffect(() => {
    fetchExpenseData(id, role);
  }, [id, role]);

  const handleApprove = async () => {
    await approvalAction(id, { status: "approved", role: role });
    resetApprvalEmployee();
    navigate(-1);
  };

  const handlePassToSuperAdmin = async () => {
    await approvalAction(id, { status: "PassedToSuperAdmin", role: role });
    resetApprvalEmployee();
    navigate(-1);
  };

  const handleReject = async () => {
    if (!remark.trim()) {
      setRemarkError(true);
      setRemarkErrorMsg("Remark required");
      return;
    }
    if (remark.trim().length < 20) {
      setRemarkError(true);
      setRemarkErrorMsg("Remark must be at least 20 characters");
      return;
    }
    setRemarkError(false);
    setRemarkErrorMsg("");
    await approvalAction(id, { status: "rejected", adminRemarks: remark, role: role });
    resetApprvalEmployee();
    navigate(-1);
  };

  const handleCancle = () => {
    navigate(-1);
    resetApprvalEmployee();
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Expense Management", href: "/expenseApproval" },
          { text: "Expense Approval", href: "/expenseApproval" },
          { text: "View Expense" },
        ]}
      />

      <section className="bg-white rounded-xl shadow-lg overflow-hidden w-full border border-gray-100">
        <div
          className="text-white py-4 px-6 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
          }}
        >
          <div>
            <h1 className="text-white text-2xl font-bold">Expense Details</h1>
            <p className="text-white text-opacity-90 mt-1">
              {expenseDetails?.data?.expenseCategory || "Expense Category"}
            </p>
          </div>
          <span
            className="px-4 py-2 rounded-full text-sm font-semibold self-start sm:self-center"
            style={getStatusStyles(expenseDetails?.data?.status)}
          >
            {expenseDetails?.data?.status || ""}
          </span>
        </div>

        {loading ? (
          <div className="w-full flex items-center justify-center py-20">
            <LoaderSpinner />
          </div>
        ) : (
          <div className="p-6">
            {/* Employee Information */}
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Employee Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Name</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.name || "--"}
                  </div>
                </div>

                {/* Manager */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Manager</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.onboardingManager || "--"}
                  </div>
                </div>

                {/* Department */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Department</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.department || "--"}
                  </div>
                </div>

                {/* Designation */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Designation</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.designation || "--"}
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Details */}
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Expense Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Place Field */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Place</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.place || "--"}
                  </div>
                </div>

                {/* City Field */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">City</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.city || "--"}
                  </div>
                </div>

                {/* Date Field */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Date</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.date
                      ? new Date(expenseDetails.data.date).toLocaleDateString('en-GB')
                      : "--"}
                  </div>
                </div>

                {/* Expense Category Field */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Expense Category</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.expenseCategory || "--"}
                  </div>
                </div>

                {/* Amount Field */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Amount (₹)</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm font-medium">
                    {expenseDetails?.data?.amount?.cash ||
                      expenseDetails?.data?.amount?.online ||
                      "0"}
                  </div>
                </div>

                {/* Bill Number Field */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Bill Number</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.billNumber || "--"}
                  </div>
                </div>

                {/* Attach Receipt Field */}
                <div className="flex flex-col md:col-span-2">
                  <label className="text-gray-600 text-sm font-medium mb-1">Attached Receipts</label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {expenseDetails?.data?.receipts?.length > 0 ? (
                      expenseDetails.data.receipts.map((receipt, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={receipt}
                            alt="Receipt Preview"
                            className="w-24 h-24 object-cover cursor-pointer rounded-lg border border-gray-200 shadow-sm transition-transform group-hover:scale-105"
                            onClick={() => window.open(receipt, "_blank")}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">View</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-500">
                        No receipts attached
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gifts Details */}
            {expenseDetails?.data?.expenseCategory === "Gifts" && (
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Gift Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Description Of Gift</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.description || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Receiver Name</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.receiverName || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Receiver Number</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.receiverNumber || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Purpose of Gift</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.purpose || "--"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stationary Details */}
            {expenseDetails?.data?.expenseCategory === "Stationary" && (
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Stationary Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Item Name</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.itemName || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Description Of Item</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.description || "--"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Food Details */}
            {expenseDetails?.data?.expenseCategory === "Food" && (
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Food Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Meal Type</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.mealType || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Attendees</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.attendees || "0"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Travel Details */}
            {expenseDetails?.data?.expenseCategory === "Travel" && (
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Travel Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Travel Date</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.travelDate || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">From(Departure)</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.departure || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">To(Destination)</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.destination || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Place Visited</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.placeVisited || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Mode of Transport</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.modeOfTransport || "--"}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Working Remark</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.workingRemark || "--"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lodging Details */}
            {expenseDetails?.data?.expenseCategory === "Lodging" && (
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Lodging Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Lodging Name</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.lodgingName || "--"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">City</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.cityType || "--"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">From Date</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.fromDate || "--"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">To Date</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.toDate || "--"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-sm font-medium mb-1">Working Remark</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {expenseDetails?.data?.workingRemark || "--"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Allowance Details and Other Details */}
            {(expenseDetails?.data?.expenseCategory === "Daily Allowance" ||
              expenseDetails?.data?.expenseCategory === "Other") && (
                <div className="p-6 bg-gray-50 rounded-xl shadow-sm mt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                    {expenseDetails?.data?.expenseCategory} Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="text-gray-600 text-sm font-medium mb-1">Description</label>
                      <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                        {expenseDetails?.data?.description || "--"}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-600 text-sm font-medium mb-1">Remark</label>
                      <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                        {expenseDetails?.data?.remark || "--"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Limit Exceed Field */}
            {expenseDetails?.data?.limitExceed && (
              <div className="p-6 bg-yellow-50 rounded-xl shadow-sm mt-6 border border-yellow-100">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">Limit Exceeded</h2>

                <div className="flex flex-col">
                  <div className="p-4 bg-white rounded-lg border border-yellow-200 shadow-sm text-yellow-800">
                    <span className="font-medium">{expenseDetails.data.limitExceed.message}</span>
                    <span className="ml-2">(₹{expenseDetails.data.limitExceed.amount})</span>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-yellow-200 shadow-sm text-yellow-800 mt-2">
                    <span className="font-medium">{expenseDetails.data.limitExceed.explanation}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Approve and Reject Buttons */}
            <div className="flex justify-center mt-10 space-x-4">
              {isHR && expenseDetails?.data?.hrApprovalStatus === "PassedToSuperAdmin" ? (
                <span className="px-4 py-2 rounded-full text-sm font-semibold self-start sm:self-center bg-purple-600 text-white">Passed to Super Admin</span>
              ) :
                <>
                  {expenseDetails?.data?.status === "pending" ? (
                    <>
                      <button
                        onClick={handleApprove}
                        className="bg-green-600 hover:bg-green-700 py-2 px-8 text-white rounded-lg transition-all duration-200 shadow hover:shadow-md font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => setShowRejectPopup(true)}
                        className="bg-red-600 hover:bg-red-700 py-2 px-8 text-white rounded-lg transition-all duration-200 shadow hover:shadow-md font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Reject
                      </button>  

                    </>
                  ) : expenseDetails?.data?.status === "approved" ? (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold self-start sm:self-center bg-green-600 text-white">Approved</span>
                  ) : expenseDetails?.data?.status === "rejected" && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold self-start sm:self-center bg-red-600 text-white">Rejected</span>
                  )}
                </>
              }
              {isHR && expenseDetails?.data?.hrApprovalStatus === "Pending" && (
                <button
                  onClick={handlePassToSuperAdmin}
                  className="bg-yellow-600 hover:bg-yellow-700 py-2 px-8 text-white rounded-lg transition-all duration-200 shadow hover:shadow-md font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Pass to Super Admin
                </button>
              )}
              <button
                onClick={handleCancle}
                className="bg-gray-600 hover:bg-gray-700 py-2 px-8 text-white rounded-lg transition-all duration-200 shadow hover:shadow-md font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </button>       
            </div>
          </div>
        )}

      </section>

      {/* Reject Popup */}
      {showRejectPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Reject Expense</h2>
            </div>

            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this expense (minimum 20 characters).</p>

            <textarea
              placeholder="Enter remark..."
              value={remark}
              onChange={(e) => {
                setRemark(e.target.value);
                setRemarkError(false);
                setRemarkErrorMsg("");
              }}
              className={`w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all ${remarkError ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
                }`}
            />
            {remarkError && (
              <div className="text-red-500 text-sm mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {remarkErrorMsg}
              </div>
            )}

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => {
                  setShowRejectPopup(false);
                  setRemark("");
                }}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ViewExpenseDetails;