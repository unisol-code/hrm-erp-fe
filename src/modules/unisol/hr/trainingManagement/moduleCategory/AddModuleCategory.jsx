import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Breadcrumb from "../../../../../components/BreadCrumb";
import Select from "react-select"; // ✅ This is correct one
import useModuleCategory from "../../../../../hooks/moduleCategory/useModuleCategory";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import JoditEditor from "jodit-react";
import * as Yup from "yup";
import Button from "../../../../../components/Button";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

export default function AddModuleCategory() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedGrade, setSelectedGrade] = useState(null);
  const {
    payrollGrade,
    fetchPayrollGrade,
    createModuleCategory,
    loading,
    fetchModuleCategoryDetails,
    moduleCategoryDetails,
    updateModuleCategory,
  } = useModuleCategory();
  const [previewUrl, setPreviewUrl] = useState([]);
  const [previousUrl, setPreviousUrl] = useState(moduleCategoryDetails?.module?.uploadFile || []);
  const editorRef = useRef(null);
  const joditConfig = {
    readonly: false,
    height: "500px",
    color: "#000000",
  };
  const [editorContent, setEditorContent] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const options =
    payrollGrade?.length != 0
      ? payrollGrade?.map((item) => ({ label: item, value: item }))
      : [];
  useEffect(() => {
    fetchPayrollGrade();
    if (id) {
      fetchModuleCategoryDetails(id);
    }
  }, []);

  useEffect(() => {
    if (id && moduleCategoryDetails) {
      setPreviousUrl(moduleCategoryDetails?.module?.uploadFile);
    }
    if (id && moduleCategoryDetails?.module?.description) {
      setEditorContent(moduleCategoryDetails?.module?.description);
    }

    setPreviewUrl((prev) => {
      const onlyNewFiles = prev.filter((f) => !f.isExisting);
      return [...onlyNewFiles];
    });
  }, [id, moduleCategoryDetails]);

  /*   console.log(payrollGrade, id, moduleCategoryDetails); */

  const { theme } = useTheme();

  /* async function urlToFile(url, filename, mimeType) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType });
};

function getMimeType(url) {
  const ext = url.split(".").pop().toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "mp4":
      return "video/mp4";
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
};

useEffect(() => {
  async function fetchFileFromURL() {
    if (id && moduleCategoryDetails?.module?.uploadFile) {
      const urls = Array.isArray(moduleCategoryDetails.module.uploadFile)
        ? moduleCategoryDetails.module.uploadFile
        : [moduleCategoryDetails.module.uploadFile];

      const files = await Promise.all(
        urls.map(async (url) => {
          const mimeType = getMimeType(url);
          const file = await urlToFile(
            url,
            "existing_file." + mimeType.split("/")[1],
            mimeType
          );
          return file;
        })
      );

      setSelectedFile(files);
      setPreviewUrl(files.map((file) => URL.createObjectURL(file)));
      formik.setFieldValue("uploadFile", files);
    }
  }
  fetchFileFromURL();
}, [id, moduleCategoryDetails]);
 */
  const validationSchema = Yup.object().shape({
    trainingModuleTitle: Yup.string().required("Training Module is required"),
    eligibilityPercentage: Yup.number().min(1, "Eligibility percentage must be at least 1").max(100, "Eligibility percentage cannot exceed 100").required("Eligibility percentage is required"),
    grade: Yup.array().min(1, "At least one grade is required"),
  });

  const formik = useFormik({
    initialValues: {
      trainingModuleTitle: id
        ? moduleCategoryDetails?.module?.trainingModuleTitle ?? ""
        : "",
      eligibilityPercentage: id ? moduleCategoryDetails?.module?.eligibilityPercentage ?? "" : "",
      uploadFile: id ? moduleCategoryDetails?.module?.uploadFile ?? [] : [],
      description: id ? moduleCategoryDetails?.module?.description ?? "" : "",
      grade: id ? moduleCategoryDetails?.module?.grade ?? [] : [],
      link: id ? moduleCategoryDetails?.module?.videoLinks ?? [""] : [""],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const formData = new FormData();
      selectedFile.length > 0 && selectedFile?.forEach((file) => {
        formData.append("uploadFile", file);
      });

      values?.grade?.length > 0 &&
        values.grade?.forEach((grade) => {
          formData.append("grade", grade);
        });
      formData.append("description", editorContent);
      id && previousUrl?.length > 0 &&
        previewUrl?.forEach((file) => {
          formData.append("existingUploadFile", previousUrl);
        });
      values.link[0] !== "" && values.link.forEach((link) => {
        formData.append("videoLinks", link);
      })
      formData.append("trainingModuleTitle", values.trainingModuleTitle);
      formData.append("eligibilityPercentage", values.eligibilityPercentage);
      console.log(formData);
      id
        ? await updateModuleCategory(id, formData)
        : await createModuleCategory(formData);
      navigate("/modulecategory");
    },
  });
  console.log(formik?.values?.link, selectedFile);
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // ✅ converts FileList to Array
    if (files.length === 0) return;
    setSelectedFile((prev) => [...prev, ...files]);
    formik.setFieldValue("uploadFile", files);
    const urls = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    }));

    setPreviewUrl((prev) => [...prev, ...urls]);
  };
  const handleSelectChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    const updated = values;
    /* setSelectedGrade(updated); */
    formik.setFieldValue("grade", values);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "0.75rem", // ✅ Makes the input rounded
      padding: "0.25rem 0.5rem",
      borderColor: state.isFocused ? "#60a5fa" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(96,165,250,0.3)" : "none",
      "&:hover": { borderColor: "#60a5fa" },
      backgroundColor: "white",
    }),
  };

  const handleDelete = (indexToRemove, type) => {
    if (type === "new") {
      const updatedFiles = selectedFile.length > 0 && selectedFile?.filter(
        (_, index) => index !== indexToRemove
      );
      const updatedUrls = previewUrl?.filter(
        (_, index) => index !== indexToRemove
      );


      URL.revokeObjectURL(previewUrl[indexToRemove]);
      setSelectedFile(updatedFiles);
      setPreviewUrl(updatedUrls);

      // Update Formik
      const remainingFileNames = updatedFiles.length > 0 && updatedFiles.map((file) => file.name);
      formik.setFieldValue("uploadFile", remainingFileNames);
    }
    if (type === "old") {
      const updatedPreviousUrls = previousUrl?.filter(
        (_, index) => index !== indexToRemove
      );
      setPreviousUrl(updatedPreviousUrls);
      console.log(updatedPreviousUrls, index);
    }
  };

  const getFileExtension = (url = "") => {
    return url.split("?")[0].split(".").pop().toLowerCase(); // remove query params
  };

  const getFileType = (url) => {
    const ext = getFileExtension(url);
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
    if (["mp4", "webm", "mov"].includes(ext)) return "video";
    if (["pdf", "doc", "docx", "ppt", "xlsx"].includes(ext)) return "document";
    return "unknown";
  };


  // Add new empty link input
  const handleAddLinkField = () => {
    const newLinks = [...formik.values.link, ""];
    formik.setFieldValue("link", newLinks);
  };

  // Remove a link input at index
  const handleRemoveLinkField = (index) => {
    const newLinks = [...formik.values.link];
    newLinks.splice(index, 1);
    formik.setFieldValue("link", newLinks);
  };

  // Update a specific link input at index
  const handleLinkChange = (index, value) => {
    const newLinks = [...formik.values.link];
    newLinks[index] = value;
    formik.setFieldValue("link", newLinks);
  };
  if (loading || !payrollGrade) {
    console.log("Loading...");
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    )
  }
  /* console.log(previousUrl,previousUrl?.length); */

  return (
    <div className="w-full min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Training Management"},
          { text: "Training Module List", href: "/moduleCategory" },
          { text: id ? "Edit Training Module" : "Add Training Module" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg">
        <div
          className="text-black text-lg font-semibold px-8 py-4 rounded-t-2xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          {id ? "Edit" : "Add"} Training Module
        </div>

        <form className="space-y-6 p-6" onSubmit={formik.handleSubmit}>
          <div className="">
            <label htmlFor="" className="font-normal block my-1">
              Payroll Grade:
            </label>
            <Select
              className="placeholder-gray-400 w-full rounded"
              name="participants"
              options={options}
              value={
                options.length !== 0
                  ? options?.filter((attendee) =>
                    formik.values.grade.includes(attendee.value)
                  )
                  : []
              }
              onChange={handleSelectChange}
              styles={customStyles}
              isSearchable={true}
              isClearable={true}
              closeMenuOnSelect={false} // Update Formik state
              isMulti
            />
            {formik.touched.grade && formik.errors.grade ? (
              <div className="text-red-500">{formik.errors.grade}</div>
            ) : null}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Training Module:
            </label>
            <input
              type="text"
              name="trainingModuleTitle"
              placeholder="Enter title"
              {...formik.getFieldProps("trainingModuleTitle")}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            {formik.touched.trainingModuleTitle &&
              formik.errors.trainingModuleTitle && (
                <div className="text-red-500 text-sm">
                  {formik.errors.trainingModuleTitle}
                </div>
              )}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Eligibility Percentage:</label>
            <input
              type="number"
              name="eligibilityPercentage"
              placeholder="Enter eligibility %"
              {...formik.getFieldProps("eligibilityPercentage")}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              onWheel={(e) => e.target.blur()}
            />
            {formik.touched.eligibilityPercentage && formik.errors.eligibilityPercentage && (
              <div className="text-red-500 text-sm">{formik.errors.eligibilityPercentage}</div>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Upload File:
            </label>
            <input
              type="file"
              name="uploadFile"
              accept=".jpg,.jpeg,.png,.mp4,.pdf,.doc,.docx"
              onChange={handleFileChange}
              multiple
              className={`w-full px-3 py-2 border border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-normal file:text-#[372e2e] hover:file:bg-blue-200`}
            />
            {formik.touched.uploadFile && formik.errors.uploadFile && (
              <div className="text-red-500 text-sm">
                {formik.errors.uploadFile}
              </div>
            )}
            <div className="flex flex-wrap">
              {previousUrl?.map((url, index) => {
                const type = getFileType(url);

                return (
                  <div key={index} className="relative w-[200px] border p-2 rounded">
                    {type === "image" ? (
                      <img src={url} alt={`Image ${index}`} width="200" />
                    ) : type === "video" ? (
                      <video src={url} width="200" controls />
                    ) : type === "document" ? (
                      <div className="text-sm">
                        📄
                        <a
                          href={url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline block mt-1"
                        >
                          {url ? "View File" : "No preview"}
                        </a>
                      </div>
                    ) : (
                      <div>
                        📎 <a href={url} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                          View File
                        </a>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(index, "old")}
                      className="absolute top-0 right-0 bg-red-600 text-white w-4 h-5 text-sm rounded"
                    >
                      X
                    </button>
                  </div>
                );
              })}

              {previewUrl.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-4">
                  {previewUrl.map((fileObj, index) => (
                    <div key={index} className="relative w-[200px] border p-2 rounded">
                      {fileObj.type.startsWith("image/") ? (
                        <img src={fileObj.url} alt={`Preview ${index}`} width="200" />
                      ) : fileObj.type.startsWith("video/") ? (
                        <video src={fileObj.url} controls width="200" />
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

          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Links:</label>

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

            {formik.touched.link && typeof formik.errors.link === "string" && (
              <div className="text-red-500 text-sm">{formik.errors.link}</div>
            )}

            <button
              type="button"
              onClick={handleAddLinkField}
              className="text-blue-600 hover:underline mt-1 text-sm"
            >
              + Add more links
            </button>
          </div>


          {/* <div>
            <label className="block font-medium text-gray-700 mb-1">
              Description:
            </label>
            <textarea
              rows={5}
              name="description"
              {...formik.getFieldProps("description")}
              placeholder="Enter Description"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            ></textarea>
          </div> */}
          <div
            className="container max-w-4xl mx-auto my-2"
            style={{ width: "100%", maxWidth: "75vw" }}
          >
            <label className="block font-medium text-gray-700 mb-1">
              Description:
            </label>
            <JoditEditor
              ref={editorRef}
              value={editorContent}
              config={joditConfig}
              onBlur={(newContent) => setEditorContent(newContent)}
            />
          </div>

          <div className="flex justify-end gap-8 pt-10">
            <Button variant={3} text="Cancel"
              type="button"
              onClick={() => navigate("/moduleCategory")}
            />

            <Button variant={1}
              type="submit"
              text={loading ? "Loading..." : id ? "Update" : "Save"}


            /* onClick={() => navigate("/moduleCategory")} */
            >

            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
