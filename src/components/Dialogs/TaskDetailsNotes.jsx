import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
const TaskDetailsNotes = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <a className="cursor-pointer" onClick={handleClickOpen}>
        <span className="h-full flex gap-2 items-end">
          <span className="font-bold">Notes</span>
          <p className="hover:underline">
            (Click here for submission instructions and task details)
          </p>
        </span>
      </a>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"md"}>
        <form>
          <DialogTitle className="flex items-center justify-between bg-[#CDEDF9]">
            Documents Uploaded by Anjali Mehta
            <CloseIcon
              className="cursor-pointer"
              onClick={handleClose}
            ></CloseIcon>
          </DialogTitle>
          <DialogContent dividers>
            <div className="flex flex-col gap-5 py-6 px-2">
              <h2>
                <span className="font-semibold">Offer Acceptance:</span> Offer
                accepted on 10th August.
              </h2>
              <h2>
                <span className="font-semibold">Document Submission:</span>
                ID proof and address proof pending. Due by 22nd August 2024.
              </h2>
              <h2>
                <span className="font-semibold">Background Check:</span>{" "}
                Expected completion by 22nd August.
              </h2>
              <h2>
                <span className="font-semibold">Training Schedule:</span>{" "}
                Training starts on 26th August.
              </h2>
              <h2>
                <span className="font-semibold">IT Setup:</span> IT assets
                assigned but not setup.
              </h2>
              <h2>
                <span className="font-semibold">Final Review: </span>Pending
                after other steps.
              </h2>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default TaskDetailsNotes;
