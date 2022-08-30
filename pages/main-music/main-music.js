// pages/main-music/main-music.js
import { getMusicBanner, getSongMenuList } from "../../services/index";
import { querySelect } from "../../utils/index";
import {
  recommendStore,
  rankingStore,
  rankingsMap,
  playerStore,
} from "../../store/index";
import { throttle } from "underscore";

const throttled = throttle(querySelect, 500, { trailing: false });
const app = getApp(); // 拿到app对象

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "",
    banners: [],
    bannerHeight: 150,
    screenWidth: 375,
    recommendSong: [], // 推荐歌曲
    hotMenuList: [], // 热门歌单
    recMenuList: [],
    // 巅峰榜数据
    rankingInfos: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchMusicBanner();
    // this.fetchRecommendSongs();
    this.fetchSongMenuList(); // 热门歌单

    // 监听共享数据的变化
    recommendStore.onState("recommendSongInfo", this.handleRecommendSongs);

    /* 监听巅峰榜数据 */
    for (const k in rankingsMap) {
      rankingStore.onState(k, this.getRankingHanlder(k));
    }

    // 调用
    recommendStore.dispatch("fethcRecommendSongsActions");
    // 获取顶峰榜
    rankingStore.dispatch("fetchRankingDataAction");

    // 获取屏幕的尺寸
    this.setData({
      screenWidth: app.globalData.screenWidth,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    recommendStore.offState("recommendSongInfo", this.handleRecommendSongs);
    /* 卸载监听 */
    for (const k in rankingsMap) {
      rankingStore.onState(k, this.getRankingHanlder(k));
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  /* 网络请求 */
  async fetchMusicBanner() {
    const res = await getMusicBanner();
    if (res.code !== 200) return;
    this.setData({
      banners: res.banners,
    });
  },

  /* 获取推荐歌单列表 */
  // async fetchRecommendSongs() {
  //   const res = await getPlayListDetail(3778678);
  //   const playList = res.playlist;
  //   const recommendSong = playList.tracks.slice(0, 6);
  //   console.log(recommendSong);
  //   this.setData({
  //     recommendSong,
  //   });
  // },

  /* 获取热门歌单 */
  async fetchSongMenuList() {
    getSongMenuList().then((res) => {
      if (res.code !== 200) return;
      this.setData({
        hotMenuList: res.playlists,
      });
    });
    getSongMenuList("华语").then((res) => {
      if (res.code !== 200) return;
      this.setData({
        recMenuList: res.playlists,
      });
    });
  },

  // 点击搜索
  onSerachClick() {
    wx.navigateTo({
      url: "/pages/detail-search/detail-search",
    });
  },

  /* 图片加载完成 */
  onBannerImageLoad() {
    // 获取image组件的高度
    throttled(".banner-image").then((res) => {
      this.setData({
        bannerHeight: res[0].height,
      });
    });
  },

  /* 更多点击 */

  onRecommendMoreClick() {
    wx.navigateTo({
      url: "/pages/detail-song/detail-song?type=recommend",
    });
  },
  /* 列表中item的点击，拿到当前播放列表 */
  onSongItemTap(e) {
    const index = e.currentTarget.dataset.index;
    playerStore.setState("playSongList", this.data.recommendSong);
    playerStore.setState("playSongIndex", index);
  },
  // ========================= 从store中获取数据 ======================
  handleRecommendSongs(value) {
    if (!value.tracks) return;
    this.setData({
      recommendSong: value.tracks.slice(0, 6),
    });
  },
  getRankingHanlder(ranking) {
    return (value) => {
      const newRankingInfos = { ...this.data.rankingInfos, [ranking]: value };
      this.setData({
        rankingInfos: newRankingInfos,
      });
    };
  },
});
