import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const weeklyAttendanceGraphAtom = atom({
  key: "weeklyAttendancegraph",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const allCompaniesDataAtom = atom({
  key: "allCompaniesData",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const allSpecialDaysAtom = atom({
  key: "allSpecialDays",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const companyByIdDropAtom = atom({
  key: "companiesById",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const deleteNotificationAtom = atom({
  key: "deleteNotification",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const markNotificationReadAtom = atom({
  key: "markNotificationRead",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const createMeetingAtom = atom({
  key: "createMeeting",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const userAllNotificationAtom = atom({
  key: "userAllNotification",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

/* leaves */

export const allTodayLeaveListAtom = atom({
  key: "allTodayLeaveList",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const allUpcomingLeaveListAtom = atom({
  key: "allUpcomingLeaveList",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

/* meetings */

export const allTodaysMeetingListAtom = atom({
  key: "allTodaysMeetingList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const allUpcomingMeetListAtom = atom({
  key: "allUpcomingMeetList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const overallMeetingStatusAtom = atom({
  key: "overallMeetingStatus",
  default: null,
  effects_UNSTABLE: [persistAtom],
})

export const employeeStatusOverViewListAtom = atom({
  key: "employeeStatusOverViewList",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const allUpcomingMeetsAndHolidaysAtom = atom({
  key: "allUpcomingMeetsAndHolidays",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const hrCompaniesAtom = atom({
  key: "hrAccessCompanies",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

