/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import PINK from "../../../assets/images/bg-abstract-blur-pink.png";
import { IoMdClose } from "react-icons/io";
import { RiImageCircleLine } from "react-icons/ri";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa";
import DownloadSalarySlip from "./DownloadSalarySlip";
import { useTheme } from "../../../hooks/theme/useTheme";
import useEmpAttendence from "../../../hooks/unisol/empAttendence/useEmpAttendence";
import { Avatar } from "@mui/material";

const EmpSalarySlipDwnld = ({ onClose, coreHREmployeeDetails }) => {
  console.log("coreHREmployeeDetails", coreHREmployeeDetails);
  const [viewPaySlip, setViewPaySlip] = useState(false);
  const [downloadPayslip, setDownloadPayslip] = useState(false);
  const [selectOption, setSelectOption] = useState(false);
  const [period, setPeriod] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dialogRef = useRef(null);
  const { theme } = useTheme();
  const empId = sessionStorage.getItem("empId");
  const { empById, fetchEmpById } = useEmpAttendence();
  console.log("Data :", empById);

  useEffect(() => {
    fetchEmpById(empId);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dialog when clicking outside the dialog
  useEffect(() => {
    const handleDialogClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleDialogClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDialogClickOutside);
    };
  }, [onClose]);

  console.log("period", period);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="flex justify-center items-center w-full h-full">
        <div
          ref={dialogRef}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-blue-100 animate-fadeInUp overflow-hidden"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-[#FFEBFB] via-[#E8E8FF] to-[#E0C3FC] rounded-t-2xl border-b border-blue-100"
            style={{
              background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
            }}
          >
            <div className="flex items-center gap-3">
              <FaRegFilePdf className="text-[#A259E6] text-2xl" />
              <h1 className="text-xl font-bold text-[#2D006A]">Salary Slip</h1>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded-full shadow transition"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Employee Info */}
          <div className="flex items-center gap-6 px-8 py-6  rounded-b-2xl border-b border-blue-100">
            <div className="h-[70px] w-[70px] flex items-center justify-center rounded-full shadow">
              <Avatar
                src={empById?.photo}
                alt={empById?.fullName}
                sx={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-[#2D006A]">
                {empById?.fullName || "N/A"}
              </h2>
              <div className="text-sm text-gray-600">
                Employee ID: {empById?.employeeId || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                Designation: {empById?.designation || "N/A"}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 py-8 flex flex-col gap-6 bg-white">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-500">
                Current Date:
                <span className="pl-1 font-medium text-[#2D006A]">
                  {new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </span>
              {/* Dropdown */}
              <div className="relative w-[215px] mt-2 pb-14" ref={dropdownRef}>
                <button
                  className="h-[41px] w-full px-4 py-2 rounded-lg border-2 border-[#444344] bg-white flex justify-between items-center text-[#2D006A] font-medium shadow-sm hover:border-[#7C3AED] transition"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  type="button"
                >
                  {period ? period : "Select Period"}
                  <span className="ml-2">▼</span>
                </button>
                {isDropdownOpen && (
                  <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <li
                      className="px-4 py-2 hover:bg-[#F3E8FF] cursor-pointer rounded-t-lg"
                      onClick={() => {
                        setPeriod("6 Months");
                        setSelectOption(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      6 Months
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-[#F3E8FF] cursor-pointer rounded-b-lg"
                      onClick={() => {
                        setPeriod("1 Year");
                        setSelectOption(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      1 Year
                    </li>
                  </ul>
                )}
              </div>
              {/* <button
                className="mt-3 border border-[#A259E6] w-[120px] h-[32px] text-[13px] font-medium text-white rounded-lg shadow hover:scale-105 transition-all"
                style={{ background: theme?.primaryColor || "#4533d1" }}
              >
                Send to Email
              </button> */}
            </div>

            {/* Actions */}
            {selectOption && (
              <div className="flex justify-center gap-6 mt-4">
                <button
                  onClick={() => setViewPaySlip(true)}
                  className="border border-gray-400 px-4  text-black bg-white rounded-lg font-semibold shadow hover:text-red-500 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  View Slip
                </button>
                {viewPaySlip && (
                  <PaySlip
                    onClose={() => setViewPaySlip(false)}
                    employeeByQuery={coreHREmployeeDetails}
                    period={period}
                  />
                )}
                <button
                  onClick={() => setDownloadPayslip(true)}
                  className="border border-[#338C1D] px-6 py-2 text-black rounded-lg font-semibold shadow hover:text-green-600 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  Download Slip
                </button>
                {downloadPayslip && (
                  <DownloadSalarySlip
                    onClose={() => setDownloadPayslip(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpSalarySlipDwnld;
