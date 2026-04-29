import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const selfEvalPolicyListAtom = atom({
  key: "selfEvalPolicyList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const selfEvalPolicyDetailAtom = atom({
  key: "selfEvalPolicyDetail",
  default: {},
  effects_UNSTABLE: [persistAtom],
});
export const selfEvalTrainingListAtom = atom({
  key: "selfEvalTrainingList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const selfEvalTrainingDetailAtom = atom({
  key: "selfEvalTrainingDetail",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const policyQuestionsAtom = atom({
  key: "policyQuestions",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const policyQAPreviewAtom = atom({
    key: "policyQAPreview",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const trainingQuestionsAtom = atom({
    key: "trainingQuestion",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const trainingQAPreviewAtom = atom({
    key: "trainingQAPreviews",
    default: null,
    effects_UNSTABLE: [persistAtom],
});
export const testResultAtom = atom({
  key: "testResult",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const viewTestResultAtom = atom({
  key: "viewTestResult",
  default: {},
  effects_UNSTABLE: [persistAtom],
});
