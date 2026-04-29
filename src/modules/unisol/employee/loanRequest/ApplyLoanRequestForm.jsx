import React from "react";
import { IconButton } from "@mui/material";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { HandCoins } from "lucide-react";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Select from "react-select";

const ApplyLoanRequestForm = ({
  formik,
  isSubmitting,
  loading,
  empBasicDetail,
  userForApply,
  documents,
  id,
  navigate,
  handleFileUpload,
  handleDeleteDocument,
  validateLoanAndTenure,
  isFormValid
}) => {
  const { theme } = useTheme();

  const InfoField = ({ label, value }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
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

  const renderError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName] ? (
      <div className="text-red-500 text-sm mt-1">{formik.errors[fieldName]}</div>
    ) : null;
  };
  // Updated helper functions - more flexible

  const calculateMaxAffordableLoan = (monthlySalary, tenureMonths) => {
    // Allow up to 100% of salary to be deducted
    return monthlySalary * tenureMonths;
  };

  const calculateMinimumTenure = (loanAmount, monthlySalary) => {
    // Calculate minimum months needed if deducting 100% of salary
    return Math.ceil(loanAmount / monthlySalary);
  };

  const applyToOptions =
    userForApply?.map((name) => ({ value: name?._id, label: name?.fullName })) || [];

  const handleApplyToChange = (selectedOption) => {
    formik.setFieldValue("applyTo", selectedOption ? selectedOption.value : "");
  };

  return (
    <div>
      <Breadcrumb
        linkText={[
          { text: "Loan Request", href: "/emp/loanrequest" },
          { text: id ? "Edit Loan Request" : "Apply Loan Request" },
        ]}
      />

      {/* Header Card */}
      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <HandCoins style={{ color: theme.primaryColor, fontSize: 32 }} />
          <span className="text-2xl font-bold">
            {id ? "Edit Loan Request" : "Loan Request Form"}
          </span>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Section 1: Employee Information (Read Only) */}
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

          <hr className="my-8 border-slate-200" />

          {/* Section 2: Loan Details (Editable) */}
          <div className="mb-8">
            <SectionHeader number="2" title="Loan Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Loan Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="loanType"
                  value={formik.values.loanType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRing: theme.primaryColor }}
                >
                  <option value="" disabled>Select Loan Type</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Vehicle Loan">Vehicle Loan</option>
                  <option value="Education Loan">Education Loan</option>
                  <option value="Emergency Loan">Emergency Loan</option>
                </select>
                {renderError('loanType')}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Required Loan Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formik.values.loanAmount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter amount"
                  className=" no-spinner w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                />
                {renderError('loanAmount')}


              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Purpose/Reason for Loan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reasonForLoan"
                  value={formik.values.reasonForLoan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter purpose or reason for the loan"
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                />
                {renderError('reasonForLoan')}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Loan Request Date
                </label>
                <input
                  type="date"
                  name="loanRequestDate"
                  value={formik.values.loanRequestDate}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Section 3: Repayment Details (Editable) */}
          <div className="mb-8">
            <SectionHeader number="3" title="Repayment Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Preferred Repayment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="preferredRepaymentMethod"
                  value={formik.values.preferredRepaymentMethod}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                >
                  <option value="Salary Deduction">Salary Deduction</option>
                </select>
                {renderError('preferredRepaymentMethod')}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Repayment Tenure (Months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="repaymentTenureInMonths"
                  value={formik.values.repaymentTenureInMonths}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter number of months"
                  className="no-spinner w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                />
                {renderError('repaymentTenureInMonths')}
                {formik.values.loanAmount && formik.values.repaymentTenureInMonths && (() => {
                  const validation = validateLoanAndTenure();
                  if (validation?.type === 'tenure') {
                    return (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          {validation.message}
                          {validation.message}
                        </p>
                      </div>
                    );
                  }
                  // if (validation?.type === 'warning') {
                  //   return (
                  //     <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  //       <p className="text-sm text-yellow-800">
                  //         {validation.warning}
                  //       </p>
                  //     </div>
                  //   );
                  // }
                  return null;
                })()}
              </div>

              {/* <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Deduction Start Month <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  name="deductionStartMonth"
                  value={formik.values.deductionStartMonth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                />
                {renderError('deductionStartMonth')}
              </div> */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Monthly Deduction Amount (₹)
                </label>
                <input
                  type="text"
                  name="monthlyDeductionAmount"
                  value={formik.values.monthlyDeductionAmount}
                  readOnly
                  placeholder="Auto calculated"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
                {renderError('monthlyDeductionAmount')}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Apply To (Approver) <span className="text-red-500">*</span>
                </label>
                <Select
                  options={applyToOptions}
                  value={applyToOptions.find(
                    (option) => option.value === formik.values.applyTo
                  )}
                  onChange={handleApplyToChange}
                  isClearable
                  placeholder="Select an option"
                />
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Section 4: Supporting Documents (Editable) */}
          <div className="mb-8">
            <SectionHeader number="4" title="Supporting Documents" />
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload Documents <span className="text-red-500">*</span>
              </label>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <AiOutlineCloudUpload
                    size={48}
                    style={{ color: theme.primaryColor }}
                  />
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </p>
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-3 mt-4">
                  {documents.map((doc, index) => {
                    // Extract filename from URL
                    const getFileName = (url) => {
                      try {
                        const urlPath = decodeURIComponent(url);
                        const parts = urlPath.split('/');
                        return parts[parts.length - 1];
                      } catch (e) {
                        return 'Document';
                      }
                    };

                    // Extract file extension
                    const getFileExtension = (url) => {
                      const fileName = getFileName(url);
                      const ext = fileName.split('.').pop();
                      return ext ? ext.toUpperCase() : 'DOC';
                    };

                    const fileName = typeof doc === 'string' ? getFileName(doc) : (doc.name || 'Document');
                    const fileExt = typeof doc === 'string' ? getFileExtension(doc) : (doc.name ? doc.name.split(".").pop().toUpperCase() : 'DOC');

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
                              {fileExt}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {fileName}
                            </p>
                            {doc.size && (
                              <p className="text-xs text-slate-500">{doc.size}</p>
                            )}
                          </div>
                        </div>
                        <IconButton
                          onClick={() => handleDeleteDocument(index)}
                          style={{ color: "#ef4444" }}
                        >
                          <MdDelete size={20} />
                        </IconButton>
                      </div>
                    );
                  })}
                </div>
              )}

              {documents.length === 0 && formik.submitCount > 0 && (
                <div className="text-red-500 text-sm">
                  At least one supporting document is required
                </div>
              )}
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Section 5: Declaration & Confirmation (Editable) */}
          <div className="mb-8">
            <SectionHeader number="5" title="Declaration & Confirmation" />
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="employerDeclaration"
                  checked={formik.values.employerDeclaration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-5 h-5 mt-1 cursor-pointer"
                  style={{ accentColor: theme.primaryColor }}
                />
                <div>
                  <p className="font-semibold text-slate-800 mb-2">
                    Employer Declaration <span className="text-red-500">*</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    I agree that the approved loan amount will be deducted from my salary as per company policy.
                  </p>
                </div>
              </div>
              {renderError('employerDeclaration')}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/emp/loanrequest")}
              className="px-6 py-3 rounded-lg font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading || !formik.values.employerDeclaration || !isFormValid()}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200"
              style={{
                backgroundColor: theme.primaryColor,
                opacity: (isSubmitting || loading || !formik.values.employerDeclaration || !isFormValid()) ? 0.5 : 1,
                cursor: (isSubmitting || loading || !formik.values.employerDeclaration || !isFormValid()) ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && !loading && formik.values.employerDeclaration && isFormValid()) {
                  e.target.style.opacity = "0.9";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting && !loading && formik.values.employerDeclaration && isFormValid()) {
                  e.target.style.opacity = "1";
                }
              }}
            >
              {isSubmitting || loading ? "Submitting..." : "Submit Loan Request"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplyLoanRequestForm;