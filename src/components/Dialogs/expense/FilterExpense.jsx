import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { FaFilter } from "react-icons/fa";
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
} from "react-icons/hi";
import Button from "../../Button";
import { useTheme } from "../../../hooks/theme/useTheme";

const FilterExpense = ({ selectedFilter, onFilterChange }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(selectedFilter || "");

  const { theme } = useTheme();

  // keep local dialog state in sync with parent
  useEffect(() => {
    setStatus(selectedFilter || "");
  }, [selectedFilter]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setStatus(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    onFilterChange(status);
    setOpen(false);
  };

  const handleClearFilter = () => {
    setStatus("");
    onFilterChange("");
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={handleClickOpen}
        text={
          <div className="flex items-center gap-2">
            <FaFilter className="text-white" />
            Filter By Status
          </div>
        }
        variant={1}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle
          className="flex items-center justify-between"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="flex items-center gap-2 text-black">
            <FaFilter className="text-2xl" />
            <h2 className="font-bold">Filter Expenses</h2>
          </div>
          <CloseIcon className="cursor-pointer" onClick={handleClose} />
        </DialogTitle>

        <DialogContent className="bg-white">
          <form onSubmit={handleFilterSubmit}>
            <div className="py-6 flex flex-col gap-6 text-sm">
              <label className="text-base font-semibold text-[#3b4a5a] mb-2">
                Select Status:
              </label>
              <div className="grid grid-cols-1 gap-4">
                <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-700">
                  <input
                    type="radio"
                    value="approved"
                    checked={status === "approved"}
                    onChange={handleInputChange}
                    name="filter"
                  />
                  <HiOutlineCheckCircle className="text-green-500 text-lg" />
                  Approved
                </label>

                <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-700">
                  <input
                    type="radio"
                    value="pending"
                    checked={status === "pending"}
                    onChange={handleInputChange}
                    name="filter"
                  />
                  <HiOutlineClock className="text-yellow-500 text-lg" />
                  Pending
                </label>

                <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-700">
                  <input
                    type="radio"
                    value="rejected"
                    checked={status === "rejected"}
                    onChange={handleInputChange}
                    name="filter"
                  />
                  <HiOutlineXCircle className="text-red-500 text-lg" />
                  Rejected
                </label>
              </div>
            </div>

            <DialogActions className="bg-white">
              <div className="flex w-full justify-center gap-4 items-center">
                <Button type="submit" variant={1} text="Apply Filter" />
                <Button
                  onClick={handleClearFilter}
                  type="button"
                  variant={3}
                  text="Clear Filter"
                />
              </div>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilterExpense;
