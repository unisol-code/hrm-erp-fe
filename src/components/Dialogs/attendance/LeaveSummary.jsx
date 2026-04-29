import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import PASTAL from "../../assets/images/pastel-background.png";
import useAttendence from "../../../hooks/unisol/attendence/useAttendence";

function createData(field, details) {
  return { field, details };
}

const rows = [
  createData("Total Leave Taken:", "5 days"),
  createData("Leave Balance:", "8 days"),
  createData("Leave Type:", "Sick Leave, Casual Leave"),
  createData("Upcoming Leaves:", "2024-09-15"),
];

const LeaveSummary = ({ onClose, employeeId }) => {
  const { getEmployeeLeaveSummary, employeeLeaveSummary } = useAttendence();

  useEffect(() => {
    getEmployeeLeaveSummary(employeeId);
  }, []);

  console.log("employeeLeaveSummary : ", employeeLeaveSummary);

  function createData(field, details) {
    return { field, details };
  }

  const rows = [
    createData("Total Leave Taken:", employeeLeaveSummary?.totalLeavesTaken),
    createData("Leave Balance:", employeeLeaveSummary?.leaveBalance),
    createData("Leave Type:", employeeLeaveSummary?.leaveType),
    createData("Upcoming Leaves:", employeeLeaveSummary?.upcomingLeaves),
  ];

  return (
    <div className="fixed bg-black bg-opacity-30  inset-0 flex items-center justify-center z-50 ">
      <div className="h-screen w-screen  flex justify-center items-center">
        <div className="w-[605px] h-[501px] bg-white rounded-md shadow-lg">
          <div
            className="flex justify-between items-center  w-[605px] h-[60.29px] px-10"
            style={{ backgroundImage: `url(${PASTAL})` }}
          >
            <h1 className=" text-[#000000] text-opacity-22 text-xl font-semibold">
              Leave Summary
            </h1>
            <button onClick={onClose}>
              {" "}
              <IoMdClose size={24} />
            </button>
          </div>
          <table className="min-w-full text-left mt-12 ml-8 border-gray-300 rounded-md">
            <thead>
              <tr className="border-b">
                <th className=" font-medium text-[#444444] px-4 py-2">Field</th>
                <th className=" font-medium text-[#444444] px-4 py-2">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className=" font-medium px-4 py-2">{row.field}</td>
                  <td className=" font-normal px-4 py-2">{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveSummary;
