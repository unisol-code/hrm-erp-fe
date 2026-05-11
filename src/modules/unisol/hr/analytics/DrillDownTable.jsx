import React from "react";
import { Eye } from "lucide-react";
import Pagination from "../../../../components/Pagination";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const DrillDownTable = ({
  activeCategory,
  loading,
  analyticsEmpAttendance,
  analyticsLeaveDetails,
  analyticsExpensesDetails,
  analyticsLoanDetails,
  analyticsAppraisalDetails,
  selectedYear,
  selectedMonth,
  page,
  limit,
  onPageChange,
  onItemsPerPageChange,
  theme,
  navigate,
  attendanceDetailsUrl
}) => {
  const isAttendance = activeCategory === 'attendance';
  const isLeaves = activeCategory === 'leaves';
  const isExpenses = activeCategory === 'expenses';
  const isLoan = activeCategory === 'loans';
  const isAppraisal = activeCategory === 'appraisal';
  const leaveDetails = analyticsLeaveDetails?.leaves || analyticsLeaveDetails || [];
  const leavePagination = analyticsLeaveDetails?.pagination || {};

  console.log("analyticsLoanDetails", analyticsLoanDetails);
  console.log("analyticsAppraisalDetails", analyticsAppraisalDetails);

  // Appraisal Details Table
  if (isAppraisal) {
    const appraisalDetails = analyticsAppraisalDetails || [];
    const appraisalColumns = [
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'fullName', label: 'Employee Name' },
      { key: 'department', label: 'Department' },
      { key: 'leadershipRating', label: 'Leadership Rating' },
      { key: 'businessRating', label: 'Business Rating' },
      { key: 'totalScore', label: 'Total Score' },
    ];

    if (loading && !appraisalDetails.length) {
      return (
        <div className="bg-white rounded-xl shadow-sm border overflow-visible">
          <div className="flex items-center justify-center h-64">
            <LoaderSpinner />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-visible">
        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800">Appraisal Details</h3>
                  <p className="text-sm text-gray-500">Employee-wise appraisal ratings</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/hr/employeeAchievement/appraisalList')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border flex-shrink-0"
                  >
                    <Eye size={16} />
                    View All
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50">
                    {appraisalColumns.map((column) => (
                      <th key={column.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {column.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appraisalDetails.length ? appraisalDetails.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {row.employeeId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {row.photo ? (
                              <img
                                src={row.photo}
                                alt={row.fullName || 'Employee Photo'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-500">No photo</span>
                            )}
                          </div>
                          <span>{row.fullName || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {row.department || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 rounded-full h-2" 
                              style={{ width: `${(parseFloat(row.leadershipRating) / 5) * 100}%` }}
                            />
                          </div>
                          <span className="font-medium">{parseFloat(row.leadershipRating).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 rounded-full h-2" 
                              style={{ width: `${(parseFloat(row.businessRating) / 5) * 100}%` }}
                            />
                          </div>
                          <span className="font-medium">{parseFloat(row.businessRating).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">
                        {parseFloat(row.totalScore).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap min-w-[120px]">
                        <button
                          type="button"
                          className="text-sm font-medium px-3 py-1 rounded-md transition-colors"
                          style={{
                            color: theme.primaryColor,
                            backgroundColor: `${theme.primaryColor}15`
                          }}
                          onClick={() => {
                            const id = row._id;
                            if (id) {
                              navigate(`/hr/employeeAchievement/appraisalList/empWiseAppraisal/${id}`);
                            }
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={appraisalColumns.length + 1}>
                        No appraisal details available for the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loan Details Table
  if (isLoan) {
    const loanDetails = analyticsLoanDetails || [];
    const loanColumns = [
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'fullName', label: 'Employee Name' },
      { key: 'email', label: 'Email' },
      { key: 'department', label: 'Department' },
      { key: 'loanCount', label: 'Loan Count' },
      { key: 'pendingNillLoanRequests', label: 'Pending Nil Loan Requests' },
    ];

    if (loading && !loanDetails.length) {
      return (
        <div className="bg-white rounded-xl shadow-sm border overflow-visible">
          <div className="flex items-center justify-center h-64">
            <LoaderSpinner />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-visible">
        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800">Loan Details</h3>
                  <p className="text-sm text-gray-500">Employee-wise loan information</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/emp_loan_RequestList')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border flex-shrink-0"
                  >
                    <Eye size={16} />
                    View All
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50">
                    {loanColumns.map((column) => (
                      <th key={column.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {column.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loanDetails.length ? loanDetails.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {row.employeeId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {row.photo ? (
                              <img
                                src={row.photo}
                                alt={row.fullName || 'Employee Photo'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-500">No photo</span>
                            )}
                          </div>
                          <span>{row.fullName || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {row.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {row.department || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {row.loanCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {row.pendingNillLoanRequests || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap min-w-[120px]">
                        <button
                          type="button"
                          className="text-sm font-medium px-3 py-1 rounded-md transition-colors"
                          style={{
                            color: theme.primaryColor,
                            backgroundColor: `${theme.primaryColor}15`
                          }}
                          onClick={() => {
                            const id = row.employeeId;
                            if (id) {
                              navigate(`/emp_loan_RequestList/per_Emp_Loan_Request/${id}?year=${selectedYear}&month=${selectedMonth}`);
                            }
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={loanColumns.length + 1}>
                        No loan details available for the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expenses Details Table
  if (isExpenses) {
    const expensesDetails = analyticsExpensesDetails || [];
    const expensesColumns = [
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'employeeName', label: 'Employee Name' },
      { key: 'department', label: 'Department' },
      { key: 'totalExpenses', label: 'Total Expenses (₹)' }
    ];

    if (loading && !expensesDetails.length) {
      return (
        <div className="bg-white rounded-xl shadow-sm border overflow-visible">
          <div className="flex items-center justify-center h-64">
            <LoaderSpinner />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-visible">
        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800">Expenses Details</h3>
                  <p className="text-sm text-gray-500">Employee-wise expense breakdown</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/expensesheet')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border flex-shrink-0"
                  >
                    <Eye size={16} />
                    View All
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50">
                    {expensesColumns.map((column) => (
                      <th key={column.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {column.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expensesDetails.length ? expensesDetails.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {row.employeeId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {row.photo ? (
                              <img
                                src={row.photo}
                                alt={row.employeeName || 'Employee Photo'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-500">No photo</span>
                            )}
                          </div>
                          <span>{row.employeeName || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {row.department || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                        ₹{parseFloat(row.totalExpenses || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap min-w-[120px]">
                        <button
                          type="button"
                          className="text-sm font-medium px-3 py-1 rounded-md transition-colors"
                          style={{
                            color: theme.primaryColor,
                            backgroundColor: `${theme.primaryColor}15`
                          }}
                          onClick={() => {
                            const id = row._id || row.employeeId;
                            if (id) {
                              navigate(`/expensesheet/expensesheetDetail/${id}?year=${selectedYear}&month=${selectedMonth}`);
                            }
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={expensesColumns.length + 1}>
                        No expenses details available for the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Attendance & Leave Details Table
  const data = isAttendance
    ? analyticsEmpAttendance?.employees || []
    : isLeaves
      ? leaveDetails
      : [];

  const attendanceColumns = [
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'presentDays', label: 'Present Days' },
    { key: 'absentDays', label: 'Absent Days' },
    { key: 'leavesTaken', label: 'Leaves Taken' },
  ];

  const leaveColumns = [
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'leaveType', label: 'Leave Type' },
    { key: 'days', label: 'Days' }
  ];

  const columns = isAttendance
    ? attendanceColumns
    : isLeaves
      ? leaveColumns
      : (data[0] ? Object.keys(data[0]).map((key) => ({ key, label: key.replace(/([A-Z_])/g, ' $1').toUpperCase() })) : []);

  const noDataMessage = isAttendance
    ? 'No attendance details available.'
    : isLeaves
      ? 'No leave details available.'
      : `No ${activeCategory} details available.`;

  if (loading && !data.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-visible">
        <div className="flex items-center justify-center h-64">
          <LoaderSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-visible">
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-800">
                  {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Details
                </h3>
                <p className="text-sm text-gray-500">Drill-down view with employee-level data</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
                {!isLeaves && (
                  <button
                    type="button"
                    onClick={() => navigate('/employeeAttendence/monthlyAttendance')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border flex-shrink-0"
                  >
                    <Eye size={16} />
                    View All
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50">
                  {columns.map((column) => (
                    <th key={column.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.length ? data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    {columns.map((column, i) => {
                      const value = row[column.key];
                      return (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {(isAttendance || isLeaves) && column.key === 'employeeName' ? (
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                {row.photo ? (
                                  <img
                                    src={row.photo}
                                    alt={row.employeeName || 'Employee Photo'}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-500">No photo</span>
                                )}
                              </div>
                              <span>{value === null || value === undefined ? '-' : String(value)}</span>
                            </div>
                          ) : value === null || value === undefined ? '-'
                            : typeof value === 'number' ? value
                              : String(value)}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap min-w-[120px]">
                      <button
                        type="button"
                        className="text-sm font-medium px-3 py-1 rounded-md transition-colors"
                        style={{
                          color: theme.primaryColor,
                          backgroundColor: `${theme.primaryColor}15`
                        }}
                        onClick={() => {
                          if (activeCategory === 'attendance') {
                            const id = row._id || row.employeeId;
                            if (id) {
                              navigate(attendanceDetailsUrl(id, row.year, row.month));
                            }
                          } else if (activeCategory === 'leaves') {
                            const id = row._id || row.employeeId;
                            if (id) {
                              navigate(`/leaveManagement/leaveManagementDetails/${id}`);
                            }
                          }
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={columns.length + 1}>
                      {noDataMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isLeaves && data.length > 0 && (
        <Pagination
          currentPage={leavePagination.page || page}
          totalPages={leavePagination.totalPages || 1}
          totalItems={leavePagination.total || leaveDetails.length}
          itemsPerPage={limit}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default DrillDownTable;