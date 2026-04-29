import { atom } from "recoil";
import { themes } from "../components/Theme/themes";
import { createPersistedAtom } from "./recoilConfig";

export const themeState = atom(createPersistedAtom("themeState", themes.UniSol));
