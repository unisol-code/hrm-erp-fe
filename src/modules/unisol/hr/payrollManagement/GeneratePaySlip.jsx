import { useEffect, useState } from "react";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Breadcrumb from "../../../../components/BreadCrumb";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "../../../../components/Button";
import { useParams } from "react-router-dom";
import usePayrollManagement from "../../../../hooks/unisol/payrollManagement/payrollManagement";
import { generatePayslipPdf, loadImageAsDataURL } from "./loanRequest/paySlipPdf";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const NA = "NA";

// A4 width at 96 dpi, used for the on-screen preview only.
const SLIP_WIDTH_PX = 794;

const pickFirst = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
};

const pickObject = (...values) => {
  for (const value of values) {
    if (value && typeof value === "object") {
      if (Array.isArray(value) && value.length > 0) return value;
      if (!Array.isArray(value) && Object.keys(value).length > 0) return value;
    }
  }
  return {};
};

const displayValue = (value) => {
  if (value === undefined || value === null || value === "") return NA;
  return String(value);
};

const formatAmount = (value) => {
  if (value === undefined || value === null || value === "") return NA;
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return number.toFixed(2);
};

const formatDays = (value) => {
  if (value === undefined || value === null || value === "") return NA;
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return number.toFixed(1);
};

const formatDate = (value) => {
  if (value === undefined || value === null || value === "") return NA;
  if (typeof value === "string" && /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(value.trim())) {
    return value.trim();
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day}-${month}-${date.getFullYear()}`;
};

const humanizeLabel = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toUpperCase();

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return 0;
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const isAmountLike = (value) =>
  typeof value === "number" ||
  (typeof value === "string" && /^[-,\d.]+$/.test(value.trim()));

const sumAmounts = (rows) =>
  rows.reduce((total, row) => total + toNumber(row.normal), 0);

const numberToWords = (amount) => {
  const num = Math.floor(toNumber(amount));
  if (num === 0) return "Rupees Zero Only";

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

  let result = "";
  let n = num;
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
  return `Rupees ${result.trim()} Only`;
};

const EARNINGS_LABELS = {
  basicSalary: "BASIC",
  houseRentAllowance: "HRA",
  specialAllowance: "SPECIAL ALLOWANCE",
  conveyanceAllowance: "Conveyance Allowance",
  dearnessAllowance: "Dearness Allowance",
  medicalAllowance: "MEDICAL ALLOWANCE",
  joiningBonus: "Joining Bonus",
  LTAAllowance: "LTA",
  ltaAllowance: "LTA",
  statutoryBonus: "STATUTORY BONUS",
  loanAdvancement: "LOAN ADVANCEMENT",
  loans: "LOAN ADVANCEMENT",
  otherEarning1: "OTHER EARNING 1",
  otherEarning2: "OTHER EARNING 2",
  otherEarning3: "OTHER EARNING 3",
};

const DEDUCTION_LABELS = {
  pf: "STATUTORY P.F.",
  providentFund: "STATUTORY P.F.",
  professionalTax: "Professional Tax",
  incomeTaxDeduction: "Income Tax",
  incomeTax: "Income Tax",
  monthlyLoanRepayment: "MONTHLY LOAN REPAYMENT",
  loanRepayment: "MONTHLY LOAN REPAYMENT",
  advanceLoanDeductions: "ADVANCE LOAN DEDUCTION",
  otherDeduction1: "OTHER DEDUCTION 1",
  otherDeduction2: "OTHER DEDUCTION 2",
  otherDeduction3: "OTHER DEDUCTION 3",
};

const EARNINGS_FIXED_ROWS = [
  { label: "Basic Salary", keys: ["basicSalary", "basic"] },
  { label: "HRA", keys: ["houseRentAllowance", "hra"] },
  { label: "Special Allowance", keys: ["specialAllowance"] },
  {
    label: "Lease Operating Allowance",
    keys: ["leaseOperatingAllowance", "LEASEOperatingAllowance", "lease_operating_allowance"],
  },
  // { label: "LTA TAXABLE", keys: ["ltaTaxable", "LTATaxable", "lta_taxable"] },
  { label: "Medical Allowance", keys: ["medicalAllowance"] },
  {
    label: "Car Operating Allowance",
    keys: ["carOperatingAllowance", "car_operating_allowance"],
  },
  {
    label: "Annual Performance Linked Variable Pay",
    keys: [
      "annualPerformanceLinkedVariablePay",
      "annualPerformanceLinkedVariablePayAmount",
      "annual_performance_linked_variable_pay",
    ],
  },
];

const DEDUCTION_FIXED_ROWS = [
  { label: "Statutory P.F.", keys: ["pf", "providentFund", "pfAmount"] },
  { label: "Professional Tax", keys: ["professionalTax", "Tax"] },
  { label: "Income Tax", keys: ["incomeTaxDeduction", "incomeTax"] },
  { label: "Staff Sale", keys: ["staffSale", "staffWelfare", "staffSaleAmount"] },
];

const INCOME_TAX_ROWS = [
  { label: "Basic Pay", keys: ["basicPay", "basic_pay"] },
  { label: "House Rent Allowance", keys: ["houseRentAllowance", "house_rent_allowance"] },
  { label: "Car Operating Allowance", keys: ["carOperatingAllowance", "car_operating_allowance"] },
  { label: "Special Allowance", keys: ["specialAllowance", "special_allowance"] },
  { label: "Bonus/Performance Bonus", keys: ["performanceBonus", "performance_bonus"] },
  { label: "Fl. Reg. Allow, etc.", keys: ["flRegAllow", "fl_reg_allow"] },
  { label: "Taxable LTA", keys: ["taxableLTA", "taxable_lta"] },
  { label: "Other Allow/Payments", keys: ["otherPayments", "other_payments"] },
  { label: "Total Perquisits", keys: ["totalPerquisits", "total_perquisits"] },
  { label: "Awards in King", keys: ["awardsInKing", "awards_in_king"] },
  { label: "Gross Income Before Exemption", keys: ["grossIncomeActiveExemption", "gross_income_active_exemption"] },
  { label: "Les.: Conveyance Allowance Exemption", keys: ["conveyanceAllowanceExemption", "conveyance_allowance_exemption"] },
  { label: "Les. - Professional Tax", keys: ["professionalTax", "professional_tax"] },
  { label: "Award/ Gifts/ Vouchers Exemption", keys: ["awardGiftsVouchersExemption", "award_gifts_vouchers_exemption"] },
  { label: "Les.: Income From House Property", keys: ["incomeFromHouseProperty", "income_from_house_property"] },
  { label: "Ded-80C", keys: ["ded80C", "ded_80c"] },
  { label: "Ded-80C", keys: ["ded80C2", "ded_80c_2"] },
  { label: "Total Deduction UnderSection 80", keys: ["totalDeduction80", "total_deduction_80"] },
  { label: "Taxable Gross Total Income", keys: ["taxableGrossTotalIncome", "taxable_gross_total_income"] },
  { label: "Income Tax", keys: ["incomeTax", "income_tax"] },
  { label: "Add Cess", keys: ["addCoss", "add_coss", "addCess"] },
  { label: "Total Tax Due", keys: ["totalTaxDue", "total_tax_due"] },
  { label: "Tax Deducted From Salary", keys: ["taxDeductedFromSalary", "tax_deducted_from_salary"] },
  { label: "Tax Payable in Possible Balance/Refundable", keys: ["taxPayable", "tax_payable"] },
];

const INVESTMENT_FIXED_ROWS = [
  {
    label: "Contribution to PF",
    keys: ["contributionToPF", "contributionPf", "contribution_to_pf"],
  },
  {
    label: "Repayment of Principal Amount of HSG Loan",
    keys: [
      "repaymentOfPrincipalAmtHsgLoan",
      "repaymentOfPrincipalHsgLoan",
      "repayment_of_principal_amt_hsg_loan",
      "repayment_principal_hsg_loan",
    ],
  },
];

const buildFixedRows = (source, fixedRows, labelMap, skipKeys = []) => {
  if (!source) {
    return fixedRows.map((row) => ({
      component: row.label,
      normal: null,
      adjustment: null,
    }));
  }

  if (Array.isArray(source)) {
    return source.map((item) => ({
      component: item.component || item.name || item.label || NA,
      normal: item.normal ?? item.amount ?? item.value ?? null,
      adjustment: item.adjustment ?? null,
    }));
  }

  if (typeof source !== "object") {
    return fixedRows.map((row) => ({
      component: row.label,
      normal: null,
      adjustment: null,
    }));
  }

  const usedKeys = new Set();
  const rows = fixedRows.map((row) => {
    const rawValue = row.keys
      .map((key) => source[key])
      .find((v) => v !== undefined && v !== null && v !== "");
    row.keys.forEach((key) => usedKeys.add(key));

    let normal = rawValue ?? null;
    let adjustment = null;
    if (rawValue && typeof rawValue === "object") {
      normal = rawValue.normal ?? rawValue.amount ?? rawValue.value ?? null;
      adjustment = rawValue.adjustment ?? null;
    }

    return { component: row.label, normal, adjustment };
  });

  Object.entries(source).forEach(([key, value]) => {
    if (usedKeys.has(key) || skipKeys.includes(key)) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        rows.push({
          component: labelMap[key] || humanizeLabel(key),
          normal: item.normal ?? item.amount ?? item.loanAmount ?? item.value ?? null,
          adjustment: item.adjustment ?? null,
        });
      });
      return;
    }

    if (value && typeof value === "object") {
      rows.push({
        component: labelMap[key] || humanizeLabel(key),
        normal: value.normal ?? value.amount ?? value.value ?? null,
        adjustment: value.adjustment ?? null,
      });
      return;
    }

    if (/date/i.test(key)) return;
    if (!isAmountLike(value)) return;

    rows.push({
      component: labelMap[key] || humanizeLabel(key),
      normal: value,
      adjustment: null,
    });
  });

  return rows;
};

const buildIncomeTaxRows = (source) => {
  if (!source || (typeof source === "object" && Object.keys(source).length === 0)) {
    return INCOME_TAX_ROWS.map((row) => ({
      label: row.label,
      current: null,
      cumulative: null,
      projected: null,
      annual: null,
    }));
  }

  if (Array.isArray(source)) {
    return source.map((item) => ({
      label: item.component || item.name || item.label || NA,
      current: item.current ?? item.addCurrent ?? item.add_current ?? null,
      cumulative: item.cumulative ?? item.addCumulative ?? item.add_cumulative ?? null,
      projected: item.projected ?? item.addProjected ?? item.add_projected ?? null,
      annual: item.annual ?? null,
    }));
  }

  if (typeof source === "object") {
    const entries = Object.entries(source).filter(
      ([key]) => !/financialYear|financial_year|year/i.test(key)
    );
    if (entries.length === 0) {
      return INCOME_TAX_ROWS.map((row) => ({
        label: row.label,
        current: null,
        cumulative: null,
        projected: null,
        annual: null,
      }));
    }
    return entries.map(([key, value]) => {
      if (value && typeof value === "object") {
        return {
          label: humanizeLabel(key),
          current: value.current ?? value.addCurrent ?? value.add_current ?? null,
          cumulative: value.cumulative ?? value.addCumulative ?? value.add_cumulative ?? null,
          projected: value.projected ?? value.addProjected ?? value.add_projected ?? null,
          annual: value.annual ?? null,
        };
      }
      return {
        label: humanizeLabel(key),
        current: value,
        cumulative: null,
        projected: null,
        annual: null,
      };
    });
  }

  return [];
};

const buildInvestmentRows = (source) => {
  if (!source || (typeof source === "object" && Object.keys(source).length === 0)) {
    return INVESTMENT_FIXED_ROWS.map((row) => ({ label: row.label, value: null }));
  }

  if (Array.isArray(source)) {
    return source.map((item) => ({
      label: item.component || item.name || item.label || NA,
      value: item.amount ?? item.value ?? item.normal ?? null,
    }));
  }

  if (typeof source === "object") {
    const entries = Object.entries(source).filter(([key]) => !/year/i.test(key));
    if (entries.length === 0) {
      return INVESTMENT_FIXED_ROWS.map((row) => ({ label: row.label, value: null }));
    }
    return entries.map(([key, value]) => {
      if (value && typeof value === "object") {
        return {
          label: humanizeLabel(key),
          value: value.amount ?? value.value ?? value.normal ?? null,
        };
      }
      return { label: humanizeLabel(key), value };
    });
  }

  return [];
};

const buildPerqRows = (source) => {
  if (!source || (typeof source === "object" && Object.keys(source).length === 0)) {
    return [{ label: NA, value: null }];
  }

  if (Array.isArray(source)) {
    return source.map((item) => ({
      label: item.component || item.name || item.label || NA,
      value: item.amount ?? item.value ?? item.normal ?? null,
    }));
  }

  if (typeof source === "object") {
    return Object.entries(source).map(([key, value]) => {
      if (value && typeof value === "object") {
        return {
          label: humanizeLabel(key),
          value: value.amount ?? value.value ?? value.normal ?? null,
        };
      }
      return { label: humanizeLabel(key), value };
    });
  }

  return [];
};

const GeneratePaySlip = () => {
  const isEmployeeLogin = sessionStorage.getItem("isEmployeeLogin");
  const { theme } = useTheme();
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
  const [downloading, setDownloading] = useState(false);

  const details = employeePaySlipDetails || {};
  const employeeInfo = pickObject(
    details.employee_information,
    details.employeeInformation,
    details.employeeDetails,
    details.employee_details
  );
  const employee = pickObject(details.employee, details.employee_details);
  const bankInfo = pickObject(details.bankDetails, details.bank_details);
  const attendance = pickObject(
    details.attendance_summary,
    details.attendanceSummary,
    details.attendance
  );
  const earningsSource = pickObject(
    details.earnings_and_deductions?.earnings,
    details.earningsAndDeductions?.earnings,
    details.earnings
  );
  const deductionsSource = pickObject(
    details.earnings_and_deductions?.deductions,
    details.earningsAndDeductions?.deductions,
    details.deductions
  );
  const reimbursementSource = pickObject(
    details.reimbursement_summary,
    details.reimbursementSummary,
    details.reimbursements
  );
  const pfSource = pickObject(
    details.pf_and_pension_balance,
    details.pfAndPensionBalance,
    details.pfBalance
  );
  const incomeTaxSource = pickObject(
    details.incomeTaxCalculation,
    details.incomeTax,
    details.income_tax_calculation
  );
  const investmentSource = pickObject(details.investmentDetails, details.investment_details);
  const hraSource = pickObject(details.hraDetails, details.hra_details);
  const perqSource = pickObject(details.perqDetails, details.perq_details);
  const remarksSource = pickObject(details.remarks);

  const companyName =
    pickFirst(
      details.company_details?.name,
      details.companyDetails?.name,
      employee.companyName,
      employeeInfo.companyName,
      theme?.companyName
    ) ?? NA;
  const companyAddress =
    pickFirst(
      details.company_details?.address,
      details.companyDetails?.address,
      employee.companyAddress,
      employeeInfo.companyAddress,
      employee.currentCity
    ) ?? NA;

  const wwid = pickFirst(employeeInfo.wwid, employeeInfo.employeeId, employee.employeeId);
  const name = pickFirst(employeeInfo.name, employeeInfo.fullName, employee.fullName);
  const dateOfJoining = pickFirst(
    employeeInfo.date_of_joining,
    employeeInfo.dateOfJoining,
    employeeInfo.createdAt,
    employee.createdAt
  );
  const designation = pickFirst(employeeInfo.designation, employee.designation);
  const costCenter = pickFirst(employeeInfo.cost_center, employeeInfo.costCenter);
  const department = pickFirst(employeeInfo.department, employee.department);
  const location = pickFirst(
    employeeInfo.location,
    employeeInfo.permanentAddress1,
    employee.currentCity,
    employeeInfo.currentCity
  );
  const pfGroup = pickFirst(employeeInfo.pf_group, employeeInfo.pfGroup, bankInfo.pfGroup);
  const pfNo = pickFirst(
    employeeInfo.pf_no,
    employeeInfo.pfNo,
    bankInfo.pfAccountNumber,
    employeeInfo.pfAccountNumber
  );
  const pfUan = pickFirst(
    employeeInfo.pf_uan,
    employeeInfo.pfUan,
    bankInfo.pfUan,
    employeeInfo.UANNumber,
    employee.UANNumber
  );
  const panNo = pickFirst(
    employeeInfo.pan_no,
    employeeInfo.panNo,
    employeeInfo.panCard,
    bankInfo.panNo,
    employee.panCard
  );
  const bankName = pickFirst(
    bankInfo.bankName,
    bankInfo.bank_name,
    employeeInfo.bank_name,
    employee.bankName
  );
  const bankAccountNo = pickFirst(
    bankInfo.bankAccountNumber,
    bankInfo.bank_account_no,
    employeeInfo.bank_account_no,
    employee.bankAccountNumber
  );
  const esiNo = pickFirst(employeeInfo.esi_no, employeeInfo.esiNo, bankInfo.esiNo);
  const sasNo = pickFirst(employeeInfo.sas_no, employeeInfo.sasNo, bankInfo.sasNo);

  const stdDays = pickFirst(
    attendance.std_days,
    attendance.stdDays,
    bankInfo.totalWorkingDays,
    employeeInfo.totalWorkingDays,
    employeeInfo.workingDays
  );
  const daysWkd = pickFirst(
    attendance.days_wkd,
    attendance.daysWkd,
    employeeInfo.daysWorked,
    bankInfo.totalWorkingDays,
    employeeInfo.workingDays
  );
  const lopOmPm = pickFirst(
    attendance.lop_om_pm,
    attendance.lopOmPm,
    employeeInfo.lopOmPm
  );

  const earningsRows = buildFixedRows(earningsSource, EARNINGS_FIXED_ROWS, EARNINGS_LABELS);
  const deductionsRows = buildFixedRows(
    deductionsSource,
    DEDUCTION_FIXED_ROWS,
    DEDUCTION_LABELS,
    ["startingDate"]
  );

  const computedEarningsTotal = sumAmounts(earningsRows);
  const computedDeductionsTotal = sumAmounts(deductionsRows);

  const totalEarnings =
    pickFirst(
      details.netPayCalculation?.grossEarnings,
      details.earnings_and_deductions?.total_earnings,
      details.earningsAndDeductions?.total_earnings,
      details.totalEarnings
    ) ?? (earningsRows.length ? computedEarningsTotal : null);

  const totalDeductions =
    pickFirst(
      details.netPayCalculation?.totalDeductions,
      details.earnings_and_deductions?.total_deductions,
      details.earningsAndDeductions?.total_deductions,
      details.totalDeductions
    ) ?? (deductionsRows.length ? computedDeductionsTotal : null);

  const netPayable =
    pickFirst(
      details.netPayCalculation?.netPayable,
      details.earnings_and_deductions?.net_salary_payable,
      details.earningsAndDeductions?.net_salary_payable,
      details.netSalary
    ) ?? (totalEarnings !== null && totalDeductions !== null ? totalEarnings - totalDeductions : null);

  const netPayableInWords =
    pickFirst(
      details.netPayCalculation?.netPayableInWords,
      details.earnings_and_deductions?.net_salary_in_words,
      details.earningsAndDeductions?.net_salary_in_words
    ) ?? (netPayable !== null ? numberToWords(netPayable) : NA);

  const reimbursementYear =
    pickFirst(
      reimbursementSource.for_year,
      reimbursementSource.forYear,
      details.reimbursement_summary?.for_year,
      details.reimbursementSummary?.forYear
    ) ?? NA;

  const reimbursementRows = [];
  if (Array.isArray(reimbursementSource)) {
    reimbursementSource.forEach((item) => {
      reimbursementRows.push({
        component:
          item.component || item.name || item.expenseType || item.type || item.particular || NA,
        normal: item.normal ?? item.amount ?? item.value ?? item.pellawrt ?? null,
        annual: item.annual ?? item.annualt ?? item.annualAmount ?? null,
      });
    });
  } else if (reimbursementSource && typeof reimbursementSource === "object") {
    const component =
      reimbursementSource.component ||
      reimbursementSource.name ||
      reimbursementSource.expenseType ||
      reimbursementSource.particular;
    const normal =
      reimbursementSource.normal ??
      reimbursementSource.amount ??
      reimbursementSource.value ??
      reimbursementSource.pellawrt;
    const annual =
      reimbursementSource.annual ??
      reimbursementSource.annualt ??
      reimbursementSource.annualAmount;
    if (component || normal !== undefined || annual !== undefined) {
      reimbursementRows.push({
        component: component || NA,
        normal: normal ?? null,
        annual: annual ?? null,
      });
    } else {
      Object.entries(reimbursementSource).forEach(([key, value]) => {
        if (
          typeof value === "number" ||
          (typeof value === "string" && /^[\d.,]+$/.test(value.trim()))
        ) {
          reimbursementRows.push({
            component: humanizeLabel(key),
            normal: value,
            annual: null,
          });
        }
      });
    }
  }
  if (reimbursementRows.length === 0) {
    reimbursementRows.push({ component: NA, normal: null, annual: null });
  }

  const pfBalanceCompany = pickFirst(
    pfSource.pf_balance_company,
    pfSource.pfBalanceCompany,
    pfSource.pfCompanyBalance,
    pfSource.companyBalance,
    pfSource.company,
    details.pfBalance?.company
  );
  const pfBalanceMember = pickFirst(
    pfSource.pf_balance_member,
    pfSource.pfBalanceMember,
    pfSource.pfMemberBalance,
    pfSource.memberBalance,
    pfSource.member,
    details.pfBalance?.member
  );
  const pensionBalance = pickFirst(
    pfSource.pension_balance,
    pfSource.pensionBalance,
    pfSource.pension,
    details.pfBalance?.pension
  );
  const pfBalancePeriod =
    pickFirst(
      pfSource.as_of_period,
      pfSource.asOfPeriod,
      pfSource.balancePeriod,
      pfSource.balance_period,
      details.pfBalance?.period
    ) ?? NA;

  const incomeTaxRows = buildIncomeTaxRows(incomeTaxSource);
  const investmentRows = buildInvestmentRows(investmentSource);
  const perqRows = buildPerqRows(perqSource);

  const hraAmountPerMonth = pickFirst(
    hraSource.amountPerMonth,
    hraSource.hraAmountPerMonth,
    hraSource.amount,
    hraSource.hra_amount_per_month
  );
  const hraStartDate = pickFirst(hraSource.startDate, hraSource.start_date);
  const hraEndDate = pickFirst(hraSource.endDate, hraSource.end_date);

  const financialYear =
    pickFirst(
      details.incomeTaxCalculation?.financialYear,
      details.incomeTax?.financialYear,
      details.income_tax_calculation?.financial_year
    ) ?? `${monthYear.year}-${monthYear.year + 1}`;

  const remarkExpenseEmail = pickFirst(
    remarksSource.expenseEmail,
    remarksSource.expenseReimbursementEmail,
    remarksSource.expense_email
  );
  const remarkCompensationEmail = pickFirst(
    remarksSource.compensationEmail,
    remarksSource.payrollEmail,
    remarksSource.compensation_email
  );
  const remarkHotline = pickFirst(
    remarksSource.hotline,
    remarksSource.hotlineNumber,
    remarksSource.hotline_number
  );

  const periodMonth = new Date(monthYear.year, monthYear.month).toLocaleString(
    "en-US",
    { month: "short" }
  );
  const payslipTitle =
    pickFirst(details.payslip_title, details.payslipTitle) ??
    `Payslip for the month of ${periodMonth}-${monthYear.year}`;

  const downloadAsPDF = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      const logo = await loadImageAsDataURL(theme?.logoImage);
      const adjustmentText = (value) =>
        value === undefined || value === null || value === ""
          ? "-"
          : formatAmount(value);

      const pdfData = {
        title: displayValue(payslipTitle),
        companyName: displayValue(companyName),
        companyAddress: displayValue(companyAddress),
        logo,
        employeeInfoRows: employeeInfoRows.map(([l1, v1, l2, v2]) => [
          l1,
          `: ${displayValue(v1)}`,
          l2,
          `: ${displayValue(v2)}`,
        ]),
        bankInfoRows: bankInfoRows.map(([l1, v1, l2, v2]) =>
          l2
            ? [l1, `: ${displayValue(v1)}`, l2, `: ${displayValue(v2)}`]
            : [l1, `: ${displayValue(v1)}`, { content: "", colSpan: 2 }]
        ),
        attendanceRow: [
          "Std Days",
          `: ${formatDays(stdDays)}`,
          "Days WKD",
          `: ${formatDays(daysWkd)}`,
          "LoP OM PM",
          `: ${displayValue(lopOmPm)}`,
        ],
        earnings: {
          rows: earningsRows.map((row) => [
            displayValue(row.component),
            formatAmount(row.normal),
            adjustmentText(row.adjustment),
          ]),
          total: formatAmount(totalEarnings),
        },
        deductions: {
          rows: deductionsRows.map((row) => [
            displayValue(row.component),
            formatAmount(row.normal),
            adjustmentText(row.adjustment),
          ]),
          total: formatAmount(totalDeductions),
        },
        net: {
          label: "Net Salary Payable",
          amount: formatAmount(netPayable),
          words: displayValue(netPayableInWords),
        },
        reimbursement: {
          year: displayValue(reimbursementYear),
          rows: reimbursementRows.map((row) => [
            "",
            displayValue(row.component),
            formatAmount(row.normal),
            formatAmount(row.annual),
          ]),
        },
        pf: {
          company: formatAmount(pfBalanceCompany),
          member: formatAmount(pfBalanceMember),
          pension: formatAmount(pensionBalance),
          period: displayValue(pfBalancePeriod),
        },
        incomeTax: {
          financialYear: displayValue(financialYear),
          rows: incomeTaxRows.map((row) => [
            displayValue(row.label),
            formatAmount(row.current),
            formatAmount(row.cumulative),
            formatAmount(row.projected),
            formatAmount(row.annual),
          ]),
        },
        investmentRows: investmentRows.map((row) => [
          displayValue(row.label),
          formatAmount(row.value),
        ]),
        hraRows: [
          ["Amount per month", formatAmount(hraAmountPerMonth)],
          ["Start date", formatDate(hraStartDate)],
          ["End date", formatDate(hraEndDate)],
        ],
        perqRows: perqRows.map((row) => [
          displayValue(row.label),
          formatAmount(row.value),
        ]),
        remarks: [
          `This is a system generated payslip by ${displayValue(companyName)}. No signature is required.`,
          `For expense reimbursement, please send mail to ${displayValue(remarkExpenseEmail)}.`,
          `For queries regarding compensation, please send mail to ${displayValue(remarkCompensationEmail)}.`,
          `The Employees Hotline toll free number for India is ${displayValue(remarkHotline)}.`,
        ],
      };

      const employeeName = name || "employee";
      const monthName = new Date(monthYear.year, monthYear.month).toLocaleString(
        "en-US",
        { month: "long" }
      );

      // builds a vector PDF (real text, no screenshot) that always fits on one A4 page
      generatePayslipPdf(
        pdfData,
        `Payslip-${employeeName}-${monthName}-${monthYear.year}.pdf`
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

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

  const employeeInfoRows = [
    ["WWID", wwid, "Department", department],
    ["Name", name, "Location", location],
    ["Date of Joining", formatDate(dateOfJoining), "PF Group", pfGroup],
    ["Designation", designation, "PF No", pfNo],
    ["Cost Center", costCenter, "PF UAN", pfUan],
  ];

  const bankInfoRows = [
    ["PAN No.", panNo, "Bank Name", bankName],
    ["Bank A/c No.", bankAccountNo, "ESI No.", esiNo],
    ["SAS No.", sasNo, "", ""],
  ];

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
          <div
            className="flex justify-between items-center px-6 py-4"
            style={{ backgroundColor: theme?.secondaryColor }}
          >
            <h2 className="text-lg md:text-xl font-bold text-black">
              Payslip – {displayValue(name)}
            </h2>
            <div className="flex items-center gap-3">
              <Button
                text={downloading ? "Generating..." : "Download Payslip"}
                variant={1}
                onClick={downloadAsPDF}
                disabled={!employeePaySlipDetails || downloading}
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

          {/* Scroll wrapper: small screens scroll sideways instead of squeezing the slip */}
          <div className="overflow-x-auto bg-gray-100 p-2">
            <div
              className="bg-white p-4 mx-auto"
              style={{
                width: `${SLIP_WIDTH_PX}px`,
                fontSize: "10px",
                lineHeight: "1.3",
                fontFamily: "Arial, sans-serif",
                color: "#111827",
                boxSizing: "border-box",
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex flex-col items-center flex-1">
                  <img
                    className="h-12"
                    src={theme?.logoImage}
                    alt="logo"
                    crossOrigin="anonymous"
                  />
                  {/* <div
                    className="text-[11px] font-semibold mt-1"
                    style={{ color: "#a08b4b", fontFamily: "Georgia, serif" }}
                  >
                    {displayValue(companyName)}
                  </div> */}
                </div>
                <div className="text-right text-[9px] max-w-[40%] leading-tight">
                  {displayValue(companyAddress)}
                </div>
              </div>

              <div className="text-center font-semibold border-y-2 border-black py-1">
                {displayValue(payslipTitle)}
              </div>

              <table className="w-full border-collapse border border-black mt-2">
                <tbody>
                  {employeeInfoRows.map(([label1, value1, label2, value2], index) => (
                    <tr key={`employee-info-${index}`}>
                      <td className="border border-black px-2 py-[2px] font-semibold whitespace-nowrap w-[12%]">
                        {label1}
                      </td>
                      <td className="border border-black px-2 py-[2px] w-[38%]">
                        : {displayValue(value1)}
                      </td>
                      <td className="border border-black px-2 py-[2px] font-semibold whitespace-nowrap w-[12%]">
                        {label2}
                      </td>
                      <td className="border border-black px-2 py-[2px] w-[38%]">
                        : {displayValue(value2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="w-full border-collapse border border-black mt-2">
                <tbody>
                  {bankInfoRows.map(([label1, value1, label2, value2], index) => (
                    <tr key={`bank-info-${index}`}>
                      <td className="border border-black px-2 py-[2px] font-semibold whitespace-nowrap w-[12%]">
                        {label1}
                      </td>
                      <td className="border border-black px-2 py-[2px] w-[38%]">
                        : {displayValue(value1)}
                      </td>
                      {label2 ? (
                        <>
                          <td className="border border-black px-2 py-[2px] font-semibold whitespace-nowrap w-[12%]">
                            {label2}
                          </td>
                          <td className="border border-black px-2 py-[2px] w-[38%]">
                            : {displayValue(value2)}
                          </td>
                        </>
                      ) : (
                        <td
                          className="border border-black px-2 py-[2px]"
                          colSpan={2}
                        ></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="w-full border-collapse border border-black mt-2">
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-[2px] font-semibold whitespace-nowrap">
                      Std Days
                    </td>
                    <td className="border border-black px-2 py-[2px]">
                      : {formatDays(stdDays)}
                    </td>
                    <td className="border border-black px-2 py-[2px] font-semibold whitespace-nowrap">
                      Days WKD
                    </td>
                    <td className="border border-black px-2 py-[2px]">
                      : {formatDays(daysWkd)}
                    </td>
                    <td className="border border-black px-2 py-[2px] font-semibold whitespace-nowrap">
                      LoP OM PM
                    </td>
                    <td className="border border-black px-2 py-[2px]">
                      : {displayValue(lopOmPm)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 border border-black mt-2">
                <div className="border-r border-black">
                  <div className="text-center font-semibold border-b border-black py-[2px]">
                    Earnings
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b border-r border-black px-2 py-[2px] text-left">
                          Component
                        </th>
                        <th className="border-b border-r border-black px-2 py-[2px] text-right">
                          Normal
                        </th>
                        <th className="border-b border-black px-2 py-[2px] text-right">
                          Adjustment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {earningsRows.map((row, index) => (
                        <tr key={`earning-${index}`}>
                          <td className="border-b border-r border-black px-2 py-[2px]">
                            {row.component}
                          </td>
                          <td className="border-b border-r border-black px-2 py-[2px] text-right">
                            {formatAmount(row.normal)}
                          </td>
                          <td className="border-b border-black px-2 py-[2px] text-right">
                            {row.adjustment === undefined ||
                            row.adjustment === null ||
                            row.adjustment === ""
                              ? "-"
                              : formatAmount(row.adjustment)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="border-t border-r border-black px-2 py-[2px] font-semibold">
                          Total Earnings
                        </td>
                        <td className="border-t border-r border-black px-2 py-[2px] text-right font-semibold">
                          {formatAmount(totalEarnings)}
                        </td>
                        <td className="border-t border-black px-2 py-[2px]"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div>
                  <div className="text-center font-semibold border-b border-black py-[2px]">
                    Deductions
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b border-r border-black px-2 py-[2px] text-left">
                          Deduction
                        </th>
                        <th className="border-b border-r border-black px-2 py-[2px] text-right">
                          Normal
                        </th>
                        <th className="border-b border-black px-2 py-[2px] text-right">
                          Adjustment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {deductionsRows.map((row, index) => (
                        <tr key={`deduction-${index}`}>
                          <td className="border-b border-r border-black px-2 py-[2px]">
                            {row.component}
                          </td>
                          <td className="border-b border-r border-black px-2 py-[2px] text-right">
                            {formatAmount(row.normal)}
                          </td>
                          <td className="border-b border-black px-2 py-[2px] text-right">
                            {row.adjustment === undefined ||
                            row.adjustment === null ||
                            row.adjustment === ""
                              ? "-"
                              : formatAmount(row.adjustment)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="border-t border-r border-b border-black px-2 py-[2px] font-semibold">
                          Total Deductions
                        </td>
                        <td className="border-t border-r border-b border-black px-2 py-[2px] text-right font-semibold">
                          {formatAmount(totalDeductions)}
                        </td>
                        <td className="border-t border-b border-black px-2 py-[2px]"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <table className="w-full border-collapse border border-black mt-2">
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-[2px] font-semibold whitespace-nowrap">
                      Net Salary Payable
                    </td>
                    <td className="border border-black px-2 py-[2px] text-right font-semibold">
                      {formatAmount(netPayable)}
                    </td>
                    <td className="border border-black px-2 py-[2px]">
                      - {displayValue(netPayableInWords)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 border border-black mt-2">
                <div className="border-r border-black">
                  <div className="font-semibold border-b border-black px-2 py-[2px]">
                    Reimbursements
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b border-r border-black px-2 py-[2px] text-left">
                          For The year {displayValue(`${monthYear.year}`)}
                        </th>
                        <th className="border-b border-r border-black px-2 py-[2px] text-left">
                          Particular
                        </th>
                        <th className="border-b border-r border-black px-2 py-[2px] text-right">
                          Normal
                        </th>
                        <th className="border-b border-black px-2 py-[2px] text-right">
                          Annual
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reimbursementRows.map((row, index) => (
                        <tr key={`reimbursement-${index}`}>
                          <td className="border-b border-r border-black px-2 py-[2px]"></td>
                          <td className="border-b border-r border-black px-2 py-[2px]">
                            {row.component}
                          </td>
                          <td className="border-b border-r border-black px-2 py-[2px] text-right">
                            {formatAmount(row.normal)}
                          </td>
                          <td className="border-b border-black px-2 py-[2px] text-right">
                            {formatAmount(row.annual)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="font-semibold border-b border-black px-2 py-[2px]">
                    PF &amp; Pension Balance
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b border-r border-black px-2 py-[2px] text-center">
                          PF Balance (Company)
                        </th>
                        <th className="border-b border-r border-black px-2 py-[2px] text-center">
                          PF Balance (Member)
                        </th>
                        <th className="border-b border-black px-2 py-[2px] text-center">
                          Pension Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-b border-r border-black px-2 py-[2px] text-right">
                          {formatAmount(pfBalanceCompany)}
                        </td>
                        <td className="border-b border-r border-black px-2 py-[2px] text-right">
                          {formatAmount(pfBalanceMember)}
                        </td>
                        <td className="border-b border-black px-2 py-[2px] text-right">
                          {formatAmount(pensionBalance)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="border-t border-black px-2 py-[2px] font-semibold"
                          colSpan={3}
                        >
                          {displayValue(pfBalancePeriod)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-[2fr_1fr] border border-black mt-2">
                <div className="border-r border-black">
                  <div className="font-semibold border-b border-black px-2 py-[2px]">
                    Income Tax Calculation on the Financial Year {displayValue(financialYear)}
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b border-r border-black px-1 py-[2px] text-left">
                          Particulars
                        </th>
                        <th className="border-b border-r border-black px-1 py-[2px] text-right">
                          Add Current
                        </th>
                        <th className="border-b border-r border-black px-1 py-[2px] text-right">
                          Add Cumulative
                        </th>
                        <th className="border-b border-r border-black px-1 py-[2px] text-right">
                          Add Projected
                        </th>
                        <th className="border-b border-black px-1 py-[2px] text-right">
                          Annual
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeTaxRows.map((row, index) => (
                        <tr key={`income-tax-${index}`}>
                          <td className="border-b border-r border-black px-1 py-[2px]">
                            {row.label}
                          </td>
                          <td className="border-b border-r border-black px-1 py-[2px] text-right">
                            {formatAmount(row.current)}
                          </td>
                          <td className="border-b border-r border-black px-1 py-[2px] text-right">
                            {formatAmount(row.cumulative)}
                          </td>
                          <td className="border-b border-r border-black px-1 py-[2px] text-right">
                            {formatAmount(row.projected)}
                          </td>
                          <td className="border-b border-black px-1 py-[2px] text-right">
                            {formatAmount(row.annual)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-1 py-[2px]">
                  <div className="font-semibold border-b border-black py-[2px]">
                    Investment Details
                  </div>
                  <table className="w-full border-collapse">
                    <tbody>
                      {investmentRows.map((row, index) => (
                        <tr key={`investment-${index}`}>
                          <td className="border-b border-r border-black px-1 py-[2px]">
                            {row.label}
                          </td>
                          <td className="border-b border-black px-1 py-[2px] text-right">
                            {formatAmount(row.value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="font-semibold border-b border-black py-[2px] mt-1">
                    HRA Details
                  </div>
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border-b border-r border-black px-1 py-[2px]">
                          Amount per month
                        </td>
                        <td className="border-b border-black px-1 py-[2px] text-right">
                          {formatAmount(hraAmountPerMonth)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black px-1 py-[2px]">
                          Start date
                        </td>
                        <td className="border-b border-black px-1 py-[2px] text-right">
                          {formatDate(hraStartDate)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black px-1 py-[2px]">
                          End date
                        </td>
                        <td className="border-b border-black px-1 py-[2px] text-right">
                          {formatDate(hraEndDate)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="font-semibold border-b border-black py-[2px] mt-1">
                    Perq Details
                  </div>
                  <table className="w-full border-collapse">
                    <tbody>
                      {perqRows.map((row, index) => (
                        <tr key={`perq-${index}`}>
                          <td className="border-b border-r border-black px-1 py-[2px]">
                            {row.label}
                          </td>
                          <td className="border-b border-black px-1 py-[2px] text-right">
                            {formatAmount(row.value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-black mt-2">
                <div className="text-center font-semibold border-b border-black py-[2px]">
                  Remarks
                </div>
                <ol className="px-3 py-[2px] text-[8px] list-decimal list-inside space-y-[1px]">
                  <li>
                    This is a system generated payslip by {displayValue(companyName)}. No signature is required.
                  </li>
                  <li>
                    For expense reimbursement, please send mail to{" "}
                    {displayValue(remarkExpenseEmail)}.
                  </li>
                  <li>
                    For queries regarding compensation, please send mail to{" "}
                    {displayValue(remarkCompensationEmail)}.
                  </li>
                  <li>
                    The Employees Hotline toll free number for India is{" "}
                    {displayValue(remarkHotline)}.
                  </li>
                </ol>
              </div>
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