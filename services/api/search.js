import Http from "../index";

/* 获取推荐视频列表 */
export function getCloudSearch(keywords) {
  return Http.get({
    url: `/cloudsearch`,
    data: {
      keywords,
    },
  });
}
