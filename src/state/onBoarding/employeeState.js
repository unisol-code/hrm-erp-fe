import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const allEmployeeAtom = atom({
  key: "allEmployee",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const updateEmployeeTaskAtom = atom({
  key: "updateEmployeeTask",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const employeeByQueryAtom = atom({
  key: "employeeQuery",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const departmentDropAtom = atom({
  key: "allDepartment",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const positionApplyDropAtom = atom({
  key: "positionApplyDrop",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const employeeTypeDropAtom = atom({
  key: "employeeTypeDrop",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const candidateDetailAtom = atom({
  key: "candidateDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const employeeByDeptAtom = atom({
  key: "employeeByDept",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const designationByDeptAtom = atom({
  key: "designationByDept",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const payRollGradeAtom = atom({
  key: "payRollGrade",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const cityAtom = atom({
  key: "city",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const stateAtom = atom({
  key: "state",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const countryAtom = atom({
  key: "country",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const onboardingManagerAtom = atom({
  key: "onboardingManager",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const perCountryAtom = atom({
  key: "perCountry",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const perStateAtom = atom({
  key: "perState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const perCityAtom = atom({
  key: "perCity",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
