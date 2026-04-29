import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

const DocumentUploadedToast = ({ uploaded }) => {
  //const [open, setOpen] = React.useState(false);
  const [open, setOpen] = useState(uploaded);
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
              Documents of Anjali Mehta have been Uploaded successfully.
            </h2>
            <DoneIcon fontSize="large" color="primary"></DoneIcon>
            <h2 className=" pt-4">
              The employee documents have been successfully uploaded{" "}
            </h2>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-center items-center py-4">
            <button
              className=" py-2 px-6 bg-[#a9C3CE] rounded-md text-[17px] text-white"
              onClick={handleClose}
            >
              Ok
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentUploadedToast;
