import React, { useEffect, useState } from "react";
import HRM from "../../../assets/images/HRM logo.png";
import { useSignIn } from "../../../hooks/auth/useSignIn";
import { Link, useNavigate } from "react-router-dom";
import SuperAdminLoginForm from "./SuperAdminLoginForm";
import HRLoginForm from "./HRLoginForm";
import EmployeeLoginForm from "./EmployeeLoginForm";

const LoginTabs = () => {
  const navigate = useNavigate();
  const {
    superAdminLogin,
    employeeLogin,
    hrLogin,
    loading,
    resetSuperAdmin,
    resetHRLogin,
  } = useSignIn();

  const [activeTab, setActiveTab] = useState("superadmin");
  const [initialValues, setInitialValues] = useState({
    superadmin: {
      email: "",
      password: "",
      rememberMe: false,
    },
    hr: {
      email: "",
      password: "",
      rememberMe: false,
    },
    employee: {
      officialEmailId: "",
      empPassword: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    // Load saved credentials for each form type
    const superAdminEmail = localStorage.getItem("email");
    const superAdminPassword = localStorage.getItem("password");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    const hrEmail = localStorage.getItem("email");
    const hrPassword = localStorage.getItem("password");
    
    const empEmail = localStorage.getItem("officialEmailId");
    const empPassword = localStorage.getItem("empPassword");

    setInitialValues({
      superadmin: {
        email: superAdminEmail || "",
        password: superAdminPassword || "",
        rememberMe: rememberMe || false,
      },
      hr: {
        email: hrEmail || "",
        password: hrPassword || "",
        rememberMe: rememberMe || false,
      },
      employee: {
        officialEmailId: empEmail || "",
        empPassword: empPassword || "",
        rememberMe: rememberMe || false,
      },
    });
  }, []);

  const handleSuperAdminSubmit = async (email, password, rememberMe) => {
    try {
      if (!email.startsWith("users")) {
        await superAdminLogin(email, password);
      } else {
        console.log("Users must log in through the admin form.");
      }

      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", true);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleHRSubmit = async (email, password, rememberMe) => {
    try {
      if (!email.startsWith("users")) {
        await hrLogin(email, password);
      } else {
        console.log("Users must log in through the admin form.");
      }

      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", true);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleEmployeeSubmit = async (email, password, rememberMe) => {
    try {
      if (!email.startsWith("users")) {
        await employeeLogin(email, password);

        if (rememberMe) {
          localStorage.setItem("officialEmailId", email);
          localStorage.setItem("empPassword", password);
          localStorage.setItem("rememberMe", true);
        } else {
          localStorage.removeItem("officialEmailId");
          localStorage.removeItem("empPassword");
          localStorage.removeItem("rememberMe");
        }
      } else {
        console.log("Users must log in through the admin form.");
      }
    } catch (error) {
      console.error("Error during employee sign-in:", error);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* img */}
        <div className="bg-[#E9EBF7] space-y-10 md:w-1/2 md:py-16 py-14 flex flex-col ">
          <img
            src={HRM}
            alt=""
            className="md:h-[200px] md:w-[297px] h-[100px] w-[200px] m-auto"
          />
          <div className="flex px-14 ">
            {" "}
            <p className="mx-5 text-left md:text-2xl">
              Welcome to the HRM System Log in to manage your personal
              information, time and attendance, and performance reviews
              securely. Your data is protected with the highest security
              standards.
            </p>
          </div>
        </div>
        {/* form */}
        <div className="md:w-1/2 flex flex-col justify-center bg-[#E5E4E0]">
          <div className="flex flex-col items-center justify-center w-full px-10 space-y-6 ">
            <div className="flex flex-col items-center justify-center w-full mt-6 overflow-hidden bg-white rounded-full shadow-lg md:flex-row">
              <button
                className={`md:w-1/3 w-full h-full py-2 text-center text-xl font-normal rounded-full transition-all duration-300 ${
                  activeTab === "superadmin" ? "bg-[#E1D4CB] " : " hover"
                }`}
                onClick={() => setActiveTab("superadmin")}
              >
                Super Admin
              </button>
              <button
                className={`md:w-1/3 h-full w-full py-2 text-center text-xl font-normal rounded-full transition-all duration-300 ${
                  activeTab === "hr" ? "bg-[#E1D4CB] " : " hover"
                }`}
                onClick={() => setActiveTab("hr")}
              >
                HR
              </button>
              <button
                className={`md:w-1/3 w-full h-full py-2 text-center text-xl font-normal rounded-full transition-all duration-300 ${
                  activeTab === "employee" ? "bg-[#E1D4CB] " : " hover"
                }`}
                onClick={() => setActiveTab("employee")}
              >
                Employee
              </button>
            </div>

            <h1 className=" text-[40px] font-medium ">Welcome</h1>

            <div>
              {activeTab === "superadmin" && (
                <h1 className="text-[36px] text-[#135078] font-extrabold leading-[42px]">
                  Super Admin Login
                </h1>
              )}
              {activeTab === "hr" && (
                <h1 className="text-[36px] text-[#135078] font-extrabold leading-[42px]">
                  HR Login
                </h1>
              )}
              {activeTab === "employee" && (
                <h1 className="text-[36px] text-[#135078] font-extrabold leading-[42px]">
                  Employee Login
                </h1>
              )}
            </div>

            <h1 className="text-[32px] font-light flex justify-center py-4">
              Log in to your account to continue
            </h1>
            
            {/* Render the appropriate form based on activeTab */}
            {activeTab === "superadmin" && (
              <SuperAdminLoginForm
                loading={loading}
                onSubmit={handleSuperAdminSubmit}
                initialValues={initialValues.superadmin}
              />
            )}

            {activeTab === "hr" && (
              <HRLoginForm
                loading={loading}
                onSubmit={handleHRSubmit}
                initialValues={initialValues.hr}
              />
            )}

            {activeTab === "employee" && (
              <EmployeeLoginForm
                loading={loading}
                onSubmit={handleEmployeeSubmit}
                initialValues={initialValues.employee}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTabs;