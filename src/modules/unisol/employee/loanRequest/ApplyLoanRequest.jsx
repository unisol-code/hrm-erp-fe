import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import useEmpLoanRequest from "../../../../hooks/unisol/loanRequest/useEmpLoanRequest";
import ApplyLoanRequestForm from "./ApplyLoanRequestForm";
import * as Yup from 'yup';
import useEmpApplyLeave from "../../../../hooks/unisol/empLeave/useEmpApplyLeave";

export const loanRequestValidationSchema = Yup.object().shape({
  applyTo : Yup.string().required('Please select the approver'),
  loanType: Yup.string().required('Loan type is required'),
  loanAmount: Yup.number()
    .required('Loan amount is required')
    .positive('Loan amount must be positive')
    .min(1000, 'Minimum loan amount is ₹1000'),
  reasonForLoan: Yup.string()
    .required('Reason for loan is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters'),
  loanRequestDate: Yup.date().required('Loan request date is required'),
  preferredRepaymentMethod: Yup.string().required('Repayment method is required'),
  repaymentTenureInMonths: Yup.number()
    .required('Repayment tenure is required')
    .integer('Must be a whole number')
    .min(1, 'Minimum tenure is 1 month')
    .max(60, 'Maximum tenure is 60 months'),
  // deductionStartMonth: Yup.string().required('Deduction start month is required'),
  monthlyDeductionAmount: Yup.string(),
  employerDeclaration: Yup.boolean()
    .oneOf([true], 'You must accept the declaration'),
});

