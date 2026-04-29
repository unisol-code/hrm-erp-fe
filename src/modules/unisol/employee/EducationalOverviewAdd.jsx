import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import useEducation from "../../../hooks/unisol/education/useEducation";
import { LuUpload } from "react-icons/lu";
import { FiArrowLeftCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaUserGraduate, FaBuilding, FaBook, FaRunning } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import { LiaLanguageSolid } from "react-icons/lia";
import { IoLanguage } from "react-icons/io5";
import { GoGoal } from "react-icons/go";
import Breadcrumb from "../../../components/BreadCrumb";
import { toast } from "react-toastify";
import { MdErrorOutline } from "react-icons/md";
import { useTheme } from "../../../hooks/theme/useTheme";
import Button from "../../../components/Button";

const EducationalOverviewAdd = () => {
  const empId = sessionStorage.getItem("empId");
  const navigate = useNavigate();
  const {
    createProfessionalDetails,
    getEmployeeDetailsById,
    employeeDetailsById,
  } = useEducation();
  const [certifications, setCertifications] = useState([]);
  const [tempImage, setTempImage] = useState("");
  const [professionalCount, setProfessionalCount] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    getEmployeeDetailsById(empId);
  }, []);

  const arr = employeeDetailsById?.professionalCoursesOrWorkshop
    ?.split(",")
    .map((item) => item.trim());
  console.log("professional Goal", employeeDetailsById?.professionalGoals);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      totalExperience: employeeDetailsById?.totalExperience || "",
      lastEmployment: employeeDetailsById?.lastEmployment || "",
      lastProfile: employeeDetailsById?.lastProfile || "",
      companiesWorkedWith: employeeDetailsById?.companiesWorkedWith || "",
      lastDesignation: employeeDetailsById?.lastDesignation || "",

      highestDegree: employeeDetailsById?.highestDegree || "",
      // otherQualifications: employeeDetailsById?.otherQualifications || "",
      professionalCourses: arr || [""],
      // professionalCourses: employeeDetailsById?.professionalCourses || [''] ,
      university: employeeDetailsById?.university || "",
      certifications: employeeDetailsById?.certifications || [
        { title: "", imageOrDoc: null },
      ],
      // academicInterest: employeeDetailsById?.academicInterest || "",

      technicalSkills: employeeDetailsById?.technicalSkills || "",
      // softSkills: employeeDetailsById?.softSkills || "",
      // languageSkills: employeeDetailsById?.languageSkills || [],
      languageSkills: employeeDetailsById?.languageSkills || [],
      newLanguage: "", // Temporary field for the select               leadershipSkills: employeeDetailsById?.leadershipSkills || "",

      careerAspiration: employeeDetailsById?.careerAspiration || "",
      // personalOneYear: employeeDetailsById?.personalGoals?.oneYear || "",
      // professionalGoals: employeeDetailsById?.professionalGoals?.oneYear || "",
      personalGoals: employeeDetailsById?.personalGoals || "",
      professionalGoals: employeeDetailsById?.professionalGoals || "",
      // personalFiveYears: employeeDetailsById?.personalGoals?.fiveYears || "",
      // professionalFiveYears: employeeDetailsById?.professionalGoals?.fiveYears || "",
      // skillsToDevelop: employeeDetailsById?.skillsToDevelop || "",

      personalHobbies: employeeDetailsById?.personalHobbies || "",
      creativeInterests: employeeDetailsById?.creativeInterests || "",

      // coursesAttended: employeeDetailsById?.coursesAttended || "",
      professionalDevelopmentPrograms:
        employeeDetailsById?.professionalDevelopmentPrograms || "",
    },

    onSubmit: async (values) => {
      const id = sessionStorage.getItem("empId");
      const Cert = values.certifications.filter(
        (item) => typeof item.imageOrDoc != "string"
      );
      console.log("-----cert", Cert);

      const payload = {
        ...values,
        languageSkills: values.languageSkills.map((lang) => ({
          language:
            lang.language.charAt(0).toUpperCase() +
            lang.language.slice(1).toLowerCase(),
          proficiency: {
            read: Boolean(lang.proficiency?.read),
            write: Boolean(lang.proficiency?.write),
            speak: Boolean(lang.proficiency?.speak),
          },
        })),
      };

      const formData = new FormData();
      formData.append("personalGoals", values.personalGoals);
      formData.append("professionalGoals", values.professionalGoals);
      formData.append("academicInterest", values.academicInterest);

      // 3. Append each certification file (if they exist)
      Cert.forEach((cert, index) => {
        formData.append(`certifications[${index}].title`, cert.title);
        if (cert.imageOrDoc) {
          formData.append(
            `certifications[${index}].imageOrDoc`,
            cert.imageOrDoc
          );
        }
      });
      const currentCerts = values.certifications || [];
      const existingCertsInForm = currentCerts.filter(
        (cert) =>
          typeof cert === "string" ||
          (typeof cert === "object" && typeof cert.imageOrDoc === "string")
      );
      const updatedExistingCerts = existingCertsInForm.map((cert, idx) => {
        return {
          ...cert,
          title: typeof cert === "string" ? cert : cert.title,
        };
      });

      formData.append(
        "existingCertifications",
        JSON.stringify(updatedExistingCerts)
      );
      // 4. Append the rest of the fields
      formData.append("companiesWorkedWith", values.companiesWorkedWith);
      formData.append("lastEmployment", values.lastEmployment);
      formData.append("lastProfile", values.lastProfile);
      formData.append("careerAspiration", values.careerAspiration);
      formData.append("creativeInterests", values.creativeInterests);
      formData.append(
        "professionalDevelopmentPrograms",
        values.professionalDevelopmentPrograms
      );

      formData.append("coursesAttended", values.coursesAttended);
      formData.append("highestDegree", values.highestDegree);
      formData.append("lastDesignation", values.lastDesignation);
      formData.append("languageSkills", JSON.stringify(payload.languageSkills));
      formData.append("leadershipSkills", values.leadershipSkills);
      formData.append("otherQualifications", values.otherQualifications);
      formData.append("personalHobbies", values.personalHobbies);
      formData.append(
        "professionalCoursesOrWorkshop",
        values.professionalCourses
      );
      formData.append("skillsToDevelop", values.skillsToDevelop);
      formData.append("softSkills", values.softSkills);
      formData.append("technicalSkills", values.technicalSkills);
      formData.append("totalExperience", values.totalExperience);
      formData.append("university", values.university);

      // 5. Send the request with FormData
      try {
        console.log("formData", formData);
        await createProfessionalDetails(formData, id);
        navigate("/emp/educationalOverview");
        // Handle success (e.g., show a success message)
      } catch (error) {
        // Handle error (e.g., show an error message)
        console.error("Error submitting form:", error);
      }
    },
  });

  // Handler functions:
  const handleAddLanguage = () => {
    if (!formik.values.newLanguage) return;

    // Check if language already exists
    if (
      formik.values.languageSkills.some(
        (lang) =>
          lang.language.toLowerCase() ===
          formik.values.newLanguage.toLowerCase()
      )
    ) {
      toast("This language is already added.", {
        icon: (
          <MdErrorOutline style={{ color: "#e53e3e", fontSize: "1.5em" }} />
        ),
        position: "bottom-right",
        autoClose: 2000,
        style: {
          color: "#e53e3e",
          fontWeight: "semibold",
          // background: "linear-gradient(90deg, #fff5f5 0%, #e0e7ff 100%)",
        },
      });
      return;
    }

    formik.setFieldValue("languageSkills", [
      ...formik.values.languageSkills,
      {
        language:
          formik.values.newLanguage.charAt(0).toUpperCase() +
          formik.values.newLanguage.slice(1),
        proficiency: {
          read: false,
          write: false,
          speak: false,
        },
      },
    ]);

    formik.setFieldValue("newLanguage", "");
  };

  const handleRemoveLanguage = (index) => {
    const updatedLanguages = [...formik.values.languageSkills];
    updatedLanguages.splice(index, 1);
    formik.setFieldValue("languageSkills", updatedLanguages);
  };

  const handleProficiencyChange = (index, field, value) => {
    const updatedLanguages = [...formik.values.languageSkills];
    updatedLanguages[index].proficiency[field] = value;
    formik.setFieldValue("languageSkills", updatedLanguages);
  };

  console.log("formik.values", formik.values);
  console.log("certifications", employeeDetailsById?.certifications);

  const addProfessionalCourse = () => {
    // Create a new array with existing values plus an empty string
    const newCourses = [...formik.values.professionalCourses, ""];
    // Update the entire array in Formik
    formik.setFieldValue("professionalCourses", newCourses);
    setProfessionalCount(professionalCount + 1);
  };

  const removeCourse = (indexToRemove) => {
    // Filter out the course at the specified index
    const updatedCourses = formik.values.professionalCourses.filter(
      (_, index) => index !== indexToRemove
    );
    formik.setFieldValue("professionalCourses", updatedCourses);
  };

  return (
    <div className="min-h-screen flex flex-col w-full pt-0 px-0 sm:pt-0 sm:px-0">
      <Breadcrumb
        linkText={[
          { text: "Employee Overview", href: "/emp/educationalOverview" },
          { text: "Add Employee Overview" },
        ]}
      />
      <div className="flex flex-col gap-4 w-full">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 w-full"
        >
          <div
            className="text-2xl font-bold py-3 px-8 flex items-center rounded-2xl bg-white shadow-lg gap-3"
            // style={{
            //   background: `linear-gradient(90deg, ${theme.highlightColor} 0%, #f5f9fc 100%)`,
            // }}
          >
            <Link
              to="/emp/educationalOverview"
              className="flex items-center rounded-full p-1 transition-colors"
            >
              <FiArrowLeftCircle className="text-4xl text-gray-500" />
            </Link>
            <span
              // style={{ color: theme.primaryColor }}
              className="ml-1"
            >
              Educational Overview
            </span>
          </div>
          <section className="bg-white px-6 py-8 rounded-2xl w-full shadow-lg space-y-14">
            {/* Experience Card */}
            <div className="flex flex-col bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] rounded-xl shadow p-8 mb-8">
              <h1 className="font-bold text-xl flex items-center gap-2 mb-6">
                <FaBuilding className="text-[#709EB1]" /> Experience
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-base">
                <div className="flex flex-col gap-10 mt-3">
                  <div className="flex gap-3">
                    <h1 className="w-[40%] font-medium mt-1 ">
                      Total year of professional Experience:
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter total experience"
                      className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="totalExperience"
                      value={formik.values.totalExperience}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.totalExperience &&
                    formik.errors.totalExperience ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.totalExperience}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex gap-3">
                    <h1 className="w-[40%] font-medium mt-1">
                      Last Employment:
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter Company Name"
                      className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="lastEmployment"
                      value={formik.values.lastEmployment}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.lastEmployment &&
                    formik.errors.lastEmployment ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.lastEmployment}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex gap-3">
                    <h1 className="w-[40%] font-medium mt-1 ">Last Profile:</h1>
                    <input
                      type="text"
                      placeholder="Enter Company Name"
                      className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="lastProfile"
                      value={formik.values.lastProfile}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.lastProfile && formik.errors.lastProfile ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.lastProfile}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-10 mt-3">
                  <div className="flex gap-3">
                    <h1 className="w-[40%] font-medium mt-1">
                      Companies worked with:
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter"
                      className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="companiesWorkedWith"
                      value={formik.values.companiesWorkedWith}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.companiesWorkedWith &&
                    formik.errors.companiesWorkedWith ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.companiesWorkedWith}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex gap-3">
                    <h1 className="w-[40%] font-medium mt-1">
                      Last Designation:
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter Achievement"
                      className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="lastDesignation"
                      value={formik.values.lastDesignation}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.lastDesignation &&
                    formik.errors.lastDesignation ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.lastDesignation}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Education and Qualification Card */}
            <div className="flex flex-col bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] rounded-xl shadow p-8 mb-8">
              <h1 className="font-bold text-xl flex items-center gap-2 mb-6">
                <FaBook className="text-[#709EB1]" /> Additional Education &
                Qualification
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {/* Left Column */}
                <div className="flex flex-col gap-8 mt-3">
                  {/* Highest Degree */}
                  <div className="flex flex-col gap-1">
                    <label className="font-medium flex items-center gap-2 mb-1">
                      <FaUserGraduate className="text-[#709EB1]" /> Highest
                      Degree
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Degree"
                      className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="highestDegree"
                      value={formik.values.highestDegree}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.highestDegree &&
                    formik.errors.highestDegree ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.highestDegree}
                      </div>
                    ) : null}
                  </div>
                  <div className="border-t border-blue-200 my-2"></div>
                  {/* Language Skills */}
                  <div className="flex flex-col gap-2">
                    <label className="font-medium flex items-center gap-2 mb-1">
                      <IoLanguage className="text-[#709EB1]" /> Language Skills
                    </label>
                    <div className="flex gap-2 mb-2">
                      <select
                        className="border border-gray-300 h-[40px] flex-1 px-2 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                        name="newLanguage"
                        value={formik.values.newLanguage}
                        onChange={formik.handleChange}
                      >
                        <option disabled value="">
                          Select Language
                        </option>
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="marathi">Marathi</option>
                      </select>
                      <button
                        type="button"
                        className="bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] text-black px-4 rounded-lg shadow hover:from-blue-100 hover:to-purple-100 transition cursor-pointer"
                        onClick={handleAddLanguage}
                        disabled={!formik.values.newLanguage}
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {formik.values.languageSkills?.map((lang, index) => (
                        <div
                          key={index}
                          className="flex flex-col bg-white rounded-xl shadow p-3 min-w-[180px] max-w-xs relative group"
                        >
                          <button
                            type="button"
                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition"
                            onClick={() => handleRemoveLanguage(index)}
                            title="Remove language"
                          >
                            <MdDelete />
                          </button>
                          <div className="capitalize font-semibold mb-2 flex items-center gap-1">
                            <LiaLanguageSolid className="text-[#709EB1]" />{" "}
                            {lang.language}
                          </div>
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={lang.proficiency?.read || false}
                                onChange={(e) =>
                                  handleProficiencyChange(
                                    index,
                                    "read",
                                    e.target.checked
                                  )
                                }
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
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={lang.proficiency?.write || false}
                                onChange={(e) =>
                                  handleProficiencyChange(
                                    index,
                                    "write",
                                    e.target.checked
                                  )
                                }
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
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={lang.proficiency?.speak || false}
                                onChange={(e) =>
                                  handleProficiencyChange(
                                    index,
                                    "speak",
                                    e.target.checked
                                  )
                                }
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
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-blue-200 my-2"></div>
                  {/* Professional Courses */}
                  <div className="flex flex-col gap-2">
                    <label className="font-medium flex items-center gap-2 mb-1">
                      <FaBook className="text-[#709EB1]" /> Professional Courses
                      / Workshop
                    </label>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {formik.values.professionalCourses.map(
                        (course, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-white rounded-full shadow px-4 py-2 gap-2 relative group"
                          >
                            <input
                              type="text"
                              placeholder="Enter Course Name"
                              className="bg-transparent outline-none w-32 text-base"
                              name={`professionalCourses[${index}]`}
                              value={course}
                              onChange={formik.handleChange}
                            />
                            {index !== 0 && (
                              <button
                                type="button"
                                className="text-red-400 hover:text-red-600 transition"
                                onClick={() => removeCourse(index)}
                                title="Remove course"
                              >
                                <MdDelete />
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={addProfessionalCourse}
                      className="w-fit bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] text-black px-4 py-2 rounded-lg shadow hover:from-blue-100 hover:to-purple-100 transition"
                    >
                      + Add Another Course
                    </button>
                  </div>
                </div>
                {/* Right Column */}
                <div className="flex flex-col gap-8 mt-3">
                  {/* University / College */}
                  <div className="flex flex-col gap-1">
                    <label className="font-medium flex items-center gap-2 mb-1">
                      <FaBuilding className="text-[#709EB1]" /> University /
                      College
                    </label>
                    <input
                      type="text"
                      placeholder="Enter University / college"
                      className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="university"
                      value={formik.values.university}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.university && formik.errors.university ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.university}
                      </div>
                    ) : null}
                  </div>
                  <div className="border-t border-blue-200 my-2"></div>
                  {/* Certifications Section */}
                  <div className="flex flex-col gap-2">
                    <label className="font-medium flex items-center gap-2 mb-1">
                      <GrCertificate className="text-[#709EB1]" />{" "}
                      Certifications
                    </label>
                    <button
                      type="button"
                      className="w-full bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] text-black px-4 py-2 rounded-lg shadow hover:from-blue-100 hover:to-purple-100 hover:text-gray-500 transition mb-3"
                      onClick={() => {
                        formik.setFieldValue("certifications", [
                          ...(formik.values.certifications || []),
                          { title: "", imageOrDoc: null },
                        ]);
                      }}
                    >
                      + Add Certification
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(formik.values.certifications || []).map(
                        (cert, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 relative group"
                          >
                            <button
                              type="button"
                              className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition"
                              onClick={() => {
                                const updated = [
                                  ...formik.values.certifications,
                                ];
                                updated.splice(index, 1);
                                formik.setFieldValue("certifications", updated);
                              }}
                              title="Remove certification"
                            >
                              <MdDelete />
                            </button>
                            <div className="font-medium mb-1">
                              Certification {index + 1}
                            </div>
                            {/* Image Preview */}
                            <div className="flex justify-center mb-2">
                              {cert.imageOrDoc ? (
                                <img
                                  className="w-60 h-30 object-cover rounded shadow"
                                  src={
                                    typeof cert.imageOrDoc === "string"
                                      ? cert.imageOrDoc
                                      : URL.createObjectURL(cert.imageOrDoc)
                                  }
                                  alt="Certification preview"
                                />
                              ) : (
                                <div className="w-40 h-24 flex items-center justify-center bg-gray-100 rounded shadow text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>
                            {/* Upload and Title Side by Side */}
                            <div className="flex flex-row gap-2 items-center">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="Enter Title"
                                  className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition w-full"
                                  value={cert.title}
                                  onChange={(e) => {
                                    const updated = [
                                      ...formik.values.certifications,
                                    ];
                                    updated[index].title = e.target.value;
                                    formik.setFieldValue(
                                      "certifications",
                                      updated
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <input
                                  type="file"
                                  id={`certification-upload-${index}`}
                                  className="hidden"
                                  accept="image/*,.pdf,.doc,.docx"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    const updated = [
                                      ...formik.values.certifications,
                                    ];
                                    updated[index].imageOrDoc = file;
                                    formik.setFieldValue(
                                      "certifications",
                                      updated
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={`certification-upload-${index}`}
                                  className="flex items-center justify-center border border-gray-300 h-[40px] w-[40px] rounded bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 cursor-pointer hover:bg-blue-50 transition"
                                >
                                  <LuUpload className="text-gray-500 h-4 w-4" />
                                </label>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aspiration and Goals Card */}
            <div className="flex flex-col bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] rounded-xl shadow p-8 mb-8">
              <h1 className="font-bold text-xl flex items-center gap-2 mb-6">
                <GoGoal className="text-[#709EB1]" /> Aspiration & Goals
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-base">
                <div className="flex flex-col gap-10 mt-3">
                  <div className="flex">
                    <h1 className="w-[40%] font-medium mt-1">
                      Career Aspiration:
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter Career Aspiration"
                      className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="careerAspiration"
                      value={formik.values.careerAspiration}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.careerAspiration &&
                    formik.errors.careerAspiration ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.careerAspiration}
                      </div>
                    ) : null}
                  </div>

                  {/* Personal Goals */}
                  <div className="flex">
                    <h1 className="w-[40%] font-medium  mt-1">
                      Personal Goals:{" "}
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter Personal Goals for 3 years"
                      className="border border-gray-300 h-[40px] px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="personalGoals"
                      value={formik.values.personalGoals}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.personalGoals &&
                    formik.errors.personalGoals ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.personalGoals}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-10 mt-3">
                  {/* Professional Goals */}
                  <div className="flex">
                    <h1 className="w-[30%] font-medium mt-1">
                      Professional Goals:{" "}
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter Professional Goals for 1 year"
                      className="border border-gray-300 h-[40px] w-[60%] sm:mr-10 px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="professionalGoals"
                      value={formik.values.professionalGoals}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.professionalGoals &&
                    formik.errors.professionalGoals ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.professionalGoals}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Hobbies and Interests Card */}
            <div className="flex flex-col bg-gradient-to-r from-[#f8fafc] to-[#e0e7ff] rounded-xl shadow p-8 mb-8">
              <h1 className="font-bold text-xl flex items-center gap-2 mb-6">
                <FaRunning className="text-[#709EB1]" /> Hobbies & Interest
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-base">
                <div className="flex flex-col gap-10 mt-3">
                  <div className="flex">
                    <h1 className="w-[40%] font-medium mt-1">
                      Personal hobbies:
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter Personal Hobbies"
                      className="border border-gray-300 h-[40px] w-[60%] sm:mr-10 px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="personalHobbies"
                      value={formik.values.personalHobbies}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.personalHobbies &&
                    formik.errors.personalHobbies ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.personalHobbies}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-10 mt-3">
                  <div className="flex">
                    <h1 className="w-[30%] font-medium mt-1">
                      Creative Interest:
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter Creative Interest"
                      className="border border-gray-300 h-[40px] w-[60%] sm:mr-10 px-3 rounded-lg bg-white shadow-sm ring-1 ring-blue-200 focus:ring-1 focus:ring-blue-200 transition"
                      name="creativeInterests"
                      value={formik.values.creativeInterests}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.creativeInterests &&
                    formik.errors.creativeInterests ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.creativeInterests}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 justify-center items-center my-10 mr-0">
              <Button
                variant={3}
                type="button"
                text="Cancel"
                onClick={() => navigate("/emp/educationalOverview")}
              ></Button>
              <Button variant={1} type="submit" text="Save"></Button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default EducationalOverviewAdd;
