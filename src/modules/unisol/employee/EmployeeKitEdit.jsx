import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import useEmployeeWelcomeKit from "../../../hooks/unisol/welcomeKit/useWelcomeKit";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

const EmployeeKitEdit = () => {
  const [selectedKits, setSelectedKits] = useState([]);
  const navigate = useNavigate();
  const {
    loading,
    welcomeKitData,
    fetchWelcomeKitById,
    updateEmployeeWelcomeKitsAcknowledged,
  } = useEmployeeWelcomeKit();

  const handleCheckboxChange = (kitId) => {
    setSelectedKits((prev) =>
      prev.includes(kitId)
        ? prev.filter((id) => id !== kitId)
        : [...prev, kitId]
    );
  };
  const handleSave = async () => {
    const payload = {
      welcomeKits: welcomeKitData.welcomeKits.map((kit) => ({
        welcomeKitId: kit.welcomeKitId,
        isAcknowledged: selectedKits.includes(kit.welcomeKitId),
      })),
    };

    await updateEmployeeWelcomeKitsAcknowledged(payload);
  };

  useEffect(() => {
    if (welcomeKitData?.welcomeKits) {
      const acknowledgedIds = welcomeKitData.welcomeKits
        .filter((kit) => kit.isAcknowledged)
        .map((kit) => kit.welcomeKitId);

      setSelectedKits(acknowledgedIds);
    }
  }, [welcomeKitData]);

  console.log("Welcome Kit Data:", welcomeKitData);
  return (
    <div>
      <BreadCrumb
        linkText={[
          {
            text: "Employee Overview",
            href: "/emp/educationalOverview",
          },
          { text: "Welocome Kit" },
        ]}
      />
      <div className="relative mb-4 flex items-center gap-4 rounded-2xl border-b bg-white px-8 py-3 shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Kit Edit Page
          </h2>
        </div>
      </div>
      <div className=" space-y-4">
        {welcomeKitData?.welcomeKits?.map((kit) => (
          <div
            key={kit.welcomeKitId}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <input
                type="checkbox"
                checked={selectedKits.includes(kit.welcomeKitId)}
                onChange={() => handleCheckboxChange(kit.welcomeKitId)}
                className="h-4 w-4"
              />

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {kit.name}
              </h3>
              {/* Status */}
              <span
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  kit.isAcknowledged
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
      <div className="flex justify-center gap-6 mt-3">
        {/* <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          disabled={selectedKits.length === 0}
          className="mt-4 rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Save
        </button> */}
          <Button
          type="button"
          variant={3}
          onClick={() => navigate(-1)}
          text="Back"
        />
        <Button
          type="submit"
          variant={1}
          onClick={handleSave}
          text="Save"
          // disabled={selectedKits.length === 0}
        />
      </div>
    </div>
  );
};

export default EmployeeKitEdit;
