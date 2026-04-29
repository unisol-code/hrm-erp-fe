import React, { useEffect } from "react";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useAttendence from "../../../../../hooks/unisol/attendence/useAttendence";
import { useParams } from "react-router-dom";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const LeaveSummary = () => {
  const { empId } = useParams();
  const { getEmployeeLeaveSummary, employeeLeaveSummary, loading } = useAttendence();
  const { theme } = useTheme();

  useEffect(() => {
    getEmployeeLeaveSummary(empId);
  }, []);

  // Small reusable card for stats
  const StatCard = ({ label, value, color }) => (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-lg font-semibold ${color}`}>{value ?? "-"}</p>
    </div>
  );

  return (
    <div className="w-full rounded-2xl mt-4 h-[570px] bg-white shadow-lg border border-gray-200 overflow-y-auto">
      {/* Header */}
      <div
        className="flex justify-between items-center w-full px-8 py-5 rounded-t-2xl"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <h1 className="text-black text-xl font-semibold tracking-wide">
          Leave Summary
        </h1>
      </div>

    {
      loading?(<div className="flex w-full h-full items-center justify-center"><LoaderSpinner/></div>):(  <div className="p-6 space-y-8">
        {/* Overall Summary */}
        {/* <div className="rounded-xl p-5 border border-gray-200 bg-gray-50">
          <h2 className="text-gray-700 font-semibold mb-4">Overall Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Leaves" value={employeeLeaveSummary?.totalLeavesTaken} color="text-blue-600" />
            <StatCard label="Leave Balance" value={employeeLeaveSummary?.leaveBalance} color="text-green-600" />
            <StatCard label="Upcoming Leaves" value={employeeLeaveSummary?.upcomingLeaves} color="text-purple-600" />
          </div>
        </div> */}

        {/* Casual Leaves */}
        <div className="rounded-xl p-5 border border-gray-200 bg-gray-50">
          <h2 className="text-gray-700 font-semibold mb-4">Casual Leaves</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Leaves" value={employeeLeaveSummary?.LeaveSummary[0]?.CasualLeave?.TotalLeave ?? "N/A"} color="text-blue-600" />
            <StatCard label="Leave Balance" value={employeeLeaveSummary?.LeaveSummary[0]?.CasualLeave?.PendingLeave ?? "N/A"} color="text-green-600" />
            <StatCard label="Leave Taken" value={employeeLeaveSummary?.LeaveSummary[0]?.CasualLeave?.LeaveTaken ?? "N/A"} color="text-red-500" />
          </div>
        </div>

        {/* Sick Leaves */}
        <div className="rounded-xl p-5 border border-gray-200 bg-gray-50">
          <h2 className="text-gray-700 font-semibold mb-4">Sick Leaves</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Leaves" value={employeeLeaveSummary?.LeaveSummary[1]?.SickLeave?.TotalLeave ?? "N/A"} color="text-blue-600" />
            <StatCard label="Leave Balance" value={employeeLeaveSummary?.LeaveSummary[1]?.SickLeave?.PendingLeave ?? "N/A"} color="text-green-600" />
            <StatCard label="Leave Taken" value={employeeLeaveSummary?.LeaveSummary[1]?.SickLeave?.LeaveTaken ?? "N/A"} color="text-red-500" />
          </div>
        </div>

        {/* Festival Leaves */}
        {/* <div className="rounded-xl p-5 border border-gray-200 bg-gray-50">
          <h2 className="text-gray-700 font-semibold mb-4">Festival Leaves</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Leaves" value="3" color="text-blue-600" />
            <StatCard label="Leave Balance" value="1" color="text-green-600" />
            <StatCard label="Leave Taken" value="2" color="text-red-500" />
          </div>
        </div> */}
      </div>)
    }
    </div>
  );
};

export default LeaveSummary;
