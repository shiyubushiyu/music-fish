// pages/music-player/music-player.js
import {
  getMusicDetail,
  getSongLyric,
  getMusicURL,
} from "../../services/index";
import { throttle } from "underscore";
import { parseLyric } from "../../utils/index";
import { playerStore } from "../../store/index";

const app = getApp();
const audioContext = wx.createInnerAudioContext(); // 创建播放器

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0, // page页
    contentHeight: 0, // 轮播的高度
    id: 0,
    currentSong: {},
    lyricInfos: [], // 歌词
    currentLyricText: "", // 当前歌词
    currentLyricIndex: -1,
    pageTitles: ["歌曲", "歌词"],

    currentTime: 0, // 当前播放的时间
    durationTime: 0, // 总时间
    sliderValue: 0, // 播放的百分比
    isSliderChanging: false, // 当前是否正在滑动
    isPlaying: true, // 当前播放状态

    lyricScrollTop: 0,

    playSongIndex: 0,
    playSongList: [],
    isFirstPlay: true,

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
    this.setupPlaySong(id);
  },
  onUnload() {
    playerStore.offStates(
      ["playSongList", "playSongIndex"],
      this.getPlaySongInfosHandler
    );
  },

  /* 网络请求 */

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
  onSliderChange(e) {
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
  },
  // 滑块滑动的事件
  onSliderChanging(e) {
    // 获取滑动到的位置的value
    const value = e.detail.value;

    // 根据当前的值,计算出对应的时间
    const currentTime = (value / 100) * this.data.durationTime;
    this.setData({ currentTime, isSliderChanging: true });
  },

  updateProgress() {
    // 记录当前的时间
    this.setData({
      currentTime: audioContext.currentTime * 1000,
    });

    // 修改滑块的值
    const sliderValue = (this.data.currentTime / this.data.durationTime) * 100;
    this.setData({
      sliderValue,
    });
  },
  // 播放/暂停
  onPlayOrPauseTap() {
    if (!audioContext.paused) {
      audioContext.pause();
      this.setData({
        isPlaying: false,
      });
    } else {
      audioContext.play();
      this.setData({
        isPlaying: true,
      });
    }
  },
  // store的共享数据
  getPlaySongInfosHandler({ playSongList, playSongIndex }) {
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

  /* 播放歌曲的逻辑 */
  setupPlaySong(id) {
    this.setData({
      id,
    });
    // 2. 根据id获取歌曲的详情
    getMusicDetail(id).then((res) => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt,
      });
    });
    // 3. 获取歌词信息
    getSongLyric(id).then((res) => {
      this.setData({ lyricInfos: parseLyric(res.lrc.lyric) });
    });

    // 4. 播放当前的歌曲
    audioContext.stop();
    audioContext.src = getMusicURL(id);
    audioContext.autoplay = true; // 准备好了后,自动播放
    // 只有页面第一次打开的时候需要添加监听
    if (this.data.isFirstPlay) {
      this.data.isFirstPlay = false;
      const throttleUpdateProgress = throttle(this.updateProgress, 500, {
        leading: false,
        trailing: false,
      });

      // 5. 监听播放的进度
      audioContext.onTimeUpdate(() => {
        // 如果当前正在滑动,则不做改变
        if (this.data.isSliderChanging) return;

        // 节流函数 1. 跟新歌词进度
        throttleUpdateProgress();

        // 2， 匹配正确的歌词
        if (!this.data.lyricInfos.length) return;
        let index = this.data.lyricInfos.length - 1; // 默认是最后一句歌词
        for (let i = 0; i < this.data.lyricInfos.length; i++) {
          const info = this.data.lyricInfos[i];
          if (info.time > audioContext.currentTime * 1000) {
            index = i - 1;
            break;
          }
        }
        // 如果当前匹配的歌词是显示的歌词，则不重新跟新歌词
        //
        if (this.data.currentLyricIndex === index) return;
        this.setData({
          currentLyricText: this.data.lyricInfos[index].text,
          currentLyricIndex: index,
          lyricScrollTop: 35 * index,
        });

        // 获取store的共享列表
        playerStore.onStates(
          ["playSongList", "playSongIndex"],
          this.getPlaySongInfosHandler
        );
      });
      audioContext.onWaiting(() => {
        audioContext.pause();
      });

      audioContext.onCanplay(() => {
        audioContext.play();
      });

      // 监听自然播放结束
      audioContext.onEnded(() => {
        this.changeNewSong();
      });
    }
  },

  changeNewSong(isNext = true) {
    const length = this.data.playSongList.length;
    let index = this.data.playSongIndex;

    /* 根据模式，来播放歌曲 */
    switch (this.data.playModeIndex) {
      case 0:
        isNext ? index++ : index--;
        if (index === length) index = 0;
        if (index === -1) index = length - 1;
        break;
      case 1:
        break;
      case 2:
        index = Math.floor(Math.random() * length);
        break;
    }

    const newSong = this.data.playSongList[index];
    // 将数据重置
    this.setData({
      currentSong: {},
      sliderValue: 0,
      currentTime: 0,
      durationTime: 0,
      isPlaying: true,
    });
    // 重新播放新的歌曲
    this.setupPlaySong(newSong.id);

    /* 保存最新的索引 */
    playerStore.setState("playSongIndex", index);
  },

  /* 上一首 */
  onPrevBtnTap() {
    this.changeNewSong(false);
  },
  /* 下一首 */
  onNextBtnTap() {
    this.changeNewSong();
  },
  /* 模式切换 */
  onModeBtnTap() {
    let modeIndex = this.data.playModeIndex;
    modeIndex++;
    if (modeIndex === 3) modeIndex = 0;
    this.setData({
      playModeIndex: modeIndex,
    });
  },
  onNavBackTap() {
    wx.navigateBack();
  },
});
