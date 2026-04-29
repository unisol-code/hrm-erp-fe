import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const todaysEmpAttendanceAtom = atom({
  key: "todaysEmpAttendance",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const totalEmpAttendanceAtom = atom({
  key: "totalEmpAttendance",
  default: null,
  effects_UNSTABLE: [persistAtom],
})

export const weeklydeptAttendanceAtom = atom({
  key: "weeklydeptAttendance",
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export const newEmployeeCountAtom = atom({
  key: "newEmployeeCount",
  default: null,
  effects_UNSTABLE: [persistAtom],
})