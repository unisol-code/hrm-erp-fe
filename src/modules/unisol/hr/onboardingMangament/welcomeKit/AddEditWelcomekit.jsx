import  { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import BreadCrumb from "../../../../../components/BreadCrumb";
import Button from "../../../../../components/Button";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { useRef } from "react";
import useWelcomeKit from "../../../../../hooks/unisol/onboarding/useWelcomekit";


const AddEditWelcomeKit = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef(null);
  const {
  createWelcomeKit,updateWelcomeKit,
  fetchWelcomeKitById,
  welcomeKitDetails,
  loading,
} = useWelcomeKit();




  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string()
      .required("Description is required")
      .test('word-count', 'Description must not exceed 200 words', (value) => {
        if (!value) return true;
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 200;
      }),
    photos: Yup.array().min(1, "At least one photo is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      photos: [],
    },
    validationSchema: validationSchema,
 onSubmit: async (values) => {
  const formData = new FormData();

  // formData.append("name", values.name);
  // Backend update API expects only description + photos
  formData.append("description", values.description);

  // NEW uploaded photos
  selectedPhotos.forEach((file) => {
    formData.append("photos", file);
  });

  // Existing photos to KEEP
  existingPhotos.forEach((url) => {
    formData.append("photos", url);
  });

  try {
    if (id) {
      // UPDATE
      await updateWelcomeKit(id, formData);
    } else {
      // CREATE
      formData.append("name", values.name);
      await createWelcomeKit(formData);
    }

 
  } catch (error) {
    console.log("Submit failed", error);
  }
}


  });

  // Calculate word count
  const handleDescriptionChange = (e) => {
    const value = e.target.value;

    // word count
    const words = value.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    // auto-grow logic
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    formik.handleChange(e);
  };

  const rows = formik.values.description
    ? formik.values.description.split("\n").length
    : 0;

useEffect(() => {
  if (id) {
    fetchWelcomeKitById(id);
  }
}, [id]);


useEffect(() => {
  if (id && welcomeKitDetails?.data) {
    const kit = welcomeKitDetails.data;

    // Fill form values
    formik.setValues({
      name: kit.name || "",
      description: kit.description || "",
      photos: kit.photos || [],
    });

    // Set existing photos
    if (kit.photos?.length > 0) {
      setExistingPhotos(kit.photos);

      const previews = kit.photos.map((url, index) => ({
        url,
        name: `existing_${index}`,
        isExisting: true,
      }));

      setPhotoPreview(previews);
    }
  }
}, [id, welcomeKitDetails]);

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setSelectedPhotos((prev) => [...prev, ...files]);
    formik.setFieldValue("photos", [...formik.values.photos, ...files]);

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      isExisting: false,
    }));

    setPhotoPreview((prev) => [...prev, ...newPreviews]);
  };

  const handleDeletePhoto = (indexToRemove) => {
    const photoToRemove = photoPreview[indexToRemove];

    if (photoToRemove?.isExisting) {
      // Remove from existing photos array
      setExistingPhotos((prev) =>
        prev.filter((url) => url !== photoToRemove.url)
      );
    } else {
      // Remove from new photos array
      const newPhotoIndex = photoPreview
        .slice(0, indexToRemove)
        .filter((p) => !p.isExisting).length;
      setSelectedPhotos((prev) =>
        prev.filter((_, i) => i !== newPhotoIndex)
      );
    }

    // Revoke object URL if it's a blob
    if (photoToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(photoToRemove.url);
    }

    setPhotoPreview((prev) => prev.filter((_, i) => i !== indexToRemove));

    // Update formik values
    const remainingPhotos = photoPreview.filter((_, i) => i !== indexToRemove);
    formik.setFieldValue("photos", remainingPhotos);
  };

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
          { text: "Onboarding Management" },
          { text: "Welcome Kit List", href: "/onboardingmanegment/welcomeKit" },
          { text: id ? "Edit Welcome Kit" : "Add Welcome Kit" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg">
        <div
          className="text-black text-lg font-semibold px-8 py-4 rounded-t-2xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          {id ? "Edit" : "Add"} Welcome Kit
        </div>

        <form className="space-y-6 p-6" onSubmit={formik.handleSubmit}>
          {/* Photo Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Photos <span className="text-red-500">*</span>
            </label>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload photos for the welcome kit (JPG, PNG, max 5MB each)
            </p>

            {/* Photo Previews */}
            {photoPreview.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {photoPreview.map((photo, index) => (
                  <div
                    key={index}
                    className="relative w-[200px] border-2 border-gray-300 rounded-lg p-2"
                  >
                    <img
                      src={photo.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-[150px] object-cover rounded"
                    />
                    <button
                      type="button"
                      
                      onClick={() => handleDeletePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded hover:bg-red-700 transition flex items-center justify-center text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formik.touched.photos && formik.errors.photos && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.photos}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
               readOnly={!!id}
              placeholder="Enter welcome kit name"
              {...formik.getFieldProps("name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          {/* Description */}
          <label className="block font-medium text-gray-700 ">
              Description <span className="text-red-500">*</span>
            </label>
          <textarea
            ref={textareaRef}
            name="description"
            placeholder="Enter welcome kit description (max 200 words)"
            value={formik.values.description}
            onChange={handleDescriptionChange}
            rows="4"
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm
             focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
  {/* <textarea         
                name="purposeReason"
                value={formData.purposeReason}
                onChange={handleInputChange}
                placeholder="Enter purpose or reason for the loan"
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              /> */}


          {/* Action Buttons */}
          <div className="flex justify-end gap-8 pt-6">
            <button
              type="button"
              style={{
                color: theme.primaryColor,
                borderColor: theme.primaryColor,
              }}
              className="px-10 py-2 bg-white font-normal rounded-md border-2 hover:bg-gray-100 transition"
              onClick={() => navigate("/onboardingmanegment/welcomeKit")}
            >
              Cancel
            </button>

            <Button
              type="submit"
              text={loading ? "Loading..." : id ? "Update" : "Add"}
              disabled={formik.isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditWelcomeKit;