import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const showEducationalDetailsAtom = atom({
  key: "showEducationalDetails",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const saveEducationalDetailsAtom = atom({
  key: "saveEducationalDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const deleteEducationalDetailsAtom = atom({
  key: "deleteEducationalDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const updateEducationalDetailsAtom = atom({
  key: "updateEducationalDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getEducationalDetailByIdAtom = atom({
  key: "educationalDetailById",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const programSelectionDropAtom = atom({
  key: "programSelectionDrop",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const specializationsAtom = atom({
  key: "specializations",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
