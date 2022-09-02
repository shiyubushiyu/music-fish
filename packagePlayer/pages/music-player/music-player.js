// pages/music-player/music-player.js
import { throttle } from "underscore";
import { playerStore, audioContext } from "../../../store/index";

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    stateKeys: [
      "id",
      "currentSong",
      "durationTime",
      "currentTime",
      "lyricInfos",
      "currentLyricText",
      "currentLyricIndex",
      "isPlaying",
      "playModeIndex",
      "playSongList",
      "playSongIndex",
    ],
    currentSong: {},
    currentTime: 0, // 当前播放的时间
    durationTime: 0, // 总时间
    lyricInfos: [], // 歌词
    currentLyricText: "", // 当前歌词
    currentLyricIndex: -1,

    isPlaying: true, // 当前播放状态

    sliderValue: 0, // 播放的百分比
    isSliderChanging: false, // 当前是否正在滑动

    lyricScrollTop: 0,

    playSongIndex: 0,
    playSongList: [],
    isFirstPlay: true,
    currentPage: 0, // page页
    pageTitles: ["歌曲", "歌词"],
    contentHeight: 0, // 轮播的高度

    // 播放模式 0 顺序 1单曲循环 2 随机播放
    playModeIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 0. 屏幕的高度
    this.setData({
      contentHeight: app.globalData.contentHeight,
    });
    // 1. 获取传入的id
    const id = options.id;
    if (id) {
      playerStore.dispatch("playMusicWithSongId", id);
    }
    // 获取store共享数据
    playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler);
  },
  onUnload() {
    playerStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler);
  },

  /* ===================================事件================================ */
  // 轮播图的事件
  onSwiperChange(e) {
    this.setData({ currentPage: e.detail.current });
  },
  onNavTabItemTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentPage: index,
    });
  },
  // 滑块改变事件
  onSliderChange: throttle(function (e) {
    // 获取点击滑块位置对应的值
    const value = e.detail.value;

    // 计算出要播放的位置的时间
    const currentTime = (value / 100) * this.data.durationTime;

    // 设置播放器,播放计算出的时间
    audioContext.seek(currentTime / 1000);
    this.setData({
      currentTime,
      isSliderChanging: false,
      sliderValue: value,
    });
  }, 100),
  // 滑块滑动的事件
  onSliderChanging(e) {
    // 1. 获取滑动到的位置的value
    const value = e.detail.value;

    // 2. 根据当前的值,计算出对应的时间
    const currentTime = (value / 100) * this.data.durationTime;
    // 3. 当前正在滑动
    this.setData({ currentTime, isSliderChanging: true });
  },

  updateProgress: throttle(
    function (currentTime) {
      if (this.data.isSliderChanging) return;
      // 1. 记录当前的时间 2. 修改sliderValue
      const sliderValue = (currentTime / this.data.durationTime) * 100;
      this.setData({ sliderValue, currentTime });
    },
    800,
    { leading: false, trailing: false }
  ),
  // 播放/暂停
  onPlayOrPauseTap() {
    playerStore.dispatch("playMusicStatusAction");
  },
  /* 上一首 */
  onPrevBtnTap() {
    playerStore.dispatch("playNewMusicAction", false);
  },
  /* 下一首 */
  onNextBtnTap() {
    playerStore.dispatch("playNewMusicAction");
  },
  /* 模式切换 */
  onModeBtnTap() {
    playerStore.dispatch("changePlayModeAction");
  },
  onNavBackTap() {
    wx.navigateBack();
  },
  // ======================== store的共享数据 =========================
  getPlayerInfosHandler({
    id,
    currentSong,
    durationTime,
    currentTime,
    lyricInfos,
    currentLyricText,
    currentLyricIndex,
    isPlaying,
    playModeIndex,
    playSongList,
    playSongIndex,
  }) {
    if (id !== undefined) {
      this.setData({ id });
    }
    if (currentSong) {
      this.setData({
        currentSong,
      });
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime });
    }
    if (currentTime !== undefined) {
      // 根据当前时间改变当前进度
      this.updateProgress(currentTime);
    }
    if (lyricInfos) {
      this.setData({ lyricInfos });
    }
    if (currentLyricText) {
      this.setData({ currentLyricText });
    }
    if (currentLyricIndex !== undefined) {
      // 修改lyricScrollTop
      this.setData({
        currentLyricIndex,
        lyricScrollTop: currentLyricIndex * 35,
      });
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying });
    }
    if (playModeIndex !== undefined) {
      this.setData({ playModeIndex });
    }
    if (playSongList) {
      this.setData({
        playSongList,
      });
    }
    if (playSongIndex !== undefined) {
      this.setData({
        playSongIndex,
      });
    }
  },
});
