<template>
  <div class="artist">
    <div class="cate">
      <div class="area">
        <div>语种:</div>
        <ul>
          <li v-for="(item, index) in area" :key="index" @click="changeArea(item[0])">{{item[1]}}</li>
        </ul>
      </div>
      <div class="type">
        <div>分类:</div>
        <ul>
          <li v-for="(item, index) in type" :key="index" @click="changeType(item[0])">{{item[1]}}</li>
        </ul>
      </div>
      <div class="word">
        <div>筛选:</div>
        <ul>
          <li class="s" @click="changeInitial(-1)">热门</li>
          <li v-for="(item, index) in word" :key="index" @click="changeInitial(item)">{{item}}</li>
          <li  @click="changeInitial(0)">#</li>
        </ul>
      </div>
    </div>
    <div class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-immediate=flase>
      <div class="image" v-for="(item, index) in artists" :key="index">
        <el-image  style="width: 180px; height: 150px" :src="item.picUrl"  lazy></el-image>
        <div class="name">{{item.name}}</div>
      </div>
    </div>
    <p v-if="loading">加载中...</p>
    <p v-if="!isMore">没有更多了</p>

  </div>
</template>

<script>
export default {
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
      word: [], // 首字母
      artists: [],
      loading: false,
      page: 0,
      areaID: -1,
      typeID: -1,
      initial: -1 // 筛选  热门为-1， #号为0 其他传递字母
    }
  },
  computed: {
    disabled () {
      return this.loading || !this.isMore
    }
  },
  created () {
    for (let i = 65; i < 91; i++) {
      this.word.push(String.fromCharCode(i))
    }
    this.getArtists()
  },
  methods: {
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
    changeArea (areaID) {
      this.page = 0
      this.offset = 0
      this.areaID = areaID
      this.artists = []
      this.getArtists()
    },
    // 改变分类
    changeType (typeID) {
      this.page = 0
      this.offset = 0
      this.typeID = typeID
      this.artists = []
      this.getArtists()
    },
    // 改变筛选
    changeInitial (initial) {
      this.page = 0
      this.offset = 0
      this.initial = initial
      this.artists = []
      this.getArtists()
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
        width: 100px;
        text-align: center;
        line-height: 25px;
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
