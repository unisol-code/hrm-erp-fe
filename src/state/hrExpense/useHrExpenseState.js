import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const salesExpenseAtom  = atom(createPersistedAtom("salesExpenseKey", null));

export const screeningExpenseAtom = atom(createPersistedAtom("screeningExpenseKey", null))

export const expenseSheetAtom = atom(createPersistedAtom("expenseSheetKey", []))

export const empWiseYearsAtom = atom(createPersistedAtom("empWiseYearsKey", []))

export const yearWiseMonthsAtom = atom(createPersistedAtom("yearWiseMonthsKey", []))
