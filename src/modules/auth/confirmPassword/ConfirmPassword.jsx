import ConfirmPasswordImage from "../../../assets/images/confirmPasswordImage.png";
import { useSignIn } from "../../../hooks/auth/useSignIn";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const ConfirmPassword = () => {
  const { confirmPassword, confirmPass,loading } = useSignIn();

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Enter Password and Confirm Password must match")
      .required("Confirm Password is required"),
  });

  const email = sessionStorage.getItem('email');

  const formik = useFormik({
    initialValues: {
      password: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const data = {
          email: email,
          password: values.password
         
        };
        confirmPassword(data);
      


      } catch (error) {
        console.error("Error during sign-in:", error);
         toast.error("Something went wrong. Please try again.");
      }
    },
  });


  return (
    <div className="grid w-full min-h-screen grid-cols-2">
      <div className="bg-[#E5E4E0] flex flex-col items-center px-4 ">
        <h1 className="font-bold text-3xl mt-[100px]">Confirm Password</h1>
        <p className="w-[75%] my-[40px] text-[20px] text-center">
          Set your new password. Enter and confirm your password to reset it.
        </p>
        <form onSubmit={formik.handleSubmit} className="my-[40px] w-full flex flex-col gap-[30px]">
          <input
            type="password"
            required
            className="rounded-full h-[60px] bg-[#E1D4CB] placeholder-gray-800 px-4 w-[70%] mx-auto"
            placeholder="Enter password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.password && formik.touched.password && (
            <div className="text-sm text-center text-red-500">{formik.errors.password}</div>
          )}
          <input
            type="password"
            required
            className="rounded-full h-[60px] bg-[#E1D4CB] placeholder-gray-800 px-4 w-[70%] mx-auto"
            placeholder="Confirm password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div className="text-sm text-center text-red-500">{formik.errors.confirmPassword}</div>
          )}
      <div className="flex justify-center w-full">
            <button
            type="submit"
            disabled={loading} 
            className={`rounded-full px-8 py-3 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#E5C1A9]"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"} 
          </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center items-center bg-[#E9EBF7]">
        <div className="h-[600px] flex justify-center items-center">
          <img src={ConfirmPasswordImage} className="object-contain w-full h-full" alt="" />
        </div>
      </div>
    </div>
  );
};

export default ConfirmPassword;
