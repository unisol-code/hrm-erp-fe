import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Chip, IconButton } from "@mui/material";
import { Eye } from "lucide-react";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useExEmpDB from "../../../../../hooks/unisol/offboardingManagement/useExEmpDB";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const tabs = [
  { id: 0, label: "Basic Details", icon: "👤" },
  { id: 1, label: "Bank Details", icon: "🏦" },
  { id: 2, label: "Salary Details", icon: "💰" },
  { id: 3, label: "Welcome Kit", icon: "🎁" },
  { id: 4, label: "Loan Details", icon: "💳" },
  // { id: 5, label: "Appraisals", icon: "📈" },
  { id: 6, label: "Expenses", icon: "🧾" }
];

const ViewEmployeeDatabase = () => {
  const { fetchInactiveEmpDetails, inactiveEmpDetails, loading } = useExEmpDB();
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarHeight, setSidebarHeight] = useState('auto');

  useEffect(() => {
    fetchInactiveEmpDetails(id);
  }, [id]);

  useEffect(() => {
    // Calculate height for sticky sidebar
    const calculateHeight = () => {
      const header = document.querySelector('.page-header');
      if (header) {
        const headerHeight = header.getBoundingClientRect().height;
        const windowHeight = window.innerHeight;
        const breadcrumbHeight = 60;
        const availableHeight = windowHeight - headerHeight - breadcrumbHeight - 32;
        
        setSidebarHeight(`${Math.max(availableHeight, 400)}px`);
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  if (loading) {
    return <LoaderSpinner />;
  }

  if (!inactiveEmpDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600"><LoaderSpinner /></p>
      </div>
    );
  }

  const { basicDetails, bankDetails, salaryDetails, welcomeKits, loanDetails, expenseDetails } = inactiveEmpDetails;

  return (
    <div className="min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Employee Management" },
          { text: "Employee Database", href: "/offboardingManagement/employeeDatabase" },
          { text: "Employee Details" },
        ]}
      />

      {/* HEADER */}
      <div 
        className="page-header relative flex flex-col sm:flex-row items-center justify-between mb-4 p-6 rounded-xl shadow-sm bg-slate-50"
        style={{
          backgroundColor: 'white',
          border: `1px solid ${theme.primaryColor}20`,
          boxShadow: `0 4px 20px ${theme.primaryColor}10`
        }}
      >
        <div className="text-center sm:text-left">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: theme.primaryColor }}
          >
            Ex Employee Details
          </h1>
          <p className="text-gray-600">View comprehensive information about the employee</p>
        </div>

        {/* Employee Info Badge */}
        <div
          className="mt-2 sm:mt-0 px-5 py-3 rounded-lg shadow-sm"
          style={{
            backgroundColor: theme.bgSidebar,
            border: `1px solid ${theme.primaryColor}`,
          }}
        >
          <span className="font-bold">
            {basicDetails?.fullName} • {basicDetails?.employeeId}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-60 flex-shrink-0">
          <div
            className="rounded-xl p-1 bg-white sticky top-24 overflow-y-auto"
            style={{
              height: sidebarHeight,
              border: `1px solid ${theme.primaryColor}20`,
              boxShadow: `0 2px 8px ${theme.primaryColor}10`,
              maxHeight: 'calc(100vh - 140px)'
            }}
          >
            <h3
              className="font-bold text-lg mb-2 p-4 pb-2 sticky top-0 bg-white z-10"
              style={{
                color: theme.primaryColor,
                borderBottom: `2px solid ${theme.primaryColor}30`
              }}
            >
              Employee Sections
            </h3>
            <div className="space-y-1 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full text-left"
                >
                  <div
                    style={{
                      backgroundColor: activeTab === tab.id ? theme.bgSidebar : 'transparent',
                      borderLeft: activeTab === tab.id ? `4px solid ${theme.accentColor}` : '4px solid transparent',
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Box
            className="p-4 rounded-xl overflow-y-auto"
            style={{
              backgroundColor: 'white',
              border: `1px solid ${theme.primaryColor}20`,
              boxShadow: `0 4px 20px ${theme.primaryColor}10`,
              maxHeight: sidebarHeight
            }}
          >
            {activeTab === 0 && <BasicDetails theme={theme} data={basicDetails} />}
            {activeTab === 1 && <BankDetails theme={theme} data={bankDetails} />}
            {activeTab === 2 && <SalaryDetails theme={theme} data={salaryDetails} />}
            {activeTab === 3 && <WelcomeKit theme={theme} data={welcomeKits || []} />}
            {activeTab === 4 && <LoanDetails theme={theme} data={loanDetails || []} />}
            {/* {activeTab === 5 && <Appraisals theme={theme} data={inactiveEmpDetails?.appraisals || []} />} */}
            {activeTab === 6 && <Expenses theme={theme} data={expenseDetails || []} employeeId={basicDetails?.employeeId} />}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeDatabase;

const Field = ({ label, value, className = "", theme }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
    <p
      className="font-medium text-sm uppercase tracking-wider text-gray-600"
      style={{
        letterSpacing: '0.5px'
      }}
    >
      {label}
    </p>
    <div className="col-span-2">
      <div
        className="w-full border rounded-lg px-4 py-3 transition-all duration-200"
        style={{
          backgroundColor: '#f9fafb',
          borderColor: `${theme.primaryColor}30`,
          color: '#111827'
        }}
      >
        {value || "N/A"}
      </div>
    </div>
  </div>
);

const SectionTitle = ({ title, subtitle = "", theme }) => (
  <div className="mb-4">
    <div className="flex items-center gap-3 mb-2">
      <div
        className="w-1 h-8 rounded-full"
        style={{ backgroundColor: theme.primaryColor }}
      ></div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    {subtitle && (
      <p className="text-gray-600 ml-4">{subtitle}</p>
    )}
    <div className="border-b mt-4" style={{ borderColor: `${theme.primaryColor}20` }}></div>
  </div>
);

/* ---------------- BASIC DETAILS ---------------- */
const BasicDetails = ({ theme, data }) => {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Basic Details"
        subtitle="Employee's personal and professional information"
        theme={theme}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Employee ID" value={data.employeeId} theme={theme} />
        <Field label="Company Name" value={data.companyName} theme={theme} />
        <Field label="Employee Name" value={data.fullName} theme={theme} />
        <Field label="Department" value={data.department} theme={theme} />
        <Field label="Designation" value={data.designation} theme={theme} />
        <Field label="Employment Type" value={data.employeementType} theme={theme} />
        <Field label="Birth Date" value={formatDate(data.dateOfBirth)} theme={theme} />
        <Field label="Phone Number" value={data.phoneNumber} theme={theme} />
      </div>

      <SectionTitle title="Current Address" theme={theme} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Zip Code" value={data.currentAddress?.currentPincode} theme={theme} />
        <Field label="Country" value={data.currentAddress?.currentCountry} theme={theme} />
        <Field label="State" value={data.currentAddress?.currentState} theme={theme} />
        <Field label="City" value={data.currentAddress?.currentCity} theme={theme} />
        <Field label="Address Line 1" value={data.currentAddress?.currentAddress1} theme={theme} />
        <Field label="Address Line 2" value={data.currentAddress?.currentAddress2} theme={theme} />
      </div>

      <SectionTitle title="Contact Information" theme={theme} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Phone No" value={data.contactInformation?.phoneNumber} theme={theme} />
        <Field label="Official Email" value={data.contactInformation?.officialEmail} theme={theme} />
        <Field label="Personal Email" value={data.contactInformation?.personalEmail} theme={theme} />
      </div>

      <SectionTitle title="Emergency Contact" theme={theme} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Name" value={data.emergencyContact?.emergencyContactName} theme={theme} />
        <Field label="Phone" value={data.emergencyContact?.emergencyContactNumber} theme={theme} />
        <Field label="Relation" value={data.emergencyContact?.relationWithEmergencyContact} theme={theme} />
      </div>

      <SectionTitle title="Identification Details" theme={theme} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Aadhaar No" value={data.identificationDetails?.adharNo} theme={theme} />
        <Field label="PAN No" value={data.identificationDetails?.panCard} theme={theme} />
        <Field label="Joining Date" value={formatDate(data.identificationDetails?.joiningDate)} theme={theme} />
      </div>
    </div>
  );
};

/* ---------------- BANK DETAILS ---------------- */
const BankDetails = ({ theme, data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Bank Details"
        subtitle="Employee's bank account information"
        theme={theme}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Account Holder Name" value={data.bankAccountName} theme={theme} />
        <Field label="Bank Name" value={data.bankName} theme={theme} />
        <Field label="Account Number" value={data.bankAccountNumber} theme={theme} />
        <Field label="IFSC Code" value={data.ifscCode} theme={theme} />
        <Field label="Branch" value={data.branchName} theme={theme} />
      </div>
    </div>
  );
};

/* ---------------- SALARY DETAILS ---------------- */
const SalaryDetails = ({ theme, data }) => {
  if (!data) return null;

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Salary Details"
        subtitle="Employee's salary structure"
        theme={theme}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Basic Salary" value={formatCurrency(data.basicSalary)} theme={theme} />
        <Field label="HRA" value={formatCurrency(data.houseRentAllowance)} theme={theme} />
        <Field label="Conveyance Allowance" value={formatCurrency(data.conveyanceAllowance)} theme={theme} />
        <Field label="Medical Allowance" value={formatCurrency(data.medicalAllowance)} theme={theme} />
        <Field label="Dearness Allowance" value={formatCurrency(data.dearnessAllowance)} theme={theme} />
        <Field label="Special Allowance" value={formatCurrency(data.specialAllowance)} theme={theme} />
        <Field label="LTA Allowance" value={formatCurrency(data.LTAAllowance)} theme={theme} />
        <Field label="Joining Bonus" value={formatCurrency(data.joiningBonus)} theme={theme} />
        <Field label="Gross Earnings" value={formatCurrency(data.grossEarnings)} theme={theme} />
        <Field label="Professional Tax" value={formatCurrency(data.professionalTax)} theme={theme} />
        <Field label="Income Tax Deduction" value={formatCurrency(data.incomeTaxDeduction)} theme={theme} />
        <Field label="Total Deductions" value={formatCurrency(data.totalDeductions)} theme={theme} />
        <Field label="Net Salary" value={formatCurrency(data.netSalary)} theme={theme} />
      </div>
    </div>
  );
};

/* ---------------- WELCOME KIT ---------------- */
const WelcomeKit = ({ theme, data }) => {
  const getStatusColor = (isAcknowledged) => {
    return isAcknowledged ? '#10B981' : '#F59E0B';
  };

  if (!data || data.length === 0) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Welcome Kit Details" subtitle="Items provided to the employee" theme={theme} />
        <div className="text-center py-8 text-gray-500">No welcome kit items found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Welcome Kit Details"
        subtitle="Items provided to the employee"
        theme={theme}
      />
      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={item._id || index}
            className="flex items-center justify-between p-5 rounded-lg border transition-all duration-200 hover:shadow-md"
            style={{
              borderColor: `${theme.primaryColor}20`,
              backgroundColor: `${theme.primaryColor}05`
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: 'white'
                }}
              >
                <span className="text-lg font-bold">{item.name?.charAt(0) || 'K'}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{item.name || 'Item'}</p>
                <p className="text-sm text-gray-500">Welcome Kit Item</p>
              </div>
            </div>
            <Chip
              label={item.isAcknowledged ? 'Acknowledged' : 'Pending'}
              sx={{
                backgroundColor: `${getStatusColor(item.isAcknowledged)}15`,
                color: getStatusColor(item.isAcknowledged),
                fontWeight: 600,
                border: `1px solid ${getStatusColor(item.isAcknowledged)}30`
              }}
              size="medium"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- LOAN DETAILS ---------------- */
const LoanDetails = ({ theme, data }) => {
  const getStatusConfig = (remainingAmount) => {
    if (remainingAmount === 0) {
      return {
        color: '#10B981',
        bgColor: '#D1FAE5',
        icon: '✅',
        status: 'Completed'
      };
    } else {
      return {
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        icon: '🟡',
        status: 'Active'
      };
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Loan Details" subtitle="Employee's loan history and current loans" theme={theme} />
        <div className="text-center py-8 text-gray-500">No loan details found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Loan Details"
        subtitle="Employee's loan history and current loans"
        theme={theme}
      />

      <div className="space-y-4">
        {data.map((loan, index) => {
          const statusConfig = getStatusConfig(loan.remainingAmount);
          const totalLoanAmount = loan.loanAmount || 0;
          const monthlyDeduction = loan.monthlyDeductionAmount || 0;
          const paidInstallments = loan.repaymentTenureInMonths - loan.remainingAmount;
          const progressPercentage = ((paidInstallments * monthlyDeduction) / totalLoanAmount) * 100;

          return (
            <div
              key={index}
              className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              style={{
                backgroundColor: 'white',
                borderColor: `${theme.primaryColor}20`,
                borderLeft: `4px solid ${theme.accentColor}`
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{loan.loanType}</h3>
                    <div
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.color
                      }}
                    >
                      <span className="mr-1">{statusConfig.icon}</span>
                      {statusConfig.status}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color: theme.primaryColor }}>
                      ₹{totalLoanAmount.toLocaleString('en-IN')}
                    </div>
                    <p className="text-gray-600 text-sm">Total Loan Amount</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${theme.primaryColor}05` }}>
                  <p className="text-sm text-gray-600 font-medium">Tenure</p>
                  <p className="text-lg font-bold mt-1" style={{ color: theme.primaryColor }}>{loan.repaymentTenureInMonths} months</p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${theme.accentColor}05` }}>
                  <p className="text-sm text-gray-600 font-medium">Monthly EMI</p>
                  <p className="text-lg font-bold mt-1" style={{ color: theme.accentColor }}>₹{monthlyDeduction.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${theme.primaryColor}05` }}>
                  <p className="text-sm text-gray-600 font-medium">Remaining Installments</p>
                  <p className="text-lg font-bold mt-1" style={{ color: theme.primaryColor }}>{loan.remainingAmount}</p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${theme.accentColor}05` }}>
                  <p className="text-sm text-gray-600 font-medium">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(progressPercentage, 100)}%`,
                        backgroundColor: theme.primaryColor
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- APPRAISALS ---------------- */
// const Appraisals = ({ theme, data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="space-y-6">
//         <SectionTitle title="Performance Appraisals" subtitle="Employee's performance reviews and salary increments" theme={theme} />
//         <div className="text-center py-8 text-gray-500">No appraisal records found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <SectionTitle title="Performance Appraisals" subtitle="Employee's performance reviews and salary increments" theme={theme} />
//       <div className="text-center py-8 text-gray-500">Appraisal data will be displayed here</div>
//     </div>
//   );
// };

/* ---------------- EXPENSES ---------------- */
const Expenses = ({ theme, data, employeeId }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const handleViewDetails = (expense) => {
    // Extract month number from month name
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthNumber = (monthNames.indexOf(expense.month) + 1).toString().padStart(2, '0');
    
    // Navigate to expense sheet detail page with query parameters
    navigate(`/expensesheet/expensesheetDetail/${employeeId}?month=${monthNumber}&year=${expense.year}`);
  };

  if (!data || data.length === 0) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Expense Claims" subtitle="Employee's expense claims and reimbursements" theme={theme} />
        <div className="text-center py-8 text-gray-500">No expense claims found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Expense Claims"
        subtitle="Employee's expense claims and reimbursements by month"
        theme={theme}
      />

      <div className="space-y-4">
        {data.map((expense, index) => (
          <div
            key={index}
            className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            style={{
              backgroundColor: 'white',
              borderColor: `${theme.primaryColor}20`
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: `${theme.primaryColor}15`
                  }}
                >
                  📊
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{expense.monthYear}</h3>
                    <div
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${theme.primaryColor}15`,
                        color: theme.primaryColor
                      }}
                    >
                      {expense.month} {expense.year}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Total expenses claimed for this month
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                      {formatCurrency(expense.totalExpense)}
                    </div>
                    <p className="text-gray-600 text-sm">Total Claim Amount</p>
                  </div>
                  <IconButton 
                    onClick={() => handleViewDetails(expense)}
                    sx={{
                      backgroundColor: `${theme.primaryColor}10`,
                      '&:hover': {
                        backgroundColor: `${theme.primaryColor}20`,
                      }
                    }}
                  >
                    <Eye size={20} style={{ color: theme.primaryColor }} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};