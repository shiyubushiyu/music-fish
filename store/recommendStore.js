import { HYEventStore } from "hy-event-store";
import { getPlayListDetail } from "../services/index";

export const recommendStore = new HYEventStore({
  state: {
    recommendSongInfo: [],
  },
  actions: {
    fethcRecommendSongsActions(ctx) {
      getPlayListDetail(3778678).then((res) => {
        ctx.recommendSongInfo = res.playlist;
      });
    },
  },
});
