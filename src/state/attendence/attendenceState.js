import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const allEmployeeAttendanceDetailsAtom = atom({
  key: "allEmployeeAttendanceDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const employeeLeaveSummaryAtom = atom({
  key: "employeeLeaveSummary",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const employeeLeaveStatusAndApprovalAtom = atom({
  key: "employeeLeaveStatusAndApproval",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getEmployeeLeaveListAtom = atom({
  key: "employeeLeaveList",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const markLeaveApprovalAtom = atom({
  key: "leaveApproval",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const dailyAttendancePercentageAtom = atom({
  key: "dailyAttendancePercentage",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const monthlyAttendanceAtom = atom({
  key: "monthlyAttendance",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const searchEmployeeAtom = atom({
  key: "searchEmployee",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const approvedLeavesOfEmployeeAtom = atom({
  key: "approvedLeavesOfEmployee",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
