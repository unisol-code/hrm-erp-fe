import React from "react";

const rows = [
  { index: "1", notice: "Blood Donation Camp On 26/11/24" },
  { index: "2", notice: "System Maintenance After 2 AM" },
  {
    index: "3",
    notice: "Independence Day Celebration on 15 August White Dress Code",
  },
  {
    index: "4",
    notice: "Be Ready On 24/08/2024 We Are Launching Our New Product",
  },
  { index: "5", notice: "Environment Day Celebration On 22/08/2024" },
  {
    index: "6",
    notice: "Independence Day Celebration on 15 August White Dress Code",
  },
  { index: "7", notice: "Environment Day Celebration On 22/08/2024" },
];

const EmpNotice = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-[267px] max-h-[635px] overflow-auto scrollbar-hide bg-[#E9EBF7] rounded-xl shadow-lg absolute left-4 top-[20%]">
          <h1 className=" text-[#135078] text=[19.6px] font-semibold flex justify-center mt-4">
            Notice
          </h1>

          {rows.map((data, index) => (
            <div key={index} className="py-3 flex justify-center px-4">
              <h1 className="w-[219px] h-auto bg-[#A9B5FF] p-4 text-[11px] rounded-[11px]">
                {data.notice}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmpNotice;
