import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { trainingPolicyState } from "../../../../../state/questionAnswer/questionAnswerState";
import { useRecoilState } from "recoil";
import useQuestionAnswer from "../../../../../hooks/questionAnswer/useQuestionAnswer";
import { IoMdArrowRoundBack } from "react-icons/io";
import * as Yup from "yup";
import ViewQuestionAnswer from "./ViewQuestionAnswer";
import LoaderSpinner from "../../../../../components/LoaderSpinner.jsx";
import Button from "../../../../../components/Button.jsx";


export default function AddQuestionAnswer() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedAns, setSelectedAns] = useState("");
  const [dropDown, setDropDown] = useState(false);
  const [moduleId, setModuleId] = useState("");
  const { qaId, questionId } = useParams();
  const [activeType, setActiveType] = useRecoilState(trainingPolicyState);
  const { fetchTrainingorPolicyTitleState, titles, loading, addTrainingOrPolicyQuestion, fetchQuestionDetails, viewQuestionDetails, updateParticularQuestion, resetQuestionDetails } =
    useQuestionAnswer();
  const [answerTypeManuallyChanged, setAnswerTypeManuallyChanged] = useState(false);
  const goBack = () => {
    if (qaId && questionId) { resetQuestionDetails(); navigate(-1) }
    else { navigate('/questionAnswer') }
  }

  const formik = useFormik({
    initialValues: {
      for: `${activeType}`,
      moduleTitle: "",
      question: "",
      answerType: "",
      correctAnswer: "",
      answerOptions: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      moduleTitle: Yup.string().required("Module name is required"),
      question: Yup.string().required("Question is required"),
      answerType: Yup.string().required("Answer type is required"),
      answerOptions:
        selectedOption === ""
          ? ""
          : selectedOption === "abcd"
            ? Yup.array().min(4, "All the four option names are required")
            : Yup.array().min(1, "At least one option is required"),
      correctAnswer: (selectedOption === "abcd" && selectedAns === "") && Yup.string().required('Please select the correct answer'),
    }),

    onSubmit: qaId && questionId
      ? async (values) => {
        try {
          const payload = {
            questionText: values.question,
            answerType: values.answerType,
            answerOptions: values.answerOptions,
            correctAnswer: values.correctAnswer,
          };
          await updateParticularQuestion(qaId, questionId, payload);
          navigate(-1);
        } catch (error) {
          console.error("Failed to update question:", error);
        }
      }
      : async (values) => {
        try {
          const payload = {
            for: values.for,
            [activeType === "Training" ? "trainingModuleId" : "policyModuleId"]: moduleId,
            questions: [{
              questionText: values.question,
              answerType: values.answerType,
              answerOptions: values.answerOptions,
              correctAnswer: values.correctAnswer
            }]
          };
          await addTrainingOrPolicyQuestion(payload);
          navigate("/questionAnswer");
        } catch (error) {
          console.error("Failed to add question:", error);
        }
      }

  });

  useEffect(() => {
    fetchTrainingorPolicyTitleState();
    formik.setFieldValue("for", activeType);
  }, [activeType]);

  useEffect(() => {
    const getDetails = async () => {
      if (qaId && questionId) {
        await fetchQuestionDetails(qaId, questionId);
      }
    };
    getDetails();
  }, [qaId, questionId]);

  useEffect(() => {
    if (answerTypeManuallyChanged) {
      setSelectedAns("");
      formik.setFieldValue("correctAnswer", "");
      formik.setFieldValue("answerOptions", []);
      formik.setFieldTouched("correctAnswer", false);
      formik.validateForm();
    }
  }, [formik.values.answerType]);

  useEffect(() => {
    if (
      qaId &&
      questionId &&
      viewQuestionDetails?.question
    ) {
      const { moduleTitle, question } = viewQuestionDetails;
      const answerType = question?.answerType;
      const correctAnswer = question?.correctAnswer;
      const answerOptions = question?.answerOptions || [];

      setSelectedOption(answerType || "");
      setAnswerTypeManuallyChanged(false);

      setSelectedOption(answerType || "");
      setAnswerTypeManuallyChanged(false);
      if (answerType === "abcd") {
        const index = answerOptions.findIndex((opt) => opt === correctAnswer);
        if (index !== -1) {
          setSelectedAns(["A", "B", "C", "D"][index]);
        }
      } else {
        setSelectedAns(correctAnswer);
      }
      console.log(selectedAns)

      formik.setValues({
        moduleTitle: moduleTitle || "",
        question: question?.questionText || "",
        answerType: answerType || "",
        correctAnswer: correctAnswer || "",
        answerOptions: answerOptions || [],
      });

    }
  }, [viewQuestionDetails, qaId, questionId]);




  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    )
  }

  console.log(formik.values, formik.errors)
  console.log(selectedAns, selectedOption)
  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Training Management"},
          { text: "Question & Answer List", href: "/questionAnswer" },
          { text: qaId && questionId ? "Edit Question & Answer" : "Add Question & Answer" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg">
        <div
          className="text-black text-lg font-semibold px-8 py-4 rounded-t-xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="flex items-center gap-2">
            <IoMdArrowRoundBack className="w-6 h-6 cursor-pointer" onClick={goBack} />
            {qaId && questionId ? "Edit" : "Add"} Question & Answer
          </div>
        </div>

        <form className="space-y-4 px-4 py-2" onSubmit={formik.handleSubmit}>
          <div className="mb-4 flex gap-5">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="type"
                value="policy"
                className="w-4 h-4"
                checked={activeType === "Policy"}
                disabled={qaId && questionId}
                onChange={() => setActiveType("Policy")}
              />
              For Policies
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="type"
                value="training"
                className="w-4 h-4"
                checked={activeType === "Training"}
                disabled={qaId && questionId}
                onChange={() => setActiveType("Training")}
              />
              For Training
            </label>
          </div>

          <div className="mb-4">
            <h2 className="block text-lg font-medium text-gray-700">
              {activeType === "Training" ? "Select Training Module" : "Select Policy Module"}
            </h2>
            <button
              type="button"
              onClick={() => setDropDown(!dropDown)}
              className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm"
              disabled={qaId && questionId}
            >
              <span className="text-black">
                {formik.values.moduleTitle ||
                  (activeType === "Training"
                    ? "Select Training Module Title"
                    : "Select Policy Name")}
              </span>
              {dropDown ? <RiArrowDropUpLine size={30} /> : <RiArrowDropDownLine size={30} />}
            </button>
            {dropDown && (
              <div className="bg-white border border-gray-300 rounded-md shadow-lg w-full mt-1 max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-2 font-semibold">Options are loading...</div>
                ) : (
                  titles?.modules.map((item) => {
                    const selectedModuleId = item.policyModuleId || item.trainingModuleId;
                    return (
                      <div
                        key={selectedModuleId}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-center"
                        onClick={() => {
                          formik.setFieldValue("moduleTitle", item.title);
                          setModuleId(selectedModuleId);
                          setDropDown(false);
                        }}
                      >
                        {item.title}
                      </div>
                    );
                  })
                )}
              </div>
            )}
            {formik.errors.moduleTitle && formik.touched.moduleTitle && (
              <p className="text-red-600 mt-1">{formik.errors.moduleTitle}</p>
            )}
          </div>

          <div className="mb-4">
            <h2 className="block text-lg font-medium text-gray-700">{qaId && questionId ? "Edit Question" : "Add Question"}</h2>
            <input
              type="text"
              name="question"
              placeholder="Enter question"
              value={formik.values.question}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm"
            />
            {formik.errors.question && formik.touched.question && (
              <p className="text-red-600 mt-1">{formik.errors.question}</p>
            )}
          </div>

          <div className="mb-4">
            <h2 className="block text-lg font-medium text-gray-700">Answer Type</h2>
            <div className="flex gap-4 mt-2">
              {["abcd", "yes-no", "true-false"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="option"
                    value={type}
                    checked={selectedOption === type}
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      formik.setFieldValue("answerType", type);
                      setAnswerTypeManuallyChanged(true);
                    }}
                    className="accent-blue-600 w-4 h-4"
                  />
                  {type.toUpperCase()}
                </label>
              ))}
            </div>
            {formik.errors.answerType && formik.touched.answerType && (
              <p className="text-red-600 mt-1">{formik.errors.answerType}</p>
            )}
          </div>

          <div className="mb-4">
            {selectedOption === "abcd" &&
              ["A", "B", "C", "D"].map((letter, index) => (
                <div key={letter} className="flex items-center gap-4 mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ans"
                      value={letter}
                      checked={selectedAns === letter}
                      onChange={(e) => {
                        setSelectedAns(e.target.value);
                        formik.setFieldValue("correctAnswer", formik.values.answerOptions[index]);
                      }}
                      className="accent-blue-600 w-4 h-4 mr-3"
                    />
                    {letter}
                  </label>
                  <input
                    type="text"
                    value={formik.values.answerOptions[index] || ""}
                    onChange={(e) => {
                      const updated = [...formik.values.answerOptions];
                      updated[index] = e.target.value;
                      formik.setFieldValue("answerOptions", updated);
                      if (selectedAns === letter) {
                        formik.setFieldValue("correctAnswer", e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm"
                  />
                </div>
              ))}

            {(selectedOption === "yes-no" || selectedOption === "true-false") &&
              (selectedOption === "yes-no" ? ["Yes", "No"] : ["True", "False"]).map((val) => (
                <label key={val} className="flex items-center gap-4 mb-2">
                  <input
                    type="radio"
                    name="ans"
                    value={val}
                    checked={selectedAns.toLowerCase() === val.toLowerCase()}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setSelectedAns(selectedVal);
                      formik.setFieldValue("correctAnswer", selectedVal);
                      formik.setFieldValue(
                        "answerOptions",
                        selectedOption === "yes-no" ? ["Yes", "No"] : ["True", "False"]
                      );
                      formik.setFieldTouched("correctAnswer", true);
                    }}
                    className="accent-blue-600 w-4 h-4"
                  />
                  {val}
                </label>
              ))}
            {
              formik.values.answerOptions && formik.touched.answerOptions && (
                <p className="text-red-600 mt-1">{formik.errors.answerOptions}</p>
              )}


            <div className="mt-4">
              <h2 className="block text-lg font-medium text-gray-700 mb-1">Correct Answer</h2>
              <div className="w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm bg-gray-50">
                {formik.values.correctAnswer || "-"}
              </div>
              {formik.values.correctAnswer === "" && formik.touched.correctAnswer && (
                <p className="text-red-600 mt-1">Select the correct answer</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pb-6 pt-10">
            <Button type="button" variant={3} onClick={() => { qaId && questionId ? navigate(-1) : navigate("/questionAnswer") }} text="Cancel" />
            <Button type="submit" variant={1} text={qaId && questionId ? "Update" : "Save"} />
          </div>
        </form>

      </div>
    </div>
  );
}
