import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Breadcrumb from "../../../../components/BreadCrumb";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "../../../../components/Button";
import { useParams } from "react-router-dom";
import usePayrollManagement from "../../../../hooks/unisol/payrollManagement/payrollManagement";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const GeneratePaySlip = () => {
  const isEmployeeLogin = sessionStorage.getItem("isEmployeeLogin");
  const slipRef = useRef();
  
  const downloadAsPDF = async () => {
  const input = slipRef.current;
  if (!input) return;

  try {
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    if (pdfHeight > 297) {
      finalHeight = 297;
      finalWidth = pdfWidth * (297 / pdfHeight);
    }

    const x = (pdf.internal.pageSize.getWidth() - finalWidth) / 2;
    pdf.addImage(imgData, "PNG", x, 0, finalWidth, finalHeight);

    const employeeName =
      employeePaySlipDetails?.employeeDetails?.fullName || "employee";

    const monthName = new Date(
      monthYear.year,
      monthYear.month
    ).toLocaleString("en-US", { month: "long" });

    pdf.save(`Payslip-${employeeName}-${monthName}-${monthYear.year}.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};const { theme } = useTheme();
  const { id } = useParams();
  const { getEmployeePaySlipDetails, employeePaySlipDetails, loading } =
    usePayrollManagement();
  const today = new Date();
  const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [monthYear, setMonthYear] = useState({
    month: prevMonthDate.getMonth(),
    year: prevMonthDate.getFullYear(),
  });
  const [selectedDate, setSelectedDate] = useState(prevMonthDate);

  console.log(monthYear);
  const handleDateChange = (newValue) => {
    if (!newValue) return;
    setSelectedDate(newValue);
    setMonthYear({
      month: newValue.getMonth(),
      year: newValue.getFullYear(),
    });
  };
  useEffect(() => {
    if (id && monthYear?.month >= 0 && monthYear?.year) {
      const date = new Date(monthYear.year, monthYear.month);
      const monthWord = date.toLocaleString("en-US", { month: "long" });
      getEmployeePaySlipDetails(id, monthWord, monthYear.year);
    }
  }, [id, monthYear]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value || 0);

  return (
    <div className="min-h-screen">
      {isEmployeeLogin ? (
        <Breadcrumb
          linkText={[
            { text: "Dashboard", href: "/EmployeeDashboard/" },
            { text: "Download Payslip" },
          ]}
        />
      ) : (
        <Breadcrumb
          linkText={[
            { text: "Payroll Management" },
            { text: "Employee List", href: "/emplist" },
            { text: "Generate Payslip" },
          ]}
        />
      )}

      {loading ? (
        <div className="py-8 w-full flex items-center justify-center">
          <LoaderSpinner />
        </div>
      ) : employeePaySlipDetails ? (
        <div className="shadow-xl rounded-2xl overflow-hidden bg-white">
          {/* Header */}
          <div
            className="flex justify-between items-center px-6 py-4"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <h2 className="text-lg md:text-xl font-bold text-black">
              Payslip –{" "}
              {employeePaySlipDetails?.employee?.fullName || "N/A"}
            </h2>
            <div className="flex items-center gap-3">
              <Button
                text="Download Payslip"
                variant={1}
                onClick={downloadAsPDF}
                disabled={!employeePaySlipDetails}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Month"
                  openTo="month"
                  views={["year", "month"]}
                  maxDate={prevMonthDate}
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      className: "bg-white rounded-lg shadow-sm",
                      size: "small",
                      sx: {
                        "& .MuiInputLabel-root": {
                          fontSize: "0.9rem",
                          color: "#374151",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          {/* Payslip Content */}
          <div ref={slipRef} className="p-4 space-y-4" style={{fontSize: '12px'}}>
            {/* Company Info */}
            <div className="flex justify-between items-center border-b pb-4">
              <p className="text-sm md:text-base">
                Date:{" "}
                <span className="font-semibold">
                  {new Date().toLocaleDateString("en-GB")}
                </span>
              </p>
              <img className="h-16" src={theme?.logoImage} alt="logo" />
            </div>

            {/* Employee + Bank Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Card */}
              <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                <h5 className="text-base font-semibold text-gray-700 mb-3 border-b pb-2">
                  Employee Details
                </h5>
                <dl className="space-y-2 text-sm">
                  {[
                    [
                      "Employee ID",
                      employeePaySlipDetails?.employeeDetails?.employeeId,
                    ],
                    [
                      "Employee Name",
                      employeePaySlipDetails?.employeeDetails?.fullName,
                    ],
                    [
                      "Department",
                      employeePaySlipDetails?.employeeDetails?.department,
                    ],
                    [
                      "Designation",
                      employeePaySlipDetails?.employeeDetails?.designation,
                    ],
                    [
                      "Location",
                      employeePaySlipDetails?.employeeDetails?.permanentAddress1,
                    ],
                  ].map(([label, value], i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start gap-2"
                    >
                      <dt className="font-medium text-gray-600 whitespace-nowrap">
                        {label}
                      </dt>
                      <dd className="text-gray-800 text-right break-words max-w-[60%]">
                        {value || "N/A"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Bank Card */}
              <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                <h5 className="text-base font-semibold text-gray-700 mb-3 border-b pb-2">
                  Bank & Other Details
                </h5>
                <dl className="space-y-2 text-sm">
                  {[
                    [
                      "Bank Name",
                      employeePaySlipDetails?.bankDetails?.bankName,
                    ],
                    [
                      "Account Name",
                      employeePaySlipDetails?.bankDetails?.bankAccountName,
                    ],
                    [
                      "Account No.",
                      employeePaySlipDetails?.bankDetails?.bankAccountNumber,
                    ],
                    [
                      "IFSC Code",
                      employeePaySlipDetails?.bankDetails?.ifscCode,
                    ],
                    [
                      "Branch",
                      employeePaySlipDetails?.bankDetails?.branchName,
                    ],
                    [
                      "PF Account",
                      employeePaySlipDetails?.bankDetails?.pfAccountNumber,
                    ],
                    [
                      "Working Days",
                      employeePaySlipDetails?.bankDetails?.totalWorkingDays,
                    ],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between">
                      <dt className="font-medium text-gray-600">{label}</dt>
                      <dd className="text-gray-800">{value || "N/A"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Earnings & Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings */}
              <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                <h5 className="text-base font-semibold text-gray-700 mb-3 border-b pb-2">
                  Earnings
                </h5>
                <dl className="space-y-2 text-sm">
                  {[
                    [
                      "Basic Pay",
                      employeePaySlipDetails?.earnings?.basicSalary,
                    ],
                    [
                      "HRA",
                      employeePaySlipDetails?.earnings?.houseRentAllowance,
                    ],
                    [
                      "Conveyance",
                      employeePaySlipDetails?.earnings?.conveyanceAllowance,
                    ],
                    [
                      "DA",
                      employeePaySlipDetails?.earnings?.dearnessAllowance,
                    ],
                    [
                      "Medical",
                      employeePaySlipDetails?.earnings?.medicalAllowance,
                    ],
                    [
                      "Joining Bonus",
                      employeePaySlipDetails?.earnings?.joiningBonus,
                    ],
                    [
                      "LTA",
                      employeePaySlipDetails?.earnings?.LTAAllowance,
                    ],
                    [
                      "Special Allowance",
                      employeePaySlipDetails?.earnings?.specialAllowance,
                    ],
                    // [
                    //   "Loan Advancement ",
                    //   employeePaySlipDetails?.earnings?.loanAdvancement,
                    // ],
                    //  [
                    //   "Loan Type ",
                    //   employeePaySlipDetails?.earnings?.loans?.[0]?.loanType || "N/A",
                    // ],
                    [
                      "Loan Advancement ",
                      employeePaySlipDetails?.earnings?.loans?.[0]?.loanAmount || "N/A",
                    ],
                    [
                      "Approval Date ",
                      employeePaySlipDetails?.earnings?.loans?.[0]?.approvalDate || "N/A",
                    ],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between">
                      <dt className="font-medium text-gray-600">{label}</dt>
                      <dd className="text-gray-800">{value || "N/A"}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Deductions */}
              <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                <h5 className="text-base font-semibold text-gray-700 mb-3 border-b pb-2">
                  Deductions
                </h5>
                <dl className="space-y-2 text-sm">
                  {[
                    ["PF", employeePaySlipDetails?.deductions?.pf],
                    [
                      "Professional Tax",
                      employeePaySlipDetails?.deductions?.professionalTax,
                    ],
                    [
                      "Income Tax",
                      employeePaySlipDetails?.deductions?.incomeTaxDeduction,
                    ],
                    [
                      "Monthly Loan Repayment",
                      employeePaySlipDetails?.deductions?.monthlyLoanRepayment,
                    ],
                    [
                      "Starting Date",
                      employeePaySlipDetails?.deductions?.startingDate,
                    ],
                    //  [
                    //   "Loan Type ",
                    //   employeePaySlipDetails?.earnings?.loans?.[0]?.loanType || "N/A",
                    // ],
                    [
                      "Loan Advancement ",
                      employeePaySlipDetails?.earnings?.loans?.[0]?.loanAmount || "N/A",
                    ],
                    [
                      "Approval Date ",
                      employeePaySlipDetails?.earnings?.loans?.[0]?.approvalDate || "N/A",
                    ],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between">
                      <dt className="font-medium text-gray-600">{label}</dt>
                      <dd className="text-gray-800">{value || "N/A"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Net Pay Section */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
              <h4 className="text-base font-semibold text-gray-700 mb-4">
                Net Pay Calculation
              </h4>
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3">Gross Earnings</td>
                    <td className="py-2 px-3 text-right">
                      {formatCurrency(
                        employeePaySlipDetails?.netPayCalculation?.grossEarnings
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3">Total Deductions</td>
                    <td className="py-2 px-3 text-right">
                      {formatCurrency(
                        employeePaySlipDetails?.netPayCalculation?.totalDeductions
                      )}
                    </td>
                  </tr>
                  <tr className="font-semibold bg-gray-50">
                    <td className="py-2 px-3">Net Payable</td>
                    <td className="py-2 px-3 text-right">
                      {formatCurrency(
                        employeePaySlipDetails?.netPayCalculation?.netPayable
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 text-xs text-gray-500 text-center italic">
                {
                  employeePaySlipDetails?.netPayCalculation?.formula
                }
              </p>
              <p className="mt-4 text-sm font-medium text-gray-700 text-center">
                {
                  employeePaySlipDetails?.netPayCalculation?.netPayableInWords
                }{" "}
                (Amount in words)
              </p>
              <p className="mt-2 text-xs text-gray-500 text-center italic">
                *This is a computer-generated payslip and does not require
                signature*
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No payslip found for this employee.
        </p>
      )}
    </div>
  );
};

export default GeneratePaySlip;
