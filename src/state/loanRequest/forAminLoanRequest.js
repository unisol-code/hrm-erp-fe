import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const forAdminEmpLoanRequestListAtom = atom(createPersistedAtom("forAdminEmpLoanRequestListKey", []));

export const perticularEmpLoanReqListAtom = atom(createPersistedAtom("perticularEmpLoanReqListKey", []));

export const empLoanReqDetailToAdminAtom = atom(createPersistedAtom("empLoanReqDetailToAdminKey", null));