import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const hierarchyAtom = atom({
  key: "hierarchy",
  default: [],
  effects: [persistAtom],
});