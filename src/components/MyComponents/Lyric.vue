<template>
  <div class="songLyric">
    <div class="lyricBox" v-if="id">
      <div class="pic" :class="!isPause?['turn']:''">
        <el-avatar :size="200" :src="info.al.picUrl"></el-avatar>
      </div>
      <div>
        <div class="songName">{{info.name}}</div>
        <div>
          <span style="margin-right: 5px" v-for="(item,index) in info.ar" :key="index">{{item.name}}</span>--<span>{{info.al.name}}</span>
        </div>
      </div>
      <div class="lyric" ref="lyricRef">
        <div class="lyricItem" :style="lyricIndex===index?{color: '#ff4e4e','font-weight': 'bold'}:''" v-for="(item,index) in lyricArr" :key="index">{{item[1]}}</div>
      </div>
    </div>
    <div class="commentBox">
      <SongComment :id="id"></SongComment>
    </div>
  </div>
</template>

<script>
import SongComment from '@/components/Comment/SongComment.vue'
export default {
  props: ['id', 'currentTime', 'info', 'isPause'],
  components: {
    SongComment
  },
  data () {
    return {
      lyricArr: [],
      lyricIndex: 0,
      timer: null
    }
  },
  created () {
    if (this.id) {
      this.getLyric(this.id)
    }
  },
  watch: {
    id (newdate, olddate) {
      this.getLyric(newdate)
      this.lyricIndex = 0
      this.timer = null
    },
    currentTime (newdate, olddate) {
      // 找到比当前时间大的歌词index
      if (this.lyricArr.length !== 0) {
        const index = this.lyricArr.findIndex(item => {
          return this.currentTime < item[0]
        })
        // 如果有歌词的时间比当前时间大,说明返回的时索引,索引减1,就是当前歌词的位置
        // 如果index-1,那么当前歌词的位置就是最后一句
        this.lyricIndex = index === -1 ? this.lyricIndex : index - 1
        if (newdate > this.lyricArr[this.lyricArr.length - 1][0]) {
          this.lyricIndex = this.lyricArr.length - 1
        }
      }
    },
    lyricIndex () {
      // 当前位置索引改变, 平滑滚动歌词, 添加一个防抖
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.$refs.lyricRef.scrollTo({
            top: this.lyricIndex * 50,
            behavior: 'smooth'
          })
          this.timer = null
        }, 300)
      }
    }
  },
  methods: {
    async getLyric (id) {
      const { data: res } = await this.$http.get('/lyric', {
        params: {
          id
        }
      })
      if (res.code !== 200) return this.$message.error('获取歌词失败')
      // 通过split方法,以'\n'分隔
      this.lyricArr = res.lrc.lyric.split('\n').map(item => {
        return item.replace('[', '').split(']')
      })
      // 有些时间的歌词时空的,那就不用渲染了,过滤掉没用的意义的时间
      this.lyricArr = this.lyricArr.filter(item => !!item[1])
      // 遍历,将xx:xx格式的时间转换成秒为单位
      this.lyricArr.forEach(item => {
        item[0] = item[0].split(':')
        item[0] = parseInt(item[0][0]) * 60 + parseFloat(item[0][1])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes turn {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}
.songLyric {
  width: 100%;
  .lyricBox {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    // background-color: #f5f4f7;
    background-image: linear-gradient(to bottom, #d6e4f1, #fff);
    margin: 0 auto;
    text-align: center;
    overflow-y: auto;
    padding-top: 15px;
    .pic {
      position: absolute;
      width: 200px;
      height: 200px;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 50%;
      background-color: pink;
      left: 150px;
    }
    .turn {
      animation: turn 10s linear infinite;
    }
    .songName {
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    .lyric {
      position: relative;
      height: 170px;
      overflow-y: auto;
      padding-top: 100px;
      padding-bottom: 100px;
      margin-top: 150px;
      transition: all 1s;
      &::-webkit-scrollbar {
        display: block; /* Chrome Safari */
      }
      .lyricItem {
        font-size: 15px;
        line-height: 50px;
        height: 50px;
      }
    }
  }
  .commentBox {
    width: 60%;
    margin: 50px auto;
  }
}
</style>
