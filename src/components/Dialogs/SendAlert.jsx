import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import SendDocumentSubmissionReminder from "./SendDocumentSubmissionReminder";
import { useTheme } from "../../hooks/theme/useTheme";

const SendAlert = ({ openDialog, closeDialog, employeeByQuery }) => {
  const { theme } = useTheme();

  return (
    <Dialog open={openDialog} onClose={closeDialog} fullWidth maxWidth="xs">
      <DialogTitle
        className="flex items-center justify-between pb-2"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <h2 className="font-bold">
          Alert For {employeeByQuery?.employee?.fullName}
        </h2>
        <CloseIcon
          className="cursor-pointer"
          onClick={closeDialog}
        />
      </DialogTitle>

      <DialogContent>
        <div className="py-4 px-2 gap-3 rounded-2xl bg-gray-50 border mt-4">
          <h2 className="font-bold mb-4 text-lg">
            {employeeByQuery?.employee?.documentsSubmitted === false
              ? "Documents Missing :"
              : "Document Submitted :"}
          </h2>

          {employeeByQuery?.employee?.documentsSubmitted === false ? (
            <ul className="flex flex-col gap-1 list-disc list-inside text-sm px-2">
              {!employeeByQuery?.employee?.CV && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">CV</li>
              )}
              {!employeeByQuery?.employee?.passportPhoto && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">
                  Passport Photograph
                </li>
              )}
              {!employeeByQuery?.employee?.aadharCard && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Aadhaar Card</li>
              )}
              {!employeeByQuery?.employee?.bankAccountImage && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Bank Details</li>
              )}
              {!employeeByQuery?.employee?.relievingLetter && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Relieving Letter</li>
              )}
              {!employeeByQuery?.employee?.addressProof && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Address Proof</li>
              )}
              {!employeeByQuery?.employee?.resignationAcceptanceLetter && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Resignation Acceptance Letter</li>
              )}
              {!employeeByQuery?.employee?.salarySlip && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Salary Slip</li>
              )}
              {!employeeByQuery?.employee?.gradeDocument && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Grade Document</li>
              )}
              {!employeeByQuery?.employee?.panCard && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Pan Card</li>
              )}
              {!employeeByQuery?.employee?.latestForm16 && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Latest Form 16</li>
              )}
              {!employeeByQuery?.employee?.bloodGroupDocument && (
                <li className="px-3 py-2 rounded-md bg-blue-100 border">Blood Group Document</li>
              )}
            </ul>
          ) : (
            <p className="text-blue-400 font-semibold">
              ✅ All Documents Uploaded
            </p>
          )}
        </div>
      </DialogContent>

      <DialogActions className="gap-2">
        <div className="w-full flex justify-end items-center">
          <button
            className="px-4 py-2 rounded-md border transition"
            style={{
              borderColor: theme.primaryColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.highlightColor;
              e.currentTarget.style.color = "black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = theme.primaryColor;
            }}
            onClick={closeDialog}
          >
            Cancel
          </button>
        </div>

        {/* Optional: Reminder button/modal */}
        <SendDocumentSubmissionReminder />
      </DialogActions>
    </Dialog>
  );
};

export default SendAlert;
