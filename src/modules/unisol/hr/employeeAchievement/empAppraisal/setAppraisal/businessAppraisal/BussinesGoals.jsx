import React, { useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Button from "../../../../../../../components/Button";
import { FaGraduationCap } from "react-icons/fa";
import { useTheme } from "../../../../../../../hooks/theme/useTheme";
import BreadCrumb from "../../../../../../../components/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import usePoliciesCategory from "../../../../../../../hooks/policiesCatagory/usePoliciesCatagory";
import useAppraisal from "../../../../../../../hooks/unisol/empAchievement/useAppraisal";

/* ---------------- Validation ---------------- */

const validationSchema = Yup.object({
  goalId: Yup.string().required("Goal is required"),
  payrollGrades: Yup.array().min(1, "Select at least one payroll grade"),
  objectiveName: Yup.string().required("Objective name is required"),
  measures: Yup.string().required("Measures is required"),
  target: Yup.string().required("Target is required"),
  weightage: Yup.number()
    .typeError("Weightage must be a number")
    .min(0)
    .max(100)
    .required("Weightage is required"),
  suggestedRating: Yup.number()
    .typeError("Rating must be a number")
    .min(0)
    .max(10)
    .required("Suggested rating is required"),
});

export default function BusinessGoals() {
  const {
    businessAppraisalDetails,
    setBusinessAppraisal,
    fetchAppraisalGoalDrop,
    updateBusinessAppraisal,
    appraisalGoalDrop,
    fetchBusinessAppraisalDetails,
  } = useAppraisal();

  const { payrollGrade, fetchPayrollGrade } = usePoliciesCategory();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const { id } = useParams();
  // const id = "698f0af1d0f7307e241967a5"; // edit mode

  useEffect(() => {
    fetchPayrollGrade();
    fetchAppraisalGoalDrop();
    if (id) fetchBusinessAppraisalDetails(id);
  }, [id]);

  console.log("businessAppraisalDetails", businessAppraisalDetails);

  const payrollOptions = useMemo(
    () =>
      payrollGrade?.map((grade) => ({
        label: grade,
        value: grade,
      })) || [],
    [payrollGrade]
  );

  const goalOptions = useMemo(
    () =>
      appraisalGoalDrop?.map((goal) => ({
        label: goal.name,
        value: goal._id,
      })) || [],
    [appraisalGoalDrop]
  );

  /* ---------------- Formik ---------------- */

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      goalId: businessAppraisalDetails?.goalId || "",
      payrollGrades: businessAppraisalDetails?.payrollGrades || [],
      objectiveName: businessAppraisalDetails?.objectiveName || "",
      measures: businessAppraisalDetails?.measures || "",
      target: businessAppraisalDetails?.target || "",
      weightage: businessAppraisalDetails?.weightage || "",
      suggestedRating: businessAppraisalDetails?.suggestedRating || "",
    },

    validationSchema,

    onSubmit: async (values) => {
      console.log("values", values);
      try {
        let isSuccess
        if (id) {
          isSuccess = await updateBusinessAppraisal(id, values);
        } else {
          isSuccess = await setBusinessAppraisal(values);
        }
        if (isSuccess) {
          navigate("/hr/employeeAchievement/appraisalList/setAppraisal");
        }
      } catch (error) {
        console.error("Error saving:", error);
      }
    },
  });

  console.log("formik.values", formik.values);
  console.log("formik.errors", formik.errors);

  /* ---------------- JSX ---------------- */

  return (
    <div>
      <BreadCrumb
        linkText={[
          { text: "Employee Achievement", href: "/hr/employeeAchievement" },
          {
            text: "Employee's Appraisal List",
            href: "/hr/employeeAchievement/appraisalList",
          },
          {
            text: "Set Appraisal",
            href: "/hr/employeeAchievement/appraisalList/setAppraisal",
          },
          { text: "Business Goals Setting" },
        ]}
      />

      {/* Header */}
      <div className="py-4 px-8 flex justify-between rounded-2xl bg-white shadow-lg mb-4">
        <div className="flex items-center gap-3">
          <FaGraduationCap
            style={{ color: theme.primaryColor, fontSize: 28 }}
          />
          <span className="text-2xl font-bold">
            {id ? "Edit Business Goal" : "Set Business Goal"}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow">
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Goal */}
          <div>
            <label className="block mb-1">Goal</label>
            <Select
              options={goalOptions}
              value={goalOptions.find(
                (opt) => opt.value === formik.values.goalId
              )}
              onChange={(opt) =>
                formik.setFieldValue("goalId", opt?.value || "")
              }
            />
            {formik.touched.goalId && formik.errors.goalId && (
              <p className="text-red-500 text-sm">{formik.errors.goalId}</p>
            )}
          </div>

          {/* Payroll Grades */}
          <div>
            <label className="block mb-1">Payroll Grades</label>
            <Select
              isMulti
              options={payrollOptions}
              value={payrollOptions.filter((opt) =>
                formik.values.payrollGrades.includes(opt.value)
              )}
              onChange={(opts) =>
                formik.setFieldValue(
                  "payrollGrades",
                  opts ? opts.map((o) => o.value) : []
                )
              }
            />
            {formik.touched.payrollGrades &&
              formik.errors.payrollGrades && (
                <p className="text-red-500 text-sm">
                  {formik.errors.payrollGrades}
                </p>
              )}
          </div>

          {/* Objective */}
          <div>
            <label>Objective Name</label>
            <input
              type="text"
              className="input w-full border"
              {...formik.getFieldProps("objectiveName")}
            />
          </div>

          {/* Measures */}
          <div>
            <label>Measures</label>
            <input
              type="text"
              className="input w-full border"
              {...formik.getFieldProps("measures")}
            />
          </div>

          {/* Target */}
          <div>
            <label>Target</label>
            <input
              type="text"
              className="input w-full border"
              {...formik.getFieldProps("target")}
            />
          </div>

          {/* Weightage */}
          <div>
            <label>Weightage %</label>
            <input
              type="number"
              className="input w-full border"
              {...formik.getFieldProps("weightage")}
            />
          </div>

          {/* Suggested Rating */}
          <div>
            <label>Suggested Rating</label>
            <input
              type="number"
              className="input w-full border"
              {...formik.getFieldProps("suggestedRating")}
            />
          </div>

          {/* Save */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              text={id ? "Update" : "Save"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
