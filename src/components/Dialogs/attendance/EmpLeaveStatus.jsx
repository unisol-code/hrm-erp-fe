import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import { FaCalendarTimes, FaUserClock, FaInfoCircle, FaHandPaper } from "react-icons/fa";
import { useTheme } from '../../../hooks/theme/useTheme';
import { BsCloudRainHeavyFill } from "react-icons/bs";
import { GiSunCloud } from "react-icons/gi";

const EmpLeaveStatus = ({ openDialog, closeDialog }) => {
    const [open, setOpen] = useState(openDialog);
    const { theme } = useTheme();
    const photo = sessionStorage.getItem("profile");
    const empName = sessionStorage.getItem("name");

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    useEffect(() => {
        setOpen(openDialog);
    }, [openDialog]);

    const handleClose = () => {
        setOpen(false);
        closeDialog();
    };

    const containerVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                type: "spring",
                stiffness: 100
            }
        })
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    overflow: "hidden",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                    borderRadius: '1.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiDialog-container': {
                        '& .MuiPaper-root': {
                            margin: '1rem',
                            width: '100%',
                            maxWidth: '32rem',
                            borderRadius: '1.75rem !important',
                        },
                    },
                },
            }}
        >
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-100/30 to-purple-100/30 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-pink-100/20 to-yellow-100/20 blur-2xl" />

                <DialogContent className="p-0">
                    {/* Header */}
                    <div
                        className="relative h-24 flex items-center justify-between px-6 pt-2 pb-6"
                        style={{ backgroundColor: theme?.primaryColor || '#4F46E5' }}
                    >
                        {/* Floating cloud icons */}
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-4 left-4 text-white/20"
                        >
                            <GiSunCloud size={24} />
                        </motion.div>
                        <motion.div
                            animate={{ x: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                            className="absolute top-6 right-20 text-white/20"
                        >
                            <BsCloudRainHeavyFill size={20} />
                        </motion.div>

                        <div className="flex items-center gap-3 relative z-10">
                            <motion.div
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                                className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg"
                            >
                                <FaCalendarTimes className="text-white text-xl" />
                            </motion.div>
                            <div>
                                <h2 className="text-xl font-bold text-white drop-shadow-lg">
                                    Leave Status
                                </h2>
                                <p className="text-white/80 text-sm mt-0.5">{formattedDate}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="relative z-10 text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200 hover:scale-110 active:scale-95"
                        >
                            <IoMdClose size={22} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="p-6 space-y-4 relative">
                        {/* Profile Card */}
                        <motion.div
                            custom={0}
                            variants={itemVariants}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-30 animate-pulse" />
                                    <img
                                        src={photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                        alt="Profile"
                                        className="relative w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center shadow-md"
                                    >
                                        <FaHandPaper className="text-white text-xs" />
                                    </motion.div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800">{empName}</h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Your attendance status for today
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Status Message Card */}
                        <motion.div
                            custom={1}
                            variants={itemVariants}
                            className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 rounded-2xl p-6 border-2 border-red-100 shadow-lg relative overflow-hidden"
                        >
                            {/* Animated background dots */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-200/20 to-orange-200/20 rounded-full -translate-y-10 translate-x-10" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-red-200/20 to-orange-200/20 rounded-full translate-y-8 -translate-x-8" />

                            <div className="flex flex-col items-center text-center gap-4 relative z-10">
                                <motion.div
                                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-orange-100 flex items-center justify-center shadow-md"
                                >
                                    <FaUserClock className="text-red-500 text-2xl" />
                                </motion.div>

                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-red-700">
                                        You are on Leave Today
                                    </h3>
                                    
                                    <div className="bg-white/80 rounded-xl p-5 shadow-inner border border-red-100">
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <FaInfoCircle className="text-red-400" />
                                            <p className="text-red-600 font-medium">
                                                Attendance Marked as "Absent"
                                            </p>
                                        </div>
                                        
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-gray-700 text-base leading-relaxed px-2"
                                        >
                                            Please connect with admin to mark present if needed.
                                        </motion.p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-3 left-3 text-red-200 text-2xl"
                            >
                                ❤
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                className="absolute bottom-3 right-3 text-orange-200 text-2xl"
                            >
                                💫
                            </motion.div>
                        </motion.div>
                    </div>
                </DialogContent>
            </motion.div>
        </Dialog>
    );
};

export default EmpLeaveStatus;