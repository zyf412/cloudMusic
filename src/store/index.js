import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicIdArr: [1867217766, 1874972712],
    newMusicIdIndex: 0,
    allSongInfo: [],
    playListCate: '全部',
    playListCateScrollTop: 0, // 歌单分类滚动条的位置
    ifShowHighQuality: false, // 是否显示精品歌单，默认是false
    artistDetailScrollTop: 0, // 歌手详情滚动条的位置
    mainKeepAliveArr: ['FindMusic', 'ArtistDetail']
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
    }
  },
  actions: {
  },
  modules: {
  }
})
