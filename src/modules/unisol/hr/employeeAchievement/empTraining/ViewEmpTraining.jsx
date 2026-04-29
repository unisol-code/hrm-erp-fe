import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useEmpTraining from "../../../../../hooks/unisol/empTraining/useEmpTraining";
import Breadcrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { FaBookOpen } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import useEmpAchievement from "../../../../../hooks/unisol/empAchievement/useEmpAchievement";

const ViewEmpTraining = () => {
  const { id } = useParams();
  // const { trainingList, fetchTrainingList } = useEmpTraining(id); // Assuming the hook can take an ID
  const { viewEmpTrainingList, fetchEmployeeTrainingListById } =
    useEmpAchievement();
  const [cards, setCards] = useState([]);
  const [previewMedia, setPreviewMedia] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchEmployeeTrainingListById(id);
  }, []);

  useEffect(() => {
    setCards(
      viewEmpTrainingList?.data?.map((item) => ({
        id: item._id,
        title: item.title,
        file: item.imageOrVideo,
      }))
    );
  }, [viewEmpTrainingList]);

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          {
            text: "Employee Achievement",
            href: "/hr/employeeAchievement",
          },
          {
            text: "Employee's Project List",
            href: "/hr/employeeAchievement/empTrainingList",
          },
          { text: "View Project" },
        ]}
      />
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="text-2xl font-bold py-4 px-8 flex items-center rounded-2xl bg-white shadow-lg gap-3">
          <FaBookOpen style={{ color: theme.primaryColor, fontSize: 32 }} />{" "}
          Employee's Project Overview
        </div>
        <section className="bg-white px-6 py-6 rounded-2xl w-full shadow-lg">
          <div className="flex w-full justify-between items-center mb-6 flex-col md:flex-row gap-4 md:gap-0">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FaBookOpen className="text-[#709EB1]" /> View Project Documents
            </h1>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 w-full justify-items-stretch">
            {cards?.length === 0 && (
              <div className="col-span-full text-center text-gray-500 text-lg py-8">
                No training documents found for this employee.
              </div>
            )}
            {cards?.map((card) => (
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
                  ) : card.file?.type?.startsWith("image/") ? (
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

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 flex justify-center items-center z-50 transition-all duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
            onClick={() => setPreviewMedia(null)}
          />
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-100 p-8 rounded-2xl shadow-2xl w-[95vw] max-w-2xl relative z-10 animate-fadeInUp border border-blue-100">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded-full shadow"
            >
              <IoMdClose size={22} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center flex items-center gap-2 justify-center">
              <FaBookOpen className="text-blue-600" /> {previewMedia.title}
            </h2>
            <div className="w-full h-auto max-h-[70vh] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              {typeof previewMedia.file === "string" ? (
                previewMedia.file.includes(".mp4") ? (
                  <video
                    src={previewMedia.file}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={previewMedia.file}
                    alt="Uploaded preview"
                    className="w-full h-full object-contain"
                  />
                )
              ) : previewMedia.file?.type?.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(previewMedia.file)}
                  alt="Uploaded preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={URL.createObjectURL(previewMedia.file)}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmpTraining;
