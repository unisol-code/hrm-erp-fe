/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TaskDetailsNotes from "../../../../components/Dialogs/TaskDetailsNotes";
import useEmployee from "../../../../hooks/unisol/onboarding/useEmployee";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Select from "react-select";
import Button from "../../../../components/Button";
import { values } from "lodash";

const OnBoardingTaskVerification = () => {
  const {
    fetchDepartments,
    departmentDrop,
    fetchEmployeeByDept,
    employeeByDept,
    fetchCandidatebyQuery,
    employeeByQuery,
    loading,
    updateEmployeeTaskByID,
    updateEmployeeTask,
    resetEmployeeByQuery,
  } = useEmployee();
  console.log("employeeByQuery", employeeByQuery);
  const { theme } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchDepartments();
    resetEmployeeByQuery();
  }, []);

  useEffect(() => {
    const emp = employeeByQuery?.employee;
    if (emp) {
      const taskList = [
        {
          id: 1,
          name: "Offer Acceptance",
          value: "offerAcceptance",
          isChecked: emp.offerAcceptance ?? false,
        },
        {
          id: 2,
          name: "Documents Submitted",
          value: "documentsSubmitted",
          isChecked: emp.documentsSubmitted ?? false,
        },
        {
          id: 3,
          name: "Background Check",
          value: "backgroundCheck",
          isChecked: emp.backgroundCheck ?? false,
        },
        {
          id: 4,
          name: "Training Schedule",
          value: "trainingSchedule",
          isChecked: emp.trainingSchedule ?? false,
        },
        {
          id: 5,
          name: "IT Setup",
          value: "itSetup",
          isChecked: emp.itSetup ?? false,
        },
        {
          id: 6,
          name: "Final Review",
          value: "finalReview",
          isChecked: emp.finalReview ?? false,
        },
      ];
      setTasks(taskList);
    }
  }, [employeeByQuery]);

  const handleClick = (event, id, setFieldValue) => {
    console.log(event.target.name, event.target.value, event.target.checked);
    console.log(id);
    const isChecked = event.target.checked;

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, isChecked } : task))
    );

    const data = {
      [event.target.value]: isChecked,
    };

    console.log("data :", data);
    setFieldValue(event.target.value, event.target.checked);
    // updateEmployeeTaskByID(employeeByQuery?.employee?._id, data);
  };

  const validationSchema = Yup.object({
    department: Yup.string().required("Department is required"),
    fullName: Yup.string().required("Candidate is required"),
  });

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      const filters = {
        fullName: values.fullName,
        officialEmail: values.officialEmail,
        department: values.department,
      };
      await fetchCandidatebyQuery(filters);
      console.log(employeeByQuery);
      setDialogOpen(true);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Breadcrumb
        linkText={[
          { text: "Onboarding Management" },
          { text: "Employee Onboarding Status" },
        ]}
      />
      <div className="flex flex-col rounded-2xl gap-5 shadow-md bg-white">
        <div
          className="flex flex-col w-full rounded-t-xl box-border justify-center items-start px-8 gap-2 py-4"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h2 className="font-semibold text-[17px]">
            Onboarding Task Verification
          </h2>
          <p className="text-[15px]">
            Review and verify the completion of onboarding tasks for each
            candidate.
          </p>
        </div>
        <div className="flex flex-col">
          {/* Form */}
          <Formik
            enableReinitialize
            initialValues={{
              department: employeeByQuery?.employee?.department || "",
              fullName: employeeByQuery?.employee?.fullName || "",
              officialEmail: employeeByQuery?.employee?.officialEmail || "",
              offerAcceptance:
                employeeByQuery?.employee?.offerAcceptance ?? false,
              documentsSubmitted:
                employeeByQuery?.employee?.documentsSubmitted ?? false,
              backgroundCheck:
                employeeByQuery?.employee?.backgroundCheck ?? false,
              trainingSchedule:
                employeeByQuery?.employee?.trainingSchedule ?? false,
              itSetup: employeeByQuery?.employee?.itSetup ?? false,
              finalReview: employeeByQuery?.employee?.finalReview ?? false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, resetForm, values, setTouched, errors }) => {
              useEffect(() => {
                if (!values.department && !values.fullName) {
                  setFieldValue("officialEmail", "");
                }
              }, [values.department, values.fullName]);
              console.log(values, errors);
              // Handle form submission
              const handleTaskSubmit = async () => {
                const taskPayload = {
                  offerAcceptance: String(values.offerAcceptance),
                  documentsSubmitted: String(values.documentsSubmitted),
                  backgroundCheck: String(values.backgroundCheck),
                  trainingSchedule: String(values.trainingSchedule),
                  itSetup: String(values.itSetup),
                  finalReview: String(values.finalReview),
                };

                // Get updated employee directly from update call
                const updatedEmployee = await updateEmployeeTaskByID(
                  employeeByQuery?.employee?._id,
                  taskPayload
                );

                if (updatedEmployee) {
                  setFieldValue("officialEmail", "");
                  setTasks([]);
                  setDialogOpen(false);
                  setSubmitted(false);

                  navigate("/onBoardingTaskVerification/onBoardingWorkflow", {
                    state: { updatemployee: updatedEmployee },
                  });
                }
              };
              return (
                <Form>
                  <div className="mx-8 my-3 flex flex-col items-center justify-center gap-12 py-2">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 pt-3">
                      {/* Department Field */}
                      <div className="flex flex-col gap-1 px-4">
                        <label
                          htmlFor="department"
                          className="text-sm font-medium"
                        >
                          Department
                        </label>
                        <Select
                          name="department"
                          placeholder="Select department"
                          isLoading={loading}
                          options={departmentDrop.map((dept) => ({
                            label: dept,
                            value: dept,
                          }))}
                          classNamePrefix="react-select"
                          isClearable
                          onChange={(selected) => {
                            const department = selected?.value;
                            if (!department) {
                              resetForm();
                              setFieldValue("officialEmail", "");
                              setSubmitted(false);
                            }
                            setFieldValue("department", department);
                            setTouched("department", true);
                            if (department) {
                              fetchEmployeeByDept(department);
                            }
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: theme.secondaryColor,
                              borderRadius: "0.375rem",
                              padding: "2px 6px",
                            }),
                            option: (base) => ({
                              ...base,
                              padding: "8px 12px",
                              fontSize: "0.875rem",
                              cursor: "pointer",
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 999,
                            }),
                          }}
                        />
                        <ErrorMessage
                          name="department"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Candidate Field */}
                      <div className="flex flex-col gap-1 px-4">
                        <label
                          htmlFor="fullName"
                          className="text-sm font-medium"
                        >
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
                                  value: e.fullName,
                                }))
                              : []
                          }
                          onChange={(selectedOption) => {
                            const selectedFullName =
                              selectedOption?.value || "";
                            setFieldValue("fullName", selectedFullName);
                            setTouched("fullName", true);
                            const selected = employeeByDept.employees.find(
                              (emp) => emp.fullName === selectedFullName
                            );
                            if (selected) {
                              setFieldValue(
                                "officialEmail",
                                selected.officialEmail
                              );
                            } else {
                              setFieldValue("officialEmail", "");
                              setSubmitted(false);
                            }
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: theme.secondaryColor,
                              borderRadius: "0.375rem",
                              padding: "2px 6px",
                            }),
                            option: (base) => ({
                              ...base,
                              padding: "8px 12px",
                              fontSize: "0.875rem",
                              cursor: "pointer",
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 999,
                            }),
                          }}
                        />
                        <ErrorMessage
                          name="fullName"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Email Field */}
                      {values.officialEmail && (
                        <div className="flex gap-2 px-4 items-center text-lg font-semibold">
                          <label htmlFor="officialEmail">Email:</label>
                          <div style={{ color: theme.primaryColor }}>
                            {values.officialEmail}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full box-border flex items-center justify-center">
                      <Button type="submit" variant={1} text="Submit" />
                    </div>
                  </div>
                  {submitted && dialogOpen && employeeByQuery && (
                    <div className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300 mb-4">
                      <div className="flex flex-col items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Candidate Profile
                        </h2>
                        <div className="w-full flex flex-col gap-3 text-gray-700">
                          <div className="flex justify-between">
                            <span className="font-medium">Name:</span>
                            <span>{employeeByQuery?.employee?.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>
                              {employeeByQuery?.employee?.officialEmail}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {dialogOpen && (
                    <div className="w-full mx-auto my-6 border-t border-gray-200">
                      <div className="px-3 py-4 border-b border-gray-300">
                        <h2 className="text-xl text-center font-semibold text-[#252C58]">
                          Task Checklist
                        </h2>
                      </div>

                      <TableContainer
                        component={Paper}
                        sx={{ boxShadow: "none", borderRadius: 2 }}
                      >
                        <Table
                          sx={{ minWidth: 650 }}
                          aria-label="task checklist table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{
                                  color: "#252C58",
                                  fontSize: 16,
                                  fontWeight: 600,
                                  backgroundColor: "#EFF3F6",
                                  borderBottom: "2px solid #D1D5DB",
                                }}
                              >
                                Task
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  color: "#252C58",
                                  fontSize: 16,
                                  fontWeight: 600,
                                  backgroundColor: "#EFF3F6",
                                  borderBottom: "2px solid #D1D5DB",
                                }}
                              >
                                Mark as Completed
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {console.log(tasks)}
                            {tasks.map((task) => (
                              <TableRow
                                key={task.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  "&:hover": { backgroundColor: "#F9FAFB" },
                                  transition: "background-color 0.3s ease",
                                }}
                              >
                                <TableCell
                                  align="center"
                                  sx={{ fontSize: 15, color: "#374151" }}
                                >
                                  {task.name}
                                </TableCell>
                                <TableCell align="center">
                                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                                    <input
                                      className="h-[18px] w-[18px] cursor-pointer"
                                      style={{
                                        accentColor: theme.secondaryColor,
                                      }}
                                      type="checkbox"
                                      name={task.name}
                                      value={task.value}
                                      checked={task.isChecked}
                                      onChange={(event) =>
                                        handleClick(
                                          event,
                                          task.id,
                                          setFieldValue
                                        )
                                      }
                                    />
                                    <span className="text-sm text-[#374151]">
                                      Completed
                                    </span>
                                  </label>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <div className="w-full flex justify-center py-6 border-t border-gray-200">
                          <button
                            type="submit"
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                theme.highlightColor)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                theme.primaryColor)
                            }
                            className="text-base px-4 py-2 rounded-md text-white hover:text-black hover: border"
                            style={{
                              backgroundColor: theme.primaryColor,
                              borderColor: theme.primaryColor,
                            }}
                            onClick={handleTaskSubmit}
                          >
                            Update Tasks
                          </button>
                        </div>
                      </TableContainer>
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingTaskVerification;
