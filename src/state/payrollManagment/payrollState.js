import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const getEmployeePaySlipListAtom = atom({
  key: "employeePaySlipList",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getPayslipGenerationStatusListAtom = atom({
  key: "payslipGenerationStatusList",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const employeePaySlipDetailsAtom = atom({
  key: "employeePaySlipDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
