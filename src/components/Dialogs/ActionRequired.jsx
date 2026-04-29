import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EmailReminder from "./EmailReminder";
import SendDocumentSubmissionReminder from "./SendDocumentSubmissionReminder";
import useDashboard from "../../hooks/unisol/hrDashboard/useDashborad";

const ActionRequired = ({ notification }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [send, setSend] = useState(false);

  const [values, setValues] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    setSend(true);
    /* Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Email Reminder Sent Successfully!",
        text: "The reminder email has been sent to Anjali Mehta.",
        showConfirmButton: false,
        timer: 1500,
      }); */
  };

  const { markNotificationRead } = useDashboard();
  const handleNotificationMarked = () => {
    console.log(notification._id);
    markNotificationRead(notification._id);
    handleClose();
  };
  return (
    <div>
      <button
        onClick={handleClickOpen}
        type="button"
        className="bg-[#709EB1] text-white rounded-md px-4 py-1 hover:bg-[#318bb1] shadow-md hover:scale-[1.1] transition duration-300"
      >
        View
      </button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"sm"}>
        <form onSubmit={handleSubmit}>
          <DialogTitle className="flex items-center justify-between font-bold bg-[#CDEDF9] h-[80px] bg-dialog-header">
            Action Required: Onboarding Documents Overdue{" "}
            <CloseIcon
              className="cursor-pointer"
              onClick={handleClose}
            ></CloseIcon>
          </DialogTitle>
          <DialogContent>
            <div className="w-full py-8 flex flex-col justify-center gap-4">
              <h2 className="font-[500] text-[16px]">
                Alert: {notification.message}
              </h2>
              <h2>
                Details: - Please review or update the status of the documents.
              </h2>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="w-full flex justify-center items-center gap-3 py-4 px-6">
              {/* <button
                className=" py-2 px-4 bg-[#709EB1] rounded-lg text-[16px] text-white hover:bg-[#318bb1] shadow-md"
                type="button"
              >
                View Documents
              </button> */}
              {/* <button
                className=" py-2 px-4 bg-[#709EB1] rounded-lg text-[16px] text-white"
                type="button"
              >
                Send Email Reminder
              </button> */}
              <SendDocumentSubmissionReminder></SendDocumentSubmissionReminder>
              {!notification.isRead && (
                <button
                  className=" py-2 px-4 bg-[#709EB1] rounded-lg text-[16px] text-white hover:bg-[#318bb1] shadow-md hover:scale-[1.1] transition duration-300"
                  type="button"
                  onClick={handleNotificationMarked}
                >
                  Mark as resolved
                </button>
              )}
              {send && <EmailReminder sent={send}></EmailReminder>}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ActionRequired;
