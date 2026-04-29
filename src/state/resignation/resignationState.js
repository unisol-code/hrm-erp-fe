import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const resignationAtom = atom({
  key: "resignationDataList",
  default: []  ,
  effects_UNSTABLE: [persistAtom],
});