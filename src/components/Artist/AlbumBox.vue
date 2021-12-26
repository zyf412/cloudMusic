<template>
  <div class="albumBox">
    <div class="imagebox">
      <div class="image" @click="gotoDetail">
        <el-image style="width: 150px; height: 150px" lazy :src="ablum.blurPicUrl"></el-image>
      </div>
      <div class="publishTime">{{publishTime}}</div>
    </div>
    <div class="songList">
      <h4 class="name">{{ablum.name}}</h4>
      <div class="songs">
        <el-table :data="songs" style="width: 100%" @row-dblclick="rowDbClick">
          <el-table-column type="index">
          </el-table-column>
          <el-table-column prop="name" label="音乐标题" width="500">
          </el-table-column>
          <el-table-column prop="dt" label="时长">
            <template slot-scope="scope">
              <span>{{fliterTime(scope.row.dt )}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin } from '@/mixin/mixin.js'
import { mapMutations } from 'vuex'
export default {
  props: ['id'],
  mixins: [mixin],
  data () {
    return {
      ablum: {},
      songs: [],
      musicIdList: [],
      musicIdIndex: 0,
      songlist: []
    }
  },
  created () {
    this.getAlbumInfo()
  },
  computed: {
    publishTime () {
      const time = new Date(this.ablum.publishTime)
      const year = time.getFullYear()
      const month = time.getMonth() + 1
      const date = time.getDate()
      return `${year}-${month}-${date}`
    }
  },
  methods: {
    ...mapMutations(['getMusicIdList']),
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
    // 得到音乐信息
    async getMusicListDetail (ids) {
      const { data: res } = await this.$http.get('/song/detail', {
        params: { ids: ids }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.songlist = res.songs
      // console.log(444444)
      // console.log(this.songlist)
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
    // 查看专辑详情
    gotoDetail () {
      this.$router.push(`/albumDetail/${this.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
    .albumBox {
        display: flex;
        margin-top: 100px;
        .imagebox{
            margin-right: 100px;
            .image{
               cursor: pointer;
                border-radius: 5px;
                overflow: hidden;
                width: 150px;
                height: 150px;
            }
            .publishTime{
                font-size: 13px;
                color: #676767;
            }
        }
        .songList{
            h4 {
                margin: 0;
                padding: 0;
            }
            .el-table {
                font-size: 13px;
                // color: #ccc;

            }
        }
    }
</style>
