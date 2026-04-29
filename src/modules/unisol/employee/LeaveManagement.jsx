import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import useEmpApplyLeave from "./../../../hooks/unisol/empLeave/useEmpApplyLeave";
import Breadcrumb from "../../../components/BreadCrumb";
import {
  FaRegCalendarAlt,
  FaBusinessTime,
  FaCalendarCheck,
  FaExclamationCircle,
} from "react-icons/fa";
import { FcLeave } from "react-icons/fc";
import { useTheme } from "../../../hooks/theme/useTheme";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  appliedDate: Yup.date()
    .required("Applied Date is required")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Applied Date cannot be in the past"
    )
    .max(
      new Date(new Date().setMonth(new Date().getMonth() + 2)),
      "Applied Date cannot be more than 2 months in the future"
    ),
  fromDate: Yup.date()
    .required("From Date is required")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "From Date cannot be in the past"
    )
    .max(
      new Date(new Date().setMonth(new Date().getMonth() + 2)),
      "From Date cannot be more than 2 months from today"
    ),
  toDate: Yup.date()
    .required("To Date is required")
    .test(
      "is-after-fromDate",
      "To Date must be the same as or after From Date",
      function (value) {
        const { fromDate } = this.parent;
        if (!value || !fromDate) return false;
        return new Date(value) >= new Date(fromDate);
      }
    )
    .max(
      new Date(new Date().setMonth(new Date().getMonth() + 2)),
      "To Date cannot be more than 2 months from today"
    ),
  reason: Yup.string().required("Reason is required"),
  leaveType: Yup.string().required("Please select a leave type"),
  applyTo: Yup.string().required("Please select a user to apply to."),
});

