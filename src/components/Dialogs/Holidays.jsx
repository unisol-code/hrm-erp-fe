import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import PASTAL from "../../assets/images/190472.png";
import useEmpHoliday from "../../hooks/unisol/empHoliday/useEmpHoliday";

const Holidays = ({ onClose }) => {
  const { allHolidayDetails, allHoliday } = useEmpHoliday();

  useEffect(() => {
    allHolidayDetails();
    console.log("Holiday res:", allHoliday);
  }, []);

  console.log("allHoliday : ", allHoliday);

  return (
    <div className="fixed bg-black bg-opacity-30  inset-0 flex items-center justify-center z-50 ">
      <div className="h-screen w-screen  flex justify-center items-center">
        <div className="w-[518px] h-[264px] bg-white rounded-md shadow-lg ">
          <div
            className="flex justify-between items-center w-[518px] h-[50px] px-10"
            style={{ backgroundImage: `url(${PASTAL})` }}
          >
            <h1 className=" text-[#000000] text-opacity-22 text-xl font-semibold">
              Holidays{" "}
            </h1>
            <button onClick={onClose}>
              <IoMdClose size={24} />
            </button>
          </div>
          <div className="space-y-4 text-base font-normal w-full px-6 py-6 overflow-y-scroll h-[200px] y-slider">
            {allHoliday?.companyHolidays?.map((row, index) => (
              <div key={index}>
                <h2>{row.month} :</h2>
                {row?.holidays?.map((data, i) => (
                  <li className="ml-4" key={i}>
                    <span>{data?.holidayTitle}</span> -{" "}
                    <span>{data?.date}</span>
                  </li>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holidays;
