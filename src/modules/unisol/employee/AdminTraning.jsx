import React, { useState } from 'react'
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AdminBackgroundPic from "../../../assets/images/Admin-traning-pic.png"

const AdminTraning = () => {
    const [searchValues, setSearchValues] = useState({
        startDate: "",
        endDate: "",
        select: "",
      });
    
      const handleInputChange = (e) => {
        setSearchValues({ ...searchValues, [e.target.name]: e.target.value });
      };
    
      const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(searchValues);
      };
    
      return (
        <div className="flex  flex-col bg-white p-[50px] rounded-2xl gap-8">
          <div className="flex justify-center text-[#01008A] font-bold gap-4 mt-6">
            <h2 className="py-2 px-4 bg-[#E8E8FF] rounded-md">Work Hour</h2>
            <div className="flex items-center border border-gray-300 rounded-md px-4 gap-4">
              <h2>
                Start Date{" "}
                <span className="text-[#333333] font-medium">15/02/2021</span>
              </h2>
              <h2>
                Start Date{" "}
                <span className="text-[#333333] font-medium">15/02/2021</span>
              </h2>
              <h2>
                Start Date{" "}
                <span className="text-[#333333] font-medium">15/02/2021</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <input
              className="border rounded-md px-2 h-[35px] border-[#7676DC]"
              type="date"
              placeholder="Start Date"
              name="startDate"
            />
            <input
              className="border rounded-md px-2 h-[35px] border-[#7676DC]"
              type="date"
              placeholder="Start Date"
              name="startDate"
            />
            <select
              className="border rounded-md px-2 h-[35px] text-[#01008A] border-[#7676DC] font-semibold"
              name="select"
              id=""
            >
              <option value="">Select</option>
              <option value="">None</option>
            </select>
            <button className="border rounded-md px-2 h-[35px] bg-[#01008A] text-white">
              Search
            </button>
            <button className="border rounded-md px-2 h-[35px] border-[#7676DC] font-semibold text-[#01008A]">
              Reset
            </button>
            <div className="flex w-full gap-3">
              <button className="w-full border rounded-md px-2 h-[35px]">
                <NavigateBeforeIcon />{" "}
              </button>
              <div className="w-full flex justify-center items-center border rounded-md px-2 h-[35px] bg-[#01008A] text-white">
                1
              </div>
              <button className="w-full border rounded-md px-2 h-[35px]">
                <NavigateNextIcon />{" "}
              </button>
            </div>
          </div>
          <div className="p-[50px] border border-gray-300 flex flex-col items-center justify-center">
            <img
              className="h-[310px] w-[400px] object-contain"
              src={ AdminBackgroundPic}
              alt=""
            />
            <h2 className=" mt-5 font-normal text-xl text-balance ">No record to display here</h2>
          </div>
        </div>
      );
    
}

export default AdminTraning