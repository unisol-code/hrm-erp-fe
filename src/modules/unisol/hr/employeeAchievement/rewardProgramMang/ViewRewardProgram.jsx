import React from "react";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import useEmpAchievement from "../../../../../hooks/unisol/empAchievement/useEmpAchievement";
import SanitizedHTML from "../../../../../utils/SanitizedHTML";

const ViewRewardProgram = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, viewRewardProgram, fetchRewardProgramById } =
    useEmpAchievement();
  React.useEffect(() => {
    fetchRewardProgramById(id);
  }, []);
  return (
    <div className="min-h-screen">
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
          {
            text: " View Reward Program ",
          },
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
              onClick={() =>
                navigate(
                  "/hr/employeeAchievement/employeeRewards/rewardProgramList"
                )
              }
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
              {viewRewardProgram?.program?.grade?.join(", ") || "N/A"}
            </div>
          </div>
          <div className="flex items-center">
            <label className="block font-medium text-gray-700 ">Title:</label>
            <div className="w-[60%] px-4 py-2 font-medium">
              {viewRewardProgram?.program?.rewardProgramTitle || "N/A"}
            </div>
          </div>
          {viewRewardProgram?.program?.uploadFile &&
            viewRewardProgram.program.uploadFile.length > 0 && (
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Upload File:
                </label>
                <div className="mt-2 flex flex-wrap gap-4">
                  {(Array.isArray(viewRewardProgram.program.uploadFile)
                    ? viewRewardProgram.program.uploadFile
                    : [viewRewardProgram.program.uploadFile]
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
          {viewRewardProgram?.program?.videoLinks?.length > 0 && (
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Links:
              </label>
              <div className="space-y-2 pl-2">
                {viewRewardProgram?.program?.videoLinks?.map((link, index) => (
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
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Description:
            </label>
            <div className="w-full px-4 py-2 font-semibold">
              {viewRewardProgram?.program?.description === "<p><br></p>" ? (
                "N/A"
              ) : (
                <SanitizedHTML
                  html={viewRewardProgram?.program?.description || "N/A"}
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
                  `/hr/employeeAchievement/employeeRewards/editRewardProgram/${viewRewardProgram?.program?._id}`
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
};

export default ViewRewardProgram;
