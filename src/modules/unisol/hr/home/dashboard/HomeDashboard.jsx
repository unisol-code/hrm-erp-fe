/* eslint-disable no-unused-vars */
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EventTemplate from "../../../../../assets/images/happy-birthday-background-template.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useDashboard from "../../../../../hooks/unisol/hrDashboard/useDashborad";
import Calendar from "react-calendar";
import "../../../../../css/calendar.css";
import { HiBars2 } from "react-icons/hi2";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCoreHRAttendance from "../../../../../hooks/unisol/coreHr/useCoreHRAttendance";
import Pagination from "../../../../../components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import useHomeDashboard from "../../../../../hooks/unisol/homeDashboard/useHomeDashboard";
import Select from "react-select";
import LoaderSpinner from "../../../../../components/LoaderSpinner"

const HrDashboard = () => {
  const { switchTheme } = useTheme();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const compId = sessionStorage.getItem("companyId");
  const [companyId, setCompanyId] = useState(compId);
  const companyaName = sessionStorage.getItem("companyName");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    fetchCompanyById,
    companyById,
    deleteNotification,
    markNotificationRead,
    fetchAllUpcomingMeetList,
    companyData,
    fetchCompaniesData,
  } = useDashboard();
  useEffect(() => {
    switchTheme(companyaName);
  }, [companyaName, switchTheme]);
  useEffect(() => {
    if (companyData.length > 0) {
      const idFromSession =
        sessionStorage.getItem("companyId") || companyData[0]?._id;
      const company = companyData.find((c) => c._id === idFromSession);
      if (company) {
        setCompanyId(company._id);
        switchTheme(company.name);
      }
    }
  }, [companyData]);

  const {
    homeTotalEmpAttendance,
    homeWeeklyAttendance,
    homeTodaysEmpAttendance,
    homeSpecialDays,
    homeCompaniesOverview,
    fetchHomeCompaniesOverview,
    homeNewEmployeeCount,
    homeUpcomingMeetAndHoliday,
    fetchHomeNewEmployeeCount,
    fetchHomeUpcomingMeetsAndHolidays,
    fetchHomeTotalEmpAttendance,
    fetchHomeTodaysEmpAttendance,
    fetchHomeWeeklyDeptAttendance,
    fetchHomeSpecialDays,
    fetchHomeEmployeeOverview,
  } = useHomeDashboard();

  const companyid = sessionStorage.getItem("companyId");
  // console.log("companyData", companyData);
  console.log("homeUpcomingMeetAndHoliday", homeUpcomingMeetAndHoliday);

  // const handleCompanySelect = (e) => {
  //   const selectedOption = e.target.options[e.target.selectedIndex];
  //   const newCompanyId = selectedOption.id;
  //   const companyName = e.target.value;
  //   switchTheme(companyName);
  //   setCompanyId(newCompanyId);
  //   sessionStorage.setItem("companyId", newCompanyId);
  //   sessionStorage.setItem("companyName", companyName);
  //   if (companyName === "Home") {
  //     navigate("/homeDashboard");
  //   } else {
  //     navigate("/hrDashboard");
  //   }
  // };

  const companyOptions = (companyData || []).map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const handleCompanySelect = (selected) => {
    if (!selected) {
      setCompanyId("");
      sessionStorage.removeItem("companyId");
      sessionStorage.removeItem("companyName");
      return;
    }

    const newCompanyId = selected.value;
    const companyName = selected.label;

    // Switch theme
    switchTheme(companyName);

    // Update state and sessionStorage
    setCompanyId(newCompanyId);
    sessionStorage.setItem("companyId", newCompanyId);
    sessionStorage.setItem("companyName", companyName);

    // Navigation logic
    if (companyName === "Home") {
      navigate("/homeDashboard");
    } else {
      navigate("/hrDashboard");
    }
  };
  const [localLoading, setLocalLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true);

        await Promise.all([
          fetchCompanyById(),
          deleteNotification(),
          markNotificationRead(),
          fetchAllUpcomingMeetList(),
          fetchCompaniesData(),
          fetchHomeNewEmployeeCount(),
          fetchHomeTotalEmpAttendance(),
          fetchHomeTodaysEmpAttendance(),
          fetchHomeWeeklyDeptAttendance(),
          fetchHomeSpecialDays(),
          fetchHomeCompaniesOverview(),
          fetchHomeUpcomingMeetsAndHolidays(),
        ]);
      } catch (error) {
        console.error("Error while fetching dashboard data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleCompanyName = (list) => {
    console.log("list", list);
    const companyName = list?.companyName;
    // fetchHomeEmployeeOverview(companyName);
    navigate(`/homeDashboard/employeeDetails/${companyName}`);
  };
  console.log("homeCompaniesOverview : ", homeCompaniesOverview);

  const date = new Date();
  const todayDate = `${date.getDate()}/${date.getMonth() + 1
    }/${date.getFullYear()}`;

  const [value, setValue] = useState(new Date());
  const [meetingInfo, setMeetingInfo] = useState("");
  const [open, setOpen] = useState(false);

  const handleDateClicked = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const event = homeUpcomingMeetAndHoliday?.data?.find(
      (data) => data.date.split("T")[0] === formattedDate
    );
    if (event) {
      setMeetingInfo(event || "");
      setValue(event);
      setOpen(true);
    }
    return null;
  };

  const companies = ["UniSol", "SurgiSol", "Enviro solution", "Ignite Sphere"];
  const departments = Array.from(
    new Set(homeWeeklyAttendance?.map((item) => item.department))
  );
  // Transform the data
  const weeklyDeptAttendance = departments.map((dept) => {
    // Start with the department name
    const deptData = { department: dept };

    // Loop over each company and assign the corresponding attendance value
    companies.forEach((company) => {
      // Find the record matching both department and company
      const record = homeWeeklyAttendance?.find(
        (item) => item.department === dept && item.company === company
      );
      // If found, remove the '%' sign and convert to a number; otherwise, use 0
      deptData[company] = record
        ? parseFloat(record.weeklyAttendancePercentage)
        : 0;
    });

    return deptData;
  });

  const handleClose = () => {
    setOpen(false);
    setMeetingInfo("");
  };
  if (localLoading) {
    return (
      <div className="w-full bg-white py-4 flex items-center justify-center">
        <LoaderSpinner />
      </div>
    )
  }

  const getCompanyColor = (companyName) => {
    switch (companyName?.toLowerCase()) {
      case 'unisol': return 'text-blue-600';
      case 'surgisol': return 'text-orange-600';
      case 'enviro solution': return 'text-green-600';
      case 'ignite sphere': return 'text-purple-600';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-end gap-1">
          <h2 className="font-bold">Dashboard</h2>
          <p className="font-medium">Hi, Welcome !</p>
        </div>
        <div>
          <h1 className="text-xs ">Company</h1>
          <Select
            name="companyList"
            id="companyList"
            className="react-select-container w-[200px]"
            classNamePrefix="react-select"
            options={companyOptions}
            value={
              companyOptions.find((opt) => opt.value === companyId) || null
            }
            onChange={(selected) => handleCompanySelect(selected)}
            placeholder="Select a company"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Employee Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">Total Employee</h2>
            <div className={`rounded-full px-3 py-1 flex items-center text-sm font-medium
              ${homeTotalEmpAttendance?.percentageChange > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
            >
              {homeTotalEmpAttendance?.percentageChange > 0 ? (
                <TrendingUpIcon className="text-sm mr-1" />
              ) : (
                <TrendingDownIcon className="text-sm mr-1" />
              )}
              {`${homeTotalEmpAttendance?.percentageChange}%`}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {homeTotalEmpAttendance?.totalEmployeesCount}
          </h2>
          <p className="text-gray-500 text-sm mb-4">Employees</p>

          <div className="space-y-2">
            {[
              { color: "bg-blue-500", name: "UniSol", key: "UniSol" },
              { color: "bg-orange-400", name: "SurgiSol", key: "SurgiSol" },
              { color: "bg-green-400", name: "Enviro solution", key: "Enviro solution" },
              { color: "bg-purple-500", name: "Ignite Sphere", key: "Ignite Sphere" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-gray-600 text-sm"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">({homeTotalEmpAttendance?.companyWiseCounts[item.key]})</span>
              </div>
            ))}
          </div>

        </div>

        {/* New Employees Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">New Employees</h2>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {homeNewEmployeeCount?.totalEmployeesThisMonth}
          </h2>
          <p className="text-gray-500 text-sm mb-4">New Employees This Month</p>

          <div className="space-y-2">
            {[
              {
                color: "bg-blue-500",
                name: `${homeNewEmployeeCount?.companyWiseCounts[3]?.companyName || 'Company'}`,
                count: `${homeNewEmployeeCount?.companyWiseCounts[3]?.count || 0}`,
              },
              {
                color: "bg-orange-400",
                name: `${homeNewEmployeeCount?.companyWiseCounts[2]?.companyName || 'Company'}`,
                count: `${homeNewEmployeeCount?.companyWiseCounts[2]?.count || 0}`,
              },
              {
                color: "bg-green-400",
                name: `${homeNewEmployeeCount?.companyWiseCounts[0]?.companyName || 'Company'}`,
                count: `${homeNewEmployeeCount?.companyWiseCounts[0]?.count || 0}`,
              },
              {
                color: "bg-purple-500",
                name: `${homeNewEmployeeCount?.companyWiseCounts[1]?.companyName || 'Company'}`,
                count: `${homeNewEmployeeCount?.companyWiseCounts[1]?.count || 0}`,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-gray-600 text-sm"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Attendance Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">Today's Attendance</h2>
            <div className={`rounded-full px-3 py-1 flex items-center text-sm font-medium
              ${homeTodaysEmpAttendance?.percentageIncrease > 0
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
              }`}
            >
              {homeTodaysEmpAttendance?.percentageChange > 0 ? (
                <TrendingUpIcon className="text-sm mr-1" />
              ) : (
                <TrendingDownIcon className="text-sm mr-1" />
              )}
              {`${homeTodaysEmpAttendance?.percentageChange}%`}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {homeTodaysEmpAttendance?.totalTodaysAttendanceCount}
          </h2>
          <p className="text-gray-500 text-sm mb-4">Attendance Today</p>

          <div className="space-y-2">
            {[
              {
                color: "bg-blue-500",
                name: `${homeTodaysEmpAttendance?.companyWiseCounts[0]?.companyName || 'Company'}`,
                count: `${homeTodaysEmpAttendance?.companyWiseCounts[0]?.count || 0}`,
              },
              {
                color: "bg-orange-400",
                name: `${homeTodaysEmpAttendance?.companyWiseCounts[1]?.companyName || 'Company'}`,
                count: `${homeTodaysEmpAttendance?.companyWiseCounts[1]?.count || 0}`,
              },
              {
                color: "bg-green-400",
                name: `${homeTodaysEmpAttendance?.companyWiseCounts[2]?.companyName || 'Company'}`,
                count: `${homeTodaysEmpAttendance?.companyWiseCounts[2]?.count || 0}`,
              },
              {
                color: "bg-purple-500",
                name: `${homeTodaysEmpAttendance?.companyWiseCounts[3]?.companyName || 'Company'}`,
                count: `${homeTodaysEmpAttendance?.companyWiseCounts[3]?.count || 0}`,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-gray-600 text-sm"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="flex flex-wrap justify-between gap-2 w-full">
        {/* Event calendar */}
        <div className="bg-white flex flex-col w-full md:w-[36%] rounded-md relative">
          <div className="h-[350px] w-full day-tile-wrapper">
            <Calendar
              value={value}
              onClickDay={handleDateClicked}
              className="calender-body h-full"
              tileClassName={({ date }) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const formattedDate = `${year}-${month}-${day}`;

                const eventForDate = homeUpcomingMeetAndHoliday?.data?.find(
                  (data) => data.date.split("T")[0] === formattedDate
                );
                return eventForDate ? "highlight-event" : null;
              }}
              tileContent={({ date }) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const formattedDate = `${year}-${month}-${day}`;

                const eventForDate = homeUpcomingMeetAndHoliday?.data?.find(
                  (data) => data.date.split("T")[0] === formattedDate
                );
                if (eventForDate) {
                  return (
                    <HiBars2
                      key={eventForDate.id}
                      className={`event-icon ${eventForDate?.type === "holiday"
                        ? "text-red-600"
                        : "text-[#A69F00]"
                        }`}
                    />
                  );
                }
                return null;
              }}
            />
            <Dialog open={open} onClose={handleClose} fullWidth>
              <DialogTitle className="flex items-center justify-between bg-[#CDEDF9]">
                <span className=" flex">Meeting Details</span>

                <CloseIcon
                  className="cursor-pointer"
                  onClick={handleClose}
                ></CloseIcon>
              </DialogTitle>
              <DialogContent>
                {meetingInfo ? (
                  <div className="w-full flex flex-col gap-6 px-2">
                    <div className="grid grid-cols-3 w-full">
                      <div className="col-span-1 font-semibold text-gray-500">
                        Field
                      </div>
                      <div className="col-span-2 font-semibold text-gray-500">
                        {" "}
                        Details
                      </div>
                    </div>
                    {meetingInfo?.title && (
                      <div className="grid grid-cols-3">
                        <div className="col-span-1">Meeting Title</div>
                        <div className="col-span-2">{meetingInfo?.title}</div>
                      </div>
                    )}
                    {meetingInfo?.date && (
                      <div className="grid grid-cols-3 w-full">
                        <div className="col-span-1">Date</div>
                        <div className="col-span-2">
                          {" "}
                          {meetingInfo?.date.split("T")[0]}
                        </div>
                      </div>
                    )}
                    {meetingInfo?.time && (
                      <div className="grid grid-cols-3 w-full">
                        <div className="col-span-1">Time</div>
                        <div className="col-span-2"> {meetingInfo?.time}</div>
                      </div>
                    )}
                    {meetingInfo?.location && (
                      <div className="grid grid-cols-3 w-full">
                        <div className="col-span-1">Location</div>
                        <div className="col-span-2">
                          {" "}
                          {meetingInfo?.location}
                        </div>
                      </div>
                    )}
                    {meetingInfo?.participants && (
                      <div className="grid grid-cols-3 w-full">
                        <div className="col-span-1">Attendees</div>
                        <div className="col-span-2">
                          <ul className="flex flex-col">
                            {meetingInfo?.participants?.map(
                              (participant, index) => (
                                <li key={index}>{participant}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                    {meetingInfo?.description && (
                      <div className="grid grid-cols-3 w-full">
                        <div className="col-span-1">Description</div>
                        <div className="col-span-2">
                          {meetingInfo?.description}
                        </div>
                      </div>
                    )}
                    {meetingInfo?.organizer && (
                      <div className="grid grid-cols-3 w-full">
                        <div className="col-span-1">Organizer</div>
                        <div className="col-span-2">
                          {" "}
                          {meetingInfo?.organizer?.name}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <h2>No meeting on this date</h2>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-center gap-2">
            <span className="flex gap-2 justify-center items-center">
              <h2 className="text-xs font-semibold py-1 px-4 mb-2 text-black">
                <span className="text-red-600 text-lg">●</span> Holiday
              </h2>
              {/* </Link> */}
            </span>
            <span className="flex gap-2 justify-center items-center">
              {/* <h2 className="text-xs font-semibold py-1 px-4 rounded-md bg-[#A9B5FF] text-white hover:bg-[#5b71fb] cursor-pointer hover:scale-[1.1] transition duration-300"> */}
              <h2 className="text-xs font-semibold py-1 px-4 mb-2 text-black">
                <span className="text-yellow-600 text-lg">●</span> Meetings
              </h2>
              {/* </Link> */}
            </span>
          </div>
        </div>

        {/* bar chart for attendance*/}
        <div className="bg-white rounded-md py-4 px-4 flex flex-col w-full md:w-[36%]">
          <h2 className="text-[18px] px-4 py-2">Weekly Attendance</h2>
          <div className="w-full h-[310px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyDeptAttendance} barCategoryGap="30%">
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <XAxis
                  dataKey="department"
                  tick={{
                    angle: -15,
                    dy: 8,
                    fontSize: "10px",
                    textAnchor: "end",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="UniSol" fill="#5398FE" barSize={10} radius={4} />
                <Bar
                  dataKey="SurgiSol"
                  fill="#FEB089"
                  barSize={10}
                  radius={4}
                />
                <Bar
                  dataKey="Enviro solution"
                  fill="#A8E6CF"
                  barSize={10}
                  radius={4}
                />
                <Bar
                  dataKey="Ignite Sphere"
                  fill="#B5A8FF"
                  barSize={10}
                  radius={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Celebration events */}
        <div
          className="w-full md:w-[24%] flex flex-col rounded-md"
          style={{ backgroundImage: `url(${EventTemplate})` }}
        >
          <div className="flex justify-end px-4 pt-2">
            <SettingsIcon />
          </div>
          <h2 className="text-red-600 text-center font-bold">
            Special Days Coming Up
          </h2>
          <h2 className="text-red-600 text-center font-bold">
            Today: {todayDate}
          </h2>

          {/* Today’s Special Events */}
          <div className="flex flex-col gap-6 justify-evenly h-[140px] overflow-y-scroll scrollbar-hide">
            {homeSpecialDays?.todaySpecialEvents?.length > 0 ? (
              homeSpecialDays.todaySpecialEvents.map((event) => (
                <div
                  className="flex flex-col items-center justify-center"
                  key={event?.eventDate} // Using eventDate as key to avoid undefined errors
                >
                  <div className="flex justify-center">
                    <span className="flex items-center gap-2 font-bold">
                      <img
                        src={
                          event?.image ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        } // Default placeholder
                        alt="event"
                        className="h-[45px] w-[45px] rounded-full object-cover"
                      />
                      {event?.name}
                    </span>
                  </div>
                  <h2>Celebration: {event?.eventCelebration}</h2>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No special events today.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Employee Status Overview  */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200"
          style={{ backgroundColor: theme.secondaryColor }}>
          <h2 className="font-semibold text-gray-700 text-lg">
            Company Overview
          </h2>
          <p className="text-sm text-gray-600">View company-wise attendance statistics</p>
        </div>

        <div className="px-6 max-h-[400px] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="h-12 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 whitespace-nowrap">Company Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 whitespace-nowrap">Today's Present</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 whitespace-nowrap">Today's Absent</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 whitespace-nowrap">Total Employees</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {homeCompaniesOverview?.map((list) => (
                  <tr key={list?._id} className="h-16 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={getCompanyColor(list?.companyName)}>
                        {list?.companyName}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {list?.presentCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {list?.absentCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                      {list?.totalEmployees}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleCompanyName(list)}
                        className="text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
