/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, forwardRef, useMemo } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import SuccessfullPaySlipGenerate from "./SuccessfullPaySlipGenerate";
import { useTheme } from "../../../hooks/theme/useTheme";
import UnisolLogoImage from "../../assets/images//unisolLogoImg.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useEmployee from "../../../hooks/unisol/onboarding/useEmployee";
import { set } from "lodash";

const PaySlip = forwardRef(({ onClose, employeeByQuery, period }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [paySlipGenerate, setPaySlipGenerate] = useState(false);
  const [newEmp, setNewEmp] = useState({});
  console.log(employeeByQuery);

  const theme = useTheme();
  console.log("logo", theme?.theme.logoImage, theme);

  const dropdownRef = useRef(null);
  console.log("employeeByQuery", employeeByQuery);
  let payslipData = {
    earnings: {
      BasicSalary: employeeByQuery?.employee?.basicSalary || "N/A",
      HouseRentAllowance:
        employeeByQuery?.employee?.houseRentAllowance || "N/A",
      SpecialAllowance: employeeByQuery?.employee?.SpecialAllowance || "N/A",
      StatutoryBonus: employeeByQuery?.employee?.statutoryBonus || "N/A",
      LtaAllowance: employeeByQuery?.employee?.LTAAllowance || "N/A",
      Incentive1: employeeByQuery?.employee?.LTAAllowance || "N/A",
      Incentive2: employeeByQuery?.employee?.OtherEarning2 || "N/A",
      Incentive3: employeeByQuery?.employee?.OtherEarning3 || "N/A",
    },
    deductions: {
      IncomeTax: employeeByQuery?.employee?.incomeTaxDeduction || "N/A",
      ProfessionalTax: employeeByQuery?.employee?.professionalTax || "N/A",
      ProvidentFund: employeeByQuery?.employee?.pfAccountNumber || "N/A",
      AdvanceLoanDeduction:
        employeeByQuery?.employee?.advanceLoanDeductions || "N/A",
      OtherDeduction2: employeeByQuery?.employee?.OtherDeduction2 || "N/A",
      OtherDeduction3: employeeByQuery?.employee?.OtherDeduction3 || "N/A",
    },
    reimbursements: {
      ExpenseReimbursement1:
        employeeByQuery?.employee?.reimbursements[0] || "N/A",
      ExpenseReimbursement2:
        employeeByQuery?.employee?.reimbursements[1] || "N/A",
    },
    employeeDetails: {
      EmployeeName: employeeByQuery?.employee?.fullName || "N/A",
      Designation: employeeByQuery?.employee?.designation || "N/A",
      EmployeeId: employeeByQuery?.employee?.employeeId || "N/A",
      DateOfJoining: employeeByQuery?.employee?.createdAt
        ? new Date(employeeByQuery?.employee?.createdAt).toLocaleDateString(
            "en-GB"
          )
        : "N/A",
      Department: employeeByQuery?.employee?.department || "N/A",
      Location: employeeByQuery?.employee?.currentCity || "N/A",
      PAN: employeeByQuery?.employee?.panCard || "N/A",
      BankName: employeeByQuery?.employee?.bankName || "N/A",
      BankAccountNo: employeeByQuery?.employee?.bankAccountNumber || "N/A",
      PfAccountNumber: employeeByQuery?.employee?.pfAccountNumber || "N/A",
      UANNumber: employeeByQuery?.employee?.UANNumber || "N/A",
      DaysWorked: employeeByQuery?.employee?.workingDays || "N/A",
      PayDate: employeeByQuery?.employee?.updatedAt
        ? new Date(employeeByQuery?.employee?.updatedAt).toLocaleDateString(
            "en-GB"
          )
        : "N/A",
    },
  };

  useEffect(() => {
    setNewEmp(employeeByQuery);
  }, [employeeByQuery]);
  // Calculate totals
  const calculateTotals = () => {
    const safeSum = (arr) =>
      arr.reduce((sum, val) => sum + (isNaN(val) ? 0 : Number(val)), 0);

    const grossEarnings = safeSum(Object.values(payslipData?.earnings || {}));
    const totalDeductions = safeSum(
      Object.values(payslipData.deductions || {})
    );
    const totalReimbursements = safeSum(
      Object.values(payslipData.reimbursements || {})
    );

    return {
      grossEarnings,
      totalDeductions,
      totalReimbursements,
      netPayable: grossEarnings - totalDeductions + totalReimbursements,
    };
  };

  // Convert number to words
  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    if (num === 0) return "Zero";

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100)
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + convertLessThanThousand(n % 100) : "")
      );
    };

    const convert = (n) => {
      if (n === 0) return "Zero";
      let result = "";
      if (n >= 10000000) {
        result += convertLessThanThousand(Math.floor(n / 10000000)) + " Crore ";
        n %= 10000000;
      }
      if (n >= 100000) {
        result += convertLessThanThousand(Math.floor(n / 100000)) + " Lakh ";
        n %= 100000;
      }
      if (n >= 1000) {
        result += convertLessThanThousand(Math.floor(n / 1000)) + " Thousand ";
        n %= 1000;
      }
      if (n > 0) {
        result += convertLessThanThousand(n);
      }
      return result.trim();
    };

    return convert(Math.floor(num)) + " Rupees Only";
  };

  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const totals = calculateTotals();
  const amountInWords = numberToWords(totals.netPayable);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace("₹", "₹ ");
  };
  const payslipRef = React.useRef(null);
  console.log(payslipData);
  return (
    <div className="fixed w-full inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={payslipRef}
        className="rounded-lg w-[900px] h-[650px] mx-auto border-2 border-gray-300 shadow-lg bg-white overflow-hidden"
      >
        <div className="h-full p-6 overflow-y-scroll">
          {/* Header Controls */}
          <div className="flex justify-end items-center space-x-4 mb-4">
            <button
              id="downloadBtn1"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <MdOutlineFileDownload size={32} className="cursor-pointer" />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute flex items-center rounded-lg z-50"
              >
                <div className="space-y-3">
                  <button
                    id="downloadBtn2"
                    className="flex items-center font-semibold px-4 py-2 text-black bg-[#FFCFCF] rounded-xl"
                    onClick={() => setPaySlipGenerate(true)}
                  >
                    PDF
                    <MdOutlineFileDownload size={24} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            <button id="downloadBtn3" onClick={onClose}>
              <IoMdClose size={32} className="cursor-pointer" />
            </button>
          </div>
          {/* Main Content */}
          <div className="max-w-4xl mx-auto  border border-gray-300">
            {/* Company Header */}
            <div className="flex justify-between mb-2 P-1">
              <div className="text-lg font-bold">
                {employeeByQuery?.employee?.companyName}
              </div>
              <div>
                <img
                  className="h-[150px] w-[220px] p-2"
                  src={theme?.theme?.logoImage || UnisolLogoImage}
                  alt="logo"
                />
              </div>
            </div>
            <div className="text-left px-1 -mt-20 pb-20">
              {" "}
              456 Survival Lane,Seoul,Seoul Special City-04560,South Korea
            </div>
            <div className="text-center border border-black w-full p-1 ">
              Payslip for the {period}
            </div>

            {/* Employee Details Grid */}
            <table className="w-full">
              {/* Left Column */}
              <thead className="border text-left font-bold mr-4 border-black">
                <tr className="border-r-2">
                  <th className="px-2 py-1 border border-gray-300">
                    Employee Pay Summary
                  </th>
                </tr>
              </thead>
              <tbody className="flex justify-between">
                <table className="border-collapse border border-gray-300 w-full">
                  <tbody className="text-left">
                    {employeeByQuery !== null &&
                      payslipData?.employeeDetails &&
                      Object.entries(payslipData?.employeeDetails)
                        .slice(0, 6)
                        .map(([key, value]) => (
                          <tr key={key} className="border border-gray-300">
                            {/* First column: Label */}
                            <td className="text-left font-semibold whitespace-nowrap px-2 py-1 border border-gray-300">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </td>

                            {/* Second column: Input field */}
                            <td className="px-2 py-1 border border-gray-300">
                              <input
                                type="text"
                                defaultValue={value}
                                className="w-full flex justify-center border-b border-gray-300 px-2 py-1 outline-none focus:border-blue-500 min-h-[24px]"
                                readOnly
                              />
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>

                {/* Right Column */}
                <table className="border-collapse border border-gray-300 w-full">
                  <tbody>
                    {employeeByQuery !== null &&
                      payslipData.employeeDetails &&
                      Object.entries(payslipData.employeeDetails)
                        .slice(6)
                        .map(([key, value], index) => (
                          <tr key={key} className="border border-gray-300">
                            {/* First column: Label */}
                            <td className="text-left font-semibold whitespace-nowrap px-2 py-1 border border-gray-300">
                              {["PAN"].includes(key)
                                ? key
                                : key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace("U A N", "UAN")
                                    .trim()}
                            </td>
                            {/* Second column: Input field */}
                            <td className="px-2 py-1 border border-gray-300">
                              <input
                                type="text"
                                defaultValue={value}
                                className="w-full flex justify-center  border-b border-gray-300 px-2 py-1 outline-none focus:border-blue-500 min-h-[24px]"
                                onChange={(e) =>
                                  console.log(`Updated ${key}:`, e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </tbody>
            </table>
            {/* Earnings and Deductions Tables */}
            <div className="grid grid-cols-2">
              {/* Earnings Table */}
              <div className="border border-gray-300 flex flex-col">
                <table className="w-full border-collapse flex-grow whitespace-nowrap">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-2 text-left w-1/3">EARNINGS</th>
                      <th className="p-2 text-center w-1/3 border-l">Master</th>
                      <th className="p-2 text-right w-1/3 border-l">
                        Earnings
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeByQuery !== null &&
                      payslipData.earnings &&
                      Object.entries(payslipData.earnings).map(
                        ([key, value]) => (
                          <tr key={key} className="border-b">
                            <td className="p-2 text-start">
                              {/* {key.replace(/([A-Z])/g, " $1").trim()} */}
                              {key
                                .replace(/(\D)(\d)$/, "$1 $2")
                                .replace(/([a-z])([A-Z])/g, "$1 $2")}
                            </td>
                            <td className="p-2 text-right border-l">
                              {formatCurrency(value)}
                            </td>
                            <td className="p-2 text-right border-l">
                              {formatCurrency(value)}
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-gray-50 font-bold">
                      <td colSpan="2" className="p-3 text-start">
                        Gross Earnings
                      </td>
                      <td className="p-3 text-right border-l">
                        {formatCurrency(totals.grossEarnings)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {/* Deductions Table */}
              <div className="border border-gray-300 flex flex-col">
                <table className="w-full border-collapse flex-grow">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-2 text-left w-1/2">Particulars</th>
                      <th className="p-2 text-right w-1/2 border-l">
                        Deductions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeByQuery !== null &&
                      payslipData.deductions &&
                      Object.entries(payslipData.deductions).map(
                        ([key, value]) => (
                          <tr key={key} className="border-b">
                            <td className="p-2 text-start">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </td>
                            <td className="p-2 text-right border-l">
                              {formatCurrency(value)}
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-gray-50 font-bold">
                      <td className="p-3 text-start">Total Deductions</td>
                      <td className="p-3 text-end border-l">
                        {formatCurrency(totals.totalDeductions)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            {/* Reimbursements */}
            <div className="border border-gray-300 w-[50%]">
              <div className="bg-gray-100 p-2 text-start font-semibold">
                REIMBURSEMENTS
              </div>
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  {employeeByQuery !== null &&
                    payslipData.reimbursements &&
                    Object.entries(payslipData.reimbursements).map(
                      ([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="p-2 border border-gray-300 text-start">
                            {/* {key.replace(/([A-Z])/g, " $1").trim()} */}
                            {key
                              .replace(/(\D)(\d)$/, "$1 $2")
                              .replace(/([a-z])([A-Z])/g, "$1 $2")}
                          </td>
                          <td className="p-2 border border-gray-300 text-right">
                            {formatCurrency(value)}
                          </td>
                          <td className="p-2 border border-gray-300 text-right">
                            {formatCurrency(value)}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td
                      className="p-2 border border-gray-300 text-start"
                      colSpan={2}
                    >
                      Total Reimbursements
                    </td>
                    <td className="p-2 border border-gray-300 text-right">
                      {formatCurrency(totals.totalReimbursements)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {/* Net Pay Section */}

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="p-2 text-start border-r">NET PAY</th>
                  <th className="p-2 text-start">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 text-start">Gross Earnings</td>
                  <td className="p-2 text-right border-l">
                    {formatCurrency(totals.grossEarnings)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 text-start">Total Deductions</td>
                  <td className="p-2 text-right border-l">
                    {formatCurrency(totals.totalDeductions)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 text-start">Total Reimbursements</td>
                  <td className="p-2 text-right border-l">
                    {formatCurrency(totals.totalReimbursements)}
                  </td>
                </tr>
                {/* Total Net Payable Row */}
                <tr className="font-semibold border-t">
                  <td className="p-3 text-end">Total Net Payable</td>
                  <td className="p-3 text-right border-l">
                    {formatCurrency(totals.netPayable)}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Footer */}
            <div className="text-center text-sm p-3">
              <div className="font-bold">
                Total Net Payable :{amountInWords} (Amount in words){" "}
              </div>
              <p className="border-b-2">
                Total Net Payable = Gross Earings - Total Deductions + Total
                Rebursements
              </p>
              <p>L.O.P Days</p>
              <div className="mt-2">
                **This is a computer generated payslip and does not require
                signature**
              </div>
            </div>
          </div>
        </div>
      </div>
      {paySlipGenerate && (
        <SuccessfullPaySlipGenerate
          onClose={onClose}
          employeeDetails={employeeByQuery}
          period={period}
          payslipRef={payslipRef}
        />
      )}
    </div>
  );
});

export default PaySlip;
