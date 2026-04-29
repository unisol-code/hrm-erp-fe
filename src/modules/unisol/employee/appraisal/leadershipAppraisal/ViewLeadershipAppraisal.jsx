import { Link } from "react-router-dom";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useExpAppraisal from "../../../../../hooks/unisol/empAppraisal/useExpAppraisal";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import ShowAppraisalDetails from "../../../../../components/Dialogs/paySlip/ShowAppraisalDetails";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const ViewLeadershipAppraisal = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const { fetchLeadershipAppraisalbyid, leadershipAppraisalData, loading } =
    useExpAppraisal();
  const [showPopup, setShowPopup] = useState(false);
  const [appraisalState, setAppraisalState] = useState({
    title: "",
    description: "",
    detailedDescription: "",
    individualLeader: "",
    objective: "",
  });
  
  const handleStateChange = (updates) => {
    setAppraisalState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  useEffect(() => {
    if (id) {
      fetchLeadershipAppraisalbyid(id);
    }
  }, [id]);

  console.log("leadershipAppraisalData : ", leadershipAppraisalData);

  // Calculate average of final ratings
  const calculateAverageFinalRating = () => {
    if (!leadershipAppraisalData?.leadershipGoals?.length) return 0;
    
    const total = leadershipAppraisalData.leadershipGoals.reduce(
      (sum, item) => sum + Number(item.finalRating || 0),
      0
    );
    return (total / leadershipAppraisalData.leadershipGoals.length).toFixed(2);
  };

  return (
    <>
      {showPopup && appraisalState && (
        <ShowAppraisalDetails
          appraisalState={appraisalState}
          onClick={() => setShowPopup(false)}
        />
      )}
      <div className="min-h-screen flex flex-col">
        <Breadcrumb
          linkText={[
            { text: "Appraisal", href: "/emp/appraisal" },
            {
              text: "Leadership Appraisal",
              href: "/emp/appraisal/leadershipappraisal",
            },
            { text: "View Leadership Appraisal" },
          ]}
        />
        
        {/* Header with status badge */}
        <div className="px-8 py-4 flex items-center justify-between bg-white rounded-2xl shadow-md">
          <div className="flex items-center gap-4">
            <Link to="/emp/appraisal/leadershipappraisal">
              <FaRegArrowAltCircleLeft size={20} />
            </Link>
            <h1 className="font-medium text-xl">View Leadership Appraisal</h1>
          </div>
          {leadershipAppraisalData && (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                leadershipAppraisalData.finalRatingStatus === 'submitted' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {leadershipAppraisalData.finalRatingStatus?.toUpperCase() || 'PENDING'}
              </span>
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{leadershipAppraisalData.date}</span>
            </div>
          )}
        </div>
        
        {/*------------------Leadership-Appraisal--Table------------------ */}
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
                  Titles
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center font-medium">
                    <div className="flex items-center justify-center gap-5">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {leadershipAppraisalData?.leadershipGoals &&
                    leadershipAppraisalData.leadershipGoals.map((item, index) => (
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
                          <div className="max-w-xs mx-auto">
                            <p className="text-sm bg-gray-50 p-2 rounded-lg">
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
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-800 rounded-full font-bold">
                            {item.finalRating || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  
                  {/* Summary Row */}
                  {leadershipAppraisalData?.leadershipGoals && (
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="5" className="py-4 px-4 text-right">
                        Total Goals: {leadershipAppraisalData.leadershipGoals.length} | 
                        Average Final Rating:
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-indigo-600 font-bold text-lg">
                          {calculateAverageFinalRating()}
                        </span>
                      </td>
                    </tr>
                  )}
                </>
              )}
              
              {/* No data message */}
              {!loading && (!leadershipAppraisalData?.leadershipGoals || leadershipAppraisalData.leadershipGoals.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                    No leadership appraisal data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewLeadershipAppraisal;