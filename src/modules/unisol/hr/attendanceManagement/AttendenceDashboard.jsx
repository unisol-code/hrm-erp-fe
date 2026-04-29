import { useEffect, useState } from "react";
import "chart.js/auto";
import { FaSun } from "react-icons/fa";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Breadcrumb from "../../../../components/BreadCrumb";
import useAttendence from "../../../../hooks/unisol/attendence/useAttendence";
import { useTheme } from "../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import Button from "../../../../components/Button";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../../../hooks/auth/usePermissions"
import { useSignIn } from "../../../../hooks/auth/useSignIn";


const AttendenceDashboard = () => {
  const [timeframe, setTimeframe] = useState("daily");
  const [todayDate, setTodayDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { hrDetails } = useSignIn();
  const { canRead } = usePermissions(hrDetails, 'Employee Attendance');
  const getFormattedDate = (date) => date.toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    department: "",
    date: getFormattedDate(todayDate),
  });

  const {
    getAllEmployeeAttendanceDetails,
    getDailyAttendancePercentage,
    getMonthlyAttendance,
    allEmployeeAttendanceDetails,
    dailyAttendancePercentage,
    monthlyAttendance,
    loading,
  } = useAttendence();

  useEffect(() => {
    getAllEmployeeAttendanceDetails(page, limit, filters);
    getDailyAttendancePercentage();
    getMonthlyAttendance();
  }, [page, limit, filters]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const handleRadioButtonChange = (e) => {
    setTimeframe(e.target.value);
  };
  const goToEmployeeAttendance = () => {
    navigate('/employeeAttendence');
  }

  const monthlyData = monthlyAttendance?.data?.map((item) => ({
    label: item?.date,
    value: parseInt(item?.percentage),
  }));

  const dailyData = dailyAttendancePercentage?.data?.map((item) => ({
    label: item?.date,
    value: parseInt(item?.percentage),
  }));

  const data = timeframe === "daily" ? dailyData : monthlyData;
  const { theme } = useTheme();

  return (
    <div className="w-full min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Attendance Management" },
          { text: "Attendance Dashboard"},
        ]}
      />
      {/* Top Container */}
      <div className="bg-white rounded-2xl">
        <div className="flex flex-col lg:flex-row p-2 gap-4 ml-2">
          {/* Real Time Insight */}
          <div className="bg-[#F1F3FF] rounded-lg p-4 flex flex-col items-center w-full lg:w-1/5 h-[352px] overflow-x-auto">
            <div className="flex mt-10">
              <FaSun className="text-yellow-400 text-4xl mb-4" />
              <div>
                <h2 className="text-lg text-gray-500 font-medium">
                  {currentTime.toLocaleTimeString()}
                </h2>
                <p className="text-lg text-gray-600 font-medium">Realtime Insight</p>
                <div className="mt-20">
                  <h3 className="text-lg text-[#252C58] font-medium">Today:</h3>
                  <p className="text-lg text-[#252C58] font-medium">
                    {todayDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Attendance Comparison */}
          <div className="w-full overflow-x-auto">
            <div className="flex justify-between items-center">
              <h2 className="ml-4 mt-2 text-xl font-semibold">Attendance Comparison Chart</h2>
              <div className="flex items-center space-x-4 mr-4 text-sm">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="daily"
                    name="chartView"
                    className="mr-1"
                    onChange={handleRadioButtonChange}
                    defaultChecked
                  />
                  Daily
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="monthly"
                    name="chartView"
                    className="mr-1"
                    onChange={handleRadioButtonChange}
                  />
                  Monthly
                </label>
              </div>
            </div>
            <div className="min-w-[1000px] h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" interval={0} />
                  <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="w-full rounded-2xl bg-[#FFFFFF]">
        {/* Search Header */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 mt-2 py-4 px-8 rounded-t-xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h1 className="text-[#252C58] text-xl whitespace-nowrap">Attendance Overview</h1>
          <div className="flex items-center justify-end gap-4">
            <div className="px-4 py-2 bg-white rounded-md">{new Date(filters.date).toLocaleDateString("en-GB")}</div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full bg-white rounded-b-2xl overflow-hidden">
          <div className="max-h-[495px] overflow-y-scroll w-full">
            <table className="min-w-[650px] w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-base font-semibold text-gray-700">ID</th>
                  <th className="p-3 text-base font-semibold text-gray-700">Employee Name</th>
                  <th className="p-3 text-base font-semibold text-gray-700">Department</th>
                  <th className="p-3 text-base font-semibold text-gray-700">Designation</th>
                  <th className="p-3 text-base font-semibold text-gray-700">Date</th>
                  <th className="p-3 text-base font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Status
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex justify-center items-center w-full py-4">
                        <LoaderSpinner />
                      </div>
                    </td>
                  </tr>
                ) : allEmployeeAttendanceDetails?.data?.employees?.length > 0 ? (
                  allEmployeeAttendanceDetails?.data?.employees.map((attendanceDetail) => (
                    <tr key={attendanceDetail?._id} className="border-b border-gray-300">
                      <td className="p-4 text-[13px] font-normal text-[#252C58]">
                        {attendanceDetail?.empId}
                      </td>
                      <td className="p-4 text-[13px] font-normal text-[#252C58]">
                        {attendanceDetail?.employeeName}
                      </td>
                      <td className="p-4 text-[13px] font-normal text-[#252C58]">
                        {attendanceDetail?.jobTitle}
                      </td>
                      <td className="p-4 text-[13px] font-normal text-[#252C58]">
                        {attendanceDetail?.department}
                      </td>
                      <td className="p-4 text-[13px] font-normal text-[#252C58]">
                        {attendanceDetail?.date &&
                          new Date(attendanceDetail.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="text-[13px] font-normal text-[#252C58] text-left">
                        <h2
                          className={`py-2 px-4 text-center font-semibold rounded-md 
                            ${attendanceDetail?.status === "Present"
                              ? "text-[#03A300] bg-[#B7FFBAC9]"
                              : "text-[#AA0000] bg-[#FFE5EE]"
                            }`}
                        >
                          {attendanceDetail?.status}
                        </h2>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex justify-center items-center w-full py-4 text-gray-700">
                        No Data Found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center px-5 py-5">
            {loading && allEmployeeAttendanceDetails?.data?.employees?.length > 0 ? null : (<Button text="See All" variant={1} onClick={goToEmployeeAttendance} disabled={!canRead} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendenceDashboard;
