import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const welcomeKitDataAtom = atom({
  key: "welcomeKitDataList",
  default: null ,
  effects_UNSTABLE: [persistAtom],
});