import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaUser,
  FaBuilding,
  FaUserTie,
  FaChartBar,
  FaCalendarWeek,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import useEmpAttendence from "../../../../hooks/unisol/empAttendence/useEmpAttendence";
import employeeRunningLogo from "../../../../assets/images/employeeRunning.png";
import Breadcrumb from "../../../../components/BreadCrumb";
import Profile from "../../../../assets/images/profile-image.png";
import { useTheme } from "../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import Select from "react-select";

const EmployeeAttendenceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    fetchEmpById,
    empById,
    getTwoMonthAttendance,
    twoMonthAttendence,
    getWeeklyAttendance,
    weeklyAttendence,
    loading,
  } = useEmpAttendence();

  const { theme } = useTheme();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [isWeeklyCollapsed, setIsWeeklyCollapsed] = useState(false);
  const [todayDate, setTodayDate] = useState(new Date());
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const yearOptions = years.map((year) => ({
    value: year,
    label: year.toString(),
  }));
  useEffect(() => {
    fetchEmpById(id);
    getWeeklyAttendance(id);
  }, []);
  useEffect(() => {
    getTwoMonthAttendance(id, selectedYear);
  }, [selectedYear]);
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  const onRowClick = (date) => {
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();

    const month = selectedDate.toLocaleString("default", { month: "long" });;
    navigate(`/employeeAttendence/employeeAttendenceDetails/${id}/${year}/${month}`);
  };

  return (
    <div>
      <Breadcrumb
        linkText={[
          { text: "Attendance Management" },
          { text: "Employee Attendance", href: "/employeeAttendence" },
          { text: "Employee Attendence Details" },
        ]}
      />
      <div className="min-h-screen w-full flex flex-col gap-4 pb-6">
        {loading ? (
          <div className="flex justify-center items-center w-full min-h-screen">
            <LoaderSpinner />
          </div>
        ) : (
          <>
            {/* Top Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-x-auto w-full pt-7">
              {/* Clock */}

              <div
                className="relative flex flex-col md:flex-row items-center justify-center md:justify-between px-4 py-6 gap-4 md:gap-6 rounded-lg w-full h-auto"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <p className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-[#424242]">
                    Today
                  </p>
                  <h1 className="text-xs sm:text-sm md:text-base font-medium text-[#424242]">
                    {todayDate.toLocaleDateString("en-GB")}
                  </h1>
                  <h1 className="text-xs sm:text-sm md:text-base font-medium text-[#424242]">
                    {todayDate.toLocaleDateString("en-GB", { weekday: "long" })}
                  </h1>
                </div>

                <div className="flex flex-col items-center xl:items-start text-center md:text-right">
                  <h1 className="text-xs sm:text-sm md:text-base font-medium text-black">
                    Current Time
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl xl:text-4xl font-bold text-black font-mono">
                    {currentTime.toLocaleTimeString()}
                  </p>
                </div>

                <img
                  src={employeeRunningLogo}
                  className="absolute top-[-8%] left-[10%] sm:left-[15%] md:left-[20%] lg:left-[25%] xl:left-[30%] 2xl:left-[35%] w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 hidden md:block"
                  alt=""
                />
              </div>

              {/* Profile */}

              <div
                className="flex flex-col xl:flex-row items-center p-4 sm:p-6  rounded-2xl shadow-lg border border-[#e0e7ff] w-full h-auto"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                <div className="w-full md:w-[70%] xl:w-[60%] flex flex-col justify-center gap-4 pr-0 xl:pr-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#515B96]">
                      {empById?.fullName}
                    </h1>
                  </div>
                  <div className="space-y-3 text-gray-700">
                    {/* Employee ID */}
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm md:text-base gap-1 sm:gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gray-200 text-blue-600 flex-shrink-0">
                        <FaUser className="text-[#515B96]" />
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-semibold whitespace-nowrap">
                          Employee ID:
                        </span>
                        <span className="text-gray-600">
                          {empById?.employeeId}
                        </span>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm md:text-base gap-1 sm:gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gray-200 text-green-600 flex-shrink-0">
                        <FaBuilding className="text-[#515B96]" />
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-semibold whitespace-nowrap">
                          Department:
                        </span>
                        <span className="text-gray-600">
                          {empById?.department}
                        </span>
                      </div>
                    </div>

                    {/* Position */}
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm md:text-base gap-1 sm:gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gray-200 text-purple-600 flex-shrink-0">
                        <FaUserTie className="text-[#515B96]" />
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-semibold whitespace-nowrap">
                          Position:
                        </span>
                        <span className="text-gray-600">
                          {empById?.designation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="flex w-full xl:w-[40%] justify-center items-center mt-6 xl:mt-0">
                  <img
                    className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[160px] md:h-[160px] xl:w-[180px] xl:h-[180px] rounded-full object-cover border-4 border-blue-200 shadow-xl"
                    src={empById?.photo || Profile}
                    alt="Employee Profile"
                  />
                </div>
              </div>
            </div>

            {/* Attendance Summary */}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div
                className="w-full h-[60px]  flex items-center justify-between px-8"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                <div className="flex items-center gap-3">
                  <FaChartBar className="text-blue-600 text-xl" />
                  <h2 className="font-bold text-xl text-gray-700">
                    Attendance Summary
                  </h2>
                </div>
                <div className="flex gap-5">
                  {!isSummaryCollapsed && (
                    <Select
                      options={yearOptions}
                      value={yearOptions.find(
                        (opt) => opt.value === selectedYear
                      )}
                      onChange={(option) =>
                        setSelectedYear(option ? option.value : null)
                      }
                      placeholder="Select Year"
                      isClearable
                      menuPortalTarget={document.body}
                      styles={{
                        container: (base) => ({ ...base, minWidth: 120 }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  )}
                  <button
                    onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
                    className="focus:outline-none"
                  >
                    {isSummaryCollapsed ? (
                      <FaChevronDown className="text-gray-600" />
                    ) : (
                      <FaChevronUp className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              {!isSummaryCollapsed && (
                <div className="px-4 py-4">
                  <div className="w-full">
                    <div className="relative">
                      <table className="w-full text-center table-fixed">
                        <thead className="bg-white sticky top-0 z-10">
                          <tr className="font-semibold text-gray-600 h-[40px] border-b-2 border-gray-300">
                            <th className="px-4 w-1/4">Month</th>
                            <th className="px-4 w-1/4">Present Days</th>
                            <th className="px-4 w-1/4">Absent Days</th>
                            <th className="px-4 w-1/4">Leave Taken</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ maxHeight: 160, overflowY: "auto" }}>
                        <table className="w-full text-center table-fixed">
                          <tbody>
                            {twoMonthAttendence?.map((data) => {
                              const monthIndex = new Date(
                                `${data?.month} 1, ${selectedYear}`
                              ).getMonth();

                              const rowDate = new Date(selectedYear, monthIndex, 1);
                              return (
                                <tr
                                  key={data?._id}
                                  onClick={() => onRowClick(rowDate)}
                                  className="h-[50px] hover:bg-gray-100 transition-colors"
                                  title="Click to view monthly attendance"
                                >
                                  <td className="px-4 w-1/4 font-medium">
                                    {data?.month}
                                  </td>
                                  <td className="px-4 w-1/4">
                                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                      {data?.totalPresent}
                                    </span>
                                  </td>
                                  <td className="px-4 w-1/4">
                                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                      {data?.totalAbsent}
                                    </span>
                                  </td>
                                  <td className="px-4 w-1/4">
                                    <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                                      {data?.totalLeavesTaken}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Weekly Overview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div
                className="w-full h-[60px] bg-opacity-50 flex items-center justify-between px-8"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                <div className="flex items-center gap-3">
                  <FaCalendarWeek className="text-orange-600 text-xl" />
                  <h2 className="font-bold text-xl text-gray-700">
                    Weekly Overview
                  </h2>
                </div>
                <button
                  onClick={() => setIsWeeklyCollapsed(!isWeeklyCollapsed)}
                  className="focus:outline-none"
                >
                  {isWeeklyCollapsed ? (
                    <FaChevronDown className="text-gray-600" />
                  ) : (
                    <FaChevronUp className="text-gray-600" />
                  )}
                </button>
              </div>
              {!isWeeklyCollapsed && (
                <div className="px-4 py-4">
                  <div className="w-full">
                    <div className="relative">
                      <table className="w-full text-center table-fixed">
                        <thead className="bg-white sticky top-0 z-10">
                          <tr className="font-semibold text-gray-600 h-[40px] border-b-2 border-gray-300">
                            <th className="px-4 w-1/4">Date</th>
                            <th className="pr-2 w-1/4">Day</th>
                            <th className="px-4 w-1/4">Status</th>
                            <th className="px-4 w-1/4">Leave Type</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ maxHeight: 320, overflowY: "auto" }}>
                        <table className="w-full text-center table-fixed">
                          <tbody>
                            {weeklyAttendence?.map((data) => (
                              <tr
                                key={data?._id}
                                className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-4 w-1/4 font-medium">
                                  {formatDate(data?.date)}
                                </td>
                                <td className="px-4 w-1/4 text-gray-500">
                                  {data?.day}
                                </td>
                                <td className="px-4 w-1/4">
                                  {data?.status === "Present" ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <FaCheckCircle className="text-green-500" />
                                      <span className=" text-green-700 px-4 py-2 rounded-lg font-medium">
                                        Present
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-2">
                                      <FaTimesCircle className="text-red-500" />
                                      <span className=" text-red-700 px-4 py-2 rounded-lg font-medium">
                                        Absent
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 w-1/4 text-gray-500">
                                  {data?.leaveType || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendenceDetails;
