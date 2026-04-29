import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const applyLeaveAtom = atom({
    key: "applyLeave",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const leaveTypesAtom = atom({
    key: "leave-Types",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const userForLeaveApplyAtom = atom({
    key: "userForLeaveApply",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const totalLeavesAtom = atom({
    key: "total-Leaves",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const leavePendingAtom = atom({
    key: "leave-pending",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const leaveTakenAtom = atom({
    key: "leave-Taken",
    default: null,
    effects_UNSTABLE: [persistAtom],
});