import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import useCoreHR from "../../hooks/unisol/coreHr/useCoreHR";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTheme } from "../../hooks/theme/useTheme";
import Select from 'react-select';
import useEmployee from "../../hooks/unisol/onboarding/useEmployee";
import Button from "../Button";
import { PencilIcon } from "lucide-react";
import LoaderSpinner from "../LoaderSpinner";

const SearchEmp = ({ onClose, empdata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateSearchEmpCoreHR, updateSearchEmp, loading: coreHRLoading } = useCoreHR();
  const { departmentDrop, fetchDepartments, fetchOnboardingManager, getOnboardingManager, fetchDesignation, designationByDept, loading: empLoading } = useEmployee();
  const { theme } = useTheme();
  console.log(empdata);
  const validationSchema = Yup.object({
    department: Yup.string().required("Department is required"),
    designation: Yup.string().required("Designation is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    joiningDate: Yup.string().required("Joining Date is required"),
    manager: Yup.string().required("Manager is required"),
  });

  const formik = useFormik({
    initialValues: {
      department: empdata?.data?.department || "",
      designation: empdata?.data?.designation || "",
      email: empdata?.data?.officialEmail || "",
      phone: empdata?.data?.phoneNumber || "",
      joiningDate: empdata?.data?.joiningDate || "",
      manager: empdata?.data?.onboardingManager || "",
      status: "Active",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Form Data Submitted:", values);
        await updateSearchEmpCoreHR(empdata?.data?._id, {
          department: values.department,
          designation: values.designation,
          manager: values.manager,
        });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    },
  });


  console.log(formik.values, formik.errors)

  useEffect(() => {
    fetchDepartments();
    fetchOnboardingManager();
  }, []);

  useEffect(() => {
    if (formik.values.department) {
      fetchDesignation(formik.values.department);
    }
  }, [formik.values.department]);

  useEffect(() => {
    if (updateSearchEmp) {
      formik.setValues({
        department: updateSearchEmp.department || empdata?.data?.department,
        designation: updateSearchEmp.designation || empdata?.data?.designation,
        email: updateSearchEmp.officialEmail || empdata?.data?.officialEmail,
        phone: updateSearchEmp.phoneNumber || empdata?.data?.phoneNumber,
        joiningDate: updateSearchEmp.joiningDate || empdata?.data?.joiningDate,
        manager: updateSearchEmp.onboardingManager || empdata?.data?.onboardingManager,
        status: "Active",
      });
    }
  }, [updateSearchEmp, empdata]);


  console.log(formik.values, formik.errors)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ">
      <div className="h-screen w-screen  flex justify-center items-center">
        <div className="w-[507px] h-[485px] bg-white rounded-xl shadow-lg overflow-auto">
          {
            coreHRLoading || empLoading ? (<div className="flex justify-center items-center w-full h-full">
              <LoaderSpinner />
            </div>) : (<>
              <div
                className="w-full py-2 relative"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                {/* Close Button and BorderColorIcon */}
                <div className="absolute top-2 right-4 space-x-4 flex items-center">
                  {!isEditing && (
                    <PencilIcon size={25}
                      className="cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    />)}
                  <button onClick={onClose}>
                    <IoMdClose size={32} className="cursor-pointer" />
                  </button>
                </div>

                <div className="flex items-center py-4 ">
                  {/* <div className="h-[80px] w-[80px] ml-10 flex-shrink-0">
                <RiImageCircleLine style={{ fontSize: "60px" }} />
              </div> */}
                  <div className="px-4">
                    <h1 className="text-[#000000] text-opacity-89 text-xl font-bold">
                      Full Name: {empdata?.data?.fullName || "N/A"}
                    </h1>
                    <h1 className="text-[#000000] text-base font-normal">
                      Employee ID: {empdata?.data?.employeeId}
                    </h1>
                    <div className="flex gap-4 items-center">
                      <h2 className="font-medium text-base text-black">Status: </h2>
                      <h2 className="text-green-600 text-base font-medium">Active</h2>
                    </div>
                  </div>
                </div>
              </div>

              <form
                className="w-full flex  flex-col py-4 px-4 gap-4"
                onSubmit={formik.handleSubmit}
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="flex gap-4 items-center">
                    <h2 className="font-medium text-base text-black">Department</h2> :
                    {isEditing ? (
                      <div className="flex flex-col">
                        <Select
                          name="department"
                          options={departmentDrop.map((dept) => ({ label: dept, value: dept }))}
                          value={formik.values.department ? { label: formik.values.department, value: formik.values.department } : null}
                          onChange={(selected) => {
                            const value = selected?.value || '';
                            formik.setFieldValue('department', value);
                            formik.setFieldValue('designation', '');
                          }}
                          onBlur={() => formik.setFieldTouched('department', true)}
                          placeholder="Select Department"
                          isClearable
                          classNamePrefix="react-select"
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              borderColor: state.isFocused ? theme.secondaryColor : '#d1d5db',
                              boxShadow: state.isFocused ? `0 0 0 2px ${theme.secondaryColor}33` : 'none',
                              borderRadius: '0.75rem',
                              padding: '2px',
                            }),
                          }}
                        />
                        {formik.touched.department && formik.errors.department && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.department}
                          </div>
                        )}
                      </div>
                    ) : (
                      <h2 className="text-[#787878] text-base font-medium">
                        {updateSearchEmp?.department || empdata?.data?.department}
                      </h2>
                    )}
                  </div>

                  <div className="flex gap-4 items-center">
                    <h2 className="font-medium text-base text-black">Designation</h2>{" "}
                    :
                    {isEditing ? (
                      <div className="flex flex-col">
                        <Select
                          name="designation"
                          options={designationByDept.map((desig) => ({
                            label: desig,
                            value: desig,
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
                            formik.setFieldValue("designation", value);
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
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.designation}
                          </div>
                        )}
                      </div>
                    ) : (
                      <h2 className="text-[#787878] text-base font-medium">
                        {updateSearchEmp.designation || empdata?.data?.designation}
                      </h2>
                    )}
                  </div>


                  <div className="flex gap-4 items-center">
                    <h2 className="font-medium text-base text-black">Email ID: </h2>
                    <h2 className="text-[#787878] text-base font-medium">
                      {empdata?.data?.officialEmail}
                    </h2>
                  </div>
                  <div className="flex gap-4 items-center">
                    <h2 className="font-medium text-base text-black">Phone: </h2>
                    <h2 className="text-[#787878] text-base font-medium">
                      {empdata?.data?.phoneNumber}
                    </h2>
                  </div>
                  <div className="flex gap-4 items-center">
                    <h2 className="font-medium text-base text-black">
                      Date of Joining:{" "}
                    </h2>
                    <h2 className="text-[#787878] text-base font-medium">
                      {new Date(empdata?.data?.joiningDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </h2>
                  </div>
                  <div className="flex gap-4 items-center">
                    <h2 className="font-medium text-base text-black">Manager</h2> :
                    {isEditing ? (
                      <div className="flex flex-col">
                        <Select
                          name="manager"
                          options={getOnboardingManager.map((manager) => ({ label: manager, value: manager }))}
                          value={formik.values.manager ? { label: formik.values.manager, value: formik.values.manager } : null}
                          onChange={(selected) => {
                            const value = selected?.value || '';
                            formik.setFieldValue('manager', value);
                          }}
                          onBlur={() => formik.setFieldTouched('manager', true)}
                          placeholder="Select Manager"
                          isClearable
                          classNamePrefix="react-select"
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              borderColor: state.isFocused ? theme.secondaryColor : '#d1d5db',
                              boxShadow: state.isFocused ? `0 0 0 2px ${theme.secondaryColor}33` : 'none',
                              borderRadius: '0.75rem',
                              padding: '2px',
                            }),
                          }}
                        />
                        {formik.touched.manager && formik.errors.manager && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.manager}
                          </div>
                        )}
                      </div>
                    ) : (
                      <h2 className="text-[#787878] text-base font-medium">
                        {updateSearchEmp.onboardingManager || empdata?.data?.onboardingManager}
                      </h2>
                    )}
                  </div>

                  {/* <div className="flex gap-4 items-center">
                <h2 className="font-medium text-base text-black">
                  Office Location
                </h2>{" "}
                :
                {isEditing ? (
                  <input
                    type="text"
                    name="officeLocation"
                    placeholder="Office Location"
                    className="border-b-2 border-gray-400 "
                    value={formik.values.officeLocation}
                    onChange={formik.handleChange}
                  ></input>
                ) : (
                  <h2 className="text-[#787878] text-base font-medium">
                    {empdata?.data?.officeLocation}
                  </h2>
                )}
              </div> */}
                </div>
                <div className="flex justify-center w-full">
                  {isEditing && (
                    <Button
                      variant={2}
                      type="submit"
                      text="Save"
                    />
                  )
                  }
                </div>
              </form>
            </>)
          }
        </div>
      </div>
    </div>
  );
};

export default SearchEmp;
