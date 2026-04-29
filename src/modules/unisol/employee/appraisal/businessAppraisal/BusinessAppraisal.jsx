import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { FaChartLine } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../../components/Button";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import useEmpBusinessAppraisal from "../../../../../hooks/unisol/empAppraisal/useEmpBusinessAppraisal";

const BusinessAppraisal = () => {
  const { 
    loading, 
    fetchBusinessAppraisalGoalList, 
    businessAppraisalGoalList,
    fetchSubmittedBusinessAppraisalDetails, 
    submittedBusinessAppraisalDetails, 
    giveBusinessAppraisal, 
    updateBusinessAppraisal 
  } = useEmpBusinessAppraisal();
  
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const [tableData, setTableData] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      // Edit mode - fetch existing appraisal details
      setIsEditMode(true);
      fetchSubmittedBusinessAppraisalDetails(id);
    } else {
      // Create mode - fetch goal list
      setIsEditMode(false);
      fetchBusinessAppraisalGoalList();
    }
  }, [id]);

  // Transform API data to table format when goal list is received (Create mode)
  useEffect(() => {
    if (!id && businessAppraisalGoalList && businessAppraisalGoalList.length > 0) {
      transformGoalListToTableFormat(businessAppraisalGoalList);
    }
  }, [businessAppraisalGoalList, id]);

  // Transform submitted appraisal data to table format when details are received (Edit mode)
  useEffect(() => {
    if (id && submittedBusinessAppraisalDetails) {
      transformSubmittedDataToTableFormat(submittedBusinessAppraisalDetails);
    }
  }, [submittedBusinessAppraisalDetails, id]);

  console.log("businessAppraisalGoalList", businessAppraisalGoalList);
  console.log("submittedBusinessAppraisalDetails", submittedBusinessAppraisalDetails);
  console.log("isEditMode", isEditMode);
  console.log("tableData", tableData);
  console.log("ratings", ratings);

  // Transform the nested goal structure into flat table rows for CREATE mode
  const transformGoalListToTableFormat = (apiData) => {
    let allRows = [];
    let srNo = 1;

    apiData.forEach((goalGroup) => {
      // For each goal group, process its businessGoals array
      if (goalGroup.businessGoals && goalGroup.businessGoals.length > 0) {
        goalGroup.businessGoals.forEach((businessGoal) => {
          // Create a row for each business goal
          allRows.push({
            id: businessGoal._id,
            businessGoalId: businessGoal._id,
            srNo: srNo++,
            goalId: goalGroup.goalId,
            goalName: goalGroup.goalName,
            goalWeightage: goalGroup.weightage,
            objective: businessGoal.objectiveName,
            measures: businessGoal.measures,
            target: businessGoal.target,
            weightage: businessGoal.weightage,
            suggestedRating: businessGoal.suggestedRating,
            achievement: "", // Empty achievement field for user to fill
          });
        });
      }
    });

    setTableData(allRows);

    // Initialize ratings object with empty values
    const initialRatings = {};
    allRows.forEach(row => {
      initialRatings[row.id] = "";
    });
    setRatings(initialRatings);
  };

  // Transform submitted appraisal data into table format for EDIT mode
  const transformSubmittedDataToTableFormat = (apiData) => {
    if (!apiData?.businessGoalsGroupedByGoal) return;

    let allRows = [];
    let srNo = 1;

    apiData.businessGoalsGroupedByGoal.forEach((goalGroup) => {
      // For each goal group, process its businessGoals array
      if (goalGroup.businessGoals && goalGroup.businessGoals.length > 0) {
        goalGroup.businessGoals.forEach((businessGoal) => {
          // Create a row for each business goal with existing data
          allRows.push({
            id: businessGoal._id,
            businessGoalId: businessGoal._id,
            srNo: srNo++,
            goalId: goalGroup.goalId,
            goalName: goalGroup.goalName,
            goalWeightage: goalGroup.weightage,
            objective: businessGoal.objectiveName,
            measures: businessGoal.measures,
            target: businessGoal.target,
            weightage: businessGoal.weightage,
            suggestedRating: businessGoal.suggestedRating || "",
            achievement: businessGoal.achievement || "",
          });
        });
      }
    });

    setTableData(allRows);

    // Initialize ratings object with existing self ratings
    const initialRatings = {};
    allRows.forEach(row => {
      // Find the matching business goal in the submitted data to get selfRating
      const matchingGoal = apiData.businessGoalsGroupedByGoal
        .flatMap(g => g.businessGoals)
        .find(bg => bg._id === row.id);
      
      initialRatings[row.id] = matchingGoal?.selfRating || "";
    });
    setRatings(initialRatings);
  };

  const handleRatingChange = (id, value) => {
    setRatings({
      ...ratings,
      [id]: value
    });
  };

  const handleAchievementChange = (id, value) => {
    setTableData(tableData.map(item =>
      item.id === id ? { ...item, achievement: value } : item
    ));
  };

  // Group objectives by goal
  const groupDataByGoal = () => {
    const grouped = {};
    tableData.forEach(item => {
      if (!grouped[item.goalId]) {
        grouped[item.goalId] = {
          rows: [],
          weightage: item.goalWeightage,
          label: item.goalName
        };
      }
      grouped[item.goalId].rows.push(item);
    });
    return grouped;
  };

  const calculateGoalAverageRating = (goalId) => {
    const goalItems = tableData.filter(
      (item) => item.goalId === goalId && ratings[item.id]
    );
    if (goalItems.length === 0) return "0.00";
    const total = goalItems.reduce((sum, item) => sum + Number(ratings[item.id] || 0), 0);
    return (total / goalItems.length).toFixed(2);
  };

  const calculateOverallRating = () => {
    const ratedItems = tableData.filter((item) => ratings[item.id]);
    if (ratedItems.length === 0) return "0.00";
    const total = ratedItems.reduce((sum, item) => sum + Number(ratings[item.id] || 0), 0);
    return (total / ratedItems.length).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tableData.length === 0) {
      toast.error("No objectives to save");
      return;
    }

    // Check if all achievements are filled
    const missingAchievements = tableData.filter(item => !item.achievement);
    if (missingAchievements.length > 0) {
      toast.error("Please fill achievement for all objectives");
      return;
    }

    // Check if all ratings are filled (1-9)
    const invalidRatings = tableData.filter(
      (item) => !ratings[item.id] || ratings[item.id] < 1 || ratings[item.id] > 9
    );

    if (invalidRatings.length > 0) {
      toast.error("Please rate all objectives (1-9)");
      return;
    }

    // Prepare payload in the required format
    const businessGoals = tableData.map((item) => ({
      businessGoalId: item.businessGoalId,
      selfRating: ratings[item.id],
      achievement: item.achievement
    }));

    const payload = {
      businessGoals: businessGoals
    };

    let result;
    if (isEditMode && id) {
      // Update existing appraisal
      result = await updateBusinessAppraisal(id, payload);
    } else {
      // Create new appraisal
      result = await giveBusinessAppraisal(payload);
    }

    if (result) {
      navigate("/emp/appraisal/businessappraisal");
    }
  };

  const renderSectionHeader = (goalId, weightage, label) => {
    return (
      <tr key={`header-${goalId}`}>
        <td
          colSpan="8"
          className="px-6 py-3 text-left font-bold text-lg"
          style={{
            backgroundColor: theme.secondaryColor,
            color: '#1f2937'
          }}
        >
          <div className="flex justify-between items-center">
            <span>
              {label} - {weightage}%
            </span>
          </div>
        </td>
      </tr>
    );
  };

  const renderTableRows = (rows) => {
    return rows.map((item) => (
      <tr
        key={item.id}
        className="h-[60px] border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <td className="px-4 py-3 text-center font-medium text-gray-700">{item.srNo}</td>
        <td className="px-4 py-3 text-left text-gray-800">{item.objective}</td>
        <td className="px-4 py-3 text-center text-gray-800">{item.measures}</td>
        <td className="px-4 py-3 text-center font-medium text-gray-700">{item.target}</td>
        <td className="px-4 py-3 text-center text-gray-700">{item.weightage}%</td>
        <td className="px-4 py-3 text-center">
          <textarea
            value={item.achievement}
            onChange={(e) => handleAchievementChange(item.id, e.target.value)}
            className="w-80 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-y min-h-[60px]"
            placeholder="Enter achievement details..."
            rows="2"
          />
        </td>
        <td className="px-4 py-3 text-center">
          <input
            type="text"
            maxLength="1"
            value={ratings[item.id] || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[1-9]$/.test(value)) {
                handleRatingChange(item.id, value);
              }
            }}
            className="w-16 px-2 py-1 border-2 border-gray-300 rounded-lg text-center text-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="1-9"
          />
        </td>
        <td className="px-4 py-3 text-center font-medium text-gray-700">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {item.suggestedRating || 'N/A'}
          </span>
        </td>
      </tr>
    ));
  };

  const groupedData = groupDataByGoal();

  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Appraisal", href: "/emp/appraisal" },
          {
            text: "Business Appraisal",
            href: "/emp/appraisal/businessappraisal",
          },
          { text: isEditMode ? "Edit Business Appraisal" : "Give Business Appraisal" },
        ]}
      />

      {/* Header Section */}
      <div className="px-8 py-4 flex items-center justify-between bg-white rounded-2xl shadow-md mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <FaChartLine style={{ color: theme.primaryColor, fontSize: 28 }} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditMode ? "Edit Business Appraisal" : "Give Business Appraisal"}
              </h1>
              {isEditMode && submittedBusinessAppraisalDetails?.date && (
                <p className="text-sm text-gray-500 mt-1">
                  Submitted on: {new Date(submittedBusinessAppraisalDetails.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
        {isEditMode && (
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              submittedBusinessAppraisalDetails?.finalRatingStatus === 'approved' 
                ? 'bg-green-100 text-green-700'
                : submittedBusinessAppraisalDetails?.finalRatingStatus === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              Status: {submittedBusinessAppraisalDetails?.finalRatingStatus || 'Pending'}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        {/* Main Table Section */}
        <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className="text-white font-semibold"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <tr>
                  <th className="py-4 px-4 text-center border-b whitespace-nowrap">Sr. No.</th>
                  <th className="py-4 px-8 text-center border-b whitespace-nowrap">Objective</th>
                  <th className="py-4 px-4 text-center border-b whitespace-nowrap">Measures</th>
                  <th className="py-4 px-4 text-center border-b whitespace-nowrap">Target</th>
                  <th className="py-4 px-4 text-center border-b whitespace-nowrap">Weightage</th>
                  <th className="py-4 px-4 text-center border-b whitespace-nowrap">Achievement</th>
                  <th className="py-4 px-4 text-center border-b whitespace-nowrap">Self Rating</th>
                  <th className="py-4 px-4 text-center border-b whitespace-nowrap">Suggested Rating</th>
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
                      Object.entries(groupedData).map(([goalId, { rows, weightage, label }]) => (
                        <React.Fragment key={goalId}>
                          {renderSectionHeader(goalId, weightage, label)}
                          {renderTableRows(rows)}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-3">
                            <FaChartLine size={48} className="text-gray-300" />
                            <p className="text-lg">No business goals found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}

                {/* Total Rating Row */}
                {tableData.length > 0 && (
                  <tr
                    className="font-semibold text-lg border-t-2 border-gray-300"
                    style={{ backgroundColor: theme.secondaryColor }}
                  >
                    <td colSpan="7" className="py-4 px-6 text-right">
                       Business Rating:
                    </td>
                    <td
                      className="py-4 px-4 text-center text-xl font-bold"
                      style={{ color: theme.primaryColor }}
                    >
                      {calculateOverallRating()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="bg-white border-t-4 px-8 py-4 flex justify-center gap-8 rounded-b-2xl shadow-md"
          style={{ borderColor: theme.secondaryColor }}
        >
          <Button
            variant={3}
            text="Back"
            onClick={() => navigate("/emp/appraisal/businessappraisal")}
            type="button"
          />
          <Button
            variant={1}
            text={loading ? "Saving..." : (isEditMode ? "Update" : "Save")}
            type="submit"
            disabled={loading || tableData.length === 0}
          />
        </div>
      </form>
    </div>
  );
};

export default BusinessAppraisal;