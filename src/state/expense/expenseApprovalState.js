import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const empApprovalListAtom = atom(createPersistedAtom("empApproval", []));

export const expenseByIdAtom = atom(createPersistedAtom("expenseByIds", null));

export const expenseDetailsAtom = atom(createPersistedAtom("expenseDetails", null));

export const expenseCategoryListAtom = atom(createPersistedAtom("expenseCategoryListKey", null));

export const totalExpensesByCategoryAtom = atom(createPersistedAtom("totalExpensesByCategoryKey", []));


