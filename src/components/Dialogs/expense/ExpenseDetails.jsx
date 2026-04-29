import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineDocumentText,
  HiOutlineStatusOnline,
  HiOutlineAnnotation,
  HiOutlineDownload,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding
} from "react-icons/hi";
import "react-loading-skeleton/dist/skeleton.css";
import useEmpExpense from "../../../hooks/unisol/empExpense/useEmpExpense";
import Button from "../../Button";
import { useTheme } from "../../../hooks/theme/useTheme";
import LoaderSpinner from "../../LoaderSpinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <FaCheckCircle className="inline mr-2 text-green-500" />;
    case "rejected":
      return <FaTimesCircle className="inline mr-2 text-red-500" />;
    default:
      return <FaRegClock className="inline mr-2 text-yellow-500" />;
  }
};

// Helper to format date as dd-mm-yyyy
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  return `${day}-${month}-${year}`;
};

const ExpenseDetails = ({ onClose, openDialog, expense = {} }) => {
  const [open, setOpen] = useState(openDialog);
  const { loading, fetchExpenseDetails, expenseDetails } = useEmpExpense();
  const { theme } = useTheme();
  const contentRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const id = expense._id;
  useEffect(() => {
    if (id) {
      fetchExpenseDetails(id);
    }
  }, [id]);
  const handleDownload = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current, {
        scale: 3,
        useCORS: true,
        letterRendering: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      pdf.setFontSize(16);
      pdf.text("Expense Details", pageWidth / 2, 15, { align: "center" });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 10, 25, pdfWidth, pdfHeight);
      pdf.save(
        `Expense_${expenseDetails?.data?.date ? formatDate(expenseDetails.data.date) : "UnknownDate"
        }_${expenseDetails?.data?.expenseCategory || "UnknownCategory"
        }.pdf`
      );
    }
  };


  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        className="flex items-center justify-between shadow-sm"
        style={{ backgroundColor: theme.secondaryColor, color: "black" }}
      >
        <div className="flex items-center gap-2">
          <HiOutlineClipboardList className="text-2xl text-black" />
          <h2 className="font-bold text-lg">Expense Details</h2>
        </div>
        <CloseIcon className="cursor-pointer" onClick={handleClose} />
      </DialogTitle>

      {loading ? (
        <div className="py-4 w-full flex items-center justify-center">
          <LoaderSpinner />
        </div>
      ) : (

        expenseDetails ? (
          <>
            <DialogContent className="bg-white" ref={contentRef}>
              <div
                className="py-6 flex flex-col divide-y divide-gray-200 text-sm"
              >
                {/* Date */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="text-gray-600 font-semibold"> {/* ← SEMIBOLD */}
                    Date Of Expense
                  </div>
                  <div className="text-gray-900">
                    {expenseDetails?.data?.date
                      ? formatDate(expenseDetails.data.date)
                      : "N/A"}
                  </div>
                </div>

                {/* City Type */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="text-gray-600 font-semibold"> {/* ← SEMIBOLD */}
                    City Type
                  </div>
                  <div className="text-gray-900">
                    {expenseDetails?.data?.extraFields?.city || "N/A"}
                  </div>
                </div>

                {/* Expense Type */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="text-gray-600 font-semibold"> {/* ← SEMIBOLD */}
                    Expense Type
                  </div>
                  <div className="text-gray-900">
                    {expenseDetails?.data?.expenseCategory || "N/A"}
                  </div>
                </div>

                {/* Place */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="text-gray-600 font-semibold"> {/* ← SEMIBOLD */}
                    Place
                  </div>
                  <div className="text-gray-900">
                    {expenseDetails?.data?.extraFields?.place || "N/A"}
                  </div>
                </div>

                {/* Meal Type & Attendees (only for Food) */}
                {expenseDetails?.data?.expenseCategory === "Food" && (
                  <>
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-gray-600 font-semibold">Meal Type</div>
                      <div className="text-gray-900">
                        {expenseDetails?.data?.extraFields?.mealType || "N/A"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-gray-600 font-semibold">Attendees</div>
                      <div className="text-gray-900">
                        {expenseDetails?.data?.extraFields?.attendees || "N/A"}
                      </div>
                    </div>
                  </>
                )}

                {/* Stationary */}
                {expenseDetails?.data?.expenseCategory === "Stationary" && (
                  <>
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-gray-600 font-semibold">Item Name</div>
                      <div className="text-gray-900">
                        {expenseDetails?.data?.extraFields?.itemName || "N/A"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-gray-600 font-semibold">Description</div>
                      <div className="text-gray-900">
                        {expenseDetails?.data?.description || "N/A"}
                      </div>
                    </div>
                  </>
                )}

                {/* Gift */}
                {expenseDetails?.data?.expenseCategory === "Gift" && (
                  <>
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-gray-600 font-semibold">Description</div>
                      <div className="text-gray-900">
                        {expenseDetails?.data?.description || "N/A"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-gray-600 font-semibold">Receiver Name</div>
                      <div className="text-gray-900">
                        {expenseDetails?.data?.extraFields?.receiverName || "N/A"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-gray-600 font-semibold">Receiver Number</div>
                      <div className="text-gray-900">
                        {expenseDetails?.data?.extraFields?.receiverNumber || "N/A"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-gray-600 font-semibold">Purpose</div>
                      <div className="text-gray-900">
                        {expenseDetails?.data?.purpose || "N/A"}
                      </div>
                    </div>
                  </>
                )}

                {/* Bill Number */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="text-gray-600 font-semibold">Bill Number</div>
                  <div className="text-gray-900">
                    {expenseDetails?.data?.billNumber || "N/A"}
                  </div>
                </div>

                {/* Amount */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="text-gray-600 font-semibold">Amount Spent</div>
                  <div className="flex flex-col gap-1 text-gray-900">
                    <span>Cash: ₹{expenseDetails?.data?.amount?.cash}</span>
                    <span>Online: ₹{expenseDetails?.data?.amount?.online}</span>
                    <span className="font-bold text-[#2563eb]">
                      Total: ₹{expenseDetails?.data?.amount?.total}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="text-gray-600 font-semibold">Status</div>
                  <div>
                    {expenseDetails?.data?.status
                      ? expenseDetails.data.status.charAt(0).toUpperCase() +
                      expenseDetails.data.status.slice(1)
                      : "N/A"}
                  </div>
                </div>

                {/* Remarks */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="text-gray-600 font-semibold">Approval Comments</div>
                  <div className="text-gray-900">
                    {expenseDetails?.data?.adminRemarks || "N/A"}
                  </div>
                </div>
              </div>
            </DialogContent>

            <DialogActions className="bg-white">
              <div className="flex justify-center w-full gap-4 py-3">
                <Button variant={1} text="Download" onClick={handleDownload} />
                <Button variant={3} onClick={handleClose} text="Cancel" />
              </div>
            </DialogActions>
          </>
        ) : (
          <div className="py-4 w-full flex items-center justify-center">
            <p className="text-gray-600">No expense details available.</p>
          </div>
        )
      )}
    </Dialog>
  );
};

export default ExpenseDetails;
