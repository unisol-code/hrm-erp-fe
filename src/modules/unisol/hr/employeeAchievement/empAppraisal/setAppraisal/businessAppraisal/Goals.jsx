import { useState, useEffect } from "react";
import Breadcrumb from "../../../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../../../hooks/theme/useTheme";
import { useNavigate, useParams } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import Button from "../../../../../../../components/Button";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import useAppraisal from "../../../../../../../hooks/unisol/empAchievement/useAppraisal";
import LoaderSpinner from "../../../../../../../components/LoaderSpinner";
import { toast } from "react-toastify";

const Goals = () => {
    const { theme } = useTheme();
    const { id } = useParams();

    const {
        loading,
        fetchEmpAppraisalGoalList,
        updateAppraisalGoal,
        deleteGoalAppraisal,
        AddAppraisalGoal,
        empAppraisalGoalList
    } = useAppraisal();

    const [initialValues, setInitialValues] = useState({
        goals: []
    });

    useEffect(() => {
        fetchEmpAppraisalGoalList();
    }, []);

    useEffect(() => {
        if (empAppraisalGoalList?.data && empAppraisalGoalList.data.length > 0) {
            const formattedGoals = empAppraisalGoalList.data.map((goal, index) => ({
                id: goal._id,
                srNo: index + 1,
                name: goal.name,
                weightage: goal.weightage,
                isEditable: false,
                _id: goal._id
            }));

            setInitialValues({ goals: formattedGoals });
        } else {
            setInitialValues({ goals: [] });
        }
    }, [empAppraisalGoalList]);

    const validationSchema = Yup.object({
        goals: Yup.array().of(
            Yup.object({
                name: Yup.string().required("Goal name is required"),
                weightage: Yup.number()
                    .required("Weightage is required")
                    .min(0, "Weightage must be at least 0")
                    .max(100, "Weightage cannot exceed 100")
                    .typeError("Weightage must be a number")
            })
        ).test('total-weightage', 'Total weightage cannot exceed 100%', function (goals) {
            if (!goals || goals.length === 0) return true;
            const total = goals.reduce((sum, goal) => {
                const weightage = parseFloat(goal.weightage) || 0;
                return sum + weightage;
            }, 0);
            return total <= 100;
        })
    });

    const handleSaveClick = async (goal, values, setFieldValue, setFieldTouched, index, arrayHelpers) => {
            setFieldTouched(`goals.${index}.name`, true);
            setFieldTouched(`goals.${index}.weightage`, true);

            const currentGoal = values.goals[index];

            if (!currentGoal.name || currentGoal.name.trim() === '') {
                toast.error("Goal name is required");
                return;
            }

            if (currentGoal.weightage === '' || currentGoal.weightage === null || currentGoal.weightage === undefined) {
                toast.error("Weightage is required");
                return;
            }

            const weightageNum = Number(currentGoal.weightage);
            if (isNaN(weightageNum)) {
                toast.error("Weightage must be a valid number");
                return;
            }

            if (weightageNum < 0 || weightageNum > 100) {
                toast.error("Weightage must be between 0 and 100");
                return;
            }

            const totalWeightage = values.goals.reduce((sum, g, idx) => {
                if (idx === index && currentGoal.weightage) {
                    return sum + Number(currentGoal.weightage);
                }
                return sum + (Number(g.weightage) || 0);
            }, 0);

            if (totalWeightage > 100) {
                toast.error("Total weightage cannot exceed 100%");
                return;
            }

            let response;

            if (currentGoal._id) {
                const originalGoal = empAppraisalGoalList?.data?.find(g => g._id === currentGoal._id);

                const updatePayload = {};

                if (originalGoal && currentGoal.name !== originalGoal.name) {
                    updatePayload.name = currentGoal.name;
                }

                if (originalGoal && Number(currentGoal.weightage) !== Number(originalGoal.weightage)) {
                    updatePayload.weightage = weightageNum;
                }

                if (Object.keys(updatePayload).length === 0) {
                    setFieldValue(`goals.${index}.isEditable`, false);
                    toast.info("No changes detected");
                    return;
                }

                console.log(`Updating goal with id: ${currentGoal._id}`, updatePayload);
                response = await updateAppraisalGoal(currentGoal._id, updatePayload);
            } else {
                const addPayload = {
                    name: currentGoal.name,
                    weightage: weightageNum,
                    appraisalId: id
                };

                console.log("Adding new goal", addPayload);
                response = await AddAppraisalGoal(addPayload);
            }

            if (response) {
                setFieldValue(`goals.${index}.isEditable`, false);

                await fetchEmpAppraisalGoalList();
            }
    };

    const handleEditClick = (index, setFieldValue) => {
        setFieldValue(`goals.${index}.isEditable`, true);
    };

    const handleDeleteClick = async (goal) => {
        const response = await deleteGoalAppraisal(goal._id);
        if (response === true) {
            await fetchEmpAppraisalGoalList();
        }
    };

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
                        {
                            text: "Set Appraisal",
                            href: "/hr/employeeAchievement/appraisalList/setAppraisal",
                        },
                        { text: "Goals" },
                    ]}
                />

                {/* Header Section */}
                <div className="py-4 px-8 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
                    <div className="flex items-center gap-3">
                        <FaGraduationCap
                            style={{ color: theme.primaryColor, fontSize: 32 }}
                        />
                        <span className="text-2xl font-bold">Goals Management</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        Total Goals: {empAppraisalGoalList?.total || 0}
                    </div>
                </div>

                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log("Form submitted:", values);
                    }}
                >
                    {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
                        <Form>
                            {/* Goals Table Section */}
                            <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
                                {/* Section Header */}
                                <div
                                    className="w-full h-[60px] flex items-center justify-between px-8 bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff]"
                                    style={{
                                        background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <FaGraduationCap className="text-blue-600 text-xl" />
                                        <h2 className="font-bold text-xl text-gray-700">Goals List</h2>
                                    </div>
                                    {values.goals.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-600">Total Weightage:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${values.goals.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0) === 100
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {values.goals.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0)}%
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full p-6">
                                    {errors.goals && typeof errors.goals === 'string' && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
                                            {errors.goals}
                                        </div>
                                    )}

                                    <FieldArray name="goals">
                                        {(arrayHelpers) => (
                                            <>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-center border-collapse">
                                                        <thead>
                                                            <tr className="bg-white font-semibold text-gray-700 h-[50px] border-b-2 border-gray-200">
                                                                <th className="px-4 py-3">Sr. No.</th>
                                                                <th className="px-4 py-3">Name</th>
                                                                <th className="px-4 py-3">Weightage (%)</th>
                                                                <th className="px-4 py-3">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loading ? (
                                                                <tr>
                                                                    <td colSpan={4} className="text-center py-8">
                                                                        <div className="flex justify-center items-center">
                                                                            <LoaderSpinner />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                <>
                                                                    {values?.goals.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan={4} className="py-8 text-gray-500 text-lg">
                                                                                No goals found. Click "Add More" to create a new goal.
                                                                            </td>
                                                                        </tr>
                                                                    ) : (
                                                                        values.goals.map((goal, index) => (
                                                                            <tr
                                                                                key={goal.id || index}
                                                                                className="h-[70px] border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                                            >
                                                                                <td className="px-4 py-3 font-medium text-gray-700">
                                                                                    {index + 1}
                                                                                </td>
                                                                                <td className="px-4 py-3">
                                                                                    {goal.isEditable ? (
                                                                                        <div className="flex flex-col items-center justify-center">
                                                                                            <input
                                                                                                type="text"
                                                                                                value={goal.name}
                                                                                                onChange={(e) =>
                                                                                                    setFieldValue(`goals.${index}.name`, e.target.value)
                                                                                                }
                                                                                                onBlur={() => setFieldTouched(`goals.${index}.name`, true)}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                                                placeholder="Enter goal name"
                                                                                            />
                                                                                            {touched.goals?.[index]?.name &&
                                                                                                errors.goals?.[index]?.name && (
                                                                                                    <p className="text-red-500 text-xs mt-1">
                                                                                                        {errors.goals[index].name}
                                                                                                    </p>
                                                                                                )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-gray-800 font-medium">
                                                                                            {goal.name}
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-3">
                                                                                    {goal.isEditable ? (
                                                                                        <div className="flex flex-col items-center justify-center">
                                                                                            <input
                                                                                                type="number"
                                                                                                value={goal.weightage}
                                                                                                onChange={(e) => {
                                                                                                    const value = e.target.value;
                                                                                                    if (value === '' || /^\d{1,3}$/.test(value)) {
                                                                                                        setFieldValue(
                                                                                                            `goals.${index}.weightage`,
                                                                                                            value ? Number(value) : ''
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                                onBlur={() => setFieldTouched(`goals.${index}.weightage`, true)}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 no-spinner"
                                                                                                placeholder="0-100"
                                                                                                min="0"
                                                                                                max="100"
                                                                                            />
                                                                                            {touched.goals?.[index]?.weightage &&
                                                                                                errors.goals?.[index]?.weightage && (
                                                                                                    <p className="text-red-500 text-xs mt-1">
                                                                                                        {errors.goals[index].weightage}
                                                                                                    </p>
                                                                                                )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-gray-700 font-medium">
                                                                                            {goal.weightage}%
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-3">
                                                                                    <div className="flex items-center justify-center gap-2">
                                                                                        {goal.isEditable ? (
                                                                                            <button
                                                                                                type="button"
                                                                                                aria-label="Save"
                                                                                                title="Save"
                                                                                                className="p-2 rounded-full hover:bg-green-100 hover:scale-105 transition-all duration-200"
                                                                                                onClick={() => handleSaveClick(goal, values, setFieldValue, setFieldTouched, index, arrayHelpers)}
                                                                                                style={{ color: theme.primaryColor }}
                                                                                            >
                                                                                                <IoMdCheckmarkCircleOutline size={25} />
                                                                                            </button>
                                                                                        ) : (
                                                                                            <button
                                                                                                type="button"
                                                                                                aria-label="Edit"
                                                                                                title="Edit"
                                                                                                className="p-2 rounded-full hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                                                                                                onClick={() => handleEditClick(index, setFieldValue)}
                                                                                                style={{ color: theme.primaryColor }}
                                                                                            >
                                                                                                <MdEdit size={20} />
                                                                                            </button>
                                                                                        )}

                                                                                        {/* Delete Button */}
                                                                                        <button
                                                                                            type="button"
                                                                                            aria-label="Delete"
                                                                                            title="Delete"
                                                                                            className="p-2 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-200"
                                                                                            onClick={() => handleDeleteClick(goal, arrayHelpers, index)}
                                                                                            style={{ color: theme.primaryColor }}
                                                                                        >
                                                                                            <MdDelete size={20} />
                                                                                        </button>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    )}
                                                                </>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Add More Button */}
                                                <div className="flex justify-end mt-6">
                                                    <Button
                                                        variant={1}
                                                        onClick={() => {
                                                            const newGoal = {
                                                                id: Date.now(),
                                                                name: "",
                                                                weightage: "",
                                                                isEditable: true,
                                                            };
                                                            arrayHelpers.push(newGoal);
                                                        }}
                                                        text="Add More"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </FieldArray>
                                </div>
                            </section>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    };

    export default Goals;