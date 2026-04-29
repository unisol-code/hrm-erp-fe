import React from "react";
import { useFormikContext } from "formik";
import MuiButton from "@mui/material/Button";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { useState, useEffect } from "react";
import CollectionsIcon from "@mui/icons-material/Collections";
import Select from "react-select";

const BasicDetailsTab = ({
  formik,
  departmentDrop,
  designationByDept,
  employeeTypeDrop,
  maritalDrop,
  getOnboardingManager,
  handleSelectChange,
  handleDepartmentChange,
  handleDesignationChange,
  handleZipcodeChange,
  handlePermanentPincodeChange,
  samePermemnantAddressChecked,
  setSamePermenanttAddressChecked,
  filePreview,
  showDesignationDepartments,
  VisuallyHiddenInput,
}) => {
  const { theme } = useTheme();
  const options =
    getOnboardingManager?.length != 0
      ? getOnboardingManager?.map((item) => ({ label: item, value: item }))
      : [];

  const generateOfficialEmail = (fullName, companyName) => {
    if (!fullName || !companyName) return "";
    const nameParts = fullName.trim().toLowerCase().split(" ");
    let emailName = "";
    if (nameParts.length > 1) {
      const firstName = nameParts[0];
      const lastNameInitial = nameParts[nameParts.length - 1][0];
      emailName = `${firstName}${lastNameInitial}`;
    } else {
      emailName = nameParts[0];
    }
    emailName = emailName.replace(/[^a-z]/g, "");
    const domain = companyName.trim().toLowerCase().replace(/\s+/g, "");
    return `${emailName}@${domain}.in`;
  };

  useEffect(() => {
    if (formik.values.fullName && formik.values.companyName) {
      const officialEmail = generateOfficialEmail(
        formik.values.fullName,
        formik.values.companyName
      );
      formik.setFieldValue("officialEmail", officialEmail);
    }
  }, [formik.values.fullName, formik.values.companyName]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="px-8">
        {/* Photo */}
        <div className="py-8 flex space-x-16">
          <MuiButton
            component="label"
            // role={undefined}
            // tabIndex={-1}
            sx={{
              backgroundColor: theme.secondaryColor,
              color: "black",
            }}
          >
            Upload Photo
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              // onChange={(e) =>
              //   formik.setFieldValue("photo", e.currentTarget.files[0])
              // }
              onChange={handleSelectChange}
              name="photo"
              required
            />
          </MuiButton>
          <div className="">
            {filePreview ? (
              <img
                alt="Photo Preview"
                src={filePreview}
                className="w-10 h-10 ml-5"
              />
            ) : (
              <CollectionsIcon
                fontSize="large"
                color="primary"
              ></CollectionsIcon>
            )}
            <h1 className="text-xs">[Photo Preview]</h1>
          </div>

          {formik.errors.photo && formik.touched.photo && (
            <div className="text-red-500">{formik.errors.photo}</div>
          )}
        </div>
        <div className="flex w-full flex-col gap-8">
          <hr />
          {/* Company Name */}
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1">
              <label>Company Name : </label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                // placeholder="Enter comapny name"
                type="text"
                name="companyName"
                value={formik.values.companyName}
                readOnly
              />
            </div>
          </div>
          {/* Employee Name */}
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1 ">
              <label>Employee Name: </label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter Full Name"
                type="text"
                name="fullName"
                value={formik.values.fullName}
                // onChange={formik.handleChange}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="text-red-500">{formik.errors.fullName}</div>
              ) : null}
            </div>
          </div>
          {/* Department */}
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1 ">
              <label>Department: </label>
            </div>
            <div className=" col-span-2">
              <select
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                name="department"
                value={formik.values.department}
                // onChange={formik.handleChange}
                onChange={handleDepartmentChange}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Select Department" />
                {departmentDrop &&
                  departmentDrop.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>
              {formik.touched.department && formik.errors.department ? (
                <div className="text-red-500">{formik.errors.department}</div>
              ) : null}
            </div>
          </div>
          {/* Designation */}
          {showDesignationDepartments.includes(formik.values.department) && (
            <div className="grid grid-cols-3">
              <div className="w-full col-span-1 ">
                <label>Designation: </label>
              </div>
              <div className=" col-span-2">
                <select
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="designation"
                  value={formik.values.designation}
                  onChange={handleDesignationChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" label="Select Designation" />
                  {designationByDept?.map((designation, index) => (
                    <option key={index} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
                {formik.touched.designation && formik.errors.designation ? (
                  <div className="text-red-500">
                    {formik.errors.designation}
                  </div>
                ) : null}
              </div>
            </div>
          )}
          {/* Password */}
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1">
              <label>Employement Type: </label>
            </div>
            <div className=" col-span-2">
              <select
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter Employement Type"
                type="text"
                name="employmentType"
                value={formik.values.employmentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Select Employement Type" />
                {employeeTypeDrop?.map((empType, index) => (
                  <option key={index} value={empType}>
                    {empType}
                  </option>
                ))}
              </select>
              {formik.touched.employmentType && formik.errors.employmentType ? (
                <div className="text-red-500">
                  {formik.errors.employmentType}
                </div>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1 ">
              <label>Password: </label>
            </div>
            <div className="col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter password"
                type="text"
                name="empPassword"
                value={formik.values.empPassword}
                // onChange={formik.handleChange}
                onChange={(e) => {
                  formik.handleChange(e);
                  // formik.setFieldValue(
                  //   "officialEmail",
                  //   getOfficialEmail(e.target.value, companyById?.name)
                  // );
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.empPassword && formik.errors.empPassword ? (
                <div className="text-red-500">{formik.errors.empPassword}</div>
              ) : null}
            </div>
          </div>
          {/* Qualification */}
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1 ">
              <label>Qualification:</label>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {["SSC", "HSC", "UG", "PG", "PHD", "Diploma"].map(
                (qualifications) => (
                  <label key={qualifications}>
                    <input
                      type="checkbox"
                      name="qualifications"
                      value={qualifications}
                      checked={
                        formik.values.qualifications.includes(qualifications) ||
                        false
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          formik.setFieldValue("qualifications", [
                            ...formik.values.qualifications,
                            qualifications,
                          ]);
                        } else {
                          formik.setFieldValue(
                            "qualifications",
                            formik.values.qualifications.filter(
                              (item) => item !== qualifications
                            )
                          );
                          formik.setFieldTouched("qualifications", true);
                        }
                      }}
                      onBlur={() =>
                        formik.setFieldTouched("qualifications", true)
                      }
                      className="mr-1"
                    />
                    {qualifications}
                  </label>
                )
              )}
              {formik.touched.qualifications && formik.errors.qualifications ? (
                <div className="text-red-500">
                  {formik.errors.qualifications}
                </div>
              ) : null}
            </div>
          </div>
          {/* Payroll Grade */}
          {showDesignationDepartments.includes(formik.values.department) && (
            <div className="grid grid-cols-3">
              <div className="w-full col-span-1 ">
                <label>Payroll Grade: </label>
              </div>
              <div className=" col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="payrollgrade"
                  value={formik.values.payrollGrade}
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  readOnly
                />
                {formik.touched.payrollGrade && formik.errors.payrollGrade ? (
                  <div className="text-red-500">
                    {formik.errors.payrollGrade}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Birth Date */}
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1 ">
              <label>Birth Date: </label>
            </div>
            <div className="col-span-2">
              <input
                type="date"
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                name="dateOfBirth"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                <div className="text-red-500">{formik.errors.dateOfBirth}</div>
              ) : null}
            </div>
          </div>
          {/* Marital Status */}
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1 ">
              <label>Marital Status: </label>
            </div>
            <div className=" col-span-2">
              <select
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                name="maritalStatus"
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Select Status" />
                {maritalDrop?.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {formik.touched.maritalStatus && formik.errors.maritalStatus ? (
                <div className="text-red-500">
                  {formik.errors.maritalStatus}
                </div>
              ) : null}
            </div>
          </div>

          {/* Anniversary Date */}
          {formik.values.maritalStatus === "Married" && (
            <div className="grid grid-cols-3">
              <div className="w-full col-span-1">
                <label>Anniversary Date: </label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  type="date"
                  name="anniversaryDate"
                  value={formik.values.anniversaryDate}
                  onChange={formik.handleChange}
                />
                {formik.touched.anniversaryDate &&
                  formik.errors.anniversaryDate ? (
                  <div className="text-red-500">
                    {formik.errors.anniversaryDate}
                  </div>
                ) : null}
              </div>
            </div>
          )}
          <hr />
          {/* Current Address */}

          <div>
            <h2 className="text-lg font-semibold">Current Address</h2>
            <span class="text-md text-gray-500 dark:text-gray-400 italic mt-1 block">
              Enter the ZIP code and details will be automatically fetched.
            </span>
            <div className="grid grid-cols-3 mb-6 mt-4">
              <div className="w-full col-span-1 ">
                <label>Zip Code: </label>
              </div>
              <div className=" col-span-2">
                <input
                  type="text"
                  name="currentPincode"
                  value={formik.values.currentPincode}
                  maxLength={6}
                  onChange={handleZipcodeChange}
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  placeholder="Enter Zip Code"
                />
                {formik.touched.currentPincode &&
                  formik.errors.currentPincode && (
                    <div className="text-red-500">
                      {formik.errors.currentPincode}
                    </div>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1 ">
                <label>Country: </label>
              </div>
              <div className=" col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="currentCountry"
                  value={formik.values.currentCountry}
                  placeholder="Enter Country"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1">
                <label>State: </label>
              </div>
              <div className=" col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="currentState"
                  placeholder="Enter State"
                  value={formik.values.currentState}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1">
                <label>City:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  placeholder="Enter City"
                  name="currentCity"
                  value={formik.values.currentCity}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1">
                <label>Address line 1:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="currentAddress1"
                  value={formik.values.currentAddress1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter address line 1"
                />
                {formik.touched.currentAddress1 &&
                  formik.errors.currentAddress1 ? (
                  <div className="text-red-500">
                    {formik.errors.currentAddress1}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1">
                <label>Address line 2:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="currentAddress2"
                  value={formik.values.currentAddress2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter address line 2"
                />
                {formik.touched.currentAddress2 &&
                  formik.errors.currentAddress2 ? (
                  <div className="text-red-500">
                    {formik.errors.currentAddress2}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-3">
              <div className="w-full col-span-1">
                <label>Land mark:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="currentLandMark"
                  value={formik.values.currentLandMark}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter land mark"
                />
                {formik.touched.currentLandMark &&
                  formik.errors.currentLandMark ? (
                  <div className="text-red-500">
                    {formik.errors.currentLandMark}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <hr />
          {/* Permanent Address */}
          <div>
            <h2 className="text-lg font-semibold">Permanent Address</h2>
            <div className="flex mt-2 items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={samePermemnantAddressChecked}
                onChange={(e) =>
                  setSamePermenanttAddressChecked(e.target.checked)
                }
              />
              <span class="text-md text-gray-500 dark:text-gray-400 italic">
                Check if the current address is same as permanent address.
              </span>
            </div>
            <div className="grid grid-cols-3 mb-6 mt-4">
              <div className="w-full col-span-1">
                <label>Zip Code:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  placeholder="Enter Zip Code"
                  type="text"
                  maxLength={6}
                  name="permanentPincode"
                  value={formik.values.permanentPincode}
                  onChange={handlePermanentPincodeChange}
                  readOnly={samePermemnantAddressChecked}
                />
                {formik.touched.permanentPincode &&
                  formik.errors.permanentPincode ? (
                  <div className="text-red-500">
                    {formik.errors.permanentPincode}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1">
                <label>Country:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="permanentCountry"
                  defaultValue=""
                  value={formik.values.permanentCountry}
                  placeholder="Enter country"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1">
                <label>State:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  placeholder="Enter state"
                  name="permanentState"
                  value={formik.values.permanentState}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1">
                <label>City:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="permanentCity"
                  placeholder="Enter city"
                  value={formik.values.permanentCity}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1">
                <label>Address line 1:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="permanentAddress1"
                  value={formik.values.permanentAddress1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter address line 1"
                />
                {formik.touched.permanentAddress1 &&
                  formik.errors.permanentAddress1 ? (
                  <div className="text-red-500">
                    {formik.errors.permanentAddress1}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-3 mb-6">
              <div className="w-full col-span-1">
                <label>Address line 2:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="permanentAddress2"
                  value={formik.values.permanentAddress2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter address line 2"
                />
                {formik.touched.permanentAddress2 &&
                  formik.errors.permanentAddress2 ? (
                  <div className="text-red-500">
                    {formik.errors.permanentAddress2}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-3">
              <div className="w-full col-span-1">
                <label>Land mark:</label>
              </div>
              <div className="col-span-2">
                <input
                  className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                  name="permanentLandMark"
                  value={formik.values.permanentLandMark}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter land mark"
                />
                {formik.touched.permanentLandMark &&
                  formik.errors.permanentLandMark ? (
                  <div className="text-red-500">
                    {formik.errors.permanentLandMark}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <hr />
          {/* Employee Contact Information */}
          <h2 className="col-span-2 text-lg font-semibold">
            Employee Contact Information
          </h2>
          <div className="grid grid-cols-3 ">
            <div className="w-full col-span-1 ">
              <label>Phone No: </label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter Phone Number"
                type="tel"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-red-500">{formik.errors.phoneNumber}</div>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-3 ">
            <div className="w-full col-span-1 ">
              <label>Alternate Phone No. : </label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter Phone Number"
                type="text"
                name="alternatePhoneNumber"
                value={formik.values.alternatePhoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.alternatePhoneNumber &&
                formik.errors.alternatePhoneNumber ? (
                <div className="text-red-500">
                  {formik.errors.alternatePhoneNumber}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div className="w-full col-span-1 ">
              <label>Official E-Mail: </label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter Email"
                type="email"
                name="officialEmail"
                value={formik.values.officialEmail}
                readOnly
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
              />
              {formik.touched.officialEmail && formik.errors.officialEmail ? (
                <div className="text-red-500">
                  {formik.errors.officialEmail}
                </div>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1 ">
              <label>Personal E-Mail: </label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter Email"
                type="email"
                name="personalEmail"
                value={formik.values.personalEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.personalEmail && formik.errors.personalEmail ? (
                <div className="text-red-500">
                  {formik.errors.personalEmail}
                </div>
              ) : null}
            </div>
          </div>
          <hr />
          {/* Emergency Contact Information*/}
          <h2 className="col-span-2 text-lg font-semibold">
            Emergency Contact Information
          </h2>
          <div className="grid grid-cols-3 ">
            <div className="w-full col-span-1 ">
              <label>Emergency contact name: </label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter emergency contact name"
                type="text"
                name="emergencyContactName"
                value={formik.values.emergencyContactName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.emergencyContactName &&
                formik.errors.emergencyContactName ? (
                <div className="text-red-500">
                  {formik.errors.emergencyContactName}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3 ">
            <div className="w-full col-span-1 ">
              <label>Emergency contact number: </label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter emergency contact number"
                type="text"
                name="emergencyContactNumber"
                value={formik.values.emergencyContactNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.emergencyContactNumber &&
                formik.errors.emergencyContactNumber ? (
                <div className="text-red-500">
                  {formik.errors.emergencyContactNumber}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div className="w-full col-span-1">
              <label>Relation wih Person: </label>
            </div>
            <div className="col-span-2">
              <input
                type="text"
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                name="relationWithEmergencyContact"
                value={formik.values.relationWithEmergencyContact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter relation with person"
              />
              {formik.touched.relationWithEmergencyContact &&
                formik.errors.relationWithEmergencyContact ? (
                <div className="text-red-500">
                  {formik.errors.relationWithEmergencyContact}
                </div>
              ) : null}
            </div>
          </div>
          <hr />
          {/* Identification Details */}
          <h2 className="text-lg font-semibold col-span-2">
            Identification Details
          </h2>
          <div className="grid grid-cols-3 ">
            <div className="w-full col-span-1 ">
              <label>Aadhaar No:</label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter Aadhaar No"
                type="text"
                name="adharNo"
                value={formik.values.adharNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.adharNo && formik.errors.adharNo ? (
                <div className="text-red-500">{formik.errors.adharNo}</div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3 ">
            <div className="w-full col-span-1 ">
              <label>Pan No:</label>
            </div>
            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                placeholder="Enter Pan No"
                type="text"
                name="panCard"
                value={formik.values.panCard}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.panCard && formik.errors.panCard ? (
                <div className="text-red-500">{formik.errors.panCard}</div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div className="w-full col-span-1 ">
              <label>Joining Date: </label>
            </div>

            <div className=" col-span-2">
              <input
                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                type="date"
                name="joiningDate"
                value={formik.values.joiningDate}
                onChange={formik.handleChange}
              />
              {formik.touched.joiningDate && formik.errors.joiningDate ? (
                <div className="text-red-500">{formik.errors.joiningDate}</div>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="w-full col-span-1">
              <label>Onborading Manager:</label>
            </div>
            <div className="col-span-2">
              <Select
                name="onboardingManager"
                options={options}
                value={
                  formik.values.onboardingManager && options.length !== 0
                    ? options.find(
                      (option) =>
                        option.value === formik.values.onboardingManager
                    )
                    : null
                }
                onChange={(selectedOption) => {
                  formik.setFieldValue(
                    "onboardingManager",
                    selectedOption ? selectedOption.value : ""
                  );
                }}
                onBlur={formik.handleBlur}
                placeholder="Select Onboarding Manager"
                isSearchable={true}
                isClearable={true}
                closeMenuOnSelect={true}
                className="w-full"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderColor: "#9ca3af", // Tailwind: border-gray-400
                    borderWidth: "2px",
                    padding: "2px",
                    borderRadius: "0.5rem", // Tailwind: rounded-lg
                    minHeight: "42px", // matches input height
                    "&:hover": {
                      borderColor: "#6b7280", // Tailwind: border-gray-500 on hover
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 20, // Ensure dropdown appears over other elements
                  }),
                }}
              />
              {formik.touched.onboardingManager &&
                formik.errors.onboardingManager ? (
                <div className="text-red-500">
                  {formik.errors.onboardingManager}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BasicDetailsTab;
