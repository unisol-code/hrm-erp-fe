import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ABSTRACT from "../../assets/images/blue-color-background-abstract-.png";
import AddEmpSuccess from "./successDialogue/AddEmpSuccess";
import { Field, useFormik } from "formik";
import * as Yup from "yup";
import useCoreHR from "../../hooks/unisol/coreHr/useCoreHR";
import useEmployee from "../../hooks/unisol/onboarding/useEmployee";
import useEmpLocation from "../../hooks/unisol/onboarding/useEmpLocation";
import useDashboard from "../../hooks/unisol/hrDashboard/useDashborad";

const validationSchema = Yup.object().shape({
  empId: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Employee ID must be alphanumeric")
    .required("Employee ID is required"),
  employeeName: Yup.string().required("Employee Name is required"),
  grade: Yup.string().required("Grade is required"),
  company: Yup.string().required("Company Name is required"),
  birthDate: Yup.date().required("Date of Birth is required"),
  // address: Yup.string().required("Address is required"),
  maritalStatus: Yup.string().required("Marital Status is required"),
  anniversaryDate: Yup.date().when("maritalStatus", {
    is: (value) => value === "Married", // Check if maritalStatus is "Married"
    then: (schema) => schema.required("Anniversary Date is required")
    .test(
      "different-from-birthDate",
      "Anniversary Date must be after the Date of Birth and not the same",
      function (value) {
        const { birthDate } = this.parent;
        if (!value || !birthDate) return true; // Skip validation if one of the dates is missing
        return new Date(value) > new Date(birthDate);
      }
    ),
    otherwise: (schema) => schema.notRequired(),
  }),
  city: Yup.string()
    .notOneOf(["Select", ""], "Please select City")
    .required("City is required"),
  zipCode: Yup.number()
    .typeError("Zip code must be a number")
    .integer("Zip code must be an integer")
    .min(10000, "Zip code must be at least 5 digits")
    .max(99999, "Zip code cannot be more than 5 digits")
    .required("Zip code is required"),
  qualification: Yup.array()
    .min(1, "At least one qualification must be selected")
    .required("This field is required"),
  country: Yup.string()
    .notOneOf(["Select", ""], "Please select Country")
    .required("Country is required"),
  state: Yup.string()
    .notOneOf(["Select", ""], "Please select State")
    .required("State is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  emergencyNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Number must be at least 10 digits")
    .required("Emergency Number is required"),
  relationWithPerson: Yup.string()
    .notOneOf(["Select", ""], "Please select Relation")
    .required("Relation is required"),
  officialEmailId: Yup.string()
    .email("Invalid email address")
    .required("Official Email ID is required"),
  personalEmailId: Yup.string()
    .email("Invalid email address")
    .required("Personal Email ID is required"),
  department: Yup.string()
    .notOneOf(["Select", ""], "Please select Department")
    .required("Deepartment is required"),
  jobTitle: Yup.string().required("Job Tittle is required"),
  salary: Yup.number()
  .typeError("Salary must be a number")
  .positive("Salary must be greater than zero")
  .required("Salary is required"),
  employeeType: Yup.string().required("Employee Type is required"),
  startDate: Yup.date().required("Start Date is required"),
  aadharCard: Yup.string().required("Adhar Card no. is required"),
  panCard: Yup.string().required("Pan Card no. is required"),
  bankAccountName: Yup.string().required("Bank Account Name is required"),
  accountNumber: Yup.string().required("Account no. is required"),
  bankName: Yup.string().required("Bank Name is required"),
  branchName: Yup.string().required("Branch Name is required"),
  ifscCode: Yup.string().required("IFSC Code is required"),
  empPassword: Yup.string().required("Password is required"),
});

