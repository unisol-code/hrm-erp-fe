import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import Select from "react-select"; // ✅ This is correct one
import usePoliciesCategory from "../../../../../hooks/policiesCatagory/usePoliciesCatagory";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import JoditEditor from "jodit-react";
import SanitizedHTML from "../../../../../utils/SanitizedHTML";
import Button from "../../../../../components/Button";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import { IoArrowBackSharp } from "react-icons/io5";

export default function ViewPoliciesCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, fetchPoliciesCategoryDetails, PoliciesCategoryDetails } =
    usePoliciesCategory();

  useEffect(() => {
    if (id) {
      fetchPoliciesCategoryDetails(id);
    }
  }, [id]);

  console.log(PoliciesCategoryDetails);

  console.log(PoliciesCategoryDetails);

  const { theme } = useTheme();
  if (loading || !PoliciesCategoryDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Training Management" },
          { text: "Policies List", href: "/PoliciesCategory" },
          { text: "View Policy" },
        ]}
      />
      <div className="bg-white rounded-2xl shadow-lg">
        <div
          className="bg-gradient-to-r text-black text-lg font-semibold px-6 py-3 rounded-t-xl mb-6"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="flex items-center gap-2">
            <IoArrowBackSharp
              size={25}
              className="cursor-pointer"
              onClick={() => navigate("/policiesCategory")}
            />
            View Policy
          </div>
        </div>

        <div className="space-y-6 px-4 py-2">
          <div className="flex items-center">
            <label htmlFor="" className="font-normal block my-1">
              Payroll Grade:
            </label>
            <div className="w-[60%] px-4 py-2 font-medium">
              {PoliciesCategoryDetails?.module?.grade?.join(",") || "N/A"}
            </div>
          </div>

          <div className="flex items-center">
            <label className="block font-medium text-gray-700 ">Title:</label>
            <div className="w-[60%] px-4 py-2 font-medium">
              {PoliciesCategoryDetails?.module?.policyModuleTitle || "N/A"}
            </div>
          </div>

          {PoliciesCategoryDetails?.module?.uploadFile &&
            PoliciesCategoryDetails.module.uploadFile.length > 0 && (
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Upload File:
                </label>
                <div className="mt-2 flex flex-wrap gap-4">
                  {(Array.isArray(PoliciesCategoryDetails.module.uploadFile)
                    ? PoliciesCategoryDetails.module.uploadFile
                    : [PoliciesCategoryDetails.module.uploadFile]
                  ).map((fileUrl, index) => {
                    const extension = fileUrl.split(".").pop().toLowerCase();
                    const isImage = ["jpg", "jpeg", "png", "gif"].includes(
                      extension
                    );
                    const isPDF = extension === "pdf";
                    const isDoc = ["doc", "docx"].includes(extension);

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2"
                      >
                        {isImage ? (
                          <img
                            src={fileUrl}
                            alt={`file-${index}`}
                            width="200"
                          />
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

          {PoliciesCategoryDetails?.module?.videoLinks?.length > 0 && (
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Links:
              </label>
              <div className="space-y-2 pl-2">
                {PoliciesCategoryDetails?.module?.videoLinks?.map(
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
              {PoliciesCategoryDetails?.module?.description ===
              "<p><br></p>" ? (
                "N/A"
              ) : (
                <SanitizedHTML
                  html={PoliciesCategoryDetails?.module?.description || "N/A"}
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
                  `/PoliciesCategory/edit/${PoliciesCategoryDetails?.module?._id}`
                )
              }
            >
              {loading ? "Loading..." : "Edit Policy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
