/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useEmployee from "../../../../hooks/unisol/onboarding/useEmployee";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/Button";
import Select from 'react-select';
import user from '../../../../assets/images/user.png'

const CandidateProfile = () => {
  const {
    fetchDepartments,
    departmentDrop,
    fetchEmployeeByDept,
    employeeByDept,
    fetchCandidatebyQuery,
    employeeByQuery,
    loading,
    resetEmployee
  } = useEmployee();
  console.log("employeeByQuery", employeeByQuery);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  console.log(employeeByDept)

  useEffect(() => {
    fetchDepartments();
  }, []);
  

  const validationSchema = Yup.object({
    department: Yup.string().required("Department is required"),
    fullName: Yup.string().required("Candidate is required"),
    officialEmail: Yup.string().required("Invalid official Email address"),
  });

  const handleSubmit = (values) => {
    setDialogOpen(true);
    try {
      fetchCandidatebyQuery(values);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleViewProfile = (employeeByQuery) => {
    if (employeeByQuery?.success === true) {
      navigate(`/candidateProfile/profile/${employeeByQuery?.employee?._id}`);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Breadcrumb
        linkText={[
          { text: "Onboarding Management"},
          { text: "Candidate Profile" },
        ]}
      />
      <div className="flex flex-col rounded-2xl gap-5 rounded-xl shadow-md bg-white">
        <div className="flex flex-col w-full rounded-t-xl box-border justify-center items-start px-8 py-4 gap-2"
          style={{ backgroundColor: theme.secondaryColor }}>
          <h2 className="font-semibold text-[17px]">
            Welcome to the Candidate Overview Portal
          </h2>

          <h2 className="text-[15px]">
            Select, Review, and Dive Deeper into the Profiles of Top Candidates
          </h2>
        </div>
        <div className="flex flex-col">
          <Formik
            initialValues={{ department: "", fullName: "", officialEmail: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, resetForm, values, setTouched }) => (
              <Form>
                <div className="mx-8 my-3 flex flex-col items-center justify-center gap-12 py-2">
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 pt-3">
                    {/* Department Field */}
                    <div className="flex flex-col gap-1 px-4">
                      <label htmlFor="department" className="text-sm font-medium">
                        Department
                      </label>
                      <Select
                        name="department"
                        placeholder="Select department"
                        isLoading={loading}
                        options={departmentDrop.map((dept) => ({ label: dept, value: dept }))}
                        classNamePrefix="react-select"
                        isClearable
                        onChange={(selected) => {
                          const department = selected?.value;
                          if (!department) {
                            resetForm();
                            setSelectedEmail("");
                            setSubmitted(false);
                          }
                          setFieldValue("department", department);
                          setTouched("department, true");
                          if (department) {
                            fetchEmployeeByDept(department);
                          }
                        }}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: theme.secondaryColor,
                            borderRadius: '0.375rem', // Tailwind rounded-md
                            padding: '2px 6px',
                          }),
                          option: (base, state) => ({
                            ...base,
                            padding: '8px 12px',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 999,
                          }),
                        }}
                      />
                      <ErrorMessage name="department" component="div" className="text-red-500 text-sm" />
                    </div>

                    {/* Candidate Field */}
                    <div className="flex flex-col gap-1 px-4">
                      <label htmlFor="fullName" className="text-sm font-medium">
                        Candidate Selection
                      </label>
                      <Select
                        name="fullName"
                        placeholder="Select Full Name"
                        isLoading={loading}
                        isClearable
                        isDisabled={!values.department}
                        options={
                          Array.isArray(employeeByDept?.employees)
                            ? employeeByDept.employees.map((e) => ({
                              label: e.fullName,
                              value: e.fullName
                            }))
                            : []
                        }
                        onChange={(selectedOption) => {
                          const selectedFullName = selectedOption?.value || "";
                          setFieldValue("fullName", selectedFullName);
                          setTouched("fullName", true)
                          const selected = employeeByDept.employees.find(emp => emp.fullName === selectedFullName);
                          if (selected) {
                            setFieldValue("officialEmail", selected.officialEmail);
                          } else {
                            setFieldValue("officialEmail", "");
                            setSubmitted(false);
                          }
                        }}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: theme.secondaryColor,
                            borderRadius: '0.375rem', // Tailwind rounded-md
                            padding: '2px 6px',
                          }),
                          option: (base, state) => ({
                            ...base,
                            padding: '8px 12px',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 999,
                          }),
                        }}
                      />
                      <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
                    </div>

                    {/* Email Field */}
                    {
                      values.officialEmail && (
                        <div className="flex gap-2 px-4 items-center text-lg font-semibold">
                          <label htmlFor="officialEmail">
                            Email:
                          </label>
                          <div style={{ color: theme.primaryColor }}>{values.officialEmail}</div>
                          {/* <ErrorMessage name="officialEmail" component="div" className="text-red-500 text-sm" /> */}
                        </div>
                      )
                    }
                  </div>

                  <div className=" w-full box-border flex items-center justify-center">
                    <Button type="submit" variant={1} text="Get Candidate" />
                  </div>
                </div>
              </Form>
            )}
          </Formik>

          {submitted && dialogOpen && employeeByQuery?.employee && (
            <div className="w-full flex flex-col items-center justify-center gap-4 bg-white p-6 border border-t border-gray-200 rounded-b-xl transition-all duration-300">
              <img
                className="w-40 h-40 object-cover rounded-full shadow-md border-4 border-gray-200"
                src={employeeByQuery?.employee.photo || user}
                alt="Employee"
              />
              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  Name: <span className="font-normal">{employeeByQuery.employee.fullName}</span>
                </h2>
                <h2 className="text-lg text-gray-700">
                  DOB: <span className="font-medium">{employeeByQuery.employee.dateOfBirth}</span>
                </h2>
                <h2 className="text-lg text-gray-700">
                  Position: <span className="font-medium">{employeeByQuery.employee.designation}</span>
                </h2>
              </div>
              <Button variant={1} onClick={() => { resetEmployee(); handleViewProfile(employeeByQuery) }} text="View Details" />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
