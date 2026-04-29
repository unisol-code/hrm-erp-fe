import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import SanitizedHTML from "../../../../utils/SanitizedHTML";
import Button from "../../../../components/Button";
import { FaShieldAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useEmpPolicy from "../../../../hooks/unisol/empPolicy/useEmpPolicy";
import CircularProgress from "@mui/material/CircularProgress";
import ImageWithLazyLoading from "../../../../utils/ImageWithLazyLoading";
import { IoIosClose } from "react-icons/io";
import LoaderSpinner from "../../../../components/LoaderSpinner";

const ViewPolicy = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchEmpPolicyById, empPolicyById, loading } = useEmpPolicy();
  const { theme } = useTheme();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const WORDS_PER_PAGE = 1000;

  useEffect(() => {
    fetchEmpPolicyById(id);
  }, [id]);

  const title = empPolicyById?.policyModuleTitle;
  const images = empPolicyById?.uploadFile || [];
  const docExtensions = [".pdf", ".docx", ".txt"];
  const docs = images.filter((img) =>
    docExtensions.some(
      (ext) => typeof img === "string" && img.toLowerCase().endsWith(ext)
    )
  );
  const imageMedia = images.filter(
    (img) =>
      !docExtensions.some(
        (ext) => typeof img === "string" && img.toLowerCase().endsWith(ext)
      )
  );
  const videoLinks = (empPolicyById?.videoLinks || []).filter(
    (vid) =>
      typeof vid === "string" && vid.trim().toLowerCase().endsWith(".mp4")
  );
  const grade = empPolicyById?.grade || [];
  const media = [
    ...imageMedia.map((img) => ({ type: "image", src: img })),
    ...videoLinks.map((vid) => ({ type: "video", src: vid })),
  ];
  const hasMultipleMedia = media.length > 1;

  const getDescriptionPages = (desc) => {
    if (!desc) return ["N/A"];
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

  const totalPages = getDescriptionPages(empPolicyById?.description).length;
  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

  const handlePrev = () => setCurrentPage((p) => (p > 0 ? p - 1 : p));
  const handleNext = () =>
    setCurrentPage((p) => (p < totalPages - 1 ? p + 1 : p));
  useEffect(() => {
    setCurrentPage(0);
  }, [empPolicyById]);

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

  if (loading || !empPolicyById) {

    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Policies" },
          { text: "Policy List", href: "/emp/privacypolicy" },
          { text: "View Policy" },
        ]}
      />
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold py-4 px-8 flex items-center rounded-2xl bg-white shadow-lg gap-3">
          <FaShieldAlt style={{ color: theme.primaryColor, fontSize: 32 }} />{" "}
          View Policy
        </div>
        <section className="bg-white px-6 py-6 rounded-2xl w-full shadow-lg">
          <div className="w-full h-[60px] flex items-center gap-3 px-4 mb-6">
            <FaShieldAlt className="text-blue-600 text-xl" />
            <h2 className="font-bold text-xl text-gray-700">Policy Details</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <CircularProgress />
                <p className="text-gray-600 font-medium">
                  Loading policy details...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-8 w-full">
                <div className="flex flex-col items-center md:w-2/5 w-full">
                  <div
                    className="bg-gray-100 rounded-2xl shadow-xl p-4 flex flex-col items-stretch w-full h-[300px] transition-all duration-200 cursor-pointer group hover:scale-105 hover:shadow-2xl relative"
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div className="bg-white rounded-lg shadow-2xl p-4 max-w-2xl w-full flex flex-col items-center relative">
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
                <div className="flex-1 flex flex-col gap-6 mt-6 md:mt-0">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="flex items-center gap-2 mt-8">
                      <label className="block w-32 text-gray-600 font-medium text-lg">
                        Title:
                      </label>
                      {title ? (
                        <span className="text-gray-800 font-semibold text-lg">
                          {title}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="block w-32 text-gray-600 font-medium text-lg">
                        Grade:
                      </label>
                      {grade &&
                      (Array.isArray(grade) ? grade.length > 0 : grade) ? (
                        <span className="text-gray-800 font-semibold text-lg">
                          {Array.isArray(grade) ? grade.join(" | ") : grade}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                    {docs.length > 0 && (
                      <div className="flex items-start gap-2 mt-2">
                        <label className="block w-32 text-gray-600 font-medium text-lg">
                          Docs:
                        </label>
                        <div className="flex flex-col gap-1">
                          {docs.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline break-all hover:text-blue-800"
                            >
                              {doc.split("/").pop()}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-gray-600 font-medium mb-1 text-lg">
                  Content:
                </label>
                <div className="prose max-w-none px-4 py-3 bg-gray-50 border border-gray-400 rounded-xl min-h-[120px] ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 font-serif text-[1.08rem] leading-relaxed">
                  {empPolicyById ? (
                    (() => {
                      const descPages = getDescriptionPages(
                        empPolicyById.description
                      );
                      const totalPages = descPages.length;
                      return (
                        <>
                          <SanitizedHTML
                            html={descPages[currentPage] || "N/A"}
                          />
                          {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-4">
                              <Button
                                text="Previous"
                                onClick={() =>
                                  setCurrentPage((p) => Math.max(0, p - 1))
                                }
                                variant={2}
                                type="button"
                                disabled={currentPage === 0}
                              />
                              <span className="text-gray-600 font-medium">
                                Page {currentPage + 1} / {totalPages}
                              </span>
                              <Button
                                text="Next"
                                onClick={() =>
                                  setCurrentPage((p) =>
                                    Math.min(totalPages - 1, p + 1)
                                  )
                                }
                                variant={2}
                                type="button"
                                disabled={currentPage === totalPages - 1}
                              />
                            </div>
                          )}
                        </>
                      );
                    })()
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-center items-center pt-8">
            <Button
              text="Cancel"
              variant={3}
              type="button"
              onClick={() => navigate(`/emp/privacypolicy`)}
              className="px-8 py-2 rounded-lg font-semibold text-lg shadow hover:scale-105 transition-transform duration-200 hover:text-white"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewPolicy;
