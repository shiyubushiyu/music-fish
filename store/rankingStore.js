import { HYEventStore } from "hy-event-store";
import { getPlayListDetail } from "../services/index";

// 热歌，原创，飙升，热歌3778678
export const rankingsMap = {
  newRanking: 3779629,
  originRanking: 2884035,
  upRanking: 19723756,
};
export const rankingStore = new HYEventStore({
  state: {
    newRanking: {},
    originRanking: {},
    upRanking: {},
  },
  actions: {
    /* 获取巅峰榜数据 */
    fetchRankingDataAction(ctx) {
      for (const k in rankingsMap) {
        const id = rankingsMap[k];
        getPlayListDetail(id).then((res) => {
          ctx[k] = res.playlist;
        });
      }
    },
  },
});
