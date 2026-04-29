// Assuming you are using TypeScript, add proper return types for these functions
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import conf from "../../config/index";
import {
  userAuthState,
  userForgotPasswordAtom,
  confirmPasswordAtom,
  verifyOtpAtom,
  sAdminResponseAtom,
  employeeLoginDataAtom,
  hrDetailsAtom,
} from "../../state/isAuthenticatedAtom";
import useFetch from "../useFetch";
import { useTheme } from "../theme/useTheme";
import { toast } from "react-toastify";

export const useSignIn = () => {
  const { switchTheme } = useTheme();
  const navigate = useNavigate();
  const [fetchData] = useFetch();
  const setUserInfo = useSetRecoilState(userAuthState);
  const [loading, setLoading] = useState(false);
  const [sAdminResponse, setSAdminResponse] = useState(sAdminResponseAtom);
  const [employeeLoginData, setEmployeeLoginData] = useRecoilState(
    employeeLoginDataAtom
  );

  const [hrDetails, setHRDetails] = useRecoilState(hrDetailsAtom);
  const [password, setPassword] = useRecoilState(userForgotPasswordAtom);
  const [confirmPass, setConfirmPass] = useRecoilState(confirmPasswordAtom);
  const [otpRes, setOtpRes] = useRecoilState(verifyOtpAtom);

  // ---------------- Super Admin Login -------------------

  const superAdminLogin = async (email, password) => {
    const data = { email, password };
    setLoading(true);
    try {
      const url = new URL(`${conf.apiBaseUrl}users/login`);
      const res = await fetchData({
        method: "POST",
        url: url.toString(),
        data,
      });
      console.log("res", res);
      if (res) {
        setLoading(false);
        setSAdminResponse(res);
        sessionStorage.setItem("token", res?.token);
        sessionStorage.setItem("superAdminId", res?.id);
        sessionStorage.setItem("companyId", res?.companyId);
        sessionStorage.setItem("name", res?.name);
        sessionStorage.setItem("companyName", res?.companyName);
        sessionStorage.setItem("isSuperAdminLogin", res?.isSuperAdminLogin);
        switchTheme(res?.companyName);
        setUserInfo({
          isAuthenticated: true,
        });
        toast.success(res?.message);
        navigate("/hrDashboard");
        return true;
      }
    } catch (error) {
      toast.error("Invalid Credentials");
      // eslint-disable-next-line no-console
      console.error("Error fetching Sign in:", error);
      setLoading(false);
      return false;
    }
  };

  // ------------------- HR Login -------------------------

  const hrLogin = async (email, password) => {
    const data = { email, password };
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}hrLogin/login`,
        data,
      });
      if (res) {
        setLoading(false);
        toast.success(res?.message);
        setHRDetails(res?.hrPrivilege);
        sessionStorage.setItem("companyName", res?.companyName);
        sessionStorage.setItem("companyId", res?.company_id);
        sessionStorage.setItem("token", res?.token);
        sessionStorage.setItem("empId", res?.employeeId);
        sessionStorage.setItem("name", res?.fullName);
        sessionStorage.setItem("profile", res?.photo);
        sessionStorage.setItem("dept", res?.department);
        sessionStorage.setItem("role", res?.designation);
        sessionStorage.setItem("isHrLogin", res?.isHrLogin);
        switchTheme(sessionStorage.getItem("companyName"));
        setUserInfo({
          isAuthenticated: true,
        });
        navigate("/hrDashboard");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Invalid Credentials");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Employee Login -----------------------

  const employeeLogin = async (officialEmailId, empPassword) => {
    const data = { officialEmailId, empPassword };
    setLoading(true);
    try {
      // const url = new URL(`${conf.apiBaseUrl}hrmEmployee/employeeLogin`);
      const url = new URL(`${conf.apiBaseUrl}employees/loginEmployee`);
      const res = await fetchData({
        method: "POST",
        url: url.toString(),
        data,
      });
      console.log("res", res);
      if (res) {
        setLoading(false);
        setEmployeeLoginData({ type: "success", message: res?.message });
        // Store the token and user info
        sessionStorage.setItem("token", res?.token);
        sessionStorage.setItem("empId", res?.id);
        sessionStorage.setItem("companyId", res?.companyId);
        sessionStorage.setItem("companyName", res?.companyName);
        sessionStorage.setItem("name", res?.name);
        sessionStorage.setItem("profile", res?.photo);
        sessionStorage.setItem("payrollGrade", res?.payrollGrade);
        sessionStorage.setItem("isEmployeeLogin", res?.isEmployeeLogin);
        sessionStorage.setItem(
          "attendanceStatus",
          res?.todayAttendance?.status
        );
        switchTheme(sessionStorage.getItem("companyName"));
        setUserInfo({
          isAuthenticated: true,
        });
        toast.success(res?.message);
        navigate("/EmployeeDashboard");
        return true;
      }
    } catch (error) {
      toast.error("Invalid Credentials");
      // eslint-disable-next-line no-console
      console.error("Error fetching Sign in:", error);
      setLoading(false);
      return false;
    }
  };

  // ---------------- Forgot Password ---------------------

  const forgotPassword = async (data) => {
    setLoading(true);
    try {
      const url = new URL(`${conf.apiBaseUrl}users/forgot-password`);
      const res = await fetchData({
        method: "POST",
        url: url.toString(),
        data: data,
      });

      console.log("res", res);
      if (res) {
          toast.success(res.message)
        setPassword(res);
        setLoading(false);
      }
      if (!loading) {
        navigate("/verify-otp");
      }
    } catch (error) {
      console.error("Error fetching forgot password:", error);
      toast.error(error.response.data.message);
      
      setLoading(false);
    }
  };

  // ---------------- Confirm Password --------------------

  const confirmPassword = async (data) => {
    setLoading(true);
    try {
      const url = new URL(`${conf.apiBaseUrl}users/reset-password`);
      const res = await fetchData({
        method: "POST",
        url: url.toString(),
        data: data,
      });
      console.log("res", res);
      if (res) {
         toast.success(res.message)
        setConfirmPass(res);
        setLoading(false);
      }
      if (!loading) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching forgot password:", error);
         toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // ---------------- Verify OTP --------------------------

  // const verifyOtp = async (data) => {
  //   setLoading(true);
  //   try {
  //     const url = new URL(`${conf.apiBaseUrl}users/verify-otp`);
  //     const res = await fetchData({
  //       method: "POST",
  //       url: url.toString(),
  //       data: data,
  //     });
  //     if (res) {
  //     toast.success(res.message)
  //       setOtpRes(res);
  //       setLoading(false);
  //     }
  //     if (!loading) {
  //       navigate("/confirm-password");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Verify Otp:", error);
  //     toast.error(error.response.data.message);
  //     setLoading(false);
  //   }
  // };


const verifyOtp = async (data) => {
  setLoading(true);
  try {
    const url = new URL(`${conf.apiBaseUrl}users/verify-otp`);
    const res = await fetchData({
      method: "POST",
      url: url.toString(),
      data: data,
    });

    if (res) {
      toast.success(res.message);
      setOtpRes(res);

      setLoading(false);

      // ✅ Handle navigation only here
      navigate("/confirm-password");
    }
  } catch (error) {
    console.error("Error fetching Verify Otp:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};



  // ---------------- Reset Super Admin Login ---------------

  const resetSuperAdmin = () => {
    setSAdminResponse(null);
  };

  // --------------- Reset HR Login ----------------------

  const resetHRLogin = () => {
    setHRDetails(null);
  };

  // ---------------- Reset Employee Login ------------------

  const resetEmployee = () => {
    employeeLoginData(null);
  };

  return {
    superAdminLogin,
    employeeLoginData,
    employeeLogin,
    resetEmployee,
    sAdminResponse,
    loading,
    resetSuperAdmin,
    forgotPassword,
    password,
    verifyOtp,
    otpRes,
    confirmPassword,
    confirmPass,
    hrLogin,
    hrDetails,
    resetHRLogin,
  };
};
