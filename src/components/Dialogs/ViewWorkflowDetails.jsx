import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "../../hooks/theme/useTheme";

const ViewWorkflowDetails = ({ openDialog, closeDialog, employee }) => {
  console.log("ViewWorkflowDetails employee : ", employee);
  const [open, setOpen] = useState(openDialog);

  const handleClose = () => {
    setOpen(false);
    closeDialog();
  };
  const { theme } = useTheme();
  const onboardingWorkflowDetails = [
    {
      id: 1,
      stage: "Offer Acceptance",
      status: employee?.offerAcceptance ? "Completed" : "Not Completed",
      date: employee?.updatedAt
        ? new Date(employee?.updatedAt).toLocaleDateString("en-GB")
        : "N/A",
    },
    {
      id: 2,
      stage: "Document Submission",
      status: employee?.documentsSubmitted ? "Completed" : "Not Completed",
      date: employee?.updatedAt
        ? new Date(employee?.updatedAt).toLocaleDateString("en-GB")
        : "N/A",
    },
    {
      id: 3,
      stage: "Background Check",
      status: employee?.backgroundCheck ? "Completed" : "Not Completed",
      date: employee?.updatedAt
        ? new Date(employee?.updatedAt).toLocaleDateString("en-GB")
        : "N/A",
    },
    {
      id: 4,
      stage: "Training Schedule",
      status: employee?.trainingSchedule ? "Completed" : "Not Completed",
      date: employee?.updatedAt
        ? new Date(employee?.updatedAt).toLocaleDateString("en-GB")
        : "N/A",
    },
    {
      id: 5,
      stage: "IT Setup",
      status: employee?.itSetup ? "Completed" : "Not Completed",
      date: employee?.updatedAt
        ? new Date(employee?.updatedAt).toLocaleDateString("en-GB")
        : "N/A",
    },
    {
      id: 6,
      stage: "Final Review",
      status: employee?.finalReview ? "Completed" : "Not Completed",
      date: employee?.updatedAt
        ? new Date(employee?.updatedAt).toLocaleDateString("en-GB")
        : "N/A",
    },
  ];

  return (
    <div >
      <Dialog open={open} onClose={handleClose} fullWidth
        BackdropProps={{
          style: { backgroundColor: "black", opacity: 0.1 },
        }}
        PaperProps={{
          style: {
            boxShadow: "none",
          },
        }}
      >
        <DialogTitle className="flex items-center justify-between gap-4 " style={{ backgroundColor: theme.secondaryColor }}>
          <div className="flex gap-1">
            <span className=" flex gap-4">
              Onboarding Status Details for
            </span>
            <span>{employee?.fullName}</span>
          </div>
          <CloseIcon
            className="cursor-pointer"
            onClick={handleClose}
          ></CloseIcon>
        </DialogTitle>
        <DialogContent dividers>
          <div className="w-full bg-white rounded-lg py-2">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-base font-semibold text-gray-700 text-left">Stage</th>
                  <th className="p-3 text-base font-semibold text-gray-700 text-center">Status</th>
                  <th className="p-3 text-base font-semibold text-gray-700 text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {console.log(onboardingWorkflowDetails)}
                {
                  onboardingWorkflowDetails?.map((list) => (
                    <tr key={list.id} className="border-b border-gray-300">
                      <td className="p-4 text-[13px] font-normal text-[#252C58] text-left">
                        {list.stage}
                      </td>
                      <td className="p-4 text-[13px] font-normal text-[#252C58] text-center">
                        <span
                          className={`px-3 py-1 rounded-md font-medium text-[13px]
                ${list.status === "Completed"
                              ? "text-[#03A300] bg-[#B7FFBAC9]"
                              : "text-[#AA0000] bg-[#FFE5EE]"}`}
                        >
                          {list.status}
                        </span>
                      </td>
                      <td className="p-4 text-[13px] font-normal text-[#252C58] text-center">
                        {list.status === "Completed" ? list.date : "N/A"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewWorkflowDetails;
