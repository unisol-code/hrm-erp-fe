import { BsPerson } from "react-icons/bs";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdEmojiEvents } from "react-icons/md"; // 🏆
import { AiOutlineTrophy } from "react-icons/ai"; // 🏅
import { FaAward } from "react-icons/fa"; // 🎖
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Reusable Card Component
const AchievementCard = ({ icon, title, text, link, color, hoverBg, onClick }) => {
  return null; // This component is no longer needed
};



const EmployeeAchievement = () => {
  const { theme } = useTheme();
  const [activeCard, setActiveCard] = useState(null);
  const navigator = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  const cardHoverVariants = {
    hover: {
      scale: 1.03,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    },
    tap: { scale: 0.98 }
  };
  const achievementCards = [
  {
    id: "employee-project",
    icon: <FaAward />,
    title: "Employee's Project",
    description: "Check recent employee accomplishments and milestones.",
    color: "#EE9211",
    bgColor: "#FFF7ED",
    hoverBg: "#FFE4CC",
   
    onClick: () => navigator("/hr/employeeAchievement/empTrainingList")
  },
  {
    id: "reward-program",
    icon: <MdEmojiEvents />,
    title: "Reward Program",
    description: "View rewards, nominations, and recognition details.",
    color: "#17BCF3",
    bgColor: "#EBFAFF",
    hoverBg: "#D1F3FF",
    
    onClick: () => navigator("/hr/employeeAchievement/employeeRewards/rewardProgramList")
  },
  {
    id: "employee-Appraisal",
    icon: <AiOutlineTrophy />,
    title: "Employee Appraisal",
    description: "Explore employee appraisals and performance evaluations.",
    color: "#8E44AD",
    bgColor: "#F3EBFF",
    hoverBg: "#E1D4F5",
    
    onClick: () => navigator("/hr/employeeAchievement/appraisalList")
  }
];

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 sm:pt-0 ">
      <Breadcrumb
        linkText={[
          { text: "Employee Achievement" },
        ]}
      />

      <div className="w-full flex flex-col gap-3">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#E8E8FF] to-[#F3F3FF] w-full rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 px-8 py-4 items-center justify-between">
          <div className="flex flex-col items-start h-full justify-center gap-2">
            <div className="flex items-center text-[#01008A] text-2xl md:text-3xl font-bold gap-2">
              Employee Achievements & Rewards
            </div>
            <h1 className="text-[#01008A] text-base md:text-xl font-medium">
              Overview of employee progress, training completions, and
              recognitions.
            </h1>
          </div>
        </div>

        {/* Cards Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-50 px-6 py-6 rounded-2xl w-full shadow-lg"
          style={{
            background: `linear-gradient(135deg, #f5f9fc 0%, ${theme.highlightColor}15 100%)`,
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievementCards.map((card) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setActiveCard(card.id)}
                onMouseLeave={() => setActiveCard(null)}
                className="relative"
              >
                <motion.div
                  variants={cardHoverVariants}
                  className={`bg-white rounded-2xl shadow-lg flex flex-col min-h-[220px] p-6 border-2 transition-all duration-300 cursor-pointer ${activeCard === card.id ? 'shadow-2xl' : 'shadow-md'
                    }`}
                  style={{
                    borderColor: activeCard === card.id ? card.color : '#F3F3F3',
                    background: activeCard === card.id ? card.hoverBg : card.bgColor
                  }}
                  onClick={card.onClick}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: activeCard === card.id ? [0, 360] : 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl"
                        style={{ color: card.color }}
                      >
                        {card.icon}
                      </motion.div>
                      <span className="font-bold" style={{ color: card.color }}>
                        {card.title}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm font-bold px-4 py-1 rounded-lg"
                      style={{
                        color: card.color,
                        backgroundColor: `${card.color}15`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        card.onClick();
                      }}
                    >
                      {card.action}
                    </motion.button>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 flex-grow">
                    {card.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeAchievement;
