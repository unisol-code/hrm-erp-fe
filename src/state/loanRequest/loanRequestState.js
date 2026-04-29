import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const empBasicDetailAtom = atom(createPersistedAtom("empBasicDetailKey", null));

export const empLoanRequestDetailAtom = atom(createPersistedAtom("loanRequesteDetailKey", null));

export const empLoanRequestListAtom = atom(createPersistedAtom("loanRequestListKey", []));