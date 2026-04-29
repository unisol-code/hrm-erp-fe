import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import useEmployee from "../../../../hooks/unisol/onboarding/useEmployee";
import useEmpLocation from "../../../../hooks/unisol/onboarding/useEmpLocation";
import useDashboard from "../../../../hooks/unisol/hrDashboard/useDashborad";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumb from "../../../../components/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/Button";
import BasicDetailsTab from "./BasicDetailsTab";
import BankDetailsTab from "./BankDetailsTab";
import SalaryDetails from "./SalaryDetails";
import WelcomeKitDetailsTab from "./WelcomeKitDetailsTab";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  positionApplied: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const tabs = ["Basic Details", "Bank Details", "Salary Details"," Welcome Kit"];
const validationSchema = Yup.object().shape({
  // photo: Yup.mixed().required("Photo is required"),
  fullName: Yup.string().required("Full Name is required"),
  officialEmail: Yup.string()
    .email("Invalid official Email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  alternatePhoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: Yup.date()
    .nullable()
    .required("Date of Birth is required"),
  department: Yup.string().required("Department is required"),
  joiningDate: Yup.date().required("Joining Date is required"),
  employmentType: Yup.string().required("Employment Type is required"),
  empPassword: Yup.string().required("Password is required"),
  emergencyContactNumber: Yup.string()
    .matches(/^[0-9]+$/, "Emergency contact must be numeric")
    .min(10, "Emergency contact must be at least 10 digits")
    .required("Emergency contact is required"),
  personalEmail: Yup.string()
    .email("Invalid personal Email address")
    .required("Personal Email is required"),
  maritalStatus: Yup.string().required("Marital Status is required"),
  anniversaryDate: Yup.date().when("maritalStatus", {
    is: (value) => value === "Married", // Check if maritalStatus is "Married"
    then: (schema) =>
      schema
        .required("Anniversary Date is required")
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
  currentPincode: Yup.string()
    .required("Current pincode is required")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
    .test("location-exists", "No location found for this pincode.", function (value) {
      const { currentCity, currentState, currentCountry } = this.parent;
      if (!value) return false;
      return Boolean(currentCity &&  currentState &&  currentCountry);
    }),
  currentCountry: Yup.string().required("country is required"),
  currentState: Yup.string().required("State is required"),
  currentCity: Yup.string().required("City is required"),
  relationWithEmergencyContact: Yup.string().required("Relation is required"),
  basicSalary: Yup.string().required("Basic Salary is required").matches(/^\d+$/, "Only numbers are allowed"),
  adharNo: Yup.string()
    .matches(/^[0-9]+$/, "Aadhaar Number must be numeric")
    .min(12, "Aadhaar Number must be 12 digits")
    .max(12, "Aadhaar Number must be 12 digits")
    .required("Aadhaar Card no. is required"),
  panCard: Yup.string().required("Pan Card no. is required"),
  bankAccountName: Yup.string().required("Bank Account Name is required"),
  bankAccountNumber: Yup.string().required("Account no. is required").matches(/^\d+$/, "Only numbers are allowed"),
  branchName: Yup.string().required("Branch Name is required"),
  ifscCode: Yup.string().required("IFSC Code is required"),
  bankName: Yup.string().required("Bank Name is required"),
  currentAddress1: Yup.string()
    .required("Current Address Line 1 is required")
    .test(
      "word-count",
      "Current Address Line 1 must not exceed 15 words",
      (value) => value?.trim().split(/\s+/).length <= 15
    ),
  currentAddress2: Yup.string()
    .required("Current Address Line 2 is required")
    .test(
      "word-count",
      "Current Address Line 2 must not exceed 15 words",
      (value) => value?.trim().split(/\s+/).length <= 15
    ),
  permanentPincode: Yup.string()
    .required("Permanent pincode is required")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
    .test("location-exists", "No location found for this pincode.", function (value) {
      const { permanentCity, permanentState, permanentCountry } = this.parent;
      if (!value) return false;
      return Boolean(permanentCity && permanentState && permanentCountry);
    }),

  permanentAddress1: Yup.string()
    .required("Permanent Address Line 1 is required")
    .test(
      "word-count",
      "Permanent Address Line 1 must not exceed 15 words",
      (value) => value?.trim().split(/\s+/).length <= 15
    ),
  permanentAddress2: Yup.string()
    .required("Permanent Address Line 2 is required")
    .test(
      "word-count",
      "Permanent Address Line 2 must not exceed 15 words",
      (value) => value?.trim().split(/\s+/).length <= 15
    ),
  houseRentAllowance: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  // EmployeeId: Yup.string().required("Employee Id is required"),
  joiningBonus: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  LTAAllowance: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  conveyanceAllowance: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  dearnessAllowance: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  medicalAllowance: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  specialAllowance: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  // incomeTaxDeduction: Yup.string().required("IncomeTaxDeduction is required"),
  professionalTax: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  hasAdvanceLoan: Yup.string().required('This is required'),
  qualifications: Yup.array()
    .of(Yup.string())
    .min(1, "At least one qualification is required")
    .required("At least one qualification is required"),
  advanceLoanDeductions: Yup.string()
    .matches(/^\d+$/, "Only numbers are allowed")
    .when('hasAdvanceLoan', {
      is: 'yes',
      then: (schema) => schema.required('Amount required as Yes is selected'),
      otherwise: (schema) => schema.notRequired()
    }),
  isIncomeTaxApplicable: Yup.string().required('Required'),
  incomeTaxDeduction: Yup.string().matches(/^\d+$/, "Only numbers are allowed")
    .when('isIncomeTaxApplicable', {
      is: 'yes',
      then: (schema) => schema.required('Amount required as Yes is selected'),
      otherwise: (schema) => schema.notRequired()
    })
});
const tabFieldMap = {
  0: [ // Basic Details
    "fullName",
    "officialEmail",
    "phoneNumber",
    "dateOfBirth",
    "department",
    "joiningDate",
    "employmentType",
    "empPassword",
    "emergencyContactNumber",
    "qualifications",
    "personalEmail",
    "maritalStatus",
    "anniversaryDate",
    "currentPincode",
    "currentCountry",
    "currentState",
    "currentCity",
    "relationWithEmergencyContact",
    "adharNo",
    "panCard",
    "currentAddress1",
    "currentAddress2",
    "permanentPincode",
    "permanentAddress1",
    "permanentAddress2",
    "designation"
  ],
  1: [ // Bank Details
    "bankAccountName",
    "bankAccountNumber",
    "branchName",
    "ifscCode",
    "bankName",
  ],
  2: [ // Salary Details
    "basicSalary",
    "houseRentAllowance",
    // "EmployeeId",
    "joiningBonus",
    "LTAAllowance",
    "specialAllowance",
    "conveyanceAllowance",
    "dearnessAllowance",
    "medicalAllowance",
    "incomeTaxDeduction",
    "professionalTax",
    "pfAccountNumber",
    "advanceLoanDeductions",
  ],
  3: [ // Welcome Kit (Add this)
    "welcomeKit"
  ]
};

const CreateEmployee = () => {
  const navigate = useNavigate();
  const {
    createNewEmployee,
    fetchDesignation,
    fetchPositionApplied,
    addEmployee,
    designationByDept,
    fetchDepartments,
    departmentDrop,
    city,
    state,
    country,
    fetchOnboardingManager,
    getOnboardingManager,
    fetchEmployeeTypes,
    fetchPermanentCityStateCountry,
    perCity,
    perState,
    perCountry,
    employeeTypeDrop,
    fetchCityStateCountry,
    fetchPayrollGrade,
    payRollGrade,
  } = useEmployee();

  const {
    fetchStateLocation,
    stateLocation,
    fetchCityLocation,
    cityLocation,
    fetchCountryLocation,
    countryLocation,
  } = useEmpLocation();
  const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "next", label: "Next.js" },
];

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [permanentPincodeDetails, setPermanentPincodeDetails] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectDesignation, setSelectDesignation] = useState(" ");
  const { theme } = useTheme();
  const [samePermemnantAddressChecked, setSamePermenanttAddressChecked] = useState(false);

  const companyid = sessionStorage.getItem("companyId");
  const { fetchCompanyById, companyById } = useDashboard();
  console.log("companyid", companyid);
  console.log(
    "city, state, country,",
    city,
    state,
    country,
    "perCity, perState, perCountry",
    perCity,
    perState,
    perCountry
  );

  useEffect(() => {
    fetchDepartments();
    fetchPositionApplied();
    fetchEmployeeTypes();
    fetchCountryLocation();
    fetchOnboardingManager();
  }, []);

  useEffect(() => {
    if (companyid) {
      fetchCompanyById(companyid);
    }
  }, [companyid]);

  const formik = useFormik({
    initialValues: {
      companyName: companyById?.name || "",
      photo: "",
      fullName: "",
      phoneNumber: "",
      dateOfBirth: "",
      department: "",
      designation: "",
      employmentType: "",
      empPassword: "",
      onboardingManager: "",
      currentPincode: "",
      currentCity: "",
      currentState: "",
      currentCountry: "",
      currentAddress1: "",
      currentAddress2: "",
      currentLandMark: "",
      permanentPincode: "",
      permanentCountry: "",
      permanentState: "",
      permanentCity: "",
      permanentAddress1: "",
      permanentAddress2: "",
      permanentLandMark: "",
      officialEmail: "",
      emergencyContactNumber: "",
      emergencyContactName: "",
      joiningDate: "",
      qualifications: [],
      payrollGrade: "",
      personalEmail: "",
      maritalStatus: "",
      anniversaryDate: "",
      alternatePhoneNumber: "",
      relationWithEmergencyContact: "",
      basicSalary: "",
      adharNo: "",
      panCard: "",
      bankAccountName: "",
      bankAccountNumber: "",
      branchName: "",
      bankName: "",
      ifscCode: "",
      // EmployeeId: "",
      houseRentAllowance: 0,
      joiningBonus: 0,
      LTAAllowance: 0,
      specialAllowance: 0,
      conveyanceAllowance: 0,
      dearnessAllowance: 0,
      medicalAllowance: 0,
      professionalTax: 0,
      pfAccountNumber: "",
      isIncomeTaxApplicable: 'no',
      incomeTaxDeduction: '',
      advanceLoanDeductions: "",
      hasAdvanceLoan: 'no',
      reimbursements: "",
      welcomeKit: []
    },
    validationSchema: validationSchema,
   onSubmit: async (values) => {
  console.log("values", values);
  try {
    const formData = new FormData();
    console.log("Submitting form...", formData);
    
    // Append all form values to formData
    Object.keys(values).forEach((key) => {
      if (key === "qualifications") {
        const qualificationsObj = {};
        ["SSC", "HSC", "UG", "PG", "PHD", "Diploma"].forEach((qual) => {
          qualificationsObj[qual] = values.qualifications.includes(qual);
        });
        formData.append("qualifications", JSON.stringify(qualificationsObj));
      } 
      else if (key === "welcomeKit") {
        // Handle welcome kit array
        if (Array.isArray(values.welcomeKit) && values.welcomeKit.length > 0) {
          values.welcomeKit.forEach((kit, index) => {
            formData.append(`welcomeKits[${index}][welcomeKitId]`, kit.welcomeKitId);
            formData.append(`welcomeKits[${index}][name]`, kit.name);
          });
        }
      } 
      else {
        formData.append(key, values[key]);
      }
    });
    
   const response = await createNewEmployee(formData);
      
      if (response) {
        toast.success("Employee created successfully!");
        navigate("/onboarding-management"); // Navigate after success
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee. Please try again.");
    }
  },
});

  console.log("formik.values", formik.values);
  console.log("formik.errors", formik.errors);
  useEffect(() => {
    formik.setFieldValue("currentCity", "");
    formik.setFieldValue("currentState", "");
    formik.setFieldValue("currentCountry", "");
    formik.setFieldValue("permanentCity", "");  
    formik.setFieldValue("permanentState", "");
    formik.setFieldValue("permanentCountry", "");
    formik.setFieldValue("payrollGrade", "");
  }, []);

  useEffect(() => {
    if (companyById?.name) {
      formik.setFieldValue("companyName", companyById.name);
    }
  }, [companyById?.name]);

  useEffect(() => {
    if (selectedDepartment) {
      fetchDesignation(selectedDepartment);
    }
  }, [selectedDepartment]);
  useEffect(() => {
    if (formik.values.designation) {
      fetchPayrollGrade(
        selectDesignation,
        (grade) => {
          formik.setFieldValue("payrollGrade", grade);
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    }
  }, [formik.values.designation]);

  useEffect(() => {
    if (samePermemnantAddressChecked) {
      formik.setValues({
        ...formik.values,
        permanentPincode: formik.values.currentPincode,
        permanentCountry: formik.values.currentCountry,
        permanentState: formik.values.currentState,
        permanentCity: formik.values.currentCity,
        permanentAddress1: formik.values.currentAddress1,
        permanentAddress2: formik.values.currentAddress2,
        permanentLandMark: formik.values.currentLandMark,
      });
    }
    else {
      formik.setValues({
        ...formik.values,
        permanentPincode: "",
        permanentCountry: "",
        permanentState: "",
        permanentCity: "",
        permanentAddress1: "",
        permanentAddress2: "",
        permanentLandMark: "",
      });
    }
  }, [
    formik.values.currentPincode,
    formik.values.currentCountry,
    formik.values.currentState,
    formik.values.currentCity,
    formik.values.currentAddress1,
    formik.values.currentAddress2,
    formik.values.currentLandMark,
    samePermemnantAddressChecked
  ]);


  useEffect(() => {
    if (city && state && country) {
      formik.setFieldValue("currentCity", city);
      formik.setFieldValue("currentState", state);
      formik.setFieldValue("currentCountry", country);
    }
  }, [city, state, country]);

  useEffect(() => {
    if (perCity && perState && perCountry) {
      formik.setFieldValue("permanentCity", perCity);
      formik.setFieldValue("permanentState", perState);
      formik.setFieldValue("permanentCountry", perCountry);
    }
  }, [perCity, perState, perCountry]);

  useEffect(() => {
    if (permanentPincodeDetails) {
      fetchPermanentCityStateCountry(permanentPincodeDetails);
    } else {
      // Reset fields if permanent pincode is cleared
      formik.setFieldValue("permanentCity", "");
      formik.setFieldValue("permanentState", "");
      formik.setFieldValue("permanentCountry", "");
    }
  }, [permanentPincodeDetails]);

  const handleZipcodeChange = async (e) => {
    const zipcodeData = e.target.value.trim();

    formik.setFieldValue("currentPincode", zipcodeData);
    formik.setFieldTouched("currentPincode", true);
    formik.setFieldError("currentPincode", "");

    if (!zipcodeData) return;

    if (zipcodeData.length !== 6) {
      formik.setFieldError("currentPincode", "Pincode must be 6 digits");
      formik.setFieldValue("currentCity", "", false);
      formik.setFieldValue("currentState", "", false);
      formik.setFieldValue("currentCountry", "", false);
      return;
    }

    if (!/^\d{6}$/.test(zipcodeData)) {
      formik.setFieldError("currentPincode", "Only numbers are allowed");
      return;
    }

    try {
      const zipcodeDetails = await fetchCityStateCountry(zipcodeData);

      if (zipcodeDetails?.city && zipcodeDetails?.state && zipcodeDetails?.country) {
        formik.setFieldValue("currentCity", zipcodeDetails.city, false);
        formik.setFieldValue("currentState", zipcodeDetails.state, false);
        formik.setFieldValue("currentCountry", zipcodeDetails.country, false);
      } else {
        formik.setFieldError("currentPincode", "No location found for this pincode.");
        formik.setFieldValue("currentCity", "", false);
        formik.setFieldValue("currentState", "", false);
        formik.setFieldValue("currentCountry", "", false);
      }
    } catch (error) {
      formik.setFieldError("currentPincode", "No location found for this pincode.");
      formik.setFieldValue("currentCity", "", false);
      formik.setFieldValue("currentState", "", false);
      formik.setFieldValue("currentCountry", "", false);
    }
  };
  const handlePermanentPincodeChange = async (e) => {
    if (samePermemnantAddressChecked) return;

    const pincode = e.target.value.trim();

    formik.setFieldValue("permanentPincode", pincode);
    formik.setFieldTouched("permanentPincode", true);
    formik.setFieldError("permanentPincode", "");

    formik.setFieldValue("permanentCity", "", false);
    formik.setFieldValue("permanentState", "", false);
    formik.setFieldValue("permanentCountry", "", false);

    if (!pincode) return;

    if (pincode.length !== 6) {
      formik.setFieldError("permanentPincode", "Pincode must be 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      formik.setFieldError("permanentPincode", "Only numbers are allowed");
      return;
    }

    try {
      const permanentLocation = await fetchPermanentCityStateCountry(pincode);

      if (permanentLocation?.city && permanentLocation?.state && permanentLocation?.country) {
        formik.setFieldValue("permanentCity", permanentLocation.city, false);
        formik.setFieldValue("permanentState", permanentLocation.state, false);
        formik.setFieldValue("permanentCountry", permanentLocation.country, false);
        formik.setFieldError("permanentPincode", "");
      } else {
        formik.setFieldError("permanentPincode", "No location found for this pincode.");
      }
    } catch (error) {
      formik.setFieldError("permanentPincode", "No location found for this pincode.");
    }
  };

  const handleSelectChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("photo", file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleDepartmentChange = (event) => {
    const departmentCode = event.target.value;
    formik.setFieldValue("department", departmentCode);
    setSelectedDepartment(departmentCode);
  };
  const handleDesignationChange = (event) => {
    const designationCode = event.target.value;
    formik.setFieldValue("designation", designationCode);
    setSelectDesignation(designationCode);
  };

  const validateCurrentTab = (currentTab) => {
    switch (currentTab) {
      case 0: // Basic Details
        return (
          formik.values.photo &&
          // formik.values.EmployeeId &&
          formik.values.fullName &&
          formik.values.officialEmail &&
          formik.values.phoneNumber &&
          formik.values.dateOfBirth &&
          formik.values.department &&
          formik.values.joiningDate &&
          formik.values.employmentType &&
          formik.values.emergencyContactNumber &&
          formik.values.payrollGrade &&
          formik.values.personalEmail &&
          formik.values.maritalStatus &&
          formik.values.currentPincode &&
          formik.values.currentAddress1 &&
          formik.values.currentAddress2 &&
          formik.values.permanentPincode &&
          formik.values.permanentAddress1 &&
          formik.values.permanentAddress2 &&
          formik.values.alternatePhoneNumber &&
          formik.values.relationWithEmergencyContact &&
          formik.values.adharNo &&
          formik.values.panCard &&
          formik.values.onboardingManager
          // formik.values.workingDays
        );
      case 1: // Bank Details
        return (
          formik.values.bankAccountName &&
          formik.values.bankAccountNumber &&
          formik.values.branchName &&
          formik.values.bankName &&
          formik.values.ifscCode
        );
      case 2: // Salary Details
        return (
          // formik.values.EmployeeId &&
          formik.values.basicSalary &&
          formik.values.houseRentAllowance &&
          formik.values.joiningBonus &&
          formik.values.LTAAllowance &&
          formik.values.specialAllowance &&
          formik.values.incomeTaxDeduction &&
          formik.values.professionalTax &&
          formik.values.pfAccountNumber &&
          formik.values.advanceLoanDeductions &&
          formik.values.reimbursements
        );
        case 3:
          return (
            formik.values.welcomeKit

          )
      default:
        return true;
    }
  };
const handleNext = async () => {
  const errors = await formik.validateForm();

  // Get fields for current tab (may be undefined for Welcome Kit if not in map)
  const currentTabFields = tabFieldMap[currentTab] || [];
  
  if (currentTabFields.length > 0) {
    const tabTouched = currentTabFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    formik.setTouched(tabTouched, true);

    const hasTabErrors = currentTabFields.some((field) => errors[field]);
    
    if (currentTab < tabs.length - 1) {
      // Just validate and move to next tab, don't call API
      if (hasTabErrors) {
        toast.error("Please fill all required fields in this tab");
        return;
      }
      setCurrentTab((prev) => prev + 1);
    } else {
      // This is the last tab (Submit button) - call API here
      if (hasTabErrors) {
        toast.error("Please fill all required fields in this tab");
        return;
      }
      
      const hasFormErrors = Object.keys(errors).length > 0;
      if (hasFormErrors) {
        toast.error("Please fill all required fields in the form");
        formik.setTouched(
          Object.keys(formik.initialValues).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {}),
          true
        );
        return;
      }

      // Call formik.handleSubmit which triggers onSubmit
      formik.handleSubmit();
    }
  } else {
    // No fields defined for this tab, just move to next or submit
    if (currentTab < tabs.length - 1) {
      setCurrentTab((prev) => prev + 1);
    } else {
      // Last tab - submit the form
      const hasFormErrors = Object.keys(errors).length > 0;
      if (hasFormErrors) {
        toast.error("Please fill all required fields in the form");
        formik.setTouched(
          Object.keys(formik.initialValues).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {}),
          true
        );
        return;
      }
      formik.handleSubmit();
    }
  }
};

  const maritalDrop = ["Single", "Married", "Divorce"];
  const showDesignationDepartments = [
    "Sales",
    "Marketing",
    "Finance",
    "HR(Human Resources)",
    "Administration",
    "Service",
    "Logistics",
    "Legal",
    "RND(Research And Development)",
    "Screening",
  ];
  return (
    <div className="min-h-screen w-full ">
      <Breadcrumb
        linkText={[
          { text: "Onboarding Management" },
          { text: "Add New Employee" },
        ]}
      />
      <div className="w-full rounded-2xl h-auto bg-white">
        <div className="flex flex-col gap-2 mt-1 py-4 px-8 rounded-t-xl"
          style={{ backgroundColor: theme.secondaryColor }}>
          <h2 className="font-semibold text-[17px]">
            Add new employee for onboarding
          </h2>

          <h2 className="text-[15px]">
            Enter the candidate details to initiate the onboarding process
          </h2>
        </div>

        <div className="flex border-b mb-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`flex-1 py-2 text-center ${currentTab === index
                ? "border-b-2 border-blue-500 font-bold text-[#1976d2]"
                : "text-gray-500"
                }`}
              onClick={() => {
                setCurrentTab(index);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Basic Details */}
        <div>
          {currentTab === 0 && (
            <BasicDetailsTab
              formik={formik}
              companyById={companyById}
              departmentDrop={departmentDrop}
              designationByDept={designationByDept}
              employeeTypeDrop={employeeTypeDrop}
              maritalDrop={maritalDrop}
              getOnboardingManager={getOnboardingManager}
              handleSelectChange={handleSelectChange}
              handleDepartmentChange={handleDepartmentChange}
              handleDesignationChange={handleDesignationChange}
              handleZipcodeChange={handleZipcodeChange}
              handlePermanentPincodeChange={handlePermanentPincodeChange}
              samePermemnantAddressChecked={samePermemnantAddressChecked}
              setSamePermenanttAddressChecked={setSamePermenanttAddressChecked}
              filePreview={filePreview}
              showDesignationDepartments={showDesignationDepartments}
              VisuallyHiddenInput={VisuallyHiddenInput}
            />
          )}
        </div>

        {/* Tab 2: Bank Details */}
        <div>
          {currentTab === 1 && (
            <BankDetailsTab formik={formik} />
          )}
        </div>
        {/* Tab 3: basicSalary Details */}
        <div>
          {currentTab === 2 && (
            <SalaryDetails formik={formik} />
          )}
        </div>
        {/* Tab 4: Welcome Kit */}
        <div>
          {currentTab === 3 && (
            <WelcomeKitDetailsTab formik={formik} />
          )}
        </div>
        <div className="w-full box-border flex items-center justify-center py-8">
  <Button
    variant={1}
    type="button" // Always button type, we handle click manually
    text={currentTab === tabs.length - 1 ? "Submit" : "Save and Proceed"}
    onClick={handleNext}
  />
</div>
      </div>
    </div>
  );
};
export default CreateEmployee;