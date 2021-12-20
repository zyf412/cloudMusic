<template>
  <div class="highQuality">
    <!-- 头部 -->
    <div class="head">
      <h4>精品歌单</h4>
      <el-button size="small" round @click="back">返回歌单分类</el-button>
      <el-button size="small" round @click="ifShowCateBox">{{cat}}</el-button>
      <div class="selectType" v-show="ifShow">
        <span class="all" @click="all">全部歌单</span>
        <el-divider></el-divider>
        <ul>
          <li v-for="(item,index) in highQualityCate" :key="index" @click="changeCate(item.name)">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <!-- 歌单列表 -->
    <div class="playList" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-immediate=flase>
      <!-- 歌单盒子 -->
      <div class="playListBox" v-for="(item,index) in highPlaylist" :key="index" @click="goToDetial(item.id)">
        <div class="image">
          <el-image style="width: 150px; height: 150px" lazy :src="item.coverImgUrl" ></el-image>
        </div>
        <div class="describe">
          <div class="name" :title="item.name">{{item.name}}</div>
          <div class="creator">by {{item.creator.nickname}}</div>
          <div class="type">
            <span class="tag">{{item.tag}}</span>
            <span class="copywriter" :title="item.copywriter">{{item.copywriter}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-show="loading" class="loading"><i class="el-icon-loading"></i>加载中</div>
    <div v-if="!more" class="nomore">没有更多数据了</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      highQualityCate: [], // 精品歌单的分类
      highPlaylist: [], // 精品歌单列表
      cat: '全部',
      before: 0,
      limit: 30,
      more: false,
      ifShow: false,
      loading: false
    }
  },
  created () {
    this.getHighQualityCate()
    this.getHighPlaylist()
  },
  computed: {
    disabled () {
      return this.loading || !this.more
    }
  },
  methods: {
    ...mapMutations(['changeHighQuality']),
    // 得到精品歌单的分类标签
    async getHighQualityCate () {
      const { data: res } = await this.$http.get('/playlist/highquality/tags')
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.highQualityCate = res.tags
    },
    // 得到精品歌单
    async getHighPlaylist () {
      const { data: res } = await this.$http.get('/top/playlist/highquality', {
        params: {
          cat: this.cat,
          before: this.before,
          limit: this.limit
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.more = res.more
      this.highPlaylist = [...this.highPlaylist, ...res.playlists]
      this.before = res.playlists[res.playlists.length - 1].updateTime
      console.log(this.before)
      console.log(this.more)
      console.log(this.highPlaylist)
    },
    // 跳转到歌单详情页面
    goToDetial (id) {
      // console.log(id)
      this.$router.push(`/playList/${id}`)
    },
    // 返回歌单
    back () {
      this.changeHighQuality()
    },
    // 显示歌单分类盒子
    ifShowCateBox () {
      this.ifShow = !this.ifShow
    },
    all () {
      this.cat = '全部'
      this.before = 0
      this.getHighPlaylist()
      this.ifShowCateBox()
    },
    // 改变歌单标签
    changeCate (cate) {
      this.cat = cate
      this.before = 0
      this.highPlaylist = []
      this.getHighPlaylist()
      this.ifShowCateBox()
    },
    // 加载更多数据
    load () {
      this.loading = this.more
      if (this.more) {
        setTimeout(() => {
          this.getHighPlaylist()
          this.loading = false
        }, 2000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.highQuality {
  .head {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    h4 {
      margin-right: 7px;
    }
    .selectType {
      position: absolute;
      left: 0;
      top: 50px;
      background-color: #fff;
      width: 50%;
      z-index: 99999;
      .all {
          font-size: 13px;
          cursor: pointer;
          margin-left: 20px;
          margin-top: 5px;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin: 0;
        padding: 0;
        li {
          width: 20%;
          list-style: none;
          text-align: center;
          margin-bottom: 15px;
          font-size: 13px;
          cursor: pointer;
          &:hover {
            color: #ee416a;
          }
        }
      }
    }
  }
  .playList {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .playListBox {
      display: flex;
      width: 30%;
      margin-bottom: 8px;
      cursor: pointer;
      margin-right: 10px;
      .image {
        width: 150px;
        height: 150px;
        border-radius: 5px;
        overflow: hidden;
      }
      .describe {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 5px;
        .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        }
        .creator {
          font-size: 13px;
          color: #ccc;
          margin: 15px 0;
        }
        .type {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .tag {
          font-size: 8px;
          color: #ec4141;
          border: 1px solid #ec4141;
          margin-right: 5px;
        }
        .copywriter {
          font-size: 10px;
          color: #ccc;
        }
        }
      }
    }
  }
  .loading {
    text-align: center;
  }
  .nomore {
    text-align: center;
  }
}
</style>
