import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { useState } from "react";
import {CreateHoliday, HolidayList} from "./index"
import Breadcrumb from "../../../../components/BreadCrumb";

const Holiday = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value);
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Breadcrumb linkText={[
                  { text: "Dashboard", href: "/hrDashboard" },
                  {text: value === "1" ? "Holiday List" : "Create Holiday"}
         ]} />
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
              <Tab label="Holiday List" value="1" sx={{ mx: 1 }} />
              <Tab label="Create Holiday" value="2" sx={{ mx: 1 }} />
            </TabList>
          </Box>
          <TabPanel style={{ padding: 0 }} value="1">
            <HolidayList />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} value="2">
            <CreateHoliday />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default Holiday;
