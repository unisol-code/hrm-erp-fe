import { styled } from "@mui/material/styles";
import React, { useRef, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useEmployee from "../../hooks/unisol/onboarding/useEmployee";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../hooks/theme/useTheme";
import MuiButton from "@mui/material/Button";
import Button from "../../components/Button";
import Select from "react-select";
import { IoMdClose } from "react-icons/io";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import useCoreHR from "../../hooks/unisol/coreHr/useCoreHR";
import useHRPrivilege from "../../hooks/unisol/homeDashboard/useHRPrivilege";
import { Link } from "react-router-dom";
import useWelcomeKit from "../../hooks/unisol/onboarding/useWelcomekit";
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
const tabs = ["Basic Details", "Bank Details", "Salary Details", "Welcome Kit"];

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
  dateOfBirth: Yup.date().nullable().required("Date of Birth is required"),
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
    .required("Permanent pincode is required")
    .matches(/^\d+$/, "Only numbers are allowed")
    .test(
      "len",
      "Pincode must be exactly 6 digits",
      (val) => val?.length === 6
    ),
  currentCountry: Yup.string().required("country is required"),
  currentState: Yup.string().required("State is required"),
  currentCity: Yup.string().required("City is required"),
  relationWithEmergencyContact: Yup.string().required("Relation is required"),
  basicSalary: Yup.string()
    .required("Basic Salary is required")
    .matches(/^\d+$/, "Only numbers are allowed"),
  adharNo: Yup.string()
    .matches(/^[0-9]+$/, "Aadhaar Number must be numeric")
    .min(12, "Aadhaar Number must be 12 digits")
    .max(12, "Aadhaar Number must be 12 digits")
    .required("Aadhaar Card no. is required"),
  panCard: Yup.string().required("Pan Card no. is required"),
  bankAccountName: Yup.string().required("Bank Account Name is required"),
  bankAccountNumber: Yup.string()
    .required("Account no. is required")
    .matches(/^\d+$/, "Only numbers are allowed"),
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
    .matches(/^\d+$/, "Only numbers are allowed")
    .test(
      "len",
      "Pincode must be exactly 6 digits",
      (val) => val?.length === 6
    ),
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
  conveyanceAllowance: Yup.string().matches(
    /^\d+$/,
    "Only numbers are allowed"
  ),
  dearnessAllowance: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  medicalAllowance: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  specialAllowance: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  // incomeTaxDeduction: Yup.string().required("IncomeTaxDeduction is required"),
  professionalTax: Yup.string().matches(/^\d+$/, "Only numbers are allowed"),
  hasAdvanceLoan: Yup.string().required("This is required"),
  qualifications: Yup.object()
    .test("at-least-one", "At least one qualification is required", (value) => {
      if (!value) return false; // nothing selected
      return Object.values(value).some((v) => v === true);
    })
    .required("At least one qualification is required"),
  advanceLoanDeductions: Yup.string()
    .matches(/^\d+$/, "Only numbers are allowed")
    .when("hasAdvanceLoan", {
      is: "yes",
      then: (schema) => schema.required("Amount required as Yes is selected"),
      otherwise: (schema) => schema.notRequired(),
    }),
  isIncomeTaxApplicable: Yup.string().required("Required"),
  incomeTaxDeduction: Yup.string()
    .matches(/^\d+$/, "Only numbers are allowed")
    .when("isIncomeTaxApplicable", {
      is: "yes",
      then: (schema) => schema.required("Amount required as Yes is selected"),
      otherwise: (schema) => schema.notRequired(),
    }),
});
const tabFieldMap = {
  0: [
    "fullName",
    "officialEmail",
    "empPassword",
    "phoneNumber",
    "dateOfBirth",
    "department",
    "designation",
    "payrollGrade",
    "joiningDate",
    "employmentType",
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
  ],
  1: [
    "bankAccountName",
    "bankAccountNumber",
    "branchName",
    "ifscCode",
    "bankName",
  ],
  2: [
    "basicSalary",
    "houseRentAllowance",
    "conveyanceAllowance",
    "dearnessAllowance",
    "medicalAllowance",
    "joiningBonus",
    "LTAAllowance",
    "specialAllowance",
    "incomeTaxDeduction",
    "professionalTax",
    "pfAccountNumber",
    "advanceLoanDeductions",
  ],
  3: [
    // Welcome Kit (Add this)
    "welcomeKit",
  ],
};

