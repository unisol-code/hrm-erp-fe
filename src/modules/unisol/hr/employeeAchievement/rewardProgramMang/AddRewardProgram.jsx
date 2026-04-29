import React, { useRef, useState } from "react";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Select from "react-select";
import JoditEditor from "jodit-react";
import useEmpAchievement from "../../../../../hooks/unisol/empAchievement/useEmpAchievement";
import Button from "../../../../../components/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const AddRewardProgram = () => {
  const navigate = useNavigate();
  const {
    loading,
    payrollGrade,
    fetchPayrollGrade,
    createRewardProgram,
    fetchRewardProgramById,
    updateRewardProgram,
    viewRewardProgram,
  } = useEmpAchievement();
  const { theme } = useTheme();
  const editorRef = useRef(null);
  const { id } = useParams();
  const [editorContent, setEditorContent] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [previewUrl, setPreviewUrl] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  const joditConfig = {
    readonly: false,
    height: "500px",
    color: "#000000",
  };

  const options = payrollGrade?.length
    ? payrollGrade.map((item) => ({ label: item, value: item }))
    : [];

  const validationSchema = Yup.object().shape({
    rewardProgramTitle: Yup.string().required(
      "Reward Program title is required"
    ),
    grade: Yup.array().min(1, "At least one grade is required"),
    uploadFile: Yup.array()
      .test("required", "At least one file is required", (files) => {
        return Array.isArray(files) && files.length > 0 && files.some((f) => f);
      })
      .test("fileSize", "Each file must be less than 2MB", (files) => {
        return (
          Array.isArray(files) &&
          files.every(
            (file) => typeof file === "string" || file.size <= 2 * 1024 * 1024
          )
        );
      })
      .test("fileType", "Only PDF, DOC, DOCX files are allowed", (files) => {
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return (
          Array.isArray(files) &&
          files.every(
            (file) =>
              typeof file === "string" || allowedTypes.includes(file.type)
          )
        );
      }),

    link: Yup.array()
      .of(Yup.string().url("Enter a valid URL (must start with http/https)"))
      .min(1, "At least one link is required"),
  });

  const formik = useFormik({
    initialValues: {
      rewardProgramTitle: id
        ? viewRewardProgram?.program?.rewardProgramTitle
        : "",
      uploadFile: id ? viewRewardProgram?.program?.uploadFile ?? [] : [],
      description: id ? viewRewardProgram?.program?.description ?? "" : "",
      grade: id ? viewRewardProgram?.program?.grade ?? [] : [],
      link: id ? viewRewardProgram?.program?.videoLinks ?? [""] : [""],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const formData = new FormData();

      // Grades
      values.grade.forEach((grade) => formData.append("grade", grade));
      formData.append("rewardProgramTitle", values.rewardProgramTitle);

      // Files
      selectedFile.forEach((file) => {
        formData.append("uploadFile", file);
      });

      existingFiles.forEach((url) => {
        formData.append("existingUploadFile", url);
      });

      // Description & Links
      formData.append("description", editorContent);
      values.link.forEach((link) => {
        if (link.trim() !== "") {
          formData.append("videoLinks", link);
        }
      });

      try {
        if (id) {
          await updateRewardProgram(id, formData);
        } else {
          await createRewardProgram(formData);
        }
      } catch (err) {
        console.error("Error creating reward program:", err);
        alert("Failed to create reward program. Please try again.");
      }
      navigate("/hr/employeeAchievement/employeeRewards/rewardProgramList");
    },
  });

  const handleSelectChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    formik.setFieldValue("grade", values);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // filter valid files under 2MB
    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);

    if (validFiles.length < files.length) {
      alert("Some files were skipped because they exceed the 2MB limit.");
    }

    // update local state for preview
    setSelectedFile((prev) => [...prev, ...validFiles]);

    const urls = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    }));
    setPreviewUrl((prev) => [...prev, ...urls]);

    // 👇 update Formik's value too
    formik.setFieldValue("uploadFile", [
      ...formik.values.uploadFile,
      ...validFiles,
    ]);
  };

  const handleDelete = (indexToRemove) => {
    const fileToRemove = previewUrl[indexToRemove];

    if (fileToRemove?.isExisting) {
      setExistingFiles((prev) =>
        prev.filter((url) => url !== fileToRemove.url)
      );
    } else {
      setSelectedFile((prev) => prev.filter((_, i) => i !== indexToRemove));
    }

    if (fileToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.url);
    }

    const updatedPreview = previewUrl.filter((_, i) => i !== indexToRemove);
    setPreviewUrl(updatedPreview);

    // 👇 update Formik values
    const updatedFiles = formik.values.uploadFile.filter(
      (_, i) => i !== indexToRemove
    );
    formik.setFieldValue("uploadFile", updatedFiles);

    // 👇 force validation immediately
    formik.validateField("uploadFile");
  };

  const handleAddLinkField = () => {
    formik.setFieldValue("link", [...formik.values.link, ""]);
  };

  const handleRemoveLinkField = (index) => {
    const updatedLinks = [...formik.values.link];
    updatedLinks.splice(index, 1);
    formik.setFieldValue("link", updatedLinks);
  };

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...formik.values.link];
    updatedLinks[index] = value;
    formik.setFieldValue("link", updatedLinks);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "0.75rem",
      padding: "0.25rem 0.5rem",
      borderColor: state.isFocused ? "#60a5fa" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(96,165,250,0.3)" : "none",
      "&:hover": { borderColor: "#60a5fa" },
      backgroundColor: "white",
    }),
  };

  React.useEffect(() => {
    if (id && viewRewardProgram?.program?.description) {
      setEditorContent(viewRewardProgram.program.description);

      const backendFiles = viewRewardProgram.program.uploadFile || [];
      console.log("existingFiles", backendFiles);
      setExistingFiles(backendFiles);

      const backendPreview = backendFiles.map((fileUrl) => {
        const extension = fileUrl.split(".").pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
          extension
        );
        const isVideo = ["mp4", "webm", "ogg"].includes(extension);
        const isPDF = extension === "pdf";
        return {
          url: fileUrl,
          name: fileUrl.split("/").pop(),
          type: isImage
            ? "image/"
            : isVideo
            ? "video/"
            : isPDF
            ? "application/pdf"
            : "application/octet-stream",
          isExisting: true,
        };
      });

      setPreviewUrl((prev) => {
        const onlyNewFiles = prev.filter((f) => !f.isExisting);
        return [...backendPreview, ...onlyNewFiles];
      });

      setExistingFiles(backendFiles);
    }
  }, [id, viewRewardProgram]);

  React.useEffect(() => {
    fetchPayrollGrade();
    if (id) {
      fetchRewardProgramById(id);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          {
            text: "Employee Achievement",
            href: "/hr/employeeAchievement",
          },
          {
            text: "Reward Program List",
            href: "/hr/employeeAchievement/employeeRewards/rewardProgramList",
          },
          { text: "Add Reward " },
        ]}
      />
      <div className="bg-white rounded-2xl shadow-lg">
        <div
          className="text-black text-lg font-semibold px-8 py-8 rounded-t-2xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          Add Reward
        </div>
        <form className="space-y-6 p-6" onSubmit={formik.handleSubmit}>
          {/* Payroll Grade */}
          <div>
            <label className="font-normal block my-1">Payroll Grade:</label>
            <Select
              className="w-full rounded"
              name="grade"
              options={options}
              value={options.filter((attendee) =>
                formik.values.grade.includes(attendee.value)
              )}
              onChange={handleSelectChange}
              styles={customStyles}
              isSearchable={true}
              isClearable={true}
              closeMenuOnSelect={false}
              isMulti
            />
            {formik.touched.grade && formik.errors.grade && (
              <div className="text-red-500">{formik.errors.grade}</div>
            )}
          </div>

          {/* Reward Program Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Reward Program Title:
            </label>
            <input
              type="text"
              name="rewardProgramTitle"
              placeholder="Enter title"
              {...formik.getFieldProps("rewardProgramTitle")}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            {formik.touched.rewardProgramTitle &&
              formik.errors.rewardProgramTitle && (
                <div className="text-red-500 text-sm">
                  {formik.errors.rewardProgramTitle}
                </div>
              )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Upload File:
            </label>
            <input
              type="file"
              name="uploadFile"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white"
            />
            {formik.touched.uploadFile && formik.errors.uploadFile && (
              <div className="text-red-500 text-sm">
                {formik.errors.uploadFile}
              </div>
            )}

            {previewUrl.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-4">
                {previewUrl.map((fileObj, index) => (
                  <div
                    key={index}
                    className="relative w-[200px] border p-2 rounded"
                  >
                    {fileObj.type.startsWith("image/") ? (
                      <img
                        src={fileObj.url}
                        alt={`Preview ${index}`}
                        width="200"
                      />
                    ) : fileObj.type.startsWith("video/") ? (
                      <video src={fileObj.url} controls width="200" />
                    ) : fileObj.type === "application/pdf" ? (
                      <div className="text-sm">
                        📄 <span>{fileObj.name}</span>
                        <a
                          href={fileObj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline block mt-1"
                        >
                          View PDF
                        </a>
                      </div>
                    ) : (
                      <div className="text-sm">
                        📄 <span>{fileObj.name}</span>
                        <a
                          href={fileObj.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline block mt-1"
                        >
                          {fileObj.url ? "View File" : "No preview"}
                        </a>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white w-4 h-5 text-sm rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          {/* <div>
            <label className="block font-medium text-gray-700 mb-1">
              Links:
            </label>
            {formik.values.link.map((linkVal, index) => (
              <div key={index} className="flex items-center gap-4 mb-3">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={linkVal}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {formik.values.link.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLinkField(index)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLinkField}
              className="text-blue-600 hover:underline mt-1 text-sm"
            >
              + Add more links
            </button>

            {typeof formik.errors.link === "string" && (
              <div className="text-red-500 text-sm">{formik.errors.link}</div>
            )}
          </div> */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Links:
            </label>
            {formik.values.link.map((linkVal, index) => (
              <div key={index} className="flex flex-col gap-1 mb-3">
                <div className="flex items-center gap-4">
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={linkVal}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    onBlur={() =>
                      formik.setFieldTouched(`link[${index}]`, true)
                    } // 👈 mark touched
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {formik.values.link.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLinkField(index)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* 👇 show error for this specific link */}
                {formik.touched.link?.[index] &&
                  formik.errors.link?.[index] && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.link[index]}
                    </div>
                  )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddLinkField}
              className="text-blue-600 hover:underline mt-1 text-sm"
            >
              + Add more links
            </button>

            {/* 👇 general error if no links */}
            {typeof formik.errors.link === "string" && (
              <div className="text-red-500 text-sm">{formik.errors.link}</div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Content:
            </label>
            <JoditEditor
              ref={editorRef}
              value={editorContent}
              config={joditConfig}
              onBlur={(newContent) => setEditorContent(newContent)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-8 pt-10">
            <button
              type="button"
              style={{
                color: theme.primaryColor,
                borderColor: theme.primaryColor,
              }}
              className="px-10 py-2 bg-white font-normal rounded-md hover:bg-gray-300 transition"
              onClick={() =>
                navigate(
                  "/hr/employeeAchievement/employeeRewards/rewardProgramList"
                )
              }
            >
              Cancel
            </button>
            <Button
              type="submit"
              text={loading ? "Loading..." : id ? "Update" : "Save"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRewardProgram;
