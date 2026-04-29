import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import useEmpAchievement from "../../../../hooks/unisol/empAchievement/useEmpAchievement";
import { useTheme } from "../../../../hooks/theme/useTheme";
import SanitizedHTML from "../../../../utils/SanitizedHTML";
import BreadCrumb from "../../../../components/BreadCrumb";
import { GoStar } from "react-icons/go";
import { EmojiEvents } from "@mui/icons-material";
import Button from "../../../../components/Button";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import DummyFile from "../../../../assets/images/DummyFile.jpg";
import { FiDownload } from "react-icons/fi";

const RewardProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [previewOpen, setPreviewOpen] = useState(false);
  const { loading, viewRewardProgram, fetchRewardProgramById } =
    useEmpAchievement();

  useEffect(() => {
    fetchRewardProgramById(id);
  }, [id]);

  const program = viewRewardProgram?.program;

  if (!program) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h6" color="error">
          Program not found
        </Typography>
      </Container>
    );
  }

  const handleDownload = async (url) => {
    try {
      // force Cloudinary to send as attachment
      const forcedUrl = url.replace("/upload/", "/upload/fl_attachment/");

      const response = await fetch(forcedUrl);
      const blob = await response.blob();

      const urlParts = forcedUrl.split("/");
      const rawFileName = urlParts[urlParts.length - 1];
      const fileName = decodeURIComponent(rawFileName);

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <BreadCrumb
        linkText={[
          { text: " Reward Program", href: "/emp/rewardprogram" },
          { text: "View Reward Program " },
        ]}
      />

      <div className="relative py-4 px-8 flex flex-col md:flex-row md:items-center rounded-2xl bg-white shadow-lg gap-3 mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <GoStar style={{ color: theme.primaryColor, fontSize: 32 }} />
          <span className="text-2xl font-bold">View Reward Program </span>
        </div>
      </div>
      {loading ? (
        <div className=" absolute top-[45%] left-[55%] flex justify-center">
          <LoaderSpinner />
        </div>
      ) : (
        <div>
          <section className="bg-white px-6 py-6 rounded-2xl w-full shadow-lg">
            {/* Header */}
            <div className="w-full h-[60px] flex items-center gap-3 px-4 mb-6">
              <EmojiEvents className="text-yellow-500 text-xl" />
              <h2 className="font-bold text-xl text-gray-700">
                {program.rewardProgramTitle || "Untitled Program"}
              </h2>
            </div>

            {/* Content Section */}
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Uploaded Files & Preview */}
              <div className="flex flex-col items-center md:w-2/5 w-full">
                <div className="bg-gray-100 rounded-2xl shadow-xl p-4 flex flex-col items-stretch w-full h-[300px] transition-all duration-200 cursor-pointer group hover:scale-105 hover:shadow-2xl relative">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center relative group">
                    {program.uploadFile?.length > 0 ? (
                      <FiDownload
                        style={{
                          color: theme.primaryColor,
                          fontSize: 100,
                          cursor: "pointer",
                        }}
                        onClick={() => handleDownload(program.uploadFile[0])}
                      />
                    ) : (
                      <span className="text-gray-400">No file uploaded</span>
                    )}
                  </div>
                  <label className="block text-gray-600 font-medium mt-2 text-lg text-center">
                    Download File{program.uploadFile?.length > 1 ? "s" : ""}
                  </label>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col gap-6 mt-6 md:mt-0">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Payroll Grade */}
                  <div className="flex items-cex  nter gap-2 mt-2">
                    <label className="block w-32 text-gray-600 font-medium text-lg">
                      Payroll Grade:
                    </label>
                    {program.grade?.length > 0 ? (
                      <span className="text-gray-800 font-semibold text-lg">
                        {program.grade.join(" | ")}
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="flex items-start gap-2 mt-2">
                    <label className="block w-32 text-gray-600 font-medium text-lg">
                      Description:
                    </label>
                    <div className="flex-1 text-gray-700 leading-relaxed">
                      {program.description === "<p><br></p>" ? (
                        <span className="text-gray-400">N/A</span>
                      ) : (
                        <SanitizedHTML html={program.description || "N/A"} />
                      )}
                    </div>
                  </div>

                  {/* Video Links */}
                  {program.videoLinks?.length > 0 ? (
                    <div className="flex items-start gap-2 mt-2">
                      <label className="block w-32 text-gray-600 font-medium text-lg">
                        Video Links:
                      </label>
                      <div className="flex flex-col gap-1">
                        {program.videoLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-all hover:text-blue-800"
                          >
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <label className="block w-32 text-gray-600 font-medium text-lg">
                      Video Links: N/A
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="flex justify-center items-center pt-8">
              <Button
                text="Cancle"
                onClick={() => navigate("/emp/rewardprogram")}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default RewardProgramDetails;
//
