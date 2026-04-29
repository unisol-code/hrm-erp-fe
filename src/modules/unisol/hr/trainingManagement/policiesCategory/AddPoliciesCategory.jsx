import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Breadcrumb from "../../../../../components/BreadCrumb";
import Select from "react-select";
import usePoliciesCategory from "../../../../../hooks/policiesCatagory/usePoliciesCatagory";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import JoditEditor from "jodit-react";
import * as Yup from "yup";
import Button from "../../../../../components/Button";
import { policiesCategoryDetailsState } from "../../../../../state/policiesCategory/usePoliciesCategory";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

export default function AddPoliciesCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);

  const {
    payrollGrade,
    fetchPayrollGrade,
    createPoliciesCategory,
    loading,
    fetchPoliciesCategoryDetails,
    PoliciesCategoryDetails,
    updatePoliciesCategory,
  } = usePoliciesCategory();

  const [previewUrl, setPreviewUrl] = useState([]);
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");

  const joditConfig = {
    readonly: false,
    height: "500px",
    color: "#000000",
  };

  const options = payrollGrade?.length
    ? payrollGrade.map((item) => ({ label: item, value: item }))
    : [];

  useEffect(() => {
    fetchPayrollGrade();
    if (id) {
      fetchPoliciesCategoryDetails(id);
    }
  }, []);

  useEffect(() => {
    if (id && PoliciesCategoryDetails?.module?.description) {
      setEditorContent(PoliciesCategoryDetails.module.description);

      const backendFiles = PoliciesCategoryDetails.module.uploadFile || [];
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

      // setExistingFiles(backendFiles);
    }
  }, [id, PoliciesCategoryDetails]);

  const { theme } = useTheme();

  const validationSchema = Yup.object().shape({
    policyModuleTitle: Yup.string().required("Policy title is required"),
    eligibilityPercentage: Yup.number()
      .min(1, "Eligibility percentage must be at least 1")
      .max(100, "Eligibility percentage cannot exceed 100")
      .required("Eligibility percentage is required"),
    grade: Yup.array().min(1, "At least one grade is required"),
  });

  const formik = useFormik({
    initialValues: {
      policyModuleTitle: id
        ? PoliciesCategoryDetails?.module?.policyModuleTitle ?? ""
        : "",
      eligibilityPercentage: id
        ? PoliciesCategoryDetails?.module?.eligibilityPercentage ?? ""
        : "",
      uploadFile: [],
      description: id ? PoliciesCategoryDetails?.module?.description ?? "" : "",
      grade: id ? PoliciesCategoryDetails?.module?.grade ?? [] : [],
      link: id ? PoliciesCategoryDetails?.module?.videoLinks ?? [""] : [""],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      // Add new uploads as File objects
      selectedFile.forEach((file) => {
        formData.append("uploadFile", file);
      });

      // Add existing backend file URLs as strings
      existingFiles.forEach((url) => {
        formData.append("existingUploadFile", url);
      });

      // Other fields
      values.grade.forEach((grade) => formData.append("grade", grade));
      formData.append("description", editorContent);
      values.link
        .filter((link) => link.trim() !== "")
        .forEach((link) => formData.append("videoLinks", link));
      formData.append("policyModuleTitle", values.policyModuleTitle);
      formData.append("eligibilityPercentage", values.eligibilityPercentage);

      if (id) {
        await updatePoliciesCategory(id, formData);
      } else {
        await createPoliciesCategory(formData);
      }

      navigate("/Policiescategory");
    },
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setSelectedFile((prev) => [...prev, ...files]);

    const urls = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    }));

    setPreviewUrl((prev) => [...prev, ...urls]);
  };

  const handleDelete = (indexToRemove) => {
    const fileToRemove = previewUrl[indexToRemove];

    if (fileToRemove?.isExisting) {
      setExistingFiles((prev) =>
        prev.filter((url) => url !== fileToRemove.url)
      );
      console.log("after remove", existingFiles);
    } else {
      setSelectedFile((prev) => prev.filter((_, i) => i !== indexToRemove));
    }

    if (fileToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.url);
    }

    setPreviewUrl((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSelectChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setSelectedGrade(values);
    formik.setFieldValue("grade", values);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }
  console.log(formik.values, formik.errors);
  console.log(selectedFile);
  return (
    <div className="w-full min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Training Management" },
          { text: "Policies Policy List", href: "/PoliciesCategory" },
          { text: id ? "Edit Policy " : "Add Policy " },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg">
        <div
          className="text-black text-lg font-semibold px-8 py-4 rounded-t-2xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          {id ? "Edit" : "Add"} Policy
        </div>

        <form className="space-y-6 p-6" onSubmit={formik.handleSubmit}>
          <div>
            <label className="font-normal block my-1">Payroll Grade:</label>
            <Select
              className="w-full rounded"
              name="participants"
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

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Policy Title:
            </label>
            <input
              type="text"
              name="policyModuleTitle"
              placeholder="Enter title"
              {...formik.getFieldProps("policyModuleTitle")}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            {formik.touched.policyModuleTitle &&
              formik.errors.policyModuleTitle && (
                <div className="text-red-500 text-sm">
                  {formik.errors.policyModuleTitle}
                </div>
              )}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Eligibility Percentage:
            </label>
            <input
              type="number"
              name="eligibilityPercentage"
              placeholder="Enter eligibility %"
              onWheel={(e) => e.target.blur()}
              {...formik.getFieldProps("eligibilityPercentage")}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            {formik.touched.eligibilityPercentage &&
              formik.errors.eligibilityPercentage && (
                <div className="text-red-500 text-sm">
                  {formik.errors.eligibilityPercentage}
                </div>
              )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Upload File:
            </label>
            <input
              type="file"
              name="uploadFile"
              accept="image/*,video/*,application/pdf"
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

          <div>
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
          </div>

          <div
            className="container max-w-4xl mx-auto my-2"
            style={{ width: "100%", maxWidth: "75vw" }}
          >
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

          <div className="flex justify-end gap-8 pt-10">
            <button
              type="button"
              style={{
                color: theme.primaryColor,
                borderColor: theme.primaryColor,
              }}
              className="px-10 py-2 bg-white font-normal rounded-md hover:bg-gray-300 transition border"
              onClick={() => navigate("/PoliciesCategory")}
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
}