const LeaveManagement = () => {
  const {
    applyLeave,
    leave,
    allLeaveTypes,
    leaveType,
    userForLeaveApply,
    userForApply,
    totalLeaves,
    leavesTotal,
    leavePending,
    leavesPending,
    leaveTaken,
    leavesTaken,
    loading,
  } = useEmpApplyLeave();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const empId = sessionStorage.getItem("empId");

  useEffect(() => {
    userForLeaveApply();
    totalLeaves(empId);
    leavePending(empId);
    leaveTaken(empId);
  }, []);
  useEffect(() => {
    allLeaveTypes(empId);
  }, [empId])

  console.log("total", leavesTotal);
  console.log(leaveType)
  const todayStr = new Date().toISOString().split("T")[0];
  const formik = useFormik({
    initialValues: {
      appliedDate: todayStr,
      fromDate: "",
      toDate: "",
      reason: "",
      applyTo: "",
      leaveType: "",
      document: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("appliedDate", values.appliedDate);
        formData.append("fromDate", values.fromDate);
        formData.append("toDate", values.toDate);
        formData.append("reason", values.reason);
        formData.append("applyTo", values.applyTo);
        formData.append("leaveType", values.leaveType);
        formData.append("document", values.document);
        formData.append("employee", empId);
        await applyLeave(formData);
        navigate("/EmployeeDashboard");
      } catch (error) {
        console.error("Error applying leave:", error);
      }
    },
  });

  console.log("userForApply", userForApply)
  const applyToOptions =
    userForApply?.map((name) => ({ value: name?._id, label:`${name?.fullName} ${name?.role ? "- " + "(Super Admin)" : ""}`})) || [];

  const handleApplyToChange = (selectedOption) => {
    formik.setFieldValue("applyTo", selectedOption ? selectedOption.value : "");
  };
  console.log(formik.values);
  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0">
      <Breadcrumb
        linkText={[
          { text: "Dashboard", href: "/EmployeeDashboard" },
          { text: "Leave Management" },
        ]}
      />

      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="text-2xl font-bold py-4 px-8 flex items-center rounded-2xl bg-gradient-to-r from-blue-50 to-white shadow-lg gap-3 border border-gray-100">
          <FcLeave size={34} /> Leave Management
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <section className="bg-white px-6 py-8 rounded-2xl shadow-md border border-gray-100 space-y-10">
                {/* Title */}
                <div className="flex items-center gap-3 text-xl font-semibold text-gray-700 border-b pb-2">
                  <FaRegCalendarAlt className="text-blue-600" /> Apply for Leave
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Date Inputs */}
                  {[
                    {
                      label: "Applied Date:",
                      name: "appliedDate",
                      disabled: true,
                    },
                    {
                      label: "From:",
                      name: "fromDate",
                      min: formik.values.appliedDate,
                      disabled: false,
                    },
                    {
                      label: "To Date:",
                      name: "toDate",
                      min: formik.values.fromDate || formik.values.appliedDate,
                      disabled: false,
                    },
                  ].map((field, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">
                        {field.label}
                      </label>
                      <input
                        type="date"
                        name={field.name}
                        value={formik.values[field.name]}
                        min={field.min}
                        disabled={field.disabled}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm outline-none"
                      />
                      {formik.touched[field.name] &&
                        formik.errors[field.name] && (
                          <p className="text-red-500 text-sm mt-1">
                            {formik.errors[field.name]}
                          </p>
                        )}
                    </div>
                  ))}

                  {/* Leave Type */}
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Leave Type:
                    </label>
                    <Select
                      name="leaveType"
                      options={
                        Array.isArray(leaveType?.availableLeaveTypes)
                          ? leaveType.availableLeaveTypes.map((lt) => ({
                            value: lt.type,
                            label: lt.type
                          }))
                          : []
                      }
                      value={leaveType?.availableLeaveTypes
                        ? {
                          value: formik.values.leaveType,
                          label: leaveType.availableLeaveTypes.find(
                            (lt) => lt.type === formik.values.leaveType
                          )?.type
                        }
                        : null
                      }
                      onChange={(selectedOption) =>
                        formik.setFieldValue("leaveType", selectedOption?.value || "")
                      }
                      isClearable
                      placeholder="Select Leave Type"
                    />
                    {formik.touched.leaveType && formik.errors.leaveType && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.leaveType}
                      </p>
                    )}
                  </div>

                  {/* Apply To */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-semibold text-gray-600">
                      Apply To:
                    </label>
                    <Select
                      options={applyToOptions}
                      value={applyToOptions.find(
                        (option) => option.value === formik.values.applyTo
                      )}
                      onChange={handleApplyToChange}
                      isClearable
                      placeholder="Select User"
                    />
                    {formik.touched.applyTo && formik.errors.applyTo && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.applyTo}
                      </p>
                    )}
                  </div>

                  {/* Reason */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-semibold text-gray-600">
                      Reason:
                    </label>
                    <textarea
                      name="reason"
                      value={formik.values.reason}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter reason for leave"
                      className="border border-gray-300 min-h-[80px] p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                    />
                    {formik.touched.reason && formik.errors.reason && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.reason}
                      </p>
                    )}
                  </div>

                  {/* Document */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-semibold text-gray-600">
                      Document:
                    </label>
                    <input
                      id="uploadDocument"
                      type="file"
                      className="hidden"
                      name="document"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "document",
                          e.currentTarget.files[0]
                        )
                      }
                    />
                    <label
                      htmlFor="uploadDocument"
                      className="cursor-pointer h-12 rounded-lg border-2 border-dashed border-gray-300 flex justify-center items-center gap-2 hover:border-blue-400 hover:text-blue-500 transition-all bg-gray-50"
                    >
                      <UploadFileIcon />
                      {formik.values.document
                        ? formik.values.document.name
                        : "Add File"}
                    </label>
                    {formik.touched.document && formik.errors.document && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.document}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-6 justify-center items-center mt-10">
                  <button
                    type="button"
                    className="border border-blue-400 text-blue-500 px-8 py-2 rounded-lg text-lg font-medium bg-white hover:bg-blue-50 transition"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-white px-6 py-2 rounded-lg font-semibold text-lg shadow-md transition-all hover:opacity-90"
                    disabled={loading}
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {loading ? "Saving..." : "Apply for Leave"}
                  </button>
                </div>
              </section>
            </form>
          </div>

          {/* Stats Section */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {[
              {
                title: "Total Leaves",
                icon: <FaBusinessTime className="text-green-500" />,
                data: leavesTotal?.TotalLeaves,
                colors: "text-green-600",
              },
              {
                title: "Pending Leaves",
                icon: <FaExclamationCircle className="text-yellow-500" />,
                data: leavesPending?.PendingLeaves,
                colors: "text-yellow-600",
              },
              {
                title: "Leaves Taken",
                icon: <FaCalendarCheck className="text-red-500" />,
                data: leavesTaken?.LeavesTaken,
                colors: "text-red-600",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
              >
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  {card.icon} {card.title}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Casual Leaves:</span>
                    <span className={`font-bold text-lg ${card.colors}`}>
                      {card.data?.casualLeaves ?? "0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Sick Leaves:</span>
                    <span className={`font-bold text-lg ${card.colors}`}>
                      {card.data?.sickLeaves ?? "0"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
