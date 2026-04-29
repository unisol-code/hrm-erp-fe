import React, { act, useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { Eye } from "lucide-react";
import Button from "../../../../../components/Button";
import { trainingPolicyState } from "../../../../../state/questionAnswer/questionAnswerState";
import { useRecoilState } from "recoil";
import useQuestionAnswer from "../../../../../hooks/questionAnswer/useQuestionAnswer";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import useResult from "../../../../../hooks/result/useResult";
import useSelfEvaluation from "../../../../../hooks/unisol/selfEvaluation/useSelfEvaluation";
import { usePermissions } from "../../../../../hooks/auth/usePermissions";
import { useSignIn } from "../../../../../hooks/auth/useSignIn";

const Result = () => {
  const [dropDown, setDropDown] = useState(false);
  const [empDropDown, setEmpDropDown] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
  const [hovered, setHovered] = useState("");
  const [buttonText, setButtonText] = useState("View");
  const { loading, fetchTrainingorPolicyTitleState, titles } =
    useQuestionAnswer();
  const {
    contentLoading,
    fetchEmployeeListWithId,
    employeeListWithId,
    fetchAllEmployeeLatestResult,
    fetchSpecificResult,
    employeeResult,
  } = useResult();
  const { resetViewTestResult } = useSelfEvaluation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [empId, setEmpId] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const { hrDetails } = useSignIn();
  const { canRead } = usePermissions(hrDetails, "Policies");

  console.log(titles);

  const validationSchema = Yup.object().shape({
    activeType: Yup.string().required("Active type is required"),
    moduleTitle: Yup.string().required("Module title is required"),
    employeeName: Yup.string().required("Employee name is required"),
  });
  const formik = useFormik({
    initialValues: {
      activeType: activeType,
      moduleTitle: "",
      employeeName: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("activeType", values.activeType);
      formData.append("moduleTitle", values.moduleTitle);
      formData.append("employeeName", values.employeeName);
      fetchSpecificResult(empId, moduleId);
    },
  });

  const onPageChange = (newPage) => {
    setPage(newPage);
    fetchQATitlesList(activeType, limit, newPage);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    fetchQATitlesList(activeType, newLimit, 1);
  };

  useEffect(() => {
    console.log("Active Type:", activeType);
    fetchTrainingorPolicyTitleState();
    fetchAllEmployeeLatestResult();
  }, [activeType]);
  useEffect(() => {
    fetchEmployeeListWithId();
  }, []);
  console.log(formik.values, formik.errors);
  console.log(employeeResult);

  if (loading || contentLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[{ text: "Training Management" }, { text: "Result" }]}
      />
      <div className="bg-white shadow-md rounded-2xl">
        <div
          className="flex flex-wrap items-center justify-between w-full py-3 px-8 rounded-t-xl gap-4"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h2 className="font-bold text-lg">Result</h2>
          <div className="flex gap-2 px-8">
            <button
              className="py-2 px-6 rounded-md shadow-md"
              style={{
                backgroundColor:
                  activeType === "Policy"
                    ? "white"
                    : hovered === "Policy"
                    ? theme.highlightColor
                    : theme.primaryColor,
                color:
                  activeType === "Policy" ||
                  (hovered === "Policy" && activeType !== "Policy")
                    ? "black"
                    : "white",
              }}
              onMouseEnter={() => setHovered("Policy")}
              onMouseLeave={() => setHovered("")}
              onClick={() => setActiveType("Policy")}
            >
              For Policies
            </button>
            <button
              className="py-2 px-6 rounded-md shadow-md"
              style={{
                backgroundColor:
                  activeType === "Training"
                    ? "white"
                    : hovered === "Training"
                    ? theme.highlightColor
                    : theme.primaryColor,
                color:
                  activeType === "Training" ||
                  (hovered === "Training" && activeType !== "Training")
                    ? "black"
                    : "white",
              }}
              onMouseEnter={() => setHovered("Training")}
              onMouseLeave={() => setHovered("")}
              onClick={() => setActiveType("Training")}
            >
              For Training
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-2 w-full">
          <div className="flex flex-col border-2 border-gray-300 rounded-md py-2 w-full">
            <div className="flex items-center justify-between gap-4 px-6 py-2">
              <p className="font-semibold text-lg">Search</p>
              <Button
                variant={2}
                text={buttonText}
                onClick={() => {
                  setButtonText(buttonText === "View" ? "Hide" : "View");
                  if (buttonText === "Hide") {
                    fetchAllEmployeeLatestResult();
                    formik.resetForm();
                    setEmpId(null);
                    setModuleId(null);
                  }
                }}
              />
            </div>
            {buttonText === "Hide" && (
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col w-full gap-6 px-4 py-4 border-t-2 border-gray-300"
              >
                <div className="flex flex-col items-start gap-4 px-4 w-full">
                  <label className="font-semibold whitespace-nowrap">
                    {activeType === "Policy"
                      ? "Policy Module"
                      : "Training Module"}
                  </label>
                  <div className="flex items-center gap-4 w-full">
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setDropDown(!dropDown)}
                        className="w-full border border-black rounded-xl px-6 py-2 flex justify-between items-center"
                      >
                        <span className="text-gray-600">
                          {formik.values.moduleTitle ||
                            (activeType === "Policy"
                              ? "Select Policy Module Title"
                              : "Select Training Module Title")}
                        </span>
                        {dropDown ? (
                          <RiArrowDropUpLine size={30} />
                        ) : (
                          <RiArrowDropDownLine size={30} />
                        )}
                      </button>

                      {dropDown && (
                        <div className="absolute left-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg w-full mt-1 max-h-64 overflow-y-auto">
                          {titles?.modules.map((item) => {
                            const selectedModuleId =
                              item.policyModuleId || item.trainingModuleId;
                            return (
                              <div
                                key={selectedModuleId}
                                className="p-2 hover:bg-gray-100 cursor-pointer text-center"
                                onClick={() => {
                                  formik.setFieldValue(
                                    "moduleTitle",
                                    item.title
                                  );
                                  setModuleId(selectedModuleId);
                                  setDropDown(false);
                                }}
                              >
                                {item.title}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {formik.touched.moduleTitle &&
                        formik.errors.moduleTitle && (
                          <div className="text-red-500 mt-1">
                            {formik.errors.moduleTitle}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Employee Section */}
                <div className="flex flex-col items-start gap-4 px-4">
                  <label className="font-semibold whitespace-nowrap">
                    Employee Name:
                  </label>
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setEmpDropDown(!empDropDown)}
                      className="w-full border border-black rounded-xl px-6 py-2 flex justify-between items-center"
                    >
                      <span className="text-gray-600">
                        {formik.values.employeeName || "Select Employee Name"}
                      </span>
                      {empDropDown ? (
                        <RiArrowDropUpLine size={30} />
                      ) : (
                        <RiArrowDropDownLine size={30} />
                      )}
                    </button>

                    {empDropDown && (
                      <div className="absolute left-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg w-full mt-1 max-h-64 overflow-y-auto">
                        {employeeListWithId?.employees.map((emp) => (
                          <div
                            key={emp._id}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-center"
                            onClick={() => {
                              formik.setFieldValue(
                                "employeeName",
                                emp.fullName
                              );
                              setEmpId(emp._id);
                              setEmpDropDown(false);
                            }}
                          >
                            {emp.fullName}
                          </div>
                        ))}
                      </div>
                    )}
                    {formik.touched.employeeName &&
                      formik.errors.employeeName && (
                        <div className="text-red-500 mt-1">
                          {formik.errors.employeeName}
                        </div>
                      )}
                  </div>

                  <div className="flex justify-center w-full items-center">
                    <Button type="submit" variant={1} text="Submit" />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="mt-4 h-px w-full border-b-4 border-double border-gray-300" />
        {/* Table */}
        <div className="overflow-x-auto mt-2 py-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-sm md:text-base text-center border-b-2 border-double border-gray-300">
                <th className="p-2 text-gray-400">Employee Name</th>
                <th className="p-2 text-gray-400">
                  {activeType === "Policy"
                    ? "Policy Module"
                    : "Training Module"}
                </th>
                <th className="p-2 text-gray-400">Total | Right | Wrong</th>
                <th className="p-2 text-gray-400">Percent</th>
                <th className="p-2 text-gray-400">Status</th>
                <th className="p-2 text-gray-400">View Result</th>
              </tr>
            </thead>
            <tbody className="text-center text-sm">
              {employeeResult?.results?.length > 0 ? (
                employeeResult?.results?.map((data, index) => (
                  <tr key={data._id} className="border-b border-gray-300">
                    <td className="p-4">{data.employeeName || "N/A"}</td>
                    <td>
                      {activeType === "Training"
                        ? data.trainingModuleTitle || "N/A"
                        : data.policyModuleTitle || "N/A"}
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-gray-300 text-black mx-1">
                        {data.totalQuestions}
                      </span>
                      <span className="px-2 py-1 bg-green-200 text-green-800 mx-1">
                        {data.correctCount}
                      </span>
                      <span className="px-2 py-1 bg-red-200 text-red-600 mx-1">
                        {data.incorrectCount}
                      </span>
                    </td>
                    <td>{data.percentage != null ? data.percentage : "N/A"}</td>
                    <td>
                      <span
                        className={`py-1 px-4 rounded-md ${
                          data.eligibilityStatus === "Failed"
                            ? "bg-red-200 text-red-700"
                            : "bg-green-200 text-green-700"
                        }`}
                      >
                        {data.eligibilityStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        className="flex hover:bg-yellow-100 rounded-full p-2 justify-center items-center mx-auto"
                        style={{ color: theme.primaryColor }}
                        title={canRead ? "View" : "No permission"}
                        disabled={!canRead}
                        onClick={() => {
                          resetViewTestResult();
                          navigate(
                            `/result/view/${data._id}/${data.employeeId}`
                          );
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-lg text-gray-500">
                    No results found.
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

export default Result;
