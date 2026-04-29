import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ApplyResignationForm from "./ApplyResignationForm";
import { useTheme } from "../../../../hooks/theme/useTheme";
import useEmpApplyLeave from "../../../../hooks/unisol/empLeave/useEmpApplyLeave";
import useEmpExpense  from "../../../../hooks/unisol/empExpense/useEmpExpense";
import useResignation from "../../../../hooks/unisol/resignation/useResignation";

const ApplyResignation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const {userForLeaveApply,userForApply} = useEmpApplyLeave();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const empId = sessionStorage.getItem("empId");
  const {fetachNameAndDepartment,nameDeptManager}= useEmpExpense();
  const {fetchResignationDetailById,resignationData,
fetchEmployeeLoanResignationDetails,loanDetails,createResignation, updateResignationById,}=useResignation();
  const isEditMode = Boolean(id);
  const noticePeriodDays =
  parseInt(nameDeptManager?.data?.NoticePeriod, 10) || 0;
  useEffect(() => {
    fetachNameAndDepartment(empId);
  },[empId]);

  useEffect(()=>{
    fetchEmployeeLoanResignationDetails();
  },[]);
  console.log("loanDetailsInApplyResignation",loanDetails);

  useEffect(() => {
  if (isEditMode) {
    fetchResignationDetailById(id);
  }
}, [id]);
  
  // const [empBasicDetail, setEmpBasicDetail] = useState({
  //   employeeId: "EMP001",
  //   employeeName: "John Doe",
  //   department: "IT Department",
  //   designation: "Senior Developer",
  //   joiningDate: "2020-01-15",
  //   employmentType: "Full Time",
  //   reportingManager: "Jane Smith",
  //   noticePeriod: "60",
  //   hasActiveLoan: true,
  //   outstandingLoanAmount: "50000",
  // });

  useEffect(() => {
    userForLeaveApply();
  }, []);
  console.log("userForApply",userForApply);

  const validationSchema = Yup.object({
    resignationReason: Yup.string().required("Resignation reason is required"),
    otherReason: Yup.string().when("resignationReason", {
      is: "Other",
      then: (schema) => schema.required("Please specify other reason"),
      otherwise: (schema) => schema.notRequired(),
    }),
    detailedRemarks: Yup.string().required("Detailed remarks are required"),
    applyToHR: Yup.string().when([], {
     is: () => loanDetails?.data?.anyActiveLoan,

      then: (schema) => schema.required("Please select an HR manager"),
      otherwise: (schema) => schema.notRequired(),
    }),
    employeeDeclaration: Yup.boolean()
      .oneOf([true], "You must accept the declaration")
      .required("Declaration is required"),
  });

const formik = useFormik({
  enableReinitialize: true,
  initialValues: {
    offboardingType: "Resignation",
    resignationReason: resignationData?.resignationReason || "",
    otherReason: "",
    detailedRemarks: resignationData?.detailedRemarks || "",
    noticePeriod: resignationData?.noticePeriodDays || "",
    resignationDate: resignationData?.resignationDate
      ? resignationData.resignationDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
    agreeToSettlement: resignationData?.finalSettlement || false,
    applyToHR: resignationData?.applyTo || "",
    employeeDeclaration: true,
  },

    validationSchema: validationSchema,
onSubmit: async (values) => {
  const payload = {
    resignationReason: values.resignationReason,
    resignationDate: values.resignationDate,
    detailedRemarks: values.detailedRemarks,
    noticePeriodDays: noticePeriodDays,
    applyTo: values.applyToHR,
    anyActiveLoan: loanDetails?.anyActiveLoan ? "true" : "false",
    outstandingLoanAmount:loanDetails?.outstandingLoanAmount || 0,
    finalSettlement: values.agreeToSettlement,
  };

  if (isEditMode) {
    // 🔁 EDIT
    updateResignationById(id, payload);
  } else {
    // ➕ APPLY
    createResignation({
      ...payload,
      offboardingtype: "Resignation",
    });
  }
},

  });

  // console.log ("formik values",l);
  // useEffect(() => {
  //   if (isEditMode) {
  //     setLoading(true);
      
  //     setTimeout(() => {
  //       setEmpBasicDetail({
  //         employeeId: "EMP001",
  //         employeeName: "John Doe",
  //         department: "IT Department",
  //         designation: "Senior Developer",
  //         joiningDate: "2020-01-15",
  //         employmentType: "Full Time",
  //         reportingManager: "Jane Smith",
  //         noticePeriod: "60",
  //         hasActiveLoan: "true",
  //         outstandingLoanAmount: "50000",
  //       });
        
  //       formik.setValues({
  //         offboardingType: "Resignation",
  //         resignationReason: "Better Opportunity",
  //         otherReason: "",
  //         detailedRemarks: "Moving to a better opportunity with career growth prospects.",
  //         noticePeriod: "60",
  //         resignationDate: "2024-01-15",
  //         approvalStatus: "Pending",
  //         noticePeriodStartDate: "2024-01-16",
  //         lastWorkingDate: "2024-03-16",
  //         agreeToSettlement: true,
  //         applyToHR: "HR Manager 1",
  //         employeeDeclaration: true,
  //       });
  //       setLoading(false);
  //     }, 500);
  //   }
  // }, [isEditMode]);

 const isFormValid = () => {
  const hasRequiredFields =
    formik.values.resignationReason &&
    formik.values.detailedRemarks &&
    formik.values.employeeDeclaration;

  const hasOtherReason =
    formik.values.resignationReason !== "Other" ||
    (formik.values.resignationReason === "Other" &&
      formik.values.otherReason);

  const hasHRManager =
    !loanDetails?.data?.anyActiveLoan ||
    (loanDetails?.data?.anyActiveLoan && formik.values.applyToHR);

  return (
    hasRequiredFields &&
    hasOtherReason &&
    hasHRManager &&
    !Object.keys(formik.errors).length
  );
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ApplyResignationForm
      formik={formik}
      isSubmitting={isSubmitting}
      loading={loading}
      // empBasicDetail={nameDeptManager || loanDetails}
       employee={nameDeptManager}
       loan={loanDetails}
      id={id}
      navigate={navigate}
      isFormValid={isFormValid}
      hrManagers={userForApply}
      theme={theme}
    />
  );
};

export default ApplyResignation;