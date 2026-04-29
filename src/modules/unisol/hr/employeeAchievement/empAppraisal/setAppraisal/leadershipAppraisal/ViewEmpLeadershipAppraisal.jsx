import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaRegArrowAltCircleLeft, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import useLeadershipAppraisal from '../../../../../../../hooks/unisol/empAchievement/useLeadershipAppraisal';
import LoaderSpinner from '../../../../../../../components/LoaderSpinner';
import BreadCrumb from '../../../../../../../components/BreadCrumb';
import { useTheme } from '../../../../../../../hooks/theme/useTheme';
import Button from '../../../../../../../components/Button';
import ShowAppraisalDetails from '../../../../../../../components/Dialogs/paySlip/ShowAppraisalDetails';

const ViewEmpLeadershipAppraisal = () => {
    const { 
        giveFinalRatingOnEmployeeLeadershipAppraisal, 
        fetchEmpsLeadershipAppraisalbyId, 
        leadershipAppraisalByIdFromEmp, 
        loading 
    } = useLeadershipAppraisal();
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedFinalRatings, setEditedFinalRatings] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [showPopup, setShowPopup] = useState(false);
    const [appraisalState, setAppraisalState] = useState({
        title: "",
        description: "",
        detailedDescription: "",
        individualLeader: "",
        objective: "",
    });

    useEffect(() => {
        if (id) fetchEmpsLeadershipAppraisalbyId(id);
    }, [id]);

    // Initialize edited ratings when data loads
    useEffect(() => {
        if (leadershipAppraisalByIdFromEmp?.leadershipGoals) {
            const initialRatings = {};
            leadershipAppraisalByIdFromEmp.leadershipGoals.forEach((goal) => {
                initialRatings[goal._id] = goal.finalRating || '';
            });
            setEditedFinalRatings(initialRatings);
        }
    }, [leadershipAppraisalByIdFromEmp]);

    console.log("leadershipAppraisalByIdFromEmp", leadershipAppraisalByIdFromEmp);

    const handleStateChange = (updates) => {
        setAppraisalState((prev) => ({
            ...prev,
            ...updates,
        }));
    };

    const handleBack = () => {
        navigate(`/hr/employeeAchievement/appraisalList/empWiseAppraisal/${leadershipAppraisalByIdFromEmp?.employee_id}`);
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancel = () => {
        setIsEditMode(false);
        // Reset to original values
        if (leadershipAppraisalByIdFromEmp?.leadershipGoals) {
            const originalRatings = {};
            leadershipAppraisalByIdFromEmp.leadershipGoals.forEach((goal) => {
                originalRatings[goal._id] = goal.finalRating || '';
            });
            setEditedFinalRatings(originalRatings);
        }
    };

    const handleSave = async () => {
        // Prepare data for API
        const updatedGoals = leadershipAppraisalByIdFromEmp.leadershipGoals.map(goal => ({
            leadershipGoalId: goal._id,
            finalRating: editedFinalRatings[goal._id] || goal.finalRating
        }));

        const dataToSend = {
            leadershipGoals: updatedGoals
        };

        const success = await giveFinalRatingOnEmployeeLeadershipAppraisal(id, dataToSend);
        if (success) {
            setIsEditMode(false);
            // Refresh the data
            fetchEmpsLeadershipAppraisalbyId(id);
        }
    };

    const handleFinalRatingChange = (leadershipAppraisalId, value) => {
        // Only allow numbers 0-9 and decimal points
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setEditedFinalRatings(prev => ({
                ...prev,
                [leadershipAppraisalId]: value
            }));
        }
    };

    // Calculate average of final ratings
    const calculateAverageFinalRating = () => {
        if (!leadershipAppraisalByIdFromEmp?.leadershipGoals?.length) return 0;
        
        const total = leadershipAppraisalByIdFromEmp.leadershipGoals.reduce(
            (sum, item) => sum + Number(item.finalRating || 0),
            0
        );
        return (total / leadershipAppraisalByIdFromEmp.leadershipGoals.length).toFixed(2);
    };

    // Calculate average of edited ratings in edit mode
    const calculateEditedAverage = () => {
        if (!leadershipAppraisalByIdFromEmp?.leadershipGoals?.length) return 0;
        
        let total = 0;
        let count = 0;
        
        leadershipAppraisalByIdFromEmp.leadershipGoals.forEach(goal => {
            const rating = editedFinalRatings[goal._id];
            if (rating && !isNaN(parseFloat(rating))) {
                total += parseFloat(rating);
                count++;
            }
        });
        
        return count > 0 ? (total / count).toFixed(2) : 0;
    };

    return (
        <>
            {showPopup && appraisalState && (
                <ShowAppraisalDetails
                    appraisalState={appraisalState}
                    onClick={() => setShowPopup(false)}
                />
            )}
            
            <div className="min-h-screen">
                <BreadCrumb
                    linkText={[
                        { text: "Employee Achievement" },
                        { text: "Employee's Appraisal List", href: "/hr/employeeAchievement/appraisalList" },
                        { text: "Employee Wise Appraisal", href: `/hr/employeeAchievement/appraisalList/empWiseAppraisal/${leadershipAppraisalByIdFromEmp?.employee_id}` },
                        { text: "View Leadership Appraisal" },
                    ]}
                />

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoaderSpinner />
                    </div>
                ) : (
                    <>
                        {/* Header with status and actions */}
                        <div className="px-8 py-4 flex items-center justify-between bg-white rounded-2xl shadow-md mt-4">
                            <div className="flex items-center gap-4">
                                <Link to="/hr/employeeAchievement/empAppraisal">
                                    <FaRegArrowAltCircleLeft size={20} />
                                </Link>
                                <h1 className="font-medium text-xl">Employee Leadership Appraisal</h1>
                            </div>
                            
                            {leadershipAppraisalByIdFromEmp && (
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Status:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            leadershipAppraisalByIdFromEmp.finalRatingStatus === 'submitted' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {leadershipAppraisalByIdFromEmp.finalRatingStatus?.toUpperCase() || 'PENDING'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Date:</span>
                                        <span className="font-medium">
                                            {new Date(leadershipAppraisalByIdFromEmp.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Leadership Appraisal Table */}
                        <div className="mt-4 bg-white w-full rounded-2xl overflow-x-auto shadow-md">
                            <table className="w-full bg-white rounded-2xl">
                                <thead
                                    className="bg-gray-100 text-gray-700 text-md py-10 font-semibold"
                                    style={{ backgroundColor: theme.primaryColor }}
                                >
                                    <tr>
                                        <th className="py-3 px-4 text-left border-b whitespace-nowrap text-white">
                                            Sr. No.
                                        </th>
                                        <th className="py-3 px-4 text-center border-b text-white">
                                            Title
                                        </th>
                                        <th className="py-3 px-4 text-center border-b text-white">
                                            Weightage
                                        </th>
                                        <th className="py-3 px-4 text-center border-b text-white">
                                            Achievement
                                        </th>
                                        <th className="py-3 px-4 text-center border-b text-white">
                                            Self Rating
                                        </th>
                                        <th className="py-3 px-4 text-center border-b text-white">
                                            Final Rating
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-[16px] text-gray-700">
                                    {leadershipAppraisalByIdFromEmp?.leadershipGoals?.map((item, index) => (
                                        <tr 
                                            key={item._id || index}
                                            className="hover:bg-gray-50 transition-colors border-b"
                                        >
                                            <td className="py-3 px-4 text-center font-medium">
                                                {index + 1}
                                            </td>
                                            <td
                                                className="py-3 px-4 text-center font-medium hover:underline hover:cursor-pointer"
                                                style={{ color: theme.primaryColor }}
                                                onClick={() => {
                                                    handleStateChange({
                                                        title: item.title,
                                                        description: item.description,
                                                        detailedDescription: item.detailedDescription,
                                                        individualLeader: item.individualLeader,
                                                        objective: item.objective,
                                                    });
                                                    setShowPopup(true);
                                                }}
                                            >
                                                {item?.title}
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium">
                                                {item?.weightage}
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium">
                                                <div className="max-w-md mx-auto">
                                                    <p className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap text-left">
                                                        {item.achievement || "N/A"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full font-bold">
                                                    {item.selfRating}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium">
                                                {isEditMode ? (
                                                    <input
                                                        type="text"
                                                        value={editedFinalRatings[item._id] || ''}
                                                        onChange={(e) => handleFinalRatingChange(item._id, e.target.value)}
                                                        className="w-20 px-2 py-1.5 border-2 border-gray-300 rounded-lg text-center focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                        placeholder="Rating"
                                                        maxLength="4"
                                                    />
                                                ) : (
                                                    <span className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-800 rounded-full font-bold">
                                                        {item.finalRating || "-"}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* No data message */}
                                    {(!leadershipAppraisalByIdFromEmp?.leadershipGoals || 
                                      leadershipAppraisalByIdFromEmp.leadershipGoals.length === 0) && (
                                        <tr>
                                            <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                                                No leadership appraisal data found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                
                                {/* Footer with summary */}
                                {leadershipAppraisalByIdFromEmp?.leadershipGoals?.length > 0 && (
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="5" className="py-4 px-4 text-right font-semibold">
                                                Total Goals: {leadershipAppraisalByIdFromEmp.leadershipGoals.length} | 
                                                Average Final Rating:
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-indigo-600 font-bold text-lg">
                                                    {isEditMode 
                                                        ? calculateEditedAverage() 
                                                        : (leadershipAppraisalByIdFromEmp.totalFinalGLPRating || calculateAverageFinalRating())}
                                                </span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                            
                            {/* Bottom Buttons */}
                            <div
                                className="sticky bottom-0 bg-white border-t-4 px-8 py-4 flex justify-center gap-8 rounded-b-2xl"
                                style={{ borderColor: theme.secondaryColor }}
                            >
                                {!isEditMode ? (
                                    <>
                                        <Button
                                            onClick={handleBack}
                                            variant={3}
                                            text="Back"
                                        />
                                        {leadershipAppraisalByIdFromEmp?.finalRatingStatus !== 'completed' && (
                                            <Button
                                                onClick={handleEdit}
                                                // icon={<FaEdit />}
                                                text="Edit Final Ratings"
                                                style={{ backgroundColor: theme.primaryColor }}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleCancel}
                                            variant={3}
                                            // icon={<FaTimes />}
                                            text="Cancel"
                                        />
                                        <Button
                                            onClick={handleSave}
                                            // icon={<FaSave />}
                                            text="Save Changes"
                                            style={{ backgroundColor: theme.primaryColor }}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default ViewEmpLeadershipAppraisal