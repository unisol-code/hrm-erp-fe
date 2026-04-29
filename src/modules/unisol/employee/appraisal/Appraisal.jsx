import { Link } from "react-router-dom";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { PiHandWavingFill } from "react-icons/pi";
import { MdOutlineReviews } from "react-icons/md";
import { FaCrown, FaBriefcase } from "react-icons/fa";
import { useEffect, useState } from "react";
import useExpAppraisal from "../../../../hooks/unisol/empAppraisal/useExpAppraisal";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import clsx from "clsx";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { FaStar } from "react-icons/fa";

const Appraisal = () => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const { questionAnswers, getAllQuestionsAnswers, loading } =
    useExpAppraisal();

  useEffect(() => {
    getAllQuestionsAnswers();
  }, []);

  useEffect(() => {
    const storedName = sessionStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const toggleQuestion = (question) => {
    setActiveQuestion((prevQuestion) =>
      prevQuestion === question ? null : question
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      {/* <Breadcrumb linkText={[{ text: "Appraisal" }]} /> */}

      {/* Welcome Banner - Reduced padding */}
      <div className="bg-gradient-to-r from-[#E8E8FF] to-[#F3F3FF] w-full rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 px-6 py-5 items-center justify-between mb-2">
        <div className="flex flex-col items-start h-full justify-center gap-1">
          <div className="flex items-center text-[#7979BB] text-xl md:text-2xl font-bold gap-2">
            Hi {name || "User"}{" "}
            <PiHandWavingFill style={{ color: "#FFD700" }} />
          </div>
          <h1 className="text-[#7979BB] text-sm md:text-base font-medium">
            Welcome to the Appraisal!
          </h1>
        </div>
        <div className="relative flex justify-center items-center mt-4 md:mt-0">
          <h4 className="text-[28px] sm:text-[40px] md:text-[50px] font-bold text-[#7676DC] drop-shadow-lg">
            Appraisal
          </h4>
        </div>
      </div>

      {/* FAQ + Cards Section - Reduced padding */}
      <div className="w-full flex flex-col gap-3">
        <div className="rounded-2xl shadow-lg bg-white px-6 py-5 mt-1 mb-6 border border-[#E8E8FF]">
          <h1 className="mb-4 text-black text-xl font-bold">
            About Appraisal
          </h1>

          {/* FAQ bordered section - Reduced padding */}
          <div className="border border-[#E8E8FF] rounded-xl p-3 shadow-xl bg-white mb-4">
            {questionAnswers && questionAnswers.length > 0 ? (
              questionAnswers.map((faq) => (
                <div
                  key={faq._id}
                  className="mb-3 border-b border-gray-300 last:border-b-0"
                >
                  <div
                    className={clsx(
                      "flex justify-between items-center cursor-pointer py-2 px-2 rounded-lg transition",
                      "faq-hover-gradient"
                    )}
                    style={{
                      background:
                        activeQuestion === faq._id
                          ? `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 200%)`
                          : undefined,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 200%)`;
                    }}
                    onMouseLeave={(e) => {
                      if (activeQuestion !== faq._id) {
                        e.currentTarget.style.background = "";
                      }
                    }}
                    onClick={() => toggleQuestion(faq._id)}
                  >
                    <h2 className="font-medium text-base text-black">
                      {faq.question}
                    </h2>
                    <span className="text-2xl text-[#7676DC]">
                      {activeQuestion === faq._id ? (
                        <RiArrowDropUpLine size={24} />
                      ) : (
                        <RiArrowDropDownLine size={24} />
                      )}
                    </span>
                  </div>
                  {activeQuestion === faq._id && (
                    <div className="mt-2 bg-white p-3 rounded-md text-sm text-gray-700 shadow">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm">Loading questions and answers...</p>
            )}
          </div>

          {/* Divider - Reduced margin */}
          <div className="my-5 border-t border-[#d7d7d9]" />

          {/* Cards Section - Reduced padding and font sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Rating Overview Card */}
            <Link
              to={"/emp/appraisal/ratingoverview"}
              className="col-span-1 bg-white rounded-2xl shadow-lg flex flex-col px-5 pt-5 pb-3 border border-[#F3F3F3] transition-all hover:shadow-2xl hover:bg-[#FFF7ED]"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-[#EE9211] font-semibold">
                  <MdOutlineReviews className="text-yellow-500 text-xl" />
                  <h2 className="text-[#EE9211] font-bold text-base">
                    Rating Overview
                  </h2>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                View the ratings criteria in detail
              </p>
              <div className="text-[#EE9211] font-semibold text-sm px-3 py-1 rounded-lg w-fit mt-auto">
                <div className="text-[#EE9211] font-semibold text-sm cursor-pointer">
                  View Rating
                </div>
              </div>
            </Link>

            {/* Leadership Appraisal Card */}
            <Link
              to={"/emp/appraisal/leadershipappraisal"}
              className="col-span-1 bg-white rounded-2xl shadow-lg flex flex-col px-5 pt-5 pb-3 border border-[#F3F3F3] transition-all hover:shadow-2xl hover:bg-[#F3E8FF]"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-[#7C3AED] font-semibold">
                  <FaCrown className="text-purple-500 text-xl" />
                  <h2 className="text-[#7C3AED] font-bold text-base">
                    Leadership Appraisal
                  </h2>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Give rating, share achievements about yourself
              </p>
              <div className="text-[#7C3AED] font-semibold text-sm px-3 py-1 rounded-lg w-fit mt-auto">
                <div className="text-[#7C3AED] font-semibold text-sm cursor-pointer">
                  Give Appraisal
                </div>
              </div>
            </Link>

            {/* Business Appraisal Card */}
            <Link
              to={"/emp/appraisal/businessappraisal"}
              className="col-span-1 bg-white rounded-2xl shadow-lg flex flex-col px-5 pt-5 pb-3 border border-[#F3F3F3] transition-all hover:shadow-2xl hover:bg-[#E6FFFA]"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-[#059669] font-semibold">
                  <FaBriefcase className="text-green-600 text-xl" />
                  <h2 className="text-[#059669] font-bold text-base">
                    Business Appraisal
                  </h2>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Give rating, share achievements about company
              </p>
              <div className="text-[#059669] font-semibold text-sm px-3 py-1 rounded-lg w-fit mt-auto">
                <div className="text-[#059669] font-semibold text-sm cursor-pointer">
                  Give Appraisal
                </div>
              </div>
            </Link>

            {/* Final Rating Card */}
            <Link
              to={"/emp/appraisal/final-rating"}
              className="col-span-1 bg-white rounded-2xl shadow-lg flex flex-col px-5 pt-5 pb-3 border border-[#F3F3F3] transition-all hover:shadow-2xl hover:bg-[#EEF2FF]"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-[#4F46E5] font-semibold">
                  <FaStar className="text-indigo-600 text-xl" />
                  <h2 className="text-[#4F46E5] font-bold text-base">
                    View Final Rating
                  </h2>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-2">
                Check your final appraisal rating and feedback
              </p>

              <div className="text-[#4F46E5] font-semibold text-sm px-3 py-1 rounded-lg w-fit mt-auto">
                <div className="text-[#4F46E5] font-semibold text-sm cursor-pointer">
                  View Rating
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appraisal;