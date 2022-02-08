<template>
  <div class="subVideo">
    <div class="list" ref="listRef" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-immediate=flase>
      <div class="mvbox" :body-style="{ padding: '3px' }" v-for="item in videoList" :key="item.vid" @click="goToVideoDetial(item.vid,item.type)">
        <MyImage :src="item.coverUrl" :setStyle="'width: 100%; height: 200px;'"></MyImage>
        <div class="textBox">
          <div class="title">{{ item.title }}</div>
          <span class="username" v-for="artist in item.creator" :key="artist.userId">{{artist.userName}} </span>
        </div>
      </div>
    </div>
    <p v-if="loading">加载中...</p>
    <p v-if="!isMore">没有更多了</p>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { eventBus } from '@/eventBus/eventBus.js'
import MyImage from '@/components/MyComponents/MyImage.vue'
export default {
  props: ['activeName'],
  components: {
    MyImage
  },
  data () {
    return {
      videoList: [],
      limit: 12,
      offset: 0,
      isMore: false, // 是否还有更多
      loading: false
    }
  },
  created () {
    if (this.uid) this.getVideoList()
  },
  computed: {
    ...mapState(['uid', 'ifSubVideoActived']),
    disabled () {
      return this.ifSubVideoActived || this.loading || !this.isMore
    }
  },
  activated () {
    eventBus.$emit('backTo')
    if (this.activeName === 'third') {
      this.showSubVideo()
    } else {
      this.closeSubVideo()
    }
  },
  deactivated () {
    this.closeSubVideo()
  },
  methods: {
    ...mapMutations(['showSubVideo', 'closeSubVideo']),
    async getVideoList () {
      const { data: res } = await this.$http.get('/mv/sublist', {
        params: {
          offset: this.offset,
          limit: this.limit
        }
      })
      if (res.code !== 200) return this.$message.error('获取列表失败')
      this.videoList = [...this.videoList, ...res.data]
      this.isMore = res.hasMore
    },
    goToVideoDetial (id, type) {
      if (type === 0) {
        this.$router.push(`/mv/${id}`)
      } else if (type === 1) {
        this.$router.push(`/video/${id}`)
      }
    },
    load () {
      this.loading = true
      setTimeout(() => {
        this.offset = this.offset + this.videoList.length
        this.getVideoList()
        this.loading = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
    .subVideo {
        .list{
            display: flex;
            flex-wrap: wrap;

        .mvbox {
        width: 23%;
        margin-right: 15px;
        align-content: space-between;
        margin-bottom: 20px;
        cursor: pointer;
        .textBox {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
            .title {

                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .username {
                font-size: 13px;
                color: #ccc;
            }

        }
      }
        }
    }
</style>
