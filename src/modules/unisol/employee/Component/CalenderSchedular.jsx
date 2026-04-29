import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import useEmpDashboard from "../../../../hooks/unisol/empDashboard/empDashboard";
import { useTheme } from "../../../../hooks/theme/useTheme";
import ViewMeetingDetails from "../../../../components/Dialogs/meetings/ViewMeetingDetails";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const locales = { "en-GB": enGB };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const CalenderSchedular = () => {
  const [meetings, setMeetings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openViewMeetingDetails, setOpenViewMeetingDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { theme } = useTheme();

  const empId = sessionStorage.getItem("empId");
  const { allMeetings, getAllMeetings, loading } = useEmpDashboard();

  useEffect(() => {
    if (!empId) return;
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    getAllMeetings(empId, month, year);
  }, [currentDate, empId]);


useEffect(() => {
  if (allMeetings && Array.isArray(allMeetings)) {
    const formattedMeetings = allMeetings.map((meeting) => {
      const [day, month, year] = meeting.date.split("/").map(Number);
      const timeParts = meeting.time.split(":");
      let hour = parseInt(timeParts[0], 10);
      let minute = 0;

      const minuteStr = timeParts[1];
      if (minuteStr.includes("AM") || minuteStr.includes("PM")) {
        minute = parseInt(minuteStr.split(" ")[0], 10);
        const ampm = minuteStr.split(" ")[1];
        if (ampm === "PM" && hour < 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;
      } else {
        minute = parseInt(minuteStr, 10);
      }

      const startDate = new Date(year, month - 1, day, hour, minute);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour

      return {
        id: meeting._id,
        title: meeting.title,
        start: startDate,
        end: endDate, // recommended to have proper end time
      };
    });

    // Optional: Debug invalid dates
    formattedMeetings.forEach(m => {
      if (isNaN(m.start.getTime())) {
        console.warn("Invalid date created:", m);
      }
    });

    setMeetings(formattedMeetings);
  }
}, [allMeetings]);


  // Handle navigation
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: theme.primaryColor,
        color: "white",
        borderRadius: "6px",
        padding: "2px 4px",
        fontSize: "0.85em",
        display: "flex",
        wordBreak: "break-word",
      },
    };
  };

  const handleViewMeetingDetails = (id) => {
    setOpenViewMeetingDetails(true);
    setSelectedId(id);
  };

  const renderEventContent = ({ event }) => {
    return (
      <div
        role="button"
        onClick={() => {
          setSelectedId(event.id);
          setOpenViewMeetingDetails(true);
        }}
        style={{
          backgroundColor: theme.primaryColor,
          color: "#fff",
          width: "100%",
          height: "100%",
          padding: "4px 6px",
          borderRadius: "4px",
          fontSize: "0.75rem",
          cursor: "pointer",
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          lineHeight: "1.2",
        }}
      >
        <div className="font-semibold truncate w-full">{event.title}</div>
        <div className="text-xs">{format(event.start, "HH:mm")}</div>
      </div>
    );
  };



  return (
    <div className="bg-white p-4 rounded-2xl">
      {loading? (
        <div className="w-full flex items-center justify-center py-10">
          <LoaderSpinner />
        </div>
      ) : (
        <Calendar
          localizer={localizer}
          events={meetings}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          culture="en-GB"
          views={["month"]}
          date={currentDate}
          onNavigate={handleNavigate}
          eventPropGetter={eventStyleGetter}
          components={{
            event: renderEventContent,
          }}
          popup
          popupOffset={{ x: 0, y: 20 }} 
        />
      )}
      {
        openViewMeetingDetails && selectedId && (
          <ViewMeetingDetails
            openDialog={openViewMeetingDetails}
            closeDialog={() => {
              setOpenViewMeetingDetails(false);
              setSelectedId(null);
            }}
            meetingId={selectedId}
          />
        )
      }
    </div>
  );
};
