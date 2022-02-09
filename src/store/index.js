import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
})
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    historyTags: ['致你'],
    audioState: false,
    musicIdArr: [],
    newMusicIdIndex: 0,
    allSongInfo: [],
    playListCate: '全部',
    playListCateScrollTop: 0, // 歌单分类滚动条的位置
    ifShowHighQuality: false, // 是否显示精品歌单，默认是false
    artistDetailScrollTop: 0, // 歌手详情滚动条的位置
    ifArtistActived: false, // 歌手分类是否显示
    mainKeepAliveArr: ['AllVideo', 'FindMusic', 'ArtistDetail', 'Collection'], // 缓存组件列表
    ifMVActived: false, // mv分类是否显示
    ifVideoActived: false, // 视频分类是否显示
    ifSubVideoActived: false, // 视频收藏是否显示
    ifLogin: false, // 是否登录
    videoCate: '全部视频',
    uid: null, // 用户ID
    likelist: [] // 喜欢的音乐的id列表
  },
  mutations: {
    // 获得播放列表
    getMusicIdList (state, list) {
      state.musicIdArr = list.musicIdlist
      state.newMusicIdIndex = list.musicIdIndex
      state.allSongInfo = list.songlist
    },
    // 添加音乐
    addMusic (state, song) {
      if (state.musicIdArr.includes(song.id)) {
        state.newMusicIdIndex = state.musicIdArr.indexOf(song.id)
      } else {
        state.musicIdArr.push(song.id)
        state.allSongInfo.push(song)
        state.newMusicIdIndex = state.musicIdArr.length - 1
      }
    },
    // 改变标签类别
    changePlayListCate (state, newCate) {
      state.playListCate = newCate
    },
    // 获取到之前滚动条的位置
    getScrollTop (state, scrollTop) {
      state.playListCateScrollTop = scrollTop
    },
    changeScrollTop (state, scrollTop) {
      state.playListCateScrollTop = 0
    },
    // 获得歌手详情滚动条的位置
    getArtistDetailScrollTop (state, scrollTop) {
      state.artistDetailScrollTop = scrollTop
    },
    // 改变显示精品歌单
    changeHighQuality (state) {
      // console.log('fasong')
      state.ifShowHighQuality = !state.ifShowHighQuality
    },
    // 清除ArtistDetail的缓存后，先删除,100ms后在添加
    clearCatch (state, name) {
      for (let i = 0; i < state.mainKeepAliveArr.length; i++) {
        if (state.mainKeepAliveArr[i] === name) {
          state.mainKeepAliveArr.splice(i, 1)
          console.log(state.mainKeepAliveArr)
          break
        }
      }
      setTimeout(() => {
        state.mainKeepAliveArr.push(name)
      }, 200)
    },
    // ifArtistActived 歌手分类显示
    showArtist (state) {
      state.ifArtistActived = false
    },
    // ifArtistActived 歌手分类关闭
    closeArtist (state) {
      state.ifArtistActived = true
    },
    // ifArtistActived 歌手分类显示
    showMV (state) {
      state.ifMVActived = false
    },
    // ifArtistActived 歌手分类关闭
    closeMV (state) {
      state.ifMVActived = true
    },
    // 改变视频分类
    changeVideoCate (state, name) {
      state.videoCate = name
    },
    // 记录登录
    setLogin (state, uid) {
      state.ifLogin = true
      state.uid = uid
      console.log(uid)
    },
    // 记录退出
    setLogout (state) {
      state.ifLogin = false
      state.uid = null
    },
    // ifArtistActived 歌手分类显示
    showVideo (state) {
      state.ifVideoActived = false
    },
    // ifArtistActived 歌手分类关闭
    closeVideo (state) {
      state.ifVideoActived = true
    },
    // ifSubVideoActived 歌手分类显示
    showSubVideo (state) {
      state.ifSubVideoActived = false
    },
    // ifSubVideoActived 歌手分类关闭
    closeSubVideo (state) {
      state.ifSubVideoActived = true
    },
    setAudioState (state, newState) {
      state.audioState = newState
    },
    // 移除记录
    removeHistoryTags (state, name) {
      const index = state.historyTags.findIndex(item => item === name)
      state.historyTags.splice(index, 1)
    },
    // 添加记录
    addHistoryTags (state, name) {
      if (state.historyTags.includes(name)) {
        const index = state.historyTags.findIndex(item => item === name)
        state.historyTags.splice(index, 1)
        state.historyTags.unshift(name)
      } else {
        state.historyTags.unshift(name)
      }
    },
    // 获得喜欢列表
    getLikeList (state, list) {
      state.likelist = list
    },
    // 添加喜欢
    addLikeList (state, id) {
      state.likelist.push(id)
    },
    // 不喜欢
    disLike (state, id) {
      const index = state.likelist.findIndex(item => item === id)
      state.likelist.splice(index, 1)
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
