import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import useAttendence from "../../../../../hooks/unisol/attendence/useAttendence";
import { useParams } from "react-router-dom";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const locales = { "en-GB": enGB };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalenderLeaves = () => {
  const { getApprovedLeavesOfEmployee, approvedLeavesOfEmployee, loading } =
    useAttendence();
  const { theme } = useTheme();
  const { empId } = useParams();

  const [leaves, setLeaves] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch leaves whenever date/empId changes
  useEffect(() => {
    if (!empId) return;
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    getApprovedLeavesOfEmployee(empId, month, year);
  }, [empId, currentDate]);

  useEffect(() => {
    if (approvedLeavesOfEmployee?.data) {
      const formattedLeaves = approvedLeavesOfEmployee.data.map((item) => {
        const parseAsLocalDate = (isoString) => {
          const d = new Date(isoString);
          return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        };

        const startDate = parseAsLocalDate(item.fromDate);
        const endDate = parseAsLocalDate(item.toDate);

        // RBC needs end exclusive → add +1 only if multi-day
        let endForCalendar = new Date(endDate);
        if (startDate.getTime() !== endDate.getTime()) {
          endForCalendar.setDate(endForCalendar.getDate() + 1);
        }

        return {
          id: item._id,
          title: item.leaveType,
          reason: item.reason,
          start: startDate,
          end: endForCalendar,
          displayStart: item.fromDate,
          displayEnd: item.toDate,
          allDay: true,
        };
      });

      setLeaves(formattedLeaves);
    } else {
      setLeaves([]);
    }
  }, [approvedLeavesOfEmployee]);


  // Handle navigation between months
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  // Style for events
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

  const formatDateDisplay = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  const renderEventContent = ({ event }) => {
    const startDisplay = formatDateDisplay(event.displayStart);
    const endDisplay = formatDateDisplay(event.displayEnd);

    return (
      <div
        style={{
          backgroundColor: theme.primaryColor,
          color: "#fff",
          width: "100%",
          height: "100%",
          padding: "4px 6px",
          borderRadius: "4px",
          fontSize: "0.75rem",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          lineHeight: "1.2",
        }}
      >
        <div className="font-semibold truncate w-full">
          {event.title} ({startDisplay} – {endDisplay})
        </div>
        <div className="text-xs italic">{event.reason}</div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-2xl">
      {loading && !leaves.length ? (
        <div className="w-full flex items-center justify-center py-10">
          <LoaderSpinner />
        </div>
      ) : (
        <Calendar
          localizer={localizer}
          events={leaves}
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
    </div>
  );
};

export default CalenderLeaves;
