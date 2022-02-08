<template>
  <div class="subscribeContainer">
    <div class="subscribe" v-for="(item) in subscribers" :key="item.id">
      <div><el-avatar :size="90" :src="item.avatarUrl"></el-avatar></div>
      <div class="info">
        <span>{{item.nickname}}</span>
        <span class="signature" v-if="item.signature">{{item.signature}}</span>
      </div>
    </div>
    <div class="pagination">
      <el-pagination @current-change="currentChange" background :page-size="limit" layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/eventBus/eventBus.js'
export default {
  props: ['id'],
  data () {
    return {
      subscribers: [],
      limit: 30,
      offset: 0,
      total: 0
    }
  },
  created () {
    this.getPlayListSubscribe()
  },
  methods: {
    async getPlayListSubscribe () {
      const { data: res } = await this.$http.get('/playlist/subscribers', {
        params: {
          id: this.id,
          limit: this.limit,
          offset: this.offset
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      //   console.log(res)
      this.subscribers = res.subscribers
      this.total = res.total
    },
    // 改变页数
    currentChange (page) {
      this.offset = (page - 1) * this.limit
      this.getPlayListSubscribe()
      eventBus.$emit('changePage')
    }
  }
}
</script>

<style lang="scss" scoped>
.subscribeContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  .subscribe {
      width: 33%;
      display: flex;
      justify-content:flex-start;
      align-items: center;
      margin-top: 5px;
    .info {
        margin-left: 8px;
        flex: 3;
        display: flex;
        flex-direction: column;
        .signature {
            font-size: 12px;
            margin-top: 5px;
        }
    }
  }
  .pagination {
      margin-top: 15px;
      width: 100%;
      display: flex;
      justify-content: center;
  }
}
</style>
