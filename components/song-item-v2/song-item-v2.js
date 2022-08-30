// components/song-item-v2/song-item-v2.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
      value: -1,
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
    /* 歌曲的点击 */
    onSongItemTap() {
      const id = this.properties.itemData.id;
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`,
      });
    },
  },
});
