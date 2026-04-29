import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const markAttendenceAtom = atom({
  key: "markAttendence",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getAttendanceSummaryAtom = atom({
  key: "attendanceSummary",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getTwoMonthAttendanceAtom = atom({
  key: "twoMonthAttendance",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const allMonthsAllEmpAttendanceAtom = atom({
  key: "allMonthsAllEmpAttendanceKey",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const monthlyAttendanceOfEmployeeAtom = atom({
  key: "monthlyAttendanceOfEmployeeKey",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getweeklyAttendanceAtom = atom({
  key: "weeklyAttendance",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const empByIdAtom = atom({
  key: "empById",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const empByIdForDashboardAtom = atom({
  key: "empByIdForDashboardAttendence",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
