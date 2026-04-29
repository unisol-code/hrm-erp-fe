import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

/* home Dashboard employee attendance */
export const homeTotalEmpAttendanceAtom = atom({
    key: "homeTotalEmpAttendance",
    default: null,
    effects_UNSTABLE: [persistAtom],
})

export const homeTodaysEmpAttendanceAtom = atom({
    key: "homeTodaysEmpAttendance",
    default: null,
    effects_UNSTABLE: [persistAtom],
})

export const homeNewEmployeeCountAtom = atom({
    key: "homeNewEmployeeCount",
    default: null,
    effects_UNSTABLE: [persistAtom],
})

/* home Dashboard weekly department attendance */
export const homeWeeklyDepartmentAtom = atom({
    key: "homeWeeklyDepartment",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

/* home Dashboard special days */
export const homeSpecialDaysAtom = atom({
    key: "homeSpecialDays",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const allUpcomingMeetListAtom = atom({
    key: "allUpcomingMeets",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

/* Company Overview status */

export const companyStatusOverViewListAtom = atom({
    key: "companyStatusOverViews",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const homeEmployeeOverviewAtom = atom({
    key: "homeEmployeeOverviews",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const homeUpcomingMeetAndHolidayAtom = atom({
    key: "homeUpcomingMeetAndHolidays",
    default: [],
    effects_UNSTABLE: [persistAtom],
})


