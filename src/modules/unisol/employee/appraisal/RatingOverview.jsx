import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { MdOutlineArrowBackIos } from "react-icons/md";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { MdOutlineGppBad } from "react-icons/md";
import { BsExclamationTriangle } from "react-icons/bs";
import { BsEmojiFrown } from "react-icons/bs";
import { BsEmojiExpressionless } from "react-icons/bs";
import { FaRegThumbsUp } from "react-icons/fa";
import { MdOutlineGppGood } from "react-icons/md";
import { FaRegGrinStars } from "react-icons/fa";
import { MdStarOutline } from "react-icons/md";
import { MdOutlineStarRate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/BreadCrumb";
import useExpAppraisal from "../../../../hooks/unisol/empAppraisal/useExpAppraisal";

const RatingOverview = () => {
  const [selectedRating, setSelectedRating] = useState(1);
  const navigate = useNavigate();

  const { ratingOverview, getRatingOverview, loading, setRatingOverview } =
    useExpAppraisal();

  const ratingDescriptions = {
    9: {
      title: "Performance frequently does not meet job standards.",
      description:
        "This individual's performance consistently fails to meet the required job standards. There are ongoing challenges with quality, efficiency, or timeliness, which hinder their ability to fulfill the expectations of the role effectively.",
      color: "bg-red-500",
      bgColor: "rgba(254,202,202,0.2)",
      borderColor: "border-red-200",
      icon: <MdOutlineStarRate />,
      text: "text-red-500",
      trend: "Critical",
    },
    8: {
      title: "Performance occasionally does not meet job standards.",
      description:
        "Performance shows inconsistencies with some areas not meeting expected standards. Improvement is needed in specific areas to consistently meet job requirements.",
      color: "bg-orange-500",
      bgColor: "rgba(254,215,170,0.2)",
      borderColor: "border-orange-200",
      icon: <MdStarOutline />,
      text: "text-orange-500",
      trend: "Needs Improvement",
    },
    7: {
      title: "Performance meets minimum job standards.",
      description:
        "Performance adequately meets the basic requirements of the role. Work is completed satisfactorily with minimal supervision required.",
      color: "bg-yellow-500",
      bgColor: "rgba(254, 240, 180,0.2)",
      borderColor: "border-yellow-200",
      icon: <FaRegGrinStars />,
      text: "text-yellow-500",
      trend: "Meets Expectations",
    },
    6: {
      title: "Performance consistently meets job standards.",
      description:
        "Consistently delivers quality work that meets all job requirements. Demonstrates reliability and competence in role responsibilities.",
      color: "bg-blue-500",
      bgColor: "rgba(191, 219, 254,0.2)",
      borderColor: "border-blue-200",
      icon: <MdOutlineGppGood />,
      text: "text-blue-200",
      trend: "Good Performance",
    },
    5: {
      title: "Performance exceeds job standards.",
      description:
        "Performance consistently exceeds expectations. Demonstrates initiative, innovation, and contributes beyond basic job requirements.",
      color: "bg-green-500",
      bgColor: "rgba(200, 249, 216, 0.2)",
      borderColor: "border-green-200",
      icon: <FaRegThumbsUp />,
      text: "text-green-500",
      trend: "Exceeds Expectations",
    },
    4: {
      title: "Performance significantly exceeds job standards.",
      description:
        "Outstanding performance that significantly surpasses job requirements. Shows leadership qualities and serves as a role model for others.",
      color: "bg-green-600",
      bgColor: "rgba(170, 239, 172,0.2)",
      borderColor: "border-green-300",
      icon: <BsEmojiExpressionless />,
      text: "text-green-600",
      trend: "Outstanding",
    },
    3: {
      title: "Performance is exceptional and outstanding.",
      description:
        "Exceptional performance demonstrating mastery of role and significant contribution to team success. Goes above and beyond consistently.",
      color: "bg-emerald-600",
      bgColor: "rgba(100, 231, 183,0.2)",
      borderColor: "border-emerald-300",
      icon: <BsEmojiFrown />,
      text: "text-emerald-600",
      trend: "Exceptional",
    },
    2: {
      title: "Performance is superior and exemplary.",
      description:
        "Superior performance that sets new standards. Demonstrates innovation, leadership, and drives positive change within the organization.",
      color: "bg-teal-600",
      bgColor: "rgba(94, 234, 212,0.2)",
      borderColor: "border-teal-300",
      icon: <BsExclamationTriangle />,
      text: "text-teal-600",
      trend: "Superior",
    },
    1: {
      title: "Performance is extraordinary and industry-leading.",
      description:
        "Extraordinary performance that represents the highest standards of excellence. Consistently delivers exceptional results and influences organizational success.",
      color: "bg-purple-600",
      text: "text-purple-600",
      bgColor: "rgba(216, 180, 254,0.2)",
      borderColor: "border-purple-300",
      trend: "Extraordinary",
      icon: <MdOutlineGppBad />,
    },
  };

  const currentRating = ratingDescriptions[selectedRating];

  const handelRating = (rating) => {
    setRatingOverview(null);
    setSelectedRating(rating);
    getRatingOverview(rating);
    console.log(ratingOverview);
  };

  useEffect(() => {
    getRatingOverview(1);
  }, []);

  return (
    <div>
      <Breadcrumb
        linkText={[
          { text: "Appraisal", href: "/emp/appraisal" },
          { text: "Rating Overview" },
        ]}
      />
      <div className="container mx-auto p-6  bg-[#F0F8FF]">
        {/* Header */}
        <div className="flex items-center shadow-md rounded-xl py-4 mb-5 bg-white">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-white/80"
            onClick={() => navigate("/emp/appraisal")}
          >
            <MdOutlineArrowBackIos size={25} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center pt-2 ">
              Rating Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Performance evaluation and feedback system
            </p>
          </div>
        </div>

        {/* Performance Rating Scale */}
        <Card
          sx={{ boxShadow: 5, borderRadius: "10px" }}
          className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
        >
          <Typography
            sx={{ fontWeight: 500 }}
            className="text-xl px-5 pt-5 font-bold text-gray-800"
            variant="h6"
          >
            Performance Rating Scale:
          </Typography>
          <CardContent>
            <div className="grid grid-cols-9 gap-4 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handelRating(rating)}
                  className={`
                  relative h-14 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg
                  ${
                    selectedRating === rating
                      ? `${ratingDescriptions[rating].color} text-white shadow-xl scale-105`
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                  }
                `}
                >
                  {rating}
                  {selectedRating === rating && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div
                        className={`w-2 h-2 ${ratingDescriptions[rating].color} rotate-45`}
                      ></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rating Details */}
        <Card
          sx={{
            backgroundColor: currentRating.bgColor,
            borderRadius: "10px",
            boxShadow: 7,
            height: "400px",
          }}
          className={`border-0  shadow-lg ${currentRating.bgColor} ${currentRating.borderColor} border-2`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-2xl ${currentRating.text} `}>
                    {currentRating.icon}
                  </span>
                  <span className="text-md font-medium text-gray-600 mr-8">
                    Rating Title:
                  </span>
                  <Badge
                    className={`${currentRating.color} px-4 py-1 rounded-full text-white`}
                  >
                    Score: {selectedRating}/9
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {/* {currentRating.title} */}
                  {loading ? "Loading...." : ratingOverview?.shortdescription}
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-md font-medium text-gray-600 mb-2 block">
                Description:
              </label>
              <div className="bg-white/70 p-4 py-6 rounded-lg border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {loading ? "Loading...." : ratingOverview?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RatingOverview;
