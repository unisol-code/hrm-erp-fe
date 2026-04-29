import { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as Yup from "yup";
import { useFormik } from "formik";
import useEducation from "../../hooks/unisol/education/useEducation";

const validationSchema = Yup.object().shape({
  image: Yup.string().required("image is required"),
  degree: Yup.string().required("degree is required"),
  grade: Yup.string().required("grade is required"),
  institute: Yup.string().required("institute is required"),
  year: Yup.string().required("year is required"),
});

const UploadEducationalDocument = ({ closeDialog, openDialog, eduDetail }) => {
  const [open, setOpen] = useState(openDialog);
  const handleClose = () => {
    setOpen(false);
    closeDialog();
  };

  const formik = useFormik({
    initialValues: {
      document: eduDetail.document,
      degree: eduDetail.degree,
      year: eduDetail.year,
      grade: eduDetail.grade,
      institute: eduDetail.institute,
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Submitting form...");
      console.log("values : ", values);
      try {
        const formData = new FormData();
        // Append each form field to FormData, including the image
        formData.append("document", values.document); // The file
        formData.append("degree", values.degree);
        formData.append("year", values.year);
        formData.append("institute", values.institute);
        formData.append("grade", values.grade);

        console.log("Submitted form data...", formData);
        updateEducationalDetails(eduDetail._id, formData);
        closeDialog();
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    },
  });

  const { updateEducationalDetails } = useEducation();

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold">Upload Document</h2>
        <span className="flex justify-center items-center gap-4">
          <CloseIcon
            className="cursor-pointer"
            onClick={handleClose}
          ></CloseIcon>
        </span>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <div className="w-full flex flex-col">
            <p className="text-xs">
              Our Organization Team will review your uploaded documents within
              1-2 business days. If you have any questions or need to submit
              documents directly, please contact us at
              <span className="text-blue-600">
                organization@organizationname.com{" "}
              </span>
              .
            </p>
            <div className="flex py-4">
              {" "}
              <h2>Select File</h2>{" "}
              <input
                type="file"
                name="document"
                value={formik.values.document}
                onChange={formik.handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="flex justify-between items-center col-span-1 gap-2">
                <h2>degree</h2>
                <input
                  type="text"
                  className="rounded-xl h-[40px] border border-gray-400 px-4 w-[180px]"
                  name="degree"
                  value={formik.values.degree}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="flex justify-between items-center col-span-1 gap-2">
                <h2>Year</h2>
                <input
                  type="text"
                  className="rounded-xl h-[40px] border border-gray-400 px-4 w-[180px]"
                  name="year"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="flex justify-between items-center col-span-1 gap-2">
                <h2>Institute</h2>
                <input
                  type="text"
                  className="rounded-xl h-[40px] border border-gray-400 px-4 w-[180px] "
                  name="institute"
                  value={formik.values.institute}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="flex justify-between items-center col-span-1 gap-2">
                <h2>Grade</h2>
                <input
                  type="text"
                  className="rounded-xl h-[40px] border border-gray-400 px-4 w-[180px]"
                  name="grade"
                  value={formik.values.grade}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <p className="text-xs">
              By Browsing the file and uploading, this will submit the files
              automatically (No need to re-submit) CDD Checklist/ Salesperson's
              Checklist on CDD
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="w-full flex justify-between px-2">
            <button
              type="button"
              className="bg-[#E47979] py-2 px-6 rounded-md  text-white hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#1C7295]  py-2 px-4 rounded-md  text-white"
            >
              <FileUploadIcon></FileUploadIcon> Upload & Save
            </button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UploadEducationalDocument;
