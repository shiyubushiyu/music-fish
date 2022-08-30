import Http from "../index";

/* 获取轮播图 */
export function getMusicBanner(type = 0) {
  return Http.get({
    url: "/banner",
    data: {
      type,
    },
  });
}

/* 获取推荐歌曲列表 */
export function getPlayListDetail(id) {
  return Http.get({
    url: "/playlist/detail",
    data: {
      id,
    },
  });
}

/* 获取热门歌单 */
export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
  return Http.get({
    url: "/top/playlist",
    data: {
      cat,
      limit,
      offset,
    },
  });
}

/* 获取热门歌单列表 */
export function getSongMenuTag() {
  return Http.get({
    url: "/playlist/hot",
  });
}

/* 获取音乐播放地址 */
export function getMusicURL(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}
