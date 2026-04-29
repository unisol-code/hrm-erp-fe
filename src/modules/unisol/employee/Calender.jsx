import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { useState } from "react";
import { CalenderSchedular } from "./Component/CalenderSchedular";
import CreateMeeting from "./Component/CreateMeeting";
import UpcomingMeetings from "./Component/UpcomingMeetings";
import OverallMeetingStatus from "./Component/OverallMeetingStatus";
import Breadcrumb from "../../../components/BreadCrumb";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Calender = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Dashboard", href:"/EmployeeDashboard" },
          {
            text:
              value === "1"
                ? "Calender"
                : value === "2"
                ? "Upcoming Meeting"
                : value === "3"
                ? "Add New Meeting"
                : "Meeting Status",
          },
        ]}
      />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              width: "100%",
              borderBottom: 1,
              borderColor: "divider",
              borderRadius: 4,
              backgroundColor: "white",
              height: 60,
              marginBottom: 2,
            }}
          >
            <TabList
              onChange={handleChange}
              centered
              sx={{
                width: "100%",
                height: 60,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: 8,
                paddingRight: 8,
                "& .MuiTabs-indicator": {
                  height: "6px",
                  borderRadius: "6px 6px 0 0",
                  background:
                    "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                  transition: "all 0.3s",
                },
                "& .Mui-selected": {
                  color: "#2575fc",
                  fontWeight: "bold",
                },
              }}
            >
              <Tab
                icon={<CalendarMonthIcon />}
                iconPosition="start"
                label="Calender"
                value="1"
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Tab
                icon={<EventAvailableIcon />}
                iconPosition="start"
                label="Upcoming Meeting"
                value="2"
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Tab
                icon={<AddCircleOutlineIcon />}
                iconPosition="start"
                label="Add New Meeting"
                value="3"
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Tab
                icon={<CheckCircleOutlineIcon />}
                iconPosition="start"
                label="Meeting Status"
                value="4"
                sx={{ flex: 1, minWidth: 0 }}
              />
            </TabList>
          </Box>
          <TabPanel style={{ padding: 0 }} value="1">
            <CalenderSchedular />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} value="2">
            <UpcomingMeetings />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} value="3">
            <CreateMeeting />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} value="4">
            <OverallMeetingStatus />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default Calender;
