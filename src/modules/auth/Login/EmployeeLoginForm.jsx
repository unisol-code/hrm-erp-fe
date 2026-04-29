import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from "react-router-dom";
import validator from "validator";

const EmployeeLoginForm = ({ loading, onSubmit, initialValues }) => {
  const validationSchema = Yup.object({
    officialEmailId: Yup.string()
      .email("Invalid email address")
      .required("Official Email is required"),
    empPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const sanitizedEmail = validator.trim(values.officialEmailId);
      const sanitizedPassword = validator.trim(values.empPassword);
      await onSubmit(sanitizedEmail, sanitizedPassword, values.rememberMe);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full m-auto">
      <div className="flex flex-col items-center justify-center w-full px-10 space-y-8 md:my-4">
        <input
          type="email"
          className="rounded-[41px] placeholder:text-black placeholder:font-medium bg-[#E1D4CB] text-black font-semibold text-center py-2 text-xl w-full"
          placeholder="Email"
          name="officialEmailId"
          value={formik.values.officialEmailId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.officialEmailId && formik.errors.officialEmailId ? (
          <div className="text-red-500">{formik.errors.officialEmailId}</div>
        ) : null}
        <input
          type="password"
          className="rounded-[41px] placeholder:text-black placeholder:font-medium text-center bg-[#E1D4CB] text-xl py-2 w-full"
          placeholder="Password"
          name="empPassword"
          value={formik.values.empPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.empPassword && formik.errors.empPassword ? (
          <div className="text-red-500">{formik.errors.empPassword}</div>
        ) : null}
      </div>
      <div className="flex justify-between px-16 py-4 mb-6 font-semibold">
        <div className="mx-2">
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              onChange={formik.handleChange}
              checked={formik.values.rememberMe}
            />
            Remember Me
          </label>
        </div>
        <Link to={"/reset-password"}>
          {/* <p className="hover:text-blue-600">Forgot password?</p> */}
        </Link>
      </div>
      <div className="flex justify-center w-full py-4 text-center">
        <button
          type="submit"
          className="text-[16px] flex justify-center items-center text-center font-bold bg-[#E1D4CB]          h-[40px] rounded-full hover:bg-bg-[#E1D4CB] hover:shadow-md w-[120px] disabled:bg-[#D3D3D3]"
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <h2 className="">Login</h2>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeLoginForm;