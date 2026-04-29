import { useEffect, useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineEye,
} from "react-icons/hi";
import ViewMeetingDetails from "../../../../components/Dialogs/meetings/ViewMeetingDetails";
import useEmpDashboard from "../../../../hooks/unisol/empDashboard/empDashboard";

import { Button } from "@mui/material";
import { useTheme } from "../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const UpcomingMeetings = () => {
  const { theme } = useTheme();
  const [openViewMeetingDetails, setOpenViewMeetingDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { FetchAllUpcomingMeeting, allUpcomingMeetings, loading } = useEmpDashboard();

  const employeeId = sessionStorage.getItem("empId");

  useEffect(() => {
    FetchAllUpcomingMeeting(employeeId);
  }, []);

  const handleViewMeetingDetails = (id) => {
    setOpenViewMeetingDetails(true);
    setSelectedId(id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("/");
    return `${day}/${month}/${year}`;
  };
  if(loading){
    return(<div className="w-full flex items-center justify-center bg-white rounded-2xl py-4">
      <LoaderSpinner/>
    </div>)
  }
  return (
    <div className="bg-white rounded-2xl py-4 px-4 shadow-lg min-h-screen">
      {/* Sticky Header */}
      <div
        className="flex items-center gap-3 mb-2 sticky top-0 z-20 pb-2 border-b border-gray-200"
        style={{ backgroundColor: "white" }}
      >
        <HiOutlineCalendar className="text-2xl text-[#709EB1]" />
        <h1 className="text-xl font-bold text-[#2d3a4e] tracking-wide">
          Upcoming Meetings
        </h1>
      </div>
      {/* Empty State */}
      <div className="flex flex-col gap-6 h-[513px] overflow-y-scroll pr-1 pb-2">
        {(!allUpcomingMeetings || allUpcomingMeetings.length === 0) && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <HiOutlineCalendar className="text-5xl mb-2" />
            <span className="text-lg font-medium">No upcoming meetings</span>
          </div>
        )}
        {/* Meeting Cards */}
        {allUpcomingMeetings?.map((meeting) => (
          <div
            key={meeting?._id}
            className="transition-shadow duration-200 shadow-md rounded-2xl bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] px-4 grid grid-cols-5 py-4 hover:shadow-xl border border-transparent hover:border-[#709EB1]/30 relative group"
          >
            {/* Date & Time */}
            <div className="col-span-1 flex flex-col gap-3 border-r border-gray-200 items-center justify-center">
              <div className="flex items-center gap-1 text-sm font-medium bg-[#e3eaf2] px-3 py-1 rounded-full mb-1">
                <HiOutlineCalendar className="text-[#709EB1] text-lg" />
                <span>{formatDate(meeting?.date)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium bg-[#e3eaf2] px-3 py-1 rounded-full">
                <HiOutlineClock className="text-[#709EB1] text-lg" />
                <span>{meeting?.time}</span>
              </div>
            </div>
            {/* Meeting Info */}
            <div className="col-span-4 grid grid-cols-3 px-4">
              <div className="col-span-2 flex flex-col justify-center gap-1">
                <h2
                  className="text-lg text-[#2d3a4e] font-semibold truncate"
                  title={meeting?.title}
                >
                  {meeting?.title
                    ? meeting.title.charAt(0).toUpperCase() +
                    meeting.title.slice(1)
                    : ""}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <HiOutlineUser className="text-base" />
                  <span>Organizer:</span>
                  <span className="font-medium text-[#709EB1]">
                    {meeting?.organizer?.name}
                  </span>
                </div>
              </div>
              {/* View Details Button */}
              <div className="col-span-1 flex justify-center items-center">
                <button
                  type="button"
                  className="rounded-xl py-2 px-5  text-white font-semibold flex items-center gap-2 shadow-md "
                  onClick={() => handleViewMeetingDetails(meeting._id)}
                  style={{ background: theme.primaryColor }}
                >
                  <HiOutlineEye className="text-lg" />
                  View Details
                </button>

                {openViewMeetingDetails &&
                  selectedId === meeting._id &&
                  meeting && (
                    <ViewMeetingDetails
                      openDialog={openViewMeetingDetails}
                      closeDialog={() => {
                        setOpenViewMeetingDetails(false);
                        setSelectedId(null);
                      }}
                      meetingId={meeting._id}
                    />
                  )}
              </div>
            </div>
            {/* Decorative bar on hover */}
            <div className="absolute left-0 top-0 h-full w-1 bg-[#709EB1] rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMeetings;
