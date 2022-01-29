<template>
  <div>
    <div class="playerbox">
      <div class="container">
        <video ref="video" :src="src" autoplay class="player" @timeupdate="undateTime"  @canplay="getDuration" @click="changeState(isPause)"></video>
        <div class="contraler">
          <div class="slider">
            <el-slider :max="process.duration" v-model="process.currentTime" @change="changeTime" :show-tooltip="false"></el-slider>
          </div>
          <div class="contral">
            <div class="left">
              <i class="el-icon-video-play inHover" @click="changeState(isPause)" v-if="isPause"></i>
              <i class="el-icon-video-pause inHover" @click="changeState(isPause)" v-else></i>
              <span class="time">{{filterCurrentTime}} / {{filterDuraction}}</span>
            </div>
            <div class="right">
              <el-slider v-model="volume" height="100px" :show-tooltip="false" @change="changeVolume">
              </el-slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['src'],
  data () {
    return {
      process: {
        percentage: 0, // 进度
        duration: 0, // 播放总时间
        currentTime: 0 // 播放进度
      },
      isPause: false, // 是否暂停
      volume: 100 // 声音大小
    }
  },
  methods: {
    // 绑定播放暂停按钮
    changeState (isPause) {
      if (!isPause) {
        this.$refs.video.pause()
        this.isPause = true
      } else {
        this.$refs.video.play()
        this.isPause = false
      }
    },
    // 得到视频时常
    getDuration () {
      if (this.$refs.video) this.process.duration = this.$refs.video.duration
    },
    // 得到当前播放时间
    undateTime () {
      if (this.$refs.video) this.process.currentTime = this.$refs.video.currentTime
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
      this.$refs.video.currentTime = newTime
    },
    // 改变音量进度条
    changeVolume (newVolume) {
      this.$refs.video.volume = newVolume / 100
    }
  },
  computed: {
    filterCurrentTime () {
      return this.flterTime(this.process.currentTime)
    },
    filterDuraction () {
      return this.flterTime(this.process.duration)
    }
  }
}
</script>

<style lang="scss" scoped>
.playerbox {
  width: 100%;
  overflow: hidden;
  .container {
    background-color: #000;
    .player {
      width: 90%;
      height: 400px;
      margin: 0 auto;
      display: block;
    }
    .contraler {
      width: 100%;
      height: 40px;
      color: #fff;
      background-color: #000;
      position: relative;
      .slider {
        transform: translateY(-50%);

      }
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
          .el-slider__runway {
              background-color: #6c6c6c;
          }
        }
      .contral {
          width: 100%;
        height: 30px;
        position: absolute;
        top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        box-sizing: border-box;
        .left {
            color: orange;
            font-size: 25px;
            .time {
                margin-left: 8px;
                font-size: 15px;
                color: #fff;
            }
        }
        .right {
            width: 150px;
        }
      }
    }
  }
}
</style>
