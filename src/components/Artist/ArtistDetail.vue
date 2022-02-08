<template>
<transition duration=500 mode="out-in" name="el-zoom-in-center">
  <div class="artistDetail">
    <div class="head">
        <div class="img">
            <el-image :src="artist.img1v1Url"  style="width: 200px; height: 200px"></el-image>
        </div>
        <div class="info">
            <h2>{{artist.name}}</h2>
            <div class="alias font" v-if="artist.alias"> <span v-for="(item,index) in artist.alias" :key="index">{{item}} </span></div>
            <div class="record font">
                <span>单曲数: {{artist.musicSize}}</span>
                <span>专辑数: {{artist.albumSize}}</span>
                <span>MV数: {{artist.mvSize}}</span>
            </div>
        </div>
    </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="专辑" name="first" v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-immediate=flase>
          <h3>热门50首</h3>
          <div class="hotSongs">
            <el-table :data="hotSongs" style="width: 100%"  @row-dblclick="rowDbClick">
             <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="name" label="音乐标题" width="250">
            </el-table-column>
            <el-table-column prop="al.name" label="专辑">
            </el-table-column>
            <el-table-column prop="dt" label="时长">
              <template slot-scope="scope">
                <span>{{fliterTime(scope.row.dt )}}</span>
              </template>
            </el-table-column>
            </el-table>
          </div>
          <div>
            <AlbumBox v-for="(item,index) in albumIds" :key="index" :id = "item"></AlbumBox>
          </div>
           <p v-if="loading">加载中...</p>
           <p v-if="!isMore">没有更多了</p>
        </el-tab-pane>
        <el-tab-pane label="MV" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="歌手详情" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="相似歌手" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
  </div>
</transition>
</template>

<script>
import { eventBus } from '@/eventBus/eventBus.js'
import { mapMutations } from 'vuex'
import { mixin } from '@/mixin/mixin.js'
import AlbumBox from '@/components/Artist/AlbumBox.vue'
export default {
  name: 'ArtistDetail',
  props: ['id'],
  components: {
    AlbumBox
  },
  mixins: [mixin],
  data () {
    return {
      artist: {},
      hotSongs: [],
      activeName: 'first',
      musicIdList: [],
      musicIdIndex: 0,
      songlist: [],
      loading: false,
      isMore: false, // 是否还有更多
      albumIds: [],
      limit: 5,
      offset: 0, // 偏移量
      page: 0,
      isActived: false
    }
  },
  created () {
    console.log('创建了 ')
    this.getArtistInfo()
    this.getAlbumIds()
  },
  computed: {
    disabled () {
      return this.isActived || (this.loading || !this.isMore)
    }
  },
  activated () {
    console.log('恢复了')
    eventBus.$emit('backToArtistDetail')
    this.isActived = false
  },
  deactivated () {
    console.log('缓存了')
    this.isActived = true
  },
  beforeRouteLeave (to, from, next) {
    // 清除缓存
    if (to.path === '/FindMusic' || to.path === '/Collection') {
      this.clearCatch('ArtistDetail')
    }
    next()
  },
  methods: {
    ...mapMutations(['getMusicIdList', 'clearCatch']),
    // 得到歌手信息
    async getArtistInfo () {
      const { data: res } = await this.$http.get('/artists', {
        params: { id: this.id }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.artist = res.artist
      this.hotSongs = res.hotSongs
      this.musicIdList = res.hotSongs.filter(item => item.st !== -1).map(item => Number(item.id))
      this.getMusicListDetail(this.musicIdList.join(','))
    },
    // 过滤播放时间
    fliterTime (time) {
      let min = parseInt(time / 1000 / 60)
      min = min < 10 ? '0' + min : min
      let sec = parseInt((time / 1000) % 60)
      sec = sec < 10 ? '0' + sec : sec
      return `${min}:${sec}`
    },
    // 得到50首热门音乐详情
    async getMusicListDetail (ids) {
      const { data: res } = await this.$http.get('/song/detail', {
        params: { ids: ids }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.songlist = res.songs
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
    // 得到歌手专辑ID
    async getAlbumIds () {
      const { data: res } = await this.$http.get('/artist/album', {
        params: {
          id: this.id,
          limit: this.limit,
          offset: this.offset
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.albumIds = [...this.albumIds, ...res.hotAlbums.map(item => item.id)]
      this.isMore = res.more
    },
    load () {
      this.loading = true
      setTimeout(() => {
        this.page++
        this.offset = this.page * this.limit
        this.getAlbumIds()
        this.loading = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.artistDetail {
    .head {
        display: flex;
        justify-content: flex-start;
        .img {
            width: 200px;
            height: 200px;
            border-radius: 5px;
            overflow: hidden;
            margin-right: 15px;
        }
        .info {
            h2 {
                margin: 15px 0;
                padding: 0;
            }
            .font {
                font-size: 13px;
            }
            .record {
                margin-top: 15px;
                & span {
                    margin-right: 30px;
                }
            }
        }
    }
}
</style>
