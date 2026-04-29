import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { useTheme } from "../../hooks/theme/useTheme";
import Button from "../Button";

const EmailReminder = ({ sent }) => {
  const [open, setOpen] = React.useState(sent);
  const { theme } = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"xs"}>
        <DialogTitle className="flex items-center justify-between" style={{ backgroundColor: theme.secondaryColor }}>
          <h2 className="font-bold">Email Reminder</h2>
          <button onClick={handleClose} className="cursor-pointer">
            <CloseIcon></CloseIcon>
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="py-10 flex flex-col items-center">
            <h2 className="font-bold pb-2">
              Email Reminder Sent Successfully!
            </h2>
            <DoneIcon fontSize="large" color="primary"></DoneIcon>
            {/* <h2 className=" pt-4">
              The reminder email has been sent to Anjali Mehta.
            </h2> */}
          </div>
        </DialogContent>
        <DialogActions>
          <div className="w-full flex justify-center items-center py-4">
            <Button text="Cancel" onClick={handleClose} />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmailReminder;
