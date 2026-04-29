import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import DocumentUploadedToast from "./DocumentUploadedToast";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadDocumentDialog = () => {
  const [open, setOpen] = useState(false);
  const [uploaded, setuploaded] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [values, setValues] = useState({
    document: "",
    fileType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: [e.target.value] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    setuploaded(true);
  };
  return (
    <div>
      <button
        className="w-full py-1 px-1 text-[#358EAB] rounded-md border-2 border-[#358EAB]"
        onClick={handleClickOpen}
      >
        Upload Document
      </button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle className="bg-dialog-header flex items-center justify-between bg-[#CDEDF9]">
            Upload Documents for Anjali Mehta
            <CloseIcon
              className="cursor-pointer"
              onClick={handleClose}
            ></CloseIcon>
          </DialogTitle>
          <DialogContent>
            <div className="flex flex-col gap-8 py-4">
              <div>
                <span>
                  <h2 className="text-[18px] text-black">
                    Document Preview :{" "}
                  </h2>
                </span>
              </div>
              <div className="flex gap-6">
                <h2 className="text-[18px] text-black">
                  Upload New Document :{" "}
                </h2>
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  sx={{
                    backgroundColor: "transparent",
                    border: 1,
                    width: "170px",
                    height: "40px",
                  }}
                >
                  Browse file
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => handleChange(e)}
                    multiple
                    name="document"
                    required
                  />
                </Button>
              </div>
              <div className="flex gap-6">
                <h2 className="text-[18px] text-black">
                  Upload New Document :{" "}
                </h2>
                <select
                  name="fileType"
                  id="fileType"
                  className="border-2 border-black rounded-md py-2 px-3"
                  onChange={(e) => handleChange(e)}
                  required
                >
                  <option value="">Document Name</option>
                  <option value="CV">CV</option>
                  <option value="Relieving Letter">Relieving Letter</option>
                  <option value="Bank Details">Bank Details</option>
                </select>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="w-full flex py-8 justify-center items-center gap-6">
              <button
                className=" py-2 px-6 bg-[#a9C3CE] rounded-md text-[17px] text-white"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className=" py-2 px-6 bg-[#709EB1] rounded-md text-[17px] text-white"
                type="submit"
              >
                Upload Document
              </button>
              {uploaded && (
                <DocumentUploadedToast
                  uploaded={uploaded}
                ></DocumentUploadedToast>
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UploadDocumentDialog;
