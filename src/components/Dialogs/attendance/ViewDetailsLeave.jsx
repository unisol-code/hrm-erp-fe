import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import PASTAL from "../../../assets/images/bg-190742.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useCoreHR from "../../../hooks/unisol/coreHr/useCoreHR";
import useAttendence from "../../../hooks/unisol/attendence/useAttendence";
import useEmployee from "../../../hooks/unisol/onboarding/useEmployee";
import { useTheme } from "../../../hooks/theme/useTheme";
import Select from 'react-select'
import Button from "../../Button";

const ViewDetailsLeave = ({ onClose }) => {
  const navigate = useNavigate();
  const { functionSearchEmployee, searchEmployee } = useAttendence();
  const { departmentDrop, designationByDept, fetchDesignation, fetchDepartments, loading: employeeLoading } = useEmployee()
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectDesignation] = useState(null)
  const { allEmployeeIdWithName,
    loading: coreHRloading, getAllEmployeeIdAndNameAccordingToDesignation } = useCoreHR()
  const { theme } = useTheme();
  const validationSchema = Yup.object().shape({
    empId: Yup.string().required("empId is required"),
    name: Yup.string().required("name is required"),
    department: Yup.date().required("department is required"),
  });
  useEffect(() => {
    fetchDepartments();
  }, []);
  useEffect(() => {
    if (selectedDepartment) {
      fetchDesignation(selectedDepartment);
    }
  }, [selectedDepartment]);
  useEffect(() => {
    if (selectedDepartment && selectedDesignation) {
      getAllEmployeeIdAndNameAccordingToDesignation(selectedDesignation, selectedDepartment)

    }
    console.log(allEmployeeIdWithName)
    console.log(selectedDepartment, selectedDesignation)
    console.log(selectedDepartment, selectedDesignation)
  }, [selectedDepartment, selectedDesignation])
  const handleDepartmentChange = (event) => {
    const departmentCode = event.target.value;
    formik.setFieldValue("department", departmentCode);
    console.log(departmentCode)
    setSelectedDepartment(departmentCode);
  };
  const handleDesignationChange = (event) => {
    const designationCode = event.target.value;
    formik.setFieldValue("designation", designationCode);
    console.log(designationCode)
    setSelectDesignation(designationCode);
  };
  const formik = useFormik({
    initialValues: {
      empId: "",
      name: "",
      department: "",
    },

    //validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("form values : ", values);

      try {
        const res = await functionSearchEmployee(values);
        if (res?.success) {
          navigate(`/leaveManagement/leaveManagementDetails/${res?.data?._id}`);
          onClose();
        }
      } catch (error) {
        console.error("Error searching employee:", error);
      }
    },
  });
  const [generate, generateView] = useState(false)
  console.log("departmentDrop : ", departmentDrop);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[605px] max-h-[90vh] bg-white shadow-lg overflow-y-auto"
      >
        <div
          className="flex items-center justify-between w-full h-[61px] px-6"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="text-black text-opacity-80 text-xl font-semibold">
            View Leave Details
          </div>
          <button onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </div>

        <h1 className="mt-3 px-4">
          View Leave information for the selected employee.
        </h1>

        <div className="flex flex-col w-full gap-4 p-4">
          {/* Department */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Department</label>
            <Select
              name="department"
              isLoading={employeeLoading}
              options={departmentDrop.map((dept) => ({
                label: dept,
                value: dept,
              }))}
              value={
                formik.values.department
                  ? { label: formik.values.department, value: formik.values.department }
                  : null
              }
              onChange={(selected) => {
                const value = selected?.value || "";
                if (!value) {
                  formik.resetForm();
                  setSelectedEmployeeName("");
                }
                formik.setFieldValue("department", value);
                handleDepartmentChange({ target: { name: "department", value } });
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
            <div className="min-h-[20px] text-red-500 text-sm">
              {formik.touched.department && formik.errors.department}
            </div>
          </div>

          {/* Designation */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Designation</label>
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
                const value = selected?.value || "";
                if (!value) {
                  formik.setFieldValue("empId", "");
                  setSelectedEmployeeName("");
                }
                formik.setFieldValue("designation", value);
                handleDesignationChange({ target: { name: "designation", value } });
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
            <div className="min-h-[20px] text-red-500 text-sm">
              {formik.touched.designation && formik.errors.designation}
            </div>
          </div>

          {/* Employee ID */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Employee ID</label>
            <Select
              name="empId"
              isLoading={coreHRloading}
              options={allEmployeeIdWithName?.employees?.map((e) => ({
                label: e.employeeId,
                value: e.employeeId,
              }))}
              value={
                formik.values.empId
                  ? { label: formik.values.empId, value: formik.values.empId }
                  : null
              }
              onChange={(selected) => {
                const value = selected?.value || "";
                formik.setFieldValue("empId", value);
                const selectedEmployee =
                  allEmployeeIdWithName?.employees.find(
                    (emp) => emp.employeeId === value
                  );
                setSelectedEmployeeName(selectedEmployee?.fullName || "");
              }}
              onBlur={() => formik.setFieldTouched("empId", true)}
              placeholder="Select Employee ID"
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
            <div className="min-h-[20px] text-red-500 text-sm">
              {formik.touched.empId && formik.errors.empId}
            </div>
          </div>
        </div>

        {/* Name display */}
        <div className="flex justify-center gap-6 items-center w-full mt-2">
          {selectedEmployeeName && (
            <div className="flex gap-2 items-center">
              <label className="text-gray-700 text-md font-semibold">
                Employee Name:
              </label>
              <span
                className="text-md font-semibold"
                style={{ color: theme.primaryColor }}
              >
                {selectedEmployeeName}
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-14 pb-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border transition"
            style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.highlightColor;
              e.currentTarget.style.color = "black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = theme.primaryColor;
            }}
          >
            Close
          </button>
          <button
            type="submit"
            className="text-base px-4 py-2 rounded-md text-white hover:text-black border"
            style={{
              backgroundColor: theme.primaryColor,
              borderColor: theme.primaryColor,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = theme.highlightColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = theme.primaryColor)
            }
          >
            Search
          </button>
        </div>
      </form>
    </div>

  );
};

export default ViewDetailsLeave;
