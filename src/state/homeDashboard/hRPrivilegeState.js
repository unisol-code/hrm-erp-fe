import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const privilegeCompanyAtom = atom(createPersistedAtom("privilegeCompanies", []));

export const companyDepartmentAtom = atom(createPersistedAtom("companyDepartment", []));

export const privilegeHRNamesAtom = atom(createPersistedAtom("privilegeHRNames", []));

export const hRPrivilegeListAtom = atom(createPersistedAtom("hRPrivilegeList", []));

export const privilegeDetailsAtom = atom(createPersistedAtom("privilegeDetail", null));