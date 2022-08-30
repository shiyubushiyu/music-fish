// components/area-header/area-header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认标题",
    },
    hasMore: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    // 更多点击事件
    onMoreTap() {
      // 向外发射事件
      this.triggerEvent("moreclick");
    },
  },
});
