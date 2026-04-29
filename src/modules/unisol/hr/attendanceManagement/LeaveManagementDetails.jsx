import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { useState } from "react";
import CalenderLeaves from "./Components/CalenderLeaves";
import StatusApproval from "./Components/StatusApproval";
import HolidayList from "./Components/HolidayList";
import BreadCrumb from "../../../../components/BreadCrumb";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LeaveSummary from "./Components/LeaveSummary";

const LeaveManagementDetails = () => {
  const [value, setValue] = useState("1");
  const isEmployeeLogin = sessionStorage.getItem("isEmployeeLogin");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      {isEmployeeLogin ? (
        <BreadCrumb
          linkText={[
            { text: "Dashboard", href: "/EmployeeDashboard" },
            { text: "View Leave Status" },
          ]}
        />
      ) : (
        <BreadCrumb
          linkText={[
            { text: "Attendance Management", href: "/attendenceDashboard" },
            { text: "Leave Management", href: "/leaveManagement" },
            { text: "Leave Details" },
          ]}
        />
      )}
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
                  height: "4px",
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
              <Tab label="Calender" value="1" sx={{ flex: 1, minWidth: 0 }} />
              <Tab
                label="Status & Approval"
                value="2"
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Tab
                label="Leave Summary"
                value="3"
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Tab
                iconPosition="start"
                label="Holidays List"
                value="4"
                sx={{ flex: 1, minWidth: 0 }}
              />
            </TabList>
          </Box>
          <TabPanel style={{ padding: 0 }} value="1">
            <CalenderLeaves />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} value="2">
            <StatusApproval />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} value="3">
            <LeaveSummary />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} value="4">
            <HolidayList />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default LeaveManagementDetails;
