import { HYEventStore } from "hy-event-store";
import { parseLyric } from "../utils/index";
import { throttle } from "underscore";
import { getMusicDetail, getSongLyric, getMusicURL } from "../services/index";

export const audioContext = wx.createInnerAudioContext(); // 创建播放器

export const playerStore = new HYEventStore({
  state: {
    playSongList: [],
    playSongIndex: 0,

    id: 0,
    currentSong: {},
    currentTime: 0, // 当前播放的时间
    durationTime: 0, // 总时间
    lyricInfos: [], // 歌词
    currentLyricText: "", // 当前歌词
    currentLyricIndex: -1,

    isFirstPlay: true,

    isPlaying: false,
    playModeIndex: 0, // 播放模式 0 顺序 1单曲循环 2 随机播放
  },
  actions: {
    // 播放歌曲
    playMusicWithSongId(ctx, id) {
      // 0.将数据重置
      ctx.currentSong = {};
      ctx.sliderValue = 0;
      ctx.currentTime = 0;
      ctx.durationTime = 0;
      ctx.isPlaying = true;
      // 1. 保存id
      ctx.id = id;
      ctx.isPlaying = true;

      // 2. 根据id获取歌曲的详情
      getMusicDetail(id).then((res) => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
      });
      // 3. 获取歌词信息
      getSongLyric(id).then((res) => {
        ctx.lyricInfos = parseLyric(res.lrc.lyric);
      });

      // 4. 播放当前的歌曲
      audioContext.stop();
      audioContext.src = getMusicURL(id);
      audioContext.autoplay = true; // 准备好了后,自动播放

      // 只有页面第一次打开的时候需要添加监听
      if (ctx.isFirstPlay) {
        ctx.isFirstPlay = false;

        // 5. 监听播放的进度
        audioContext.onTimeUpdate(() => {
          // 1. 获取当前播放的时间
          ctx.currentTime = audioContext.currentTime * 1000;

          // 2， 匹配正确的歌词
          if (!ctx.lyricInfos.length) return;
          let index = ctx.lyricInfos.length - 1; // 默认是最后一句歌词
          for (let i = 0; i < ctx.lyricInfos.length; i++) {
            const info = ctx.lyricInfos[i];
            if (info.time > audioContext.currentTime * 1000) {
              index = i - 1;
              break;
            }
          }
          // 如果当前匹配的歌词是显示的歌词，则不重新跟新歌词
          //
          if (ctx.currentLyricIndex === index || index === -1) return;

          const currentLyricText = ctx.lyricInfos[index].text;
          ctx.currentLyricText = currentLyricText;
          ctx.currentLyricIndex = index;
        });
        audioContext.onWaiting(() => {
          audioContext.pause();
        });

        audioContext.onCanplay(() => {
          audioContext.play();
        });

        // 监听自然播放结束
        audioContext.onEnded(() => {
          // 如果是单曲循环，不需要切换下一首歌
          if (audioContext.loop) return;

          // TODO: 切换下一首歌曲
          this.dispatch("playNewMusicAction");
        });
      }
    },
    // 播放/暂停
    playMusicStatusAction(ctx) {
      if (!audioContext.paused) {
        audioContext.pause();
        ctx.isPlaying = false;
      } else {
        audioContext.play();
        ctx.isPlaying = true;
      }
    },
    // 模式的改变
    changePlayModeAction(ctx) {
      let modeIndex = ctx.playModeIndex;
      modeIndex++;
      if (modeIndex === 3) modeIndex = 0;

      // 设置是否是单曲循环
      if (modeIndex === 1) {
        audioContext.loop = true;
      } else {
        audioContext.loop = false;
      }
      ctx.playModeIndex = modeIndex;
    },
    // 改变新的歌曲
    playNewMusicAction(ctx, isNext = true) {
      const length = ctx.playSongList.length;
      let index = ctx.playSongIndex;

      /* 根据模式，来播放歌曲 */
      switch (ctx.playModeIndex) {
        case 1:
        case 0:
          isNext ? index++ : index--;
          if (index === length) index = 0;
          if (index === -1) index = length - 1;
          break;
        case 2:
          index = Math.floor(Math.random() * length);
          break;
      }

      const newSong = ctx.playSongList[index];

      // 重新播放新的歌曲
      // this.setupPlaySong(newSong.id);
      this.dispatch("playMusicWithSongId", newSong.id);

      /* 保存最新的索引 */
      ctx.playSongIndex = index;
    },
  },
});
