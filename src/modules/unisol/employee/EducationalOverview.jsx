import { useEffect, useState } from "react";
import EducationalDetailsForm from "../../../components/Dialogs/EducationalDetailsForm";
//import UploadEducationalDocument from "../../../components/Dialogs/UploadEducationalDocument";
import useEducation from "../../../hooks/unisol/education/useEducation";
import DocumentDetails from "../../../components/Dialogs/DocumentDetails";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
  FaUserGraduate,
  FaBuilding,
  FaBook,
  FaRunning,
  FaSpinner,
} from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import { LiaLanguageSolid } from "react-icons/lia";
import { IoLanguage } from "react-icons/io5";
import { GoGoal } from "react-icons/go";
import Breadcrumb from "../../../components/BreadCrumb";
import { useTheme } from "../../../hooks/theme/useTheme";
import Button from "../../../components/Button";
import { Add } from "@mui/icons-material";

const EducationalOverview = () => {
  const navigate = useNavigate();
  const empId = sessionStorage.getItem("empId");
  const [viewDocumentDialog, setViewDocumentDialog] = useState(false);
  const [eduDetailsFormDialog, setEduDetailsFormDialog] = useState(false);
  const [updateEduDetailsFormDialog, setUpdateEduDetailsFormDialog] =
    useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredCert, setHoveredCert] = useState(null);
  const { theme } = useTheme();

  const {
    getEducationalDetails,
    deleteEducationalDetails,
    resetEducationDetails,
    getEmployeeDetailsById,
    loading,
    newEduDetails,
    updateEduDetails,
    allEduDetails,
    employeeDetailsById,
    deleteEduDetails,
  } = useEducation();

  useEffect(() => {
    getEmployeeDetailsById(empId);
    console.log("emplyeeeIdData", employeeDetailsById);
  }, []);

  // console.log("allEduDetails : ", allEduDetails);
  // console.log("-------certi : ", employeeDetailsById?.certificatons);

  const handleDelete = (id) => {
    console.log(id);
    deleteEducationalDetails(id);
    // getEducationalDetails(empId);
  };

  const handleViewDocumentDialog = (id) => {
    setSelectedId(id);
    setViewDocumentDialog(true);
  };

  const handleUpdateEduDetail = (id) => {
    console.log("eduId : ", id);
    setUpdateEduDetailsFormDialog(true);
    getEducationalDetailById(id);
    setSelectedId(id);
    console.log("eduDetailsById : ", eduDetailsById);
  };

  const arr = employeeDetailsById?.professionalCoursesOrWorkshop
    ?.split(",")
    .map((item) => item.trim());

  /*   if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <span className="text-lg font-medium text-gray-600">
          Loading employee details...
        </span>
      </div>
    );
  }
 */
  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb linkText={[{ text: "Employee Overview" }]} />
      <div className="flex flex-col gap-4">
        <div
          className="text-2xl font-bold py-3 px-8 flex items-center rounded-2xl bg-white shadow-lg gap-3"
          // style={{
          //   background: `linear-gradient(90deg, ${theme.highlightColor} 0%, #f5f9fc 100%)`,
          // }}
        >
          <span className="rounded-full bg-white p-3 shadow-md">
            <FaUserGraduate
              style={{ color: theme.primaryColor, fontSize: 20 }}
            />
          </span>
          <span
          // style={{ color: theme.primaryColor }}
          >
            Employee Overview
          </span>
        </div>
        <section className="bg-white px-6 py-6 rounded-2xl w-full shadow-lg">
          <div className="flex w-full justify-between items-center mb-6">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FaBook className="text-[#709EB1]" /> View Professional Details
            </h1>

            <Button
              type="button"
              icon={<EditIcon />}
              text="Professional Details"
              onClick={() => navigate("/emp/educationalOverview/add")}
            ></Button>
          </div>
          <div className="flex flex-col gap-6">
            {/* Experience Card */}
            <div className="flex flex-col bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] rounded-xl shadow p-6">
              <h1 className="font-bold text-xl flex items-center gap-2 mb-4">
                <FaBuilding className="text-[#709EB1]" /> Experience
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">
                    Total year of professional Experience:
                  </span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.totalExperience || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Companies worked with:</span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.companiesWorkedWith || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Last Employment:</span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.lastEmployment || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Last Profile:</span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.lastProfile || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Last Designation:</span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.lastDesignation || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Education and Qualification Card */}
            <div className="flex flex-col bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] rounded-xl shadow p-6">
              <h1 className="font-bold text-xl flex items-center gap-2 mb-4">
                <FaBook className="text-[#709EB1]" /> Additional Education &
                Qualification
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  {/* Highest Degree */}
                  <div className="flex items-center gap-3">
                    <span className="font-medium flex items-center gap-2">
                      <FaUserGraduate className="text-[#709EB1]" /> Highest
                      Degree:
                    </span>
                    <span className="font-normal text-gray-700">
                      {employeeDetailsById?.highestDegree || "-"}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 my-2"></div>
                  {/* Language Skills */}
                  <div className="flex flex-col gap-2">
                    <span className="font-medium flex items-center gap-2">
                      <IoLanguage className="text-[#709EB1]" /> Language Skills:
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {employeeDetailsById?.languageSkills?.length > 0 ? (
                        employeeDetailsById.languageSkills.map(
                          (lang, index) => (
                            <div
                              key={index}
                              className="flex flex-col bg-white rounded-xl shadow p-3 min-w-[180px] max-w-xs relative group"
                            >
                              <div className="capitalize font-semibold mb-2 flex items-center gap-1">
                                <LiaLanguageSolid className="text-[#709EB1]" />{" "}
                                {lang.language}
                              </div>
                              <div className="flex gap-3">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={lang.proficiency?.read || false}
                                    readOnly
                                    className="accent-black"
                                  />
                                  <span
                                    className={
                                      lang.proficiency?.read
                                        ? "text-purple-600 font-medium"
                                        : "text-gray-400"
                                    }
                                  >
                                    Read
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={lang.proficiency?.write || false}
                                    readOnly
                                    className="accent-black"
                                  />
                                  <span
                                    className={
                                      lang.proficiency?.write
                                        ? "text-purple-600 font-medium"
                                        : "text-gray-400"
                                    }
                                  >
                                    Write
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={lang.proficiency?.speak || false}
                                    readOnly
                                    className="accent-black"
                                  />
                                  <span
                                    className={
                                      lang.proficiency?.speak
                                        ? "text-purple-600 font-medium"
                                        : "text-gray-400"
                                    }
                                  >
                                    Speak
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <span className="text-gray-500">
                          No language skills added
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-blue-200 my-2"></div>
                  {/* Professional Courses / Workshops */}
                  <div className="flex flex-col gap-2">
                    <span className="font-medium flex items-center gap-2">
                      <FaBook className="text-[#709EB1]" /> Professional Courses
                      / Workshops:
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {arr?.length > 0 ? (
                        arr.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-white rounded-full shadow px-4 py-2 gap-2"
                          >
                            <span className="text-base text-gray-700">
                              {item}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500">
                          No courses/workshops available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {/* University / College */}
                  <div className="flex items-center gap-3">
                    <span className="font-medium flex items-center gap-2">
                      <FaBuilding className="text-[#709EB1]" /> University /
                      College:
                    </span>
                    <span className="font-normal text-gray-700">
                      {employeeDetailsById?.university || "-"}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 my-2"></div>
                  {/* Certification */}
                  <div className="flex flex-col gap-2">
                    <span className="font-medium flex items-center gap-2">
                      <GrCertificate className="text-[#709EB1]" />{" "}
                      Certification:
                    </span>
                    <div className="flex flex-wrap gap-4">
                      {employeeDetailsById?.certifications?.length > 0 ? (
                        employeeDetailsById.certifications.map(
                          (item, index) => (
                            <div
                              key={index}
                              onClick={() => setHoveredCert(item)}
                              className="p-2 border rounded bg-white/80 shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col items-center h-32 w-60 group"
                            >
                              <h1 className="text-sm font-medium text-center mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                {item.title}
                              </h1>
                              <img
                                className="w-60 h-20 object-cover rounded group-hover:scale-105 transition-transform duration-200"
                                src={item.imageOrDoc}
                                alt={`Certification ${index}`}
                              />
                            </div>
                          )
                        )
                      ) : (
                        <span className="text-gray-500">
                          No certifications available
                        </span>
                      )}
                    </div>
                    {hoveredCert && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        onClick={() => setHoveredCert(null)}
                      >
                        <img
                          src={hoveredCert.imageOrDoc}
                          alt={hoveredCert.title}
                          className="max-h-[50vh] max-w-[50vw] rounded-lg shadow-2xl border-4 border-white object-contain"
                          style={{ background: "white" }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Aspiration and Goals Card */}
            <div className="flex flex-col bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] rounded-xl shadow p-6">
              <h1 className="font-bold text-xl flex items-center gap-2 mb-4">
                <GoGoal className="text-[#709EB1]" /> Aspiration & Goals
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Career Aspiration:</span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.careerAspiration || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Personal Goals:</span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.personalGoals || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">
                    Professional Goals (5 Years):
                  </span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.professionalGoals || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Short Term Goals:</span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.professionalGoals?.shortTerm || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Hobbies and Interests Card */}
            <div className="flex flex-col bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] rounded-xl shadow p-6">
              <h1 className="font-bold text-xl flex items-center gap-2 mb-4">
                <FaRunning className="text-[#709EB1]" /> Hobbies & Interest
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Personal Hobbies:</span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.personalHobbies || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Creative Interests:</span>
                  <span className="font-normal text-gray-700">
                    {employeeDetailsById?.creativeInterests || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EducationalOverview;
