import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const policyListAtom = atom({
    key: "policyList",
    default: [],
    effects_UNSTABLE: [persistAtom],
});
export const policyDetailAtom = atom({
    key: "policyDetail",
    default: {},
    effects_UNSTABLE: [persistAtom],
});