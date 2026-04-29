import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const statusOptionsAtom = atom(createPersistedAtom("statusOptionsKey", []));