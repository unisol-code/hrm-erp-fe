import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../../../components/Button";
import Select from "react-select";
import useOnboardingManager from "../../../../hooks/unisol/onboarding/useOnboardingManager";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import useEmployee from "../../../../hooks/unisol/onboarding/useEmployee";
import useCoreHR from "../../../../hooks/unisol/coreHr/useCoreHR";


const validationSchema = Yup.object({
  employeeId: Yup.string().required("Employee is required"),
  designation: Yup.string().required("Designation is required"),
  department: Yup.string().required("Department is required"),
});

const OnBoardingManager = () => {
  const { theme } = useTheme();
  const [buttonText, setButtonText] = useState("Add");
  const { loading,
    managerList,
    fetchManagerList,
    createManager
  } = useOnboardingManager();
  const { fetchDepartments, departmentDrop, fetchDesignation, designationByDept, loading: employeeLoading } = useEmployee();
  const { getAllEmployeeIdAndNameAccordingToDesignation,
    allEmployeeIdWithName,
    loading: coreHRloading } = useCoreHR();

  const formik = useFormik({
    initialValues: {
      employeeId: "",
      designation: "",
      department: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await createManager(values);
      fetchManagerList();
      resetForm();
      setButtonText("Add");
    },
  });
  useEffect(() => {
    fetchManagerList();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!formik.values.department) {
      return;
    }
    fetchDesignation(formik.values.department);
  }, [formik.values.department])
  useEffect(() => {
    if (!formik.values.department || !formik.values.designation) {
      return;
    }
    getAllEmployeeIdAndNameAccordingToDesignation(
      formik.values.designation,
      formik.values.department
    );

  }, [formik.values.department, formik.values.designation])
  console.log(formik.values, formik.errors)
  return (
    <div className="min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Onboarding Management" },
          { text: "Onboarding Manager" },
        ]}
      />
      <div className="bg-white shadow-md rounded-2xl">
        {/* Header */}
        <div
          className="flex flex-wrap items-center justify-between w-full py-4 px-8 rounded-t-xl gap-4"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h2 className="font-bold text-lg">Onboarding Manager</h2>
        </div>

        {/* Search Section */}
        <div className="flex flex-col gap-4 p-2 w-full">
          <div className="flex flex-col border-2 border-gray-300 rounded-md py-2 w-full">
            <div className="flex flex-row md:flex-row items-center justify-between gap-4 px-6 py-2">
              <p className="font-semibold text-lg">Add Manager</p>
              <button
                className="text-white px-4 py-2 rounded-md"
                style={{ backgroundColor: theme.primaryColor }}
                onClick={() => {
                  setButtonText(buttonText === "Add" ? "Hide" : "Add");
                  if (buttonText === "Hide") {
                    formik.resetForm();
                    setEmpId(null);
                  }
                }}
              >
                {buttonText}
              </button>
            </div>

            {buttonText === "Hide" && (
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col w-full gap-6 p-5 bg-white"
              >
                {/* Department & Designation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Department Select */}
                  <div className="flex flex-col">
                    <label className="font-semibold mb-2">Select Department</label>
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
                        const value = selected?.value || "";
                        if (!value) {
                          formik.resetForm();
                        }
                        formik.setFieldValue("department", value);
                        handleDepartmentChange({
                          target: { name: "department", value },
                        });
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
                      <p className="text-red-500 mt-1 text-sm">{formik.errors.department}</p>
                    )}
                  </div>

                  {/* Designation Select */}
                  <div className="flex flex-col">
                    <label className="font-semibold mb-2">Select Designation</label>
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
                        handleDesignationChange({
                          target: { name: "designation", value },
                        });
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
                      <p className="text-red-500 mt-1 text-sm">{formik.errors.designation}</p>
                    )}
                  </div>
                </div>
                {/*employeeId*/}
                <div className="flex flex-col">
                  <label className="font-semibold mb-2">Select Employee</label>
                  <Select
                    options={allEmployeeIdWithName?.employees?.map(emp => ({
                      value: emp.employeeId,
                      label: emp.fullName
                    }))}
                    isLoading={coreHRloading}
                    isDisabled={!formik.values.department || !formik.values.designation}
                    value={
                      formik.values.employeeId
                        ? allEmployeeIdWithName?.employees
                          ?.map(emp => ({ value: emp.employeeId, label: emp.fullName }))
                          .find(option => option.value === formik.values.employeeId)
                        : null
                    }
                    onChange={(selected) => {
                      formik.setFieldValue("employeeId", selected?.value || "");
                    }}
                    onBlur={() => formik.setFieldTouched("employeeId", true)}
                    placeholder="Select Employee"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 mt-1 text-sm">{formik.errors.name}</p>
                  )}
                </div>


                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit" variant={1} text="Submit" />
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-4 h-px w-full border-b-4 border-double border-gray-300" />

        {/* Table */}
        <div className="overflow-x-auto mt-2 p-4">
          <table className="min-w-full border-collapse rounded-xl overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gray-100 text-sm md:text-base text-gray-600 uppercase tracking-wider">
                <th className="p-4 text-left">Manager ID</th>
                <th className="p-4 text-left">Manager Name</th>
                <th className="p-4 text-left">Designation</th>
                <th className="p-4 text-left">Department</th>
              </tr>
            </thead>
            <tbody className="text-sm md:text-base divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center">
                    <div className="flex w-full justify-center items-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : managerList?.data?.managers?.length > 0 ? (
                managerList?.data?.managers?.map((manager) => (
                  <tr
                    key={manager?.managerId || "N/A"}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-700 font-medium">{manager?.managerId}</td>
                    <td className="p-4 text-gray-700">{manager?.name}</td>
                    <td className="p-4 text-gray-700">{manager?.designation}</td>
                    <td className="p-4 text-gray-700">{manager?.department}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No managers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default OnBoardingManager;
