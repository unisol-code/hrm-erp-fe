import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocumentDetails from "../../../components/Dialogs/DocumentDetails";
import ViewUploadedDialog from "../../../components/Dialogs/ViewUploadedDialog";
import useEmployee from "../../../hooks/unisol/onboarding/useEmployee";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DescriptionIcon from "@mui/icons-material/Description";
import useEmployeeDoc from "../../../hooks/unisol/onboarding/useEmployeeDoc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTheme } from "../../../hooks/theme/useTheme";
import Breadcrumb from "../../../components/BreadCrumb";
import LoaderSpinner from "../../../components/LoaderSpinner";
import { ArrowLeft } from 'lucide-react';
import user from '../../../assets/images/user.png'
import Button from "../../../components/Button";
const Profile = () => {
  const [openUploadDocumentDialog, setOpenUploadDocumentDialog] =
    useState(false);
  const { id } = useParams();
  console.log("ID", id);
  const { fetchEmployeeByID, employeeDetails, loading: employeeLoading } = useEmployee();
  const { fetchDocsByEmpID, resetEmpDoc, docsByEmpID, loading } =
    useEmployeeDoc();
  const navigate = useNavigate();
  const [viewDocumentDialog, setViewDocumentDialog] = useState(false);
  useEffect(() => {
    fetchEmployeeByID(id);
  }, []);
  const handleDialogueDetails = () => {
    setViewDocumentDialog(true);
    fetchDocsByEmpID(id);
  };

  const handleUploadDocument = () => {
    setOpenUploadDocumentDialog(true);
    fetchDocsByEmpID(id);
  };
  console.log("employeeDetails", employeeDetails);
  console.log("docsByEmpID", docsByEmpID);

  const { theme } = useTheme();
  return (
    <div className="min-h-screen">
      <Breadcrumb
        linkText={[
          { text: "Onboarding Management"},
          { text: "Candidate Profile", href: "/candidateProfile" },
          { text: "View Candidate Details"},
        ]}
      />
      <div className="box-border w-full rounded-xl shadow-md bg-white pb-4">
        <div className="w-full flex flex-col rounded-2xl gap-5">
          <div
            className="flex w-full rounded-t-xl box-border justify-center items-center px-8 py-4 gap-4"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <ArrowLeft size={30} className="cursor-pointer" onClick={() => navigate('/candidateProfile')} />
            <h2 className="text-[#252C58] text-xl whitespace-nowrap text-left w-full">
              Candidate Profile
            </h2>
          </div>

          {
            loading || employeeLoading ? (
              <div className="w-full flex items-center justify-center">
                <LoaderSpinner />
              </div>) : (
              <div className="flex flex-col items-center gap-6">
                {/* Responsive section */}
                <div className="w-full flex flex-col lg:flex-row gap-6">
                  {/* Left section */}
                  <div className="w-full lg:w-3/5 flex flex-col md:flex-row items-center justify-evenly gap-4">
                    <img
                      className="w-[140px] h-[140px] object-cover rounded-full shadow-md border-4 border-gray-200"
                      src={employeeDetails?.photo || user}
                      alt="Profile"
                    />
                    <div className="text-center space-y-3">
                      <h2 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                        {employeeDetails?.fullName}
                      </h2>
                      <h3 className="text-xl font-semibold" style={{ color: theme.primaryColor }}>
                        {employeeDetails?.designation}
                      </h3>
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="w-full lg:w-2/5 flex flex-col items-center justify-center gap-6 py-6">
                    {/* <button
                      type="button"
                      className="py-2 px-4 rounded-md text-black flex items-center gap-2"
                      style={{ backgroundColor: theme.secondaryColor }}
                      onClick={handleDialogueDetails}
                    >
                      <DescriptionIcon />
                      {employeeDetails?.fullName} Cv.pdf
                      <CloudDownloadIcon />
                    </button>

                    {viewDocumentDialog && docsByEmpID && (
                      <DocumentDetails
                        openDialog={viewDocumentDialog}
                        closeDialog={() => setViewDocumentDialog(false)}
                        data={uploadData}
                      />
                    )} */}
                    <Button variant={1} text="View Uploaded Documents" onClick={handleUploadDocument} />

                    {openUploadDocumentDialog && docsByEmpID && (
                      <ViewUploadedDialog
                        openDialog={openUploadDocumentDialog}
                        closeDialog={() => {
                          resetEmpDoc();
                          setOpenUploadDocumentDialog(false);
                        }}
                        docsByEmpID={docsByEmpID}
                      />
                    )}
                  </div>
                </div>

                {/* Details section */}
                <div className="w-full flex flex-col gap-4 font-normal text-gray-800 bg-white p-6 border-t border-gray-300">
                  <h2 className="text-lg md:text-xl">
                    <span className="font-semibold text-gray-600">Employee ID:</span>{" "}
                    {employeeDetails?.employeeId}
                  </h2>
                  <h2 className="text-lg md:text-xl">
                    <span className="font-semibold text-gray-600">Phone No:</span>{" "}
                    {employeeDetails?.phoneNumber}
                  </h2>
                  <h2 className="text-lg md:text-xl">
                    <span className="font-semibold text-gray-600">Department:</span>{" "}
                    {employeeDetails?.department}
                  </h2>
                  <h2 className="text-lg md:text-xl">
                    <span className="font-semibold text-gray-600">Employee Type:</span>{" "}
                    {employeeDetails?.employmentType}
                  </h2>
                  <h2 className="text-lg md:text-xl">
                    <span className="font-semibold text-gray-600">Emergency Contact:</span>{" "}
                    {employeeDetails?.emergencyContactNumber}
                  </h2>
                </div>
              </div>
            )
          }
        </div>
      </div>

    </div>

  );
};

export default Profile;
