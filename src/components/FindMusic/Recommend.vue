<template>
  <div>
    <!-- 推荐歌单 -->
    <div class="personalized">
      <h2>推荐歌单 ></h2>
      <div class="box">
        <el-card :body-style="{ padding: '3px' }" v-for="(item, index) in personalized" :key="index" @click.native="goToDetial(item.id)">
          <img :src="item.picUrl" alt="" class="image" />
          <div class="textBox">
            <span>{{ item.name }}</span>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 推荐新歌 -->
    <div class="newSong">
      <h2>最新音乐 ></h2>
      <div class="newSongContainer">
        <div class="Song" v-for="(item, index) in newSong" :key="index">
          <div class="avatar" @click="playNewSong(item.id)">
            <el-avatar :size="70" :src="item.picUrl"></el-avatar>
          </div>
          <div class="info" @dblclick="playNewSong(item.id)">
            <div class="name">
              <span :title="item.name">{{ item.name }} </span><span v-if="item.song.alias.length" :title="item.song.alias[0] " class="alias">({{ item.song.alias[0] }})</span>
            </div>
            <div v-if="item.song.artists" class="songer">
              <span :title=" item2.name " v-for="(item2, index2) in item.song.artists" :key="index2">{{ item2.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/eventBus/eventBus.js'
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      personalized: [],
      newSong: []
    }
  },
  computed: {
    ...mapState(['playListCate'])
  },
  created () {
    this.getPersonalized()
    this.getPersonalizedNewSong()
  },
  activated () {
    eventBus.$emit('backTo')
  },

  methods: {
    // 得到推荐歌单
    ...mapMutations(['addMusic']),
    async getPersonalized () {
      const { data: res } = await this.$http.get('/personalized', {
        params: { limit: 10 }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.personalized = res.result
      // console.log(this.personalized)
    },
    // 得到推荐新歌
    async getPersonalizedNewSong () {
      const { data: res } = await this.$http.get('/personalized/newsong', {
        params: { limit: 12 }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.newSong = res.result
      // console.log(123)
      // console.log(res)
      console.log(this.newSong)
    },
    // 跳转到歌单详情页面
    goToDetial (id) {
      // console.log(id)
      this.$router.push(`/playList/${id}`)
    },
    // 双击新歌播放
    // 双击播放歌曲 //因为这里的row中得到的信息数据结构和vuex中的allSongInfo不一样
    // 避免麻烦，所以再次用id请求得到音乐的详情信息
    async playNewSong (id) {
      const { data: res } = await this.$http.get('/song/detail', {
        params: { ids: id }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      // console.log(res)
      this.addMusic(res.songs[0])
    }
  }
}
</script>

<style lang="scss" scoped>
     .personalized {
    h2 {
      display: inline-block;
      cursor: pointer;
    }
    .box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .el-card {
        width: 18%;
        cursor: pointer;
        .image {
          width: 100%;
          display: block;
        }
        .textBox {
          height: 40px;
          // overflow: hidden;
          // white-space: nowrap;
          //  text-overflow: ellipsis;
          //  -o-text-overflow:ellipsis;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .newSong {
    h2 {
      display: inline-block;
      cursor: pointer;
    }
    .newSongContainer {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      font-size: 13px;
      width: 100%;
      box-sizing: border-box;
      .Song {
        width: 30%;
        // overflow: hidden;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 8px;
        .avatar {
          width: 70px;
          cursor: pointer;
        }
        .info {
          width: 100%;
          margin-left: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .name {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .alias {
              color: #ccc;
            }
          }
          .songer {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
