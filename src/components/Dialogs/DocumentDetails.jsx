/* eslint-disable no-unused-vars */
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DescriptionIcon from "@mui/icons-material/Description";
import { FiDownload, FiUpload } from "react-icons/fi";
import { FaDownload } from "react-icons/fa6";
import UploadDocumentDialog from "../Dialogs/expense/UploadDocumentForExpense";
import { BsFileEarmarkPdf, BsFileEarmarkWord } from "react-icons/bs"; // Added Word icon
import UploadDocumentForExpense from "../Dialogs/expense/UploadDocumentForExpense";
import { toast } from "react-toastify";
import { useTheme } from "../../hooks/theme/useTheme";

const DocumentDetails = ({ openDialog, closeDialog, data, onReupload }) => {
  console.log("document data : ", data);
  const [open, setOpen] = useState(openDialog);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileURLs, setFileURLs] = useState([]);
  const [openReUpload, setOpenReUpload] = useState(false);
  const { theme } = useTheme();

  const handleClose = () => {
    setOpen(false);
    closeDialog();
  };

  const handleOpenReUpload = () => {
    setOpenReUpload(true);
  };

  const handleGetDoc = (files) => {
    console.log("Uploaded files:", files);
    setUploadedFiles(files);
    const fileURLs = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));

    setFileURLs(fileURLs);
    console.log(onReupload, files)
    if (onReupload && files && files.length > 0) {
      console.log(uploadedFiles)
      onReupload(data.docLabel, files);
    }
    setOpenReUpload(false);
  };
  
  const displayData = uploadedFiles.length > 0
    ? {
      ...data,
      name: uploadedFiles[0]?.name,
      file: fileURLs[0]?.url || null,
      fileType: uploadedFiles[0]?.type,
      updatedAt: new Date().toISOString(),
      uploadedBy: sessionStorage.getItem('name') || ""
    }
    : data;
    
  const handleDownloadFile = (fileDocument) => {
    if (!fileDocument.file) {
      toast.error("File is not uploaded. Please upload the file first.");
      return;
    }
    let fileToDownload;
    if (fileDocument.file instanceof File || fileDocument.file instanceof Blob) {
      fileToDownload = fileDocument.file;
    } else if (typeof fileDocument.file === "string") {
      if (fileDocument.file.startsWith("data:")) {
        // Base64 string
        const byteCharacters = atob(fileDocument.file.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        fileToDownload = new Blob([byteArray], { type: fileDocument.fileType });
      } else {
        // URL string
        fetch(fileDocument.file)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileDocument.name;
            link.click();
            URL.revokeObjectURL(url);
          })
          .catch(() => toast.error("Failed to download file"));
        return;
      }
    }

    // Download for File or Blob
    if (fileToDownload) {
      const url = URL.createObjectURL(fileToDownload);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileDocument.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return `${day}|${month}|${year}`;
    }
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}|${month}|${year}`;
  };

  // Function to detect if file is a Word document
  const isWordDocument = (fileType, fileName) => {
    return fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
           fileType === "application/msword" ||
           (fileName && /\.docx?$/i.test(fileName));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"sm"}>
      <DialogTitle
        className="flex items-center justify-between"
        style={{
          background: theme.secondaryColor
        }}
      >
        <h2 className="text-[24px] font-bold">Document Details</h2>
        <span className="flex justify-center items-center gap-4">
          <CloseIcon
            className="cursor-pointer"
            onClick={handleClose}
          ></CloseIcon>
        </span>
      </DialogTitle>
      <DialogContent
        dividers
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          borderRadius: "16px",
          background: "#f8fafc",
        }}
      >
        <div className="grid grid-cols-5 px-4 py-8 mb-6 gap-8">
          <div className="col-span-3 flex flex-col gap-6 justify-center">
            <h2 className="text-lg font-semibold">
              <span className="font-bold text-black">Uploaded By :</span>{" "}
              <span className="font-bold" style={{ color: theme.primaryColor }}>
                {displayData?.uploadedBy||"N/A"}
              </span>
            </h2>
            <h2 className="text-lg font-semibold text-gray-500">
              <span className="font-bold text-black">Document Name :</span>{" "}
              <span className="font-bold" style={{ color: theme.primaryColor }}>
                {displayData?.name ? displayData?.name : displayData?.programSelection}
              </span>
            </h2>
            <h2 className="text-lg font-semibold text-gray-500">
              <span className="font-bold text-black">Date Uploaded :</span>{" "}
              <span className="font-bold" style={{ color: theme.primaryColor }}>
                {displayData?.updatedAt ? formatDate(displayData?.updatedAt) : "N/A"}
              </span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-bold text-black">Download Link :</span>{" "}
              <button
                type="button"
                className="cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-blue-50 rounded px-2 py-1"
                onClick={() => handleDownloadFile(displayData)}
              >
                <span className="text-blue-600 flex gap-2 justify-center items-center font-bold cursor-pointer">
                  <a
                    href={displayData?.url}
                    className="hover:underline"
                    style={{ color: theme.primaryColor }}
                  >
                    {displayData?.name}
                  </a>{" "}
                  <FiDownload style={{ color: theme.primaryColor }} />
                </span>
              </button>
            </div>
            <button
              onClick={handleOpenReUpload}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.highlightColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = theme.primaryColor)
              }
              className="py-2 flex items-center justify-center gap-2 rounded-md text-white text-base font-medium transition-colors duration-300 shadow hover:shadow-lg hover:text-black mt-4"
              style={{
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <FiUpload size={18} />
              <span>Re-upload</span>
            </button>

            {openReUpload && (
              <UploadDocumentForExpense
                openDialog={openReUpload}
                closeDialog={() => setOpenReUpload(false)}
                getdoc={handleGetDoc}
              />
            )}
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center mb-8">
            <div className="flex flex-col items-center w-full">
              {displayData?.fileType === "pdf" ||
              displayData?.fileType === "application/pdf" ? (
                <>
                  <BsFileEarmarkPdf size={100} className="text-red-400 mb-2" />
                  <p className="text-sm text-gray-500">{displayData?.name}</p>
                </>
              ) : displayData?.fileType === "jpg" ||
                displayData?.fileType === "jpeg" ||
                displayData?.fileType === "png" ||
                displayData?.fileType === "image/jpeg" ||
                displayData?.fileType === "image/png" ? (
                <>
                  <img
                    src={displayData?.file}
                    alt={displayData?.name}
                    style={{
                      maxWidth: "220px",
                      maxHeight: "220px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                    className="mb-2 border border-gray-200"
                  />
                  <p className="text-sm font-semibold text-gray-700">
                    {displayData?.name}
                  </p>
                </>
              ) : isWordDocument(displayData?.fileType, displayData?.name) ? (
                <>
                  {/* Word Document Icon */}
                  <BsFileEarmarkWord size={100} className="text-blue-500 mb-2" />
                  <p className="text-sm text-gray-500">{displayData?.name}</p>
                </>
              ) : (
                <>
                  <DescriptionIcon sx={{ fontSize: 100, color: 'gray' }} />
                  <p className="text-sm text-gray-500">{displayData?.name}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDetails;