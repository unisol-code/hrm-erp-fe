import { useFormik } from "formik";
import * as Yup from "yup";
import useEducation from "../../../hooks/unisol/education/useEducation";
import { useEffect, useState } from "react";
import { imageListClasses } from "@mui/material";

const EducationalDetails = ({ closeDialog, educationalDetails }) => {
  const [filePreview, setFilePreview] = useState(null);
  const empId = sessionStorage.getItem("empId");
  const {
    createEducationalDetails,
    updateEducationalDetails,
    getProgramSelectionDrop,
    getSpecilization,
    programSelections,
    specializations,
  } = useEducation();

  useEffect(() => {
    getProgramSelectionDrop();
  }, []);

  console.log("Educational Details : ", educationalDetails);
  console.log("programSelections : ", programSelections);
  console.log("specializations : ", specializations);

  const validationSchema = Yup.object().shape({
    programSelection: Yup.string().required("Title is required"),
    specialization: Yup.string().required("Attendes is required"),
    startingDate: Yup.date().required("Date is required"),
    endingDate: Yup.date().required("Date is required"),
    degree: Yup.string().required("Degree is required"),
    year: Yup.string().required("year Date is required"),
    grade: Yup.string().required("Grade is required"),
    institute: Yup.string().required("Instutute Date is required"),
    document: Yup.string().required("Document is required"),

  });

  const formik = useFormik({
    initialValues: {
      programSelection: educationalDetails
        ? educationalDetails?.programSelection
        : "",
      specialization: educationalDetails
        ? educationalDetails?.specialization
        : "",
      startingDate: educationalDetails ? educationalDetails?.startingDate : "",
      endingDate: educationalDetails ? educationalDetails?.endingDate : "",
      degree: educationalDetails ? educationalDetails?.degree : "",
      year: educationalDetails ? educationalDetails?.year : "",
      grade: educationalDetails ? educationalDetails?.grade : "",
      institute: educationalDetails ? educationalDetails?.institute : "",
      document: educationalDetails ? educationalDetails?.document : "",
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("form values : ", values);

      try {
        const formData = new FormData();
        console.log("Submitting form...", formData);
        // Append each form field to FormData, including the image
        formData.append("programSelection", values.programSelection);
        formData.append("specialization", values.specialization);
        formData.append("startingDate", values.startingDate);
        formData.append("endingDate", values.endingDate);
        formData.append("degree", values.degree);
        formData.append("year", values.year);
        formData.append("grade", values.grade);
        formData.append("institute", values.institute);
        formData.append("document", values.document);
        formData.append("hrmEmployeeId", empId);

        console.log("Submitting form...", formData);
        {
          educationalDetails
            ? updateEducationalDetails(educationalDetails?._id, formData)
            : createEducationalDetails(formData);
        }
        //resetEducationDetails();
        closeDialog();
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    },
  });

  return (
    <div className="flex  flex-col bg-white px-8 pt-4 pb-6 rounded-2xl">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col py-8 gap-4 items-center">
          <h2 className="text-2xl font-bold">Educational Details</h2>
          <h2 className="font-medium text-xl mb-4">
            Please fill out the following details to upload Document
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 ">
          <div className="col-span-1 flex flex-col gap-6">
            <div className="flex justify-between">
              <label className="text-black">Program Selection</label>
              <div className="flex-col">
                <select
                  type="text"
                  placeholder="UG/PG"
                  className="border border-gray-400 h-[40px] w-[240px] px-2 rounded-md"
                  name="programSelection"
                  value={formik.values.programSelection}
                  onChange={(e) => {
                    formik.handleChange(e);
                    getSpecilization(e.target.value);
                    console.log(e.target.value);
                  }}
                >
                  {programSelections?.map((program, index) => (
                    <option key={index} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
                {formik.touched.programSelection &&
                formik.errors.programSelection ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.programSelection}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex justify-between">
              <label className="text-black">Degree</label>
              <div className="flex-col">
                <input
                  type="text"
                  placeholder=""
                  className="border border-gray-400 h-[40px] w-[240px] px-2 rounded-md"
                  name="degree"
                  value={formik.values.degree}
                  onChange={formik.handleChange}
                />
                {formik.touched.degree && formik.errors.degree ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.degree}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-between">
              <label className="text-black">Starting Date</label>
              <div className="flex-col">
                <input
                  type="date"
                  placeholder=""
                  className="border border-gray-400 h-[40px] w-[240px] px-2 rounded-md"
                  name="startingDate"
                  value={formik.values.startingDate}
                  onChange={formik.handleChange}
                />
                {formik.touched.startingDate && formik.errors.startingDate ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.startingDate}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-between">
              <label className="text-black">Year</label>
              <div className="flex-col">
                <input
                  type="text"
                  placeholder=""
                  className="border border-gray-400 h-[40px] w-[240px] px-2 rounded-md"
                  name="year"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                />
                {formik.touched.year && formik.errors.year ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.year}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-between">
              <label className="text-black">Document <span className="text-center" > * </span></label>
              <div className="flex-col">
                <input
                  className="hidden"
                  id="uploadDocument"
                  type="file"
                  name="document"
                  onChange={(event) => {
                    formik.setFieldValue(
                      "document",
                      event.currentTarget.files[0]
                    );
                    setFilePreview(
                      URL.createObjectURL(event.currentTarget.files[0])
                    );
                  }}
                />
                <span className="flex gap-4">
                  {filePreview && (
                    <img
                      className="h-[50px] w-[50px] object-contain"
                      src={filePreview}
                    ></img>
                  )}
                  <label
                    htmlFor="uploadDocument"
                    className="cursor-pointer h-[40px] rounded-md border bg-[#BDC3C9]  border-[#00000073] px-2 gap-2 flex justify-center items-center w-[120px] hover:bg-[#3580bd] hover:text-[#efeff0]"
                  >
                    Choose File{" "}
                  </label>
                </span>

                {formik.touched.document && formik.errors.document ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.document}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-6">
            <div className="flex justify-between">
              <label className="text-black">Specialization</label>
              <div className="flex-col">
                <select
                  type="text"
                  placeholder=""
                  className="border border-gray-400 h-[40px] w-[240px] px-2 rounded-md"
                  name="specialization"
                  value={formik.values.specialization}
                  onChange={formik.handleChange}
                >
                  {specializations?.map((specilization, index) => (
                    <option key={index} value={specilization}>
                      {specilization}
                    </option>
                  ))}
                </select>
                {formik.touched.specialization &&
                formik.errors.specialization ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.specialization}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-between">
              <label className="text-black">Institute</label>
              <div className="flex-col">
                <input
                  type="text"
                  placeholder=""
                  className="border border-gray-400 h-[40px] w-[240px] px-2 rounded-md"
                  name="institute"
                  value={formik.values.institute}
                  onChange={formik.handleChange}
                />
                {formik.touched.institute && formik.errors.institute ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.institute}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex justify-between">
              <label className="text-black">Ending Date</label>
              <div className="flex-col">
                <input
                  type="date"
                  placeholder=""
                  className="border border-gray-400 h-[40px] w-[240px] px-2 rounded-md"
                  name="endingDate"
                  value={formik.values.endingDate}
                  onChange={formik.handleChange}
                />
                {formik.touched.endingDate && formik.errors.endingDate ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.endingDate}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex justify-between">
              <label className="text-black">Grade</label>
              <div className="flex-col">
                <input
                  type="text"
                  placeholder=""
                  className="border border-gray-400 h-[40px] w-[240px] px-2 rounded-md"
                  name="grade"
                  value={formik.values.grade}
                  onChange={formik.handleChange}
                />
                {formik.touched.grade && formik.errors.grade ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.grade}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[100px] flex justify-center items-center gap-8 ">
          {educationalDetails ? (
            <button
              type="submit"
              className="bg-[#709EB1] h-[38px] py-1 px-8 rounded-md text-white hover:bg-[#318bb1] shadow-md hover:scale-[1.1] transition duration-300"
            >
              Update
            </button>
          ) : (
            <button
              type="submit"
              className="bg-[#709EB1] h-[38px] py-1 px-8 rounded-md text-white hover:bg-[#318bb1] shadow-md hover:scale-[1.1] transition duration-300"
            >
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EducationalDetails;
