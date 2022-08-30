import { HYEventStore } from "hy-event-store";

export const playerStore = new HYEventStore({
  state: {
    playSongList: [],
    playSongIndex: 0,
  },
});
