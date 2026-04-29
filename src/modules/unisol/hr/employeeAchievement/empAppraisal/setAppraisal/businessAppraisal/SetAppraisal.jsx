import { useEffect, useState } from "react";
import Breadcrumb from "../../../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaGraduationCap, FaUsers } from "react-icons/fa";
import Button from "../../../../../../../components/Button";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAppraisal from "../../../../../../../hooks/unisol/empAchievement/useAppraisal";
import LoaderSpinner from "../../../../../../../components/LoaderSpinner";

const SetAppraisal = () => {
    const { resetBusinessAppraisalDetails, fetchBusinessAppraisalList, businessAppraisalList, loading, deleteBusinessAppraisal } = useAppraisal();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [activeCard, setActiveCard] = useState(null);
    const [transformedTableData, setTransformedTableData] = useState([]);

    useEffect(() => {
        fetchBusinessAppraisalList({});
    }, []);

    useEffect(() => {
        if (businessAppraisalList?.data && businessAppraisalList.data.length > 0) {
            transformApiDataToTableFormat(businessAppraisalList.data);
        }
    }, [businessAppraisalList]);

    console.log("businessAppraisalList", businessAppraisalList);

    const transformApiDataToTableFormat = (apiData) => {
        let allRows = [];
        let srNo = 1;

        apiData.forEach((goalGroup) => {
            if (goalGroup.businessGoals && goalGroup.businessGoals.length > 0) {
                goalGroup.businessGoals.forEach((businessGoal) => {
                    allRows.push({
                        srNo: srNo++,
                        payrollGrade: businessGoal.payrollGrades ? businessGoal.payrollGrades.join(', ') : '-',
                        objective: businessGoal.objectiveName || '-',
                        measures: businessGoal.measures || '-',
                        target: businessGoal.target || '-',
                        weightage: businessGoal.weightage ? `${businessGoal.weightage}%` : '-',
                        rating: businessGoal.suggestedRating || '-',
                        goalName: goalGroup.goalName,
                        goalWeightage: goalGroup.weightage,
                        goalId: goalGroup.goalId,
                        _id: businessGoal._id
                    });
                });
            }
        });

        setTransformedTableData(allRows);
    };

    const cardHoverVariants = {
        hover: {
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 300
            }
        },
        tap: { scale: 0.98 }
    };

    const handleEditClick = (id) => {
        navigate(`/hr/employeeAchievement/appraisalList/businessGoals/edit/${id}`);
    };

    const handleDeleteClick = async (id) => {
        const isDeleted = await deleteBusinessAppraisal(id);
        if (isDeleted) {
            await fetchBusinessAppraisalList({});
        }
    };

    const groupDataByGoal = () => {
        const grouped = {};
        transformedTableData.forEach(row => {
            if (!grouped[row.goalName]) {
                grouped[row.goalName] = {
                    rows: [],
                    weightage: row.goalWeightage
                };
            }
            grouped[row.goalName].rows.push(row);
        });
        return grouped;
    };

    const renderTableRows = (data) => {
        return data.map((item, index) => (
            <tr
                key={item._id || index}
                className="h-[60px] border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
                <td className="px-4 py-3 font-medium text-gray-700">{item.srNo}</td>
                <td className="px-4 py-3 text-gray-800">{item.payrollGrade}</td>
                <td className="px-4 py-3 text-gray-800">{item.objective}</td>
                <td className="px-4 py-3 text-gray-800">{item.measures}</td>
                <td className="px-4 py-3 font-medium text-gray-700">{item.target}</td>
                <td className="px-4 py-3 text-gray-700">{item.weightage}</td>
                <td className="px-4 py-3 text-gray-500">{item.rating}</td>
                <td>
                    <div className="flex justify-center gap-1">
                        <button
                            aria-label="Edit"
                            title="Edit"
                            className="p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200"
                            onClick={() => handleEditClick(item._id)}
                            style={{ color: theme.primaryColor }}
                        >
                            <FaEdit size={18} />
                        </button>

                        <button
                            aria-label="Delete"
                            title="Delete"
                            className="p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200"
                            onClick={() => handleDeleteClick(item._id)}
                            style={{ color: theme.primaryColor }}
                        >
                            <MdDelete size={18} />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    const renderSectionHeader = (title, weightage) => {
        return (
            <tr key={`header-${title}`}>
                <td
                    colSpan="8"
                    className="px-6 py-3 text-left font-bold text-lg"
                    style={{
                        backgroundColor: theme.secondaryColor,
                        color: '#1f2937'
                    }}
                >
                    {title} - {weightage}%
                </td>
            </tr>
        );
    };

    const groupedData = groupDataByGoal();

    return (
        <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
            <Breadcrumb
                linkText={[
                    {
                        text: "Employee Achievement",
                        href: "/hr/employeeAchievement",
                    },
                    {
                        text: "Employee's Appraisal List",
                        href: "/hr/employeeAchievement/appraisalList",
                    },
                    { text: "Set Business Appraisal" },
                ]}
            />

            {/* Header Section */}
            <div className="py-4 px-8 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
                <div className="flex items-center gap-3">
                    <FaGraduationCap
                        style={{ color: theme.primaryColor, fontSize: 32 }}
                    />
                    <span className="text-2xl font-bold">Set Business Appraisal</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Goals Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl shadow-md p-5 cursor-pointer border-l-4"
                    style={{ borderLeftColor: theme.primaryColor }}
                    onClick={() => navigate("/hr/employeeAchievement/appraisalList/goals")}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${theme.primaryColor}15` }}
                        >
                            <FaGraduationCap style={{ color: theme.primaryColor }} />
                        </div>
                        <h3 className="font-bold text-gray-800">Goals</h3>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Set individual objectives</span>
                        <span
                            className="text-sm font-medium px-2 py-1 rounded"
                            style={{ backgroundColor: `${theme.primaryColor}10`, color: theme.primaryColor }}
                        >
                            View →
                        </span>
                    </div>
                </motion.div>

                {/* Business Goals Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl shadow-md p-5 cursor-pointer border-l-4"
                    style={{ borderLeftColor: theme.primaryColor }}
                    onClick={() => {
                        navigate("/hr/employeeAchievement/appraisalList/businessGoals");
                        resetBusinessAppraisalDetails();
                    }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${theme.primaryColor}15` }}
                        >
                            <FaChartLine style={{ color: theme.primaryColor }} />
                        </div>
                        <h3 className="font-bold text-gray-800">Business Goals</h3>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Company objectives</span>
                        <span
                            className="text-sm font-medium px-2 py-1 rounded"
                            style={{ backgroundColor: `${theme.primaryColor}10`, color: theme.primaryColor }}
                        >
                            View →
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Single Combined Table */}
            <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
                <div className="p-6">
                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                        <table className="w-full text-center border-collapse">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-gray-50 font-semibold text-gray-700 h-[50px] border-b-2 border-gray-200">
                                    <th className="px-4 py-3">Sr. No.</th>
                                    <th className="px-4 py-3">Payroll Grade</th>
                                    <th className="px-4 py-3">Objective</th>
                                    <th className="px-4 py-3">Measures</th>
                                    <th className="px-4 py-3">Target</th>
                                    <th className="px-4 py-3">Weightage</th>
                                    <th className="px-4 py-3">Rating</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-8">
                                            <div className="flex justify-center items-center">
                                                <LoaderSpinner />
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {Object.keys(groupedData).length > 0 ? (
                                            Object.entries(groupedData).map(([goalName, { rows, weightage }]) => (
                                                <>
                                                    {renderSectionHeader(goalName, weightage)}
                                                    {renderTableRows(rows)}
                                                </>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                    No business goals found
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )}

                                {/* Total Rating Row */}
                                <tr className="border-t-1 border-gray-300">
                                    <td colSpan="7" className="px-6 py-4 text-right font-lg text-lg"
                                        style={{ backgroundColor: theme.secondaryColor }}>
                                        Total Business Rating
                                    </td>
                                    <td
                                        className="px-6 py-4 text-center font-lg text-lg"
                                        style={{ backgroundColor: theme.secondaryColor }}
                                    >
                                        7.315
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Rating Summary Card */}
            <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full mt-6">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Rating Calculation</h2>

                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 text-md">Business Rating</span>
                        <div className="flex items-center gap-8">
                            <span className="text-gray-800 font-medium text-md">7.315</span>
                            <span className="text-gray-600 text-md min-w-[60px] text-right">80%</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 text-md">GLP Rating</span>
                        <div className="flex items-center gap-8">
                            <span className="text-gray-800 font-medium text-md">7</span>
                            <span className="text-gray-600 text-md min-w-[60px] text-right">20%</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-4 mt-2" style={{ backgroundColor: theme.secondaryColor, borderTop: "2px solid #d1d5db" }}>
                        <span className="text-gray-900 font-bold text-lg pl-3 pr-3">Final Rating</span>
                        <div className="flex items-center gap-8">
                            <span className="text-gray-900 font-bold text-lg">7.315</span>
                            <span className="text-gray-800 font-semibold text-lg min-w-[60px] text-right pr-4">100%</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SetAppraisal;