<template>
  <div class="MV">
    <div class="MVcontainer">
      <div class="left">
        <h4>MV详情</h4>
        <VideoPlayer :src="MVsrc"></VideoPlayer>
        <div class="avater">
          <el-image  style="width: 50px; height: 50px; border-radius:50% " lazy :src="artistAvaUrl"></el-image>
          <span class="name" v-for="artist in MVinfo.artists" :key="artist.id">{{artist.name}}</span>
        </div>
        <h2 class="name">{{MVinfo.name}}</h2>
        <div class="comment">
          <MVcomment :id = "id"></MVcomment>
        </div>
      </div>
      <div class="right">
        <h4>相关推荐</h4>
        <div class="recommendBox" v-for="item in relatedVideo" :key="item.vid">
          <div class="image" @click="goToMVDetial(item.vid)">
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
import MVcomment from '@/components/Comment/MVcomment.vue'
export default {
  props: ['id'],
  components: {
    VideoPlayer,
    MVcomment
  },
  data () {
    return {
      MVsrc: '',
      relatedVideo: [],
      MVinfo: {},
      artistAvaUrl: ''
    }
  },
  created () {
    this.getMVsrc(this.id)
    this.getRelatedVideo(this.id)
    this.getMVinfo(this.id)
  },
  methods: {
    // 得到MV的播放地址
    async getMVsrc (id) {
      const { data: res } = await this.$http.get('/mv/url', {
        params: { id }
      })
      if (res.code !== 200) return this.$message.error('获取播放链接失败')
      this.MVsrc = res.data.url
    },
    // 得到相关视频
    async getRelatedVideo (id) {
      const { data: res } = await this.$http.get('/related/allvideo', {
        params: { id }
      })
      if (res.code !== 200) return this.$message.error('获取相关推荐失败')
      this.relatedVideo = res.data
    },
    // 得到MV的信息
    async getMVinfo (mvid) {
      const { data: res } = await this.$http.get('/mv/detail', {
        params: { mvid }
      })
      if (res.code !== 200) return this.$message.error('获取mv信息失败')
      this.MVinfo = res.data
      this.getArtistinfo(res.data.artistId)
    },
    // artistId
    // 得到MV的信息
    async getArtistinfo (id) {
      const { data: res } = await this.$http.get('/artist/detail', {
        params: { id }
      })
      if (res.code !== 200) return this.$message.error('获取mv信息失败')
      this.artistAvaUrl = res.data.artist.cover
    },
    // 跳转到歌曲详情页面
    goToMVDetial (id) {
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
