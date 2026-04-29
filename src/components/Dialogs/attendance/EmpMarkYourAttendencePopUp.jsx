import { Dialog, DialogContent } from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
  // FaUmbrellaBeach,
  FaHourglassHalf,
  // FaExclamationTriangle,
  FaSun,
  FaMoon
} from "react-icons/fa";
// import { GiHourglass } from "react-icons/gi";
import { BsArrowRight } from "react-icons/bs";
import useEmpAttendence from "../../../hooks/unisol/empAttendence/useEmpAttendence";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const EmpMarkYourAttendencePopUp = ({ openDialog, closeDialog }) => {
  const [open, setOpen] = useState(openDialog);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { markAttendence, loading } = useEmpAttendence();
  const { width, height } = useWindowSize();

  const empId = sessionStorage.getItem("empId");
  const now = new Date();

  // Format date
  const todayDate = now.toLocaleDateString("en-GB", {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  const currentTime = now.toLocaleTimeString("en-GB", {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Attendance Period
  const attendanceStartTime = new Date();
  attendanceStartTime.setHours(9, 0, 0, 0);

  const attendanceEndTime = new Date();
  attendanceEndTime.setHours(10, 30, 0, 0);

  const remainingTimeMs = attendanceEndTime - now;
  const remainingHours = Math.floor(remainingTimeMs / 3600000);
  const remainingMinutes = Math.floor((remainingTimeMs % 3600000) / 60000);
  const isTimeOver = remainingTimeMs <= 0;

  const newDate = now.toISOString().split("T")[0];

  const handleClose = () => {
    setOpen(false);
    closeDialog();
  };

  const data = {
    employeeId: empId,
    date: newDate,
    status: "",
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleConfirm = async () => {
    if (!selectedStatus) return;

    setIsSubmitting(true);
    data.status = selectedStatus;

    try {
      await markAttendence(data);
      sessionStorage.setItem("attendanceStatus", selectedStatus);

      if (selectedStatus === "Present") {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          handleClose();
        }, 2000);
      } else {
        handleClose();
      }
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    {
      value: "Present",
      label: "Present",
      color: "#0db980ff",
      bgColor: "bg-green-500",
    },
    {
      value: "Absent",
      label: "On Leave",
      color: "#f50b0bff",
      bgColor: "bg-red-500",
    }
  ];

  const containerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.1 }
    })
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") handleClose();
        }}
        fullWidth
        maxWidth="sm"
        disableBackdropClick
        PaperProps={{
          sx: {
            overflow: "hidden",
            backgroundColor: "white",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            maxHeight: "calc(100vh - 64px)",
            borderRadius: '1rem',
            '& .MuiDialog-container': {
              '& .MuiPaper-root': {
                margin: '1rem',
                width: '100%',
                maxWidth: '28rem',
                borderRadius: '1rem !important',
              },
            },
          },
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
        >
          <DialogContent className="p-0 overflow-auto max-h-[calc(100vh-100px)]">
            <div className="p-6 md:p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3 relative z-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  Mark Attendance
                </h2>
              </div>

              {/* Time Progress */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FaSun className="text-yellow-500" />
                    <span className="text-gray-700 font-medium">9:00 AM</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full ${isTimeOver ? 'bg-red-100' : 'bg-green-100'}`}>
                    <span className={`text-sm font-semibold ${isTimeOver ? 'text-red-600' : 'text-green-600'}`}>
                      {isTimeOver ? 'Time Over' : `${remainingHours}h ${remainingMinutes}m left`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">10:30 AM</span>
                    <FaSun className="text-yellow-500" />
                  </div>
                </div>
              </motion.div>

              {/* Status Selection */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaHourglassHalf className="text-yellow-500" />
                  How are you today?
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {statusOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      custom={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusSelect(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all shadow-sm relative ${option.bgColor} ${selectedStatus === option.value
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200 hover:border-blue-300'
                        }`}
                    >
                      <span className="font-bold text-white">{option.label}</span>
                      {selectedStatus === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center"
                        >
                          <FaCheckCircle className="text-blue-500 text-xs" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 relative z-10 shadow-sm border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FaCalendarAlt className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Date</p>
                      <p className="text-gray-800 font-semibold">
                        {todayDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <FaClock className="text-purple-600" />
                    </motion.div>
                    <div>
                      <p className="text-gray-500 text-xs">Time</p>
                      <p className="text-gray-800 font-semibold">
                        {currentTime}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all sm:flex-1"
                >
                  Later
                </motion.button>

                <motion.button
                  disabled={!selectedStatus || isSubmitting}
                  whileHover={selectedStatus ? { scale: 1.02 } : {}}
                  whileTap={selectedStatus ? { scale: 0.98 } : {}}
                  onClick={handleConfirm}
                  className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all sm:flex-1 ${selectedStatus
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Marking...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm</span>
                      <BsArrowRight />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </DialogContent>
        </motion.div>
      </Dialog>
    </>
  );
};

export default EmpMarkYourAttendencePopUp;