import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleLeft, FaChartLine, FaTrash, FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useEmpBusinessAppraisal from "../../../../../hooks/unisol/empAppraisal/useEmpBusinessAppraisal";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const ViewSelfAppraisal2 = () => {
  const {
    fetchSubmittedBusinessAppraisalDetails,
    submittedBusinessAppraisalDetails,
    resetBusinessAppraisal,
    loading
  } = useEmpBusinessAppraisal();

  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [businessData, setBusinessData] = useState([]);
  const [totalRating, setTotalRating] = useState(0);

  useEffect(() => {
    if (id) {
      fetchSubmittedBusinessAppraisalDetails(id);
    }
    // Cleanup function
    return () => {
      resetBusinessAppraisal?.();
    };
  }, [id]);

  // Process API data when it's received
  useEffect(() => {
    if (submittedBusinessAppraisalDetails?.businessGoalsGroupedByGoal) {
      const processedData = processBusinessGoalsData(submittedBusinessAppraisalDetails);
      setBusinessData(processedData);
      calculateTotalRating(processedData);
    }
  }, [submittedBusinessAppraisalDetails]);

  const processBusinessGoalsData = (data) => {
    if (!data?.businessGoalsGroupedByGoal) return [];

    const processedRows = [];
    let srNo = 1;

    data.businessGoalsGroupedByGoal.forEach((goalGroup, groupIndex) => {
      // Add group header data if needed
      if (goalGroup.businessGoals && goalGroup.businessGoals.length > 0) {
        goalGroup.businessGoals.forEach((goal) => {
          processedRows.push({
            srNo: srNo++,
            goalId: goalGroup.goalId,
            goalName: goalGroup.goalName || 'N/A',
            groupWeightage: goalGroup.weightage || '0',
            objectiveName: goal.objectiveName || 'N/A',
            measures: goal.measures || 'N/A',
            target: goal.target || 'N/A',
            weightage: goal.weightage || '0',
            achievement: goal.achievement || 'N/A',
            selfRating: goal.selfRating || '0',
            suggestedRating: goal.suggestedRating || '0',
            finalRating: goal.finalRating || goal.selfRating || '0', // Use finalRating if available, else selfRating
            _id: goal._id
          });
        });
      }
    });

    return processedRows;
  };

  const calculateTotalRating = (data) => {
    if (data.length === 0) return;

    const total = data.reduce((sum, item) => {
      const rating = parseFloat(item.finalRating) || parseFloat(item.selfRating) || 0;
      return sum + rating;
    }, 0);

    const average = (total / data.length).toFixed(3);
    setTotalRating(average);
  };

  const getUniqueGoalNames = () => {
    return [...new Set(businessData.map(item => item.goalName))];
  };

  const renderSectionHeader = (goalName) => {

    return (
      <tr key={`header-${goalName}`}>
        <td
          colSpan="9"
          className="px-6 py-4 text-left font-bold text-lg"
          style={{
            backgroundColor: theme.secondaryColor,
            color: "#1f2937",
            borderBottom: "2px solid #d1d5db"
          }}
        >
          <div className="flex justify-between items-center">
            <span>{goalName}</span>
          </div>
        </td>
      </tr>
    );
  };

  // Render table rows from processed data
  const renderTableRows = (goalName) => {
    const filteredData = businessData.filter(item => item.goalName === goalName);

    return filteredData.map((item, index) => (
      <tr
        key={item._id || index}
        className="h-[60px] border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <td className="px-4 py-3 font-medium text-gray-700 text-center">{item.srNo}</td>
        <td className="px-4 py-3 text-gray-800 text-left">{item.objectiveName}</td>
        <td className="px-4 py-3 text-gray-800 text-left">{item.measures}</td>
        <td className="px-4 py-3 font-medium text-gray-700 text-right">{item.target}</td>
        <td className="px-4 py-3 text-gray-700 text-center">{item.weightage}%</td>
        <td className="px-4 py-3 text-gray-800 text-left">{item.achievement}</td>
        <td className="px-4 py-3 text-gray-800 text-center font-medium" style={{ color: theme.primaryColor }}>
          {item.suggestedRating}
        </td>
        <td className="px-4 py-3 text-gray-800 text-center">{item.selfRating}</td>
        <td className="px-4 py-3 text-gray-800 text-center font-bold" style={{ color: theme.primaryColor }}>
          {item.finalRating}
        </td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Appraisal", href: "/emp/appraisal" },
          {
            text: "Business Appraisal",
            href: "/emp/appraisal/businessappraisal",
          },
          { text: "View Business Appraisal" },
        ]}
      />

      {/* Header Section */}
      <div className="px-8 py-4 flex items-center justify-between bg-white rounded-2xl shadow-md mb-4">
        <div className="flex items-center gap-4">
          <Link to="/emp/appraisal/businessappraisal" className="group">
            <FaRegArrowAltCircleLeft
              size={24}
              className="text-gray-600 group-hover:text-gray-900 transition"
            />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              View Business Appraisal
            </h1>
             <p className="text-sm text-gray-500 mt-1">
              Submitted on: {submittedBusinessAppraisalDetails?.date 
                ? new Date(submittedBusinessAppraisalDetails.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${submittedBusinessAppraisalDetails?.finalRatingStatus === 'approved'
              ? 'bg-green-100 text-green-700'
              : submittedBusinessAppraisalDetails?.finalRatingStatus === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
            Status: {submittedBusinessAppraisalDetails?.finalRatingStatus || 'Pending'}
          </span>
        </div>
      </div>

      {businessData.length > 0 ? (
        <>
          {/* Main Table Section */}
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
            <div className="p-6">
              <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-gray-50 font-semibold text-gray-700 h-[50px] border-b-2 border-gray-200">
                      <th className="px-4 py-3 w-16">Sr. No.</th>
                      <th className="px-4 py-3 text-left">Objective</th>
                      <th className="px-4 py-3 text-left">Measures</th>
                      <th className="px-4 py-3 text-right">Target</th>
                      <th className="px-4 py-3">Weightage</th>
                      <th className="px-4 py-3 text-left">Achievement</th>
                      <th className="px-4 py-3">Suggested Rating</th>
                      <th className="px-4 py-3">Self Rating</th>
                      <th className="px-4 py-3">Final Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          <div className="flex justify-center">
                            <LoaderSpinner />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {getUniqueGoalNames().map(goalName => (
                          <>
                            {renderSectionHeader(goalName)}
                            {renderTableRows(goalName)}
                          </>
                        ))}
                      </>
                    )}


                    {/* Total Rating Row */}
                    <tr className="border-t-2 border-gray-300">
                      <td
                        colSpan="8"
                        className="px-6 py-4 text-right font-bold text-lg"
                        style={{ backgroundColor: theme.secondaryColor }}
                      >
                        Total Business Rating
                      </td>
                      <td
                        className="px-6 py-4 text-center font-bold text-lg"
                        style={{ backgroundColor: theme.secondaryColor }}
                      >
                        {totalRating}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Rating Summary Card */}
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full mt-4">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine style={{ color: theme.primaryColor }} />
                Rating Calculation Summary
              </h2>

              {/* Business Rating Row */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700 text-md font-medium">Business Rating</span>
                <div className="flex items-center gap-8">
                  <span className="text-gray-800 font-bold text-md">{totalRating}</span>
                  <span className="text-gray-600 text-md min-w-[60px] text-right">80%</span>
                </div>
              </div>

              {/* GLP Rating Row */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700 text-md font-medium">GLP Rating</span>
                <div className="flex items-center gap-8">
                  <span className="text-gray-800 font-bold text-md">
                    {submittedBusinessAppraisalDetails?.glpRating || '7'}
                  </span>
                  <span className="text-gray-600 text-md min-w-[60px] text-right">20%</span>
                </div>
              </div>

              {/* Final Rating Row */}
              <div
                className="flex justify-between items-center py-4 mt-2 rounded-lg"
                style={{
                  backgroundColor: `${theme.primaryColor}10`,
                  borderLeft: `4px solid ${theme.primaryColor}`
                }}
              >
                <span className="text-gray-900 font-bold text-lg pl-4">Final Rating</span>
                <div className="flex items-center gap-8 pr-4">
                  <span className="text-gray-900 font-bold text-xl" style={{ color: theme.primaryColor }}>
                    {(
                      (parseFloat(totalRating) * 0.8) +
                      (parseFloat(submittedBusinessAppraisalDetails?.glpRating || 7) * 0.2)
                    ).toFixed(3)}
                  </span>
                  <span className="text-gray-800 font-semibold text-lg min-w-[60px] text-right">
                    100%
                  </span>
                </div>
              </div>

              {/* Formula explanation */}
              <p className="text-center text-gray-500 italic text-sm mt-4 bg-gray-50 p-2 rounded-lg">
                Final Rating = (Business Rating × 80%) + (GLP Rating × 20%)
              </p>
            </div>
          </section>
        </>
      ) : (
        // Empty State
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden w-full p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaChartLine size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500 mb-6">No business appraisal data found for this record.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ViewSelfAppraisal2;