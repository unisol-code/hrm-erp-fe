import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { Eye, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiBook } from "react-icons/fi";
import { SiSpeedtest } from "react-icons/si";
import useSelfEvaluation from "../../../../hooks/unisol/selfEvaluation/useSelfEvaluation";
import { trainingPolicyState } from "../../../../state/questionAnswer/questionAnswerState";
import { useRecoilState } from "recoil";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { FaEye } from "react-icons/fa6";
import { IconButton } from "@mui/material";

const TestResult = () => {
  const { fetchTestResult, testResult, loading } = useSelfEvaluation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const employeeId = sessionStorage.getItem("empId");

  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  useEffect(() => {
    fetchTestResult(employeeId, activeType);
  }, [employeeId, activeType]);

  const filteredResults = (
    Array.isArray(testResult?.results) ? testResult.results : []
  ).filter(
    (item) =>
      ((activeType === "Policy" && item.policyModuleTitle) ||
        (activeType === "Training" && item.trainingModuleTitle)) &&
      (item.policyModuleTitle?.toLowerCase().includes(search.toLowerCase()) ||
        item.trainingModuleTitle?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[{ text: "Self Evaluation" }, { text: "Test Result" }]}
      />

      <section className="bg-white  rounded-2xl shadow-lg overflow-hidden w-full">
        {/* Section Header - Gradient, Icon, Title */}
        <div
          className="w-full h-[60px] shadow-sm flex items-center justify-between px-8 bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff]"
          style={{
            background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <SiSpeedtest style={{ color: theme.primaryColor, fontSize: 24 }} />
            <h2 className="font-bold text-xl text-gray-700">Test Results</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Toggle Buttons - now just before search */}
            <div className="flex gap-2">
              <button
                className={
                  "px-4 py-2 shadow-md rounded-full font-semibold text-sm transition-colors duration-300"
                }
                style={{
                  background:
                    activeType === "Policy" ? theme.primaryColor : "white",
                  color: activeType === "Policy" ? "white" : "black",
                }}
                onClick={() => handleTypeChange("Policy")}
              >
                For Policies
              </button>
              <button
                className={
                  "px-4 py-2 shadow-md rounded-full font-semibold text-sm transition-colors duration-300"
                }
                style={{
                  background:
                    activeType === "Training" ? theme.primaryColor : "white",
                  color: activeType === "Training" ? "white" : "black",
                }}
                onClick={() => handleTypeChange("Training")}
              >
                For Training
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by module name"
                className="border-2 border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-gray-600 transition w-full md:w-72 shadow-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="font-semibold text-gray-600 h-[50px] border-b-2 border-gray-300">
                  <th className="px-4">SR.No.</th>
                  <th className="px-4">
                    {activeType === "Policy"
                      ? "Policy Module"
                      : "Training Module"}
                  </th>
                  <th className="px-4">
                    Questions Breakdown
                    <div className="ml-3 text-gray-600 text-sm">
                      Total | Right | Wrong
                    </div>
                  </th>
                  <th className="px-4">Percentage</th>
                  <th className="px-4">Status</th>
                  <th className="px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8">
                      <div className="flex justify-center items-center">
                        <LoaderSpinner />
                      </div>
                    </td>
                  </tr>
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-gray-500 text-lg">
                      No test results found.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((data, index) => (
                    <tr
                      key={index}
                      className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 font-medium">{index + 1}</td>
                      <td className="px-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {data.policyModuleTitle ||
                            data.trainingModuleTitle ||
                            "-"}
                        </span>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm font-medium">
                            {data.totalQuestions}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium">
                            {data.correctCount}
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium">
                            {data.incorrectCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-4">
                        <span className="text-lg font-bold text-gray-700">
                          {data.percentage}%
                        </span>
                      </td>
                      <td className="px-4">
                        <span
                          className={`py-1 px-4 rounded-full text-sm font-medium ${
                            data.percentage < 40
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-green-100 text-green-700 border border-green-200"
                          }`}
                        >
                          {data.percentage < 40 ? "Fail" : "Pass"}
                        </span>
                      </td>
                      <td className="px-4">
                        <IconButton
                          onClick={() =>
                            navigate(
                              `/emp/selfevaluation/testresult/viewtestresult/${data._id}`
                            )
                          }
                        >
                          <FaEye
                            size={20}
                            style={{ color: theme.primaryColor }}
                          />
                        </IconButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {/* <div className="flex w-full gap-3 justify-center mb-6">
          <button className="w-10 border rounded-md px-2 h-[38px] bg-white shadow hover:bg-blue-50 transition">
            &lt;
          </button>
          <div className="flex justify-center items-center border rounded-md px-4 h-[38px] bg-gradient-to-r from-[#01008A] to-blue-400 text-white font-bold shadow">
            1
          </div>
          <button className="w-10 border rounded-md px-2 h-[38px] bg-white shadow hover:bg-blue-50 transition">
            &gt;
          </button>
        </div> */}
      </section>
    </div>
  );
};

export default TestResult;
