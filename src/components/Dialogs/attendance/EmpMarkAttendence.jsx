import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import ABSTRACT from "../../../assets/images/2442270127.png";
import IMG from "../../../assets/images/Ellipse.png";
import useEmpAttendence from "../../../hooks/unisol/empAttendence/useEmpAttendence";

const EmpMarkAttendence = ({ onClose }) => {
  const {
    fetchEmpByIdForDashboard,
    empByIdForDashboard,
    markAttendence,
    attendence,
  } = useEmpAttendence();
  console.log("Emp By Id For Attendence: ", empByIdForDashboard);

  // Emp Id
  const empId = sessionStorage.getItem("empId");
  const now = new Date();
  const todayDate = now.toLocaleDateString();
  useEffect(() => {
    fetchEmpByIdForDashboard(empId);
  }, []);

  const data = {
    employeeId: empId,
    date: todayDate,
    status: "", //Absent
  };

  const handlePresent = () => {
    data.status = "Present";
    markAttendence(data);
    console.log("Attendence res: ", attendence);
  };

  const handleOnLeave = () => {
    data.status = "Absent";
    markAttendence(data);
    console.log("Attendence res: ", attendence);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 ">
      <div className="bg-[#EBFAFF] rounded-2xl shadow-lg w-[615px] h-[415px] ">
        {/* Header */}
        <div
          className="flex justify-between h-[89px] w-full  items-center border-b p-8"
          style={{ backgroundImage: `url(${ABSTRACT})` }}
        >
          {/* Title */}
          <h2 className="text-xl text-[#000000] font-medium">
            Mark Your Attendence
          </h2>

          {/* Close Button */}
          <button onClick={onClose}>
            <IoMdClose size={24} className="cursor-pointer " />
          </button>
        </div>

        <div className="bg-[#E8F7F8] px-6 py-12 space-y-4">
          <div className="flex justify-center items-center mb-4 space-x-7">
            <img
              src={IMG}
              alt="Profile"
              className="rounded-full w-24 h-24 object-cover"
            />

            <div>
              <h2 className="text-base font-normal">
                {empByIdForDashboard?.employeeName}
              </h2>
              <p className="font-medium text-base">
                Employee ID:{" "}
                <span className="font-normal">
                  {empByIdForDashboard?.empId}
                </span>{" "}
              </p>
              <p className="font-medium text-base">
                Position:{" "}
                <span className="font-normal">
                  {" "}
                  {empByIdForDashboard?.jobTitle}
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center pt-10 space-x-16">
            <div className="flex flex-col space-y-8">
              <p className="font-medium text-base">
                Current Date:{" "}
                <span className="font-normal text-base">
                  {empByIdForDashboard?.current_date}
                </span>
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handlePresent}
                  className="bg-[#72B168B2] text-[#138911] font-normal text-sm px-4 py-2 rounded-lg border border-[#138911] hover:bg-[#33ab31] hover:text-white"
                >
                  Present
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <p className="font-medium text-base">
                Current Time:{" "}
                <span className="font-normal text-base">
                  {empByIdForDashboard?.indiaTime.split(" ")[1]}
                </span>{" "}
              </p>
              <button
                onClick={handleOnLeave}
                className="bg-[#D94E4E5C] text-[#7E3D42] font-normal text-sm px-4 py-2 rounded-lg border border-[#7E3D42] hover:bg-[#d44752] hover:text-white"
              >
                On Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpMarkAttendence;
