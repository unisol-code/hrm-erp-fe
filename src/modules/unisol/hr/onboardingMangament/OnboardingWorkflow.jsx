/* eslint-disable no-unused-vars */
import { useEffect, useCallback, useState } from "react";
import { Formik, Field, Form, useFormik } from "formik";
import * as Yup from "yup";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import WorkflowDetails from "../../../../components/Dialogs/WorkflowDetails";
import SendAlert from "../../../../components/Dialogs/SendAlert";
import { useLocation } from "react-router-dom";
import SendDocumentSubmissionReminder from "../../../../components/Dialogs/SendDocumentSubmissionReminder";
import useEmployee from "../../../../hooks/unisol/onboarding/useEmployee";
import debounce from "lodash/debounce";
import ViewWorkflowDetails from "../../../../components/Dialogs/ViewWorkflowDetails";
import Pagination from "../../../../components/Pagination";
import { Box } from "@mui/material";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/Button";
import { Check, X, Cross } from "lucide-react";
import user from "../../../../assets/images/user.png";

const stages = [
  { key: "offerAcceptance", label: "Offer Acceptance" },
  { key: "documentsSubmitted", label: "Documents Submitted" },
  { key: "backgroundCheck", label: "Background Check" },
  { key: "trainingSchedule", label: "Training Schedule" },
  { key: "itSetup", label: "IT Setup" },
  { key: "finalReview", label: "Final Review" },
];