const AddEmployee = ({ onClose }) => {
  const { addEmployeeCoreHR, createEmployeeCoreHR, loading } = useCoreHR();
  console.error("createEmployeeCoreHR :", createEmployeeCoreHR);

  {
    createEmployeeCoreHR && <AddEmpSuccess />;
  }

  // all department list
  const {
    fetchDepartments,
    departmentDrop,
    fetchEmployeeTypes,
    employeeTypeDrop,
  } = useEmployee();
  const { fetchCompaniesData, companyData } = useDashboard();
  const {
    fetchStateLocation,
    stateLocation,
    fetchCityLocation,
    cityLocation,
    fetchCountryLocation,
    countryLocation,
  } = useEmpLocation();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    if (selectedCountry) {
      fetchStateLocation(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetchCityLocation(selectedCountry, selectedState);
    }
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    fetchDepartments();
    fetchEmployeeTypes();
    fetchCompaniesData();
    fetchCountryLocation();
  }, []);

  const formik = useFormik({
    initialValues: {
      empId: "",
      employeeName: "",
      qualification: "",
      grade: "",
      company: "",
      birthDate: "",
      currentAddress: "",
      permanentAddress:"",
      maritalStatus: "",
      anniversaryDate: "",
      city: "",
      zipCode: "",
      country: "",
      state: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
      emergencyNumber: "",
      relationWithPerson: "",
      officialEmailId: "",
      personalEmailId: "",
      department: "",
      jobTitle: "",
      salary: "",
      empPassword: "",
      employeeType: "",
      startDate: "",
      aadharCard: "",
      panCard: "",
      bankAccountName: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      ifscCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        await addEmployeeCoreHR(values);
        
        console.log(
          "after createEmployeeCoreHR form submit response :",
          createEmployeeCoreHR
        );
        if (createEmployeeCoreHR && !loading) {
          onClose();
          //setAddEmp(false)
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    },
  });
console.log("formik values:",formik.values);
console.log("formik  errors:",formik.errors);

  // Handle country change
  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    formik.setFieldValue("country", countryCode);
    setSelectedCountry(countryCode);
    setSelectedState("");
  };

  const handleStateChange = (event) => {
    const stateCode = event.target.value;
    formik.setFieldValue("state", stateCode);
    setSelectedState(stateCode);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 h-screen w-screen">
      <div className=" flex justify-center items-center">
        <div className=" bg-white rounded-xl shadow-lg w-[1130px] h-[650px] scrollbar-hide overflow-hidden">
          <div
            className="w-full flex items-center justify-between h-[100px] sticky top-0 z-10 "
            style={{ backgroundImage: `url(${ABSTRACT})` }}
          >
            <h1 className="text-[#000000] ml-10 text-2xl font-semibold">
              Add New Employee
            </h1>

            <button onClick={onClose}>
              <IoMdClose size={32} className="cursor-pointer mr-8" />
            </button>
          </div>

          <div className="h-full overflow-y-scroll rounded-lg p-8 mx-auto pb-[100px]">
            {/* Instruction */}
            <p className="mb-6 text-gray-600">
              Please fill out the following details to add a new employee to the
              system.
            </p>
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-y-10 px-8">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Candidate ID:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base border rounded-lg border-gray-300  "
                        name="empId"
                        value={formik.values.empId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.empId && formik.errors.empId ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.empId}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Qualification:
                    </label>
                    <div className="flex-col space-y-1">
                      <div className="flex flex-wrap gap-2 mt-1 w-[306px] h-[47px]">
                        {["SSC", "HSC", "UG", "PG", "PHD", "Diploma"].map(
                          (qualification) => (
                            <label key={qualification}>
                              <input
                                type="checkbox"
                                name="qualification"
                                value={qualification}
                                checked={formik.values.qualification.includes(
                                  qualification
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    formik.setFieldValue("qualification", [
                                      ...formik.values.qualification,
                                      qualification,
                                    ]);
                                  } else {
                                    formik.setFieldValue(
                                      "qualification",
                                      formik.values.qualification.filter(
                                        (item) => item !== qualification
                                      )
                                    );
                                  }
                                }}
                                className="mr-1"
                              />
                              {qualification}
                            </label>
                          )
                        )}
                      </div>
                      {formik.touched.qualification &&
                      formik.errors.qualification ? (
                        <div className="text-red-500">
                          {formik.errors.qualification}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">Company:</label>
                    <div className="flex-col">
                      <select
                        name="company"
                        value={formik.values.company}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                      >
                        <option value="" disabled selected>
                          Select Company
                        </option>
                        {companyData?.map((c) => (
                          <option key={c._id} value={c?.name}>
                            {c?.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.company && formik.errors.company ? (
                        <div className="text-red-500">
                          {formik.errors.company}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <label className="font-semibold text-black">Current Address:</label>
                    <div className="flex-col">
                      <textarea
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2 "
                        name="currentAddress"
                        value={formik.values.currentAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      ></textarea>
                      {formik.touched.currentAddress && formik.errors.currentAddress ? (
                        <div className="text-red-500">
                          {formik.errors.currentAddress}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center justify-between">
                    <label className="font-semibold text-black">Permanent Address:</label>
                    <div className="flex">
                      <textarea
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2 "
                        name="permanentAddress"
                        value={formik.values.permanentAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      ></textarea>
                      {formik.touched.permanentAddress && formik.errors.permanentAddress ? (
                        <div className="text-red-500">
                          {formik.errors.permanentAddress}
                        </div>
                      ) : null}
                    </div>
                  </div>


                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">Country:</label>
                    <div className="flex-col">
                      <select
                        as="select"
                        name="country"
                        className="rounded-lg px-3 py-2 w-[306px] border-2 border-gray-300"
                        value={formik.values.country}
                        onChange={handleCountryChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="" label="Select Country" />
                        {countryLocation?.map((country, index) => (
                          <option key={index} value={country.isoCode}>
                            {country?.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.country && formik.errors.country ? (
                        <div className="text-red-500">
                          {formik.errors.country}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <label className="font-semibold">State:</label>
                    <div className="flex-col">
                      <select
                        as="select"
                        name="state"
                        className="rounded-lg px-3 py-2 w-[306px] border-2 border-gray-300"
                        value={formik.values.state}
                        onChange={handleStateChange}
                        onBlur={formik.handleBlur}
                        disabled={!selectedCountry}
                      >
                        <option value="" label="Select State" />
                        {stateLocation?.map((state, index) => (
                          <option key={index} value={state.isoCode}>
                            {state?.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.state && formik.errors.state ? (
                        <div className="text-red-500">
                          {formik.errors.state}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">City:</label>
                    <div className="flex-col">
                      <select
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!selectedState}
                      >
                        <option value="" disabled selected>
                          Select City
                        </option>
                        {cityLocation?.map((city, index) => (
                          <option key={index} value={city?.name}>
                            {city?.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.city && formik.errors.city ? (
                        <div className="text-red-500">{formik.errors.city}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Phone Number:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300  px-3 py-2"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber ? (
                        <div className="text-red-500">
                          {formik.errors.phoneNumber}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Emergency No:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300  px-3 py-2"
                        name="emergencyNumber"
                        value={formik.values.emergencyNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.emergencyNumber &&
                      formik.errors.emergencyNumber ? (
                        <div className="text-red-500">
                          {formik.errors.emergencyNumber}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Official E-Mail Id:
                    </label>
                    <div className="flex-col">
                      <input
                        type="email"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300  px-3 py-2"
                        name="officialEmailId"
                        value={formik.values.officialEmailId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.officialEmailId &&
                      formik.errors.officialEmailId ? (
                        <div className="text-red-500">
                          {formik.errors.officialEmailId}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <label className="font-semibold">Department:</label>
                    <div className="flex-col">
                      <select
                        name="department"
                        value={formik.values.department}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                      >
                        <option value="" disabled selected>
                          Select Department
                        </option>
                        {departmentDrop?.map((departments, index) => (
                          <option key={index} value={departments}>
                            {departments}
                          </option>
                        ))}
                      </select>
                      {formik.touched.department && formik.errors.department ? (
                        <div className="text-red-500">
                          {formik.errors.department}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">Salary:</label>
                    <div className="flex-col">
                      <input
                        type="number"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300  px-3 py-2"
                        name="salary"
                        value={formik.values.salary}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.salary && formik.errors.salary ? (
                        <div className="text-red-500">
                          {formik.errors.salary}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Aadhar Card:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300  px-3 py-2"
                        name="aadharCard"
                        value={formik.values.aadharCard}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.aadharCard && formik.errors.aadharCard ? (
                        <div className="text-red-500">
                          {formik.errors.aadharCard}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Bank Account Name:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300  px-3 py-2"
                        name="bankAccountName"
                        value={formik.values.bankAccountName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.bankAccountName &&
                      formik.errors.bankAccountName ? (
                        <div className="text-red-500">
                          {formik.errors.bankAccountName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Branch Name:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300  px-3 py-2"
                        name="branchName"
                        value={formik.values.branchName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.branchName && formik.errors.branchName ? (
                        <div className="text-red-500">
                          {formik.errors.branchName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                 
                </div>

                <div className="flex flex-col gap-y-10 px-10">
                  <div className="flex items-center justify-between ">
                    <label className="font-semibold text-black">
                      Employee Name:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base border rounded-lg border-gray-300 px-3 py-2"
                        name="employeeName"
                        value={formik.values.employeeName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.employeeName &&
                      formik.errors.employeeName ? (
                        <div className="text-red-500">
                          {formik.errors.employeeName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex  items-center justify-between ">
                    <label className="font-semibold text-black">Grade:</label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="grade"
                        value={formik.values.grade}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.grade && formik.errors.grade ? (
                        <div className="text-red-500">
                          {formik.errors.grade}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between ">
                    <label className="font-semibold text-black">
                      Birth Date:
                    </label>
                    <div className="flex-col">
                      <input
                        type="date"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="birthDate"
                        value={formik.values.birthDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.birthDate && formik.errors.birthDate ? (
                        <div className="text-red-500">
                          {formik.errors.birthDate}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold">Marital Status:</label>
                    <div className="flex-col">
                      <select
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="maritalStatus"
                        value={formik.values.maritalStatus}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select Marital Status</option>
                        <option>Single</option>
                        <option>Married</option>
                      </select>
                      {formik.touched.maritalStatus &&
                      formik.errors.maritalStatus ? (
                        <div className="text-red-500">
                          {formik.errors.maritalStatus}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {formik.values.maritalStatus === "Married" && (
                    <div className="flex items-center justify-between">
                      <label className="font-semibold">Anniversary Date:</label>
                      <div className="flex-col">
                        <input
                          type="date"
                          className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                          name="anniversaryDate"
                          value={formik.values.anniversaryDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
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

                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Zip Code:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className=" w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="zipCode"
                        value={formik.values.zipCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.zipCode && formik.errors.zipCode ? (
                        <div className="text-red-500">
                          {formik.errors.zipCode}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Alternate Ph No.:
                    </label>
                    <input
                      type="text"
                      className=" w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                      name="alternatePhoneNumber"
                      value={formik.values.alternatePhoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <label className="font-semibold">
                      Relation with Person:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="relationWithPerson"
                        value={formik.values.relationWithPerson}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.relationWithPerson &&
                      formik.errors.relationWithPerson ? (
                        <div className="text-red-500">
                          {formik.errors.relationWithPerson}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Personal Mail Id:
                    </label>
                    <div className="flex-col">
                      <input
                        type="email"
                        className=" w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="personalEmailId"
                        value={formik.values.personalEmailId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.personalEmailId &&
                      formik.errors.personalEmailId ? (
                        <div className="text-red-500">
                          {formik.errors.personalEmailId}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Job Title:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className=" w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="jobTitle"
                        value={formik.values.jobTitle}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.jobTitle && formik.errors.jobTitle ? (
                        <div className="text-red-500">
                          {formik.errors.jobTitle}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Employee Type:{" "}
                    </label>
                    <div className="flex-col">
                      <select
                        name="employeeType"
                        value={formik.values.employeeType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                      >
                        <option value="" disabled selected>
                          Select Employee Type
                        </option>
                        {employeeTypeDrop?.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {formik.touched.employeeType &&
                      formik.errors.employeeType ? (
                        <div className="text-red-500">
                          {formik.errors.employeeType}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold">Start Date:</label>
                    <div className="flex-col">
                      <input
                        type="date"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="startDate"
                        value={formik.values.startDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.startDate && formik.errors.startDate ? (
                        <div className="text-red-500">
                          {formik.errors.startDate}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Pan Card:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className=" w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="panCard"
                        value={formik.values.panCard}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.panCard && formik.errors.panCard ? (
                        <div className="text-red-500">
                          {formik.errors.panCard}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Bank Name:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className=" w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="bankName"
                        value={formik.values.bankName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.bankName && formik.errors.bankName ? (
                        <div className="text-red-500">
                          {formik.errors.bankName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Account No.:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className=" w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="accountNumber"
                        value={formik.values.accountNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.accountNumber &&
                      formik.errors.accountNumber ? (
                        <div className="text-red-500">
                          {formik.errors.accountNumber}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      Password:
                    </label>
                    <div className="flex-col">
                      <input
                        type="password" // Change this to 'password' to mask input
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300 px-3 py-2"
                        name="empPassword" // Ensure the name matches the formik field
                        value={formik.values.empPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.empPassword &&
                      formik.errors.empPassword ? (
                        <div className="text-red-500">
                          {formik.errors.empPassword}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-black">
                      IFSC Code:
                    </label>
                    <div className="flex-col">
                      <input
                        type="text"
                        className="w-[306px] h-[47px] text-base rounded-lg border border-gray-300  px-3 py-2"
                        name="ifscCode"
                        value={formik.values.ifscCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.ifscCode && formik.errors.ifscCode ? (
                        <div className="text-red-500">
                          {formik.errors.ifscCode}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center  space-x-16 py-10">
                <button
                  type="submit"
                  // onClick={() => setAddEmp(true)}
                  className="border border-white text-white bg-[#709EB1] hover:bg-[#318bb1]  px-4 py-2 rounded-md hover"
                >
                  Save
                </button>
                {/* {addEmp && <AddEmpSuccess onClose={() => setAddEmp(false)} />} */}
                <button
                  onClick={onClose}
                  className="bg-[#a1c2d0] border border-white hover:bg-[#ef4a47] text-white px-4 py-2 rounded-md hover"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
