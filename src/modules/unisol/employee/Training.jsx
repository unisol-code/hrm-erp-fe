import { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { Add, NavigateBefore, NavigateNext } from "@mui/icons-material";
import useEmpTraining from "../../../hooks/unisol/empTraining/useEmpTraining";
import { useFormik } from "formik";
import * as Yup from "yup";
import { use } from "react";
import Breadcrumb from "../../../components/BreadCrumb";
import { useTheme } from "../../../hooks/theme/useTheme";
import { FaCloudUploadAlt, FaBookOpen } from "react-icons/fa";
import LoaderSpinner from "../../../components/LoaderSpinner.jsx";
import Button from "../../../components/Button.jsx";

const Training = () => {
  const { editTraining, trainingList, fetchTrainingList, loading } =
    useEmpTraining();
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { theme } = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  console.log("trainingList", trainingList);

  useEffect(() => {
    fetchTrainingList();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      imageOrVideo: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      imageOrVideo: Yup.mixed()
        .required("Image Or Video is required")
        .test("fileSize", "File size must be less than 10MB", (value) => {
          if (!value) return true;
          return value.size <= 5 * 1024 * 1024; // 10MB
        }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("imageOrVideo", selectedFile);

      await editTraining(formData);
      await fetchTrainingList();
      // setCards([...cards, { id: cards.length + 1, title: values.title, file: selectedFile }]);
      setShowModal(false);
      formik.resetForm();
      setSelectedFile(null);
    },
  });

  useEffect(() => {
    if (trainingList?.length) {
      setCards(
        trainingList.map((item) => ({
          id: item._id,
          title: item.title,
          file: item.imageOrVideo, // URL from API
        }))
      );
    }
  }, [trainingList]);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    formik.setFieldValue("imageOrVideo", file);
  };

  const handleDeleteFile = async (card) => {
    console.log("card", card);
    const deleteMedia = card?.file;
    const formData = new FormData();
    formData.append("deleteMedia", deleteMedia);
    await editTraining(formData);
    fetchTrainingList();
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      formik.setFieldValue("imageOrVideo", e.dataTransfer.files[0]);
    }
  };
  if (loading || !trainingList) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb linkText={[{ text: "Project" }]} />
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="text-2xl font-bold py-4 px-8 flex items-center rounded-2xl bg-white shadow-lg gap-3">
          <FaBookOpen style={{ color: theme.primaryColor, fontSize: 32 }} />{" "}
          Project Overview
        </div>
        <section className="bg-white px-6 py-6 rounded-2xl w-full shadow-lg">
          <div className="flex w-full justify-between items-center mb-6 flex-col md:flex-row gap-4 md:gap-0">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FaBookOpen className="text-[#709EB1]" /> View Project Documents
            </h1>

            <Button
              type="button"
              icon={<Add />}
              text="Add Project Document"
              onClick={() => setShowModal(true)}
            />
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 w-full justify-items-stretch">
            {cards.length === 0 && (
              <div className="col-span-full text-center text-gray-500 text-lg py-8">
                No Project documents uploaded yet.
              </div>
            )}
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-stretch w-full max-w-[350px] h-[250px] transition-all duration-200 cursor-pointer group hover:scale-105 hover:shadow-2xl"
                onClick={() => setPreviewMedia(card)}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaBookOpen className="text-[#709EB1]" />
                    <span className="font-bold text-lg">{card.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(card);
                    }}
                    className="bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-red-500 p-1 rounded-full transition-transform duration-200 group-hover:scale-110 group-hover:bg-white"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
                {/* Media */}
                <div className="w-full h-[220px] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  {typeof card.file === "string" ? (
                    card.file.includes(".mp4") ? (
                      <video
                        src={card.file}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={card.file}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : card.file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(card.file)}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(card.file)}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal for Add Training Document */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 transition-all duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
            onClick={() => setShowModal(false)}
          />
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-100 p-8 rounded-2xl shadow-2xl w-[95vw] max-w-md relative z-10 animate-fadeInUp border border-blue-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded-full shadow"
            >
              <IoMdClose size={22} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center flex items-center gap-2 justify-center">
              <FaBookOpen className="text-blue-600" /> Add Project Document
            </h2>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-5"
            >
              {/* Title Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full border-2 border-gray-200 rounded-lg p-2 focus:outline-none focus:border-blue-400 transition"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
                {formik.errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.title}
                  </p>
                )}
              </div>

              {/* File Upload with Drag & Drop */}
              <div
                className={`relative border-2 ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200"
                } border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <FaCloudUploadAlt
                  size={40}
                  className="text-blue-400 mb-2 group-hover:scale-110 transition-transform"
                />
                <p className="text-gray-600 text-sm mb-1">
                  Drag & drop an image or video here, or{" "}
                  <span className="text-blue-600 underline">browse</span>
                </p>
                <input
                  type="file"
                  name="imageOrVideo"
                  accept="image/*, video/*"
                  className="absolute inset-0 opacity-0 cursor-pointer hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <div className="mt-3 w-full flex flex-col items-center">
                    {selectedFile.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-32 h-24 object-contain rounded-md border"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(selectedFile)}
                        className="w-32 h-24 object-contain rounded-md border"
                        controls
                      />
                    )}
                    <span className="text-xs text-gray-500 mt-1">
                      {selectedFile.name}
                    </span>
                  </div>
                )}
                {formik.errors.imageOrVideo && (
                  <p className="text-red-500 text-xs mt-2">
                    {formik.errors.imageOrVideo}
                  </p>
                )}
              </div>

              {/* Submit & Cancel */}
              <div className="flex justify-between gap-2 mt-2">
                <Button
                  variant={3}
                  type="button"
                  text="Cancel"
                  onClick={() => setShowModal(false)}
                />
                <Button variant={1} type="submit" text="Submit" />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Previewing Media */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          // onClick={() => setPreviewMedia(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl p-4 max-w-2xl w-full flex flex-col items-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded-full shadow"
              onClick={() => setPreviewMedia(null)}
            >
              <IoMdClose size={22} />
            </button>
            <h2 className="text-lg font-bold mb-4 text-center flex items-center gap-2">
              <FaBookOpen className="text-[#709EB1]" /> {previewMedia.title}
            </h2>
            {typeof previewMedia.file === "string" ? (
              previewMedia.file.includes(".mp4") ? (
                <video
                  src={previewMedia.file}
                  className="w-full max-h-[60vh] object-contain rounded-lg mb-2"
                  controls
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={previewMedia.file}
                  alt="Preview"
                  className="w-full max-h-[60vh] object-contain rounded-lg mb-2"
                />
              )
            ) : previewMedia.file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(previewMedia.file)}
                alt="Preview"
                className="w-full max-h-[60vh] object-contain rounded-lg mb-2"
              />
            ) : (
              <video
                src={URL.createObjectURL(previewMedia.file)}
                className="w-full max-h-[60vh] object-contain rounded-lg mb-2"
                controls
                autoPlay
                muted
                loop
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
