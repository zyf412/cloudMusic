<template>
  <div class="footer">
    <div class="footerLeft">
      <div class="img" @click="showLyric = !showLyric">
        <el-avatar  :size="50" shape="square" v-if="allSongInfo[musicIdIndex]" :src="allSongInfo[musicIdIndex].al.picUrl"></el-avatar>
      </div>
      <div class="info" v-if="allSongInfo[musicIdIndex]">
        <span class="songName">{{allSongInfo[musicIdIndex].name}}</span>
        <span class="songer">
          <span style="margin-right: 5px" v-for="(item,index) in allSongInfo[musicIdIndex].ar" :key="index">{{item.name}}</span>
        </span>
      </div>
    </div>
    <div class="footerCenter">
      <div class="player">
        <div class="control">
          <div @click="changePlayType">
            <i title="顺序播放" class="el-icon-s-unfold inHover" v-if="playType[0]"></i>
            <i title="单曲循环" class="el-icon-refresh-right inHover" v-if="playType[1]"></i>
            <i title="随机播放" class="el-icon-refresh inHover" v-if="playType[2]"></i>
          </div>
          <i class="el-icon-caret-left inHover" @click="lastSong"></i>
          <i class="el-icon-video-play inHover" @click="changeState(isPause)" v-if="isPause"></i>
          <i class="el-icon-video-pause inHover" @click="changeState(isPause)" v-else></i>
          <i class="el-icon-caret-right inHover" @click="nextSong"></i>
          <i class="inHover" @click="showLyric = !showLyric">词</i>
        </div>
        <div class="process">
          <span class="time">{{filterCurrentTime}}</span>
          <el-slider :max="process.duration" v-model="process.currentTime" :show-tooltip="false" @change="changeTime"></el-slider>
          <span class="time">{{filterDuraction}}</span>
        </div>
        <audio ref="audio" @play="playing" @ended="end" @canplay="getDuration" @timeupdate="undateTime" :src="musicUrl" autoplay></audio>
      </div>
    </div>
    <div class="footerRight">
      <div class="showSpeaker">
        <el-button icon="el-icon-headset" size="" circle></el-button>
        <div class="speaker">
          <el-slider v-model="volume" vertical height="100px" :show-tooltip="false" @change="changeVolume"></el-slider>
        </div>
      </div>
      <div class="showSpeaker">
        <el-button icon="el-icon-s-operation " @click="showCurrentList" circle></el-button>
        <div ref="currentListRef" class="currentList">
          <el-table :data="allSongInfo" style="width: 100%" @row-dblclick=rowDbClick :row-style="rowStyle">
            <el-table-column show-overflow-tooltip class="hidden" prop="name" width="250" label="音乐标题" >
            </el-table-column>
            <el-table-column label="歌手" width="250">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.ar" :key="index" style="margin-left: 10px">{{ item.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dt" label="时长">
              <template slot-scope="scope">
                <span>{{flterTime(scope.row.dt / 1000 )}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
     <transition name="el-zoom-in-bottom">
    <div class="lyric" v-show="showLyric">
      <Lyric :isPause="isPause" :id = "musicIdArr[musicIdIndex]" :currentTime="this.process.currentTime" :info="allSongInfo[musicIdIndex]"></Lyric>
    </div>
     </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { eventBus } from '@/eventBus/eventBus.js'
import Lyric from '@/components/MyComponents/Lyric.vue'
export default {
  components: {
    Lyric
  },
  data () {
    return {
      musicUrl: '', // 播放当前音乐的url
      // musicIdArr: [1867217766, 1874972712], // 音乐id数组
      musicIdIndex: 0,
      isPause: false, // 是否暂停
      process: {
        percentage: 0, // 进度
        duration: 0, // 播放总时间
        currentTime: 0 // 播放进度
      },
      // parseIntCurrentTime: 0, // 得到整数的当前时间
      volume: 100, // 声音大小
      // ['squence', true], ['circle', false], ['random', false]
      playType: [true, false, false],
      TypeIndex: 0, // 播放类型的索引
      isOpenCurrentList: true,
      showLyric: false
    }
  },
  created () {
    this.musicIdIndex = this.newMusicIdIndex
    this.getMusicUrl(this.musicIdArr[this.musicIdIndex])
    eventBus.$on('gotoVideo', () => {
      if (!this.isPause) {
        this.changeState(this.isPause)
      }
    })
  },
  computed: {
    ...mapState(['musicIdArr', 'newMusicIdIndex', 'allSongInfo']),
    filterCurrentTime () {
      return this.flterTime(this.process.currentTime)
    },
    filterDuraction () {
      return this.flterTime(this.process.duration)
    }
    // parseIntDuraction () {
    //   return parseInt(this.process.duration)
    // }
  },
  watch: {
    // 'process.currentTime': {
    //   handler (newVel) {
    //     this.parseIntCurrentTime = parseInt(newVel)
    //   }
    // }
    musicIdArr: {
      handler () {
        this.$nextTick(() => {
          this.getMusicUrl(this.musicIdArr[this.musicIdIndex])
          this.$refs.audio.play()
        })
      }
    },
    newMusicIdIndex: {
      handler (newVel) {
        this.musicIdIndex = newVel
        this.getMusicUrl(this.musicIdArr[this.musicIdIndex])
        this.$refs.audio.play()
      }
    }
  },
  methods: {
    // 得到音乐url
    async getMusicUrl (id) {
      // console.log(data)
      // if (!check.success) return this.$message.error(check.message)
      if (!id) return
      const { data: res } = await this.$http.get('/song/url', {
        params: { id }
      })
      if (res.code !== 200) return this.$message.error('播放失败')
      this.musicUrl = res.data[0].url
      // console.log(this.musicUrl)
      // this.musicIdArr.push(this.musicUrl)
    },
    // 绑定播放暂停按钮
    changeState (isPause) {
      if (!isPause) {
        this.$refs.audio.pause()
        this.isPause = true
      } else {
        this.$refs.audio.play()
        this.isPause = false
      }
    },
    // 得到音乐时常
    getDuration () {
      this.process.duration = this.$refs.audio.duration
    },
    // 得到当前播放时间
    undateTime () {
      if (this.$refs.audio) this.process.currentTime = this.$refs.audio.currentTime
    },
    // 进度条text
    format () {
      return this.filterDuraction
    },
    // 过滤时间
    flterTime (time) {
      let min = parseInt(time / 60)
      min = min < 10 ? '0' + min : min
      let cen = parseInt(time % 60)
      cen = cen < 10 ? '0' + cen : cen
      return `${min}:${cen}`
    },
    // 改变时间进度条
    changeTime (newTime) {
      this.$refs.audio.currentTime = newTime
    },
    // 改变音量进度条
    changeVolume (newVolume) {
      this.$refs.audio.volume = newVolume / 100
    },
    playing () {
      this.isPause = false
    },
    // 播放结束后的处理事件
    end () {
      if (this.TypeIndex === 0) return this.nextSong() // 类型索引为0 顺序播放
      if (this.TypeIndex === 1) return this.circleSong() // 类型索引为1 循环播放
      if (this.TypeIndex === 2) return this.randomSong() // 类型索引为2 随机播放
    },
    // 循环播放函数
    circleSong () {
      this.$refs.audio.play()
      this.isPause = false
    },
    // 随机播放函数
    randomSong () {
      this.musicIdIndex = Math.floor(Math.random() * this.musicIdArr.length)
      this.getMusicUrl(this.musicIdArr[this.musicIdIndex])
      this.$refs.audio.play()
      // this.isPause = false
    },
    // 上一首歌
    nextSong () {
      this.musicIdIndex++
      this.musicIdIndex = this.musicIdIndex % this.musicIdArr.length
      this.getMusicUrl(this.musicIdArr[this.musicIdIndex])
      this.$refs.audio.play()
      // this.isPause = false
    },
    // 下一首歌
    lastSong () {
      this.musicIdIndex--
      this.musicIdIndex =
        this.musicIdIndex < 0 ? this.musicIdArr.length - 1 : this.musicIdIndex
      this.getMusicUrl(this.musicIdArr[this.musicIdIndex])
      this.$refs.audio.play()
      // this.isPause = false
    },
    // 播放模式和改变状态
    changePlayType () {
      this.playType[this.TypeIndex] = false
      this.TypeIndex++
      this.TypeIndex = this.TypeIndex % this.playType.length
      this.playType[this.TypeIndex] = true
      this.$forceUpdate() // 强制刷新
    },
    // 显示和关闭当前播放列表
    showCurrentList () {
      if (this.isOpenCurrentList) {
        this.$refs.currentListRef.style.display = 'block'
      } else this.$refs.currentListRef.style.display = 'none'
      this.isOpenCurrentList = !this.isOpenCurrentList
    },
    // 当前列表双击事件
    rowDbClick (row) {
      this.musicIdIndex = this.musicIdArr.indexOf(row.id)
      this.getMusicUrl(this.musicIdArr[this.musicIdIndex])
      this.$refs.audio.play()
    },
    // 播放列表中的样式
    rowStyle ({ row, rowIndex }) {
      if (rowIndex === this.musicIdIndex) {
        return {
          color: '#ff4e4e',
          backgroundColor: '#f6cccc'
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 100%;
  display: flex;
  border-top: 1px solid #ccc;
  .footerLeft {
    flex: 1;
    display: flex;
    align-items: center;
    .img {
      margin-right: 5px;
      cursor: pointer;
      position: relative;
      &::before {
        content: ">";
        background-color: rgba(0,0,0,.3);
        display: none;
        position: absolute;
        transform: rotate(-90deg);
        text-align: center;
        line-height: 50px;
        color: #fff;
        font-size: 25px;
        left:0;
        top: 0;
        width: 50px;
        height: 50px;
      }
      &:hover::before {
        display: block;
      }
    }
    .info {
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      .songName {
        font-size: 16px;
      }
      .songer {
        font-size: 12px;
      }
    }
  }
  .footerCenter {
    flex: 1;
    .player {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .control {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 100px;
        height: 40px;
        .inHover {
          transition: all 0.3s;
          cursor: pointer;
        }
        .inHover:hover {
          transform: scale(1.5);
          color: orange;
        }
      }
      .process {
        display: flex;
        align-items: center;
        ::v-deep .el-slider {
          width: 80%;
          margin: 0 10px;
          .el-slider__bar {
            background-color: #ff4e4e;
          }
          .el-slider__button {
            border: 0;
            background-color: #ff4e4e;
            width: 10px;
            height: 10px;
          }
        }
        .time {
          font-size: 13px;
        }
      }
    }
  }
  .footerRight {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .showSpeaker {
      position: relative;
      border: 0;
      // transform: scale(1.5);
      margin-right: 15px;
      .el-button {
        font-size: 24px;
        border: 0;
      }
      &:hover .speaker {
        display: block;
      }
      .speaker {
        position: absolute;
        z-index: 1001;
        left: 50%;
        transform: translate(-50%, -150%);
        transform-origin: bottom;
        display: none;
        transition: display 0.5s;
        ::v-deep .el-slider {
          .el-slider__bar {
            background-color: #ff4e4e;

          }
          .el-slider__button {
            border: 0;
            background-color: #ff4e4e;
            width: 10px;
            height: 10px;
          }
        }
      }
      .currentList {
        box-shadow: -2px 0 15px rgba(0,0,0,.3);
        position: fixed;
        background-color: #fff;
        top: 70px;
        right: 0px;
        bottom: 70px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
      }
    }
  }
  .lyric {
    position: fixed;
    top: 70px;
    bottom: 70px;
    left: 0;
    right: 0;
    // background: #f5f4f7;
      background-image: linear-gradient(to bottom , #d6e4f1, #fff);
    z-index: 999;
    overflow-y: auto;
  }
}
</style>
