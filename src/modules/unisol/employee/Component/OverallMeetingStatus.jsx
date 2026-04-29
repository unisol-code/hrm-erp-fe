import { useEffect } from "react";
import useEmpDashboard from "../../../../hooks/unisol/empDashboard/empDashboard";
import { RxCalendar } from "react-icons/rx";
import {
  IoPlaySkipForwardOutline,
  IoPlaySkipBackOutline,
} from "react-icons/io5";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const labelIconMap = {
  total: <RxCalendar className="text-blue-500 text-xl" />,
  next: <IoPlaySkipForwardOutline className="text-green-500 text-xl" />,
  last: <IoPlaySkipBackOutline className="text-yellow-500 text-xl" />,
  completed: <FaCheckCircle className="text-green-600 text-xl" />,
  pending: <FaRegClock className="text-orange-400 text-xl" />,
  canceled: <MdCancel className="text-red-500 text-xl" />,
};

const OverallMeetingStatus = () => {
  const { fetchOverallMeetingStatus, overallMeetingStatus, loading } = useEmpDashboard();
  const employeeId = sessionStorage.getItem("empId");

  useEffect(() => {
    fetchOverallMeetingStatus(employeeId);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="py-8 px-6">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center tracking-wide mb-10">
          Overall Meeting Status
        </h2>

        {
          loading ? (<div className="flex w-full items-center justify-center"><LoaderSpinner /></div>) : (
            <div className="space-y-4">
              {/* Total Scheduled Meetings */}
              <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  {labelIconMap.total}
                  <span>Total Scheduled Meetings</span>
                </div>
                <div className="text-xl font-bold text-blue-700 bg-blue-100 px-4 py-1 rounded-full">
                  {overallMeetingStatus?.meetingStats?.totalMeetings || "N/A"}
                </div>
              </div>

              {/* Next Meeting */}
              <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  {labelIconMap.next}
                  <span>Next Meeting</span>
                </div>
                <div className="text-lg font-semibold text-green-700 truncate max-w-xs text-right">
                  {overallMeetingStatus?.nextMeeting?.title || "-"}
                  {overallMeetingStatus?.nextMeeting?.title ? " | " : ""}
                  {overallMeetingStatus?.nextMeeting?.date?new Date(overallMeetingStatus?.nextMeeting?.date).toLocaleDateString("en-GB"):"N/A"}
                </div>
              </div>

              {/* Last Meeting */}
              <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  {labelIconMap.last}
                  <span>Last Meeting</span>
                </div>
                <div className="text-lg font-semibold text-yellow-600 truncate max-w-xs text-right">
                  {overallMeetingStatus?.lastMeeting?.title || "-"}
                  {overallMeetingStatus?.lastMeeting?.title ? " | " : ""}
                  {overallMeetingStatus?.lastMeeting?.date?new Date(overallMeetingStatus?.lastMeeting?.date).toLocaleDateString("en-GB"):"-"}
                </div>
              </div>

              {/* Meetings Completed */}
              <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  {labelIconMap.completed}
                  <span>Meetings Completed</span>
                </div>
                <div className="text-xl font-bold text-green-600 bg-green-100 px-4 py-1 rounded-full">
                  {overallMeetingStatus?.meetingStats?.completedMeetings}
                </div>
              </div>

              {/* Meetings Pending */}
              <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  {labelIconMap.pending}
                  <span>Meetings Pending</span>
                </div>
                <div className="text-xl font-bold text-orange-500 bg-orange-100 px-4 py-1 rounded-full">
                  {overallMeetingStatus?.meetingStats?.pendingMeetings}
                </div>
              </div>

              {/* Meetings Canceled */}
              <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  {labelIconMap.canceled}
                  <span>Meetings Canceled</span>
                </div>
                <div className="text-xl font-bold text-red-500 bg-red-100 px-4 py-1 rounded-full">
                  {overallMeetingStatus?.meetingStats?.canceledMeetings}
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default OverallMeetingStatus;