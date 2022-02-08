<template>
  <div class="videoCate">
    <div class="chooeCate">
      <div>
        <el-button size="small" round @click="showChooseBox = !showChooseBox">{{videoCate}} ></el-button>
      </div>
      <div class="Cate">
        <span :style="item.id===selectedID?selectedStyle:''" class="category" v-for="item in category" :key="item.id" @click="changeCate(item.name,item.id)">{{item.name}}</span>
      </div>
      <div class="chooseBox" v-show="showChooseBox">
          <span class="all" :style="selectedID===0?selectedStyle:''" @click="changeCate('全部视频',0)">全部视频</span>
           <el-divider></el-divider>
           <div class="group">
               <span :style="item.id===selectedID?selectedStyle:''"  class="groupItem" v-for="item in group" :key = "item.id" @click="changeCate(item.name,item.id)">{{item.name}}</span>
           </div>
      </div>
    </div>
     <div class="list" ref="listRef" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-immediate=flase>
      <div class="image" v-for="item in videoList" :key="item.data.vid" @click="gotoDetail(item.data.vid)">
        <MyImage :setStyle="style" :src="item.data.coverUrl"></MyImage>
        <div :title="item.data.title" class="MVname">{{item.data.title}}</div>
        <div class="name" v-if="item.data.creator">{{item.data.creator.nickname}}</div>
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
  props: ['activeName'],
  components: {
    MyImage
  },
  data () {
    return {
      showChooseBox: false, // 是否显示分类盒子
      category: [],
      group: [],
      selectedID: 0,
      selectedStyle: {
        backgroundColor: '#fdeded'
      },
      videoList: [],
      offset: 0, // 偏移量
      isMore: false, // 是否还有更多
      loading: false,
      style: 'width:100%;height:200px;'
    }
  },
  created () {
    this.showVideo()
    this.getCateList()
    this.getGroupList()
    this.getAllVideoList()
  },
  activated () {
    // setTimeout(() => {
    eventBus.$emit('backTo')
    // }, 500)
    if (this.activeName === 'first') {
      this.showVideo()
    } else {
      this.closeVideo()
    }
  },
  deactivated () {
    console.log(22222)
    this.closeVideo()
  },
  computed: {
    ...mapState(['ifVideoActived', 'videoCate', 'ifLogin']),
    disabled () {
      return this.ifVideoActived || this.loading || !this.isMore
    }
  },
  methods: {
    ...mapMutations(['changeVideoCate', 'showVideo', 'closeVideo']),
    // 得到视频的标签
    async getGroupList () {
      const { data: res } = await this.$http.get('/video/group/list', {
        withCredentials: true
      })
      if (res.code !== 200) return this.$message.error('获取标签失败')
      this.group = res.data
    },
    // 得到视频的分类
    async getCateList () {
      const { data: res } = await this.$http.get('/video/category/list')
      if (res.code !== 200) return this.$message.error('获取分类失败')
      this.category = res.data
    },
    changeCate (name, id) {
      this.selectedID = id
      this.changeVideoCate(name)
      this.offset = 0
      this.videoList = []
      if (name === '全部视频') {
        this.getAllVideoList()
      } else {
        this.getVideoList(id)
      }
    },

    // 得到全部视频
    async getAllVideoList () {
      const { data: res } = await this.$http.get('/video/timeline/all', {
        params: { offset: this.offset }
      })
      if (res.code !== 200) return this.$message.error('获取全部视频失败')
      res.datas = res.datas.filter(item => item.type !== 7)
      console.log(res)
      this.videoList = [...this.videoList, ...res.datas]
      console.log(res.datas)
      this.isMore = res.hasmore
    },
    // 得到对应分类
    async getVideoList (id) {
      const { data: res } = await this.$http.get('/video/group', {
        params: { id }
      })
      if (res.code !== 200) return this.$message.error('获取全部视频失败')
      this.videoList = [...this.videoList, ...res.datas]
      this.isMore = res.hasmore
    },
    load () {
      this.loading = true
      setTimeout(() => {
        this.offset = this.offset + this.videoList.length
        if (this.videoCate === '全部视频') {
          this.getAllVideoList()
        } else {
          this.getVideoList(this.selectedID)
        }
        this.loading = false
      }, 2000)
    },
    // 跳转到视频详情页面
    gotoDetail (id) {
      this.$router.push(`/video/${id}`)
    }

  }
}
</script>

<style lang="scss" scoped>
.videoCate {
    position: relative;
  .chooeCate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .Cate {
      .category {
        // margin: 0 5px;
        display: inline-block;
        font-size: 13px;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        border-radius: 15px;
      }
    }
    .chooseBox {
    position: absolute;
    top: 35px;
    left: 0;
    width: 500px;
    height: 400px;
    overflow-y: auto;
    z-index: 99999;
    background-color: #fff;
    .all {
        display: inline-block;
        font-size: 13px;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        border-radius: 15px;
         cursor: pointer;
         margin-left: 25px;
         margin-top: 20px;
            &:hover {
                color: #ec4141;
            }
    }
    .group {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: space-between;
        .groupItem {
            width: 20%;
            font-size: 13px;
            margin: 5px 0;
            height: 30px;
            line-height: 30px;
            border-radius: 15px;
            text-align: center;
            cursor: pointer;
            &:hover {
                color: #ec4141;
            }
        }
    }
    }
  }
  .list {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    .image {
      width: 23%;
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
