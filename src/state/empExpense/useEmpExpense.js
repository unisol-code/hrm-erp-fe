import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const expenseCategoryAtom = atom({
    key: "expenseCategory",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const attendaceExpenseAtom = atom({
    key: "attendanceExpenseKey",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const cityHQAtom = atom({
    key: "cityHQs",
    default: [],
    effects_UNSTABLE: [persistAtom],
})

export const mealTypeAtom = atom({
    key: "mealTypes",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const modeOfTransportAtom = atom({
    key: "modeOfTransports",
    default: null,
    effects_UNSTABLE: [persistAtom],
})

export const nameAndDepartmentAtom = atom({
    key: "nameAndDepartment",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const expenseStatusAtom = atom({
    key: "expenseStatus",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const expenseHistoryAtom = atom({
    key: "expenseHistory",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const expenseDetailsAtom = atom ({
    key:"expenseDetailsState",
    default:[],
    effects_UNSTABLE:[persistAtom]
})

export const addFoodExpenseAtom = atom({
    key: "addFoodExpense",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const addDailyAllowanceAtom = atom({
    key:"addDailyAllowanceState",
    default:null,
    effects_UNSTABLE:[persistAtom]
})

export const addTravelExpenseAtom = atom ({
    key:"addTravelExpenseKey",
    default:null,
    effects_UNSTABLE:[persistAtom]
})

export const addLodgingExpenseAtom = atom ({
    key:"addLodgingExpenseKey",
    default:null,
    effects_UNSTABLE:[persistAtom]
})
