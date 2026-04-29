import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import EmailReminder from "./EmailReminder";
import { useFormik } from "formik";
import * as Yup from "yup";
import useEmployeeDoc from "../../hooks/unisol/onboarding/useEmployeeDoc";
import { useTheme } from "../../hooks/theme/useTheme";

const SendDocumentSubmissionReminder = ({
  openDialog,
  closeDialog,
  employeeByQuery,
}) => {
  const { documentReminderEmail } = useEmployeeDoc();
  const [send, setSend] = useState(false);
  const { theme } = useTheme();

  const formik = useFormik({
    initialValues: {
      email: employeeByQuery?.employee?.officialEmail || "",
      subject: "",
      emailBody: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      subject: Yup.string().required("Subject is required"),
      emailBody: Yup.string().required("Body is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("values:", values);
      setSend(true);
      documentReminderEmail(values);
      resetForm();
    },
  });

  return (
    <Dialog open={openDialog} onClose={closeDialog} fullWidth maxWidth="md">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle
          className="flex items-center justify-between text-black"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <span className="text-lg font-semibold">
            Send Document Submission Reminder
          </span>
          <CloseIcon className="cursor-pointer" onClick={closeDialog} />
        </DialogTitle>

        <DialogContent>
          <div className="mt-6 px-4 space-y-6">
            {/* Email Field */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-gray-700">
                To (Email):
              </label>
              <input
                type="email"
                name="email"
                className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="example@domain.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Subject Field */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-gray-700">Subject:</label>
              <input
                type="text"
                name="subject"
                className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter subject"
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="text-sm text-red-600 mt-1">
                  {formik.errors.subject}
                </p>
              )}
            </div>

            {/* Body Field */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-gray-700">
                Message Body:
              </label>
              <textarea
                name="emailBody"
                rows="6"
                className="border border-gray-300 rounded-lg px-4 py-2 resize-none outline-none"
                placeholder="Write your message here..."
                value={formik.values.emailBody}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
              {formik.touched.emailBody && formik.errors.emailBody && (
                <p className="text-sm text-red-600 mt-1">
                  {formik.errors.emailBody}
                </p>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <div className="w-full flex justify-end gap-4 py-4 px-6">
            <button
              type="button"
              onClick={closeDialog}
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
            >
              Cancel
            </button>
            <button
              type="submit"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.highlightColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = theme.primaryColor)
              }
              className="text-base px-4 py-2 rounded-md text-white hover:text-black border"
              style={{
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor,
              }}
            >
              Send Email Reminder
            </button>
          </div>
        </DialogActions>

        {/* Confirmation component if email sent */}
        {send && <EmailReminder sent={send} />}
      </form>
    </Dialog>
  );
};

export default SendDocumentSubmissionReminder;
