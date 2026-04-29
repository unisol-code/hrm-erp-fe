import React from "react";
import { UserMinus } from "lucide-react";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";

const ApplyResignationForm = ({
  formik,
  isSubmitting,
  loading,
  // empBasicDetail,
  employee,
  loan,
  id,
  navigate,
  isFormValid,
  hrManagers = [],
}) => {
  const { theme } = useTheme();
  const isEditMode = Boolean(id);

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
      <div className="text-red-500 text-sm mt-1">
        {formik.errors[fieldName]}
      </div>
    ) : null;
  };

  return (
    <div>
      <Breadcrumb
        linkText={[
          { text: "Resignation", href: "/emp/resignation" },
          { text: isEditMode ? "Edit Resignation" : "Apply for Resignation" },
        ]}
      />

      <div className="py-4 px-8 flex flex-col md:flex-row md:items-center justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <UserMinus style={{ color: theme.primaryColor, fontSize: 32 }} />
          <span className="text-2xl font-bold">
            {isEditMode ? "Edit Resignation" : "Resignation Form"}
          </span>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Section 1: Employee Information */}
          <div className="mb-8">
            <SectionHeader number="1" title="Employee Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoField
                label="Employee ID"
                value={employee?.data?.employeeId}
              />
              <InfoField
                label="Employee Name"
                value={employee?.data?.employeeName}
              />
              <InfoField
                label="Department"
                value={employee?.data?.department}
              />
              <InfoField
                label="Designation"
                value={employee?.data?.designation}
              />
              <InfoField
                label="Date of Joining"
                value={employee?.data?.joiningDate}
              />
              <InfoField
                label="Employment Type"
                value={employee?.data?.employeementType}
              />
              <InfoField
                label="Reporting Manager"
                value={employee?.data?.manager}
              />
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Section 2: Offboarding Details */}
          <div className="mb-8">
            <SectionHeader number="2" title="Resignation  Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Offboarding Type <span className="text-red-500">*</span>
                </label>
                <input
                  name="offboardingType"
                  value="Resignation"
                  readOnly
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Resignation Reason <span className="text-red-500">*</span>
                </label>
                <select
                  name="resignationReason"
                  value={formik.values.resignationReason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRing: theme.primaryColor }}
                >
                  <option value="" disabled>
                    Select Resignation Reason
                  </option>
                  <option value="Better Opportunity">Better Opportunity</option>
                  <option value="Personal Reasons">Personal Reasons</option>
                  <option value="Health Issues">Health Issues</option>
                  <option value="Family Reasons">Family Reasons</option>
                  <option value="Further Studies">Further Studies</option>
                  <option value="Relocation">Relocation</option>
                  <option value="Career Change">Career Change</option>
                  <option value="Other">Other</option>
                </select>
                {renderError("resignationReason")}
              </div>

              {formik.values.resignationReason === "Other" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Please Specify Other Reason{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="otherReason"
                    value={formik.values.otherReason}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter other reason"
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  />
                  {renderError("otherReason")}
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Detailed Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="detailedRemarks"
                  value={formik.values.detailedRemarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter detailed remarks about your resignation"
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                />
                {renderError("detailedRemarks")}
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Section 3: Notice Period */}
          <div className="mb-8">
            <SectionHeader number="3" title="Notice Period Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Notice Period (in Days){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="noticePeriod"
                  value={
                    formik.values.noticePeriod || employee?.data?.NoticePeriod
                  }
                  readOnly
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Resignation Date
                </label>
                <input
                  type="date"
                  name="resignationDate"
                  value={formik.values.resignationDate}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Section 4: Approval Status (Only in Edit Mode) */}
          {isEditMode && (
            <>
              <div className="mb-8">
                <SectionHeader number="4" title="Approval Status" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoField
                    label="Approval Status"
                    value={formik.values.approvalStatus || "Pending"}
                  />
                  <InfoField
                    label="Notice Period Start Date"
                    value={formik.values.noticePeriodStartDate || "-"}
                  />
                  <div className="md:col-span-2">
                    <InfoField
                      label="Last Working Date"
                      value={formik.values.lastWorkingDate || "-"}
                    />
                  </div>
                </div>
              </div>
              <hr className="my-8 border-slate-200" />
            </>
          )}

          {/* Section 5: Loan or Advance Amount */}
          <div className="mb-8">
            <SectionHeader
              number={isEditMode ? "5" : "4"}
              title="Loan / Advance Declaration"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoField
                label="Any Active Loan/Advance?"
                value={loan?.anyActiveLoan ? "Yes" : "No"}
              />

              {loan?.anyActiveLoan && (
                <InfoField
                  label="Outstanding Loan Amount"
                  value={loan?.outstandingLoanAmount || "-"}
                />
              )}

              {loan?.outstandingLoanAmount && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Agree to Settlement via Final Pay?
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="agreeToSettlement"
                        checked={formik.values.agreeToSettlement}
                        onChange={formik.handleChange}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: theme.primaryColor }}
                      />
                      <span className="text-sm text-slate-700">
                        Yes, I agree to settle via final pay
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Apply HR <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="applyToHR"
                      value={formik.values.applyToHR}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    >
                      <option value="" disabled>
                        Select HR Name
                      </option>
                      {hrManagers?.map((hr) => (
                        <option key={hr._id} value={hr._id}>
                          {hr.fullName}
                        </option>
                      ))}
                    </select>
                    {renderError("applyToHR")}
                  </div>
                </>
              )}
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Section 6: Employee Declaration */}
          <div className="mb-8">
            <SectionHeader
              number={isEditMode ? "6" : "5"}
              title="Employee Declaration"
            />
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="employeeDeclaration"
                  checked={formik.values.employeeDeclaration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-5 h-5 mt-1 cursor-pointer"
                  style={{ accentColor: theme.primaryColor }}
                />
                <div>
                  <p className="font-semibold text-slate-800 mb-2">
                    Employee Declaration <span className="text-red-500">*</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    I hereby declare that the information provided above is true
                    and accurate to the best of my knowledge. I understand that
                    I am required to serve the notice period as per company
                    policy and complete all handover formalities before my last
                    working day.
                  </p>
                </div>
              </div>
              {renderError("employeeDeclaration")}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/emp/resignation")}
              className="px-6 py-3 rounded-lg font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                loading ||
                !formik.values.employeeDeclaration ||
                !isFormValid()
              }
              className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200"
              style={{
                backgroundColor: theme.primaryColor,
                opacity:
                  isSubmitting ||
                  loading ||
                  !formik.values.employeeDeclaration ||
                  !isFormValid()
                    ? 0.5
                    : 1,
                cursor:
                  isSubmitting ||
                  loading ||
                  !formik.values.employeeDeclaration ||
                  !isFormValid()
                    ? "not-allowed"
                    : "pointer",
              }}
              onMouseEnter={(e) => {
                if (
                  !isSubmitting &&
                  !loading &&
                  formik.values.employeeDeclaration &&
                  isFormValid()
                ) {
                  e.target.style.opacity = "0.9";
                }
              }}
              onMouseLeave={(e) => {
                if (
                  !isSubmitting &&
                  !loading &&
                  formik.values.employeeDeclaration &&
                  isFormValid()
                ) {
                  e.target.style.opacity = "1";
                }
              }}
            >
              {isSubmitting || loading
                ? "Submitting..."
                : isEditMode
                ? "Update Resignation"
                : "Submit Resignation"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplyResignationForm;
