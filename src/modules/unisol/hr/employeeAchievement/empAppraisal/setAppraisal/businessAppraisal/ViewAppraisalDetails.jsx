import React from "react";
import { useTheme } from "../../../../../../../hooks/theme/useTheme";
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Button from "../../../../../../../components/Button";
import useLeadershipAppraisal from "../../../../../../../hooks/unisol/empAchievement/useLeadershipAppraisal";
import LoaderSpinner from "../../../../../../../components/LoaderSpinner";
import BreadCrumb from "../../../../../../../components/BreadCrumb";

const ViewAppraisalDetails = () => {
  const { loading, fetchEmpWiseAppraisalDetails, empWiseAppraisalDetails, giveFinalRatingToEmp } = useLeadershipAppraisal();
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [isEditMode, setIsEditMode] = useState(false);
  const [appraisalData, setAppraisalData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchEmpWiseAppraisalDetails(id);
    }
  }, [id]);

  // Transform API data to component format when data is fetched
  useEffect(() => {
    if (empWiseAppraisalDetails) {
      transformApiData(empWiseAppraisalDetails);
    }
  }, [empWiseAppraisalDetails]);

  console.log("empWiseAppraisalDetails", empWiseAppraisalDetails);

  const transformApiData = (apiData) => {
    // Calculate total rating from all business goals
    let totalRating = 0;
    let totalItems = 0;

    const categories = apiData.businessGoalsGroupedByGoal?.map((goalGroup, groupIndex) => {
      // Calculate category percentage based on goal weightage
      const categoryPercentage = parseFloat(goalGroup.weightage) || 0;

      const items = goalGroup.businessGoals?.map((goal, itemIndex) => {
        // Parse numeric values
        const selfRating = parseFloat(goal.selfRating) || 0;
        const suggestedRating = parseFloat(goal.suggestedRating) || 0;
        const finalRating = parseFloat(goal.finalRating) || 0;

        // Add to total for overall rating calculation
        totalRating += finalRating;
        totalItems++;

        // Calculate achievement percentage
        const achievementScore = goal.achievement ?
          (parseFloat(goal.achievement) / parseFloat(goal.target) * 100) : 0;

        return {
          _id: goal._id,
          srNo: itemIndex + 1,
          payrollGrade: "N/A", // You might want to get this from employee data
          Objective: goal.objectiveName || "N/A",
          Measures: goal.measures || "N/A",
          target: goal.target || "N/A",
          weightage: parseFloat(goal.weightage) || 0,
          achievement: {
            score: achievementScore.toFixed(2),
            percentage: `${achievementScore.toFixed(1)}%`,
            value: goal.achievement || "N/A"
          },
          suggestedRating: suggestedRating,
          selfRating: selfRating,
          finalRating: finalRating
        };
      }) || [];

      return {
        name: goalGroup.goalName || "Unnamed Goal",
        percentage: categoryPercentage,
        items: items
      };
    }) || [];

    // Calculate average total rating
    const averageTotalRating = totalItems > 0 ? (totalRating / totalItems).toFixed(2) : 0;

    setAppraisalData({
      finalRating: averageTotalRating,
      categories: categories
    });
  };

  const handleFinalRatingChange = (categoryIndex, itemIndex, value) => {
    if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 9 && value.length === 1)) {
      const updatedData = { ...appraisalData };
      updatedData.categories[categoryIndex].items[itemIndex].finalRating = value === "" ? "" : parseInt(value);

      // Recalculate total rating
      let total = 0;
      let count = 0;
      updatedData.categories.forEach(cat => {
        cat.items.forEach(item => {
          if (item.finalRating) {
            total += parseFloat(item.finalRating);
            count++;
          }
        });
      });
      updatedData.finalRating = count > 0 ? (total / count).toFixed(2) : 0;

      setAppraisalData(updatedData);
    }
  };

  const handleSave = async () => {
    let isValid = true;
    appraisalData.categories.forEach((category) => {
      category.items.forEach((item) => {
        if (item.finalRating === "" || item.finalRating === 0) {
          isValid = false;
        }
      });
    });

    // Prepare data for API update in the required format
    const businessGoalsArray = [];

    // Map updated ratings to the required format
    appraisalData.categories.forEach((category, categoryIndex) => {
      category.items.forEach((item, itemIndex) => {
        const originalGoal = empWiseAppraisalDetails.businessGoalsGroupedByGoal[categoryIndex]?.businessGoals[itemIndex];
        if (originalGoal) {
          businessGoalsArray.push({
            businessGoalId: originalGoal._id,
            finalRating: item.finalRating.toString()
          });
        }
      });
    });

    // Create the payload with businessGoals property
    const payload = {
      businessGoals: businessGoalsArray
    };
    await giveFinalRatingToEmp(id, payload);
    setIsEditMode(false);
    fetchEmpWiseAppraisalDetails(id);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    // Revert to original data
    transformApiData(empWiseAppraisalDetails);
    setIsEditMode(false);
  };

  const handleBack = () => {
    navigate(`/hr/employeeAchievement/appraisalList/empWiseAppraisal/${empWiseAppraisalDetails?.employee_id}`);
  };

  if (loading && !appraisalData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <BreadCrumb
          linkText={[
            { text: "Employee Achievement", href: "/hr/employeeAchievement" },
            {
              text: "Employee's Appraisal List",
              href: "/hr/employeeAchievement/appraisalList",
            },
            {
              text: "Employee Wise Appraisal",
              href: `/hr/employeeAchievement/appraisalList/empWiseAppraisal/${empWiseAppraisalDetails?.employee_id}`,
            },
            { text: isEditMode ? "Edit Appraisal Details" : "View Business Appraisal" },
          ]}
        />

        <div className="py-4 px-8 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white shadow-lg gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Appraisal Details" : "Employee Business Appraisal"}
          </h1>
          {!isEditMode && (
            <span
              className="ml-4 px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: empWiseAppraisalDetails?.finalRatingStatus === 'completed'
                  ? '#10b98120'
                  : '#f59e0b20',
                color: empWiseAppraisalDetails?.finalRatingStatus === 'completed'
                  ? '#10b981'
                  : '#f59e0b',
                textTransform: 'capitalize'
              }}
            >
              {empWiseAppraisalDetails?.finalRatingStatus || 'Pending'}
            </span>
          )}
        </div>

        {appraisalData && (
          <>
            <div className="flex items-center gap-4 mt-4 bg-white w-full rounded-2xl shadow-md">
              <div className="w-full">
                <div className="h-full w-full">
                  <div className="overflow-x-auto overflow-y-auto w-full rounded-t-2xl">
                    <table className="bg-white min-w-full">
                      <thead
                        className="text-gray-700 text-md py-10 font-semibold"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <tr>
                          <th className="py-3 px-4 text-left border-b whitespace-nowrap text-white">
                            Sr. No.
                          </th>
                          <th className="py-3 px-4 text-center border-b text-white">
                            Objective
                          </th>
                          <th className="py-3 px-4 text-center border-b text-white">
                            Measures
                          </th>
                          <th className="py-3 px-4 text-center border-b text-white">
                            Target
                          </th>
                          <th className="py-3 px-4 text-center border-b text-white">
                            Weightage
                          </th>
                          <th className="py-3 px-4 text-center border-b text-white">
                            Achievement
                          </th>
                          <th className="py-3 px-4 text-center border-b text-white">
                            Suggested Rating
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
                        {appraisalData?.categories?.map((category, categoryIndex) => (
                          <>
                            {/* Category Header */}
                            <tr
                              key={`category-${categoryIndex}`}
                              className="bg-gray-100"
                              style={{ backgroundColor: `${theme.secondaryColor}40` }}
                            >
                              <td
                                colSpan="9"
                                className="py-3 px-4 font-bold text-left text-gray-800"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{category.name}</span>
                                  <span className="text-sm font-normal text-gray-600">
                                    (Weightage: {category.percentage}%)
                                  </span>
                                </div>
                              </td>
                            </tr>

                            {/* Category Items */}
                            {category.items.map((item, itemIndex) => (
                              <tr
                                key={item._id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-3 px-4 border-b text-center font-medium">
                                  {item.srNo}
                                </td>
                                <td className="py-3 px-4 border-b text-center font-medium">
                                  {item.Objective}
                                </td>
                                <td className="py-3 px-4 border-b text-center font-medium">
                                  {item.Measures}
                                </td>
                                <td className="py-3 px-4 border-b text-center font-medium">
                                  {item.target}
                                </td>
                                <td className="py-3 px-4 border-b text-center font-medium">
                                  {item.weightage}%
                                </td>
                                <td className="py-3 px-4 border-b">
                                  <div className="flex items-center justify-center gap-5">
                                    {item.achievement.value}
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-b text-center font-medium">
                                  {item.suggestedRating || 'N/A'}
                                </td>
                                <td className="py-3 px-4 border-b text-center font-medium">
                                  {item.selfRating || 'N/A'}
                                </td>
                                <td className="py-3 px-4 border-b text-center">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={item.finalRating}
                                      onChange={(e) =>
                                        handleFinalRatingChange(
                                          categoryIndex,
                                          itemIndex,
                                          e.target.value
                                        )
                                      }
                                      className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 transition-all"
                                      style={{
                                        borderColor: theme.secondaryColor,
                                        focusRing: theme.primaryColor
                                      }}
                                      placeholder="1-9"
                                      maxLength={1}
                                    />
                                  ) : (
                                    <span className="font-semibold text-lg"
                                      style={{ color: theme.primaryColor }}>
                                      {item.finalRating || '-'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </>
                        ))}

                        {/* Total Rating Row */}
                        <tr className="bg-gray-50 font-semibold">
                          <td colSpan="8" className="py-4 px-4 text-right text-lg">
                            Total Business Rating:
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className="text-lg font-bold"
                              style={{ color: theme.primaryColor }}
                            >
                              {appraisalData?.finalRating || '0'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="sticky bottom-0 bg-white border-t-4 px-8 py-4 flex justify-center gap-8 rounded-b-2xl"
              style={{ borderColor: theme.secondaryColor }}
            >
              {!isEditMode ? (
                <>
                  <Button
                    onClick={handleBack}
                    className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-50 transition"
                    text="Back"
                  />
                  {empWiseAppraisalDetails?.finalRatingStatus !== 'completed' && (
                    <Button
                      onClick={handleEdit}
                      style={{ backgroundColor: theme.primaryColor }}
                      className="text-white px-8 py-2 rounded-lg hover:opacity-90 transition"
                      text="Edit"
                    />
                  )}
                </>
              ) : (
                <>
                  <Button
                    onClick={handleCancel}
                    className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-50 transition"
                    text="Cancel"
                  />
                  <Button
                    onClick={handleSave}
                    style={{ backgroundColor: theme.primaryColor }}
                    className="text-white px-8 py-2 rounded-lg hover:opacity-90 transition"
                    text="Save"
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ViewAppraisalDetails;