import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/BreadCrumb"; // ✅ This is correct one
import useModuleCategory from "../../../../../hooks/moduleCategory/useModuleCategory";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import SanitizedHTML from "../../../../../utils/SanitizedHTML";
import LoaderSpinner from "../../../../../components/LoaderSpinner";

export default function ViewModuleCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, fetchModuleCategoryDetails, moduleCategoryDetails } =
    useModuleCategory();

  useEffect(() => {
    if (id) {
      fetchModuleCategoryDetails(id);
    }
  }, [id]);

  console.log(moduleCategoryDetails);

  const { theme } = useTheme();
  if (loading || !moduleCategoryDetails) {
       return(
        <div className="flex justify-center items-center h-screen bg-white">
          <LoaderSpinner />
        </div>
       )  
      } 
  return (
    <div>
      <Breadcrumb
        linkText={[
          { text: "Training Management"},
          { text: "Training Module List", href: "/moduleCategory" },
          { text: "View Training Module" },
        ]}
      />
      <div className="mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div
          className="bg-gradient-to-r text-black text-lg font-semibold px-6 py-3 rounded-t-xl mb-6"
          style={{ backgroundColor: theme.highlightColor }}
        >
          View Training Module
        </div>

        <div className="space-y-6">
          <div className="flex items-center">
            <label htmlFor="" className="font-normal block my-1">
              Payroll Grade:
            </label>
            <div className="w-[60%] px-4 py-2 font-medium">
              {moduleCategoryDetails?.module?.grade?.join(",") || "N/A"}
            </div>
          </div>

          <div className="flex items-center">
            <label className="block font-medium text-gray-700 ">
              Training Module:
            </label>
            <div className="w-[60%] px-4 py-2 font-medium">
              {moduleCategoryDetails?.module?.trainingModuleTitle || "N/A"}
            </div>
          </div>

         {moduleCategoryDetails?.module?.uploadFile &&
            moduleCategoryDetails.module.uploadFile.length > 0 && (
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Upload File:
                </label>
                <div className="mt-2 flex flex-wrap gap-4">
                  {(Array.isArray(moduleCategoryDetails.module.uploadFile)
                    ? moduleCategoryDetails.module.uploadFile
                    : [moduleCategoryDetails.module.uploadFile]
                  ).map((fileUrl, index) => {
                    const extension = fileUrl.split('.').pop().toLowerCase();
                    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
                    const isPDF = extension === 'pdf';
                    const isDoc = ['doc', 'docx'].includes(extension);

                    return (
                      <div key={index} className="flex flex-col items-center gap-2">
                        {isImage ? (
                          <img src={fileUrl} alt={`file-${index}`} width="200" />
                        ) : isPDF ? (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            📄 View PDF
                          </a>
                        ) : isDoc ? (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            📄 View Document
                          </a>
                        ) : (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            📎 Download File
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}



          {moduleCategoryDetails?.module?.videoLinks?.length > 0 && (
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Links:
              </label>
              <div className="space-y-2 pl-2">
                {moduleCategoryDetails?.module?.videoLinks?.map(
                  (link, index) => (
                    <div key={index} className="flex">
                      <div className="me-5">{index + 1}</div>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {link}
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Description:
            </label>
            <div className="w-full px-4 py-2 font-semibold">
              {moduleCategoryDetails?.module?.description === "<p><br></p>" ? (
                "N/A"
              ) : (
                <SanitizedHTML
                  html={moduleCategoryDetails?.module?.description || "N/A"}
                />
              )}{" "}
            </div>
          </div>

          <div className="flex justify-end gap-8 pt-10">
            <button
              type="submit"
              style={{ backgroundColor: theme.primaryColor }}
              className="px-10 py-2 bg-[#99a7ff] text-white font-normal rounded-md hover:bg-blue-200 transition"
              onClick={() =>
                navigate(
                  `/moduleCategory/edit/${moduleCategoryDetails?.module?._id}`
                )
              }
            >
              {loading ? "Loading..." : "Edit Category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
