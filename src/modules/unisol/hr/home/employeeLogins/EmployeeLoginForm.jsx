import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import useEmployeeLogin from "../../../../../hooks/unisol/homeDashboard/useEmployeeLogin";
import { useFormik } from "formik";
import profile from "../../../../../assets/images/profile-image.png";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/Button";
import { Box } from "@mui/material";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  officialEmail: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  empPassword: Yup.string().required("Password is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
});

const EmployeeLoginForm = () => {
  const { theme } = useTheme();
  const id = useParams();
  console.log("id", id);
  const {
    perCompanyEmployeeLogin,
    resetEmployeeLoginDetails,
    employeeLoginDetails,
    updateEmployeeLoginDetail,
  } = useEmployeeLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  console.log("employeeLoginDetails", employeeLoginDetails);

  useEffect(() => {
    if (employeeLoginDetails?.employee?.photo) {
      setProfileImage(employeeLoginDetails?.employee?.photo);
    }
  }, [employeeLoginDetails]);

  const formik = useFormik({
    initialValues: {
      employeeId: employeeLoginDetails?.employee?.employeeId || "",
      fullName: employeeLoginDetails?.employee?.fullName || "",
      officialEmail: employeeLoginDetails?.employee?.officialEmail || "",
      empPassword: employeeLoginDetails?.employee?.empPassword || "",
      phoneNumber: employeeLoginDetails?.employee?.phoneNumber || "",
      photo: employeeLoginDetails?.employee?.photo || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const updatedValues = {};
      for (const key in values) {
        if (values[key] !== formik.initialValues[key]) {
          updatedValues[key] = values[key];
        }
      }

      const formData = new FormData();
      for (const key in updatedValues) {
        formData.append(key, updatedValues[key]);
      }

      if (profileImage instanceof File) {
        formData.append("photo", profileImage);
      }

      await updateEmployeeLoginDetail(
        id.id,
        employeeLoginDetails?.companyName,
        formData
      );
      navigate("/employeeLogins/unisolEdit");
      resetEmployeeLoginDetails();
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      formik.setFieldValue("photo", file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("profileImageInput").click();
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const companyName = perCompanyEmployeeLogin?.company;
  return (
    <>
      <div className="min-h-screen">
        {/* Breadcrumb Navigation - Shifted to the leftmost top */}
        <BreadCrumb
          linkText={[
            { text: "Employee Login", href: "/employeeLogins" },
            {
              text: `${companyName || ""} Employee Login Management`,
              href: "/employeeLogins/unisolEdit",
            },
            { text: `${companyName || ""} Edit Employee Login ` },
          ]}
        />
        {/* Full-size form container */}
        <div className="rounded-2xl w-full  mx-auto flex flex-col">
          <div className="bg-white shadow-lg rounded-2xl p-4 md:p-6 w-full mx-auto flex flex-col">
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-4 w-full flex flex-col"
            >
              <div className="font-[Poppins] text-[20px] font-[700]">
                {companyName || ""}
              </div>
              <div className="font-[poppins] text-[16px] font-[500] border-b-2 py-2 border-gray-400">
                Edit Employee Login Management
              </div>
              <div className="flex flex-col md:flex-row gap-4 flex-grow px-2">
                <div className="flex-1 space-y-4">
                  {/* Employee ID */}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="firstName"
                      className="text-lg md:text-xl font-medium text-gray-700 whitespace-nowrap w-32"
                    >
                      Employee ID
                    </label>
                    <div className="relative w-full max-w-lg">
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        placeholder="John"
                        value={formik.values.employeeId}
                        onChange={formik.handleChange}
                        className="w-full h-10 px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formik.errors.employeeId &&
                        formik.touched.employeeId && (
                          <div className="text-danger">
                            {formik.errors.employeeId}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="lastName"
                      className="text-lg md:text-xl font-medium text-gray-700 whitespace-nowrap w-32"
                    >
                      Full Name
                    </label>
                    <div className="relative w-full max-w-lg">
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="John Doe"
                        className="w-full h-10 px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.fullName && formik.touched.fullName && (
                        <div className="text-danger">
                          {formik.errors.fullName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="email"
                      className="text-lg md:text-xl font-medium text-gray-700 whitespace-nowrap w-32"
                    >
                      Email
                    </label>
                    <div className="relative w-full max-w-lg">
                      <input
                        type="email"
                        id="officialEmail"
                        name="officialEmail"
                        className="w-full h-10 px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formik.values.officialEmail}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.officialEmail &&
                        formik.touched.officialEmail && (
                          <div className="text-danger">
                            {formik.errors.officialEmail}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="empPassword"
                      className="text-lg md:text-xl font-medium text-gray-700 whitespace-nowrap w-32"
                    >
                      Password
                    </label>
                    <div className="relative w-full max-w-lg">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="empPassword"
                        name="empPassword"
                        placeholder="**********"
                        className="w-full h-10 px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                        value={formik.values.empPassword}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "empPassword",
                            e.target.value.replace(/\s/g, "")
                          )
                        }
                      />
                      {formik.errors.empPassword &&
                        formik.touched.empPassword && (
                          <div className="text-danger">
                            {formik.errors.empPassword}
                          </div>
                        )}
                      {/* <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button> */}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="phoneNumber"
                      className="text-lg md:text-xl font-medium text-gray-700 whitespace-nowrap w-32"
                    >
                      Phone
                    </label>
                    <div className="relative w-full max-w-lg">
                      <input
                        type="tel"
                        id="phoneNumber"
                        placeholder="(+91)876655XXXX"
                        name="phoneNumber"
                        className="w-full h-10 px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.phoneNumber &&
                        formik.touched.phoneNumber && (
                          <div className="text-danger">
                            {formik.errors.phoneNumber}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Right column - Avatar and upload */}
                <div className="flex flex-col items-center gap-5 p-8">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-300 shadow-md">
                    <img
                      src={profileImage || profile}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full max-w-[200px]">
                    <input
                      type="file"
                      id="profileImageInput"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    {/* <button
                      type="button"
                      onClick={triggerFileInput}
                      className=" px-12 py-2  text-centerflex items-center justify-center  text-sm font-medium text-white bg-[#56AAC5] rounded-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                    >
                      Upload
                    </button> */}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        variant={1}
                        type="button"
                        text="Upload"
                        onClick={triggerFileInput}
                      />
                    </Box>
                  </div>
                </div>
              </div>

              {/* Full-width submit button */}
              <div className="flex items-center justify-center">
                {/* <button
                  type="submit"
                  className=" h-14 px-8  text-sm font-medium text-white bg-[#56AAC5] rounded-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Profile
                </button> */}
                <Button variant={1} type="submit" text="Update Profile" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeLoginForm;
