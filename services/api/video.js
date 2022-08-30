import Http from "../index";

/* 获取推荐视频列表 */
export function getTopMV(offset = 0, limit = 20) {
  return Http.get({
    url: "/top/mv",
    data: {
      limit,
      offset,
    },
  });
}

/* 获取视频播放地址 */
export function getMVUrl(id) {
  return Http.get({
    url: "/mv/url",
    data: {
      id,
    },
  });
}

/* 获取视频播放详情 */
export function getMVInfo(mvid) {
  return Http.get({
    url: "/mv/detail",
    data: {
      mvid,
    },
  });
}

/* 获取视频播放推荐视频 */
export function getMVRelate(id) {
  return Http.get({
    url: "/related/allvideo",
    data: {
      id,
    },
  });
}
