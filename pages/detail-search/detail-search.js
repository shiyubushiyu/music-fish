// pages/detail-search/detail-search.js
import { debounce } from "underscore";
import { getCloudSearch } from "../../services/index";
import { playerStore } from "../../store/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "",
    searchList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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

  // ===================事件======================
  onCancel() {
    wx.navigateBack();
  },
  onSerachChange: debounce(function (e) {
    getCloudSearch({ keywords: e.detail }).then((res) => {
      console.log(res.result.songs);
      this.setData({
        searchList: res.result.songs,
      });
    });
  }, 500),
  onSongItemTap() {
    playerStore.setState("playSongList", this.data.searchList);
  },
});
