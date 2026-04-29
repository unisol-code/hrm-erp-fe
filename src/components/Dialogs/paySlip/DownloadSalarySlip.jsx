import React, { useRef, useState } from "react";
import PINK from "../../../assets/images/bg-abstract-blur-pink.png";
import { IoMdClose } from "react-icons/io";
import { RiImageCircleLine } from "react-icons/ri";
import {
  FaRegIdCard,
  FaUserTie,
  FaBuilding,
  FaRupeeSign,
  FaMoneyCheckAlt,
  FaMinusCircle,
  FaCalendarAlt,
  FaDownload,
} from "react-icons/fa";
import SuccessfullPaySlipGenerate from "./SuccessfullPaySlipGenerate";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import HRMLogo from "../../../assets/images/HRM logo.png";
import { useTheme } from "../../../hooks/theme/useTheme";

const DownloadSalarySlip = ({ onClose }) => {
  const contentRef = useRef();
  const generatePdf = () => {
    // Create a new instance of jsPDF
    const doc = new jsPDF({
      orientation: "p",
      unit: "px",
      format: "a4",
    });

    // Add content to the PDF
    doc.html(contentRef.current, {
      callback: (doc) => {
        doc.save("SalaryDetails.pdf"); // Save the PDF
      },
      x: 10,
      y: 10,
    });
  };

  const [paySlipGenerate, setPaySlipGenerate] = useState(false);

  const handlePayslipGenerate = () => {
    setPaySlipGenerate(true);
  };

  const { theme } = useTheme();

  return (
    <div className="fixed inset-0  bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="h-screen w-full flex justify-center items-center">
        <div className="w-[95vw] max-w-[900px] mt-5 mb-5 h-[680px] overflow-auto scrollbar-hide bg-white rounded-2xl shadow-2xl border border-gray-200 relative">
          {/* Gradient Header with Logo and Icon */}
          <div
            className="w-full h-[90px] flex items-center justify-between px-8 rounded-t-2xl shadow-md relative"
            style={{
              background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
            }}
          >
            <div className="flex items-center gap-3">
              <img
                src={HRMLogo}
                alt="Logo"
                className="h-12 w-12 rounded-full shadow-md border border-white bg-white object-contain"
              />
              
              <h1 className="text-2xl font-bold text-gray-800 tracking-wide drop-shadow">
                Payslip Details
              </h1>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-red-100 p-2 rounded-full transition-colors duration-200"
            >
              <IoMdClose
                size={28}
                className="text-gray-700 hover:text-red-500"
              />
            </button>
          </div>

          <div
            ref={contentRef}
            className="px-8 py-6 rounded-b-2xl min-h-[500px]"
          >
            <div className="text-center mb-6">
              <h1 className="text-4xl font-semibold mb-2 text-[#4f4e4e] tracking-wider  flex items-center justify-center gap-2">
                
                PAY SLIP
              </h1>
              <p className="text-lg text-gray-500 font-medium flex items-center justify-center gap-2">
                <FaCalendarAlt className="inline-block mb-1" />
                For the period:{" "}
                <span className="font-semibold text-gray-700">Six month's</span>
              </p>
            </div>

            {/* Name, Date */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 flex items-center gap-1">
                  <FaUserTie />
                  Name:
                </label>
                <input
                  type="text"
                  className=" ml-1 outline-none bg-transparent font-medium text-gray-800 "
                  readOnly
                  value="Arpit Deshpande"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 flex items-center gap-1">
                  <FaCalendarAlt />
                  Date:
                </label>
                <input
                  type="text"
                  className=" ml-1 outline-none bg-transparent font-medium text-gray-800 w-32"
                  readOnly
                  value="20-01-2025"
                />
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white/80 rounded-xl shadow-xl p-6 border border-gray-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FaRegIdCard className="text-gray-700" />
                    <span className="block text-gray-500 font-medium">
                      Employee ID
                    </span>
                  </div>
                  <span className="block text-lg font-semibold text-gray-800 ml-7">
                    E1245
                  </span>
                  <div className="flex items-center gap-2 mt-4">
                    <FaBuilding className="text-gray-700" />
                    <span className="block text-gray-500 font-medium">
                      Department
                    </span>
                  </div>
                  <span className="block text-lg font-semibold text-gray-800 ml-7">
                    Sales
                  </span>
                  <div className="flex items-center gap-2 mt-4">
                    <FaUserTie className="text-gray-700" />
                    <span className="block text-gray-500 font-medium">
                      Position
                    </span>
                  </div>
                  <span className="block text-lg font-semibold text-gray-800 ml-7">
                    Sales Manager
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="text-gray-700" />
                    <span className="block text-gray-500 font-medium">
                      Pay Rate
                    </span>
                  </div>
                  <span className="block text-lg font-semibold text-gray-800 ml-7">
                    ₹70,000 per month
                  </span>
                  <div className="flex items-center gap-2 mt-4">
                    <FaMoneyCheckAlt className="text-gray-700" />
                    <span className="block text-gray-500 font-medium">
                      Gross Salary
                    </span>
                  </div>
                  <span className="block text-lg font-semibold text-gray-800 ml-7">
                    ₹70,000
                  </span>
                  <div className="flex items-center gap-2 mt-4">
                    <FaMoneyCheckAlt className="text-gray-700" />
                    <span className="block text-gray-500 font-medium">
                      Net Salary
                    </span>
                  </div>
                  <span className="block text-lg font-semibold text-gray-800 ml-7">
                    ₹50,000
                  </span>
                </div>
              </div>
              {/* Deductions Section */}
              <div className="mt-8 grid grid-cols-2 gap-6 border-t pt-6 border-gray-200">
                <div className="flex items-center gap-2">
                  {/* <FaMinusCircle className="text-red-600" /> */}
                  <span className="block text-gray-500 font-medium">
                    Deductions:
                  </span>
                  <span className="block text-lg font-semibold text-red-600 ml-3">
                    ₹5,000
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <FaMinusCircle className="text-red-500" /> */}
                  <span className="block text-gray-500 font-medium">
                    Other Deductions:
                  </span>
                  <span className="block text-lg font-semibold text-red-500 ml-3">
                    ₹15,000
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-9 mb-9">
            <button
              className="border border-gray-400 px-4 py-2 text-black bg-white rounded-lg font-semibold shadow hover:text-red-500 hover:scale-105 transition-all duration-200 flex items-center gap-2"
              onClick={onClose}
            >
              <IoMdClose />
              Cancel
            </button>
            <button
              className="border border-[#338C1D] px-6 py-2 text-black rounded-lg font-semibold shadow hover:text-green-600 hover:scale-105 transition-all duration-200 flex items-center gap-2"
              onClick={handlePayslipGenerate}
            >
              <FaDownload />
              Generate Payslip
            </button>
          </div>
          {paySlipGenerate && (
            <SuccessfullPaySlipGenerate
              onClose={onClose}
              paySlipGenrate={generatePdf}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default DownloadSalarySlip;
