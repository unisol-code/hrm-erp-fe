import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const trainingListAtom = atom({
    key: "trainingList",
    default: null,
    effects_UNSTABLE: [persistAtom],
});