import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const docsByEmpIDAtom = atom({
  key: "docsByEmpID",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
