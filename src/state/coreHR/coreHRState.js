import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const serachEmpCoreHrAtom = atom({
  key: "searchEmpCoreHR",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const sendDeptDataChartAtom = atom({
  key: "sendDeptDataChart",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const designationAtom = atom({
  key: "updateEmpCoreHR",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const coreHREmployeeListAtom = atom({
  key: "coreHREmployeeList",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const coreHREmployeeDetailsAtom = atom({
  key: "coreHREmployeeDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const createCoreHREmployeeAtom = atom({
  key: "coreHRCreateEmployee",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getEventListAtom = atom({
  key: "getEventList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getEventByIdAtom = atom({
  key: "getEventById",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const allEmployeeIdAtomWithName = atom({
  key: "allEmployeeIdAtomWithName",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

