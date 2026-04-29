import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const payrollGradeState = atom({
  key: "rewardProgramPayrollGradeState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const rewardProgramListAtom = atom({
  key: "rewardProgramListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const viewRewardProgramAtom = atom({
  key: "viewRewardProgramState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const empTrainingProjectListAtom = atom({
  key: "empTrainingList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const vieweEpTrainingProjectListAtom = atom({
  key: "viewEmpTrainingList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
