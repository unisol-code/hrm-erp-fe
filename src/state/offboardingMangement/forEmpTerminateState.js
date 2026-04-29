import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const empInfoForTerminationAtom = atom(createPersistedAtom("empInfoForTerminationKey", null));

export const terminatedEmpByIdAtom = atom(createPersistedAtom("terminatedEmpByIdKey", null));

export const terminatedEmpsListAtom = atom(createPersistedAtom("terminatedEmpsListKey", []));

export const empWiseTerminationListAtom = atom(createPersistedAtom("empWiseTerminationListKey", null));
