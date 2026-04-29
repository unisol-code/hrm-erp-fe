import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const inActiveEmpListAtom = atom(createPersistedAtom("inActiveEmpListKey", []));

export const inactiveEmpDetailsDetailsAtom = atom(createPersistedAtom("inactiveEmpDetailsDetailsKey", null));