const EmployeeDetail = ({ onClose }) => {
  const { welcomekKitDropdownOptions } = useWelcomeKit();
  const handleNumericChange = (fieldName) => (e) => {
    const { value } = e.target;
    const currentValue = formik.values[fieldName];

    if (currentValue == 0 && /^\d$/.test(value)) {
      formik.setFieldValue(fieldName, value);
      return;
    }

    const sanitized = value.replace(/^0+(?=\d)/, "") || "0";
    formik.setFieldValue(fieldName, sanitized);
  };
  const dropdownopen = () => {
    setShowDropdown(true);
  };


  const handleWelcomeKitToggle = (kitId) => {
    setSelectedWelcomeKits((prev) => {
      if (prev.includes(kitId)) {
        return prev.filter((id) => id !== kitId);
      } else {
        return [...prev, kitId];
      }
    });
  };
  const [selectedItems, setSelectedItems] = useState([]);
  const [welcomeKitData, setWelcomeKitData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const { coreHREmployeeDetails, updateCoreHREmployeeById } = useCoreHR();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const [samePermemnantAddressChecked, setSamePermenanttAddressChecked] =
    useState(false);
  const compId = sessionStorage.getItem("companyId") || "";
  const [companyId, setCompanyId] = useState(compId);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectDesignation] = useState(null);
  const {
    designationByDept,
    fetchDesignation,
    employeeTypeDrop,
    fetchOnboardingManager,
    getOnboardingManager,
    fetchPermanentCityStateCountry,
    fetchCityStateCountry,
    perCity,
    perState,
    perCountry,
    city,
    state,
    country,
    fetchEmployeeTypes,
    fetchPayrollGrade
  } = useEmployee();
  const [companyList, setCompanyList] = useState([]);
  const [selectedWelcomeKits, setSelectedWelcomeKits] = useState([]);

  const {
    fetchPrivilegeCompany,
    privilegeCompany,
    fetchCompaniesDept,
    companyDepartment,
  } = useHRPrivilege();
  const [photoFile, setPhotoFile] = useState(null);
  const handleToggleItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const getSelectedNames = () => {
    if (selectedItems.length === 0) return "";
    return selectedItems
      .map((id) => {
        const item = welcomeKitData.find(
          (kit) => (kit.welcomeKitId || kit._id) === id
        );
        return item?.name || "";
      })
      .filter(Boolean)
      .join(", ");
  };
  console.log("welcome kit data", coreHREmployeeDetails?.data?._id);

  const _id = coreHREmployeeDetails?.data?._id || null;


  const initialValues = {
    fullName: coreHREmployeeDetails?.data?.fullName || "",

    officialEmail: coreHREmployeeDetails?.data?.officialEmail || "",
    welcomeKits: coreHREmployeeDetails?.data?.welcomeKits || [],
    // _id: coreHREmployeeDetails?.data?._id || "",
    // empPassword: coreHREmployeeDetails?.data?.empPassword || "",
    empPassword: "",
    phoneNumber: coreHREmployeeDetails?.data?.phoneNumber || "",
    dateOfBirth: coreHREmployeeDetails?.data?.dateOfBirth
      ? new Date(coreHREmployeeDetails.data.dateOfBirth)
          .toISOString()
          .split("T")[0]
      : "",
    department: coreHREmployeeDetails?.data?.department || "",
    designation: coreHREmployeeDetails?.data?.designation || "",
    payrollGrade: coreHREmployeeDetails?.data?.payrollGrade || "",
    joiningDate: coreHREmployeeDetails?.data?.joiningDate
      ? new Date(coreHREmployeeDetails.data.joiningDate)
          .toISOString()
          .split("T")[0]
      : "",
    employmentType: coreHREmployeeDetails?.data?.employmentType || "",
    emergencyContactNumber:
      coreHREmployeeDetails?.data?.emergencyContactNumber || "",
    personalEmail: coreHREmployeeDetails?.data?.personalEmail || "",
    maritalStatus: coreHREmployeeDetails?.data?.maritalStatus || "",
    anniversaryDate: coreHREmployeeDetails?.data?.anniversaryDate
      ? new Date(coreHREmployeeDetails.data.anniversaryDate)
          .toISOString()
          .split("T")[0]
      : "",
    currentPincode: coreHREmployeeDetails?.data?.currentPincode || "",
    currentCountry: coreHREmployeeDetails?.data?.currentCountry || "",
    currentState: coreHREmployeeDetails?.data?.currentState || "",
    currentCity: coreHREmployeeDetails?.data?.currentCity || "",
    relationWithEmergencyContact:
      coreHREmployeeDetails?.data?.relationWithEmergencyContact || "",
    basicSalary: coreHREmployeeDetails?.data?.basicSalary || "0",
    adharNo: coreHREmployeeDetails?.data?.adharNo || "",
    panCard: coreHREmployeeDetails?.data?.panCard || "",
    bankAccountName: coreHREmployeeDetails?.data?.bankAccountName || "",
    bankAccountNumber: coreHREmployeeDetails?.data?.bankAccountNumber || "",
    branchName: coreHREmployeeDetails?.data?.branchName || "",
    bankName: coreHREmployeeDetails?.data?.bankName || "",
    ifscCode: coreHREmployeeDetails?.data?.ifscCode || "",
    currentAddress1: coreHREmployeeDetails?.data?.currentAddress1 || "",
    currentAddress2: coreHREmployeeDetails?.data?.currentAddress2 || "",
    permanentPincode: coreHREmployeeDetails?.data?.permanentPincode || "",
    permanentAddress1: coreHREmployeeDetails?.data?.permanentAddress1 || "",
    permanentAddress2: coreHREmployeeDetails?.data?.permanentAddress2 || "",
    houseRentAllowance: coreHREmployeeDetails?.data?.houseRentAllowance || "0",
    conveyanceAllowance:
      coreHREmployeeDetails?.data?.conveyanceAllowance || "0",
    dearnessAllowance: coreHREmployeeDetails?.data?.dearnessAllowance || "0",
    medicalAllowance: coreHREmployeeDetails?.data?.medicalAllowance || "0",
    joiningBonus: coreHREmployeeDetails?.data?.joiningBonus || "0",
    LTAAllowance: coreHREmployeeDetails?.data?.LTAAllowance || "0",
    specialAllowance: coreHREmployeeDetails?.data?.specialAllowance || "0",
    professionalTax: coreHREmployeeDetails?.data?.professionalTax || "0",
    pfAccountNumber: coreHREmployeeDetails?.data?.pfAccountNumber || "0",
    advanceLoanDeductions:
      coreHREmployeeDetails?.data?.advanceLoanDeductions || "0",
    hasAdvanceLoan: coreHREmployeeDetails?.data?.advanceLoanDeductions
      ? "yes"
      : "no",
    isIncomeTaxApplicable: coreHREmployeeDetails?.data?.incomeTaxDeduction
      ? "yes"
      : "no",
    incomeTaxDeduction: coreHREmployeeDetails?.data?.incomeTaxDeduction || "0",
    qualifications: (() => {
      const q = coreHREmployeeDetails?.data?.qualifications;
      if (!q) return {};
      if (typeof q === "string") {
        try {
          return JSON.parse(q);
        } catch {
          return {};
        }
      }
      return q;
    })(),
    photo:
      coreHREmployeeDetails?.data?.photo ||
      "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
    companyName: coreHREmployeeDetails?.data?.companyName || "",
    candidateId: coreHREmployeeDetails?.data?.employeeId || "",
    alternatePhoneNumber:
      coreHREmployeeDetails?.data?.alternatePhoneNumber || "",
    permanentCountry: coreHREmployeeDetails?.data?.permanentCountry || "",
    permanentState: coreHREmployeeDetails?.data?.permanentState || "",
    permanentCity: coreHREmployeeDetails?.data?.permanentCity || "",
    permanentLandMark: coreHREmployeeDetails?.data?.permanentLandMark || "",
    currentLandMark: coreHREmployeeDetails?.data?.currentLandMark || "",
    emergencyContactName:
      coreHREmployeeDetails?.data?.emergencyContactName || "",
    onboardingManager: coreHREmployeeDetails?.data?.onboardingManager || "",
    // Add other fields as needed
  };
  // Fetch welcome kit options on mount
  useEffect(() => {
    if (!showDropdown || !_id) return;

    const fetchWelcomeKits = async () => {
      setIsLoading(true);
      try {
        const options = await welcomekKitDropdownOptions(_id);

        const dataArray = Array.isArray(options)
          ? options
          : Array.isArray(options?.data)
            ? options.data
            : [];

        setWelcomeKitData(dataArray);
      } catch (error) {
        console.error(error);
        setWelcomeKitData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWelcomeKits();
  }, [showDropdown, _id]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          const numericFields = [
            "basicSalary",
            "houseRentAllowance",
            "conveyanceAllowance",
            "dearnessAllowance",
            "medicalAllowance",
            "joiningBonus",
            "LTAAllowance",
            "specialAllowance",
            "professionalTax",
            "pfAccountNumber",
            "advanceLoanDeductions",
            "incomeTaxDeduction",
          ];

          if (key === "welcomeKits") {
            const welcomeKitsData = selectedItems
              .map((itemId) => {
                const kit = welcomeKitData.find(
                  (k) => (k.welcomeKitId || k._id) === itemId
                );

                if (!kit) return null;
                return {
                  welcomeKitId: kit.welcomeKitId || kit._id,
                  //  name: kit.name,
                  // photo: kit.photo || "",
                  // description: kit.description || "",
                  // isAcknowledged: false
                };
              })
              .filter(Boolean);

            formData.append("welcomeKits", JSON.stringify(welcomeKitsData));
          } else if (numericFields.includes(key)) {
            formData.append(key, value === "" ? "0" : value);
          } else if (key === "qualifications") {
            formData.append("qualifications", JSON.stringify(value));
          } else if (key === "empPassword") {
            if (value && value.trim() !== "") {
              formData.append(key, value);
            }
          } else if (key !== "photo" && key !== "welcomeKits") {
            formData.append(key, value);
          }
        });

        if (photoFile) {
          formData.append("photo", photoFile);
        }

        await updateCoreHREmployeeById(
          coreHREmployeeDetails?.data?._id,
          formData
        );
        setIsEditing(false);
        onClose();
      } catch (error) {
        console.error("Update employee error:", error);
      }
    },
  });

  console.log("here is qualifications", formik.values.qualifications);
  useEffect(() => {
    fetchPrivilegeCompany();
    fetchOnboardingManager();
    // ensure employment type options are loaded so the select can show the saved value
    fetchEmployeeTypes();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchDesignation(selectedDepartment);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (companyId) {
      fetchCompaniesDept(companyId);
    }
  }, [companyId]);

  useEffect(() => {
    if (formik.values.designation) {
      fetchPayrollGrade(
        formik.values.designation, // Use the actual designation value
        (grade) => {
          formik.setFieldValue("payrollGrade", grade);
        },
        (error) => {
          console.error("Error fetching payroll grade:", error);
          formik.setFieldValue("payrollGrade", ""); // Clear on error
        }
      );
    } else {
      // Clear payroll grade if no designation is selected
      formik.setFieldValue("payrollGrade", "");
    }
  }, [formik.values.designation]);

  const companyOptions = privilegeCompany.map((company) => ({
    value: company._id,
    label: company.name,
  }));
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (coreHREmployeeDetails?.data?.welcomeKits) {
      console.log(
        "Initializing welcome kits:",
        coreHREmployeeDetails.data.welcomeKits
      );
      // Use index as ID since there's no unique identifier
      setSelectedWelcomeKits(
        coreHREmployeeDetails.data.welcomeKits.map((kit, index) => index)
      );
    }
  }, [coreHREmployeeDetails]);

  const handleZipcodeChange = async (e) => {
    const zipcodeData = e.target.value.trim();

    formik.setFieldValue("currentPincode", zipcodeData);
    formik.setFieldTouched("currentPincode", true, false);

    // Only fetch if length is 6 (Indian pincode)
    if (zipcodeData.length !== 6) {
      if (zipcodeData.length > 0) {
        formik.setFieldError("currentPincode", "Pincode must be 6 digits");
      }
      formik.setFieldValue("currentCity", "");
      formik.setFieldValue("currentState", "");
      formik.setFieldValue("currentCountry", "");
      return;
    }

    try {
      const zipcodeDetails = await fetchCityStateCountry(zipcodeData);

      if (
        zipcodeDetails?.city &&
        zipcodeDetails?.state &&
        zipcodeDetails?.country
      ) {
        formik.setValues(
          {
            ...formik.values,
            currentPincode: zipcodeData,
            currentCity: zipcodeDetails.city,
            currentState: zipcodeDetails.state,
            currentCountry: zipcodeDetails.country,
          },
          false
        );
      } else {
        throw new Error("Incomplete location data");
      }
    } catch (error) {
      formik.setFieldError(
        "currentPincode",
        "Invalid pincode or location not found"
      );
      formik.setFieldValue("currentCity", "");
      formik.setFieldValue("currentState", "");
      formik.setFieldValue("currentCountry", "");
    }
  };
  const dropdownRef = useRef(null);
  const filteredData = welcomeKitData.filter((item) =>
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermanentPincodeChange = async (e) => {
    if (samePermemnantAddressChecked) return;

    const pincode = e.target.value.trim();
    formik.setFieldValue("permanentPincode", pincode);
    formik.setFieldTouched("permanentPincode", true, false);

    // Clear dependent fields immediately
    formik.setFieldValue("permanentCity", "");
    formik.setFieldValue("permanentState", "");
    formik.setFieldValue("permanentCountry", "");
    formik.setFieldError("permanentPincode", "");

    // Only fetch if length is 6
    if (pincode.length !== 6) {
      if (pincode.length > 0) {
        formik.setFieldError("permanentPincode", "Pincode must be 6 digits");
      }
      return;
    }

    try {
      const permanentLocation = await fetchPermanentCityStateCountry(pincode);

      if (
        permanentLocation?.city &&
        permanentLocation?.state &&
        permanentLocation?.country
      ) {
        formik.setValues(
          {
            ...formik.values,
            permanentPincode: pincode,
            permanentCity: permanentLocation.city,
            permanentState: permanentLocation.state,
            permanentCountry: permanentLocation.country,
          },
          false
        );
      } else {
        throw new Error("Incomplete location data");
      }
    } catch (error) {
      formik.setFieldError(
        "permanentPincode",
        error.message.includes("fetch")
          ? "Failed to fetch location. Try again later."
          : "No location found for this pincode."
      );
    }
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        formik.setFieldValue("photo", reader.result); // for preview only
      };
      reader.readAsDataURL(file);
    }
  };
  const handleNext = async () => {
    const errors = await formik.validateForm();

    const currentTabFields = tabFieldMap[currentTab];
    const tabTouched = currentTabFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    formik.setTouched(tabTouched, true);

    const hasTabErrors = currentTabFields.some((field) => errors[field]);
    if (currentTab < tabs.length - 1) {
      if (hasTabErrors) {
        toast.error("Please fill all required fields in this tab");
        return;
      }
      setCurrentTab((prev) => prev + 1);
    } else {
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
  };

  const options =
    getOnboardingManager?.length != 0
      ? getOnboardingManager?.map((item) => ({ label: item, value: item }))
      : [];
  const maritalDrop = ["Single", "Married", "Divorce"];

  console.log("qqqqqqqqqqqqqqqq", formik.values.qualifications);
  console.log(formik.values);

  // ...existing handlers for dropdowns, file upload, etc...

  // UI rendering (same as your current code, just use formik for values and submit)
  return (
    <div className="fixed inset-0 bg-blur p-10 bg-opacity-10 z-50">
      <div className="w-full h-screen overflow-scroll rounded-2xl bg-white">
        <div
          className="flex flex-col gap-4 py-2 px-8 rounded-t-xl"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="flex justify-end items-center gap-4">
            {!isEditing && (
              <Button
                text="Update"
                variant={1}
                icon={<BorderColorIcon style={{ fontSize: "16px" }} />}
                height="32px"
                width="100px"
                onClick={() => setIsEditing(true)}
              />
            )}
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-red-500 text-center transition"
            >
              <IoMdClose size={28} />
            </button>
          </div>
        </div>
        <div className="flex border-b mb-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`flex-1 py-2 text-center ${
                currentTab === index
                  ? "border-b-2 border-blue-500 font-bold text-[#1976d2]"
                  : "text-gray-500"
              }`}
              onClick={() => {
                // if (!validateCurrentTab(currentTab)) {
                //   toast.error("Please fill all required fields");
                // } else {
                setCurrentTab(index);
                // }
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Basic Details */}
        <div>
          {currentTab === 0 && (
            <form onSubmit={formik.handleSubmit}>
              <div className="px-8">
                {/* Photo */}
                {isEditing ? (
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
                        name="photo"
                        required
                        onChange={handlePhotoChange}
                      />
                    </MuiButton>
                    <div>
                      {filePreview || formik.values.photo ? (
                        <img
                          alt="Photo Preview"
                          src={filePreview || formik.values.photo}
                          className="w-10 h-10 ml-5"
                        />
                      ) : (
                        <CollectionsIcon fontSize="large" color="primary" />
                      )}
                      <h1 className="text-xs">[Photo Preview]</h1>
                    </div>
                    {formik.errors.photo && formik.touched.photo && (
                      <div className="text-red-500">{formik.errors.photo}</div>
                    )}
                  </div>
                ) : (
                  <img
                    alt="Photo Preview"
                    src={formik.values.photo}
                    className="w-20 h-20 ml-5"
                  />
                )}
                <div className="flex w-full flex-col gap-8">
                  <hr />
                  {/* Employee ID */}
                  <div className="grid grid-cols-3 items-center gap-2 ">
                    <div className="col-span-1">
                      <label className="text-gray-700 font-medium">
                        Employee ID:
                      </label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-4 py-2 border border-gray-400 rounded-lg"
                        placeholder="Enter Employee ID"
                        type="text"
                        name="candidateId"
                        value={formik.values.candidateId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.candidateId &&
                        formik.errors.candidateId && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.candidateId}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="grid grid-cols-3 items-center gap-2 ">
                    <div className="col-span-1">
                      <label
                        htmlFor="companyName"
                        className="text-gray-700 font-medium"
                      >
                        Company Name:
                      </label>
                    </div>
                    <div className="col-span-2">
                      {isEditing ? (
                        <Select
                          id="companyName"
                          name="companyName"
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={companyOptions}
                          value={companyOptions.find(
                            (opt) => opt.label === formik.values.companyName
                          )}
                          onChange={(selectedOption) => {
                            formik.setFieldValue(
                              "companyName",
                              selectedOption?.label || ""
                            );
                            setCompanyId(selectedOption?.value || "");
                          }}
                          placeholder="Select a company"
                          isClearable
                          isDisabled={!isEditing}
                        />
                      ) : (
                        <input
                          id="companyName"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                          type="text"
                          name="companyName"
                          value={formik.values.companyName}
                          readOnly
                        />
                      )}
                    </div>
                  </div>

                  {/* Employee Name */}
                  <div className="grid grid-cols-3 items-center gap-2 ">
                    <div className="col-span-1">
                      <label className="text-gray-700 font-medium">
                        Employee Name:
                      </label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-4 py-2 border border-gray-400 rounded-lg"
                        placeholder="Enter Full Name"
                        type="text"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.fullName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Department */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 flex items-center">
                      <label
                        htmlFor="department"
                        className="text-gray-700 font-medium"
                      >
                        Department:
                      </label>
                    </div>
                    <div className="col-span-2">
                      <div className="min-h-[42px]">
                        <Select
                          inputId="department"
                          name="department"
                          isClearable
                          options={companyDepartment.map((dept) => ({
                            label: dept,
                            value: dept,
                          }))}
                          value={
                            formik.values.department
                              ? {
                                  label: formik.values.department,
                                  value: formik.values.department,
                                }
                              : null
                          }
                          onChange={(selected) => {
                            const value = selected?.value || "";
                            setSelectedDepartment(value);
                            formik.setFieldValue("department", value);
                            formik.setFieldValue("designation", "");
                            formik.setFieldValue("payrollGrade", "");
                          }}
                          onBlur={() =>
                            formik.setFieldTouched("department", true)
                          }
                          placeholder="Select Department"
                          classNamePrefix="react-select"
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "42px",
                              height: "42px",
                              borderColor: state.isFocused
                                ? theme.secondaryColor
                                : "#d1d5db",
                              boxShadow: state.isFocused
                                ? `0 0 0 2px ${theme.secondaryColor}33`
                                : "none",
                              borderRadius: "0.5rem",
                            }),
                          }}
                          isDisabled={!isEditing}
                        />
                      </div>
                      {formik.touched.department &&
                        formik.errors.department && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.department}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 flex items-center">
                      <label
                        htmlFor="designation"
                        className="text-gray-700 font-medium"
                      >
                        Designation:
                      </label>
                    </div>
                    <div className="col-span-2">
                      <div className="min-h-[42px]">
                        <Select
                          inputId="designation"
                          name="designation"
                          options={designationByDept?.map((d) => ({
                            label: d,
                            value: d,
                          }))}
                          value={
                            formik.values.designation
                              ? {
                                  label: formik.values.designation,
                                  value: formik.values.designation,
                                }
                              : null
                          }
                          onChange={(selected) => {
                            const value = selected?.value || "";
                            if (!value) {
                              formik.setFieldValue("empId", "");
                              setSelectedEmployeeName("");
                            }
                            formik.setFieldValue("designation", value);
                          }}
                          onBlur={() =>
                            formik.setFieldTouched("designation", true)
                          }
                          placeholder="Select Designation"
                          isClearable
                          classNamePrefix="react-select"
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "42px",
                              height: "42px",
                              borderColor: state.isFocused
                                ? theme.secondaryColor
                                : "#d1d5db",
                              boxShadow: state.isFocused
                                ? `0 0 0 2px ${theme.secondaryColor}33`
                                : "none",
                              borderRadius: "0.5rem",
                            }),
                          }}
                          isDisabled={!isEditing || !formik.values.department}
                        />
                      </div>
                      {formik.touched.designation &&
                        formik.errors.designation && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.designation}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Payroll Grade */}
                  {formik.values.designation && (

                    <div className="grid grid-cols-3">
                      <div className="w-full col-span-1 ">
                        <label>Payroll Grade: </label>
                      </div>
                      <div className=" col-span-2">
                        <input
                          className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                          name="payrollgrade"
                          value={formik.values.payrollGrade}
                          readOnly
                        />
                        {formik.touched.payrollGrade &&
                          formik.errors.payrollGrade ? (
                          <div className="text-red-500">
                            {formik.errors.payrollGrade}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* Employment Type */}
                  <div className="grid grid-cols-3 items-center gap-2 mb-4">
                    <div className="col-span-1">
                      <label className="text-gray-700 font-medium">
                        Employment Type:
                      </label>
                    </div>
                    <div className="col-span-2">
                      <select
                        className="w-full px-4 py-2 border border-gray-400 rounded-lg"
                        name="employmentType"
                        value={formik.values.employmentType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!isEditing}
                      >
                        <option value="" label="Select Employment Type" />
                        {employeeTypeDrop?.map((empType, index) => (
                          <option key={index} value={empType}>
                            {empType}
                          </option>
                        ))}
                      </select>
                      {formik.touched.employmentType &&
                        formik.errors.employmentType && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.employmentType}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="grid grid-cols-3">
                    <div className="w-full col-span-1 ">
                      <label>Qualification:</label>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {["SSC", "HSC", "UG", "PG", "PHD", "Diploma"].map(
                        (qual) => (
                          <label key={qual}>
                            <input
                              type="checkbox"
                              name={`qualifications.${qual}`}
                              checked={
                                formik.values.qualifications?.[qual] || false
                              }
                              onChange={
                                isEditing
                                  ? (e) => {
                                      formik.setFieldValue("qualifications", {
                                        ...formik.values.qualifications,
                                        [qual]: e.target.checked,
                                      });
                                    }
                                  : undefined
                              }
                              className="mr-1"
                              disabled={!isEditing}
                            />
                            {qual}
                          </label>
                        )
                      )}
                      {formik.touched.qualifications &&
                      formik.errors.qualifications ? (
                        <div className="text-red-500">
                          {formik.errors.qualifications}
                        </div>
                      ) : null}
                    </div>
                  </div>

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
                        readOnly={!isEditing}
                      />
                      {formik.touched.dateOfBirth &&
                      formik.errors.dateOfBirth ? (
                        <div className="text-red-500">
                          {formik.errors.dateOfBirth}
                        </div>
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
                        disabled={!isEditing}
                      >
                        <option value="" label="Select Status" />
                        {maritalDrop?.map((dept, index) => (
                          <option key={index} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {formik.touched.maritalStatus &&
                      formik.errors.maritalStatus ? (
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
                  {/* working Days */}
                  {/* <div className="grid grid-cols-3">
                            <div className="w-full col-span-1">
                              <label>Working Days:</label>
                            </div>
                            <div className=" col-span-2">
                              <input
                                type="text"
                                className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                                name="workingDays"
                                placeholder="Enter Working Days"
                                value={formik.values.workingDays}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.workingDays &&
                              formik.errors.workingDays ? (
                                <div className="text-red-500">
                                  {formik.errors.workingDays}
                                </div>
                              ) : null}
                            </div>
                          </div> */}
                  <hr />
                  {/* Current Address */}

                  <div>
                    <h2 className="text-lg font-semibold">Current Address</h2>
                    <span class="text-md text-gray-500 dark:text-gray-400 italic mt-1 block">
                      Enter the ZIP code and details will be automatically
                      fetched.
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
                          onChange={handleZipcodeChange}
                          onBlur={formik.handleBlur}
                          className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                          placeholder="Enter Zip Code"
                          readOnly={!isEditing}
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
                          readOnly={!isEditing}
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
                          readOnly={!isEditing}
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
                          readOnly={!isEditing}
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
                        onChange={
                          isEditing
                            ? (e) =>
                                setSamePermenanttAddressChecked(
                                  e.target.checked
                                )
                            : undefined
                        }
                        disabled={!isEditing}
                      />
                      <span class="text-md text-gray-500 dark:text-gray-400 italic">
                        Check if the current address is same as permanent
                        address.
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
                          name="permanentPincode"
                          value={formik.values.permanentPincode}
                          onChange={handlePermanentPincodeChange}
                          // onChange={(e) => handleZipcodeChange(e, "permanentPincode")}
                          onBlur={formik.handleBlur}
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
                          readOnly={!isEditing}
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
                          readOnly={!isEditing}
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
                          readOnly={!isEditing}
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
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Enter Phone Number"
                        type="number"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber ? (
                        <div className="text-red-500">
                          {formik.errors.phoneNumber}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 ">
                    <div className="w-full col-span-1 ">
                      <label>Alternate Phone No. : </label>
                    </div>
                    <div className=" col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Enter Phone Number"
                        type="number"
                        name="alternatePhoneNumber"
                        value={formik.values.alternatePhoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
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
                        // readOnly
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.officialEmail &&
                      formik.errors.officialEmail ? (
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
                        readOnly={!isEditing}
                      />
                      {formik.touched.personalEmail &&
                      formik.errors.personalEmail ? (
                        <div className="text-red-500">
                          {formik.errors.personalEmail}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="w-full col-span-1 ">
                      <label>Password :</label>
                    </div>
                    <div className=" col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                        placeholder="**************"
                        type="password"
                        name="empPassword"
                        value={formik.values.empPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.empPassword &&
                      formik.errors.empPassword ? (
                        <div className="text-red-500">
                          {formik.errors.empPassword}
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
                        readOnly={!isEditing}
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
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Enter emergency contact number"
                        type="number"
                        name="emergencyContactNumber"
                        value={formik.values.emergencyContactNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
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
                        readOnly={!isEditing}
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
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Enter Aadhaar No"
                        type="number"
                        name="adharNo"
                        value={formik.values.adharNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.adharNo && formik.errors.adharNo ? (
                        <div className="text-red-500">
                          {formik.errors.adharNo}
                        </div>
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
                        readOnly={!isEditing}
                      />
                      {formik.touched.panCard && formik.errors.panCard ? (
                        <div className="text-red-500">
                          {formik.errors.panCard}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-3">
                    <div className="w-full col-span-1">
                      <label>Joining Date: </label>
                    </div>

                    <div className=" col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                        type="date"
                        name="joiningDate"
                        value={formik.values.joiningDate}
                        onChange={formik.handleChange}
                        readOnly={!isEditing}
                      />
                      {formik.touched.joiningDate &&
                      formik.errors.joiningDate ? (
                        <div className="text-red-500">
                          {formik.errors.joiningDate}
                        </div>
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
                          formik.values.onboardingManager &&
                          options.length !== 0
                            ? options.find(
                                (option) =>
                                  option.value ===
                                  formik.values.onboardingManager
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
                        isDisabled={!isEditing}
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
          )}
        </div>

        {/* Tab 2: Bank Details */}
        <div>
          {currentTab === 1 && (
            <div>
              <form onSubmit={formik.handleSubmit}>
                <div className="px-8">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Bank Account Name */}
                    <div className="grid grid-cols-3">
                      <div className="w-full col-span-1">
                        <label>Bank Holder Name:</label>
                      </div>
                      <div className=" col-span-2">
                        <input
                          type="text"
                          className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                          name="bankAccountName"
                          placeholder="Enter Bank Account Name"
                          value={formik.values.bankAccountName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          readOnly={!isEditing}
                        />
                        {formik.touched.bankAccountName &&
                        formik.errors.bankAccountName ? (
                          <div className="text-red-500">
                            {formik.errors.bankAccountName}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Bank Name */}
                    <div className="grid grid-cols-3">
                      <div className="w-full col-span-1">
                        <label>Bank Name:</label>
                      </div>
                      <div className=" col-span-2">
                        <input
                          type="text"
                          className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                          name="bankName"
                          value={formik.values.bankName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Bank Name"
                          readOnly={!isEditing}
                        />
                        {formik.touched.bankName && formik.errors.bankName ? (
                          <div className="text-red-500">
                            {formik.errors.bankName}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Branch Name */}

                    <div className="grid grid-cols-3">
                      <div className="w-full col-span-1">
                        <label>Branch Name:</label>
                      </div>
                      <div className=" col-span-2">
                        <input
                          type="text"
                          className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                          name="branchName"
                          value={formik.values.branchName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Branch Name"
                          readOnly={!isEditing}
                        />
                        {formik.touched.branchName &&
                        formik.errors.branchName ? (
                          <div className="text-red-500">
                            {formik.errors.branchName}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Bank Account Number */}
                    <div className="grid grid-cols-3">
                      <div className="w-full col-span-1">
                        <label>Account No:</label>
                      </div>
                      <div className=" col-span-2">
                        <input
                          type="text"
                          className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                          name="bankAccountNumber"
                          placeholder="Enter Bank Account No"
                          value={formik.values.bankAccountNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          readOnly={!isEditing}
                        />
                        {formik.touched.bankAccountNumber &&
                        formik.errors.bankAccountNumber ? (
                          <div className="text-red-500">
                            {formik.errors.bankAccountNumber}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* IFSC Code */}
                    <div className="grid grid-cols-3">
                      <div className="w-full col-span-1">
                        <label>IFSC Code:</label>
                      </div>
                      <div className=" col-span-2">
                        <input
                          type="text"
                          className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                          name="ifscCode"
                          value={formik.values.ifscCode}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter IFSC Code"
                          readOnly={!isEditing}
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
              </form>
            </div>
          )}
        </div>
        {/* Tab 3: basicSalary Details */}
        {/* Tab 3: basicSalary Details */}

        {currentTab === 2 && (
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div className="px-10">
                <div className="grid grid-cols-1 gap-5">
                  {/* Employee Id */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>Employee Id</label>
                    </div>
                    <div className=" col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg"
                        placeholder="Enter Employee ID"
                        type="text"
                        name="candidateId"
                        value={formik.values.candidateId}
                        // onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.candidateId &&
                      formik.errors.candidateId ? (
                        <div className="text-red-500">
                          {formik.errors.candidateId}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <hr />

                  {/* Earnings Section */}
                  <h2 className="text-lg font-semibold mt-4 mb-2">Earnings</h2>

                  {/* Basic Salary */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>Basic Salary</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Enter Basic Salary"
                        type="number"
                        name="basicSalary"
                        value={formik.values.basicSalary}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onWheel={(e) => e.target.blur()}
                        readOnly={!isEditing}
                      />
                      {formik.touched.basicSalary &&
                        formik.errors.basicSalary && (
                          <div className="text-red-500">
                            {formik.errors.basicSalary}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* House Rent Allowance */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>House Rent Allowance</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="House Rent Allowance"
                        type="number"
                        name="houseRentAllowance"
                        value={formik.values.houseRentAllowance}
                        onChange={handleNumericChange("houseRentAllowance")}
                        onBlur={formik.handleBlur}
                        onWheel={(e) => e.target.blur()}
                        readOnly={!isEditing}
                      />
                      {formik.touched.houseRentAllowance &&
                        formik.errors.houseRentAllowance && (
                          <div className="text-red-500">
                            {formik.errors.houseRentAllowance}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Convenyance Allowance */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label> Convenyance Allowance</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Convenyance Allowance"
                        type="number"
                        name="conveyanceAllowance"
                        value={formik.values.conveyanceAllowance}
                        onChange={handleNumericChange("conveyanceAllowance")}
                        onBlur={formik.handleBlur}
                        onWheel={(e) => e.target.blur()}
                        readOnly={!isEditing}
                      />
                      {formik.touched.conveyanceAllowance &&
                        formik.errors.conveyanceAllowance && (
                          <div className="text-red-500">
                            {formik.errors.conveyanceAllowance}
                          </div>
                        )}
                    </div>
                  </div>
                  {/* House Rent Allowance */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>Dearness Allowance</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Dearness Allowance"
                        type="number"
                        name="dearnessAllowance"
                        value={formik.values.dearnessAllowance}
                        onChange={handleNumericChange("dearnessAllowance")}
                        onWheel={(e) => e.target.blur()}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.dearnessAllowance &&
                        formik.errors.dearnessAllowance && (
                          <div className="text-red-500">
                            {formik.errors.dearnessAllowance}
                          </div>
                        )}
                    </div>
                  </div>
                  {/* medicalAllowance Allowance */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>medical Allowance</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="medical Allowance"
                        type="number"
                        name="medicalAllowance"
                        value={formik.values.medicalAllowance}
                        onChange={handleNumericChange("medicalAllowance")}
                        onWheel={(e) => e.target.blur()}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.medicalAllowance &&
                        formik.errors.medicalAllowance && (
                          <div className="text-red-500">
                            {formik.errors.medicalAllowance}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* joining Bonus */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>Joining Bonus</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Joining Bonus"
                        type="number"
                        name="joiningBonus"
                        value={formik.values.joiningBonus}
                        onWheel={(e) => e.target.blur()}
                        onChange={handleNumericChange("joiningBonus")}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.joiningBonus &&
                        formik.errors.joiningBonus && (
                          <div className="text-red-500">
                            {formik.errors.joiningBonus}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* LTA Allowance */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>LTA Allowance</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="LTA Allowance"
                        type="number"
                        name="LTAAllowance"
                        value={formik.values.LTAAllowance}
                        onChange={handleNumericChange("LTAAllowance")}
                        onWheel={(e) => e.target.blur()}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.LTAAllowance &&
                        formik.errors.LTAAllowance && (
                          <div className="text-red-500">
                            {formik.errors.LTAAllowance}
                          </div>
                        )}
                    </div>
                  </div>

                  {/*special allowances */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>Special Allowance</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Special Allowance"
                        type="number"
                        name="specialAllowance"
                        value={formik.values.specialAllowance}
                        onChange={handleNumericChange("specialAllowance")}
                        onWheel={(e) => e.target.blur()}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.specialAllowance &&
                        formik.errors.specialAllowance && (
                          <div className="text-red-500">
                            {formik.errors.specialAllowance}
                          </div>
                        )}
                    </div>
                  </div>

                  <hr />

                  {/* Deductions Section */}
                  <h2 className="text-lg font-semibold mt-2 mb-2">
                    Deductions
                  </h2>

                  {/* Income Tax Deduction */}
                  <div className="grid grid-cols-3 items-start gap-2">
                    <div className="col-span-1 pt-2">
                      <label>Income Tax (if any)</label>
                    </div>
                    <div className="col-span-2 space-y-2">
                      {/* Radio Buttons */}
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="isIncomeTaxApplicable"
                            value="yes"
                            checked={
                              formik.values.isIncomeTaxApplicable === "yes"
                            }
                            onChange={formik.handleChange}
                            disabled={!isEditing}
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="isIncomeTaxApplicable"
                            value="no"
                            checked={
                              formik.values.isIncomeTaxApplicable === "no"
                            }
                            onChange={formik.handleChange}
                            disabled={!isEditing}
                          />
                          No
                        </label>
                      </div>

                      {/* Income Tax Amount (only if yes) */}
                      {formik.values.isIncomeTaxApplicable === "yes" && (
                        <div>
                          <input
                            className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                            placeholder="Income Tax Deduction Amount"
                            type="number"
                            name="incomeTaxDeduction"
                            value={formik.values.incomeTaxDeduction}
                            onChange={formik.handleChange}
                            onWheel={(e) => e.target.blur()}
                            onBlur={formik.handleBlur}
                            readOnly={!isEditing}
                          />
                          {formik.touched.incomeTaxDeduction &&
                            formik.errors.incomeTaxDeduction && (
                              <div className="text-red-500">
                                {formik.errors.incomeTaxDeduction}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Tax */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>Professional Tax</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                        placeholder="Professional Tax"
                        type="number"
                        name="professionalTax"
                        value={formik.values.professionalTax}
                        onWheel={(e) => e.target.blur()}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={!isEditing}
                      />
                      {formik.touched.professionalTax &&
                        formik.errors.professionalTax && (
                          <div className="text-red-500">
                            {formik.errors.professionalTax}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* PF Account Number */}
                  <div className="grid grid-cols-3 items-center">
                    <div className="col-span-1">
                      <label>PF Account Number (optional)</label>
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner no-spinner"
                        placeholder="PF Account Number"
                        type="number"
                        name="pfAccountNumber"
                        value={formik.values.pfAccountNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onWheel={(e) => e.target.blur()}
                        readOnly={!isEditing}
                      />
                      {formik.touched.pfAccountNumber &&
                        formik.errors.pfAccountNumber && (
                          <div className="text-red-500">
                            {formik.errors.pfAccountNumber}
                          </div>
                        )}
                    </div>
                  </div>
                  {/* Advance Loan Deduction */}
                  <div className="grid grid-cols-3 items-start gap-2">
                    <div className="col-span-1 pt-2">
                      <label>Advance Loan (if any)</label>
                    </div>
                    <div className="col-span-2 space-y-2">
                      {/* Radio Buttons */}
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="hasAdvanceLoan"
                            value="yes"
                            checked={formik.values.hasAdvanceLoan === "yes"}
                            onChange={formik.handleChange}
                            disabled={!isEditing}
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="hasAdvanceLoan"
                            value="no"
                            checked={formik.values.hasAdvanceLoan === "no"}
                            onChange={formik.handleChange}
                            disabled={!isEditing}
                          />
                          No
                        </label>
                      </div>

                      {/* Amount Field – Visible only if Yes */}
                      {formik.values.hasAdvanceLoan === "yes" && (
                        <div>
                          <input
                            className="w-full px-2 py-2 border-2 border-gray-400 rounded-lg no-spinner"
                            placeholder="Advance Loan Amount"
                            type="number"
                            name="advanceLoanDeductions"
                            value={formik.values.advanceLoanDeductions}
                            onWheel={(e) => e.target.blur()}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            readOnly={!isEditing}
                          />
                          {formik.touched.advanceLoanDeductions &&
                            formik.errors.advanceLoanDeductions && (
                              <div className="text-red-500">
                                {formik.errors.advanceLoanDeductions}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
        {/* Tab 4: Welcome Kit Details */}
        <div>
          {currentTab === 3 && (
            <div>
              <form onSubmit={formik.handleSubmit}>
                <div className="space-y-2">
                  <div className="px-12">
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 p-8">
                      {coreHREmployeeDetails?.data?.welcomeKits?.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 relative"
                          >
                            {/* Checkbox - Show only when editing */}
                            {isEditing && (
                              <div className="absolute top-2 left-2 z-10">
                                <input
                                  // type="checkbox"
                                  checked={selectedWelcomeKits.includes(index)}
                                  onChange={() => handleWelcomeKitToggle(index)}
                                  className="w-5 h-5 cursor-pointer accent-blue-600"
                                />
                              </div>
                            )}
                            <div className="p-6 bg-white">
                              <h3 className="font-semibold text-gray-800 text-lg truncate">
                                {item.name}
                              </h3>
                            </div>

                            {/* Image Section - Show All Images */}
                            <div className="px-6">
                              {item.photos && item.photos.length > 0 ? (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                  {item.photos.map((photo, index) => (
                                    <div
                                      key={index}
                                      className="min-w-[110px] h-[110px] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                                    >
                                      <img
                                        src={photo}
                                        alt={`${item.name}-${index}`}
                                        className="w-full h-full object-contain cursor-pointer"
                                        onClick={() => setPreviewImage(photo)}
                                        onError={(e) => {
                                          e.target.src =
                                            "https://via.placeholder.com/150";
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="h-[110px] flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>

                            {/* Content Section */}
                            <div className="p-6 bg-white">
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    item.isAcknowledged
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {item.isAcknowledged
                                    ? "Acknowledged"
                                    : "Pending"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Empty State */}
                    {(!coreHREmployeeDetails?.data?.welcomeKits ||
                      coreHREmployeeDetails.data.welcomeKits.length === 0) && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No Welcome Kits Assigned</h3>

                        </div>
                      )}
                  </div>
                </div>
              </form>

              {isEditing && (
                <Link
                  className="text-blue-600 font-medium hover:underline flex items-center gap-1 pl-5"
                  onClick={dropdownopen}
                >
                  + Add More Welcome Kit
                </Link>
              )}
              {showDropdown && (
                <>
                  <div className="grid grid-cols-3 items-start gap-y-2">
                    {/* Label */}
                    <div className="w-full col-span-1 pl-8 pt-8">
                      <label className="font-medium text-gray-700">Welcome Kit Item:</label>
                    </div>

                    {/* Custom Multi-Select Dropdown */}
                    <div className="col-span-2 p-8">
                      <div className="relative" ref={dropdownRef}>
                        {/* Dropdown Button */}
                        <button
                          type="button"
                          onClick={() => setIsOpen(!isOpen)}
                          disabled={isLoading}
                          className="w-full min-h-[42px] px-3 py-2 text-left bg-white border-2 border-gray-400 rounded-lg hover:border-blue-600 focus:outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-between"
                        >
                          <span className={selectedItems.length === 0 ? "text-gray-400" : "text-gray-900"}>
                            {isLoading
                              ? "Loading welcome kits..."
                              : selectedItems.length === 0
                                ? "Select service feature..."
                                : getSelectedNames()}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                            {/* Search Input */}
                            <div className="p-2 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            {/* Options List */}
                            <div className="overflow-y-auto max-h-64">
                              {filteredData.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                  {isLoading ? "Loading..." : "No welcome kits available"}
                                </div>
                              ) : (
                                filteredData.map((item) => {
                                  const itemId = item.welcomeKitId || item._id;
                                  const isSelected = selectedItems.includes(itemId);

                                  return (
                                    <label
                                      key={itemId}
                                      className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleToggleItem(itemId)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <span className="ml-3 text-sm text-gray-900">
                                        {item.name || "Unnamed Kit"}
                                      </span>
                                    </label>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Cards Section */}
                  <div className="px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {selectedItems.map((itemId) => {
                        const item = welcomeKitData.find(
                          (kit) => (kit.welcomeKitId || kit._id) === itemId
                        );

                        if (!item) return null;

                        return (
                          <div
                            key={itemId}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 relative"
                          >
                            {/* Remove Button */}
                            <button
                              onClick={() => {
                                setSelectedItems(prev => prev.filter(id => id !== itemId));
                              }}
                              className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                              title="Remove item"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>

                            {/* Image */}
                            <div className="w-full h-48 bg-gray-100 overflow-hidden">
                              {item.photo ? (
                                <img
                                  src={item.photo}
                                  alt={item.name || "Welcome Kit Item"}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg
                                    className="w-16 h-16"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-800 text-lg truncate">
                                {item.name || "Unnamed Kit"}
                              </h3>
                              {item.welcomeKitId && (
                                <p className="text-xs text-gray-500 mt-1">
                                  ID: {item.welcomeKitId}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Empty State - Show when no items selected */}
                    {!isLoading && selectedItems.length === 0 && (
                      <div className="text-center py-12">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No items selected</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Select items from the dropdown above to display them here.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
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
        {/* Navigation Buttons */}
        <div className="w-full box-border flex items-center justify-center py-8">
          {isEditing && (
            <div className="w-full box-border flex items-center justify-center py-8">
              <Button
                variant={1}
                type="button" // Always button type, we handle click manually
                text={
                  currentTab === tabs.length - 1 ? "Submit" : "Save and Proceed"
                }
                onClick={handleNext}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;