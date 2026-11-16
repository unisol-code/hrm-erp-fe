import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCalendarTimes,
  FaHome,
  FaSun,
  FaUmbrellaBeach,
  FaUserCircle,
} from "react-icons/fa";
import BreadCrumb from "../../../../../components/BreadCrumb";
import Button from "../../../../../components/Button";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useEmpAttendence from "../../../../../hooks/unisol/empAttendence/useEmpAttendence";

const YearlyEmpWise = () => {
  const { id, year: yearParam } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const query = new URLSearchParams(window.location.search);
  const year = yearParam || query.get("year") || new Date().getFullYear();

  const {
    loading,
    fetchYearlyAttendanceOfEmployee,
    employeeYearlyAttendanceOfEmployee,
  } = useEmpAttendence();

  useEffect(() => {
    if (id) {
      fetchYearlyAttendanceOfEmployee(id, year);
    }
  }, [id, year]);

  const data =
    employeeYearlyAttendanceOfEmployee?.data || employeeYearlyAttendanceOfEmployee;
  const summary = data?.summary || {};
  const months = data?.monthlyAttendance || [];

  const workingDays = summary.workingDays || 0;
  const attendancePercent =
    workingDays > 0 ? Math.round(((summary.present || 0) / workingDays) * 100) : 0;

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Dashboard", href: "/hrDashboard" },
          { text: "Attendance", href: "/employeeAttendence" },
          {
            text: "Employee Details",
            href: `/employeeAttendence/employeeAttendenceDetails/${id}`,
          },
          { text: "Yearly Attendance" },
        ]}
        className="bg-white p-3 rounded-lg shadow-sm"
      />

      <div className="mt-4">
        <Button
          variant={2}
          text="Back"
          onClick={() => navigate(`/employeeAttendence/employeeAttendenceDetails/${id}`)}
          className="mb-4"
        />

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px] bg-white rounded-xl shadow">
            <LoaderSpinner />
          </div>
        ) : !data ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
            No yearly attendance data found
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="md:flex">
              <div
                className="md:w-1/4 p-6 flex flex-col items-center justify-center"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {data.photo ? (
                  <img
                    src={data.photo}
                    alt="Employee"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mb-4"
                  />
                ) : (
                  <FaUserCircle className="w-32 h-32 text-white opacity-90 mb-4" />
                )}
                <h3 className="text-white text-xl font-bold text-center">
                  {data.employeeName || "Employee Name"}
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  Employee ID: {data.employeeId || "N/A"}
                </p>
              </div>

              <div className="md:w-3/4 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      {data.year} Yearly Attendance
                    </h1>
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      Monthly breakdown for the year
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm text-blue-600 font-medium">
                      Attendance:{" "}
                    </span>
                    <span className="text-blue-800 font-semibold">
                      {attendancePercent}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Present</p>
                        <p className="text-2xl font-bold text-green-700 mt-1">
                          {summary.present ?? 0}
                        </p>
                      </div>
                      <FaCalendarCheck className="text-green-600 text-xl" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-600 font-medium">Absent</p>
                        <p className="text-2xl font-bold text-red-700 mt-1">
                          {summary.absent ?? 0}
                        </p>
                      </div>
                      <FaCalendarTimes className="text-red-600 text-xl" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Leaves</p>
                        <p className="text-2xl font-bold text-blue-700 mt-1">
                          {summary.leaves ?? 0}
                        </p>
                      </div>
                      <FaUmbrellaBeach className="text-blue-600 text-xl" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Holidays</p>
                        <p className="text-2xl font-bold text-purple-700 mt-1">
                          {summary.holidays ?? 0}
                        </p>
                      </div>
                      <FaHome className="text-purple-600 text-xl" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Sundays</p>
                        <p className="text-2xl font-bold text-orange-700 mt-1">
                          {summary.sundays ?? 0}
                        </p>
                      </div>
                      <FaSun className="text-orange-600 text-xl" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Working Days</p>
                      <p className="text-2xl font-bold text-gray-700 mt-1">
                        {summary.workingDays ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-800">
                  Monthly Attendance
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Month-wise attendance summary for {data.year}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Present
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Absent
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Leaves
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Holidays
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Sundays
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Working Days
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Days Considered
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {months.length > 0 ? (
                      months.map((m) => (
                        <tr
                          key={m.month}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/employeeAttendence/employeeAttendenceDetails/${id}/${data.year}/${m.month}`
                            )
                          }
                          title="Click to view monthly attendance"
                        >
                          <td className="p-4 font-medium text-gray-800">{m.month}</td>
                          <td className="p-4 text-center">
                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              {m.summary?.present ?? 0}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                              {m.summary?.absent ?? 0}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              {m.summary?.leaves ?? 0}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                              {m.summary?.holidays ?? 0}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                              {m.summary?.sundays ?? 0}
                            </span>
                          </td>
                          <td className="p-4 text-center font-medium text-gray-700">
                            {m.summary?.workingDays ?? 0}
                          </td>
                          <td className="p-4 text-center text-gray-600">
                            {m.daysConsidered ?? 0}/{m.totalDaysInMonth ?? 0}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          No monthly attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearlyEmpWise;