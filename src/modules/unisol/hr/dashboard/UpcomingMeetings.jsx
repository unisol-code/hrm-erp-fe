import { useEffect, useState } from "react";
import ViewMeetingDetails from "../../../../components/Dialogs/meetings/ViewMeetingDetails";
import useEmpDashboard from "../../../../hooks/unisol/empDashboard/empDashboard";
import useDashboard from "../../../../hooks/unisol/hrDashboard/useDashborad";
import Button from "../../../../components/Button";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const UpcomingMeetings = () => {
  const isSuperAdminLogin = sessionStorage.getItem("isSuperAdminLogin");
  const empId = isSuperAdminLogin?sessionStorage.getItem("superAdminId"):sessionStorage.getItem("empId");
  const [openViewMeetingDetails, setOpenViewMeetingDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { fetchAllUpcomingMeetList, allUpcomingMeetList, loading } = useDashboard();

  useEffect(() => {
    fetchAllUpcomingMeetList(empId);
  }, [empId]);

  const handleViewMeetingDetails = (id) => {
    setOpenViewMeetingDetails(true);
    setSelectedId(id);
  };

  console.log("allUpcomingMeetings : ", allUpcomingMeetList);
  return (
    <div className="bg-white rounded-2xl py-4 px-4 flex flex-col gap-6 h-[513px] overflow-y-scroll">
      {
       loading?(<div className="flex w-full items-center justify-center"><LoaderSpinner/></div>):(
         allUpcomingMeetList?.length > 0 ?(
        allUpcomingMeetList.map((meeting) => (
        <div
          key={meeting?._id}
          className="shadow-md rounded-2xl bg-[#f2f6fa] px-4 grid grid-cols-5 py-2"
        >
          <div className="col-span-1 flex flex-col gap-2 border-r border-gray-300">
            <h2>
              Date :{" "}
              <span className="text-gray-500">
                {new Date(meeting?.date).toLocaleDateString('en-GB')}
              </span>
            </h2>
            <h2>
              {" "}
              Time : <span className="text-gray-500">{meeting?.time}</span>
            </h2>
          </div>
          <div className="col-span-4 grid grid-cols-3 px-2 ">
            <div className="col-span-2 flex flex-col">
              <h2 className="text-[20px] text-gray-500 font-semibold">
                {meeting?.title}
              </h2>
              <h2 className="text-[16px]">
                Organizer :{" "}
                <span className="text-gray-500 text-[14px]">
                  {meeting?.organizer?.name}
                </span>
              </h2>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              {/* <button
                className="rounded-xl py-2 px-4 bg-[#709EB1] text-white hover:bg-[#318bb1] shadow-md"
                onClick={() => handleViewMeetingDetails(meeting._id)}
              >
                View Meeting Details
              </button> */}
              <Button text = {"View Meeting Details"}  onClick={() =>handleViewMeetingDetails(meeting._id)} variant = {1}/>
              {openViewMeetingDetails &&
                selectedId === meeting._id &&
                meeting && (
                  <ViewMeetingDetails
                    openDialog={openViewMeetingDetails}
                    closeDialog={() => {
                      setOpenViewMeetingDetails(false);
                      setSelectedId(null);
                    }}
                    meetingId={meeting._id}
                  />
                )}
            </div>
          </div>
        </div>
      ))):(<div className="text-gray-700 text-lg font-semibold py-5 justify-center items-center text-center w-full">No upcoming meetings are scheduled for today.</div>))
      }
      
    </div>
  );
};

export default UpcomingMeetings;