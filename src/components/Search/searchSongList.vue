<template>
  <div class="searchSongList">
    <div class="best" v-if="offset === 0">
      <span>最佳匹配</span>
      <div class="bestSinger"></div>
    </div>
    <el-table :data="songs" style="width: 100%" @row-dblclick="rowDbClick">
      <el-table-column type="index"> </el-table-column>
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
          <span v-for="(item, index) in scope.row.artists" :key="index" style="margin-left: 10px">{{ item.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="album.name" label="专辑"> </el-table-column>
      <el-table-column prop="dt" label="时长">
        <template slot-scope="scope">
          <span>{{ fliterTime(scope.row.duration) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="currentChange" background :page-size="limit" layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/eventBus/eventBus.js'
import { mapMutations, mapState } from 'vuex'
export default {
  props: ['keyword'],
  data () {
    return {
      songs: [],
      limit: 100,
      offset: 0,
      total: 0
    }
  },
  created () {
    this.getSongs()
  },
  watch: {
    keyword: {
      handler () {
        this.getSongs()
      }
    }
  },
  computed: {
    ...mapState(['likelist', 'uid'])
  },
  methods: {
    ...mapMutations(['addMusic', 'getMusicIdList', 'addLikeList', 'disLike']),
    // 得到搜索到的歌曲列表
    async getSongs () {
      const { data: res } = await this.$http.get('/search', {
        params: {
          keywords: this.keyword,
          limit: this.limit,
          offset: this.offset
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      // console.log(res)
      this.songs = res.result.songs
      this.total = res.result.songCount
      // console.log(this.songs)
    },
    // 过滤时间
    fliterTime (time) {
      let min = parseInt(time / 1000 / 60)
      min = min < 10 ? '0' + min : min
      let sec = parseInt((time / 1000) % 60)
      sec = sec < 10 ? '0' + sec : sec
      return `${min}:${sec}`
    },
    // 双击播放歌曲 //因为这里的row中得到的信息数据结构和vuex中的allSongInfo不一样
    // 避免麻烦，所以再次用id请求得到音乐的详情信息
    async rowDbClick (row) {
      const { data: res } = await this.$http.get('/song/detail', {
        params: { ids: row.id }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      // console.log(res)
      this.addMusic(res.songs[0])
    },
    // 改变页数
    currentChange (page) {
      this.offset = (page - 1) * this.limit
      this.getSongs()
      eventBus.$emit('changeSearchPage')
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
    }
  }
}
</script>

<style  lang="scss" scope>
.pagination {
  display: flex;
  justify-content: center;
}
</style>
