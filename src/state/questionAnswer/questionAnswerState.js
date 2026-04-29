import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const trainingPolicyState = atom({
    key: "trainingPolicyManageState",
    default: "Policy",
    effects_UNSTABLE: [persistAtom]
})

export const getQATitlesListState = atom({
    key: "qaTitlesList",
    default: {},
    effects_UNSTABLE: [persistAtom]
})
export const getSpecificQuestionListState = atom({
    key:"specificQuestionList",
    default:{},
    effects_UNSTABLE:[persistAtom]
})
export const getQuestionDetailsState = atom({
    key:"getQuestionDetails",
    default:{},
    effects_UNSTABLE:[persistAtom]
})
export const getTrainingorPolicyTitleState = atom({
    key:"getTrainingorPolicyTitle",
    default:{},
    effects_UNSTABLE:[persistAtom]
})