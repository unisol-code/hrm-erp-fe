import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const payrollGradeState = atom({
  key: "policiesPayrollGradeState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const policiesCategoryState = atom({
  key: "policiesCatagoryState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const policiesCategoryDetailsState = atom({
  key: "policiesCatagoryDetailsState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});
