import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

export const countryLocationAtom = atom({
    key: 'countryLocation',
    default: [],
    effects_UNSTABLE: [persistAtom]
});

export const stateLocationAtom = atom({
    key: 'stateLocation',
    default: [],
    effects_UNSTABLE: [persistAtom]
});

export const cityLocationAtom = atom({
    key: 'cityLocation',
    default: [],
    effects_UNSTABLE: [persistAtom]
});