import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EmailReminder from "./EmailReminder";
import SendDocumentSubmissionReminder from "./SendDocumentSubmissionReminder";
import useDashboard from "../../hooks/unisol/hrDashboard/useDashborad";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const openLinksInNewTab = (html) => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("a").forEach((a) => {
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });
  return doc.body.innerHTML;
};

const ActionRequired = ({ notification }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [send, setSend] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const typeLabels = {
    reminder: "Reminder",
    payroll: "Payroll",
    leaveRequest: "Leave Request",
    onboarding: "Onboarding",
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
            Action Required: {notification.title}
            <CloseIcon
              className="cursor-pointer"
              onClick={handleClose}
            ></CloseIcon>
          </DialogTitle>
          <DialogContent>
            <div className="w-full py-8 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                >
                  {typeLabels[notification.type] || notification.type}
                </span>
                <span className="text-xs text-gray-500">
                  {notification.isRead ? "Read" : "Unread"}
                </span>
              </div>
              <h2 className="font-[500] text-[16px]">
                Alert:{" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: openLinksInNewTab(notification.message),
                  }}
                />
              </h2>
              <div className="text-xs text-gray-500 mt-2">
                Created: {formatDate(notification.createdAt)}
                {notification.updatedAt && (
                  <span className="ml-2">Updated: {formatDate(notification.updatedAt)}</span>
                )}
              </div>
              <h2 className="text-xs text-gray-600">
                Details: - Please review or update the status of the documents.
              </h2>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="w-full flex justify-center items-center gap-3 py-4 px-6">
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
