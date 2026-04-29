import { Link, useParams } from "react-router-dom";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useExpAppraisal from "../../../../../hooks/unisol/empAppraisal/useExpAppraisal";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../../components/BreadCrumb";
import "react-circular-progressbar/dist/styles.css";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import ShowAppraisalDetails from "../../../../../components/Dialogs/paySlip/ShowAppraisalDetails";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const LeadershipAppraisal = () => {
  const {
    getLeadershipAppraisalDetails,
    leadershipAppraisalDetails,
    giveLeadershipAppraisalRating,
    loading,
    fetchLeadershipAppraisalbyid, 
    leadershipAppraisalData,
    updateLeadershipAppraisalRating
  } = useExpAppraisal();
  
  const { id } = useParams();
  console.log("leadershipAppraisalDetails", leadershipAppraisalDetails);
  console.log("leadershipAppraisalData", leadershipAppraisalData);

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

  // Refs for textarea height calculation
  const textareaRefs = useRef({});

  useEffect(() => {
    if (id) {
      fetchLeadershipAppraisalbyid(id);
    } else {
      getLeadershipAppraisalDetails();
    }
  }, [id]);

  const handleStateChange = (updates) => {
    setAppraisalState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const calculateAverageRating = () => {
    const total = formik.values.leadershipGoals.reduce(
      (sum, val) => sum + Number(val.selfRating || 0),
      0
    );
    const count = formik.values.leadershipGoals.length;
    return count > 0 ? (total / count).toFixed(2) : 0;
  };

  // Handle achievement change with auto-resize
  const handleAchievementChange = (itemId, value) => {
    setAchievements(prev => ({
      ...prev,
      [itemId]: value
    }));
    
    // Auto-resize textarea based on content
    setTimeout(() => {
      if (textareaRefs.current[itemId]) {
        const textarea = textareaRefs.current[itemId];
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
      }
    }, 0);
  };

  const [achievements, setAchievements] = useState({});

  // Initialize form with existing data if editing
  useEffect(() => {
    if (id && leadershipAppraisalData?.leadershipGoals) {
      // Pre-fill achievements and self ratings from existing data
      const initialAchievements = {};
      leadershipAppraisalData.leadershipGoals.forEach((goal, index) => {
        if (goal.achievement) {
          initialAchievements[goal.leadershipAppraisalId] = goal.achievement;
        }
      });
      setAchievements(initialAchievements);
    }
  }, [id, leadershipAppraisalData]);

  // Adjust textarea heights after achievements are set
  useEffect(() => {
    if (Object.keys(achievements).length > 0) {
      setTimeout(() => {
        Object.keys(achievements).forEach(itemId => {
          if (textareaRefs.current[itemId]) {
            const textarea = textareaRefs.current[itemId];
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
          }
        });
      }, 100);
    }
  }, [achievements]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      leadershipGoals: Array.isArray(leadershipAppraisalDetails)
        ? leadershipAppraisalDetails?.map((item) => {
            // If editing, find existing rating
            let existingRating = 0;
            if (id && leadershipAppraisalData?.leadershipGoals) {
              const existingGoal = leadershipAppraisalData.leadershipGoals.find(
                goal => goal.leadershipAppraisalId === item._id
              );
              existingRating = existingGoal?.selfRating || 0;
            }
            return {
              leadershipAppraisalId: item._id,
              selfRating: existingRating,
            };
          })
        : [],
    },
    validationSchema: Yup.object({
      leadershipGoals: Yup.array().of(
        Yup.object().shape({
          selfRating: Yup.number()
            .min(1, "Minimum rating is 1")
            .max(9, "Max rating is 9")
            .required("Your rating is required"),
        })
      ),
    }),
    onSubmit: async (values) => {
      
      // Format data according to API requirements
      const leadershipGoals = leadershipAppraisalDetails?.map((item, index) => {
        const achievementValue = achievements[item._id] || '';
        
        return {
          leadershipAppraisalId: item._id,
          selfRating: values.leadershipGoals[index]?.selfRating?.toString() || "0",
          achievement: achievementValue
        };
      });

      const dataToSend = {
        leadershipGoals
      };

      console.log("Data to send:", dataToSend);

      try {
        let success;
        if (id) {
          success = await updateLeadershipAppraisalRating(id, dataToSend);
        } else {
          success = await giveLeadershipAppraisalRating(dataToSend);
        }
        
        if (success) {
          navigate("/emp/appraisal/leadershipappraisal");
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  console.log(formik.values, formik.errors);

  // Determine which data to display
  const displayData = id && leadershipAppraisalData?.leadershipGoals 
    ? leadershipAppraisalDetails
    : leadershipAppraisalDetails;

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
            { text: id ? "Edit Leadership Appraisal" : "Add Leadership Appraisal" },
          ]}
        />

        <div className="px-8 py-4 flex items-center gap-4 bg-white rounded-2xl shadow-md">
          <Link to="/emp/appraisal/leadershipappraisal" className="group">
            <FaRegArrowAltCircleLeft
              size={24}
              className="text-black group-hover:text-gray-700 transition"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {id ? "Edit Leadership Appraisal" : "Give Leadership Appraisal"}
          </h1>
        </div>
        <div className="flex items-center gap-4 mt-4 bg-white w-full rounded-2xl shadow-md">
          <form onSubmit={formik.handleSubmit} className="w-full">
            <div className="h-full w-full">
              <div className="overflow-x-auto overflow-y-auto w-full rounded-2xl">
                <table className="bg-white min-w-full">
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
                    </tr>
                  </thead>
                  <tbody className="text-[16px] text-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-8">
                          <div className="flex justify-center items-center">
                            <LoaderSpinner />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {displayData?.map((item, index) => {
                          // Find existing goal data if editing
                          const existingGoal = id && leadershipAppraisalData?.leadershipGoals
                            ? leadershipAppraisalData.leadershipGoals.find(
                                goal => goal.leadershipAppraisalId === item._id
                              )
                            : null;
                            
                          return (
                            <tr
                              key={item._id || index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-2 px-4 border-b text-center font-medium">
                                {index + 1}
                              </td>
                              <td
                                className="py-2 px-4 border-b text-center font-medium hover:underline hover:cursor-pointer"
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
                                {item.title}
                              </td>
                              <td className="py-2 px-2 border-b text-center font-medium">
                                {item?.weightage || 0}
                              </td>
                              <td className="py-2 px-2 text-center font-medium">
                                <textarea
                                  ref={el => textareaRefs.current[item._id] = el}
                                  value={achievements[item._id] || existingGoal?.achievement || ''}
                                  onChange={(e) => {
                                    handleAchievementChange(item._id, e.target.value);
                                  }}
                                  className="w-96 px-3 py-2 border-2 border-gray-300 rounded-lg text-left text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-y"
                                  placeholder="Enter achievement details..."
                                  rows="2"
                                  style={{
                                    minHeight: '60px',
                                    maxHeight: '200px',
                                    width: '400px'
                                  }}
                                />
                              </td>
                              <td className="py-2 px-4 border-b text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <input
                                    type="text"
                                    maxLength="1"
                                    value={formik.values.leadershipGoals[index]?.selfRating || ''}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Only allow single digits 0-9
                                      if (value === '' || /^[0-9]$/.test(value)) {
                                        formik.setFieldValue(
                                          `leadershipGoals[${index}].selfRating`,
                                          value ? Number(value) : ''
                                        );
                                      }
                                    }}
                                    onBlur={() => formik.setFieldTouched(`leadershipGoals[${index}].selfRating`, true)}
                                    className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    placeholder="0-9"
                                  />
                                  {formik.touched.leadershipGoals?.[index]?.selfRating &&
                                    formik.errors.leadershipGoals?.[index]?.selfRating && (
                                      <p className="text-red-500 text-xs mt-1">
                                        {formik.errors.leadershipGoals[index].selfRating}
                                      </p>
                                    )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-gray-50 font-semibold">
                          <td colSpan="5" className="py-3 px-4 text-right">
                            Final GLP Rating:
                            <span className="ml-2 text-indigo-600">
                              {calculateAverageRating()}
                            </span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="bottom-sticky bg-white border-t-4 px-8 py-4 flex justify-center gap-8 rounded-b-2xl"
              style={{ borderColor: theme.secondaryColor }}
            >
              <Button
                variant={3}
                text="Back"
                onClick={() => navigate("/emp/appraisal")}
              />
              <Button variant={1} text={id ? "Update" : "Save"} type="submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeadershipAppraisal;