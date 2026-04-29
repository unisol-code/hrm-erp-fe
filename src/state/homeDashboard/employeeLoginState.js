import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const unisolEmployeeLoginAtom = atom({
    key: "unisolEmployeeLogins",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const surgisolEmployeeLoginAtom = atom({
    key: "surgisolEmployeeLogins",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const igniteSphereEmployeeLoginAtom = atom({
    key: "igniteSphereEmployeeLogins",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const enviroSolutionEmployeeLoginAtom = atom({
    key: "enviroSolutionEmployeeLogins",
    default: [],
    effects_UNSTABLE: [persistAtom],
})

// All company Employee Logins

export const perCompanyEmployeeLoginAtom = atom({
    key: "perCompanyEmployeeLogins",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const employeeLoginDetailsAtom = atom({
    key: "employeeLoginDetail",
    default: null,
    effects_UNSTABLE: [persistAtom],
})