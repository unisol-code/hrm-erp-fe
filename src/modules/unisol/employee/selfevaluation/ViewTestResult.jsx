import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { Check, X, BookOpen, Trophy, Target } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useSelfEvaluation from "../../../../hooks/unisol/selfEvaluation/useSelfEvaluation";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const ViewTestResult = () => {
  const { theme } = useTheme();
  const navigator = useNavigate();
  const { id } = useParams();
  const { fetchViewTestResult, viewTestResult, loading } = useSelfEvaluation();
  console.log(id);
  const employeeId = sessionStorage.getItem("empId");

  useEffect(() => {
    fetchViewTestResult(id, employeeId);
  }, [id, employeeId]);

  const questions = viewTestResult?.result?.results || [];
  const totalQuestions = viewTestResult?.result?.totalQuestions || 0;
  const correctAnswers = viewTestResult?.result?.correctCount || 0;
  const wrongAnswers = viewTestResult?.result?.incorrectCount || 0;
  const testPassed = viewTestResult?.result?.eligibilityStatus === "Passed";

  if (loading || !viewTestResult) {

    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0 ">
      <Breadcrumb
        linkText={[
          { text: "Self Evaluation" },
          { text: "Test Result", href: "/emp/selfevaluation/testresult" },
          { text: "View Test Result" },
        ]}
      />

      {/* Header Section */}
      <div className="mb-2">
        <div
          className="bg-white text-black rounded-2xl p-6 shadow-lg border border-gray-200"
          style={{
            background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <BookOpen
                className="w-8 h-8 text-gray-700"
                style={{ color: theme.primaryColor }}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Module: {viewTestResult?.result?.policyModuleTitle || viewTestResult?.result?.trainingModuleTitle}
            </h3>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {/* Total Questions */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 shadow hover:shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200 transition-all duration-300 cursor-pointer transform">
              <div className="flex items-center gap-1 mb-1">
                <div className="p-1 bg-blue-200 rounded">
                  <Target className="w-4 h-4 text-blue-700" />
                </div>
                <span className="text-xs font-medium text-blue-700">
                  Total Questions
                </span>
              </div>
              <div className="text-lg font-bold text-blue-800">
                {totalQuestions}
              </div>
            </div>

            {/* Correct Answers */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 shadow hover:shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-green-100 hover:to-green-200 transition-all duration-300 cursor-pointer transform">
              <div className="flex items-center gap-1 mb-1">
                <div className="p-1 bg-green-200 rounded">
                  <Check className="w-4 h-4 text-green-700" />
                </div>
                <span className="text-xs font-medium text-green-700">
                  Correct Answers
                </span>
              </div>
              <div className="text-lg font-bold text-green-800">
                {correctAnswers}
              </div>
            </div>

            {/* Wrong Answers */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200 shadow hover:shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-red-100 hover:to-red-200 transition-all duration-300 cursor-pointer transform">
              <div className="flex items-center gap-1 mb-1">
                <div className="p-1 bg-red-200 rounded">
                  <X className="w-4 h-4 text-red-700" />
                </div>
                <span className="text-xs font-medium text-red-700">
                  Wrong Answers
                </span>
              </div>
              <div className="text-lg font-bold text-red-800">
                {wrongAnswers}
              </div>
            </div>

            {/* Test Result */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200 shadow hover:shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-orange-100 hover:to-orange-200 transition-all duration-300 cursor-pointer transform">
              <div className="flex items-center gap-1 mb-1">
                <div className="p-1 bg-orange-200 rounded">
                  <Trophy className="w-4 h-4 text-orange-700" />
                </div>
                <span className="text-xs font-medium text-orange-700">
                  Test Result
                </span>
              </div>
              <div
                className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block shadow-md ${
                  testPassed
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                }`}
              >
                {testPassed ? "Passed" : "Failed"}
              </div>
            </div>

            {/* Previous Result Status */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 shadow hover:shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-purple-100 hover:to-purple-200 transition-all duration-300 cursor-pointer transform">
              <div className="flex items-center gap-1 mb-1">
                <div className="p-1 bg-purple-200 rounded">
                  <Trophy className="w-4 h-4 text-purple-700" />
                </div>
                <span className="text-xs font-medium text-purple-700">
                  Previous Result
                </span>
              </div>
              <div
                className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block shadow-md ${
                  viewTestResult?.previousResultStatus === "Passed"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    : viewTestResult?.previousResultStatus === "Failed"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                }`}
              >
                {viewTestResult?.previousResultStatus || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="rounded-2xl shadow-lg bg-white px-6 py-6 mt-2 border border-[#E8E8FF]">
        <div className="space-y-4">
          {questions.map((question, idx) => (
            <div
              key={question.questionId || idx}
              className="group relative bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-[#da7025] rounded-l-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold min-w-fit">
                    Q{idx + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                    {question.questionText}
                  </h3>
                </div>

                <div className="flex items-center gap-2 min-w-fit">
                  {question.isCorrect ? (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Correct</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Incorrect</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-gray-600 font-medium min-w-fit">
                  Answer:
                </span>
                <span className="text-gray-900 font-medium">
                  {question.userAnswer}
                </span>
              </div>
              {/* Optionally, show all answer options */}
              <div className="mt-2">
                <span className="text-gray-500 text-sm">Options: </span>
                {question.answerOptions?.map((opt, i) => (
                  <span
                    key={i}
                    className="inline-block mr-2 px-2 py-1 bg-gray-100 rounded"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-6 text-center">
          <div
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl "
            // style={{
            //   background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
            // }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy
                className={`w-8 h-8 ${
                  testPassed ? "text-green-600" : "text-gray-400"
                }`}
              />
              <h2 className="text-2xl font-bold text-gray-900">
                Training Complete!
              </h2>
            </div>

            <p className="text-gray-600 mb-6 text-lg">
              You scored {correctAnswers} out of {totalQuestions} questions
              correctly.
              {testPassed
                ? " Congratulations on passing!"
                : " Keep practicing to improve your score."}
            </p>

            {/* <div className="flex justify-center gap-4">
              
              <button
                onClick={() => navigator("/emp/selfevaluation/training")}
                className="px-6 py-2 bg-gray-900 text-white hover:bg-white hover:text-black transition-colors duration-200 font-medium rounded-lg"
              >
                Retake Test
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTestResult;
