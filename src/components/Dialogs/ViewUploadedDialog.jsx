/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import jsPDF from "jspdf";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { uploadedDocuments } from "../../data/data";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import UploadDocumentDialog from "../Dialogs/expense/UploadDocumentForExpense";
import DocumentDetails from "../Dialogs/DocumentDetails";
import useEmployeeDoc from "../../hooks/unisol/onboarding/useEmployeeDoc";
import { toast } from "react-toastify";
import { useTheme } from "../../hooks/theme/useTheme";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { IconButton } from "@mui/material";
import { FaEye } from "react-icons/fa";



const ViewUploadedDialog = ({ closeDialog, openDialog, docsByEmpID }) => {
  const { resetEmpDoc, uploadEmployeeDoc, loading, fetchDocsByEmpID } = useEmployeeDoc();
  console.log("ViewUploadedDialog data", docsByEmpID);
  const empId = docsByEmpID.id
  const [open, setOpen] = useState(openDialog);
  const [openDocumentUploadDialog, setOpenDocumentUploadDialog] =
    useState(false);
  const [viewDocumentDialog, setViewDocumentDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectIdForView, setSelectForView]= useState(null);
  const [tasks, setTasks] = useState([]);
  const [addedDocuments, setAddedDocuments] = useState({});
  const [deletedDocuments, setDeletedDocuments] = useState({});
  const [docFiles, setDocFiles] = useState({});
  const [filePreview, setFilePreview] = useState({});
  const [openDocumentDetailsDialog, setOpenDocumentDetailsDialog] =
    useState(false);

  const handleClose = () => {
    resetEmpDoc();
    setOpen(false);
    closeDialog();
  };

  useEffect(() => {
    const uploadedDocuments = [
      {
        id: 1,
        name: "CV",
        docLabel: "CV",
        fileType: docsByEmpID?.CV?.fileType,
        isChecked: docsByEmpID?.CV?.exists || false,
        file: docsByEmpID?.CV?.url,
        updatedAt: docsByEmpID?.CV?.uploadedAt
          ? new Date(docsByEmpID.CV?.uploadedAt).toLocaleDateString("en-GB")
          : "N/A",
        uploadedBy: sessionStorage.getItem("name"),
      },
      {
        id: 2,
        name: "Relieving Letter",
        docLabel: "lastCompanyRelievingLetter",
        updatedAt: docsByEmpID?.lastCompanyRelievingLetter?.uploadedAt
          ? new Date(
            docsByEmpID.lastCompanyRelievingLetter.uploadedAt
          ).toLocaleDateString("en-GB")
          : "N/A",
        fileType: docsByEmpID?.lastCompanyRelievingLetter?.fileType,
        isChecked: docsByEmpID?.lastCompanyRelievingLetter?.exists || false,
        file: docsByEmpID?.lastCompanyRelievingLetter?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: false,
      },
      {
        id: 3,
        name: "Bank Details",
        docLabel: "bankAccountImage",
        updatedAt: docsByEmpID?.bankAccountImage?.uploadedAt
          ? new Date(
            docsByEmpID.bankAccountImage.uploadedAt
          ).toLocaleDateString("en-GB")
          : "N/A",
        fileType: docsByEmpID?.bankAccountImage?.fileType,
        isChecked: docsByEmpID?.bankAccountImage?.exists || false,
        file: docsByEmpID?.bankAccountImage?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 4,
        name: "Passport Photograph",
        docLabel: "passportPhoto",
        updatedAt: docsByEmpID?.passportPhoto?.uploadedAt
          ? new Date(docsByEmpID.passportPhoto.uploadedAt).toLocaleDateString(
            "en-GB"
          )
          : "N/A",
        fileType: docsByEmpID?.passportPhoto?.fileType,
        isChecked: docsByEmpID?.passportPhoto?.exists || false,
        file: docsByEmpID?.passportPhoto?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 5,
        name: "Aadhaar Card",
        docLabel: "aadharCard",
        updatedAt: docsByEmpID?.aadharCard?.uploadedAt
          ? new Date(docsByEmpID.aadharCard.uploadedAt).toLocaleDateString(
            "en-GB"
          )
          : "N/A",
        fileType: docsByEmpID?.aadharCard?.fileType,
        isChecked: docsByEmpID?.aadharCard?.exists || false,
        file: docsByEmpID?.aadharCard?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 6,
        name: "Address Proof",
        docLabel: "addressProof",
        updatedAt: docsByEmpID?.addressProof?.uploadedAt
          ? new Date(docsByEmpID.addressProof.uploadedAt).toLocaleDateString(
            "en-GB"
          )
          : "N/A",
        fileType: docsByEmpID?.addressProof?.uploadedAt,
        isChecked: docsByEmpID?.addressProof?.exists || false,
        file: docsByEmpID?.addressProof?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 7,
        name: "Resignation Acceptance Letter",
        docLabel: "resignationAcceptanceLetter",
        updatedAt: docsByEmpID?.resignationAcceptanceLetter?.uploadedAt
          ? new Date(
            docsByEmpID.resignationAcceptanceLetter.uploadedAt
          ).toLocaleDateString("en-GB")
          : "N/A",
        fileType: docsByEmpID?.resignationAcceptanceLetter?.fileType,
        isChecked: docsByEmpID?.resignationAcceptanceLetter?.exists || false,
        file: docsByEmpID?.resignationAcceptanceLetter?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 8,
        name: "Salary Slip",
        docLabel: "salarySlip",
        updatedAt: docsByEmpID?.salarySlip?.uploadedAt
          ? new Date(docsByEmpID.salarySlip.uploadedAt).toLocaleDateString(
            "en-GB"
          )
          : "N/A",
        fileType: docsByEmpID?.salarySlip?.fileType,
        isChecked: docsByEmpID?.salarySlip?.exists || false,
        file: docsByEmpID?.salarySlip?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 9,
        name: "Grade Document",
        docLabel: "gradeDocument",
        updatedAt: docsByEmpID?.gradeDocument?.uploadedAt
          ? new Date(docsByEmpID.gradeDocument.uploadedAt).toLocaleDateString(
            "en-GB"
          )
          : "N/A",
        fileType: docsByEmpID?.gradeDocument?.fileType,
        isChecked: docsByEmpID?.gradeDocument?.exists || false,
        file: docsByEmpID?.gradeDocument?.url,

        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 10,
        name: "Pan Card",
        docLabel: "panCardImage",
        updatedAt: docsByEmpID?.panCardImage?.uploadedAt
          ? new Date(docsByEmpID.panCardImage.uploadedAt).toLocaleDateString(
            "en-GB"
          )
          : "N/A",
        fileType: docsByEmpID?.panCardImage?.fileType,
        isChecked: docsByEmpID?.panCardImage?.exists || false,
        file: docsByEmpID?.panCardImage?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 11,
        name: "Latest Form 16",
        docLabel: "latestForm16",
        updatedAt: docsByEmpID?.latestForm16?.uploadedAt
          ? new Date(docsByEmpID?.latestForm16?.uploadedAt).toLocaleDateString(
            "en-GB"
          )
          : "N/A",
        fileType: docsByEmpID?.latestForm16?.fileType,
        isChecked: docsByEmpID?.latestForm16?.exists || false,
        file: docsByEmpID?.latestForm16?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 12,
        name: "Basic Health Report",
        docLabel: "bloodGroupDocument",
        updatedAt: docsByEmpID?.bloodGroupDocument?.uploadedAt
          ? new Date(
            docsByEmpID?.bloodGroupDocument?.uploadedAt
          ).toLocaleDateString("en-GB")
          : "N/A",
        fileType: docsByEmpID?.bloodGroupDocument?.fileType,
        isChecked: docsByEmpID?.bloodGroupDocument?.exists || false,
        file: docsByEmpID?.bloodGroupDocument?.url,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
      },
      {
        id: 13,
        name: "Other Documents",
        docLabel: "others",
        updatedAt:
          docsByEmpID?.others?.length > 0 && docsByEmpID.others[0].uploadedAt
            ? new Date(docsByEmpID.others[0].uploadedAt).toLocaleDateString("en-GB")
            : "N/A",
        fileType:
          docsByEmpID?.others?.length > 0
            ? docsByEmpID.others[0].fileType
            : null,
        isChecked: docsByEmpID?.others?.some((doc) => doc.exists) || false,
        uploadedBy: sessionStorage.getItem("name"),
        uploaded: true,
        isMultiple: true,
        files:
          docsByEmpID?.others?.map((doc) => ({
            url: doc.url,
            fileType: doc.fileType,
            uploadedAt: doc.uploadedAt,
            exists: doc.exists,
          })) || [],
      },
    ];
    setTasks(uploadedDocuments);
  }, [docsByEmpID]);
  useEffect(() => {
    console.log(addedDocuments)
  }, [addedDocuments])

  const handleDocumentUpload = (id) => {
    setSelectedId(id);
    setOpenDocumentUploadDialog(true);
  };


  const handleGetDoc = (label, files) => {
    console.log("handleGetDoc called with:", { label, files });

    if (!files || (Array.isArray(files) && files.length === 0)) {
      console.warn(`No files provided for ${label}`);
      return;
    }

    const document = tasks.find((task) => task.docLabel === label);
    console.log("Found document:", document);
    if (!document) return;

    const newFiles = Array.isArray(files) ? files : [files].filter(Boolean);
    console.log("Raw newFiles:", newFiles);

    // Filter only File objects
    const fileObjects = newFiles.filter(file => file instanceof File);
    console.log("File objects:", fileObjects);

    if (fileObjects.length === 0) {
      console.warn("No valid File objects found");
      return;
    }

    // Create file objects with preview URLs for the tasks array (UI display)
    const processedNewFiles = fileObjects.map((file) => {
      const newFileObj = {
        file, // Keep reference to the original File object
        url: URL.createObjectURL(file),
        fileType: file.type || "application/octet-stream",
        name: file.name || `document_${Date.now()}`,
        uploadedAt: new Date().toISOString(),
        isNew: true, // Mark as new file
      };
      console.log("Processed new file:", newFileObj);
      return newFileObj;
    });

    // Update tasks - preserve existing, append new (for UI)
    setTasks((prevTasks) => {
      console.log("Previous tasks:", prevTasks);

      const updatedTasks = prevTasks.map((task) => {
        if (task.docLabel !== label) return task;

        if (task.isMultiple) {
          // Keep existing files
          const existingFiles = task.files || [];
          console.log("Existing files:", existingFiles);

          // Append new files
          const updatedFiles = [...existingFiles, ...processedNewFiles];
          console.log("Updated files array:", updatedFiles);

          return {
            ...task,
            isChecked: updatedFiles.length > 0,
            files: updatedFiles,
          };
        } else {
          // Single file - replace
          const firstNewFile = processedNewFiles[0];
          console.log("Single file - URL:", firstNewFile.url);

          return {
            ...task,
            isChecked: true,
            file: firstNewFile.url,
            fileType: firstNewFile.fileType,
            updatedAt: new Date().toLocaleDateString("en-GB"),
            isNew: true, // Mark as new file
          };
        }
      });

      console.log("Updated tasks:", updatedTasks);
      return updatedTasks;
    });

    setAddedDocuments((prev) => {
      console.log("Previous addedDocuments:", prev);

      let updatedAddedDocuments;
      if (document.isMultiple) {
        // For "others" category, only track the NEW File objects we're adding
        const existingAddedFiles = prev[label] || [];

        // Filter out duplicates by checking name and size
        const uniqueNewFiles = fileObjects.filter(newFile =>
          !existingAddedFiles.some(existingFile =>
            existingFile.name === newFile.name && existingFile.size === newFile.size
          )
        );

        updatedAddedDocuments = {
          ...prev,
          [label]: [...existingAddedFiles, ...uniqueNewFiles],
        };
      } else {
        // For single files, replace with the new File object
        updatedAddedDocuments = {
          ...prev,
          [label]: fileObjects,
        };
      }

      console.log("Updated addedDocuments (File objects):", updatedAddedDocuments);
      return updatedAddedDocuments;
    });
  };
  const handleSubmitAllDocument = async () => {
    console.log("clicking....");
    const formData = new FormData();
    console.log("addedDocuments:", addedDocuments);

    // Get the current "others" task to find existing files
    const othersTask = tasks.find(task => task.docLabel === "others");
    const allFilesToUpload = [];

    // 1. Download existing server files and convert them to File objects
    if (othersTask && othersTask.files) {
      for (const fileInfo of othersTask.files) {
        // Skip files that are marked as new (they're already in addedDocuments)
        if (fileInfo.isNew) continue;

        // Skip files that are marked for deletion
        if (deletedDocuments.others?.includes(fileInfo.url)) continue;

        if (fileInfo.url.startsWith('blob:')) {
          console.warn(`Skipping blob URL: ${fileInfo.url}`);
          continue;
        }

        try {
          console.log(`Downloading existing file: ${fileInfo.url}`);
          const response = await fetch(fileInfo.url);
          if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);

          const blob = await response.blob();
          // Create a File object from the blob
          const file = new File([blob], fileInfo.url.split('/').pop() || `document_${Date.now()}`, {
            type: blob.type || 'application/octet-stream'
          });

          allFilesToUpload.push(file);
          console.log(`Converted to File: ${file.name}`);
        } catch (error) {
          console.error(`Error downloading file ${fileInfo.url}:`, error);
        }
      }
    }

    // 2. Add new files from addedDocuments
    if (addedDocuments.others) {
      addedDocuments.others.forEach(file => {
        if (file instanceof File) {
          allFilesToUpload.push(file);
          console.log(`Adding new file: ${file.name}`);
        }
      });
    }

    // 3. Add ALL files to the "others" field
    allFilesToUpload.forEach((file, index) => {
      formData.append("others", file);
      console.log(`Added others[${index}] to FormData: ${file.name}`);
    });

    Object.entries(addedDocuments).forEach(([docLabel, files]) => {
      if (docLabel === "others") return;

      if (files && files.length > 0) {
        files.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(docLabel, file);
            console.log(`Added ${docLabel}[${index}] to FormData: ${file.name}`);
          }
        });
      }
    });

    // Debug: Check what's in the FormData
    console.log("=== FORM DATA CONTENTS ===");
    let formDataEntries = [];
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
      formDataEntries.push({ key, value });
    }
    console.log("FormData entries array:", formDataEntries);
    console.log("=== END FORM DATA ===");

    try {
      await uploadEmployeeDoc(empId, formData);
      setAddedDocuments({});
      setDeletedDocuments({});
      setFilePreview({});
      await fetchDocsByEmpID(empId);
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Failed to upload documents. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      // Clean up object URLs
      tasks.forEach((task) => {
        if (task.isMultiple && task.files) {
          task.files.forEach((file) => {
            if (file.isNew && file.url) {
              URL.revokeObjectURL(file.url);
            }
          });
        }
      });
    };
  }, [tasks]);
  const handleDeleteFile = (documentId, fileIndex) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === documentId) {
          if (task.isMultiple && task.files && task.files.length > fileIndex) {
            const fileToDelete = task.files[fileIndex];
            const updatedFiles = task.files.filter((_, idx) => idx !== fileIndex);

            // Check if this is a new file (has isNew flag) or an existing server file
            const isNewFile = fileToDelete.isNew;

            if (isNewFile) {
              // Remove from addedDocuments
              setAddedDocuments((prev) => {
                const updatedAdded = { ...prev };
                if (updatedAdded[task.docLabel]) {
                  // Find the index of this file in addedDocuments
                  const fileIndexInAdded = updatedAdded[task.docLabel].findIndex(
                    file =>
                      file.name === fileToDelete.name &&
                      file.size === (fileToDelete.file?.size || fileToDelete.size)
                  );

                  if (fileIndexInAdded !== -1) {
                    updatedAdded[task.docLabel] = updatedAdded[task.docLabel].filter(
                      (_, idx) => idx !== fileIndexInAdded
                    );

                    // Clean up the blob URL - only if it's a blob URL
                    if (fileToDelete.url && fileToDelete.url.startsWith('blob:')) {
                      URL.revokeObjectURL(fileToDelete.url);
                    }
                  }
                }
                return updatedAdded;
              });
            } else {
              // Add to deletedDocuments for server cleanup
              setDeletedDocuments((prev) => ({
                ...prev,
                [task.docLabel]: [
                  ...(prev[task.docLabel] || []),
                  fileToDelete.url,
                ],
              }));
            }

            return {
              ...task,
              files: updatedFiles,
              isChecked: updatedFiles.length > 0,
            };
          } else if (!task.isMultiple) {
            // Handle single file deletion
            const isNewFile = task.isNew;

            if (isNewFile) {
              // Clean up the blob URL
              if (task.file && task.file.startsWith('blob:')) {
                URL.revokeObjectURL(task.file);
              }

              // Remove from addedDocuments
              setAddedDocuments((prev) => ({
                ...prev,
                [task.docLabel]: [],
              }));
            } else {
              // Add to deletedDocuments for server cleanup
              setDeletedDocuments((prev) => ({
                ...prev,
                [task.docLabel]: [task.file],
              }));
            }

            return {
              ...task,
              file: null,
              isChecked: false,
              isNew: false,
            };
          }
        }
        return task;
      })
    );

    toast.success("File deleted successfully! Click Save & Submit to save.");
  };
  const base64ToBlob = (base64, type = "application/octet-stream") => {
    try {
      // Check if it's a valid base64 string (not a URL)
      if (typeof base64 !== "string" ||
        base64.startsWith("http") ||
        base64.startsWith("/") ||
        base64.startsWith("blob:")) {
        throw new Error("Not a base64 string");
      }

      // Clean the base64 string (remove data URL prefix if present)
      const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

      // Validate base64 format
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
        throw new Error("Invalid base64 characters");
      }

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type });
    } catch (err) {
      console.error("Invalid base64 string:", err);
      return null;
    }
  };


  const handleDownloadFile = async (fileDocument) => {
    console.log("Downloading file:", fileDocument);

    if (!fileDocument) {
      toast.error("No file available for download.");
      return;
    }

    let file;
    const fileSource =
      fileDocument.data || fileDocument.url || fileDocument.file;

    try {
      if (typeof fileSource === "string" && fileSource.startsWith("http")) {
        // Handle HTTP URLs (existing files from server)
        const response = await fetch(fileSource);
        if (!response.ok)
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        file = await response.blob();
      } else if (typeof fileSource === "string" && fileSource.startsWith("blob:")) {
        // Handle blob URLs (newly uploaded files)
        const response = await fetch(fileSource);
        if (!response.ok)
          throw new Error(`Failed to fetch blob: ${response.statusText}`);
        file = await response.blob();
      } else if (typeof fileSource === "string") {
        // Handle base64 strings
        file = base64ToBlob(fileSource, fileDocument.fileType);
        if (!file) {
          throw new Error("Invalid base64 string");
        }
      } else if (fileSource instanceof Blob || fileSource instanceof File) {
        // Handle Blob or File objects directly
        file = fileSource;
      } else {
        throw new Error("Unsupported file format");
      }

      const fileName = fileDocument.name || `document_${Date.now()}`;
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error preparing file for download:", error);
      toast.error("Failed to prepare file for download.");
    }
  };

  const DocumentPreview = ({ file, onDelete }) => {
    const isImage =
      file?.fileType?.includes("image") ||
      file?.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;

    const isPDF =
      file?.fileType === "application/pdf" ||
      file?.url?.match(/\.pdf$/i) != null;

    // Extract filename from URL or file object
    const getFileName = () => {
      if (file.name) return file.name;
      if (file.url) {
        // Extract from URL if no name provided
        const urlParts = file.url.split("/");
        return urlParts[urlParts.length - 1];
      }
      return "Document";
    };

    const fileName = getFileName();
    const displayName =
      fileName.length > 15
        ? `${fileName.substring(0, 12)}...${fileName.split(".").pop()}`
        : fileName;

    return (
      <div className="relative m-1 border rounded-md w-24 h-24 flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
        {isImage ? (
          <>
            <img
              src={file.url}
              alt="Document preview"
              className="max-h-16 max-w-full object-contain p-1"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
              }}
            />
            <p className="text-xs truncate w-full px-1 text-center">
              {displayName}
            </p>
          </>
        ) : isPDF ? (
          <>
            <div className="flex flex-col items-center justify-center h-full p-2">
              <BsFileEarmarkPdf size={30} className="text-red-400 mb-1" />
              <p className="text-xs truncate w-full px-1 text-center">
                {displayName}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center h-full">
              <FileDownloadIcon className="text-gray-500 text-xl" />
              <p className="text-xs truncate w-full px-1 text-center mt-1">
                {displayName}
              </p>
            </div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-1 bg-black bg-opacity-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadFile(file);
            }}
            className="text-white hover:text-blue-300 transition-colors mx-1"
            title="Download document"
          >
            <FileDownloadIcon fontSize="small" />
          </button>
        </div>

        {/* Always visible delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center hover:bg-red-600"
          title="Delete document"
        >
          ×
        </button>
      </div>
    );
  };
  const handleReuploadDocument = (docLabel, files) => {
    console.log("PARENT RECEIVED REUPLOAD:", docLabel, files); // <-- ADD THIS LOG

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.docLabel === docLabel) {
          const newFiles = Array.isArray(files) ? files : [files];

          const processedFiles = newFiles
            .map((file) => {
              if (!file) return null;
              return {
                file,
                url: file instanceof File ? URL.createObjectURL(file) : file.url || file,
                fileType: file.type || file.fileType || "application/octet-stream",
                isNew: true,
                name: file.name || `document_${Date.now()}`,
                uploadedAt: new Date().toISOString(),
              };
            })
            .filter(Boolean);

          if (task.isMultiple) {
            return {
              ...task,
              isChecked: true,
              files: processedFiles,
            };
          } else {
            const firstFile = processedFiles[0];
            return {
              ...task,
              isChecked: true,
              file: firstFile?.url || null,
              fileType: firstFile?.fileType,
              updatedAt: new Date().toLocaleDateString("en-GB"),
            };
          }
        }
        return task;
      })
    );

    // Also update addedDocuments so it gets submitted later
    setAddedDocuments((prev) => ({
      ...prev,
      [docLabel]: files, // Replace previous files
    }));
    console.log(tasks)
  };

  const { theme } = useTheme();
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"md"}>
        <form>
          <DialogTitle className="flex items-center justify-between" style={{ backgroundColor: theme.secondaryColor }}>
            Documents Uploaded by {docsByEmpID?.fullName}
            <CloseIcon
              className="cursor-pointer"
              onClick={handleClose}
            ></CloseIcon>
          </DialogTitle>
          <DialogContent dividers>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Select</TableCell>
                    <TableCell align="left">Document Name</TableCell>
                    <TableCell align="center">Upload Date</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks?.map((document, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const isMultiple = document.isMultiple;
                    return (
                      <TableRow
                        key={document.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          height: 75,
                        }}
                        hover
                      >
                        <TableCell padding="checkbox" align="center">
                          <Checkbox
                            color="primary"
                            // checked={isFileUploaded[document.docLabel] || false}
                            checked={document.isChecked || false}
                            // inputProps={{ "aria-labelledby": labelId }}
                            disabled={!document.isChecked ||
                              (!document.file && (!document.files || document.files.length === 0))}
                          />
                        </TableCell>
                        <TableCell align="left" component="th" scope="row">
                          <div className="flex flex-col gap-2 py-2">
                            <span className="font-medium text-gray-800">
                              {document.name}
                              {!document.isMultiple &&
                                filePreview[document.docLabel] && (
                                  <img
                                    src={filePreview[document.docLabel]}
                                    alt="File Preview"
                                    className="max-h-[40px] w-[40px] object-contain"
                                  />
                                )}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {/* Existing files */}

                              {document.isMultiple &&
                                document.files?.map((file, i) => (
                                  <div key={i} className="relative">
                                    <DocumentPreview
                                      file={file}
                                      onDelete={() =>
                                        handleDeleteFile(document.id, i)
                                      }
                                      document={document}
                                      fileIndex={i}
                                    />
                                    {/* <div className="absolute bottom-0 left-0 right-0 flex justify-center p-1 bg-black bg-opacity-50">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDownloadFile({
                                            ...document,
                                            file: file.url || file,
                                            fileType: file.fileType,
                                          });
                                        }}
                                        className="text-white hover:text-blue-300 transition-colors mx-1"
                                        title="Download document"
                                      >
                                        <FileDownloadIcon fontSize="small" />
                                      </button>
                                    </div> */}
                                  </div>
                                ))}

                              {/* For single upload documents */}
                              {/* {!document.isMultiple && document.file && (
                                <div className="relative">
                                  <DocumentPreview
                                    file={document.file}
                                    onDelete={() =>
                                      handleDeleteFile(document.id, 0)
                                    }
                                    document={document}
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 flex justify-center p-1 bg-black bg-opacity-50">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadFile(document, 0);
                                      }}
                                      className="text-white hover:text-blue-300 transition-colors mx-1"
                                      title="Download document"
                                    >
                                      <FileDownloadIcon fontSize="small" />
                                    </button>
                                  </div>
                                </div>
                              )} */}

                              {document.id === 13 && (
                                <label
                                  htmlFor={`file-upload-${document.id}`}
                                  className="border-2 border-dashed border-gray-300 rounded-md w-24 h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleDocumentUpload(document.id)}
                                >
                                  <FileUploadIcon className="text-gray-400" />
                                  <span className="text-xs text-gray-500 mt-1">
                                    Add Files
                                  </span>
                                  {/* Hidden input is no longer needed since we're using the dialog */}
                                </label>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align="center" className="text-gray-600">
                          {document.updatedAt}
                        </TableCell>
                        <TableCell align="center">
                          {
                            document.id !== 13 && (
                              <span className="flex justify-center items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDocumentUpload(document.id)}
                                  className={`cursor-pointer ${document.isChecked ? "opacity-50 cursor-not-allowed" : ""}`}
                                  disabled={document.isChecked}
                                >
                                  <FileUploadIcon
                                    style={{ color: theme.primaryColor }}
                                  />
                                </button>
                                <button
                                  type="button"
                                  className={`cursor-pointer ${!document.isChecked ? "opacity-50 cursor-not-allowed" : ""}`}
                                  onClick={() => handleDownloadFile(document)}
                                  disabled={!document.isChecked}
                                >
                                  <FileDownloadIcon style={{ color: theme.primaryColor }} />
                                </button>


                                {/* View Document Details */}

                                <IconButton
                                  disabled={!document?.isChecked}
                                  onClick={() => {
                                    setSelectForView(document.id);
                                    setOpenDocumentDetailsDialog(true);
                                  }}
                                  className={`cursor-pointer ${!document.isChecked ? "opacity-50 cursor-not-allowed" : ""}`}
                                  sx={{
                                    cursor: document.isChecked ? "pointer" : "not-allowed",
                                  }}
                                >
                                  <FaEye
                                    size={20}
                                    color={theme.primaryColor}
                                  />
                                </IconButton>
                              </span>
                            )
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {openDocumentUploadDialog && selectedId && (
              <UploadDocumentDialog
                openDialog={openDocumentUploadDialog}
                closeDialog={() => {
                  setOpenDocumentUploadDialog(false);
                  setSelectedId(null);
                }}
                getdoc={(files) => {
                  const document = tasks.find(task => task.id === selectedId);
                  if (document && files && (Array.isArray(files) ? files.length > 0 : files)) {
                    handleGetDoc(document.docLabel, files);
                  }
                  setOpenDocumentUploadDialog(false);
                }}
                documentType={tasks.find(task => task.id === selectedId)?.docLabel}
                isMultiple={tasks.find(task => task.id === selectedId)?.isMultiple}
              />
            )}
            {openDocumentDetailsDialog && selectIdForView && (
              <DocumentDetails
                openDialog={openDocumentDetailsDialog}
                closeDialog={() => {
                  setOpenDocumentDetailsDialog(false);
                  setSelectForView(null);
                }}
                data={tasks.find((item) => item.id === selectIdForView)}
                onReupload={handleReuploadDocument}
              />
            )}
          </DialogContent>
          {/* <DialogActions> */}
          <div className="w-full flex justify-center py-6">
            <button
              type="button"
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
              onClick={handleSubmitAllDocument}
              disabled={loading}
            >
              {loading ? "Submiting..." : "Submit"}
            </button>
          </div>
          {/* </DialogActions> */}
        </form>
      </Dialog>
    </div>
  );
};

export default ViewUploadedDialog;