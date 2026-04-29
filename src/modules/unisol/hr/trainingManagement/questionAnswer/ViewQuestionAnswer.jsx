import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import useQuestionAnswer from "../../../../../hooks/questionAnswer/useQuestionAnswer";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { IoMdArrowRoundBack } from "react-icons/io";
import { trainingPolicyState } from "../../../../../state/questionAnswer/questionAnswerState";
import { useRecoilState } from "recoil";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

export default function ViewQuestionAnswer() {
  const [selectedOption, setSelectedOption] = useState("Other");
  const { fetchQuestionDetails, viewQuestionDetails, loading, resetQuestions, resetQuestionDetails } = useQuestionAnswer();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
  const { id, qaId, questionId } = useParams();
  console.log(qaId);
  console.log(questionId);
  useEffect(() => {
    if (qaId && questionId) {
      fetchQuestionDetails(qaId, questionId);
    }
  }, [qaId, questionId])
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full">
      <Breadcrumb
        linkText={[
          { text: "Training Management"},
          { text: "Question & Answer List", href: "/questionAnswer" },
          { text: "View Question List", href: `/questionAnswer/module/${id}` },
          { text: "View Question & Answer" }
        ]}
      />
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="text-black text-lg font-semibold px-6 py-4 rounded-t-xl" style={{ backgroundColor: theme.secondaryColor }}>
          <div className="flex flex-wrap gap-2 items-center">
            <IoMdArrowRoundBack className="w-6 h-6 cursor-pointer" onClick={() => { resetQuestions(); navigate(`/questionAnswer/module/${id}`) }} />
            <h1 className="font-bold text-lg text-slate-900">View Question & Answer</h1>
          </div>
        </div>

        <form className="space-y-6 py-4 px-4">
          <div className="">
            <h2 className="block text-lg font-medium text-gray-700 mb-1">
              {activeType === 'Policy' ? 'Policy Name:' : 'Training Module:'}
            </h2>
            <div className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm">
              {viewQuestionDetails?.moduleTitle || "N/A"}</div>

          </div>

          <div className="">
            <h2 className="block text-lg font-medium text-gray-700 mb-1">
              Question:
            </h2>
            <div className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm">
              {viewQuestionDetails?.question?.questionText || "N/A"}
            </div>
          </div>
          <div>
            <h2 className="block text-lg font-medium text-gray-700 mb-1">
              Answer Options:
            </h2>
            <ul className="flex flex-col items-start gap-2 px-4 py-2 border border-gray-300 rounded-xl shadow-sm list-none">
              {
                viewQuestionDetails?.question?.answerOptions.map((answer, index) => {
                  const answerType = viewQuestionDetails?.question?.answerType;
                  const optionLetter =
                    answerType === "abcd"
                      ? String.fromCharCode(65 + index)
                      : (answerType === "true-false" || answerType === "yes-no")
                        ? (index + 1)
                        : "";
                  return (
                    <li key={index} className="text-gray-800">
                      <span className="font-semibold">{optionLetter}.</span> {answer}
                    </li>
                  );
                })
              }
            </ul>

          </div>

          <div className=" ">
            <h2 className="block text-lg font-medium text-gray-700 mb-1">Answer:</h2>
            <div className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm">
              {viewQuestionDetails?.question?.correctAnswer || "N/A"}
            </div>
          </div>
          {/* {
                selectedOption === "Other" && (
                  <textarea
                    className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm"
                    rows="4"
                    value={selectedOption}
                    disabled={true}
                    placeholder="If other, Write the answer"
                  />
                )
              } */}
          <div className="flex justify-center gap-4 pt-10">
            <Button type="submit" variant={1} onClick={() => { resetQuestionDetails(); navigate(`/questionAnswer/edit/${qaId}/${questionId}`) }} text="Edit" />
          </div>
        </form >



      </div >
    </div >
  );
}
