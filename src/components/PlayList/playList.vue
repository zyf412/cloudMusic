<template>
  <div class="list">
    <div class="ListHead">
      <img :src="playlist.coverImgUrl" alt="" class="img" />
      <div class="discribe">
        <h2 class="name">{{ playlist.name }}</h2>
        <div class="user">
          <el-avatar :size="'small'" :src="playlist.creator.avatarUrl" v-if="playlist.creator"></el-avatar>
          <span class="nickname" v-if="playlist.creator">
            {{ playlist.creator.nickname }}</span>
        </div>
        <div class="btns">
          <el-button icon="el-icon-caret-right" class="bgcolor" size="mini" round>播放全部 <i class="el-icon-plus"></i></el-button>
          <el-button icon="el-icon-folder-checked" size="mini" round>已收藏({{ playlist.subscribedCount }})</el-button>
          <el-button icon="el-icon-bottom" size="mini" round>下载全部</el-button>
          <el-button icon="el-icon-top-right" size="mini" round>转发{{ playlist.shareCount }}</el-button>
        </div>
        <div class="textBox">
          <div class="tag">
            <span v-for="(item, index) in playlist.tags" :key="index">
              {{ item }} /
            </span>
          </div>
          <div>
            <span>歌曲:{{ playlist.trackCount }}</span>
            <span> 播放:{{ playlist.playCount }}</span>
          </div>
          <div class="disc" :title="playlist.description">简介:{{ playlist.description }}</div>
        </div>
      </div>
    </div>
    <div class="songList">
      <el-tabs v-model="activeName">
        <el-tab-pane label="歌曲列表" name="first">
          <el-table :data="songlist" style="width: 100%" @row-dblclick="rowDbClick">
            <el-table-column type="index">
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
        <el-tab-pane :label="'评论'+ playlist.commentCount" name="second" :lazy="true">
          <PlaylistComment :id="id"></PlaylistComment>
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="third" :lazy="true">
          <Subscribe :id="id"></Subscribe>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PlaylistComment from '@/components/Comment/PlayListComment.vue'
import { mixin } from '@/mixin/mixin.js'
import { mapMutations } from 'vuex'
export default {
  name: 'playList',
  props: ['id'],
  mixins: [mixin],
  components: {
    PlaylistComment,
    Subscribe: () => import('@/components/PlayList/subscribe.vue')
  },
  data () {
    return {
      playlist: { commentCount: 0 },
      musicIdlist: null,
      songlist: [],
      activeName: 'first',
      musicIdIndex: 0
    }
  },
  created () {
    this.getListDetail(this.id)
    console.log(this.id)
  },
  methods: {
    ...mapMutations(['getMusicIdList']),
    // 得到歌单音乐id
    async getListDetail (id) {
      const { data: res } = await this.$http.get('/playlist/detail', {
        params: { id: id }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      // console.log('得到歌单详情')
      // console.log(res)
      this.playlist = res.playlist
      // console.log(this.playlist)
      this.musicIdlist = res.playlist.trackIds.map(item => {
        return Number(item.id)
      })
      this.getMusicListDetail(this.musicIdlist.join(','))
    },
    // 得到歌单音乐详情
    async getMusicListDetail (ids) {
      const { data: res } = await this.$http.get('/song/detail', {
        params: { ids: ids }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.songlist = res.songs
      // console.log(this.songlist)
    },
    fliterTime (time) {
      let min = parseInt(time / 1000 / 60)
      min = min < 10 ? '0' + min : min
      let sec = parseInt((time / 1000) % 60)
      sec = sec < 10 ? '0' + sec : sec
      return `${min}:${sec}`
    },
    async rowDbClick (row) {
      if (!await this.checkMusic(row.id)) return
      this.musicIdIndex = this.musicIdlist.indexOf(row.id)
      this.getMusicIdList({
        musicIdlist: this.musicIdlist,
        musicIdIndex: this.musicIdIndex,
        songlist: this.songlist
      })
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
