import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { HandCoins, AlertTriangle, Info, CheckCircle } from "lucide-react";
import useEmpLoanRequest from "../../../../hooks/unisol/loanRequest/useEmpLoanRequest";
import Button from "../../../../components/Button";

const ViewLoanRequest = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    loading,
    empBasicDetail,
    fetchEmpBasicDetail,
    fetchEmpLoanRequestDetail,
    empLoanRequestDetail,
    reqNilLoanAmount
  } = useEmpLoanRequest();

  useEffect(() => {
    fetchEmpBasicDetail();
    if (id) {
      fetchEmpLoanRequestDetail(id);
    }
  }, [id]);

  const InfoField = ({ label, value }) => (
    <div className="mb-1">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
        {value || "-"}
      </div>
    </div>
  );

  const SectionHeader = ({ number, title }) => (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg"
        style={{ backgroundColor: theme.primaryColor }}
      >
        {number}
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
  );

  const handleNilLoanRequest = async () => {
    console.log("Requesting nil loan amount for ID:", id);
    await reqNilLoanAmount(id);
  }

  const isNilLoanApproved = empLoanRequestDetail?.requestForNillLoanAmount === "approve";
  const isNilLoanRequested = empLoanRequestDetail?.requestForNillLoanAmount === "requested";
  const isNilLoanRejected = empLoanRequestDetail?.requestForNillLoanAmount === "reject";

  return (
    <div>
      <Breadcrumb
        linkText={[
          { text: "Loan Request", href: "/emp/loanrequest" },
          { text: "View Loan Request" },
        ]}
      />

      {/* Header Card */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <HandCoins style={{ color: theme.primaryColor, fontSize: 32 }} />
          <span className="text-2xl font-bold">View Loan Request Details</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">Status:</span>
          <span
            className={`px-4 py-2 rounded-full font-semibold ${empLoanRequestDetail?.status === "approved"
              ? "bg-green-100 text-green-700"
              : empLoanRequestDetail?.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {empLoanRequestDetail?.status?.charAt(0).toUpperCase() + empLoanRequestDetail?.status?.slice(1)}
          </span>
        </div>
      </div>

      {/* Zero Amount Request Status - Show for requested, rejected, or approved */}
      {(isNilLoanRequested || isNilLoanRejected || isNilLoanApproved) && (
        <div className="mb-4">
          <div className={`p-4 rounded-2xl border ${isNilLoanRequested ? 'bg-blue-50 border-blue-200' :
            isNilLoanRejected ? 'bg-red-50 border-red-200' :
              'bg-green-50 border-green-200'
            }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${isNilLoanRequested ? 'bg-blue-100' :
                isNilLoanRejected ? 'bg-red-100' :
                  'bg-green-100'
                }`}>
                {isNilLoanRequested ? (
                  <Info size={20} className="text-blue-600" />
                ) : isNilLoanRejected ? (
                  <AlertTriangle size={20} className="text-red-600" />
                ) : (
                  <CheckCircle size={20} className="text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className={`font-semibold ${isNilLoanRequested ? 'text-blue-800' :
                      isNilLoanRejected ? 'text-red-800' :
                        'text-green-800'
                      }`}>
                      {isNilLoanRequested ? "Zero Loan Amount Request" :
                        isNilLoanRejected ? "Zero Loan Amount Request Rejected" :
                          "Zero Loan Amount Approved"}
                    </h3>
                    <p className={`text-sm ${isNilLoanRequested ? 'text-blue-600' :
                      isNilLoanRejected ? 'text-red-600' :
                        'text-green-600'
                      }`}>
                      {isNilLoanRequested
                        ? "You have requested to process this loan with zero amount. Waiting for approval."
                        : isNilLoanRejected
                          ? "Your zero amount request has been rejected."
                          : "Your zero amount request has been approved. The loan will be processed with zero amount."
                      }
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isNilLoanRequested ? 'bg-blue-100 text-blue-700' :
                    isNilLoanRejected ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                    {isNilLoanRequested ? "Pending" :
                      isNilLoanRejected ? "Rejected" :
                        "Approved"}
                  </span>
                </div>

                {/* Show rejection reason if rejected */}
                {isNilLoanRejected && empLoanRequestDetail?.loanNillAmountRejectionReason && (
                  <div className="mt-3 p-3 bg-white border border-red-100 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-slate-700 whitespace-pre-line">
                          {empLoanRequestDetail.loanNillAmountRejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="mb-8">
          <SectionHeader number="1" title="Employee Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField label="Employee ID" value={empBasicDetail?.employeeId} />
            <InfoField label="Employee Name" value={empBasicDetail?.employeeName} />
            <InfoField label="Department" value={empBasicDetail?.department} />
            <InfoField label="Designation" value={empBasicDetail?.designation} />
            <InfoField label="Date of Joining" value={empBasicDetail?.joiningDate} />
            <InfoField label="Monthly Salary" value={empBasicDetail?.salary} />
            <InfoField label="Employment Type" value={empBasicDetail?.employmentType} />
          </div>
        </div>

        <hr className="my-4 border-slate-200" />

        {/* Section 2: Loan Details */}
        <div className="mb-3">
          <SectionHeader number="2" title="Loan Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField label="Loan Type" value={empLoanRequestDetail?.loanType} />
            <InfoField label="Required Loan Amount (₹)" value={empLoanRequestDetail?.loanAmount} />
            <div className="md:col-span-2">
              <InfoField label="Purpose/Reason for Loan" value={empLoanRequestDetail?.reasonForLoan} />
            </div>
            <InfoField label="Loan Request Date" value={empLoanRequestDetail?.loanRequestDate} />
          </div>
        </div>

        <hr className="my-4 border-slate-200" />

        {/* Section 3: Repayment Details */}
        <div className="mb-6">
          <SectionHeader number="3" title="Repayment Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="mb-2">
              <InfoField
                label="Preferred Repayment Method"
                value={empLoanRequestDetail?.preferredRepaymentMethod}
              />
            </div>
            <div className="mb-2">
              <InfoField
                label="Repayment Tenure (Months)"
                value={empLoanRequestDetail?.repaymentTenureInMonths}
              />
            </div>
            {empLoanRequestDetail?.status === "approved" && (
              <div className="mb-3">
                <InfoField
                  label="Deduction Start Month"
                  value={empLoanRequestDetail?.deductionStartMonth}
                />
              </div>
            )}
            <div className="mb-3">
              <InfoField
                label="Monthly Deduction Amount (₹)"
                value={empLoanRequestDetail?.monthlyDeductionAmount}
              />
            </div>
          </div>
        </div>

        <hr className="my-4 border-slate-200" />

        {/* Section 4: Supporting Documents */}
        <div className="mb-8">
          <SectionHeader number="4" title="Supporting Documents" />
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Uploaded Documents
            </label>
            {empLoanRequestDetail?.documents?.map((doc, index) => {
              const fileName = decodeURIComponent(doc.split("/").pop());

              return (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: theme.highlightColor }}
                    >
                      <span className="text-xs font-bold text-slate-700">
                        {fileName.split(".").pop().toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-slate-800">{fileName}</p>
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline"
                      >
                        View document
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <hr className="my-4 border-slate-200" />

        {/* Section 5: Declaration & Confirmation */}
        <div className="mb-8">
          <SectionHeader number="5" title="Declaration & Confirmation" />
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked
                readOnly
                className="w-5 h-5 mt-1 cursor-pointer"
                style={{ accentColor: theme.primaryColor }}
              />
              <div>
                <p className="font-semibold text-slate-800 mb-2">
                  Employer Declaration
                </p>
                <p className="text-sm text-slate-600">
                  {empLoanRequestDetail?.declaration?.declarationText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            onClick={() => navigate("/emp/loanrequest")}
            text="Back"
            variant={2}
          />

          {empLoanRequestDetail?.status === "approved" && (
            <>
              {/* Button for rejected case - ENABLED */}
              {isNilLoanRejected && (
                <Button
                  type="button"
                  onClick={handleNilLoanRequest}
                  variant={1}
                  text="Resubmit Nil Loan Amount Request"
                  disabled={loading}
                  title="Click to submit a new zero amount request"
                />
              )}

              {/* Button for no nil request or any other state - DISABLED if requested or approved */}
              {(!isNilLoanRejected && !isNilLoanRequested && !isNilLoanApproved) && (
                <Button
                  type="button"
                  onClick={handleNilLoanRequest}
                  variant={1}
                  text="Request for nil loan amount"
                  disabled={loading}
                  title="Request to process loan with zero amount"
                />
              )}

              {/* Disabled button for requested case */}
              {isNilLoanRequested && (
                <Button
                  type="button"
                  variant={1}
                  text="Request for nil loan amount"
                  disabled={true}
                  title="Zero amount request already submitted and pending approval"
                />
              )}

              {/* Disabled button for approved case */}
              {isNilLoanApproved && (
                <Button
                  type="button"
                  variant={1}
                  text="Nil Loan Amount Approved"
                  disabled={true}
                  title="Zero amount request has already been approved"
                />
              )}
            </>
          )}
        </div>

        {/* Additional information message */}
        {(isNilLoanRequested || isNilLoanRejected || isNilLoanApproved) && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Note:</p>
                <p className="text-sm text-slate-600">
                  {isNilLoanRequested
                    ? "Your request to process this loan with zero amount has been submitted. Please wait for approval from the administrator."
                    : isNilLoanRejected
                      ? "Your zero amount request was rejected. You can resubmit a new request by clicking the button above."
                      : "Your zero amount request has been approved. No further action is required."
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Special note for rejected case */}
        {isNilLoanRejected && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Important:</p>
                <p className="text-sm text-yellow-700">
                  If you resubmit a nil loan amount request, please review the rejection reason above and ensure your new request addresses any concerns.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLoanRequest;