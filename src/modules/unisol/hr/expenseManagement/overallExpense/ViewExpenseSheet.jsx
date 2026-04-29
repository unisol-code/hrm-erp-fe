import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useExpenseApproval from "../../../../../hooks/unisol/expense/useExpenseApproval";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import{ useRoles } from "../../../../../hooks/auth/useRoles"

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

const ViewExpenseSheet = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const { isSuperAdmin, isHR } = useRoles();
  const role = isSuperAdmin ? "superAdmin" : "hr";
  const { fetchExpenseData,
     expenseDetails,
      loading, 
      resetApprvalEmployee 
    } =useExpenseApproval();

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseData(id , role);
  }, [id, role]);

  const handleCancle = () => {
    navigate(-1);
    resetApprvalEmployee();
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Expense Management", href: "/expenseApproval" },
          { text: "Overall Expense", href: "/expensesheet" },
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

                {/* Attendees Field */}
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm font-medium mb-1">Attendees</label>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {expenseDetails?.data?.attendees || "0"}
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

            {/* Limit Exceed Field */}
            {expenseDetails?.data?.limitExceed && (
              <div className="p-6 bg-yellow-50 rounded-xl shadow-sm mt-6 border border-yellow-100">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">Limit Exceeded</h2>

                <div className="flex flex-col">
                  <div className="p-4 bg-white rounded-lg border border-yellow-200 shadow-sm text-yellow-800">
                    <span className="font-medium">{expenseDetails.data.limitExceed.message}</span>
                    <span className="ml-2">(₹{expenseDetails.data.limitExceed.amount})</span>
                  </div>
                  {expenseDetails.data.limitExceed.explanation && (
                    <div className="p-4 bg-white rounded-lg border border-yellow-200 shadow-sm text-yellow-800 mt-2">
                      <span className="font-medium">{expenseDetails.data.limitExceed.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cancel Button */}
            <div className="flex justify-center mt-10">
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
    </div>
  );
};

export default ViewExpenseSheet;