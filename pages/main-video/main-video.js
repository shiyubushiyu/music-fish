import { getTopMV } from "../../services/index";
// pages/main-video/main-video.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    hasMore: true,
    videoPms: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchTopMV();
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
  onPullDownRefresh() {
    this.setData({
      videoPms: 0,
    });
    this.fetchTopMV(this.data.videoPms);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.fetchTopMV(this.data.videoPms);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  /* 网络请求 */

  // 获取mv数据
  async fetchTopMV(offset) {
    // 判断是否可以请求
    if (!this.data.hasMore) {
      return wx.showToast({
        title: "没有更多了...",
        icon: "error",
        duration: 1000,
      });
    }

    // 数据加载loading
    wx.showLoading({
      title: "数据加载中...",
      mask: true,
    });

    // 请求的数据
    const res = await getTopMV(offset);
    let newData = this.data.videoList;
    // 下拉刷新，或者第一次请求
    if (offset === 0) {
      this.setData({
        videoList: res.data,
      });
      // 关闭下拉刷新动画
      wx.stopPullDownRefresh();
    } else {
      console.log(newData, res.data);
      // 下拉触底
      this.setData({
        videoList: [...newData, ...res.data],
      });
    }

    // 关闭loading
    wx.hideLoading();

    this.setData({
      videoPms: this.data.videoPms + 1,
    });
  },

  // 视频点击事件
  handleVideoItemClick(evet) {
    // 获取id
    const id = evet.currentTarget.dataset.item.id;
    // 跳转页面
    wx.navigateTo({
      url: `/packageVideo/pages/detail-video/detail-video?id=${id}`,
    });
  },
});
