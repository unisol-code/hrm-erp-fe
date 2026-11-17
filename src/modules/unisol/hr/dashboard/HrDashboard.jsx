/* eslint-disable no-unused-vars */
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { BarChart, Bar, YAxis, XAxis } from "recharts";
import { useEffect, useRef, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "../../../../hooks/theme/useTheme";
import useDashboard from "../../../../hooks/unisol/hrDashboard/useDashborad";
import Calendar from "react-calendar";
import "../../../../css/calendar.css";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ResponsiveContainer } from "recharts";
import CloseIcon from "@mui/icons-material/Close";
import useCoreHRAttendance from "../../../../hooks/unisol/coreHr/useCoreHRAttendance";
import Pagination from "../../../../components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import SpecialEventsPopUp from "../../../../components/Dialogs/SpecialEventsPopUp";
import { useRoles } from "../../../../hooks/auth/useRoles";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BadgeIcon from "@mui/icons-material/Badge";
import DescriptionIcon from "@mui/icons-material/Description";
import CelebrationIcon from "@mui/icons-material/Celebration";
import GroupIcon from "@mui/icons-material/Group";
import { Tooltip, CartesianGrid } from "recharts";
import Profile from "../../../../assets/images/profile-image.png";
import Select from "react-select";
import { format, isValid } from "date-fns";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const safeDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return isValid(d) ? d : null;
};

const formatDateShort = (value) => {
  const d = safeDate(value);
  return d ? format(d, "dd MMM yyyy") : "—";
};

/* ---------------- Presentational subcomponents ---------------- */

