import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import Button from "../../../../../components/Button";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../../components/LoaderSpinner";
import useWelcomeKit from "../../../../../hooks/unisol/onboarding/useWelcomekit";


const ViewWelcomeKit = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  // const [loading, setLoading] = useState(false);
  // const [welcomeKitData, setWelcomeKitData] = useState(null);
  const {
    loading,
    welcomeKitDetails,
    fetchWelcomeKitById,
  } = useWelcomeKit();


  useEffect(() => {
    if (id) {
      fetchWelcomeKitById(id);
    }
  }, [id]);


  const handleEdit = () => {
    navigate(`/onboardingmanegement/welcomeKit/addEditWelcomeKit/${id}`);
  };

  const handleCancel = () => {
    navigate("/onboardingmanegment/welcomeKit");
  };
  const [previewImage, setPreviewImage] = useState(null);


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
          { text: "View Welcome Kit" },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg">
        <div
          className="text-black text-lg font-semibold px-8 py-4 rounded-t-2xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          View Welcome Kit
        </div>

        <div className="space-y-4 p-4">
          {/* Photos Display */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Photos
            </label>
            {welcomeKitDetails?.data
              ?.photos && welcomeKitDetails?.data
                .photos.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-4">
                {welcomeKitDetails?.data
                  .photos.map((photo, index) => (
                    <div
                      key={index}
                      className="w-[200px] border-2 border-gray-300 rounded-lg p-2"
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-[150px] object-cover rounded cursor-pointer hover:opacity-90"
                        onClick={() => setPreviewImage(photo)}
                      />

                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No photos available</div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-700">
              {welcomeKitDetails?.data
                ?.name || "N/A"}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 min-h-[100px]">
              {welcomeKitDetails?.data
                ?.description || "N/A"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-8 pt-6">
            <button
              type="button"
              style={{
                color: theme.primaryColor,
                borderColor: theme.primaryColor,
              }}
              className="px-10 py-2 bg-white font-normal rounded-md border-2 hover:bg-gray-100 transition"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <Button
              type="button"
              text="Edit"
              onClick={handleEdit}
            />
          </div>
        </div>
      </div>
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
};

export default ViewWelcomeKit;