const OnboardingWorkflow = () => {
  const {
    fetchAllEmployees,
    fetchSearchEmployees,
    employee,
    employeeByQuery,
    loading
  } = useEmployee();
  console.log("Employees:", employee);
  const location = useLocation();
  const { updatemployee } = location.state || {};
  console.log(updatemployee)
  const [openViewDetails, setOpenViewDetails] = useState(false);
  const [openViewWorkflowDetails, setOpenViewWorkflowDetails] = useState(false);
  const [openDocumentSubmissionReminder, setOpenDocumentSubmissionReminder] =
    useState(false);
  const [workflowData, setWorkflowData] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [sendAlertData, setSendAlertData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchAllEmployees(page, limit);
  }, []);
  useEffect(() => {
    if (updatemployee) {
      console.log("🔎 updatemployee data:", updatemployee);
    }
  }, [updatemployee]);

  const debouncedSearch = useCallback(
    debounce((values) => {
      if (values.fullName) {
        fetchSearchEmployees(values);
      } else {
        fetchAllEmployees();
      }
    }, 500),
    []
  );

  const formik = useFormik({
    initialValues: {
      fullName: "",
    },
    onSubmit: (values) => {
      if (values.fullName) {
        fetchSearchEmployees(values);
      } else {
        fetchAllEmployees();
      }
    },
  });

  const handleSearchChange = (e) => {
    const { value } = e.target;
    formik.setFieldValue("fullName", value);
    debouncedSearch({ fullName: value });
  };

  const handleViewDetails = (employeeByQuery) => {
    console.log("handleViewDetails", employeeByQuery);
    setViewDetails(employeeByQuery);
    setOpenViewDetails(true);
  };

  const handleSendAlert = (employeeByQuery) => {
    console.log("handleSendAlert employeeByQuery", employeeByQuery);
    setSendAlertData(employeeByQuery);
    setOpenDocumentSubmissionReminder(true);
  };

  const handleWorkflowDetails = (employee) => {
    setWorkflowData(employee);
    setOpenViewWorkflowDetails(true);
  };
  const onPageChange = (data) => {
    setPage(data);
    fetchAllEmployees(data, limit);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchAllEmployees(page, data);
  };
  const { theme } = useTheme();
  return (
    <div className="min-h-screen w-full">
      <Breadcrumb
        linkText={[
          { text: "Onboarding Management" },
          {
            text: "Employee Onboarding Status",
            href: "/onBoardingTaskVerification",
          },
          { text: "Onboarding Stages" },
        ]}
      />
      <div className="box-border min-h-screen w-full ">
        <div className="flex flex-col ">
          {
            updatemployee ? (<div className="flex flex-col lg:flex-row p-4 gap-4 bg-white rounded-2xl">

              <div
                className="w-full lg:w-1/2 rounded-2xl"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                <div className="flex flex-col gap-y-4 rounded-2xl p-2">
                  {/* Steps Row */}
                  <div className="flex flex-wrap justify-center gap-4 rounded-t-2xl py-2">
                    {stages.map((stage, index) => (
                      <div
                        key={stage.key}
                        className="flex flex-col items-center text-center w-1/3 sm:w-1/4 lg:w-[120px] h-auto"
                      >
                        {updatemployee[stage.key] ? (
                          <Check className="font-bold text-green-600" />
                        ) : (
                          <X className="font-bold text-red-600" />
                        )}

                        {/* Circle */}
                        <div
                          className="h-[54px] w-[54px] rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: updatemployee?.[stage.key]
                              ? theme.primaryColor
                              : "white",
                          }}
                        >
                          <h2
                            className="font-bold text-[18px]"
                            style={{
                              color: updatemployee?.[stage.key] ? "white" : "black",
                            }}
                          >
                            {index + 1}
                          </h2>
                        </div>

                        {/* Label */}
                        <p className="text-[13px] font-semibold mt-2">{stage.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Description */}
                  <div className="pb-2 px-1">
                    <div
                      className="box-border flex justify-center items-center px-3 shadow rounded-b-2xl py-4"
                      style={{ backgroundColor: theme.backgroundColor }}
                    >
                      <p className="text-[14px] text-center lg:text-left">
                        Welcome! Our onboarding process is designed to seamlessly integrate
                        into the team. It starts with accepting offer, followed by essential
                        document submission. We’ll then conduct a background check, schedule
                        training, and set up IT resources. Finally, we review everything to
                        ensure everything is set to start the candidate journey with us.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 ">
                <div className="h-full w-full flex flex-col flex-wrap justify-center bg-gray-200 p-2 rounded-2xl">
                  <div className="flex flex-col font-semibold items-center gap-3">
                    <img
                      className="w-40 h-40 object-cover rounded-full shadow-md border-4 border-gray-200"
                      src={updatemployee.photo || user}
                      alt="Employee"
                    />
                    <h2>
                      Candidate Name:{" "}
                      {updatemployee.fullName || "Not Available"}
                    </h2>
                    <h2>
                      Document Status:
                      <span className="font-bold text-black">
                        {updatemployee?.documentsSubmitted === true
                          ? " Submitted"
                          : " Pending"}
                      </span>
                    </h2>
                  </div>
                
                  <div className="flex items-center justify-center mt-4 gap-2">
                    <Button
                      variant={1}
                      type="button"
                      onClick={() => {
                        handleViewDetails(employeeByQuery);
                        setOpenViewDetails(true);
                      }}
                      text="View Detail"
                    />

                    {updatemployee?.documentsSubmitted !== true && (
                      <Button
                        type="button"
                        onClick={() => {
                          handleSendAlert(employeeByQuery);
                          setOpenDocumentSubmissionReminder(true);
                        }}
                        text="Send Alert"
                      />
                    )}
                  </div>

                  {/* ✅ Outside flex, so gap only affects buttons */}
                  <SendAlert
                    openDialog={openViewDetails}
                    closeDialog={() => setOpenViewDetails(false)}
                    employeeByQuery={viewDetails}
                  />

                  <SendDocumentSubmissionReminder
                    openDialog={openDocumentSubmissionReminder}
                    closeDialog={() => setOpenDocumentSubmissionReminder(false)}
                    employeeByQuery={sendAlertData}
                  />

                </div>
              </div>
            </div>
          ) : null}
          <div className="mt-4 w-full rounded-2xl bg-[#FFFFFF]">
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-3 lg:px-8 rounded-t-xl" style={{ backgroundColor: theme.secondaryColor }}>
              <h1 className="text-[#252C58] text-xl whitespace-normal lg:whitespace-nowrap">Employee List for Onboarding Status</h1>
              <input
                className="h-[40px] rounded-[10px] pl-1 lg:pl-4 lg:pr-4 py-2 border border-gray-500 outline-none"
                type="text"
                value={formik.values.fullName}
                onChange={handleSearchChange}
                placeholder="Search by Candidate name"
              />
            </div>
            <div className="w-full bg-white rounded-b-2xl overflow-hidden">
              {/* <div className="pb-6"> */}
                <div className="h-[495px] overflow-y-auto">
                  <table className="min-w-[650px] w-full text-left">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="p-3 text-base font-semibold text-gray-700 text-center">
                          Sr. No.
                        </th>
                        <th className="p-3 text-base font-semibold text-gray-700 text-center">
                          Employee Name
                        </th>
                        <th className="p-3 text-base font-semibold text-gray-700 text-center">
                          Designation
                        </th>
                        <th className="p-3 text-base font-semibold text-gray-700 text-center">
                          Joining Date
                        </th>
                        <th className="p-3 text-base font-semibold text-gray-700 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(employee?.employees) &&
                      employee?.employees.length > 0 ? (
                        employee?.employees.map((employee, index) => (
                          <tr key={employee?.id || index} className="border-b border-gray-300">
                            <td className="p-4 text-[13px] font-normal text-[#252C58] text-center">{(page - 1) * limit + index + 1}</td>
                            <td className="p-4 text-[13px] font-normal text-[#252C58] text-center">{employee?.fullName}</td>
                            <td className="p-4 text-[13px] font-normal text-[#252C58] text-center">{employee?.designation || "N/A"}</td>
                            <td className="p-4 text-[13px] font-normal text-[#252C58] text-center">
                              {employee?.createdAt ? new Date(employee?.createdAt).toLocaleDateString("en-GB") : "N/A"}
                            </td>
                            <td className="p-4 text-[13px] font-normal text-[#252C58] text-center flex items-center justify-center w-full ">
                              <Button variant={2} text="Current Status"
                                onClick={() => {
                                  handleWorkflowDetails(employee);
                                  setOpenViewWorkflowDetails(true);
                                }}

                              />
                              {openViewWorkflowDetails && (
                                <ViewWorkflowDetails
                                  openDialog={openViewWorkflowDetails}
                                  closeDialog={() => {
                                    setOpenViewWorkflowDetails(false);
                                    setWorkflowData(null);
                                  }}
                                  employee={workflowData}
                                />
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-4 text-center text-gray-500"
                          >
                            No employees available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              {/* </div> */}

              {/* Pagination with visible bottom radius */}
              <div className="rounded-b-2xl">
                <Pagination
                  currentPage={employee?.pagination?.currentPage}
                  totalPages={employee?.pagination?.totalPages}
                  totalItems={employee?.pagination?.totalCount}
                  onPageChange={onPageChange}
                  onItemsPerPageChange={onItemsPerPageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWorkflow;
