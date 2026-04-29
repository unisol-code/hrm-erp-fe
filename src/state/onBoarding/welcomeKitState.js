import { atom } from "recoil";

// ✅ Store all welcome kits (list + pagination data if any)
export const allWelcomeKitsAtom = atom({
  key: "allWelcomeKitsAtom",
  default: null,
});

// ✅ Store single welcome kit details (by ID)
export const welcomeKitDetailsAtom = atom({
  key: "welcomeKitDetailsAtom",
  default: null,
});

// ✅ Optional: global loading state for welcome kit
export const welcomeKitLoadingAtom = atom({
  key: "welcomeKitLoadingAtom",
  default: false,
});
