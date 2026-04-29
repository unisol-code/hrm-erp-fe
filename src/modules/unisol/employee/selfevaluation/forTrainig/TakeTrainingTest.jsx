import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../../../hooks/theme/useTheme';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../../../../components/Pagination';
import Breadcrumb from '../../../../../components/BreadCrumb';
import useSelfEvaluation from '../../../../../hooks/unisol/selfEvaluation/useSelfEvaluation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { GraduationCap, Timer } from 'lucide-react';

const TakeTrainingTest = () => {
    const navigator = useNavigate();
    const location = useLocation();
    const trainingId = location.state?.trainingId;
    const { fetchTrainingQuestions, trainingQuestions, loading,
        takeTrainingTest, trainingQAPreview, resetTrainingQAPreview } = useSelfEvaluation();
    const { theme } = useTheme()
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const employeeId = sessionStorage.getItem("empId")

    const [timeLeft, setTimeLeft] = useState(null);
    const [timerStarted, setTimerStarted] = useState(false);
    const [timeUp, setTimeUp] = useState(false);

    console.log("trainingQuestions:", trainingQuestions,
        "trainingQAPreview:", trainingQAPreview
    );

    const questions = trainingQuestions?.questions;

    useEffect(() => {
        if (trainingId) fetchTrainingQuestions(trainingId);
    }, [trainingId]);

    useEffect(() => {
        if (questions?.length > 0) {
            setTotalPages(Math.ceil(questions.length / itemsPerPage));
            // Example: 1 minutes per question
            const totalSeconds = questions.length * 60;
            setTimeLeft(totalSeconds);
            setTimerStarted(true);
        }
    }, [questions, itemsPerPage]);

    useEffect(() => {
        if (!timerStarted || timeLeft === null) return;
        if (timeLeft <= 0) {
            setTimeUp(true);
            setTimerStarted(false);
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timerStarted, timeLeft]);

    const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();

    const getOptionLabel = (index, type) => {
        if (type === "abcd") return String.fromCharCode(65 + index) + ")";
        return (index + 1) + ")";
    };

    const paginatedQuestions = questions?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const onItemsPerPageChange = (items) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const initialValues = questions?.reduce((values, q) => {
        values[q._id] = '';
        return values;
    }, {}) || {};

    const validationSchema = Yup.object().shape(
        questions?.reduce((shape, q) => {
            shape[q._id] = Yup.string().required("This question is required");
            return shape;
        }, {}) || {}
    );

    const handleSubmit = async (values) => {
        resetTrainingQAPreview();
        const answers = Object.entries(values).map(([questionId, userAnswer]) => ({
            questionId,
            userAnswer
        }));
        try {
            const payload = { employeeId, answers };
            const isSuccess = await takeTrainingTest(payload, trainingId);
            console.log("isSuccess:", isSuccess);
            if (isSuccess) {
                console.log("trainingQAPreview", isSuccess);
                navigator('/emp/selfevaluation/training/taketest/preview', {
                    state: { qaPreview: isSuccess },
                });
            } else {
                console.error("Failed to submit test");
            }
        } catch (error) {
            console.error("Error submitting test:", error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div>
            <Breadcrumb linkText={[
                { text: "Self Evaluation", href: "/emp/selfevaluation/training", onClick: () => resetTrainingQAPreview() },
                // { text: "Study Plan", href: "/emp/selfevaluation/policy" },
                { text: "Take Test" }
            ]} />
            <div className='flex flex-col bg-gray-100 min-h-screen'>
                {/* Header */}
                {/* {loading ? "Loading..." : trainingQuestions?.moduleTitle} */}
                <div className='px-6 py-4 rounded-t-lg text-xl sm:text-2xl font-semibold' style={{ backgroundColor: theme.highlightColor }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {loading ? "Loading..." : trainingQuestions?.moduleTitle}
                                </h1>
                            </div>
                        </div>
                        {/* Timer */}
                        <div
                            className="flex items-center bg-white/20 text-red-600 border border-red-600/30 px-4 py-2 rounded-lg text-lg font-semibold"
                        >
                            <Timer className="w-4 h-4 mr-2" />
                            Time Left: {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>

                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, errors, touched }) => (
                        <Form className='bg-white shadow-md py-8 px-4 mx-auto w-full'>
                            {paginatedQuestions?.map((question, idx) => (
                                <div
                                    key={question._id}
                                    className="flex flex-col gap-6 mb-6 px-4 py-4 border border-gray-300 border-l-[6px] rounded-xl shadow-md last:mb-0"
                                    style={{
                                        borderColor: theme.primaryColor,
                                        borderLeftColor: theme.primaryColor,
                                    }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-lg text-gray-900">
                                                {`Q${(currentPage - 1) * itemsPerPage + idx + 1}.`}
                                            </span>
                                            <span className="font-semibold text-lg text-gray-900">
                                                {question.questionText}
                                            </span>
                                        </div>
                                        {/* <div className="text-sm text-gray-500">Time: 1:00 min</div> */}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {question.answerOptions.map((option, index) => (
                                            <label key={option} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={question._id}
                                                    value={option}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={values[question._id] === option}
                                                    className="w-5 h-5 accent-[#709EB1]"
                                                />
                                                <span>
                                                    {getOptionLabel(index, question.answerType)} {capitalize(option)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors[question._id] && touched[question._id] && (
                                        <div className="text-red-500 text-sm">{errors[question._id]}</div>
                                    )}

                                    <span className="font-medium text-base text-gray-800">
                                        Answer: {values[question._id] ? `${getOptionLabel(question.answerOptions.findIndex(opt => opt.toLowerCase() === values[question._id]?.toLowerCase()), question.answerType)} ${capitalize(values[question._id])}` : ''}
                                    </span>
                                </div>
                            ))}

                            {currentPage === totalPages && (
                                <div className="mt-10 flex justify-center">
                                    <button
                                        type="submit"
                                        className="px-8 py-2 text-lg font-semibold text-white rounded-md"
                                        style={{ backgroundColor: theme.primaryColor }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Save and Preview'}
                                    </button>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>

                {questions?.length > itemsPerPage && (
                    // <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            onItemsPerPageChange={onItemsPerPageChange}
                        />
                    // </div>
                )}
            </div>
            {timeUp && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center space-y-6">
                        <div className="flex flex-col items-center space-y-3">
                            <Timer className="w-12 h-12 text-red-500" />
                            <h2 className="text-2xl font-bold text-red-600">Time's Up!</h2>
                            <p className="text-gray-700">
                                Your test time has ended. You can try again or go back to the evaluation list.
                            </p>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 text-lg font-semibold text-white rounded-md"
                                style={{ backgroundColor: theme.primaryColor }}
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => {
                                    resetTrainingQAPreview();
                                    navigator("/emp/selfevaluation/training");
                                }}
                                className="px-6 py-2 text-lg font-semibold text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TakeTrainingTest