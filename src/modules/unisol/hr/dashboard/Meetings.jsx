import { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { CalendarToday, Event, AddCircle, Assessment } from "@mui/icons-material";

import Breadcrumb from "../../../../components/BreadCrumb";
import CreateMeeting from "./CreateMeeting";
import UpcomingMeetings from "./UpcomingMeetings";
import OverallMeetingStatus from "./OverallMeetingStatus";
import TodayMeeting from "./TodayMeeting";

export default function Meetings() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Dashboard", href: "/hrDashboard" },
          {
            text:
              value === "1"
                ? "Today Meetings"
                : value === "2"
                  ? "Upcoming Meetings"
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
              borderBottom: 1,
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "white",
              mb: 2,
              boxShadow: 2,
            }}
          >
            <TabList
              onChange={handleChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  minHeight: 60,
                  flex: 1,
                },
                "& .Mui-selected": {
                  color: "primary.main",
                },
              }}
            >
              <Tab icon={<CalendarToday />} iconPosition="start" label="Today's Meeting" value="1" />
              <Tab icon={<Event />} iconPosition="start" label="Upcoming Meetings" value="2" />
              <Tab icon={<AddCircle />} iconPosition="start" label="Add New Meeting" value="3" />
              <Tab icon={<Assessment />} iconPosition="start" label="Meeting Status" value="4" />
            </TabList>

          </Box>

          <TabPanel sx={{ p: 0 }} value="1">
            <TodayMeeting />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="2">
            <UpcomingMeetings />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="3">
            <CreateMeeting />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="4">
            <OverallMeetingStatus />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
