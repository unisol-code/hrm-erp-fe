import React from 'react';
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import Breadcrumb from '../../../../../components/BreadCrumb';
import useSelfEvaluation from '../../../../../hooks/unisol/selfEvaluation/useSelfEvaluation';

const TestPreview = () => {
  const navigator = useNavigate();
  const { resetPolicyQAPreview } = useSelfEvaluation();
  const { theme } = useTheme();
  const location = useLocation();
  const { qaPreview = {} } = location.state || {};
  const { percentage = 0, results = [] } = qaPreview;

  const capitalize = (str) =>
    str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();

  const getOptionLabel = (index, type) =>
    type === 'abcd' ? String.fromCharCode(65 + index) + ')' : (index + 1) + ')';

  return (
    <div>
      <Breadcrumb
        linkText={[
          { text: "Self Evaluation", href: "/emp/selfevaluation/policy" },
          { text: "Preview Your Answers" }
        ]}
      />

      <div className=" bg-white shadow-md rounded-2xl p-6 sm:p-6">
        {/* Header */}
        <h1
          className="text-2xl sm:text-3xl font-bold text-center mb-6"
          style={{ color: theme.primaryColor }}
        >
          Test Preview Summary
        </h1>

        {/* Score Info */}
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 sm:p-6 text-center mb-10 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            🎯 You scored <span style={{ color: theme.primaryColor }}>{percentage}%</span>
          </h2>
          <p className="text-gray-500 mt-1">Keep practicing to improve even more!</p>
        </div>

        {/* Question Cards */}
        {results.length > 0 ? (
          results.map((q, idx) => {
            const userAnswer = q.userAnswer || "Not Answered";
            return (
              <div
                key={q.questionId}
                className="mb-8 border-l-[6px] rounded-xl border border-gray-200 shadow p-5 transition-all"
                style={{ borderLeftColor: q.isCorrect ? '#16a34a' : '#dc2626' }}
              >
                {/* Question */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {`Q${idx + 1}. ${q.questionText}`}
                  </h3>
                  {q.isCorrect ? (
                    <CheckCircle className="text-green-600 w-6 h-6" />
                  ) : (
                    <XCircle className="text-red-600 w-6 h-6" />
                  )}
                </div>

                {/* Options */}
                <div className="mt-3 flex flex-col gap-2">
                  {q.answerOptions.map((opt, i) => {
                    const isSelected = opt.toLowerCase() === userAnswer.toLowerCase();
                    const isCorrect = q.isCorrect && isSelected;
                    return (
                      <div
                        key={opt}
                        className={`px-4 py-2 rounded-md border ${isCorrect
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : isSelected
                            ? 'bg-red-100 border-red-500 text-red-700'
                            : 'bg-gray-50 border-gray-200 text-gray-800'
                          }`}
                      >
                        {getOptionLabel(i, q.answerOptions.length === 4 ? 'abcd' : '123')}{" "}
                        {capitalize(opt)}
                      </div>
                    );
                  })}
                </div>

                {/* Answer Info */}
                <div className="mt-4 text-sm text-gray-700 font-medium">
                  Your Answer:{" "}
                  <span className={userAnswer === "Not Answered" ? "text-gray-400" : "font-semibold"}>
                    {capitalize(userAnswer)}
                  </span>
                </div>

                <div
                  className={`mt-2 text-base font-semibold ${q.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {q.message}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No preview data available.</p>
        )}

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => {
              resetPolicyQAPreview();
              navigator('/emp/selfevaluation/testresult')}}
            className="px-6 py-3 text-lg font-semibold text-white rounded-md shadow-md"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Finish
          </button>
              
          <button
            onClick={() => {
              resetPolicyQAPreview();
              navigator("/emp/selfevaluation/policy/taketest",
                { state: { policyId: qaPreview?.policyModuleId } })
            }}
            className="px-6 py-3 border border-gray-400 rounded-md text-gray-800 hover:bg-gray-100 text-lg font-semibold transition"
          >
            Retake Test
          </button>
        </div>

        {/* Completion Footer */}
        {/* <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center bg-gray-50 px-6 py-8 border border-gray-200 rounded-2xl shadow-sm">
            <Trophy className="w-10 h-10 text-yellow-500 mb-2" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Training Complete!
            </h3>
            <p className="text-gray-600">
              You have completed the training. Great job!
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TestPreview;
