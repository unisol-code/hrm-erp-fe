import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

const LeaveSubmittedToast = ({ submitted }) => {
  //const [open, setOpen] = React.useState(false);
  const [open, setOpen] = useState(submitted);
  /* const handleClickOpen = () => {
       setOpen(true);
     }; */

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"xs"}>
        <DialogTitle className="flex items-center justify-between bg-[#CDEDF9]">
          <CloseIcon onClick={handleClose}></CloseIcon>
        </DialogTitle>
        <DialogContent>
          <div className="py-10 flex flex-col items-center">
            <h2 className="font-bold pb-2">
              Leave Application Submitted Successfully{" "}
            </h2>
            <DoneIcon fontSize="large" color="primary"></DoneIcon>
            <h2 className=" pt-4">
              You will receive an email notification once your request is
              reviewed. Check the status for the approval of your leave.{" "}
            </h2>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-center items-center py-4">
            <button
              className=" py-2 px-6 bg-[#a9C3CE] rounded-md text-[17px] text-white"
              onClick={handleClose}
            >
              Okay
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeaveSubmittedToast;
