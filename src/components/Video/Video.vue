<template>
  <div class="MV">
    <div class="MVcontainer">
      <div class="left">
        <h4>MV详情</h4>
        <VideoPlayer :src="VideoSrc"></VideoPlayer>
        <div class="avater">
          <el-image  style="width: 50px; height: 50px; border-radius:50% " lazy :src="Videoinfo.avatarUrl"></el-image>
          <!-- <span class="name" v-for="artist in Videoinfo.creator" :key="artist.id">{{artist.name}}</span> -->
          <span class="name" v-if="Videoinfo.creator">{{Videoinfo.creator.nickname}}</span>
        </div>
        <h2 class="name">{{Videoinfo.title}}</h2>
        <div class="comment">
          <Videocomment :id = "id"></Videocomment>
        </div>
      </div>
      <div class="right">
        <h4>相关推荐</h4>
        <div class="recommendBox" v-for="(item,index) in relatedVideo" :key="index">
          <div class="image" @click="goToVideoDetial(item.vid)">
            <el-image lazy :src="item.coverUrl"></el-image>
          </div>
          <div class="discript">
              <dir class="title" :title="item.title">{{item.title}}</dir>
            <div class="creater">by <span v-for="artist in item.creator" :key="artist.userId">{{artist.userName}}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/MyComponents/VideoPlayer.vue'
import Videocomment from '@/components/Comment/Videocomment.vue'
export default {
  props: ['id'],
  inject: ['reload'],
  components: {
    VideoPlayer,
    Videocomment
  },
  data () {
    return {
      VideoSrc: '',
      relatedVideo: [],
      Videoinfo: {},
      artistAvaUrl: ''
    }
  },
  created () {
    this.getVideoSrc(this.id)
    this.getRelatedVideo(this.id)
    this.getVideoinfo(this.id)
  },
  //   mounted () {
  //     this.reload()
  //   },
  watch: {
    $route (to, from) {
    //   console.log(123)
    //   this.reload()
      this.getVideoSrc(this.id)
      this.getRelatedVideo(this.id)
      this.getVideoinfo(this.id)
    }
  },
  methods: {
    // 得到视频的播放地址
    async getVideoSrc (id) {
      const { data: res } = await this.$http.get('/video/url', {
        params: { id }
      })
      if (res.code !== 200) return this.$message.error('获取播放链接失败')
      this.VideoSrc = res.urls[0].url
    },
    // 得到相关视频
    async getRelatedVideo (id) {
      const { data: res } = await this.$http.get('/related/allvideo', {
        params: { id }
      })
      if (res.code !== 200) return this.$message.error('获取相关推荐失败')
      this.relatedVideo = res.data
    },
    // 得到视频的信息
    async getVideoinfo (id) {
      const { data: res } = await this.$http.get('/video/detail', {
        params: { id }
      })
      if (res.code !== 200) return this.$message.error('获取信视频息失败')
      this.Videoinfo = res.data
    //   this.getArtistinfo(res.data.artistId)
    },
    // artistId
    // 得到MV的信息
    async getArtistinfo (id) {
      const { data: res } = await this.$http.get('/artist/detail', {
        params: { id }
      })
      if (res.code !== 200) return this.$message.error('获取作者信息失败')
      this.artistAvaUrl = res.data.artist.cover
    },
    // 跳转到歌曲详情页面
    goToVideoDetial (id) {
      this.$router.push(`/video/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.MV {
  position: fixed;
  top: 70px;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10000;
  background-color: #fff;
  display: flex;
  overflow-y: auto;
  .MVcontainer {
    display: flex;
    width: 80%;
    margin: 0 auto;
    justify-content: space-between;
    h4 {
      margin-bottom: 15px;
    }
    .left {
      width: 65%;
      .avater {
        margin-top: 30px;
        display: flex;
        align-items: center;
        .el-image {
          margin-right: 15px;
        }
        .name {
          margin: 5px;
        }
      }
      .name {
        margin: 20px 0;
      }
    }
    .right {
      width: 30%;
      // background-color: pink;
      .recommendBox {
        width: 100%;
        display: flex;
        margin-top: 15px;
        .image {
          width: 55%;
          margin-right: 8px;
          // background: orange;
          .el-image {
            border-radius: 5px;
          }
        }
        .discript {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .title {
            font-size: 15px;
            // height: 36px;
               text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;

          }
          .creater {
            margin-top: 10px;
            font-size: 12px;
            color: #ccc;
          }
        }
      }
    }
  }
}
</style>
