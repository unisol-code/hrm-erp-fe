import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const allQuestionAnswersAtom = atom(createPersistedAtom("allQuestionAnswers", []));

export const ratingOverviewAtom = atom(createPersistedAtom("ratingOverview", []));

export const selfAppraisalAtom = atom(createPersistedAtom("selfAppraisal", []));

export const leadershipAppraisalYearAtom = atom(createPersistedAtom("leadershipAppraisalYear", []));

export const submittedLeadershipAppraisaldataAtom = atom(createPersistedAtom("submittedLeadershipAppraisaldata", []));

export const selfAppraisalDataAtom = atom(createPersistedAtom("selfAppraisalData", null));

// business appraisal 
export const businessAppraisalGoalListAtom = atom(createPersistedAtom("businessAppraisalGoalListKey", []));

export const submittedBusinessAppraisalAtom = atom(createPersistedAtom("submittedBusinessAppraisalKey", []));

export const appraisalYearAtom = atom(createPersistedAtom("appraisalYearKey", []));

export const submittedBusinessAppraisalDetailsAtom = atom(createPersistedAtom("submittedBusinessAppraisalDetailsKey", null))

// final rating
export const finalRatingAtom = atom(createPersistedAtom("finalRatingKey", null));