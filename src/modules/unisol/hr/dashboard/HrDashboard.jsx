/* eslint-disable no-unused-vars */
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EventTemplate from "../../../../assets/images/happy-birthday-background-template.png";
import { BarChart, Bar, YAxis, XAxis } from "recharts";
import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "../../../../hooks/theme/useTheme";
import useDashboard from "../../../../hooks/unisol/hrDashboard/useDashborad";
import Calendar from "react-calendar";
import "../../../../css/calendar.css";
import { HiBars2 } from "react-icons/hi2";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ResponsiveContainer } from "recharts";
import CloseIcon from "@mui/icons-material/Close";
import useCoreHRAttendance from "../../../../hooks/unisol/coreHr/useCoreHRAttendance";
import Pagination from "../../../../components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/BreadCrumb";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import SpecialEventsPopUp from "../../../../components/Dialogs/SpecialEventsPopUp";
import { useRoles } from "../../../../hooks/auth/useRoles";
import "../../../../css/calendar.css";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BadgeIcon from "@mui/icons-material/Badge";
import DescriptionIcon from "@mui/icons-material/Description";
import CelebrationIcon from "@mui/icons-material/Celebration";
import GroupIcon from "@mui/icons-material/Group";
import { Tooltip, CartesianGrid, LabelList } from "recharts";
import Profile from "../../../../assets/images/profile-image.png";
import Select from "react-select";