const ApplyLoanRequest = () => {
  const {
    loading,
    empBasicDetail,
    fetchEmpBasicDetail,
    fetchEmpLoanRequestDetail,
    empLoanRequestDetail,
    applyLoanRequest,
    updateLoanRequest
  } = useEmpLoanRequest();

  const { userForLeaveApply, userForApply } = useEmpApplyLeave();

  const navigate = useNavigate();
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEmpBasicDetail();
    userForLeaveApply();
    if (id) {
      fetchEmpLoanRequestDetail(id);
    }
  }, [id]);

  // Set form initial values when editing
  useEffect(() => {
    if (id && empLoanRequestDetail) {
      formik.setValues({
        loanType: empLoanRequestDetail.loanType || "",
        applyTo: empLoanRequestDetail.applyTo || "",
        loanAmount: empLoanRequestDetail.loanAmount || "",
        reasonForLoan: empLoanRequestDetail.reasonForLoan || "",
        loanRequestDate: empLoanRequestDetail.loanRequestDate || new Date().toISOString().split("T")[0],
        preferredRepaymentMethod: empLoanRequestDetail.preferredRepaymentMethod || "Salary Deduction",
        repaymentTenureInMonths: empLoanRequestDetail.repaymentTenureInMonths || "",
        // deductionStartMonth: empLoanRequestDetail.deductionStartMonth || "",
        monthlyDeductionAmount: empLoanRequestDetail.monthlyDeductionAmount || "",
        employerDeclaration: empLoanRequestDetail.employerDeclaration || false,
      });
      // Set documents if they exist
      if (empLoanRequestDetail.documents && Array.isArray(empLoanRequestDetail.documents)) {
        setDocuments(empLoanRequestDetail.documents);
      }
    }
  }, [id, empLoanRequestDetail]);

  const formik = useFormik({
    initialValues: {
      loanType: "",
      loanAmount: "",
      reasonForLoan: "",
      loanRequestDate: new Date().toISOString().split("T")[0],
      preferredRepaymentMethod: "Salary Deduction",
      repaymentTenureInMonths: "",
      // deductionStartMonth: "",
      monthlyDeductionAmount: "",
      employerDeclaration: false,


    },
    validationSchema: loanRequestValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Create FormData for multipart/form-data submission
        const formData = new FormData();

        // Add employeeId first
        formData.append('employeeId', empBasicDetail?.employeeId || '');

        // Add all form fields to FormData
        formData.append('loanType', values.loanType);
        formData.append('applyTo', values.applyTo);
        formData.append('loanAmount', values.loanAmount);
        formData.append('reasonForLoan', values.reasonForLoan);
        formData.append('loanRequestDate', values.loanRequestDate);
        formData.append('preferredRepaymentMethod', values.preferredRepaymentMethod);
        formData.append('repaymentTenureInMonths', values.repaymentTenureInMonths);
        // formData.append('deductionStartMonth', values.deductionStartMonth);
        formData.append('monthlyDeductionAmount', values.monthlyDeductionAmount);

        // CRITICAL: Add file documents - ensure at least one exists
        if (documents.length === 0) {
          alert('Please upload at least one document');
          setIsSubmitting(false);
          return;
        }

        // Add new files being uploaded
        const newFiles = documents.filter(doc => doc.file);
        newFiles.forEach((doc) => {
          formData.append('documents', doc.file);
        });

        // If editing and there are existing documents (without file object)
        if (id) {
          const existingDocs = documents.filter(doc => !doc.file);
          if (existingDocs.length > 0) {
            formData.append('existingDocuments', JSON.stringify(existingDocs));
          }
        }

        console.log("Form Data being sent:");
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        if (id) {
          // Update existing loan request
          await updateLoanRequest(id, formData);
        } else {
          // Create new loan request - must have new files
          if (newFiles.length === 0) {
            alert('Please upload at least one document');
            setIsSubmitting(false);
            return;
          }
          await applyLoanRequest(formData);
        }

        // Navigate back on success
        navigate("/emp/loanrequest");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(error.message || 'Error submitting loan request');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      file: file,
    }));
    setDocuments((prev) => [...prev, ...newDocuments]);
  };

  const handleDeleteDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate monthly deduction whenever loanAmount or repaymentTenureInMonths changes
  useEffect(() => {
    if (formik.values.loanAmount && formik.values.repaymentTenureInMonths) {
      const amount = parseFloat(formik.values.loanAmount);
      const tenure = parseInt(formik.values.repaymentTenureInMonths);
      if (!isNaN(amount) && !isNaN(tenure) && tenure > 0) {
        const monthly = (amount / tenure).toFixed(2);
        formik.setFieldValue('monthlyDeductionAmount', monthly);
      }
    } else {
      formik.setFieldValue('monthlyDeductionAmount', '');
    }
  }, [formik.values.loanAmount, formik.values.repaymentTenureInMonths]);

  // ADD THIS FUNCTION - Validation logic for loan and tenure
  const validateLoanAndTenure = () => {
    const salary = parseFloat(empBasicDetail?.salary) || 0;
    const loanAmount = parseFloat(formik.values.loanAmount) || 0;
    const tenure = parseInt(formik.values.repaymentTenureInMonths) || 0;

    if (!salary || !loanAmount || !tenure) return null;

    const monthlyDeduction = loanAmount / tenure;
    const minRequiredTenure = Math.ceil(loanAmount / salary);
    const maxAffordableLoan = salary * tenure;

    // Only check if monthly deduction exceeds 100% of salary
    if (monthlyDeduction > salary) {
      return {
        isValid: false,
        message: `Monthly deduction (₹${monthlyDeduction.toFixed(2)}) cannot exceed your monthly salary (₹${salary.toFixed(2)}). Minimum ${minRequiredTenure} months required.`,
        type: 'tenure'
      };
    }

    if (loanAmount > maxAffordableLoan) {
      return {
        isValid: false,
        message: `For ${tenure} months tenure, maximum loan is ₹${maxAffordableLoan.toFixed(2)} (based on your monthly salary)`,
        type: 'amount'
      };
    }

    // Warning if deduction is more than 70% (but still allow it)
    if (monthlyDeduction > salary * 0.7) {
      return {
        isValid: true,
        warning: `⚠️ High deduction: ₹${monthlyDeduction.toFixed(2)} per month (${((monthlyDeduction / salary) * 100).toFixed(0)}% of salary). Please ensure you can manage this.`,
        type: 'warning'
      };
    }

    return { isValid: true };
  };

  // Check if form is valid and ready for submission
  const isFormValid = () => {
    const validation = validateLoanAndTenure();
    return (
      formik.values.loanType &&
      formik.values.applyTo &&
      formik.values.loanAmount &&
      formik.values.reasonForLoan &&
      formik.values.preferredRepaymentMethod &&
      formik.values.repaymentTenureInMonths &&
      // formik.values.deductionStartMonth &&
      formik.values.employerDeclaration &&
      documents.length > 0 &&

      (!validation || validation.isValid)

    );
  };

  return (
    <ApplyLoanRequestForm
      formik={formik}
      isSubmitting={isSubmitting}
      loading={loading}
      empBasicDetail={empBasicDetail}
      userForApply={userForApply}
      documents={documents}
      id={id}
      navigate={navigate}
      handleFileUpload={handleFileUpload}
      handleDeleteDocument={handleDeleteDocument}
      isFormValid={isFormValid}
      validateLoanAndTenure={validateLoanAndTenure}
    />
  );
};

export default ApplyLoanRequest;