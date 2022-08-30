// pages/detail-video/detail-video.js
import { getMVUrl, getMVInfo, getMVRelate } from "../../services/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    MVId: "",
    MVData: {},
    MVInfo: {},
    MVRelate: [],
    danmuList: [
      { text: "哈哈哈, 好好听", color: "#ff0000", time: 3 },
      { text: "牛逼", color: "#ff0000", time: 10 },
      { text: "我好喜欢呀", color: "#ff0000", time: 15 },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.MVId = options.id;
    this.fetchMVUrl();
    this.fetchMVInfo();
    this.fetchMVRelate();
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
  onUnload() {},

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
  async fetchMVUrl() {
    const res = await getMVUrl(this.data.MVId);
    if (res.code !== 200) return;
    this.setData({
      MVData: res.data,
    });
  },

  async fetchMVInfo() {
    const res = await getMVInfo(this.data.MVId);
    if (res.code !== 200) return;
    this.setData({
      MVInfo: res.data,
    });
  },

  async fetchMVRelate() {
    const res = await getMVRelate(this.data.MVId);
    if (res.code !== 200) return;
    this.setData({
      MVRelate: res.data,
    });
    console.log(res);
  },
});
