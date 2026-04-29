import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const payrollGradeState = atom({
  key: "payrollGradeState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const moduleCategoryState = atom({
  key: "moduleCategoryState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const moduleCategoryDetailsState = atom({
  key: "moduleCategoryDetailsState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});
