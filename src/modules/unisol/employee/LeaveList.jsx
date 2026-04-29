import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState, useRef } from "react";
// import useEmpDashboard from "../../../../hooks/unisol/empDashboard/empDashboard";
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";

export const LeaveList = () => {
  const [meetings, setMeetings] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const calendarRef = useRef(null);

//   const { FetchAllUpcomingMeeting, allUpcomingMeetings } = useEmpDashboard();

  const empId = sessionStorage.getItem("empId");

  useEffect(() => {
    // FetchAllUpcomingMeeting(empId);
    // const formattedMeetings = allUpcomingMeetings?.map((meeting) => ({
    //   title: meeting.title,
    //   date: meeting.date.split("T")[0],
    //   allDay: true,
    //   HostName: meeting.organizer,
    // }));
    // setMeetings(formattedMeetings);
    // eslint-disable-next-line
  }, []);

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {eventInfo.event.title}
        </i>
      </>
    );
  }

  // Custom navigation handlers
  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setCurrentDate(dayjs(calendarApi.getDate()));
  };
  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCurrentDate(dayjs(calendarApi.getDate()));
  };
  const handleDatesSet = (arg) => {
    setCurrentDate(dayjs(arg.start));
  };

  return (
    <div className="bg-white p-4 rounded-2xl">
      {/* Custom Header */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <IconButton onClick={handlePrev}>
          <ChevronLeft />
        </IconButton>
        <span className="font-semibold text-lg">
          {currentDate.format("MMMM YYYY")}
        </span>
        <IconButton onClick={handleNext}>
          <ChevronRight />
        </IconButton>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        weekends={true}
        headerToolbar={false} // Hide default header
        themeSystem="Simplex"
        dayMaxEvents={true}
        // dateClick={(e) => handleDateClick(e)}
        // events={meetings}
        eventContent={renderEventContent}
        eventColor={"#" + Math.floor(Math.random() * 16777215).toString(16)}
        datesSet={handleDatesSet}
      />
    </div>
  );
};
export default LeaveList