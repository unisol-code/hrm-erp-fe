import useEmpAttendence from "../../../hooks/unisol/empAttendence/useEmpAttendence";
import { useEffect, useState } from "react";
import employeeRunningLogo from "../../../assets/images/employeeRunning.png";
import Breadcrumb from "../../../components/BreadCrumb";
import Select from "react-select";
import {
  FaRegCalendarAlt,
  FaClock,
  FaUser,
  FaChartBar,
  FaCalendarWeek,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";
import { useTheme } from "../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../components/LoaderSpinner";

const AttendanceHistory = () => {
  const [localLoading, setLocalLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayDate, setTodayDate] = useState(new Date());
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(true);
  const [isWeeklyCollapsed, setIsWeeklyCollapsed] = useState(false);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const { theme } = useTheme();
  const {
    fetchEmpById,
    empById,
    getAttendanceSummary,
    attendenceSummary,
    getTwoMonthAttendance,
    twoMonthAttendence,
    getWeeklyAttendance,
    weeklyAttendence,
    loading,
  } = useEmpAttendence();
  // Emp Id
  const empId = sessionStorage.getItem("empId");

  const yearOptions = years.map((year) => ({
    value: year,
    label: year.toString(),
  }));

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          getAttendanceSummary(empId),
          fetchEmpById(empId),
          getWeeklyAttendance(empId),
        ]);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    if (empId) {
      fetchAllData();
    }
  }, [empId]);

  useEffect(() => {
    getTwoMonthAttendance(empId, selectedYear);
  }, [selectedYear]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}|${month}|${year}`;
  };

  console.log("Attendence Summary: ", attendenceSummary);
  console.log("Two Month Attendece: ", twoMonthAttendence);
  console.log("Weekly Attendence: ", weeklyAttendence);
  console.log("Get Emp By Id: ", empById);

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Dashboard", href: "/EmployeeDashboard" },
          { text: "Attendance History" },
        ]}
      />
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold py-4 px-8 flex items-center rounded-2xl bg-white shadow-lg gap-3">
          <FaRegCalendarAlt className="text-blue-600" /> Attendance History
        </div>

        {loading || localLoading ? (
          <div className="bg-white w-full py-4 flex items-center justify-center">
            <LoaderSpinner />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Employee Info and Current Time Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 p-6 sm:p-8 gap-6">
                {/* Clock Section */}
                <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between px-4 py-6 gap-4 md:gap-6 rounded-lg bg-gradient-to-r from-[rgba(255,211,112,0.29)] to-[#5C6AC5] w-full h-auto">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <p className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-[#424242]">
                      Today
                    </p>
                    <h1 className="text-xs sm:text-sm md:text-base font-medium text-[#424242]">
                      {todayDate.toLocaleDateString("en-GB")}
                    </h1>
                    <h1 className="text-xs sm:text-sm md:text-base font-medium text-[#424242]">
                      {todayDate.toLocaleDateString("en-GB", {
                        weekday: "long",
                      })}
                    </h1>
                  </div>

                  <div className="flex flex-col items-center xl:items-start text-center md:text-right">
                    <h1 className="text-xs sm:text-sm md:text-base font-medium text-[#D9F0C5]">
                      Current Time
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl xl:text-4xl font-bold text-[#D9F0C5] font-mono">
                      {currentTime.toLocaleTimeString()}
                    </p>
                  </div>

                  <img
                    src={employeeRunningLogo}
                    className="absolute top-[-8%] left-[10%] sm:left-[15%] md:left-[20%] lg:left-[25%] xl:left-[30%] 2xl:left-[35%] w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 hidden md:block"
                    alt=""
                  />
                </div>

                {/* Employee Profile Card */}
                <div className="flex flex-col xl:flex-row items-center p-4 sm:p-6 bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] rounded-2xl shadow-lg border border-[#e0e7ff] w-full h-auto">
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
                      src={
                        empById?.photo ||
                        "https://plus.unsplash.com/premium_photo-1690086519096-0594592709d3?q=80&w=2071&auto=format&fit=crop"
                      }
                      alt="Employee Profile"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Summary and Weekly Overview Section - Stacked Vertically */}
            <div className="flex flex-col gap-4">
              {/* Attendance Summary Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="w-full h-[60px] bg-gradient-to-r from-[rgba(255,211,112,0.29)] to-gray-200 flex items-center justify-between px-8">
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
                              {twoMonthAttendence?.map((data) => (
                                <tr
                                  key={data?._id}
                                  className="h-[50px] hover:bg-gray-50 transition-colors"
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
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Weekly Overview Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="w-full h-[60px] bg-gradient-to-r from-[rgba(255,211,112,0.29)] to-gray-200 bg-opacity-50 flex items-center justify-between px-8">
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
                                        <span className="text-green-700 px-4 py-2 rounded-lg font-medium">
                                          Present
                                        </span>
                                      </div>
                                    ) : data?.status === "Holiday" ? (
                                      <div className="flex items-center justify-center gap-2">
                                        <FaRegCalendarAlt className="text-blue-500" />
                                        <span className="text-blue-700 px-4 py-2 rounded-lg font-medium">
                                          Holiday
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center gap-2">
                                        <FaTimesCircle className="text-red-500" />
                                        <span className="text-red-700 px-4 py-2 rounded-lg font-medium">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;
