import React, { useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useSelfEvaluation from "../../../../../hooks/unisol/selfEvaluation/useSelfEvaluation";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import Pagination from "../../../../../components/Pagination";
import Button from "../../../../../components/Button";
import { useRecoilState } from "recoil";
import { trainingPolicyState } from "../../../../../state/questionAnswer/questionAnswerState";
import useResult from "../../../../../hooks/result/useResult";

const ResultView = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { resultId, empId } = useParams();
  const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
  const { loading, fetchViewTestResult, viewTestResult } = useSelfEvaluation();
  const { resetEmployeeResult } = useResult();
  useEffect(() => {
    fetchViewTestResult(resultId, empId);
  }, [resultId, empId])
  console.log(viewTestResult)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    )
  }



  return (
    <div className="w-full min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Training Management"},
          { text: "Result", href: "/result" },
          { text: "View Specific Result"}
        ]}
      />
      <div className=" bg-white rounded-2xl shadow-lg">
        <div className="flex items-center flex-wrap justify-between gap-5 text-black text-lg font-semibold px-8 py-4 rounded-t-xl mb-4" style={{ backgroundColor: theme.secondaryColor }}>
          <div className="flex items-center">
            <span className="material-icons-round mr-2 cursor-pointer" onClick={() => { resetEmployeeResult(); navigate("/result") }}>
              <IoArrowBackSharp size={25} />
            </span>
            {/* View {viewTestResult.results.employeeName ||"N/A"}'s Result Details */}
            Result of {viewTestResult.employeeName||"N/A"}'s for {viewTestResult.result.trainingModuleTitle||viewTestResult.result.policyModuleTitle}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white rounded-md cursor-not-allowed" style={{ color: theme.primaryColor }}>{activeType}</button>
            <button className="px-4 py-2 bg-white rounded-md cursor-not-allowed" style={{ color: theme.primaryColor }}>Percentage: {viewTestResult.result.percentage}%</button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex px-4 gap-2 items-center flex-wrap w-full justify-evenly">
            <div className="px-6 py-6 flex flex-col gap-1 items-center border rounded-xl bg-gray-50 text-gray-800 w-[200px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="font-medium text-sm">Total Questions</span>
              <span className="text-xl font-semibold">{viewTestResult.result.totalQuestions}</span>
            </div>
            <div className="px-6 py-6 flex flex-col gap-1 items-center border rounded-xl bg-green-50 text-green-700 w-[200px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="font-medium text-sm">Correct Answers</span>
              <span className="text-xl font-semibold">{viewTestResult.result.correctCount}</span>
            </div>
            <div className="px-6 py-6 flex flex-col gap-1 items-center border rounded-xl bg-red-50 text-red-700 w-[200px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="font-medium text-sm">Wrong Answers</span>
              <span className="text-xl font-semibold">{viewTestResult.result.incorrectCount}</span>
            </div>
            <div
              className={`px-6 py-6 flex flex-col gap-1 items-center border rounded-xl w-[200px] shadow-md hover:shadow-lg transition-shadow duration-300
              ${viewTestResult.result.eligibilityStatus === 'Passed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}
            >
              <span className="font-medium text-sm">Latest Test Result</span>
              <span className="text-xl font-semibold">{viewTestResult.result.eligibilityStatus}</span>
            </div>
            <div
              className={`px-6 py-6 flex flex-col gap-1 items-center border rounded-xl w-[200px] shadow-md hover:shadow-lg transition-shadow duration-300
    ${viewTestResult.previousResultStatus === 'Failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
                }`}
            >
              <span className="font-medium text-sm">Previous Test Result</span>
              <span className="text-xl font-semibold">
                {viewTestResult.previousResultStatus === 'Failed' ? 'Failed' : 'Not Applicable'}
              </span>
            </div>
          </div>

          <div className="px-6 pb-4">
            {viewTestResult.result.results.map((result, index) => (
              <div
                key={result.question_id}
                className={`mt-1 p-4 border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${result.isCorrect
                  ? "bg-green-50 border-l-8 border-green-400"
                  : "bg-red-50 border-l-8 border-red-400"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    {index + 1}. {result.questionText}
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1 ${result.isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                  >
                    {result.isCorrect ? <TiTick size={20} /> : <RxCross2 size={20} />}
                    {result.isCorrect ? "Correct" : "Wrong"}
                  </span>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  {result.answerType === "abcd" ? (
                    result.answerOptions.map((option, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 p-2 rounded-md ${result.userAnswer === option
                          ? result.isCorrect
                            ? "bg-green-100"
                            : "bg-red-100"
                          : "bg-gray-50"
                          }`}
                      >
                        <span className="font-semibold">{String.fromCharCode(65 + i)}.</span>
                        <span>{option}</span>
                      </div>
                    ))
                  ) : (
                    result.answerOptions.map((option, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-2 p-2 rounded-md ${result.userAnswer === option
                          ? result.isCorrect
                            ? "bg-green-100"
                            : "bg-red-100"
                          : "bg-gray-50"
                          }`}
                      >
                        <input
                          type="radio"
                          readOnly
                          checked={result.userAnswer === option}
                          className="accent-blue-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))
                  )}
                </div>

                {/* <p className="mt-3 text-sm text-gray-700">
                  <strong>Your Answer:</strong> {result.userAnswer}
                </p> */}

                {result.details && (
                  <p className="mt-2 text-gray-600 text-sm">
                    <strong>Explanation:</strong> {result.details}
                  </p>
                )}
              </div>
            ))}

          </div>
        </div>


      </div>
    </div>
  );
};

export default ResultView;
