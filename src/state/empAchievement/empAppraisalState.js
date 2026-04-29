import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const empAppraisalGoalListAtom = atom(createPersistedAtom("empAppraisalGoalListKey", []));

export const businessAppraisalListAtom = atom(createPersistedAtom("businessAppraisalListKey", []));

export const businessAppraisalDetailsAtom = atom(createPersistedAtom("businessAppraisalDetailsKey", null));

export const appraisalGoalDropAtom = atom(createPersistedAtom("appraisalGoalDropKey", []));

export const empAppraisalListAtom = atom(createPersistedAtom("empAppraisalListKey", []));

export const empWiseAppraisalListAtom = atom(createPersistedAtom("empWiseAppraisalListKey", []));

export const empWiseAppraisalYearAtom = atom(createPersistedAtom("empWiseAppraisalYearKey", []));

export const empWiseAppraisalFinalRatingAtom = atom(createPersistedAtom("empWiseAppraisalFinalRatingKey", null));

export const empWiseAppraisalDetailsAtom = atom(createPersistedAtom("empWiseAppraisalDetailsKey", null));

export const ledershipAppraisalListDetailsAtom = atom(createPersistedAtom("ledershipAppraisalListDetailsKey", []));

export const ledershipAppraisalDetailsAtom = atom(createPersistedAtom("ledershipAppraisalDetailsKey", null));

export const leadershipAppraisalByIdFromEmpAtom = atom(createPersistedAtom("leadershipAppraisalByIdFromEmpKey", []));