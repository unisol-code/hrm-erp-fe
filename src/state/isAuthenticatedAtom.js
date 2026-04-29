import { atom } from "recoil";
import { createPersistedAtom } from "./recoilConfig";

export const userAuthState = atom(createPersistedAtom("userAuthState", {
  isAuthenticated: false
  }));

// This atom is used to store the response from the super admin login
export const sAdminResponseAtom = atom(createPersistedAtom("sAdminResponse", null));

// this atome is used to staore the response from the hr login
export const hrDetailsAtom = atom(createPersistedAtom("hrDetails", null));

// This atom stores the login details of an employee
export const employeeLoginDataAtom = atom(createPersistedAtom("employeeLoginData", null));

export const userForgotPasswordAtom = atom(createPersistedAtom("userForgotPassword", null));

export const confirmPasswordAtom = atom(createPersistedAtom("confirmPassword", null));

export const verifyOtpAtom = atom(createPersistedAtom("verifyOtp", null));
