import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DoneIcon from "@mui/icons-material/Done";
const OnboardingWorkflowDetails = [
  {
    id: 1,
    stage: "Offer Acceptance",
    status: "Completed",
    dueDate: "14-02-2024",
    completed: true,
    details: "Offer letter accepted and signed.",
  },
  {
    id: 2,
    stage: "Document Submission",
    status: "Not Started",
    dueDate: "14-02-2024",
    completed: false,
    details: "Required documents submitted.",
  },
  {
    id: 3,
    stage: "Background Check",
    status: "Completed",
    dueDate: "14-02-2024",
    completed: false,
    details: "Pending initiation of background check.",
  },
  {
    id: 4,
    stage: "Training Schedule",
    status: "Completed",
    dueDate: "14-02-2024",
    completed: true,
    details: "Training sessions need to be scheduled.",
  },
  {
    id: 5,
    stage: "IT Setup",
    status: "Not Completed",
    dueDate: "14-02-2024",
    completed: false,
    details: "IT equipment and accounts setup pending.",
  },
  {
    id: 6,
    stage: "Final Review",
    status: "Not Completed",
    dueDate: "14-02-2024",
    completed: false,
    details: "Final review and completion of onboarding tasks.",
  },
];

const WorkflowDetails = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleClickOpen}
        className="bg-[#56AAC5] px-2 py-1 rounded-lg"
      >
        View Workflow Details
      </button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"md"}>
        <DialogTitle className="flex items-center justify-between bg-[#CDEDF9]">
          <span className=" flex gap-4">
            Onboarding Workflow Details for
            <span className="font-bold">Anjali Mehta </span>
          </span>

          <CloseIcon
            className="cursor-pointer"
            onClick={handleClose}
          ></CloseIcon>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer fullWidth className="px-6 rounded-lg">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ fontWeight: "bold", color: "gray" }}
                    align="left"
                  >
                    Stage
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", color: "gray" }}
                    align="center"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", color: "gray" }}
                    align="center"
                  >
                    Due Date
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", color: "gray" }}
                    align="center"
                  >
                    Completed
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", color: "gray" }}
                    align="center"
                  >
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {OnboardingWorkflowDetails.map((list) => (
                  <TableRow
                    key={list.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="left" component="th" scope="row">
                      {list.stage}
                    </TableCell>
                    <TableCell align="center">{list.status}</TableCell>
                    <TableCell align="center">{list.dueDate}</TableCell>
                    <TableCell align="center">
                      {list.completed && (
                        <DoneIcon color="primary" fontSize="large"></DoneIcon>
                      )}
                    </TableCell>
                    <TableCell className="w-[200px]" align="center">
                      {list.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowDetails;
