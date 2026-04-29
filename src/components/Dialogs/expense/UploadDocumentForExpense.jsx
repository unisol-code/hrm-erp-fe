/* eslint-disable no-unused-vars */
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useTheme } from "../../../hooks/theme/useTheme";

const validationSchema = Yup.object({
  document: Yup.mixed().required("A file is required").nullable(),
});

const UploadDocument = ({
  openDialog,
  closeDialog,
  getdoc,
  documentType,
  isMultiple = false,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [filePreview, setFilePreview] = useState([]);
  const [open, setOpen] = useState(openDialog);
  console.log(getdoc)
  const formik = useFormik({
    initialValues: {
      document: isMultiple ? [] : null,
    },
    validationSchema: Yup.object({
      document: Yup.mixed().required("A file is required"),
    }),

    onSubmit: (values) => {
      if (typeof getdoc !== 'function') {
        console.error("UploadDocument: getdoc is not a function!", getdoc);
        // Maybe return early or show an error?
        return;
      }
      console.log(getdoc)
      if (errorMessage) {
        return;
      }

      if (!values.document || (isMultiple && values.document.length === 0)) {
        setErrorMessage("Please select a file to upload");
        return;
      }

      // For photo documents, validate image types
      if (documentType === "photo") {
        const filesToCheck = isMultiple ? values.document : [values.document];
        const invalidPhotos = filesToCheck.filter((file) => {
          const ext = file.name.split(".").pop().toLowerCase();
          return !["png", "jpg", "jpeg"].includes(ext);
        });

        if (invalidPhotos.length > 0) {
          setErrorMessage("Photos must be PNG, JPG, or JPEG");
          return;
        }
      }
      const filesToPass = isMultiple ? values.document : [values.document];
      // const fileToPass=isMultiple ? values.document : values.document[0]
      console.log(filesToPass)
      getdoc(filesToPass);
      closeDialog();
       toast.success("Document uploaded successfully! Click on save & submit to save");
    },
  });

  console.log("formik.values:", formik.values);
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    if (!isMultiple && newFiles.length > 1) {
      toast.error("Only single file upload allowed");
      return;
    }
    handleFileSelection(newFiles);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    closeDialog();
    formik.resetForm();
    setFilePreview([]);
    setErrorMessage("");
  };

  const handleSelectChange = (event) => {
    const newFiles = Array.from(event.currentTarget.files);
    if (!isMultiple && newFiles.length > 1) {
      toast.error("Only single file upload allowed");
      return;
    }
    handleFileSelection(newFiles);
  };
  const checkImageBackground = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const points = [
          [0, 0],
          [img.width - 1, 0],
          [0, img.height - 1],
          [img.width - 1, img.height - 1],
          [img.width / 2, img.height / 2],
        ];

        const allWhite = points.every(([x, y]) => {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          return isWhiteBackground(pixel[0], pixel[1], pixel[2]);
        });

        if (!allWhite) {
          setErrorMessage("Error: Image must have white background");
        } else {
          setErrorMessage("");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelection = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    const validFiles = newFiles.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      return ["png", "jpg", "jpeg", "pdf"].includes(ext);
    });

    if (validFiles.length === 0) {
      toast.error(
        "No valid files selected. Supported formats: PNG, JPG, JPEG, PDF"
      );
      return;
    }

    // Create previews for new files
    const newPreviews = validFiles.map((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      if (["png", "jpg", "jpeg"].includes(ext)) {
        return {
          file,
          type: "image",
          url: URL.createObjectURL(file),
          name: file.name,
        };
      } else {
        return {
          file,
          type: "pdf",
          name: file.name,
        };
      }
    });

    // Combine with existing previews if multiple uploads are allowed
    const updatedPreviews = isMultiple
      ? [...filePreview, ...newPreviews]
      : newPreviews;

    setFilePreview(updatedPreviews);

    // Check images for background if needed
    if (documentType === "photo") {
      newPreviews.forEach((preview) => {
        if (preview.type === "image") {
          checkImageBackground(preview.file);
        }
      });
    }

    // Update formik values
    const filesToSet = updatedPreviews.map((preview) => preview.file);
    formik.setFieldValue("document", isMultiple ? filesToSet : filesToSet[0]);
  };

  const removeFile = (index) => {
    const newPreviews = [...filePreview];
    newPreviews.splice(index, 1);
    setFilePreview(newPreviews);

    const filesToSet = newPreviews.map((preview) => preview.file);
    formik.setFieldValue(
      "document",
      isMultiple ? filesToSet : filesToSet[0] || null
    );
  };

  const isWhiteBackground = (r, g, b) => {
    const threshold = 230;
    return r >= threshold && g >= threshold && b >= threshold;
  };

  const { theme } = useTheme();
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"sm"}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle
          className="flex items-center justify-between"
          style={{
            background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
          }}
        >
          <h2 className="text-[24px] font-bold">Upload Document</h2>
          <span className="flex justify-center items-center gap-4">
            <CloseIcon className="cursor-pointer" onClick={handleClose} />
          </span>
        </DialogTitle>
        <DialogContent dividers>
          <div className="w-full flex flex-col">
            <p className="text-xs">
              Our Organization Team will review your uploaded documents within
              1-2 business days. If you have any questions or need to submit
              documents directly, please contact us at
              <span className="pl-1" style={{ color: theme.primaryColor }}>
                organization@organizationname.com
              </span>
              .
            </p>
            <div
              className="flex flex-col my-4 border-dashed border-2 rounded-xl h-[184px] justify-center items-center gap-3"
              style={{ borderColor: theme.primaryColor }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {filePreview.length > 0 ? (
                <div className="w-full">
                  <h3 className="text-xs ml-2 font-semibold">
                    File Previews:
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {filePreview.map((preview, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-1 p-2 border rounded-lg relative"
                        style={{ minWidth: "80px" }}
                      >
                        {preview.type === "image" ? (
                          <img
                            src={preview.url}
                            alt="Preview"
                            className="h-[50px] w-[50px] object-contain"
                          />
                        ) : (
                          <div className="h-[50px] w-[50px] flex items-center justify-center">
                            <PictureAsPdfIcon color="error" fontSize="medium" />
                          </div>
                        )}
                        <span className="text-xs text-center truncate w-full">
                          {preview.name}
                        </span>
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 w-6 h-6 flex items-center justify-center"
                          onClick={() => removeFile(index)}
                        >
                          <CloseIcon style={{ fontSize: 14 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3">
                  <CollectionsIcon fontSize="large" color="primary" />
                  <h2>Drag and Drop Files here or</h2>
                </div>
              )}

              <div>
                {errorMessage && (
                  <div className="text-red-500 text-base rounded-md">
                    {errorMessage}
                  </div>
                )}
              </div>

              {/* {filePreview.length === 0 && <h2>Drag and Drop Files here or</h2>} */}

              <input
                id="document"
                name="document"
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="border border-gray-400 h-[40px] px-2 rounded-md hidden"
                onChange={handleSelectChange}
                multiple={isMultiple}
              />
              <label
                htmlFor="document"
                className="cursor-pointer h-[40px] rounded-md border text-blue-600 hover:text-blue-800 hover:border-blue-800 px-2 gap-2 flex justify-center items-center w-[120px] mb-1"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                }}
              >
                Browse File
              </label>
            </div>
            <p className="italic text-xs text-gray-400">
              By Browsing the file and uploading, this will submit the files
              automatically
              {documentType === "photo" && " Image must have white background."}
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="w-full flex justify-between px-2">
            <button
              type="button"
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
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor,
              }}
              disabled={!!errorMessage || filePreview.length === 0}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.highlightColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = theme.primaryColor)
              }
              className={`text-base px-4 py-2 rounded-md text-white hover:text-black border${errorMessage || filePreview.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }`}
            >
              <FileUploadIcon />
              Upload
            </button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UploadDocument;
