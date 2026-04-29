import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
//import { Link } from "react-router-dom";
const expenseSubmissionStatus = [
  {
    id: 1,
    date: "Aug 21,2024",
    expenseType: "Travel",
    amount: 6550,
    status: "Approved",
  },
  {
    id: 2,
    date: "Aug 20,2024",
    expenseType: "Meals",
    amount: 550,
    status: "Rejected",
  },
  {
    id: 3,
    date: "Aug 19,2024",
    expenseType: "Supplies",
    amount: 1500,
    status: "Rejected",
  },
  {
    id: 4,
    date: "Aug 19,2024",
    expenseType: "Supplies",
    amount: 5540,
    status: "Pending",
  },
  {
    id: 5,
    date: "Aug 21,2024",
    expenseType: "Travel",
    amount: 550,
    status: "Approved",
  },
  {
    id: 5,
    date: "Aug 20,2024",
    expenseType: "Travel",
    amount: 750,
    status: "Rejected",
  },
];

const ExpenseHistory = ({ showHistory }) => {
  const [open, setOpen] = useState(showHistory);

  /* const handleClickOpen = () => {
    setOpen(true);
  }; */

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <button
        className="w-full py-1 px-1 bg-blue-300 rounded-md border-2 border-blue-500"
        onClick={handleClickOpen}
      >
        Download Expense
      </button> */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"md"}>
        <DialogTitle className="flex items-center justify-between bg-[#CDEDF9]">
          Expense History{" "}
          <CloseIcon
            className="cursor-pointer"
            onClick={handleClose}
          ></CloseIcon>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead style={{ fontWeight: "bold" }}>
                <TableRow>
                  <TableCell style={{ border: "none" }} align="left">
                    Date
                  </TableCell>
                  <TableCell style={{ border: "none" }} align="left">
                    Expense Type
                  </TableCell>
                  <TableCell style={{ border: "none" }} align="left">
                    Amount
                  </TableCell>
                  <TableCell style={{ border: "none" }} align="center">
                    Status
                  </TableCell>
                  <TableCell style={{ border: "none" }} align="center">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenseSubmissionStatus.map((expense) => (
                  <TableRow
                    key={expense.id}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell
                      style={{
                        border: "none",
                        height: "80px",
                      }}
                      align="left"
                      component="th"
                      scope="row"
                    >
                      {expense.date}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "none",
                        height: "80px",
                      }}
                      align="left"
                    >
                      {expense.expenseType}
                    </TableCell>
                    <TableCell
                      style={{ border: "none", height: "80px" }}
                      align="left"
                    >
                      {expense.amount}
                    </TableCell>
                    <TableCell
                      style={{ border: "none", height: "80px" }}
                      align="center"
                    >
                      <span className="py-2 px-4 bg-[#D7D08F] rounded-md">
                        {expense.status}
                      </span>
                    </TableCell>
                    <TableCell
                      style={{ border: "none", height: "80px" }}
                      align="center"
                    >
                      <span className="font-medium">
                        [
                        <span className="text-green-500 cursor-pointer">
                          edit
                        </span>
                        ][
                        <span className="text-red-500 cursor-pointer">
                          Delet
                        </span>
                        ]
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <div className="w-full flex flex-col py-4 px-8">
            <div className="w-full flex flex-col items-start gap-2">
              <h2 className="font-bold">Total Expense : 1000</h2>
              <h2 className="text-[10px]">Advanced Received :</h2>
              <h2 className="text-[10px]">Pending :</h2>
            </div>
            <div className="w-full flex justify-center gap-4">
              <button className="bg-[#A9C8F1] py-2 px-4 rounded-md border-2 text-[#004096] border-[#004096]">
                Download Report
              </button>
              <button className="bg-[#D94E4E] bg-opacity-35 py-2 px-4 rounded-md border-2 text-[#7D0000] border-[#7E3D42]">
                Cancel
              </button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpenseHistory;
