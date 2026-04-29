import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import useLeavePolicy from "../../../../hooks/unisol/hrDashboard/useLeavePolicy";
import Breadcrumb from "../../../../components/BreadCrumb";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const AnualLeavePolicy = () => {
  const [value, setValue] = useState("1");
  const { annualLeavePolicy, fetchAnnualLeavePolicy, loading } = useLeavePolicy();

  useEffect(() => {
    fetchAnnualLeavePolicy();
  }, []);

  console.log(annualLeavePolicy);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Dashboard", href: "/hrDashboard" },
          {
            text: "Annual Leave Policy",
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
              <Tab label="Annual Leave Policy" value="1" />
            </TabList>
          </Box>
          <TabPanel
            style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            value="1"
          >
            <div className="bg-white rounded-2xl p-6">
              {/* <h2 className="text-gray-600 text-2xl text-center font-semibold mb-4">
                Annual Leave Policy
              </h2> */}
              <p className="text-gray-500 text-base leading-relaxed">
                {loading?(<div className="flex w-full items-center justify-center"><LoaderSpinner/></div>):annualLeavePolicy?.content ||
                  "No policy available at the moment."}
              </p>
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default AnualLeavePolicy;
