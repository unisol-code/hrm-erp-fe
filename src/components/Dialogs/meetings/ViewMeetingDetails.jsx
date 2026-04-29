import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import useEmpDashboard from "../../../hooks/unisol/empDashboard/empDashboard";
import Skeleton from "react-loading-skeleton";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { useTheme } from "../../../hooks/theme/useTheme";
import LoaderSpinner from "../../LoaderSpinner";
import SanitizedHTML from "../../../utils/SanitizedHTML";

const ViewMeetingDetails = ({ openDialog, closeDialog, meetingId }) => {
  const [open, setOpen] = useState(openDialog);
  const { getMeetingDetails, meetingDetails, resetMeetingDetails, loading } =
    useEmpDashboard();
  const { theme } = useTheme();
  // const formatDate = (dateString) => {
  //   if (!dateString) return "-";
  //   const [year, day, month] = dateString.split("T")[0].split("-");
  //   return `${day}/${month}/${year}`;
  // };

  /* const handleClickOpen = () => {
    setOpen(true);
  }; */
  useEffect(() => {
    if (meetingId) {
      getMeetingDetails(meetingId);
    }
  }, [meetingId]);
  console.log("loading :", loading);
  console.log("meetingDetails : ", meetingDetails);

  const handleClose = () => {
    resetMeetingDetails();
    setOpen(false);
    closeDialog();
  };
  console.log("theme.secondaryColor:", theme.secondaryColor);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      componentsProps={{
        backdrop: {
          style: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)", 
          },
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          zIndex: "2000 !important",
        },
        "& .MuiPaper-root": {
          zIndex: "2001 !important",
        },
      }}
    >      <DialogTitle>
        <div
          className="flex items-center justify-between gap-5 p-4 rounded-t-md"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="flex items-center gap-2">
            <HiOutlineCalendar className="text-2xl text-[#709EB1]" />
            <h2 className="font-bold text-[#2d3a4e]">Meeting Details</h2>
          </div>
          <CloseIcon className="cursor-pointer" onClick={handleClose} />
        </div>
      </DialogTitle>

      <DialogContent className="bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff]">
        {
          loading ? (<div className="w-full py-4 flex justify-center"><LoaderSpinner /></div>) : (
            <div className="py-10 grid grid-cols-1 gap-6 text-sm">
              <div className="grid grid-cols-3 items-center">
                <div className="col-span-1 font-semibold flex items-center gap-2 text-gray-600">
                  <HiOutlineClipboardList className="text-[#709EB1] text-lg" />
                  <span>Title</span>
                </div>
                <div className="col-span-2 font-medium text-gray-800">
                  {meetingDetails?.title || <Skeleton />}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="col-span-1 font-semibold flex items-center gap-2 text-gray-600">
                  <HiOutlineCalendar className="text-[#709EB1] text-lg" />
                  <span>Date</span>
                </div>
                <div className="col-span-2 font-medium text-gray-800">
                  {meetingDetails?.date ? (
                    new Date(meetingDetails?.date).toLocaleDateString("en-GB")
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="col-span-1 font-semibold flex items-center gap-2 text-gray-600">
                  <HiOutlineClock className="text-[#709EB1] text-lg" />
                  <span>Time</span>
                </div>
                <div className="col-span-2 font-medium text-gray-800">
                  {meetingDetails?.time || <Skeleton />}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="col-span-1 font-semibold flex items-center gap-2 text-gray-600">
                  <HiOutlineLocationMarker className="text-[#709EB1] text-lg" />
                  <span>Location</span>
                </div>
                <div className="col-span-2 font-medium text-gray-800">
                  {meetingDetails?.location || <Skeleton />}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="col-span-1 font-semibold flex items-center gap-2 text-gray-600">
                  <HiOutlineUser className="text-[#709EB1] text-lg" />
                  <span>Organizer</span>
                </div>
                <div className="col-span-2 font-medium text-gray-800">
                  {meetingDetails?.organizer?.name || <Skeleton />}
                </div>
              </div>
              <div className="grid grid-cols-3 items-start">
                <div className="col-span-1 font-semibold flex items-center gap-2 text-gray-600">
                  <HiOutlineUsers className="text-[#709EB1] text-lg" />
                  <span>Participants</span>
                </div>
                <div className="col-span-2 flex flex-col font-medium text-gray-800">
                  {meetingDetails?.participants?.map((participant, index) => (
                    <span key={index}>{participant}</span>
                  )) || <Skeleton />}
                </div>
              </div>
              <div className="grid grid-cols-3 items-start">
                <div className="col-span-1 font-semibold flex items-center gap-2 text-gray-600">
                  <HiOutlineDocumentText className="text-[#709EB1] text-lg" />
                  <span>Description</span>
                </div>
                <div className="col-span-2 font-medium text-gray-800">
                  {/* {meetingDetails?.description || <Skeleton />} */}
                  <SanitizedHTML html={meetingDetails?.description || <Skeleton />} />
                </div>
              </div>
            </div>
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default ViewMeetingDetails;
