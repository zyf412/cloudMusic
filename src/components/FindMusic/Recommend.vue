<template>
  <div>
    <!-- 推荐歌单 -->
    <div class="personalized">
      <h2>推荐歌单 ></h2>
      <div class="box">
        <el-card :body-style="{ padding: '3px' }" v-for="item in personalized" :key="item.id" @click.native="goToDetial(item.id)">
          <MyImage :src="item.picUrl"></MyImage>
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
        <div class="Song" v-for="(item) in newSong" :key="item.id">
          <div class="avatar" @click="playNewSong(item.id)">
            <div class="image"><MyImage :src="item.picUrl"></MyImage></div>
          </div>
          <div class="info" @dblclick="playNewSong(item.id)">
            <div class="name">
              <span :title="item.name">{{ item.name }} </span><span v-if="item.song.alias.length" :title="item.song.alias[0] " class="alias">({{ item.song.alias[0] }})</span>
            </div>
            <div v-if="item.song.artists" class="songer">
              <span :title=" item2.name " v-for="item2 in item.song.artists" :key="item2.id">{{ item2.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐mv -->
    <div class="newMV">
       <h2>推荐mv ></h2>
       <div class="box">
           <div class="mvbox" :body-style="{ padding: '3px' }" v-for="item in newMV" :key="item.id" @click="goToMVDetial(item.id)">
          <MyImage :src="item.picUrl" :setStyle="'width: 100%; height: 200px;'"></MyImage>

          <!-- <el-image lazy style="width: 100%; height: 200px;" :src = "item.picUrl"></el-image> -->
          <div class="textBox">
            <span>{{ item.name }}</span><br>
            <span v-for="artist in item.artists" :key="artist.id">{{artist.name}} </span>
          </div>
           </div>
       </div>
    </div>

  </div>
</template>

<script>
import MyImage from '@/components/MyComponents/MyImage.vue'
import { eventBus } from '@/eventBus/eventBus.js'
import { mapMutations, mapState } from 'vuex'
export default {
  components: {
    MyImage
  },
  data () {
    return {
      personalized: [],
      newSong: [],
      newMV: []
    }
  },
  computed: {
    ...mapState(['playListCate'])
  },
  created () {
    this.getPersonalized()
    this.getPersonalizedNewSong()
    this.getPersonalizedNewMV()
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
    async getPersonalizedNewMV () {
      const { data: res } = await this.$http.get('/personalized/newsong', {
        params: { limit: 12 }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.newSong = res.result
      // console.log(123)
      // console.log(res)
      console.log(this.newSong)
    },
    // 得到推荐的MV
    async getPersonalizedNewSong () {
      const { data: res } = await this.$http.get('/personalized/mv', {
        params: { limit: 12 }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.newMV = res.result
      // console.log(123)
      // console.log(res)
      console.log(this.newMV)
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
    },
    // 跳转到歌曲详情页面
    goToMVDetial (id) {
      this.$router.push(`/mv/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  h2 {
      display: inline-block;
      cursor: pointer;
    }
     .personalized {
    .box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .el-card {
        width: 18%;
        cursor: pointer;
        .textBox {
          // height: 40px;
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
  .newMV {
    .box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .mvbox {
        width: 23%;
        cursor: pointer;
        .textBox {
          // height: 40px;
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
</style>
