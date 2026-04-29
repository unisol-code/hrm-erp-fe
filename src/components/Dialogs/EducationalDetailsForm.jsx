import { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import EducationalDetails from "../../modules/unisol/employee/EducationalDetails";
import useEducation from "../../hooks/unisol/education/useEducation";

const EducationalDetailsForm = ({
  closeDialog,
  openDialog,
  educationalDetails,
}) => {
  const [open, setOpen] = useState(openDialog);
  const { resetEducationDetails } = useEducation();
  const handleClose = () => {
    setOpen(false);
    closeDialog();
    //resetEducationDetails();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"lg"}>
      <DialogTitle className="flex items-center justify-end ">
        <button type="button">
          <CloseIcon
            className="cursor-pointer"
            onClick={handleClose}
          ></CloseIcon>
        </button>
      </DialogTitle>
      <DialogContent>
        <EducationalDetails
          closeDialog={closeDialog}
          educationalDetails={educationalDetails}
        ></EducationalDetails>
      </DialogContent>
    </Dialog>
  );
};

export default EducationalDetailsForm;
