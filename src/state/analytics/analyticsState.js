import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const empAnalyticsCardsAtom = atom(createPersistedAtom("empAnalyticsCardsKey", []));

export const analyticsYearAtom = atom(createPersistedAtom("analyticsYearKey", []));

export const analyticsAttendanceTrendsAtom = atom(createPersistedAtom("analyticsAttendanceTrendsKey", []));

export const analyticsEmpAttendanceAtom = atom(createPersistedAtom("analyticsEmpAttendanceKey", []));

export const analyticsLeaveDistributionAtom = atom(createPersistedAtom("analyticsLeaveDistributionKey", []));

export const analyticsLeaveDetailsAtom = atom(createPersistedAtom("analyticsLeaveDetailsKey", []));

export const analyticsExpensesTrendAtom = atom(createPersistedAtom("analyticsExpensesTrendKey", []));

export const analyticsExpensesDetailsAtom = atom(createPersistedAtom("analyticsExpensesDetailsKey", []));

export const analyticsLoanTrendAtom = atom(createPersistedAtom("analyticsLoanTrendKey", []));

export const analyticsloanDetailsAtom = atom(createPersistedAtom("analyticsLoanDetailsKey", []));

export const analyticsAppraisalTrendAtom = atom(createPersistedAtom("analyticsAppraisalTrendKey", []));

export const analyticsAppraisalDetailsAtom = atom(createPersistedAtom("analyticsAppraisalDetailsKey", []));