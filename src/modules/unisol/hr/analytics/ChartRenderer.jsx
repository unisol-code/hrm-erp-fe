import React from "react";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const ChartRenderer = ({
  activeCategory,
  loading,
  attendanceData,
  leavesData,
  totalLeaveCount,
  expensesData,
  maxExpenseAmount,
  totalExpenseAmount,
  loanData,
  maxLoanAmount,
  totalLoanAmount,
  appraisalData,
  maxAppraisalValue,
  selectedMonth,
  monthOptions,
  theme
}) => {
  if (loading && !attendanceData.length && !leavesData.length && !expensesData.length && !loanData.length && !appraisalData?.leadership?.length) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-center h-64">
          <LoaderSpinner />
        </div>
      </div>
    );
  }

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Generate Y-axis labels for attendance (percentage) - starts from 0
  const getAttendanceYAxisLabels = () => {
    const maxValue = Math.max(...attendanceData.map(d => d.value), 100);
    const steps = 5;
    const labels = [];
    for (let i = 0; i <= steps; i++) {
      const value = Math.ceil((maxValue / steps) * i);
      labels.push({ value, label: `${value}%` });
    }
    return labels.reverse();
  };

  // Generate Y-axis labels for expenses (amount) - starts from 0
  const getExpensesYAxisLabels = () => {
    const maxValue = maxExpenseAmount;
    const steps = 5;
    const labels = [];
    for (let i = 0; i <= steps; i++) {
      const value = Math.ceil((maxValue / steps) * i);
      labels.push({ value, label: formatCurrency(value) });
    }
    return labels.reverse();
  };

  // Generate Y-axis labels for loans (amount) - starts from 0
  const getLoanYAxisLabels = () => {
    const maxValue = maxLoanAmount;
    const steps = 5;
    const labels = [];
    for (let i = 0; i <= steps; i++) {
      const value = Math.ceil((maxValue / steps) * i);
      labels.push({ value, label: formatCurrency(value) });
    }
    return labels.reverse();
  };

  // Render Attendance Chart with Y-axis
  const renderAttendanceChart = () => {
    const yAxisLabels = getAttendanceYAxisLabels();
    const chartHeight = 200;
    const maxValue = Math.max(...attendanceData.map(d => d.value), 100);
    const isHighDensity = attendanceData.length > 15;
    const itemMultiplier = isHighDensity ? 30 : 40;
    const gapClass = isHighDensity ? "gap-1.5" : "gap-3";
    const itemMinWidth = isHighDensity ? "min-w-[20px]" : "min-w-[32px]";

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Attendance Trend</h3>
            <p className="text-sm text-gray-500">Monthly attendance percentage</p>
          </div>
          <div className="text-sm font-medium text-gray-600">
            Total Average: {Math.round(attendanceData.reduce((sum, d) => sum + d.value, 0) / (attendanceData.length || 1))}%
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoaderSpinner />
          </div>
        ) : (
          <div className="flex">
            <div className="flex flex-col justify-between pr-3 text-right" style={{ height: `${chartHeight}px` }}>
              {yAxisLabels.map((label, idx) => (
                <div key={idx} className="text-xs text-gray-500" style={{ lineHeight: '1.2' }}>
                  {label.label}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-x-auto">
              <div
                className="relative"
                style={{ minWidth: `${Math.max(attendanceData.length * itemMultiplier, 500)}px` }}
              >
                <div className="absolute top-0 left-0 right-0 flex flex-col justify-between pointer-events-none border-b border-gray-200" style={{ height: `${chartHeight}px` }}>
                  {yAxisLabels.map((_, idx) => (
                    <div key={idx} className="border-t border-gray-200 w-full" />
                  ))}
                </div>

                <div className={`flex items-start ${gapClass}`}>
                  {attendanceData.map((item, index) => {
                    const barHeight = (item.value / maxValue) * chartHeight;
                    return (
                      <div key={index} className={`flex flex-col items-center flex-1 ${itemMinWidth}`}>
                        <div className="relative w-full flex justify-center items-end" style={{ height: `${chartHeight}px` }}>
                          <div
                            className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer group"
                            style={{
                              height: `${barHeight}px`,
                              backgroundColor: theme.primaryColor,
                              opacity: 0.7 + (index * 0.015)
                            }}
                            title={`${item.value}%`}
                          >
                            {item.value > 0 && (
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                                {item.value}%
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 font-medium">
                          {item.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Expenses Chart with Y-axis
  const renderExpensesChart = () => {
    const yAxisLabels = getExpensesYAxisLabels();
    const chartHeight = 200;
    const maxValue = maxExpenseAmount;
    const isHighDensity = expensesData.length > 15;
    const itemMultiplier = isHighDensity ? 30 : 40;
    const gapClass = isHighDensity ? "gap-1.5" : "gap-3";
    const itemMinWidth = isHighDensity ? "min-w-[20px]" : "min-w-[32px]";

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Expenses Trend</h3>
            <p className="text-sm text-gray-500">
              {selectedMonth
                ? `Daily expense analysis for ${monthOptions.find(m => m.value === selectedMonth)?.label || selectedMonth}`
                : "Monthly expense analysis"}
            </p>
          </div>
          <div className="text-sm font-medium text-gray-600">
            Total: {formatCurrency(totalExpenseAmount)}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoaderSpinner />
          </div>
        ) : (
          <div className="flex">
            <div className="flex flex-col justify-between pr-3 text-right" style={{ height: `${chartHeight}px` }}>
              {yAxisLabels.map((label, idx) => (
                <div key={idx} className="text-xs text-gray-500" style={{ lineHeight: '1.2' }}>
                  {label.label}
                </div>
              ))}
            </div>
            {/* whitespace-nowrap */}
            <div className="flex-1 overflow-x-auto">
              <div
                className="relative"
                style={{ minWidth: `${Math.max(expensesData.length * itemMultiplier, 500)}px` }}
              >
                <div className="absolute top-0 left-0 right-0 flex flex-col justify-between pointer-events-none border-b border-gray-200" style={{ height: `${chartHeight}px` }}>
                  {yAxisLabels.map((_, idx) => (
                    <div key={idx} className="border-t border-gray-200 w-full" />
                  ))}
                </div>

                <div className={`flex items-start ${gapClass}`}>
                  {expensesData.map((item, index) => {
                    const barHeight = maxValue > 0 ? (item.amount / maxValue) * chartHeight : 0;
                    return (
                      <div key={`${item.label}-${index}`} className={`flex flex-col items-center flex-1 ${itemMinWidth}`}>
                        <div className="relative w-full flex justify-center items-end" style={{ height: `${chartHeight}px` }}>
                          <div
                            className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer group"
                            style={{
                              height: `${barHeight}px`,
                              backgroundColor: theme.primaryColor,
                              opacity: 0.7 + (index * 0.015)
                            }}
                            title={formatCurrency(item.amount)}
                          >
                            {item.amount > 0 && (
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                                {formatCurrency(item.amount)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 font-medium">
                          {item.displayLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {!loading && expensesData.length === 0 && (
          <div className="flex items-center justify-center h-48 text-gray-500">
            No expense data available for the selected period
          </div>
        )}
      </div>
    );
  };

  // Render Loans Chart with Y-axis
  const renderLoansChart = () => {
    const yAxisLabels = getLoanYAxisLabels();
    const chartHeight = 200;
    const maxValue = maxLoanAmount;
    const isHighDensity = loanData.length > 15;
    const itemMultiplier = isHighDensity ? 30 : 40;
    const gapClass = isHighDensity ? "gap-1.5" : "gap-3";
    const itemMinWidth = isHighDensity ? "min-w-[20px]" : "min-w-[32px]";

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Loan Distribution</h3>
            <p className="text-sm text-gray-500">
              {selectedMonth
                ? `Daily loan analysis for ${monthOptions.find(m => m.value === selectedMonth)?.label || selectedMonth}`
                : "Monthly loan analysis"}
            </p>
          </div>
          <div className="text-sm font-medium text-gray-600">
            Total: {formatCurrency(totalLoanAmount)}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoaderSpinner />
          </div>
        ) : (
          <div className="flex">
            <div className="flex flex-col justify-between pr-3 text-right" style={{ height: `${chartHeight}px` }}>
              {yAxisLabels.map((label, idx) => (
                <div key={idx} className="text-xs text-gray-500 whitespace-nowrap" style={{ lineHeight: '1.2' }}>
                  {label.label}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-x-auto">
              <div
                className="relative"
                style={{ minWidth: `${Math.max(loanData.length * itemMultiplier, 500)}px` }}
              >
                <div className="absolute top-0 left-0 right-0 flex flex-col justify-between pointer-events-none border-b border-gray-200" style={{ height: `${chartHeight}px` }}>
                  {yAxisLabels.map((_, idx) => (
                    <div key={idx} className="border-t border-gray-200 w-full" />
                  ))}
                </div>

                <div className={`flex items-start ${gapClass}`}>
                  {loanData.map((item, index) => {
                    const barHeight = maxValue > 0 ? (item.amount / maxValue) * chartHeight : 0;
                    return (
                      <div key={`${item.label}-${index}`} className={`flex flex-col items-center flex-1 ${itemMinWidth}`}>
                        <div className="relative w-full flex justify-center items-end" style={{ height: `${chartHeight}px` }}>
                          <div
                            className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer group"
                            style={{
                              height: `${barHeight}px`,
                              backgroundColor: theme.primaryColor,
                              opacity: 0.7 + (index * 0.015)
                            }}
                            title={formatCurrency(item.amount)}
                          >
                            {item.amount > 0 && (
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                                {formatCurrency(item.amount)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 font-medium">
                          {item.displayLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {!loading && loanData.length === 0 && (
          <div className="flex items-center justify-center h-48 text-gray-500">
            No loan data available for the selected period
          </div>
        )}
      </div>
    );
  };

  // Render Appraisal Chart - Modern Card/Radial Gauge Design
  const renderAppraisalChart = () => {
    // Determine which cycle to show based on selected month
    let cycles = [];
    let currentCycleLabel = "";

    if (selectedMonth) {
      const monthNum = Number(selectedMonth);
      if (monthNum >= 1 && monthNum <= 6) {
        cycles = ["cycle1"];
        currentCycleLabel = "January - June Cycle";
      } else {
        cycles = ["cycle2"];
        currentCycleLabel = "July - December Cycle";
      }
    } else {
      cycles = ["cycle1", "cycle2"];
    }

    const cycleLabels = {
      cycle1: "January - June",
      cycle2: "July - December"
    };

    // Get data for display
    const leadershipValue = cycles.length === 1
      ? Number(appraisalData.leadership?.[cycles[0]] || 0)
      : null;
    const businessValue = cycles.length === 1
      ? Number(appraisalData.business?.[cycles[0]] || 0)
      : null;

    // For year view, calculate averages
    const avgLeadership = cycles.reduce((sum, cycle) => sum + Number(appraisalData.leadership?.[cycle] || 0), 0) / cycles.length;
    const avgBusiness = cycles.reduce((sum, cycle) => sum + Number(appraisalData.business?.[cycle] || 0), 0) / cycles.length;

    // Colors
    const leadershipColor = "#8B5CF6";
    const businessColor = "#F59E0B";

    // Radial gauge component
    const RadialGauge = ({ value, label, color, size = 120 }) => {
      const radius = size / 2;
      const circumference = 2 * Math.PI * (radius - 10);
      const progress = (value / 9) * circumference;
      const dashOffset = circumference - progress;

      return (
        <div className="flex flex-col items-center">
          <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius - 10}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius - 10}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color }}>
                {value.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">/ 9</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-semibold text-gray-800">{label}</p>
          </div>
        </div>
      );
    };

    const MetricCard = ({ title, value, color, icon: Icon }) => (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
            <Icon size={16} style={{ color }} />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold" style={{ color }}>{value.toFixed(2)}</span>
          <span className="text-sm text-gray-500">/ 9</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${(value / 9) * 100}%, backgroundColor: color` }}
          />
        </div>
      </div>
    );

    // Icons
    const LeadershipIcon = () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );

    const BusinessIcon = () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );

    const hasData = cycles.some(cycle =>
      (appraisalData.leadership?.[cycle] > 0) || (appraisalData.business?.[cycle] > 0)
    );

    if (!hasData && !loading) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-center h-48 text-gray-500">
            No appraisal data available for the selected period
          </div>
        </div>
      );
    }

    // Single cycle view (month selected)
    if (selectedMonth && cycles.length === 1) {
      const cycle = cycles[0];
      const leadershipRating = Number(appraisalData.leadership?.[cycle] || 0);
      const businessRating = Number(appraisalData.business?.[cycle] || 0);
      const totalScore = leadershipRating + businessRating;

      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Appraisal Overview</h3>
              <p className="text-sm text-gray-500">
                {monthOptions.find(m => m.value === selectedMonth)?.label || selectedMonth} - {currentCycleLabel}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center gap-8">
              <RadialGauge
                value={leadershipRating}
                label="Leadership"
                color={leadershipColor}
                size={140}
              />
              <RadialGauge
                value={businessRating}
                label="Business"
                color={businessColor}
                size={140}
              />
            </div>

            <div className="space-y-4">
              <MetricCard
                title="Leadership Rating"
                value={leadershipRating}
                color={leadershipColor}
                icon={LeadershipIcon}
              />
              <MetricCard
                title="Business Rating"
                value={businessRating}
                color={businessColor}
                icon={BusinessIcon}
              />
            </div>
          </div>
        </div>
      );
    }

    // Year view (no month selected) - show both cycles
    const cycle1Leadership = Number(appraisalData.leadership?.cycle1 || 0);
    const cycle1Business = Number(appraisalData.business?.cycle1 || 0);
    const cycle2Leadership = Number(appraisalData.leadership?.cycle2 || 0);
    const cycle2Business = Number(appraisalData.business?.cycle2 || 0);

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Appraisal Trend</h3>
            <p className="text-sm text-gray-500">Leadership & Business performance comparison</p>
          </div>
        </div>

        {/* Cycle 1 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h4 className="text-sm font-semibold text-gray-700">January - June Cycle</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Leadership Rating"
              value={cycle1Leadership}
              color={leadershipColor}
              icon={LeadershipIcon}
            />
            <MetricCard
              title="Business Rating"
              value={cycle1Business}
              color={businessColor}
              icon={BusinessIcon}
            />
          </div>
        </div>

        {/* Cycle 2 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <h4 className="text-sm font-semibold text-gray-700">July - December Cycle</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Leadership Rating"
              value={cycle2Leadership}
              color={leadershipColor}
              icon={LeadershipIcon}
            />
            <MetricCard
              title="Business Rating"
              value={cycle2Business}
              color={businessColor}
              icon={BusinessIcon}
            />
          </div>
        </div>

        {/* Summary Section */}
        {(cycle1Leadership > 0 || cycle1Business > 0 || cycle2Leadership > 0 || cycle2Business > 0) && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Leadership Average</p>
                <p className="text-lg font-bold" style={{ color: leadershipColor }}>{avgLeadership.toFixed(2)}</p>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div className="rounded-full h-1" style={{ width: `${(avgLeadership / 9) * 100}%, backgroundColor: leadershipColor` }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Business Average</p>
                <p className="text-lg font-bold" style={{ color: businessColor }}>{avgBusiness.toFixed(2)}</p>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div className="rounded-full h-1" style={{ width: `${(avgBusiness / 9) * 100}%, backgroundColor: businessColor` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Leaves Chart
  const renderLeavesChart = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Leave Distribution</h3>
          <p className="text-sm text-gray-500">Breakdown by leave type</p>
        </div>
        <div className="text-sm font-medium text-gray-600">
          Total: {totalLeaveCount} days
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoaderSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{totalLeaveCount}</div>
                  <div className="text-sm text-gray-500">Total Leaves</div>
                </div>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#E5E7EB"
                  strokeWidth="16"
                  fill="none"
                />
                {leavesData.map((item, index, array) => {
                  const total = array.reduce((sum, i) => sum + i.value, 0);
                  const cumulative = array.slice(0, index).reduce((sum, i) => sum + i.value, 0);
                  const offset = (cumulative / total) * 251.2;
                  const length = (item.value / total) * 251.2;

                  return (
                    <circle
                      key={item.type}
                      cx="96"
                      cy="96"
                      r="80"
                      stroke={item.color}
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${length} 251.2`}
                      strokeDashoffset={-offset}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="space-y-4">
            {leavesData.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.type}</span>
                </div>
                <div className="text-sm font-semibold text-gray-800">{item.value} days</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // For specific category views
  if (activeCategory === "attendance") {
    return renderAttendanceChart();
  }

  if (activeCategory === "leaves") {
    return renderLeavesChart();
  }

  if (activeCategory === "expenses") {
    return renderExpensesChart();
  }

  if (activeCategory === "loans") {
    return renderLoansChart();
  }

  if (activeCategory === "appraisal") {
    return renderAppraisalChart();
  }

  // For Overview category - show all charts in a grid
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {renderAttendanceChart()}
      {renderLeavesChart()}
      {renderExpensesChart()}
      {renderLoansChart()}
      {renderAppraisalChart()}
    </div>
  );
};

export default ChartRenderer;