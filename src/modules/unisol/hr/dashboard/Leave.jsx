import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { useState } from "react";
import { UpcomingLeaves, TodayAllLeaves } from "./index.js"
import Breadcrumb from "../../../../components/BreadCrumb.jsx";

const Leave = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const date = new Date();
  const todayDate = date.toLocaleDateString();

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb linkText={[
        { text: "Dashboard", href: "/hrDashboard" },
        { text: value === "1" ? "Today Leaves" : "Upcoming Leaves" }
      ]} />
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
              marginBottom: 3,
            }}
          >
            <TabList
              onChange={handleChange}
              centered
              style={{
                width: "100%",
                height: 60,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
              <Tab label="Today's Leaves" value="1" />
              <Tab label="Upcoming's Leaves" value="2" />
            </TabList>
          </Box>
          <TabPanel style={{ padding: 0 }} value="1">
            <TodayAllLeaves />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} value="2">
            <UpcomingLeaves />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default Leave;
