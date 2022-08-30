// pages/detail-song/detail-song.js
import { recommendStore, rankingStore, playerStore } from "../../store/index";
import { getPlayListDetail } from "../../services/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: "ranking",
    key: "newRanking",
    songInfos: [],
    id: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1. 确认获取数据的类型
    this.setData({
      type: options.type,
    });

    // 获取store中榜单数据
    if (this.data.type === "ranking") {
      this.data.key = options.key;
      rankingStore.onState(this.data.key, this.handleRanking);
    } else if (this.data.type === "recommend") {
      this.data.key = "recommendSongInfo";
      recommendStore.onState(this.data.key, this.handleRanking);
    } else if (this.data.type === "menu") {
      this.data.id = options.id;
      this.fetchMenuSongInfo();
    }
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
    // 页面销毁，取消监听
    if (this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking);
    } else if (this.data.type === "recommend") {
      recommendStore.offState("recommendSongInfo", this.handleRanking);
    } else if (this.data.type === "menu") {
      const id = options.id;
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

  onSongItemTap() {
    playerStore.setState("playSongList", this.data.songInfos.tracks);
  },

  /* 监听store数据变化函数 */
  handleRanking(value) {
    if (this.data.type === "recommend") {
      value.name = "推荐歌曲";
    }
    this.setData({
      songInfos: value,
    });
    wx.setNavigationBarTitle({
      title: value.name,
    });
  },

  async fetchMenuSongInfo() {
    const res = await getPlayListDetail(this.data.id);
    wx.setNavigationBarTitle({
      title: res.playlist.name,
    });
    this.setData({
      songInfos: res.playlist,
    });
  },
});
