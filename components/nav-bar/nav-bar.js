// components/nav-bar/nav-bar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true, // 多个插槽的时候,需要配置
  },
  properties: {
    title: {
      type: String,
      value: "导航标题",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusHeight: 20,
  },

  lifetimes: {
    attached() {
      this.setData({
        statusHeight: app.globalData.statusBarHeight,
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLeftClick() {
      this.triggerEvent("leftClick");
    },
  },
});
