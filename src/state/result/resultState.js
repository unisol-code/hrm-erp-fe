import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const employeeListWithIdState = atom({
    key:"employeeListWithIdState",
    default:[],
    effects_UNSTABLE:[persistAtom]
})

export const employeeResultState = atom({
    key:"employeeResultState",
    default:[],
    effects_UNSTABLE:[persistAtom]
})
