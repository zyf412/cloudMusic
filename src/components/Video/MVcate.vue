<template>
  <div class="artist">
    <div class="cate">
      <div class="area">
        <div>语种:</div>
        <ul>
          <li v-for="(item, index) in area" :style="areaID===item?selectedStyle:''" :key="index" @click="changeArea(item)">{{item}}</li>
        </ul>
      </div>
      <div class="type">
        <div>分类:</div>
        <ul>
          <li :style="typeID===item?selectedStyle:''" v-for="(item, index) in type" :key="index" @click="changeType(item)">{{item}}</li>
        </ul>
      </div>
      <div class="word">
        <div>筛选:</div>
        <ul>
          <li :style="orderID===item?selectedStyle:''" v-for="(item, index) in order" :key="index" @click="changeOrder(item)">{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="list" ref="listRef" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-immediate=flase>
      <div class="image" v-for="(item, index) in MVlist" :key="index" @click="gotoDetail(item.id)">
        <MyImage :setStyle="style" :src="item.cover"></MyImage>
        <div :title="item.name" class="MVname">{{item.name}}</div>
        <div class="name">{{item.artistName}}</div>
      </div>
    </div>
    <p v-if="loading">加载中...</p>
    <p v-if="!isMore">没有更多了</p>

  </div>
</template>

<script>
import MyImage from '@/components/MyComponents/MyImage.vue'
import { eventBus } from '@/eventBus/eventBus.js'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    MyImage
  },
  props: ['activeName'],
  data () {
    return {
      type: ['全部', '官方版', '原声', '现场版', '网易出品'],
      area: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      order: ['上升最快', '最热', '最新'],
      areaID: '全部',
      typeID: '全部',
      orderID: '上升最快',
      limit: 30, // 每页数量
      offset: 0, // 偏移量
      isMore: false, // 是否还有更多
      loading: false,
      MVlist: [],
      page: 0,
      selectedStyle: {
        backgroundColor: '#fdeded'
      },
      style: 'width:100%;height:150px;'
    }
  },
  computed: {
    ...mapState(['ifMVActived']),
    disabled () {
      return this.ifMVActived || this.loading || !this.isMore
    }
  },
  created () {
    this.showMV()
    this.getMVlist()
  },
  activated () {
    // setTimeout(() => {
    eventBus.$emit('backTo')
    // }, 500)
    if (this.activeName === 'second') {
      this.showMV()
    }
  },
  deactivated () {
    // console.log('缓存了')
    this.closeMV()
  },
  methods: {
    ...mapMutations(['showMV', 'closeMV']),
    async getMVlist () {
      const { data: res } = await this.$http.get('/mv/all', {
        params: {
          area: this.areaID,
          type: this.typeID,
          order: this.orderID,
          offset: this.offset,
          limit: this.limit
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.MVlist = [...this.MVlist, ...res.data]
      this.isMore = res.hasMore
    },
    load () {
      this.loading = true
      setTimeout(() => {
        this.page++
        this.offset = this.page * this.limit
        this.getMVlist()
        this.loading = false
      }, 2000)
    },
    // 改变地区
    changeArea (areaID) {
      this.page = 0
      this.offset = 0
      this.areaID = areaID
      this.MVlist = []
      this.getMVlist()
    },
    // 改变类型
    changeType (typeID) {
      this.page = 0
      this.offset = 0
      this.typeID = typeID
      this.MVlist = []
      this.getMVlist()
    },
    // 改变排序
    changeOrder (orderID) {
      this.page = 0
      this.offset = 0
      this.orderID = orderID
      console.log(orderID)
      this.MVlist = []
      this.getMVlist()
    },
    // 跳转到歌手详情页面
    gotoDetail (id) {
      this.$router.push(`/mv/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  li {
    list-style: none;
  }
}
.artist {
  width: 100%;
  // height: 100%;
  // overflow-y: auto;
  .cate {
    font-size: 13px;
    .area,
    .type,
    .word {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 10px;
      div {
        white-space: nowrap;
        line-height: 25px;
      }
      ul li {
        float: left;
        width: 80px;
        text-align: center;
        line-height: 25px;
        height: 25px;
        border-radius: 25px;
        margin: 0 15px;
        cursor: pointer;
        &:hover {
          color: #d1515f;
        }
      }
    }
  }
  .list {
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
  p {
    text-align: center;
  }
}
</style>
