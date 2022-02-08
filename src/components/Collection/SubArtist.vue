<template>
  <div class="subArtist">
    <el-table :data="artistList" :show-header=false stripe style="width: 100%" @row-click="gotoDetail">
      <el-table-column width="600">
        <template slot-scope="scope">
          <div class="img">
              <el-avatar  :size="50" shape="square" :src="scope.row.picUrl"></el-avatar>
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="300">
          <template slot-scope="scope">
           <span style="margin-left: 10px">专辑数: {{ scope.row.albumSize }}</span>
        </template>
      </el-table-column>
      <el-table-column >
        <template slot-scope="scope">
          <span style="margin-left: 10px">MV数: {{ scope.row.mvSize }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination :current-page.sync="currentPage" ref="pagination" @current-change="currentChange" background :page-size="limit" layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      artistList: [],
      total: 0,
      limit: 6,
      offset: 0,
      currentPage: 1
    }
  },
  computed: {
    ...mapState(['uid'])
  },
  created () {
    if (this.uid) this.getArtistList()
  },
  methods: {
    async getArtistList () {
      const { data: res } = await this.$http.get('/artist/sublist', {
        params: {
          offset: this.offset,
          limit: this.limit
        }
      })
      if (res.code !== 200) return this.$message.error('获取列表失败')
      this.artistList = res.data
      this.total = res.hasMore ? res.count : this.total
    },
    // 改变页数
    currentChange (page) {
      this.offset = (page - 1) * this.limit
      this.getArtistList()
    },
    gotoDetail (row) {
      this.$router.push(`/artistDetail/${row.id}`)
    }
  }
}
</script>

<style lang="scss" scope>
    .subArtist {
        .img {
            display: flex;
            align-items: center;
            cursor: pointer;
        }
    }
</style>
