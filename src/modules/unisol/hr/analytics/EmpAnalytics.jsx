import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Select from "react-select";
import useAnalytics from "../../../../hooks/unisol/analytics/useAnalytics";
import { useNavigate } from "react-router-dom";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import KPICards from "./KPICards";
import CategoryTabs from "./CategoryTabs";
import ChartRenderer from "./ChartRenderer";
import DrillDownTable from "./DrillDownTable";

const EmpAnalytics = () => {
  const {
    loading,
    empAnalyticsCards,
    fetchEmpAnalytics,
    fetchAnalyticsYear,
    fetchAnalyticsAttendanceTrends,
    analyticsAttendanceTrends,
    analyticsYear,
    fetchAnalyticsEmpAttendance,
    analyticsEmpAttendance,
    fetchAnalyticsLeaveDistribution,
    analyticsLeaveDistribution,
    fetchAnalyticsLeaveDetails,
    analyticsLeaveDetails,
    fetchAnalyticsExpensesTrend,
    analyticsExpensesTrend,
    fetchAnalyticsExpensesDetails,
    analyticsExpensesDetails,
    fetchAnalyticsLoanTrend,
    analyticsLoanTrend,
    fetchAnalyticsLoanDetails,
    analyticsLoanDetails,
    fetchAnalyticsAppraisalTrend,
    analyticsAppraisalTrend,
    fetchAnalyticsAppraisalDetails,
    analyticsAppraisalDetails
  } = useAnalytics();

  const { theme } = useTheme();
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState({ value: "All", label: "All Months" });
  const [activeCategory, setActiveCategory] = useState("overview");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const monthNameToNumber = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12'
  };

  const attendanceDetailsUrl = (id, fallbackYear, fallbackMonth) => {
    const selectedYear = year?.value;
    const selectedMonth = month?.value && month.value !== "All" ? month.value : null;
    const routeYear = selectedYear || fallbackYear || String(new Date().getFullYear());
    let routeMonth = selectedMonth || fallbackMonth || String(new Date().getMonth() + 1);

    if (!/^[0-9]+$/.test(routeMonth)) {
      routeMonth = monthNameToNumber[routeMonth] || String(new Date().getMonth() + 1);
    }

    const paddedMonth = String(routeMonth).padStart(2, '0');
    return `/employeeAttendence/employeeAttendenceDetails/${id}/${routeYear}/${paddedMonth}`;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      await fetchAnalyticsYear();
      setIsInitialLoading(false);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (analyticsYear?.length && !year) {
      setYear({ value: analyticsYear[0], label: analyticsYear[0] });
    }
  }, [analyticsYear, year]);

  useEffect(() => {
    setPage(1);
  }, [year, month]);

  // Main data fetching for charts and trends
  useEffect(() => {
    const selectedYear = year?.value;
    const selectedMonth = month?.value && month.value !== "All" ? month.value : null;

    if (selectedYear) {
      fetchEmpAnalytics(selectedYear, selectedMonth);
      fetchAnalyticsAttendanceTrends(selectedYear, selectedMonth);
      fetchAnalyticsLeaveDistribution(selectedYear, selectedMonth);
      fetchAnalyticsExpensesTrend(selectedYear, selectedMonth);
      fetchAnalyticsLoanTrend(selectedYear, selectedMonth);
      fetchAnalyticsAppraisalTrend(selectedYear, selectedMonth);
    }
  }, [year, month]);

  // Data fetching for drill-down tables based on active category
  useEffect(() => {
    const selectedYear = year?.value;
    const selectedMonth = month?.value && month.value !== "All" ? month.value : null;

    if (!selectedYear) return;

    if (activeCategory === "attendance") {
      fetchAnalyticsEmpAttendance(selectedYear, selectedMonth);
    }

    if (activeCategory === "leaves") {
      fetchAnalyticsLeaveDetails(selectedYear, selectedMonth, page, limit);
    }

    if (activeCategory === "expenses") {
      fetchAnalyticsExpensesDetails(selectedYear, selectedMonth);
    }

    if (activeCategory === "loans") {
      fetchAnalyticsLoanDetails(selectedYear, selectedMonth);
    }

    if (activeCategory === "appraisal") {
      fetchAnalyticsAppraisalDetails(selectedYear, selectedMonth);
    }
  }, [activeCategory, year, month, page, limit]);

  const selectedYear = year?.value;
  const selectedMonth = month?.value && month.value !== "All" ? month.value : null;

  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const yearOptions = analyticsYear?.map((value) => ({ value, label: value })) || [];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '40px',
      borderColor: state.isFocused ? theme.primaryColor : '#D1D5DB',
      boxShadow: state.isFocused ? `0 0 0 2px ${theme.primaryColor}40` : 'none',
      '&:hover': {
        borderColor: state.isFocused ? theme.primaryColor : '#9CA3AF',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? theme.primaryColor : state.isFocused ? `${theme.primaryColor}15` : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:active': {
        backgroundColor: `${theme.primaryColor}30`,
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  // Process attendance data
  const attendanceData = analyticsAttendanceTrends?.length
    ? analyticsAttendanceTrends.map((item) => ({
      label: String(item.name || item.month || "").slice(0, 3),
      value: Number(item.present ?? item.value ?? 0)
    }))
    : [];

  // Process leaves data
  const leaveColors = ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#EC4899", "#F97316"];
  const leavesData = analyticsLeaveDistribution?.length
    ? analyticsLeaveDistribution.map((item, index) => ({
      type: item.name || item.leaveType || item.type || "Unknown",
      value: Number(item.days ?? item.count ?? item.value ?? 0),
      color: leaveColors[index % leaveColors.length]
    }))
    : [];

  const totalLeaveCount = leavesData.reduce((sum, item) => sum + item.value, 0);

  // Process expenses data for both year and month views
  const processExpensesData = () => {
    if (!analyticsExpensesTrend?.length) return [];

    if (selectedMonth) {
      return analyticsExpensesTrend
        .filter(item => item.name && !isNaN(item.name))
        .map((item) => ({
          label: item.name,
          displayLabel: item.name,
          amount: Number(item.total ?? 0)
        }))
        .sort((a, b) => Number(a.label) - Number(b.label));
    } else {
      return analyticsExpensesTrend.map((item) => ({
        label: item.name,
        displayLabel: item.name.slice(0, 3),
        amount: Number(item.total ?? 0)
      }));
    }
  };

  const expensesData = processExpensesData();
  const maxExpenseAmount = Math.max(1, ...expensesData.map(e => e.amount));
  const totalExpenseAmount = expensesData.reduce((sum, item) => sum + item.amount, 0);

  // Process loan data for both year and month views
  const processLoanData = () => {
    if (!analyticsLoanTrend?.length) return [];

    if (selectedMonth) {
      return analyticsLoanTrend
        .filter(item => item.name && !isNaN(item.name))
        .map((item) => ({
          label: item.name,
          displayLabel: item.name,
          amount: Number(item.total ?? 0)
        }))
        .sort((a, b) => Number(a.label) - Number(b.label));
    } else {
      return analyticsLoanTrend.map((item) => ({
        label: item.name,
        displayLabel: item.name.slice(0, 3),
        amount: Number(item.total ?? 0)
      }));
    }
  };

  const loanData = processLoanData();
  const maxLoanAmount = Math.max(1, ...loanData.map(l => l.amount));
  const totalLoanAmount = loanData.reduce((sum, item) => sum + item.amount, 0);

  // Process appraisal data for Leadership vs Business comparison
  const processAppraisalData = () => {
    if (!analyticsAppraisalTrend) return { leadership: {}, business: {} };

    const result = {
      leadership: {},
      business: {}
    };

    // Handle leadership data
    if (analyticsAppraisalTrend.leadership) {
      result.leadership = {
        cycle1: Number(analyticsAppraisalTrend.leadership.cycle1 || 0)
      };
      if (analyticsAppraisalTrend.leadership.cycle2 !== undefined) {
        result.leadership.cycle2 = Number(analyticsAppraisalTrend.leadership.cycle2);
      }
    }

    // Handle business data
    if (analyticsAppraisalTrend.business) {
      result.business = {
        cycle1: Number(analyticsAppraisalTrend.business.cycle1 || 0)
      };
      if (analyticsAppraisalTrend.business.cycle2 !== undefined) {
        result.business.cycle2 = Number(analyticsAppraisalTrend.business.cycle2);
      }
    }

    return result;
  };

  const appraisalData = processAppraisalData();

  // Get max value for Y-axis scaling (considering only available cycles)
  let maxAppraisalValue = 5;
  if (appraisalData.leadership) {
    if (appraisalData.leadership.cycle1) maxAppraisalValue = Math.max(maxAppraisalValue, appraisalData.leadership.cycle1);
    if (appraisalData.leadership.cycle2) maxAppraisalValue = Math.max(maxAppraisalValue, appraisalData.leadership.cycle2);
  }
  if (appraisalData.business) {
    if (appraisalData.business.cycle1) maxAppraisalValue = Math.max(maxAppraisalValue, appraisalData.business.cycle1);
    if (appraisalData.business.cycle2) maxAppraisalValue = Math.max(maxAppraisalValue, appraisalData.business.cycle2);
  }
  const onPageChange = (data) => {
    setPage(data);
    const selectedYear = year?.value;
    const selectedMonth = month?.value && month.value !== "All" ? month.value : null;
    if (selectedYear && activeCategory === "leaves") {
      fetchAnalyticsLeaveDetails(selectedYear, selectedMonth, data, limit);
    }
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
    const selectedYear = year?.value;
    const selectedMonth = month?.value && month.value !== "All" ? month.value : null;
    if (selectedYear && activeCategory === "leaves") {
      fetchAnalyticsLeaveDetails(selectedYear, selectedMonth, 1, data);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  console.log("attendanceData", attendanceData);
  console.log("expensesData", expensesData);
  console.log("loanData", loanData);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] px-2 sm:px-1 py-2 space-y-4">
        {/* KPI Cards */}
        <KPICards empAnalyticsCards={empAnalyticsCards} theme={theme} />
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${theme.primaryColor}15` }}>
                <BarChart3 className="h-6 w-6" style={{ color: theme.primaryColor }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Employee Analytics</h1>
                <p className="text-sm text-gray-500 mt-1">Comprehensive workforce insights & drill-down reports</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 flex-1 lg:justify-end">
              <div className="flex-1 min-w-[100px]">
                <Select
                  value={year}
                  onChange={setYear}
                  options={yearOptions}
                  styles={customStyles}
                  className="text-sm"
                  classNamePrefix="select"
                  isSearchable
                  placeholder="Select Year"
                />
              </div>

              <div className="flex-1 min-w-[100px]">
                <Select
                  value={month}
                  onChange={setMonth}
                  options={monthOptions}
                  styles={customStyles}
                  className="text-sm"
                  classNamePrefix="select"
                  isSearchable
                  isClearable
                  placeholder="Select Month"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          theme={theme}
        />

        {/* Charts */}
        <div className="space-y-4">
          <ChartRenderer
            activeCategory={activeCategory}
            loading={loading}
            attendanceData={attendanceData}
            leavesData={leavesData}
            totalLeaveCount={totalLeaveCount}
            expensesData={expensesData}
            maxExpenseAmount={maxExpenseAmount}
            totalExpenseAmount={totalExpenseAmount}
            loanData={loanData}
            maxLoanAmount={maxLoanAmount}
            totalLoanAmount={totalLoanAmount}
            appraisalData={appraisalData}
            maxAppraisalValue={maxAppraisalValue}
            selectedMonth={selectedMonth}
            monthOptions={monthOptions}
            theme={theme}
          />

          {/* Drill-Down Table */}
          {activeCategory !== 'overview' && (
            <div className="mt-4">
              <DrillDownTable
                activeCategory={activeCategory}
                loading={loading}
                analyticsEmpAttendance={analyticsEmpAttendance}
                analyticsLeaveDetails={analyticsLeaveDetails}
                analyticsExpensesDetails={analyticsExpensesDetails}
                analyticsLoanDetails={analyticsLoanDetails}
                analyticsAppraisalDetails={analyticsAppraisalDetails}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                page={page}
                limit={limit}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
                theme={theme}
                navigate={navigate}
                attendanceDetailsUrl={attendanceDetailsUrl}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpAnalytics;