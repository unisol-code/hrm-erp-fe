import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const annualLeavePolicyAtom = atom({
    key: "leavePolicy",
    default: null,
    effects_UNSTABLE: [persistAtom],
})