<template>
  <div v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-immediate=flase>
    <div class="artistMV">
      <div class="image" v-for="item in MVlist" :key="item.id" @click="gotoDetail(item.id)">
        <MyImage :src="item.imgurl"></MyImage>
        <div :title="item.name" class="MVname">{{item.name}}</div>
      </div>
    </div>
    <p v-if="loading">加载中...</p>
    <p v-if="!isMore">没有更多了</p>
  </div>
</template>

<script>
import MyImage from '@/components/MyComponents/MyImage.vue'
export default {
  props: ['id', 'activeName'],
  components: {
    MyImage
  },
  data () {
    return {
      MVlist: [],
      //   style: 'width:100%;height:150px;'
      limit: 10,
      offset: 0, // 偏移量
      page: 0,
      isActived: false,
      isMore: false, // 是否还有更多
      loading: false
    }
  },
  created () {
    this.getMVlist(this.id)
  },
  computed: {
    disabled () {
      return this.isActived || this.loading || !this.isMore
    }
  },
  watch: {
    activeName: {
      handler (newVal) {
        if (newVal === 'second') {
          this.isActived = false
        } else {
          this.isActived = true
        }
      }
    }
    // id: {
    //   handler (newId) {
    //     this.getMVlist(newId)
    //   }
    // }
  },
  methods: {
    async getMVlist (id) {
      const { data: res } = await this.$http.get('/artist/mv', {
        params: {
          id,
          limit: this.limit,
          offset: this.offset
        }
      })
      if (res.code !== 200) return this.$message.error('获取mv列表失败')
      this.MVlist = [...this.MVlist, ...res.mvs]
      this.isMore = res.hasMore
    },
    // 跳转到歌手详情页面
    gotoDetail (id) {
      this.$router.push(`/mv/${id}`)
    },
    load () {
      this.loading = true
      setTimeout(() => {
        this.page++
        this.offset = this.page * this.limit
        this.getMVlist(this.id)
        this.loading = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.artistMV {
  display: flex;
  flex-wrap: wrap;
  .image {
    width: 17%;
    margin-right: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    .MVname {
      font-size: 14px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .name {
      font-size: 13px;
      color: #ccc;
    }
  }
}
</style>
