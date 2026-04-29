import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

/* export const createNewMeetingAtom = atom({
  key: "createNewMeeting",
  default: null,
  effects_UNSTABLE: [persistAtom],
}); */

export const getUpComingMeetingAtom = atom({
  key: "upcomingMeetings",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getOverallMeetingStatusAtom = atom({
  key: "allMeetingStatus",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getAllParticipantListAtom = atom({
  key: "allParticipantList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getAllHolidayListAtom = atom({
  key: "allHolidayList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getMeetingDetailsAtom = atom({
  key: "meetingDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getAllMeetingsAtom = atom({
  key: "allMeetingDetails",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
