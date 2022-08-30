import Http from "../index";

/* 获取歌曲的详情 */
export function getMusicDetail(ids) {
  return Http.get({
    url: "/song/detail",
    data: {
      ids,
    },
  });
}

/* 获取歌词信息 */
export function getSongLyric(id) {
  return Http.get({
    url: "/lyric",
    data: {
      id,
    },
  });
}
