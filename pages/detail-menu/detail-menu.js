// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    songMenus: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchAllMenuList();
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

  // 发送网络请求
  async fetchAllMenuList() {
    // 1. 获取tags
    const tagRes = await getSongMenuTag();
    const tags = tagRes.tags;

    // 2. 根据tags去获取对应的歌单
    const allPromises = [];
    for (const tag of tags) {
      const promise = getSongMenuList(tag.name);
      allPromises.push(promise);
    }

    // 3. 获取到所有的数据之后，调用setData
    Promise.all(allPromises).then((res) => {
      console.log(res);
      this.setData({
        songMenus: res,
      });
    });
  },
});
