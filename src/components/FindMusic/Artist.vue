<template>
  <div class="artist">
    <div class="cate">
      <div class="area">
        <div>语种:</div>
        <ul>
          <li v-for="(item, index) in area" :style="areaIndex===index?selectedStyle:''" :key="index" @click="changeArea(item[0],index)">{{item[1]}}</li>
        </ul>
      </div>
      <div class="type">
        <div>分类:</div>
        <ul>
          <li :style="typeIndex===index?selectedStyle:''" v-for="(item, index) in type" :key="index" @click="changeType(item[0],index)">{{item[1]}}</li>
        </ul>
      </div>
      <div class="word">
        <div>筛选:</div>
        <ul>
          <li :style="wordIndex===-1?selectedStyle:''" class="s" @click="changeInitial(-1,-1)">热门</li>
          <li :style="wordIndex===item?selectedStyle:''" v-for="(item, index) in word" :key="index" @click="changeInitial(item,item)">{{item}}</li>
          <li :style="wordIndex===0?selectedStyle:''" @click="changeInitial(0,0)">#</li>
        </ul>
      </div>
    </div>
    <div class="list" ref="listRef" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-immediate=flase>
      <div class="image" v-for="(item) in artists" :key="item.id" @click="gotoDetail(item.id)">
        <MyImage :setStyle="''" :src="item.img1v1Url"></MyImage>
        <div class="name">{{item.name}}</div>
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
      type: [
        [-1, '全部'],
        [1, '男歌手'],
        [2, '女歌手'],
        [3, '乐队组合']
      ],
      area: [
        [-1, '全部'],
        [7, '华语'],
        [96, '欧美'],
        [8, '日本'],
        [16, '韩国'],
        [0, '其他']
      ],
      limit: 30, // 每页数量
      offset: 0, // 偏移量
      isMore: false, // 是否还有更多
      loading: false,
      // isActived: false,
      word: [], // 首字母
      artists: [],
      page: 0,
      areaID: -1,
      typeID: -1,
      initial: -1, // 筛选  热门为-1， #号为0 其他传递字母
      areaIndex: 0,
      typeIndex: 0,
      wordIndex: -1,
      selectedStyle: {
        backgroundColor: '#fdeded'
      }
    }
  },
  computed: {
    ...mapState(['ifArtistActived']),
    disabled () {
      return this.ifArtistActived || (this.loading || !this.isMore)
    }
  },
  created () {
    for (let i = 65; i < 91; i++) {
      this.word.push(String.fromCharCode(i))
    }
    this.showArtist()
    this.getArtists()
  },
  activated () {
    // 返回到歌手页面，有个0.5s的过渡动画
    setTimeout(() => {
      eventBus.$emit('backTo')
    }, 500)
    if (this.activeName === 'fifth') {
      this.showArtist()
    }
  },
  deactivated () {
    console.log('缓存了')
    this.closeArtist()
  },
  methods: {
    ...mapMutations(['showArtist', 'closeArtist']),
    async getArtists () {
      const { data: res } = await this.$http.get('/artist/list', {
        params: {
          area: this.areaID,
          type: this.typeID,
          initial: this.initial,
          offset: this.offset,
          limit: this.limit
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.artists = [...this.artists, ...res.artists]
      this.isMore = res.more
    },
    load () {
      this.loading = true
      setTimeout(() => {
        this.page++
        this.offset = this.page * this.limit
        this.getArtists()
        this.loading = false
      }, 2000)
    },
    // 改变语种
    changeArea (areaID, index) {
      this.page = 0
      this.offset = 0
      this.areaID = areaID
      this.artists = []
      this.areaIndex = index
      this.getArtists()
    },
    // 改变分类
    changeType (typeID, index) {
      this.page = 0
      this.offset = 0
      this.typeID = typeID
      this.artists = []
      this.typeIndex = index
      this.getArtists()
    },
    // 改变筛选
    changeInitial (initial, index) {
      this.page = 0
      this.offset = 0
      this.initial = initial
      this.artists = []
      this.wordIndex = index
      this.getArtists()
    },
    // 跳转到歌手详情页面
    gotoDetail (id) {
      this.$router.push(`/artistDetail/${id}`)
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
      .name {
        margin-top: 8px;
        height: 40px;
      }
    }
  }
  p {
    text-align: center;
  }
}
</style>
