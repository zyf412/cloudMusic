<template>
  <div class="list">
    <div class="ListHead">
      <img :src="ablum.blurPicUrl" alt="" class="img" />
      <div class="discribe">
        <h2 class="name">{{ ablum.name }}</h2>
        <!-- <div class="user">
          <el-avatar :size="'small'" :src="ablum.artists.picUrl" v-if="ablum.artists"></el-avatar>
          <span class="nickname" v-if="ablum.creator">
            {{ ablum.creator.nickname }}</span>
        </div> -->
        <div class="btns">
          <el-button icon="el-icon-caret-right" class="bgcolor" size="mini" round @click="playAll">播放全部 <i class="el-icon-plus"></i></el-button>
          <el-button icon="el-icon-folder-checked" size="mini" round v-if="!subscribed" @click="subscribe(1,id)">收藏({{ subCount }})</el-button>
          <el-button icon="el-icon-folder-checked" size="mini" style="color:#ec4141;" @click="subscribe(2,id)" round v-else>已收藏({{ subCount }})</el-button>
          <el-button icon="el-icon-top-right" size="mini" round>转发数:{{ shareCount }}</el-button>
        </div>
        <div class="textBox">
          <div class="tag">
            <span v-for="(item, index) in ablum.tags" :key="index">
              {{ item }} /
            </span>
          </div>
          <div>
            <span>歌曲:{{ ablum.trackCount }}</span>
            <span> 播放:{{ ablum.playCount }}</span>
          </div>
          <div class="disc" :title="ablum.description">简介:{{ ablum.description }}</div>
        </div>
      </div>
    </div>
    <div class="songList">
      <el-tabs v-model="activeName">
        <el-tab-pane label="歌曲列表" name="first">
          <el-table :data="songs" style="width: 100%" @row-dblclick="rowDbClick">
            <el-table-column type="index">
            </el-table-column>
              <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                   <i class="iconfont icon-xihuan2" @click="like(false,scope.row.id)" v-if="likelist.includes(scope.row.id)"></i>
                   <i class="iconfont icon-xihuan" @click="like(true,scope.row.id)" v-else></i>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="音乐标题" width="250">
            </el-table-column>
            <el-table-column label="歌手" width="250">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.ar" :key="index" style="margin-left: 10px">{{ item.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="al.name" label="专辑">
            </el-table-column>
            <el-table-column prop="dt" label="时长">
              <template slot-scope="scope">
                <span>{{fliterTime(scope.row.dt )}}</span>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane :label="'评论'+ commentCount" name="second" :lazy="true">
          <AlbumComment :id="id"></AlbumComment>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import { eventBus } from '@/eventBus/eventBus.js'
import AlbumComment from '@/components/Comment/AlbumComment.vue'
import { mapMutations, mapState } from 'vuex'
import { mixin } from '@/mixin/mixin.js'
export default {
  props: ['id'],
  mixins: [mixin],
  components: {
    AlbumComment
  },
  data () {
    return {
      ablum: {},
      songs: [],
      songlist: [],
      musicIdList: [],
      musicIdIndex: 0,
      activeName: 'first',
      shareCount: 0,
      subCount: 0,
      commentCount: 0,
      subscribed: false
    }
  },
  created () {
    console.log(this.id)
    this.getAlbumInfo()
    this.getCount()
  },
  computed: {
    ...mapState(['likelist', 'uid'])
  },
  methods: {
    ...mapMutations(['getMusicIdList', 'addLikeList', 'disLike']),
    //   得到专辑信息
    async getAlbumInfo () {
      const { data: res } = await this.$http.get('/album', { params: { id: this.id } })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.ablum = res.album
      this.songs = res.songs
      this.musicIdList = res.songs.filter(item => item.st !== -1).map(item => Number(item.id))
      // console.log(res.songs)
      this.getMusicListDetail(this.musicIdList.join(','))
    },
    async getCount () {
      const { data: res } = await this.$http.get('/album/detail/dynamic', { params: { id: this.id } })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.shareCount = res.shareCount
      this.subCount = res.subCount
      this.commentCount = res.commentCount
      this.subscribed = res.isSub
    },
    // 得到音乐信息
    async getMusicListDetail (ids) {
      const { data: res } = await this.$http.get('/song/detail', {
        params: { ids: ids }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.songlist = res.songs
    },
    // 过滤时间
    fliterTime (time) {
      let min = parseInt(time / 1000 / 60)
      min = min < 10 ? '0' + min : min
      let sec = parseInt((time / 1000) % 60)
      sec = sec < 10 ? '0' + sec : sec
      return `${min}:${sec}`
    },
    async rowDbClick (row) {
      // console.log(this.checkMusic(row.id))
      if (!await this.checkMusic(row.id)) return
      this.musicIdIndex = this.musicIdList.indexOf(row.id)
      this.getMusicIdList({
        musicIdlist: this.musicIdList,
        musicIdIndex: this.musicIdIndex,
        songlist: this.songlist
      })
    },
    // 播放全部
    playAll () {
      this.musicIdIndex = 0
      this.getMusicIdList({
        musicIdlist: this.musicIdlist,
        musicIdIndex: this.musicIdIndex,
        songlist: this.songlist
      })
    },
    // 喜欢
    async like (like, id) {
      if (!this.uid) return this.$message.error('请先登录账号欧')
      const { data: res } = await this.$http.get('/like', {
        params: {
          like,
          id
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      if (like) {
        this.addLikeList(id)
        return this.$message.success('已添加到喜欢列表')
      } else {
        this.disLike(id)
        return this.$message.success('取消喜欢成功')
      }
      // console.log(this.songlist)
    },
    // 收藏歌单
    async subscribe (t, id) {
      if (!this.uid) return this.$message.error('请先登录账号欧')
      const { data: res } = await this.$http.get('/album/sub', {
        params: {
          t,
          id
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.subscribed = !this.subscribed
      if (t === 1) {
        this.subCount++
        // eventBus.$emit('updateUserPlaylist')
        return this.$message.success('已添加到收藏列表')
      } else {
        this.subCount--
        // eventBus.$emit('updateUserPlaylist')
        return this.$message.success('取消收藏成功')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  .ListHead {
    height: 200px;
    display: flex;
    justify-content: space-around;
    .img {
      height: 200px;
      border-radius: 5px;
      padding-right: 10px;
    }
    .discribe {
      height: 200px;
      width: 80%;
      min-width: 700px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .user {
      display: flex;
      align-items: center;
      .nickname {
        margin-left: 5px;
        font-size: 8px;
      }
    }
    .btns {
      .bgcolor {
        background-color: #ec4141;
        color: #fff;
      }
    }
    .textBox {
      font-size: 8px;
      .disc {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
