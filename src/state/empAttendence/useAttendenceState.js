import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const markAttendenceAtom = atom(createPersistedAtom("markAttendence", null));

export const getAttendanceSummaryAtom = atom(createPersistedAtom("attendanceSummary", null));

export const getTwoMonthAttendanceAtom = atom(createPersistedAtom("twoMonthAttendance", []));

export const allMonthsAllEmpAttendanceAtom = atom(createPersistedAtom("allMonthsAllEmpAttendanceKey", []));

export const monthlyAttendanceOfEmployeeAtom = atom(createPersistedAtom("monthlyAttendanceOfEmployeeKey", []));

export const getweeklyAttendanceAtom = atom(createPersistedAtom("weeklyAttendance", []));

export const empByIdAtom = atom(createPersistedAtom("empById", null));

export const empByIdForDashboardAtom = atom(createPersistedAtom("empByIdForDashboardAttendence", null));

export const employeeAttendanceMontlyDetailsAtom = atom(createPersistedAtom("employeeAttendanceMontlyDetailsKey", null));
