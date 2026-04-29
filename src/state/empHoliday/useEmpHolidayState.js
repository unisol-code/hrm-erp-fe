import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const allHolidayDetailAtom = atom({
  key: "allHolidayDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const createHolidayAtom = atom({
  key: "createHoliday",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