const HrDashboard = () => {
  const { switchTheme, theme } = useTheme();
  const navigate = useNavigate();
  const compId = sessionStorage.getItem("companyId");
  const [companyId, setCompanyId] = useState(compId);
  const companyName = sessionStorage.getItem("companyName");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showPopup, setShowPopUp] = useState(false);
  const { isHR } = useRoles();

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

  const companyid = sessionStorage.getItem("companyId");
  console.log("companyData", companyData);
  console.log("get Companies By Id ", companyById);
  console.log("specialDays", specialDays);

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
  console.log("todaysEmpAttendance", todaysEmpAttendance);
  console.log("weeklydeptAttendance", weeklydeptAttendance);

  useEffect(() => {
    if (isHR) {
      const employeeId = sessionStorage.getItem("empId");
      console.log(employeeId);
      fetchHRCompanies(employeeId);
    }
  }, [isHR]);
  useEffect(() => {
    switchTheme(companyName);
  }, [companyName, switchTheme]);
  const [locaLoading, setLocalLoading] = useState(false);
  const fetchAllData = async () => {
    setPage(1), setLocalLoading(true);
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

  console.log("allUpcomingMeetsAndHoliday : ", allUpcomingMeetsAndHoliday);

  // const handleCompanySelect = (e) => {
  //   console.log(e);
  //   const companyName =
  //     companyData.find((c) => c._id === e.target.value)?.name ||
  //     hrCompanies.find((c) => c._id === e.target.value)?.name;
  //   if (!companyName) return;

  //   switchTheme(companyName);
  //   setCompanyId(e.target.value);
  //   sessionStorage.setItem("companyId", e.target.value);
  //   sessionStorage.setItem("companyName", companyName);
  //   if (companyName === "Home") {
  //     navigate("/homeDashboard");
  //   } else {
  //     navigate("/hrDashboard");
  //   }
  // };

  const date = new Date();
  const todayDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  console.log("todayDate", todayDate);

  const [value, setValue] = useState(new Date());
  const [meetingInfo, setMeetingInfo] = useState("");
  const [open, setOpen] = useState(false);

  const handleDateClicked = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA");

    const events =
      allUpcomingMeetsAndHoliday?.data?.filter(
        (event) =>
          event.date === formattedDate ||
          (event.type === "leave" &&
            formattedDate >= event.fromDate &&
            formattedDate <= event.toDate)
      ) || [];

    setMeetingInfo(events);
    setValue(date);
    setOpen(true);
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
    (company) => ({
      value: company._id,
      label: company.name,
    })
  );

  // const handleCompanySelect = (selected) => {
  //   setCompanyId(selected ? selected.value : "");
  // };

  const handleCompanySelect = (selected) => {
    if (!selected) {
      setCompanyId("");
      sessionStorage.removeItem("companyId");
      sessionStorage.removeItem("companyName");
      return;
    }

    const { value, label } = selected;

    // Update state and session storage
    setCompanyId(value);
    sessionStorage.setItem("companyId", value);
    sessionStorage.setItem("companyName", label);

    // Switch theme
    switchTheme(label);

    // Navigate based on company name
    if (label === "Home") {
      navigate("/homeDashboard");
    } else {
      navigate("/hrDashboard");
    }
  };

  function parseLocalDate(yyyyMmDd) {
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    return new Date(y, m - 1, d); // month is 0-based
  }

  if (locaLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }
  console.log("hrCompanies", hrCompanies);
  console.log("companyData", companyData, Array.isArray(companyData));

  return (
    <div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-end gap-1">
            {/* <h2 className="font-bold">Dashboard</h2> */}
            <p className="font-medium">Hi, Welcome !</p>
          </div>
          <div>
            <h1 className="text-xs ">Company</h1>
            {/* <select
              name="companyList"
              id="companyList"
              className="py-2 px-4 rounded-xl w-[200px] h-[45px]"
              onChange={handleCompanySelect}
              value={companyId || ""}
            >
              {((isHR ? hrCompanies : companyData) || []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select> */}
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

        <div className="grid lg:grid-cols-3 gap-6  h-[110px] md:grid-cols-2">
          {coreHRLoading ? (
            <p>loading</p>
          ) : (
            <div className="w-full rounded-md flex h-[105px] flex-col bg-white py-4 px-6 justify-evenly">
              <div className="flex flex-wrap">
                <h2 className="font-bold">Total Employee</h2>{" "}
                <span className="flex-1"></span>
                <div className="rounded-full w-[80px]  bg-[#23C10A] bg-opacity-15 text-[#0BBA00] px-1 my-1 flex items-center justify-between">
                  {!loading && totalEmpAttendance?.percentageIncrease > 0 ? (
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
              {/* <h2 className="text-[#949494]">Employee</h2> */}
            </div>
          )}
          {coreHRLoading ? (
            <p>:loading</p>
          ) : (
            <div className="w-full  h-[105px] rounded-md flex flex-col bg-white py-4 px-6 justify-evenly">
              <div className="flex">
                <h2 className="font-bold">New Employees</h2>{" "}
                <span className="flex-1"></span>
              </div>
              <h2 className="text-2xl font-bold">
                {newEmployeeCount && newEmployeeCount?.empCount}
              </h2>
              {/* <h2 className="text-[#949494]">Viewers</h2> */}
            </div>
          )}

          {coreHRLoading ? (
            <p>:loading</p>
          ) : (
            <div className="w-full  h-[105px] rounded-md flex flex-col bg-white py-4 px-6 justify-evenly">
              <div className="flex flex-wrap">
                <h2 className="font-bold">Today's Attendance</h2>{" "}
                <span className="flex-1"></span>
                <div
                  className={`rounded-full w-[80px] h-[24px] px-1 my-1 bg-opacity-15 flex items-center justify-between 
                ${
                  todaysEmpAttendance &&
                  todaysEmpAttendance?.presentPercentage > 0
                    ? "bg-[#23C10A] text-[#0BBA00]"
                    : "bg-[#C10A0A26] text-[#C71026]"
                }`}
                >
                  {todaysEmpAttendance &&
                  todaysEmpAttendance?.presentPercentage > 0 ? (
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
              {/* <h2 className="text-[#949494]">Applicants</h2> */}
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-between gap-2 w-full">
          {/* 📅 Calendar Section */}
          <div className="bg-white shadow-lg flex flex-col w-full lg:w-[30%] rounded-xl p-4">
            <div className="h-[350px] w-full overflow-hidden rounded-md border">
              <Calendar
                value={value}
                onClickDay={handleDateClicked}
                className="calender-body h-full p-2"
                weekends={true}
                tileClassName={({ date }) => {
                  const formattedDate = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD"

                  const eventsForDate =
                    allUpcomingMeetsAndHoliday?.data?.filter(
                      (event) =>
                        event.date === formattedDate || // meetings & holidays
                        (event.type === "leave" &&
                          formattedDate >= event.fromDate &&
                          formattedDate <= event.toDate) // leave ranges
                    );

                  const classes = [];
                  if (eventsForDate?.length > 0) classes.push("event-tile");
                  // Saturday -> getDay() === 6
                  if (
                    date &&
                    typeof date.getDay === "function" &&
                    date.getDay() === 6
                  )
                    classes.push("saturday-tile");

                  return classes.length > 0 ? classes.join(" ") : null;
                }}
                tileContent={({ date }) => {
                  const formattedDate = date.toLocaleDateString("en-CA");

                  const eventsForDate =
                    allUpcomingMeetsAndHoliday?.data?.filter(
                      (event) =>
                        event.date === formattedDate ||
                        (event.type === "leave" &&
                          formattedDate >= event.fromDate &&
                          formattedDate <= event.toDate)
                    );

                  if (!eventsForDate?.length) return null;

                  const hasMeeting = eventsForDate.some(
                    (event) => event.type === "meeting"
                  );
                  const hasHoliday = eventsForDate.some(
                    (event) => event.type === "holiday"
                  );
                  const hasLeave = eventsForDate.some(
                    (event) => event.type === "leave"
                  );

                  return (
                    <div
                      className="event-border"
                      style={{
                        borderTop: hasMeeting ? "3px solid #4C6FFF" : "none", // Meeting
                        borderBottom: hasHoliday ? "3px solid #FF4C4C" : "none", // Holiday
                        borderRight: hasLeave ? "3px solid #FFA500" : "none", // Leave
                      }}
                    />
                  );
                }}
              />
            </div>
            <div className="flex justify-center flex-wrap gap-3 mt-6">
              {[
                { color: "bg-[#FF4C4C]", label: "Holiday", path: "holiday" }, // Bright Red
                { color: "bg-[#FFA500]", label: "Leaves", path: "leaves" }, // Orange
                { color: "bg-[#4C6FFF]", label: "Meetings", path: "meetings" }, // Blue
              ].map((item, i) => (
                <Link key={i} to={`/hrDashboard/${item.path}`}>
                  <h2
                    className="text-xs flex gap-2 items-center font-semibold py-1.5 px-3 rounded-lg text-white hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <div
                      className={`w-3 h-3  rounded-full ${item.color} `}
                    ></div>
                    {item.label}
                  </h2>
                </Link>
              ))}
            </div>
            {Array.isArray(meetingInfo) && meetingInfo.length > 0 && (
              <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle
                  className="flex items-center justify-between px-4 py-2 text-base font-semibold text-gray-800"
                  style={{
                    backgroundColor: theme?.secondaryColor || "#f3f4f6",
                  }}
                >
                  <span>Events on {value.toLocaleDateString("en-GB")}</span>
                  <CloseIcon className="cursor-pointer" onClick={handleClose} />
                </DialogTitle>
                <DialogContent className="bg-white px-4 py-4 mt-4">
                  {Array.isArray(meetingInfo) &&
                    meetingInfo.length > 0 &&
                    meetingInfo.map((event, idx) => {
                      const badgeColor =
                        {
                          meeting: "bg-blue-100 text-blue-700",
                          holiday: "bg-red-300 text-red-700",
                          leave: "bg-yellow-200 text-yellow-700",
                        }[event.type] || "bg-gray-100 text-gray-700";

                      return (
                        <div
                          key={idx}
                          className="border rounded-lg shadow-sm p-4 mb-4 hover:shadow-md transition-all duration-300"
                        >
                          {/* Event Type + Date */}
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}
                            >
                              {event.type.charAt(0).toUpperCase() +
                                event.type.slice(1)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {event.type === "leave"
                                ? `${new Date(
                                    event.fromDate
                                  ).toLocaleDateString("en-GB")} - ${new Date(
                                    event.toDate
                                  ).toLocaleDateString("en-GB")}`
                                : new Date(event.date).toLocaleDateString(
                                    "en-GB"
                                  )}
                            </span>
                          </div>

                          {/* Details */}
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
                                  <ul className="list-disc list-inside text-sm">
                                    {event.participants.map((p, i) => (
                                      <li key={i}>{p}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                            {/* Leave Specific Fields */}
                            {event.type === "leave" && (
                              <>
                                <div className="flex items-center gap-2">
                                  <EventIcon fontSize="small" />
                                  <span>
                                    <b>From:</b>{" "}
                                    {new Date(
                                      event.fromDate
                                    ).toLocaleDateString("en-GB")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <EventIcon fontSize="small" />
                                  <span>
                                    <b>To:</b>{" "}
                                    {new Date(event.toDate).toLocaleDateString(
                                      "en-GB"
                                    )}
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
          {/* <div className="bg-white shadow-lg rounded-xl  flex flex-col w-full lg:w-[46%]">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 mt-5 pl-5">Weekly Attendance</h2>
            <div className="w-full h-[400px] ">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklydeptAttendance}>
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <XAxis
                    dataKey="department"
                    tick={{ angle: -15, dy: 8, fontSize: "10px", textAnchor: "end" }}
                  />
                  <Bar dataKey="percentage" fill={theme.primaryColor} barSize={35} radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div> */}
          <div className="bg-white shadow-xl rounded-2xl w-full lg:w-[43%] ">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 p-3">
              📊 Weekly Attendance
            </h2>
            <div className="w-full h-[400px]">
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
                  >
                    {/* <LabelList dataKey="percentage" position="top" formatter={(val) => `${val}%`} /> */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div
            className="w-full lg:w-[24%] flex flex-col rounded-xl shadow-lg py-4 px-4"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <div className="flex justify-end mb-2">
              <SettingsIcon
                className="cursor-pointer text-gray-700 hover:text-gray-900"
                onClick={() => setShowPopUp(true)}
              />
            </div>
            <h2 className="text-center text-lg font-bold text-red-600 mb-1">
              Special Days Coming Up
            </h2>
            <h3 className="text-center text-sm font-semibold text-gray-800 mb-4">
              Today: {todayDate}
            </h3>

            {/* 🎈 Today's Events */}
            <div className="space-y-4 overflow-y-auto scrollbar-hide max-h-[230px] mb-6">
              {specialDays?.todaySpecialEvents?.length > 0 ? (
                specialDays.todaySpecialEvents.map((event) => {
                  const formattedDate = event?.eventDate
                    ? new Intl.DateTimeFormat("en-GB").format(
                        new Date(event?.eventDate)
                      )
                    : "Invalid date";

                  return (
                    <div
                      key={event?.eventDate}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white shadow"
                    >
                      <img
                        src={
                          event?.image ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="event"
                        className="h-[45px] w-[45px] rounded-full object-cover border"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">
                          {event?.name}
                        </p>
                        <p className="text-gray-600">
                          Celebration: {event?.eventCelebration}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Date: {formattedDate}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">
                  No special events today.
                </p>
              )}
            </div>
            <hr
              className="border-t-2 my-4"
              style={{ borderColor: theme.primaryColor }}
            />

            {/* 🗓️ Upcoming Events */}
            <h3 className="text-center text-lg font-bold text-red-600 mb-2">
              Upcoming Events
            </h3>
            <div className="space-y-4 overflow-y-auto scrollbar-hide max-h-[230px]">
              {specialDays?.upcomingSpecialEvents?.length > 0 ? (
                specialDays.upcomingSpecialEvents.map((event) => {
                  const formattedDate = event?.eventDate
                    ? new Intl.DateTimeFormat("en-GB").format(
                        new Date(event?.eventDate)
                      )
                    : "NA";

                  return (
                    <div
                      key={event?.eventDate}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white shadow"
                    >
                      <img
                        src={
                          event?.image ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="event"
                        className="h-[45px] w-[45px] rounded-full object-cover border"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">
                          {event?.name}
                        </p>
                        <p className="text-gray-600">
                          Celebration: {event?.eventCelebration}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Date: {formattedDate}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">No upcoming events.</p>
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

        {/* Employee Status Overview  */}

        <div className=" bg-white rounded-2xl">
          <div className="w-full rounded-xl bg-opacity-50 flex items-center">
            <h1 className="px-4 py-2 text-lg font-semibold text-gray-800">
              Employee Status Overview
            </h1>
            <span className="flex-1"></span>
          </div>
          <div className="px-8">
            <div className="overflow-y-scroll max-h-[500px] w-full">
              <table
                className="w-full border-separate"
                style={{ borderSpacing: 0 }}
              >
                <thead className="sticky top-0 bg-white z-10">
                  <tr
                    className="font-semibold text-gray-600 h-[40px]"
                    style={{ borderBottom: "2px solid #6B7280" }}
                  >
                    <th
                      className="text-left px-4 py-2 border-b-2 border-gray-500"
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 11,
                      }}
                    >
                      Sr. No.
                    </th>
                    <th
                      className="text-left px-4 py-2 border-b-2 border-gray-500"
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 11,
                      }}
                    >
                      Employee Name
                    </th>
                    <th
                      className="text-left px-4 py-2 border-b-2 border-gray-500"
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 11,
                      }}
                    >
                      Employee Id
                    </th>
                    <th
                      className="text-left px-4 py-2 border-b-2 border-gray-500"
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 11,
                      }}
                    >
                      Department
                    </th>
                    <th
                      className="text-left px-4 py-2 border-b-2 border-gray-500"
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 11,
                      }}
                    >
                      Upcoming Leave
                    </th>
                    <th
                      className="text-left px-4 py-2 border-b-2 border-gray-500"
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 11,
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="w-full py-4 flex justify-center items-center">
                          <LoaderSpinner />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    employeeStatusOverViewList?.employees?.map(
                      (list, index) => (
                        <tr key={list?._id}>
                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap border-b border-gray-300">
                            {(page - 1) * limit + index + 1}
                          </td>
                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap border-b border-gray-300">
                            <span className="flex items-center gap-3">
                              <img
                                src={list?.photo || Profile}
                                alt="img"
                                className="h-[40px] w-[40px] rounded-full object-cover"
                              />
                              {list?.employeeName}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap border-b border-gray-300">
                            {list?.empId}
                          </td>
                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap border-b border-gray-300">
                            {list?.department}
                          </td>
                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap border-b border-gray-300">
                            {list?.upcomingLeaves[0]
                              ? `${new Date(
                                  list?.upcomingLeaves[0]?.fromDate
                                ).toLocaleDateString("en-GB")} to ${new Date(
                                  list?.upcomingLeaves[0]?.toDate
                                ).toLocaleDateString("en-GB")}`
                              : "None"}
                          </td>
                          <td
                            className={`px-4 py-2 text-gray-700 whitespace-nowrap border-b border-gray-300
                            ${
                              list?.status === "Present"
                                ? "text-green-600 font-semibold"
                                : list?.status === "On Leave"
                                ? "text-yellow-600 font-semibold"
                                : "text-red-600 font-semibold"
                            } `}
                          >
                            {list?.status}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* pagination */}
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
