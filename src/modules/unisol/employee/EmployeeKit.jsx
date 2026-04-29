import React, { useEffect } from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import useEmployeeWelcomeKit from "../../../hooks/unisol/welcomeKit/useWelcomeKit";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
// import { Button } from "@mui/material";

const EmployeeKit = () => {
  const { loading, welcomeKitData, fetchWelcomeKitById } =
    useEmployeeWelcomeKit();
  const navigate = useNavigate();
  const handleEdit = () => {
    // Navigate to the edit page
    navigate("/emp/employeeOverview/employeeKit/edit");
  }

  useEffect(() => {
    fetchWelcomeKitById();
  }, []);
  console.log("Welcome Kit Data:", welcomeKitData);
  return (
    <div>
      <BreadCrumb
        linkText={[
          {
            text: "Employee Overview",
            href: "/emp/educationalOverview",
          },
          { text: "Welcome Kit", href: "/emp/employeeOverview/employeeKit" },

        ]}
      />
      <div className="relative mb-4 flex items-center gap-4 rounded-2xl border-b bg-white px-8 py-3 shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Kit View Page
          </h2>
        </div>
      </div>
      <div className="space-y-4">
        {welcomeKitData?.welcomeKits?.map((kit) => (
          <div
            key={kit.welcomeKitId}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {kit.name}
              </h3>
              {/* Status */}
              <span
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${kit.isAcknowledged
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {kit.isAcknowledged ? "Acknowledged" : "Pending"}
              </span>
            </div>

            {/* Images */}
            <div className="mt-3 flex gap-3">
              {kit.photos?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={kit.name}
                  className="h-20 w-20 rounded-md object-cover border"
                />
              ))}
            </div>
            {/* Description */}
            <p className="mt-3 text-sm text-gray-600">{kit.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-2">
        <Button
          type="submit"
          variant={1}
          onClick={handleEdit}
          text="Edit Welcome Kit"
        />
      </div>
    </div>
  );
};

export default EmployeeKit;
