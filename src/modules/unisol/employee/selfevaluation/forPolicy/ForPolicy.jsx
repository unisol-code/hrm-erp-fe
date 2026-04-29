import React, { useEffect, useState } from "react";
import pdf from "../../../../../assets/images/pdf.png";
import { useNavigate } from "react-router-dom";
import { FiBook, FiDownload, FiCheckCircle, FiFileText } from "react-icons/fi";
import { MdDescription, MdAssignment } from "react-icons/md";
import Select from "react-select";
import { FaChevronLeft, FaChevronRight, FaShieldAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { FiLink } from "react-icons/fi";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Breadcrumb from "../../../../../components/BreadCrumb";
import useSelfEvaluation from "../../../../../hooks/unisol/selfEvaluation/useSelfEvaluation";
import ImageWithLazyLoading from "../../../../../utils/ImageWithLazyLoading";
import SanitizedHTML from "../../../../../utils/SanitizedHTML";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

const ForPolicy = () => {
  const {
    fetchForPolicyList,
    selfEvalPolicyList,
    fetchForPolicyById,
    selfEvalPolicyById,
    loading,
    resetPolicyQAPreview,
  } = useSelfEvaluation();
  const navigator = useNavigate();
  const [enableTestButton, setEnableTestButton] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { theme } = useTheme();
  const [currentDescPage, setCurrentDescPage] = useState(0);
  const WORDS_PER_PAGE = 1000;
  const [loadingPolicy, setLoadingPolicy] = useState(false);

  useEffect(() => {
    fetchForPolicyList();
  }, []);

  const uploadedFiles =
    selectedPolicy && selfEvalPolicyById
      ? selfEvalPolicyById?.uploadFile || []
      : [];

  const documents = uploadedFiles.filter(
    (file) =>
      file.toLowerCase().endsWith(".pdf") ||
      file.toLowerCase().endsWith(".docx")
  );

  const images = uploadedFiles.filter(
    (file) =>
      !file.toLowerCase().endsWith(".pdf") &&
      !file.toLowerCase().endsWith(".docx")
  );

  const title =
    selectedPolicy && selfEvalPolicyById
      ? selfEvalPolicyById?.policyModuleTitle
      : null;
  const videoLinks =
    selectedPolicy && selfEvalPolicyById
      ? (selfEvalPolicyById?.videoLinks || []).filter(
          (vid) =>
            typeof vid === "string" && vid.trim().toLowerCase().endsWith(".mp4")
        )
      : [];
  const resourceUrls =
    selectedPolicy && selfEvalPolicyById
      ? (selfEvalPolicyById?.videoLinks || []).filter(
          (vid) =>
            typeof vid === "string" &&
            !vid.trim().toLowerCase().endsWith(".mp4")
        )
      : [];
  const media = [
    ...images.map((img) => ({ type: "image", src: img })),
    ...videoLinks.map((vid) => ({ type: "video", src: vid })),
  ];
  const hasMultipleMedia = media.length > 1;

  const nextMedia = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevMedia = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  const resetMediaIndex = () => {
    setCurrentImageIndex(0);
  };

  const policyOptions = selfEvalPolicyList?.map((policy) => ({
    value: policy._id,
    label: policy.policyModuleTitle,
  }));

  const handlePolicyChange = (selectedOption) => {
    setSelectedPolicy(selectedOption);
    setCurrentImageIndex(0);
    if (selectedOption) {
      setLoadingPolicy(true);
      Promise.resolve(fetchForPolicyById(selectedOption.value)).finally(() =>
        setLoadingPolicy(false)
      );
      localStorage.setItem("selectedPolicyId", selectedOption.value);
    } else {
      localStorage.removeItem("selectedPolicyId");
    }
  };

  useEffect(() => {
    const savedPolicyId = localStorage.getItem("selectedPolicyId");
    if (savedPolicyId && selfEvalPolicyList && selfEvalPolicyList.length > 0) {
      const found = selfEvalPolicyList.find((p) => p._id === savedPolicyId);
      if (found) {
        const option = { value: found._id, label: found.policyModuleTitle };
        setSelectedPolicy(option);
        setLoadingPolicy(true);
        Promise.resolve(fetchForPolicyById(found._id)).finally(() =>
          setLoadingPolicy(false)
        );
      }
    }
  }, [selfEvalPolicyList]);

  const takeTest = (e) => {
    if (e.target.checked) {
      setEnableTestButton(true);
    } else {
      setEnableTestButton(false);
    }
  };

  const getDescriptionPages = (desc) => {
    if (!desc) return [];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = desc;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const words = text.split(/\s+/);
    if (words.length <= WORDS_PER_PAGE) return [desc];
    let pages = [];
    let start = 0;
    while (start < words.length) {
      const pageWords = words.slice(start, start + WORDS_PER_PAGE);
      pages.push(pageWords.join(" "));
      start += WORDS_PER_PAGE;
    }
    return pages;
  };

  useEffect(() => {
    setCurrentDescPage(0);
  }, [selectedPolicy]);

  if (loading || !selfEvalPolicyList) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[{ text: "Self Evaluation" }, { text: "For Policy" }]}
      />

      {/* Header Section */}
      <div className="relative mb-4 flex items-center gap-4 rounded-2xl border-b bg-white px-8 py-3 shadow-md">
        <span className="rounded-full bg-white p-3 shadow-md">
          <FiBook style={{ color: theme.primaryColor, fontSize: 20 }} />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Self Evaluation</h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white pb-8 shadow-md">
        {/* Info Box */}
        <div className="px-8 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <MdAssignment className="text-[#709EB1] text-xl" />
            <span className="text-xl font-bold text-gray-800">
              Policy Study Plan
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Complete your policy training and assessment.
          </p>
        </div>

        <div className="px-8">
          <div className="flex flex-col space-y-6">
            {/* Policy Selection */}
            <div className="space-y-2">
              <Select
                className="w-full mt-4"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "40px",
                    borderRadius: "0.75rem",
                    borderColor: state.isFocused ? "#318bb1" : "#d1d5db",
                    boxShadow: state.isFocused
                      ? "0 0 0 2px #b3d8ee"
                      : "0 1px 2px 0 rgba(0,0,0,0.03)",
                    backgroundColor: state.isFocused ? "#fff" : "#f9fafb",
                    transition: "all 0.2s",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#b3d8ee" : "#fff",
                    color: "#2d3a4a",
                  }),
                }}
                options={policyOptions}
                value={selectedPolicy}
                onChange={handlePolicyChange}
                isClearable
                placeholder="Choose a policy to study"
              />
            </div>

            {/* Loading Spinner */}
            {loadingPolicy ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <CircularProgress />
                  <span className="text-gray-600">
                    Loading policy details...
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* Study Material Card */}
                {selectedPolicy && selfEvalPolicyById && (
                  <div
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    style={{
                      background: `linear-gradient(90deg, #f5f9fc 0%, ${theme.highlightColor} 100%)`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <FiFileText className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Study Material
                          </h3>
                          <p className="text-sm text-gray-600">
                            Policy guidelines and procedures
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      {documents.length > 0 ? (
                        documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3 mb-3"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={pdf}
                                alt="document icon"
                                className="w-8 h-8"
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {doc.split("/").pop()}
                                </p>
                              </div>
                            </div>
                            <a
                              href={doc}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <FiDownload className="text-gray-600" />
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No study materials available.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex flex-col md:flex-row gap-8 w-full">
                  {selectedPolicy && selfEvalPolicyById && (
                    <div className="flex flex-col items-center md:w-2/5 w-full md:ml-8">
                      <div
                        className="bg-gray-100 rounded-2xl shadow-xl p-4 flex flex-col items-stretch w-full max-w-[600px] h-[320px] transition-all duration-200 cursor-pointer group hover:scale-105 hover:shadow-2xl relative animate-fade-in-up"
                        onClick={() => setPreviewOpen(true)}
                      >
                        <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center relative group">
                          {media.length > 0 ? (
                            <>
                              {media[currentImageIndex].type === "image" ? (
                                <ImageWithLazyLoading
                                  src={media[currentImageIndex].src}
                                  alt={`Policy image or video ${
                                    currentImageIndex + 1
                                  }`}
                                  index={currentImageIndex}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={media[currentImageIndex].src}
                                  controls
                                  className="w-full h-full object-cover rounded-lg bg-black"
                                >
                                  Your browser does not support the video tag.
                                </video>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (hasMultipleMedia) prevMedia();
                                }}
                                disabled={!hasMultipleMedia}
                                className={`absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 shadow-lg transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 ${
                                  hasMultipleMedia
                                    ? "bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 hover:scale-110 cursor-pointer"
                                    : "bg-gray-300/50 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <FaChevronLeft size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (hasMultipleMedia) nextMedia();
                                }}
                                disabled={!hasMultipleMedia}
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 shadow-lg transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 ${
                                  hasMultipleMedia
                                    ? "bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 hover:scale-110 cursor-pointer"
                                    : "bg-gray-300/50 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <FaChevronRight size={16} />
                              </button>
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {currentImageIndex + 1} / {media.length}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400">
                              No file or video uploaded
                            </span>
                          )}
                        </div>
                        <label className="block text-gray-600 font-medium mt-2 text-lg text-center">
                          Uploaded File{hasMultipleMedia ? "s / Videos" : ""}
                        </label>
                      </div>
                      {previewOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in-up">
                          <div className="bg-white rounded-lg shadow-2xl p-4 max-w-3xl w-full flex flex-col items-center relative">
                            <button
                              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-full shadow"
                              onClick={() => {
                                setPreviewOpen(false);
                                resetMediaIndex();
                              }}
                            >
                              <IoIosClose size={20} />
                            </button>
                            <h2 className="text-lg font-bold mb-4 text-center flex items-center gap-2">
                              <FaShieldAlt className="text-blue-600" /> {title}
                            </h2>
                            {media.length > 0 ? (
                              <div className="relative w-full group">
                                {media[currentImageIndex].type === "image" ? (
                                  <ImageWithLazyLoading
                                    src={media[currentImageIndex].src}
                                    alt={`Preview ${currentImageIndex + 1}`}
                                    index={currentImageIndex}
                                    className="w-full max-h-[60vh] object-contain rounded-lg mb-2"
                                  />
                                ) : (
                                  <video
                                    src={media[currentImageIndex].src}
                                    controls
                                    className="w-full max-h-[60vh] object-contain rounded-lg mb-2 bg-black"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                                <button
                                  onClick={() => {
                                    if (hasMultipleMedia) prevMedia();
                                  }}
                                  disabled={!hasMultipleMedia}
                                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                                    hasMultipleMedia
                                      ? "bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 hover:scale-110 cursor-pointer"
                                      : "bg-gray-300/50 text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  <FaChevronLeft size={20} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (hasMultipleMedia) nextMedia();
                                  }}
                                  disabled={!hasMultipleMedia}
                                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                                    hasMultipleMedia
                                      ? "bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 hover:scale-110 cursor-pointer"
                                      : "bg-gray-300/50 text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  <FaChevronRight size={20} />
                                </button>
                                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  {currentImageIndex + 1} / {media.length}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">
                                No file or video uploaded
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1 flex flex-col gap-2 mt-6 px-6">
                    {selectedPolicy && title && (
                      <div className="flex items-center gap-2 mt-10">
                        <label className="block w-30 text-gray-600 font-medium text-lg">
                          Title:
                        </label>
                        <span className="text-gray-800 font-semibold text-lg">
                          {title}
                        </span>
                      </div>
                    )}
                    {selectedPolicy && resourceUrls.length > 0 && (
                      <div className="mt-2">
                        <div className="text-gray-600 font-semibold mb-1">
                          <FiLink className="inline mr-2" /> Resources:
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                          {resourceUrls.map((url, idx) => (
                            <li key={idx}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline break-all"
                              >
                                {url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Section */}
                {selectedPolicy && selfEvalPolicyById && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <MdDescription className="text-blue-600 text-xl" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Policy Description
                      </h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      {selfEvalPolicyById?.description ? (
                        (() => {
                          const descPages = getDescriptionPages(
                            selfEvalPolicyById.description
                          );
                          const totalPages = descPages.length;
                          return (
                            <>
                              <SanitizedHTML
                                html={descPages[currentDescPage]}
                                className="text-gray-700 leading-relaxed"
                              />
                              {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-4">
                                  <button
                                    className={`px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                    onClick={() =>
                                      setCurrentDescPage((p) =>
                                        Math.max(0, p - 1)
                                      )
                                    }
                                    disabled={currentDescPage === 0}
                                  >
                                    Previous
                                  </button>
                                  <span className="text-sm text-gray-500">
                                    Page {currentDescPage + 1} of {totalPages}
                                  </span>
                                  <button
                                    className={`px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                    onClick={() =>
                                      setCurrentDescPage((p) =>
                                        Math.min(totalPages - 1, p + 1)
                                      )
                                    }
                                    disabled={
                                      currentDescPage === totalPages - 1
                                    }
                                  >
                                    Next
                                  </button>
                                </div>
                              )}
                            </>
                          );
                        })()
                      ) : (
                        <p className="text-gray-700 leading-relaxed">
                          No description available.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Confirmation Checkbox */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <label className="inline-flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 mt-1 accent-green-600 rounded focus:ring-2 focus:ring-green-500"
                        onChange={(e) => takeTest(e)}
                      />
                    </label>
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-800 mb-1">
                        Ready for Assessment
                      </p>
                      <p className="text-sm text-gray-600">
                        I have thoroughly read and understood this policy
                        chapter and am ready to take the test.
                      </p>
                    </div>
                    {enableTestButton && (
                      <div className="flex items-center gap-2 text-green-600">
                        <FiCheckCircle className="text-xl" />
                        <span className="text-sm font-medium">Ready</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-12 w-full flex justify-center">
            <button
              disabled={!enableTestButton || !selectedPolicy}
              className={`${
                enableTestButton && selectedPolicy
                  ? "cursor-pointer shadow-lg hover:shadow-xl hover:scale-105"
                  : "cursor-not-allowed opacity-50"
              } rounded-xl px-12 py-4 font-semibold text-lg text-white transition-all duration-300 flex items-center gap-3`}
              style={{ backgroundColor: theme.primaryColor }}
              onClick={() => {
                resetPolicyQAPreview();
                navigator("/emp/selfevaluation/policy/taketest", {
                  state: { policyId: selectedPolicy?.value },
                });
              }}
            >
              <FiBook className="text-xl" />
              Take Assessment
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <div className="text-xs text-gray-500">
              <p className="mb-1">
                Complete the assessment to demonstrate your understanding of the
                policy.
              </p>
              <p>Need help? Contact your HR representative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s ease; }
        .animate-fade-in-slow { animation: fadeIn 1.2s ease; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(.39,.575,.565,1) both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translate3d(0, 40px, 0); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

export default ForPolicy;
