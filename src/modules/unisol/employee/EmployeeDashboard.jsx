/* eslint-disable no-unused-vars */
import { CgLoadbarDoc } from "react-icons/cg";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuTicket } from "react-icons/lu";
import { RxCalendar } from "react-icons/rx";
import { GrTicket } from "react-icons/gr";
import { BsPerson } from "react-icons/bs";
import { PiHandWavingFill, PiSparkleFill } from "react-icons/pi";
import { FaBirthdayCake, FaFire, FaRegSmileWink } from "react-icons/fa";
import { TbBellRingingFilled } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import EmpDashFemaleIconImage from "../../../assets/images/empDashFemaleIcon.png";
import EmpDashMaleIconImage from "../../../assets/images/empDashMaleIcon.png";
import { useEffect, useState } from "react";
import EmpSalarySlipDwnld from "../../../components/Dialogs/paySlip/EmpSalarySlipDwnld";
import CompanyHoliday from "../../../components/Dialogs/CompanyHoliday";
import { Link, useNavigate } from "react-router-dom";
import EmpLeaveStatus from "../../../components/Dialogs/attendance/EmpLeaveStatus";
// import EmpMarkAttendence from "../../../components/Dialogs/attendance/EmpMarkAttendence";
import EmpMarkYourAttendencePopUp from "../../../components/Dialogs/attendance/EmpMarkYourAttendencePopUp";
import useCoreHR from "../../../hooks/unisol/coreHr/useCoreHR";
import { useTheme } from "../../../hooks/theme/useTheme";
import useDashboard from "../../../hooks/unisol/hrDashboard/useDashborad";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const defaultEventAvatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const EmployeeDashboard = () => {
  const navigator = useNavigate();
  const { theme } = useTheme();
  const { width, height } = useWindowSize();
  const [holiday, setHoliday] = useState(false);
  // const [salarySlip, setSalarySlip] = useState(false);
  // const [leaveStatus, viewLeaveStatus] = useState(false);
  // const [markAttendenceDialog, setMarkAttendenceDialog] = useState(false);
  const [openMarkYourAttendance, setOpenMarkYourAttendance] = useState(false);
  const [openAbsentPopup, setOpenAbsentPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [pulseAnimation, setPulseAnimation] = useState(true);

  const attendanceStatus = sessionStorage.getItem("attendanceStatus");
  const { fetchCoreHREmployeeById, coreHREmployeeDetails } = useCoreHR();
  const { fetchAllSpecialDay, specialDays } = useDashboard();

  const empName = sessionStorage.getItem("name");
  const empId = sessionStorage.getItem("empId");

  // Dynamic greetings based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("🌅 Good Morning");
    else if (hour < 17) setGreeting("☀️ Good Afternoon");
    else setGreeting("🌙 Good Evening");

    // Start with a little celebration
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Stop pulse animation after 5 seconds
    setTimeout(() => setPulseAnimation(false), 5000);
  }, []);

  useEffect(() => {
    fetchCoreHREmployeeById(empId);
    fetchAllSpecialDay();

    // Check if we should show the attendance popup
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check if current time is between 9:00 AM and 8:00 PM
    const isWithinAllowedTime = 
      (currentHour > 9 || (currentHour === 9 && currentMinute >= 0)) &&
      (currentHour < 10 || (currentHour === 10 && currentMinute <= 30));

    // Only show popup if status is not marked and within allowed time
    if (attendanceStatus === 'Not Marked' && isWithinAllowedTime) {
      setOpenMarkYourAttendance(true);
    }

    if (attendanceStatus === 'Absent') {
      setOpenAbsentPopup(true);
    }
  }, [empId, attendanceStatus]);

  const todaySpecialEvents = specialDays?.todaySpecialEvents || [];
  const upcomingSpecialEvents = specialDays?.upcomingSpecialEvents || [];

  // Animation variants
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

  // Enhanced latest updates with interactive features
  const latestUpdates = [
    {
      id: 1,
      text: "Reminder: The project report for the XYZ client is due on August 25, 2024. Please ensure all tasks are completed and submitted on time.",
      read: false,
      priority: "high"
    },
    {
      id: 2,
      text: "You have been assigned a new task: 'Prepare the Q3 Sales Presentation.' The deadline for this task is August 30, 2024.",
      read: false,
      priority: "medium"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0 relative">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      {/* <Breadcrumb linkText={[{ text: "Dashboard" }]} /> */}

      <motion.div
        className="w-full flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section with Animation */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-[#E8E8FF] via-[#F0F0FF] to-[#E8E8FF] w-full rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 px-8 py-6 items-center justify-between relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-white/20"
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 10}%`,
                }}
              />
            ))}
          </div>

          <div className="flex flex-col items-start h-full justify-center gap-2 relative z-10">
            <div className="flex items-center text-[#01008A] text-2xl md:text-3xl font-bold gap-2">
              <span className="flex items-center">
                {greeting}, {empName}
                {/* <PiHandWavingFill className="text-yellow-500 animate-wiggle" /> */}
              </span>
            </div>
            <h1 className="text-[#01008A] text-base md:text-xl font-medium flex items-center gap-2">
              <PiSparkleFill className="text-purple-500" />
              You can manage your things from here
            </h1>
          </div>

          <div className="relative flex justify-center items-center mt-4 md:mt-0">
            <motion.h2
              className="text-[32px] sm:text-[50px] md:text-[65px] font-bold text-[#7676DC] drop-shadow-lg pr-10"
              animate={{ scale: pulseAnimation ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Welcome
            </motion.h2>
            <motion.img
              src={EmpDashFemaleIconImage}
              className="absolute left-[5%] sm:left-[-28%] -top-10 w-10 sm:w-14 md:w-20"
              alt="female icon"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.img
              src={EmpDashMaleIconImage}
              className="absolute right-[8%] sm:right-[-6%] -top-4 w-10 sm:w-14 md:w-20"
              alt="male icon"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Dashboard Cards Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-50 px-4 py-6 rounded-2xl w-full shadow-lg relative"
          style={{
            background: `linear-gradient(135deg, #f5f9fc 0%, ${theme.highlightColor}15 100%)`,
          }}
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "leave",
                icon: <IoDocumentTextOutline />,
                title: "Leave Management",
                description: "Submit leave requests and track approval status.",
                color: "#EE9211",
                bgColor: "#FFF7ED",
                hoverBg: "#FFE4CC",
                action: "Apply",
                onClick: () => navigator("/EmployeeDashboard/emp/leavemanagement"),
                secondaryAction: {
                  text: "View Leave Status",
                  onClick: () => navigator(`/EmployeeDashboard/emp/leavemanagement/leaveStatus/${empId}`)
                }
              },
              {
                id: "attendance",
                icon: <CgLoadbarDoc />,
                title: "Attendance",
                description: "Mark your daily attendance and view your attendance history.",
                color: "#17BCF3",
                bgColor: "#EBFAFF",
                hoverBg: "#D1F3FF",
                action: "View History",
                onClick: () => navigator("/EmployeeDashboard/emp/attendanceHistory"),
                highlight: attendanceStatus === "Not Marked"
              },
              {
                id: "salary",
                icon: <LuTicket />,
                title: "Salary Slip",
                description: "View and download your salary slips.",
                color: "#E32CBC",
                bgColor: "#FFEBFB",
                hoverBg: "#FFD6F5",
                action: "Download",
                onClick: () => navigator(`/EmployeeDashboard/downloadPaySlip/${empId}`)
              },
              {
                id: "calendar",
                icon: <RxCalendar />,
                title: "Calendar",
                description: "Check upcoming events, meetings, and important dates.",
                color: "#E41E1E",
                bgColor: "#FFEBEB",
                hoverBg: "#FFD6D6",
                action: "View",
                onClick: () => navigator(`/EmployeeDashboard/calender/${empId}`)
              },
              {
                id: "holiday",
                icon: <GrTicket />,
                title: "Holiday",
                description: "View the list of company holidays and download the holiday schedule.",
                color: "#3229E1",
                bgColor: "#EFEDFF",
                hoverBg: "#D6D1F6",
                action: "View",
                onClick: () => setHoliday(true)
              },
              {
                id: "expense",
                icon: <BsPerson />,
                title: "Expense",
                description: "Track and manage your expenses. Submit new claims and view recent transactions.",
                color: "#837425",
                bgColor: "#FFFBE5",
                hoverBg: "#FFF2B2",
                action: "Manage",
                onClick: () => navigator("/EmployeeDashboard/emp/expense")
              }
            ].map((card) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setActiveCard(card.id)}
                onMouseLeave={() => setActiveCard(null)}
                className="relative"
              >
                {card.highlight && (
                  <motion.div
                    className="absolute -top-2 -right-2 z-10"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-xs text-white">!</span>
                    </div>
                  </motion.div>
                )}

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

                  {card.secondaryAction && (
                    <button
                      className="text-sm font-semibold px-3 py-2 rounded-lg w-fit mt-auto hover:underline flex items-center gap-2"
                      style={{ color: card.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        card.secondaryAction.onClick();
                      }}
                    >
                      {card.secondaryAction.text}
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </button>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Announcements + Birthday Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 w-full">
            {/* Latest Announcements Section */}
            <motion.div
              variants={itemVariants}
              className="w-full bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 border border-[#F3F3F3]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xl font-bold text-[#4B4B7C]">
                  <TbBellRingingFilled className="text-2xl text-purple-500" />
                  Latest Announcements
                </div>
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <AnimatePresence>
                  {latestUpdates.map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${update.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4'
                        }`}
                      style={{
                        borderLeftColor: update.priority === 'high' ? '#EF4444' :
                          update.priority === 'medium' ? '#F59E0B' : '#10B981'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {!update.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {update.priority === 'high' && (
                              <FaFire className="text-red-500 text-sm" />
                            )}
                            <p className={`text-sm ${update.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                              {update.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Special Days Section */}
            <motion.div
              variants={itemVariants}
              className="w-full bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl shadow-xl p-6 flex flex-col gap-4 border border-orange-100"
            >
              <div className="flex items-center gap-3 text-xl font-bold text-[#FF7A00]">
                <FaBirthdayCake className="text-2xl" />
                Special Days Coming Up
                <FaRegSmileWink className="text-xl text-pink-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#FF7A00]">
                    <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span>
                    Today's Special Events
                  </div>
                  {todaySpecialEvents.length > 0 ? (
                    todaySpecialEvents.map((event, index) => (
                      <motion.div
                        key={event._id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          <img
                            src={event?.image || defaultEventAvatar}
                            alt={event?.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-orange-200"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                            <span className="text-xs text-white">🎉</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {event?.name || "Special Celebration"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {event?.eventCelebration || "Celebration"}
                          </p>
                          <p className="text-xs text-gray-500">
                            📅 {new Date(event?.eventDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 italic">
                        No special events today
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        But every day is special with you! 😊
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#FF7A00]">
                    <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse"></span>
                    Upcoming Events
                  </div>
                  {upcomingSpecialEvents.length > 0 ? (
                    upcomingSpecialEvents.map((event, index) => (
                      <motion.div
                        key={event._id || index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          <img
                            src={event?.image || defaultEventAvatar}
                            alt={event?.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-orange-200"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-xs text-white">⭐</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {event?.name || "Upcoming Celebration"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {event?.eventCelebration || "Exciting Event"}
                          </p>
                          <p className="text-xs text-gray-500">
                            📅 {new Date(event?.eventDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                          <div className="mt-1 text-xs text-blue-600 font-medium">
                            Coming soon!
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 italic">
                        No upcoming events
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Stay tuned for exciting updates!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {openMarkYourAttendance && attendanceStatus === "Not Marked" && (
              <EmpMarkYourAttendencePopUp
                openDialog={openMarkYourAttendance}
                closeDialog={() => setOpenMarkYourAttendance(false)}
              />
            )}

            {openAbsentPopup && attendanceStatus === "Absent" && (
              <EmpLeaveStatus
                openDialog={openAbsentPopup}
                closeDialog={() => setOpenAbsentPopup(false)}
              />
            )}

            {holiday && (
              <CompanyHoliday
                onClose={() => setHoliday(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmployeeDashboard;
