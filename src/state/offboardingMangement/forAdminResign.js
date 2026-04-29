import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const forAdminEmpResignRequestListAtom = atom(createPersistedAtom("forAdminEmpResignRequestListKey", []));

export const particularEmpResignReqListAtom = atom(createPersistedAtom("perticularEmpResignReqListKey", []));

export const empResignReqDetailToAdminAtom = atom(createPersistedAtom("empResignReqDetailToAdminKey", null));