const OfficeEventItem = ({ event }) => {
  const date = safeDate(event?.eventDate);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:ring-slate-200">
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500" />

      <div className="flex items-start gap-3 pl-1.5">
        {/* Date badge */}
        <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 leading-none ring-1 ring-indigo-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
            {date ? format(date, "MMM") : "—"}
          </span>
          <span className="mt-0.5 text-base font-extrabold text-slate-800">
            {date ? format(date, "dd") : "—"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          {event?.eventType && (
            <span className="inline-flex max-w-full items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-700 ring-1 ring-indigo-100">
              <span className="truncate">{event.eventType}</span>
            </span>
          )}

          <p
            className="mt-1.5 truncate text-sm font-bold leading-snug text-slate-800"
            title={event?.eventTitle}
          >
            {event?.eventTitle || "Untitled Event"}
          </p>

          {event?.eventNote && (
            <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-slate-500">
              {event.eventNote}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {event?.eventTime && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-100">
                <AccessTimeIcon style={{ fontSize: 11 }} />
                {event.eventTime}
              </span>
            )}
            {event?.Venue && (
              <span className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-100">
                <LocationOnIcon style={{ fontSize: 11 }} />
                <span className="truncate">{event.Venue}</span>
              </span>
            )}
            {event?.dressCode && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100">
                👔 {event.dressCode}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecialDayItem = ({ event, accent = "pink" }) => {
  const date = safeDate(event?.eventDate);
  const isBlue = accent === "blue";

  const gradient = isBlue
    ? "from-blue-400 to-cyan-500"
    : "from-pink-400 to-rose-500";
  const badge = isBlue ? "bg-blue-500" : "bg-pink-500";
  const emoji = isBlue ? "⭐" : "🎉";
  const ring = isBlue ? "ring-blue-100" : "ring-pink-100";
  const accentText = isBlue ? "text-blue-600" : "text-pink-600";

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-pink-50/40 p-3 shadow-sm ring-1 ${ring} transition-all duration-200 hover:-translate-y-px hover:shadow-md`}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className={`rounded-full bg-gradient-to-br ${gradient} p-[1.5px] shadow-sm`}
          >
            <img
              src={event?.photo || DEFAULT_AVATAR}
              alt={event?.name || "celebration"}
              className="h-12 w-12 rounded-full border-2 border-white object-cover"
            />
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full ${badge} ring-2 ring-white`}
          >
            <span className="text-[10px] leading-none">{emoji}</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-800">
            {event?.name || "Celebration"}
          </p>
          <p className={`truncate text-xs font-semibold ${accentText}`}>
            {event?.eventCelebration || "—"}
          </p>
          {date && (
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              📅 {format(date, "dd MMM yyyy")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionHeading = ({ dot, pulse = false, count, children }) => (
  <div className="mb-2.5 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${dot} ${
          pulse ? "animate-pulse" : ""
        }`}
      />
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
        {children}
      </h3>
    </div>
    {typeof count === "number" && count > 0 && (
      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
        {count}
      </span>
    )}
  </div>
);

const EmptyHint = ({ text, icon = "📭" }) => (
  <div className="flex flex-col items-center justify-center rounded-lg bg-white/50 py-5 text-center ring-1 ring-white/80">
    <span className="text-2xl opacity-60">{icon}</span>
    <p className="mt-1.5 px-3 text-xs italic text-slate-500">{text}</p>
  </div>
);

/* ------------------------------ Component ------------------------------ */

const HrDashboard = () => {
  const { switchTheme, theme } = useTheme();
  const navigate = useNavigate();
  const compId = sessionStorage.getItem("companyId");
  const [companyId, setCompanyId] = useState(compId);
  const companyName = sessionStorage.getItem("companyName");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showPopup, setShowPopUp] = useState(false);
  const [specialTab, setSpecialTab] = useState("special"); // null = auto
  const { isHR } = useRoles();

  // 👇 ref + highlight state for "Employee Status Overview"
  const employeeStatusRef = useRef(null);
  const [highlightStatus, setHighlightStatus] = useState(false);

  const {
    fetchWeeklyAttendance,
    weeklyAttendance,
    fetchAllSpecialDay,
    specialDays,
    fetchCompanyById,
    companyById,
    deleteNotification,
    markNotificationRead,
    getEmployeeStatusOverViewList,
    fetchAllUpcomingMeetList,
    employeeStatusOverViewList,
    allUpcomingMeetList,
    getAllUpcomingMeetsAndHoliday,
    allUpcomingMeetsAndHoliday,
    companyData,
    fetchCompaniesData,
    loading,
    fetchHRCompanies,
    hrCompanies,
  } = useDashboard();

  const {
    fetchTodaysEmpAttendance,
    todaysEmpAttendance,
    fetchTotalEmpAttendance,
    totalEmpAttendance,
    fetchWeeklydeptAttendance,
    weeklydeptAttendance,
    fetchNewEmployeeCount,
    newEmployeeCount,
    loading: coreHRLoading,
  } = useCoreHRAttendance();

  useEffect(() => {
    if (isHR) {
      const employeeId = sessionStorage.getItem("empId");
      fetchHRCompanies(employeeId);
    }
  }, [isHR]);

  useEffect(() => {
    switchTheme(companyName);
  }, [companyName, switchTheme]);

  const [locaLoading, setLocalLoading] = useState(false);
  const fetchAllData = async () => {
    setPage(1);
    setLocalLoading(true);
    try {
      await Promise.all([
        fetchWeeklyAttendance(companyId),
        fetchAllSpecialDay(),
        fetchCompanyById(companyId),
        deleteNotification(),
        markNotificationRead(),
        fetchTodaysEmpAttendance(),
        fetchTotalEmpAttendance(),
        fetchWeeklydeptAttendance(),
        getEmployeeStatusOverViewList(1, limit),
        fetchNewEmployeeCount(),
        fetchAllUpcomingMeetList(),
        getAllUpcomingMeetsAndHoliday(),
        fetchCompaniesData(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [companyId]);

  const date = new Date();
  const todayDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const [value, setValue] = useState(new Date());
  const [meetingInfo, setMeetingInfo] = useState("");
  const [open, setOpen] = useState(false);

  const eventsForDate = (d) => {
    const formattedDate = d.toLocaleDateString("en-CA");
    return (
      allUpcomingMeetsAndHoliday?.data?.filter(
        (event) =>
          event.date === formattedDate ||
          (event.type === "leave" &&
            formattedDate >= event.fromDate &&
            formattedDate <= event.toDate)
      ) || []
    );
  };

  const handleDateClicked = (clickedDate) => {
    const events = eventsForDate(clickedDate);
    setMeetingInfo(events);
    setValue(clickedDate);
    if (events.length > 0) setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMeetingInfo("");
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
    getEmployeeStatusOverViewList(newPage, limit);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    getEmployeeStatusOverViewList(1, newLimit);
  };

  const companyOptions = ((isHR ? hrCompanies : companyData) || []).map(
    (company) => ({ value: company._id, label: company.name })
  );

  const handleCompanySelect = (selected) => {
    if (!selected) {
      setCompanyId("");
      sessionStorage.removeItem("companyId");
      sessionStorage.removeItem("companyName");
      return;
    }
    const { value, label } = selected;
    setCompanyId(value);
    sessionStorage.setItem("companyId", value);
    sessionStorage.setItem("companyName", label);
    switchTheme(label);
    if (label === "Home") navigate("/homeDashboard");
    else navigate("/hrDashboard");
  };

  // 👇 handler for clicking the "Total Employee" card
  const handleTotalEmployeeClick = () => {
    // Reset to first page & refetch so the table reflects fresh data
    setPage(1);
    // getEmployeeStatusOverViewList(1, limit);

    // Scroll the section into view
    employeeStatusRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Flash highlight for visual feedback
    setHighlightStatus(true);
    setTimeout(() => setHighlightStatus(false), 1500);
  };

  if (locaLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <LoaderSpinner />
      </div>
    );
  }

  /* --- Derived data --- */
  const todaySpecialEvents = specialDays?.todaySpecialEvents || [];
  const upcomingSpecialEvents = specialDays?.upcomingSpecialEvents || [];
  const todayOfficeEvents = specialDays?.todayOfficeEvents || [];
  const upcomingOfficeEvents = specialDays?.upcomingOfficeEvents || [];

  const officeCount = todayOfficeEvents.length + upcomingOfficeEvents.length;
  const specialCount = todaySpecialEvents.length + upcomingSpecialEvents.length;

  const resolvedTab =
    specialTab ??
    (officeCount > 0 ? "office" : specialCount > 0 ? "special" : "office");

  const hasAnyEvent = officeCount > 0 || specialCount > 0;

  return (
    <div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col justify-end gap-1">
            <p className="font-medium">Hi, Welcome !</p>
          </div>
          <div>
            <h1 className="text-xs">Company</h1>
            <Select
              name="companyList"
              id="companyList"
              className="react-select-container w-full md:w-[200px]"
              classNamePrefix="react-select"
              options={companyOptions}
              value={
                companyOptions.find((opt) => opt.value === companyId) || null
              }
              onChange={handleCompanySelect}
              placeholder="Select a company"
            />
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid h-[110px] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreHRLoading ? (
            <p>loading</p>
          ) : (
            <div
              onClick={handleTotalEmployeeClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                handleTotalEmployeeClick()
              }
              className="flex h-[105px] w-full cursor-pointer flex-col justify-evenly rounded-md bg-white px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <div className="flex flex-wrap">
                <h2 className="font-bold">Total Employee</h2>
                <span className="flex-1"></span>
                <div className="my-1 flex w-[80px] items-center justify-between rounded-full bg-[#23C10A] bg-opacity-15 px-1 text-[#0BBA00]">
                  {totalEmpAttendance?.percentageIncrease > 0 ? (
                    <TrendingUpIcon />
                  ) : (
                    <TrendingDownIcon />
                  )}
                  {totalEmpAttendance &&
                    `${totalEmpAttendance?.percentageIncrease}%`}
                </div>
              </div>
              <h2 className="text-2xl font-bold">
                {totalEmpAttendance && totalEmpAttendance?.empCount}
              </h2>
            </div>
          )}

          {coreHRLoading ? (
            <p>:loading</p>
          ) : (
            <div className="flex h-[105px] w-full flex-col justify-evenly rounded-md bg-white px-6 py-4">
              <div className="flex">
                <h2 className="font-bold">New Employees</h2>
                <span className="flex-1"></span>
              </div>
              <h2 className="text-2xl font-bold">
                {newEmployeeCount && newEmployeeCount?.empCount}
              </h2>
            </div>
          )}

          {coreHRLoading ? (
            <p>:loading</p>
          ) : (
            <div className="flex h-[105px] w-full flex-col justify-evenly rounded-md bg-white px-6 py-4">
              <div className="flex flex-wrap">
                <h2 className="font-bold">Today's Attendance</h2>
                <span className="flex-1"></span>
                <div
                  className={`my-1 flex h-[24px] w-[80px] items-center justify-between rounded-full bg-opacity-15 px-1 ${
                    todaysEmpAttendance?.presentPercentage > 0
                      ? "bg-[#23C10A] text-[#0BBA00]"
                      : "bg-[#C10A0A26] text-[#C71026]"
                  }`}
                >
                  {todaysEmpAttendance?.presentPercentage > 0 ? (
                    <TrendingUpIcon />
                  ) : (
                    <TrendingDownIcon />
                  )}
                  {todaysEmpAttendance &&
                    `${todaysEmpAttendance?.presentPercentage}%`}
                </div>
              </div>
              <h2 className="text-2xl font-bold">
                {todaysEmpAttendance && todaysEmpAttendance?.presentToday}
              </h2>
            </div>
          )}
        </div>

        <div className="flex w-full flex-wrap justify-between gap-2">
          {/* CALENDAR */}
          <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-lg lg:w-[30%]">
            <div className="h-[350px] w-full overflow-hidden rounded-md border">
              <Calendar
                value={value}
                onClickDay={handleDateClicked}
                className="calender-body h-full p-2"
                weekends={true}
                tileClassName={({ date }) => {
                  const events = eventsForDate(date);
                  const classes = [];
                  if (events.length > 0) classes.push("event-tile");
                  if (
                    date &&
                    typeof date.getDay === "function" &&
                    date.getDay() === 6
                  )
                    classes.push("saturday-tile");
                  return classes.length ? classes.join(" ") : null;
                }}
                tileContent={({ date }) => {
                  const events = eventsForDate(date);
                  if (!events.length) return null;
                  const hasMeeting = events.some((e) => e.type === "meeting");
                  const hasHoliday = events.some((e) => e.type === "holiday");
                  const hasLeave = events.some((e) => e.type === "leave");
                  return (
                    <div
                      className="event-border"
                      style={{
                        borderTop: hasMeeting ? "3px solid #4C6FFF" : "none",
                        borderBottom: hasHoliday ? "3px solid #FF4C4C" : "none",
                        borderRight: hasLeave ? "3px solid #FFA500" : "none",
                      }}
                    />
                  );
                }}
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                { color: "bg-[#FF4C4C]", label: "Holiday", path: "holiday" },
                { color: "bg-[#FFA500]", label: "Leaves", path: "leaves" },
                { color: "bg-[#4C6FFF]", label: "Meetings", path: "meetings" },
              ].map((item, i) => (
                <Link key={i} to={`/hrDashboard/${item.path}`}>
                  <h2
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                    {item.label}
                  </h2>
                </Link>
              ))}
            </div>

            {Array.isArray(meetingInfo) && meetingInfo.length > 0 && (
              <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle
                  className="flex items-center justify-between px-4 py-2 text-base font-semibold text-gray-800"
                  style={{ backgroundColor: theme?.secondaryColor || "#f3f4f6" }}
                >
                  <span>Events on {value.toLocaleDateString("en-GB")}</span>
                  <CloseIcon className="cursor-pointer" onClick={handleClose} />
                </DialogTitle>
                <DialogContent className="mt-4 bg-white px-4 py-4">
                  {meetingInfo.map((event, idx) => {
                    const badgeColor =
                      {
                        meeting: "bg-blue-100 text-blue-700",
                        holiday: "bg-red-300 text-red-700",
                        leave: "bg-yellow-200 text-yellow-700",
                      }[event.type] || "bg-gray-100 text-gray-700";

                    return (
                      <div
                        key={idx}
                        className="mb-4 rounded-lg border p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeColor}`}
                          >
                            {event.type.charAt(0).toUpperCase() +
                              event.type.slice(1)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {event.type === "leave"
                              ? `${formatDateShort(
                                  event.fromDate
                                )} - ${formatDateShort(event.toDate)}`
                              : formatDateShort(event.date)}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-700">
                          {event.title && (
                            <div className="flex items-center gap-2">
                              <EventIcon fontSize="small" />
                              <span>
                                <b>Title:</b> {event.title}
                              </span>
                            </div>
                          )}
                          {event.name && (
                            <div className="flex items-center gap-2">
                              <BadgeIcon fontSize="small" />
                              <span>
                                <b>Name:</b> {event.name}
                              </span>
                            </div>
                          )}
                          {event.time && (
                            <div className="flex items-center gap-2">
                              <AccessTimeIcon fontSize="small" />
                              <span>
                                <b>Time:</b> {event.time}
                              </span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <LocationOnIcon fontSize="small" />
                              <span>
                                <b>Location:</b> {event.location}
                              </span>
                            </div>
                          )}
                          {event.description && (
                            <div className="flex items-start gap-2">
                              <DescriptionIcon fontSize="small" />
                              <span>
                                <b>Description:</b> {event.description}
                              </span>
                            </div>
                          )}
                          {event.organizer?.name && (
                            <div className="flex items-center gap-2">
                              <BadgeIcon fontSize="small" />
                              <span>
                                <b>Organizer:</b> {event.organizer.name}
                              </span>
                            </div>
                          )}
                          {event.eventCelebration && (
                            <div className="flex items-center gap-2">
                              <CelebrationIcon fontSize="small" />
                              <span>
                                <b>Celebration:</b> {event.eventCelebration}
                              </span>
                            </div>
                          )}
                          {event.participants?.length > 0 && (
                            <div className="flex items-start gap-2">
                              <GroupIcon fontSize="small" />
                              <div>
                                <b>Attendees:</b>
                                <ul className="list-inside list-disc text-sm">
                                  {event.participants.map((p, i) => (
                                    <li key={i}>{p}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {event.type === "leave" && (
                            <>
                              <div className="flex items-center gap-2">
                                <EventIcon fontSize="small" />
                                <span>
                                  <b>From:</b> {formatDateShort(event.fromDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <EventIcon fontSize="small" />
                                <span>
                                  <b>To:</b> {formatDateShort(event.toDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AccessTimeIcon fontSize="small" />
                                <span>
                                  <b>Total Days:</b> {event.totalDays}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DescriptionIcon fontSize="small" />
                                <span>
                                  <b>Reason:</b> {event.reason}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <GroupIcon fontSize="small" />
                                <span>
                                  <b>Employee:</b> {event.employeeName}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* WEEKLY ATTENDANCE CHART */}
          <div className="w-full rounded-2xl bg-white shadow-xl lg:w-[43%]">
            <h2 className="mb-4 p-3 text-xl font-semibold text-gray-800">
              📊 Weekly Attendance
            </h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklydeptAttendance}
                  barGap={10}
                  barCategoryGap="20%"
                  margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    hide
                    dataKey="department"
                    tick={{
                      angle: -15,
                      dy: 8,
                      fontSize: 12,
                      textAnchor: "end",
                    }}
                    axisLine={{ stroke: "#ccc" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={{ stroke: "#ccc" }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "none",
                      fontSize: "14px",
                    }}
                    formatter={(value) => [`${value}%`, "Attendance"]}
                  />
                  <Bar
                    dataKey="attendancePercentage"
                    fill={theme?.primaryColor || "#4C6FFF"}
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SPECIAL DAYS & OFFICE EVENTS */}
          <div
            className="relative flex w-full flex-col overflow-hidden rounded-2xl px-5 py-5 shadow-lg lg:w-[24%]"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-pink-400/20 via-rose-300/10 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-400/15 via-violet-300/10 to-transparent blur-2xl" />

            <div className="relative flex flex-col">
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-red-600">
                    Special Days & Events
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    Today: {todayDate}
                  </p>
                </div>
                <button
                  aria-label="Event settings"
                  onClick={() => setShowPopUp(true)}
                  className="rounded-lg bg-white/70 p-2 text-slate-600 ring-1 ring-white/80 transition hover:bg-white hover:text-slate-800 hover:shadow-sm"
                >
                  <SettingsIcon style={{ fontSize: 18 }} />
                </button>
              </div>

              {hasAnyEvent ? (
                <>
                  {/* Sliding segmented tabs */}
                  <div className="relative mb-4 flex rounded-xl bg-white/60 p-1.5 ring-1 ring-white/80 backdrop-blur">
                    <div
                      className="absolute inset-y-1.5 rounded-lg shadow-sm transition-all duration-300 ease-out"
                      style={{
                        backgroundColor: theme.primaryColor,
                        width: "calc(50% - 6px)",
                        left: resolvedTab === "office" ? "6px" : "calc(50%)",
                      }}
                    />
                    <button
                      onClick={() => setSpecialTab("office")}
                      className={`relative z-10 flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                        resolvedTab === "office" ? "text-white" : "text-slate-600"
                      }`}
                    >
                      Office
                      {officeCount > 0 && (
                        <span className="ml-1 opacity-90">({officeCount})</span>
                      )}
                    </button>
                    <button
                      onClick={() => setSpecialTab("special")}
                      className={`relative z-10 flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                        resolvedTab === "special"
                          ? "text-white"
                          : "text-slate-600"
                      }`}
                    >
                      Special
                      {specialCount > 0 && (
                        <span className="ml-1 opacity-90">({specialCount})</span>
                      )}
                    </button>
                  </div>

                  {resolvedTab === "office" ? (
                    <div className="flex flex-1 flex-col">
                      <SectionHeading
                        dot="bg-red-500"
                        count={todayOfficeEvents.length}
                      >
                        Today's Office Events
                      </SectionHeading>
                      <div className="mb-4 max-h-[190px] space-y-2.5 overflow-y-auto pr-1 scrollbar-hide">
                        {todayOfficeEvents.length > 0 ? (
                          todayOfficeEvents.map((event, index) => (
                            <OfficeEventItem
                              key={event._id || index}
                              event={event}
                            />
                          ))
                        ) : (
                          <EmptyHint
                            icon="🗓️"
                            text="No office events today."
                          />
                        )}
                      </div>

                      <hr
                        className="mb-4 border-t-2"
                        style={{ borderColor: theme.primaryColor }}
                      />

                      <SectionHeading
                        dot="bg-blue-500"
                        pulse
                        count={upcomingOfficeEvents.length}
                      >
                        Upcoming Office Events
                      </SectionHeading>
                      <div className="max-h-[260px] space-y-2.5 overflow-y-auto pr-1 scrollbar-hide">
                        {upcomingOfficeEvents.length > 0 ? (
                          upcomingOfficeEvents.map((event, index) => (
                            <OfficeEventItem
                              key={event._id || index}
                              event={event}
                            />
                          ))
                        ) : (
                          <EmptyHint
                            icon="📅"
                            text="No upcoming office events."
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col">
                      <SectionHeading
                        dot="bg-pink-500"
                        count={todaySpecialEvents.length}
                      >
                        Today's Special Events
                      </SectionHeading>
                      <div className="mb-4 max-h-[190px] space-y-2.5 overflow-y-auto pr-1 scrollbar-hide">
                        {todaySpecialEvents.length > 0 ? (
                          todaySpecialEvents.map((event, index) => (
                            <SpecialDayItem
                              key={`${event?.name}-${event?.eventDate}-${index}`}
                              event={event}
                              accent="pink"
                            />
                          ))
                        ) : (
                          <EmptyHint
                            icon="🎈"
                            text="No special events today."
                          />
                        )}
                      </div>

                      <hr
                        className="mb-4 border-t-2"
                        style={{ borderColor: theme.primaryColor }}
                      />

                      <SectionHeading
                        dot="bg-blue-500"
                        pulse
                        count={upcomingSpecialEvents.length}
                      >
                        Upcoming Special Events
                      </SectionHeading>
                      <div className="max-h-[260px] space-y-2.5 overflow-y-auto pr-1 scrollbar-hide">
                        {upcomingSpecialEvents.length > 0 ? (
                          upcomingSpecialEvents.map((event, index) => (
                            <SpecialDayItem
                              key={`${event?.name}-${event?.eventDate}-${index}`}
                              event={event}
                              accent="blue"
                            />
                          ))
                        ) : (
                          <EmptyHint
                            icon="⭐"
                            text="No upcoming special events."
                          />
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EmptyHint
                  icon="📭"
                  text="No special days or office events."
                />
              )}
            </div>
          </div>

          {showPopup && (
            <SpecialEventsPopUp
              specialDays={specialDays}
              onClose={() => setShowPopUp(false)}
            />
          )}
        </div>

        {/* EMPLOYEE STATUS OVERVIEW */}
        <div
          ref={employeeStatusRef}
          className={`scroll-mt-4 rounded-2xl bg-white transition-all duration-300 ${
            highlightStatus ? "ring-2 ring-indigo-400 ring-offset-2" : ""
          }`}
        >
          <div className="flex w-full items-center rounded-xl bg-opacity-50">
            <h1 className="px-4 py-2 text-lg font-semibold text-gray-800">
              Employee Status Overview
            </h1>
            <span className="flex-1"></span>
          </div>
          <div className="px-8">
            <div className="max-h-[500px] w-full overflow-y-scroll">
              <table
                className="w-full border-separate"
                style={{ borderSpacing: 0 }}
              >
                <thead className="sticky top-0 z-10 bg-white">
                  <tr
                    className="h-[40px] font-semibold text-gray-600"
                    style={{ borderBottom: "2px solid #6B7280" }}
                  >
                    {[
                      "Sr. No.",
                      "Employee Name",
                      "Employee Id",
                      "Department",
                      "Upcoming Leave",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="border-b-2 border-gray-500 px-4 py-2 text-left"
                        style={{
                          position: "sticky",
                          top: 0,
                          background: "white",
                          zIndex: 11,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="flex w-full items-center justify-center py-4">
                          <LoaderSpinner />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    employeeStatusOverViewList?.employees?.map((list, index) => (
                      <tr key={list?._id}>
                        <td className="whitespace-nowrap border-b border-gray-300 px-4 py-2 text-gray-700">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="whitespace-nowrap border-b border-gray-300 px-4 py-2 text-gray-700">
                          <span className="flex items-center gap-3">
                            <img
                              src={list?.photo || Profile}
                              alt="img"
                              className="h-[40px] w-[40px] rounded-full object-cover"
                            />
                            {list?.employeeName}
                          </span>
                        </td>
                        <td className="whitespace-nowrap border-b border-gray-300 px-4 py-2 text-gray-700">
                          {list?.empId}
                        </td>
                        <td className="whitespace-nowrap border-b border-gray-300 px-4 py-2 text-gray-700">
                          {list?.department}
                        </td>
                        <td className="whitespace-nowrap border-b border-gray-300 px-4 py-2 text-gray-700">
                          {list?.upcomingLeaves?.[0]
                            ? `${formatDateShort(
                                list.upcomingLeaves[0].fromDate
                              )} to ${formatDateShort(
                                list.upcomingLeaves[0].toDate
                              )}`
                            : "None"}
                        </td>
                        <td
                          className={`whitespace-nowrap border-b border-gray-300 px-4 py-2 text-gray-700 ${
                            list?.status === "Present"
                              ? "font-semibold text-green-600"
                              : list?.status === "On Leave"
                              ? "font-semibold text-yellow-600"
                              : "font-semibold text-red-600"
                          }`}
                        >
                          {list?.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {!loading && employeeStatusOverViewList?.employees?.length > 0 && (
            <Pagination
              currentPage={employeeStatusOverViewList?.pagination?.currentPage}
              itemsPerPage={limit}
              totalPages={employeeStatusOverViewList?.pagination?.totalPages}
              totalItems={employeeStatusOverViewList?.pagination?.totalCount}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;