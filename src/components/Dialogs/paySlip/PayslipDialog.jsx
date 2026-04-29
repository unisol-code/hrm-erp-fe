/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import useEmployee from "../../../hooks/unisol/onboarding/useEmployee";
import * as Yup from "yup";
import { useTheme } from "../../../hooks/theme/useTheme";
import Select from "react-select";
import { useFormik } from "formik";
import useCoreHR from "../../../hooks/unisol/coreHr/useCoreHR"
import Button from "../../Button";
import { useNavigate } from "react-router-dom";

const PayslipDialog = ({ onClose }) => {
  const [selectedId, setSelectedId] = useState(null);
  const {
    fetchDepartments,
    departmentDrop,
    designationByDept,
    fetchDesignation,
    fetchCandidatebyQuery,
    loading: employeeLoading,
  } = useEmployee()
  const {
    getAllEmployeeIdAndNameAccordingToDesignation,
    allEmployeeIdWithName,
    loading: coreHRloading
  } = useCoreHR();
  const { theme } = useTheme();
  const validationSchema = Yup.object({
    department: Yup.string().required("Department is required"),
    designation: Yup.string().required("Designation is required"),
    employeeName: Yup.string().required("Employee is required"),
  });
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      department: "",
      designation: "",
      employeeName: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      navigate(`/emplist/generatePayslip/${selectedId}`)
    },
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formik.values.department) {
      fetchDesignation(formik.values.department);
    }
  }, [formik.values.department]);

  useEffect(() => {
    if (formik.values.department && formik.values.designation) {
      getAllEmployeeIdAndNameAccordingToDesignation(formik.values.designation, formik.values.department);
    }
  }, [formik.values.department, formik.values.designation]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="flex justify-between items-center h-[70px] px-6 border-b"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h2 className="text-xl font-semibold text-black">
            Payslip Download Options
          </h2>
          <button onClick={onClose}>
            <IoMdClose
              size={24}
              className="cursor-pointer text-gray-700 hover:text-red-500"
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-6 flex w-full flex-col"
          >
            {/* Employee Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <Select
                  name="department"
                  isLoading={employeeLoading}
                  options={departmentDrop.map((dept) => ({
                    label: dept,
                    value: dept,
                  }))}
                  value={
                    formik.values.department
                      ? {
                        label: formik.values.department,
                        value: formik.values.department,
                      }
                      : null
                  }
                  onChange={(selected) => {
                    const dept = selected?.value || "";
                    formik.setFieldValue("department", dept);
                    formik.setFieldValue("designation", "");
                    formik.setFieldValue("employeeName", "");
                  }}
                  onBlur={() => formik.setFieldTouched("department", true)}
                  placeholder="Select Department"
                  isClearable
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderColor: state.isFocused
                        ? theme.secondaryColor
                        : "#d1d5db",
                      boxShadow: state.isFocused
                        ? `0 0 0 2px ${theme.secondaryColor}33`
                        : "none",
                      borderRadius: "0.75rem",
                      padding: "2px",
                    }),
                  }}
                />
                {formik.touched.department && formik.errors.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.department}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <Select
                  name="designation"
                  isLoading={employeeLoading}
                  options={designationByDept?.map((d) => ({
                    label: d,
                    value: d,
                  }))}
                  value={
                    formik.values.designation
                      ? {
                        label: formik.values.designation,
                        value: formik.values.designation,
                      }
                      : null
                  }
                  isDisabled={!formik.values.department}
                  onChange={(selected) => {
                    const desig = selected?.value || "";
                    formik.setFieldValue("designation", desig);
                    formik.setFieldValue("employeeName", "");
                  }}
                  onBlur={() => formik.setFieldTouched("designation", true)}
                  placeholder="Select Designation"
                  isClearable
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderColor: state.isFocused
                        ? theme.secondaryColor
                        : "#d1d5db",
                      boxShadow: state.isFocused
                        ? `0 0 0 2px ${theme.secondaryColor}33`
                        : "none",
                      borderRadius: "0.75rem",
                      padding: "2px",
                    }),
                  }}
                />
                {formik.touched.designation && formik.errors.designation && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.designation}
                  </p>
                )}
              </div>

              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name
                </label>
                <Select
                  name="employeeName"
                  isLoading={coreHRloading}
                  options={Array.isArray(allEmployeeIdWithName?.employees) ? allEmployeeIdWithName?.employees?.map((emp) => ({
                    label: emp.fullName,
                    value: emp.fullName,
                  })) : []}
                  value={
                    formik.values.employeeName
                      ? {
                        label: formik.values.employeeName,
                        value: formik.values.employeeName,
                      }
                      : null
                  }
                  isDisabled={!formik.values.designation}
                  onChange={(selected) => {
                    formik.setFieldValue("employeeName", selected?.value || "")
                    if (selected?.value) {
                      const seletedDetails = allEmployeeIdWithName?.employees.find((emp) => selected?.value === emp.fullName)
                      setSelectedId(seletedDetails?._id || null)
                    }
                  }
                  }
                  onBlur={() => formik.setFieldTouched("employeeName", true)}
                  placeholder="Select Employee"
                  isClearable
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderColor: state.isFocused
                        ? theme.secondaryColor
                        : "#d1d5db",
                      boxShadow: state.isFocused
                        ? `0 0 0 2px ${theme.secondaryColor}33`
                        : "none",
                      borderRadius: "0.75rem",
                      padding: "2px",
                    }),
                  }}
                />
                {formik.touched.employeeName && formik.errors.employeeName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.employeeName}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 pt-4">
              <Button onClick={onClose} variant={3} text="Cancel" />
              <Button type="submit" variant={1} text="View Payslip" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayslipDialog;
