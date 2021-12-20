<template>
  <div class="allPlayList">
    <div class="chooseCate" ref="Cate">
      <div>
        <el-button size="small" round @click="ifShowChooseBox">{{playListCate}} ></el-button>
        <el-button size="small" round @click="gotoHighQuality"> 精品歌单 ></el-button>
      </div>
      <div class="hotCate">
        <span class="tag" v-for="(item,index) in hotCatList" :key="index" @click="changeHotCate(item.name)">{{item.name}}</span>
      </div>
      <div class="chooseBox" v-show="showChooseBox">
        <div>
          <el-tag class="all" @click="changeCate('全部')">全部歌单</el-tag>
        </div>
         <el-divider></el-divider>
        <el-table :data="categories" style="width: 100%" :show-header="false">
          <el-table-column width="180">
            <template scope="scope">
              <div>
                {{scope.row.name}}
              </div>
            </template>
          </el-table-column>
           <el-table-column width="300">
            <template scope="scope">
              <div class="cate">
                 <div  v-for="(item,index) in catList" :key="index">
                   <el-tag @click="changeCate(item.name)" class="cateItem" v-if="item.category===scope.row.id">{{item.name}}
                   </el-tag>
                 </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 歌单 -->
    <div class="playList">
      <div class="box">
        <el-card :body-style="{ padding: '3px' }" v-for="(item, index) in playlists" :key="index" @click.native="goToDetial(item.id)">
          <!-- <img :src="item.coverImgUrl" alt="" class="image" /> -->
           <el-image style="width: 100%; height: 100%; min-height: 109px" lazy :src="item.coverImgUrl" ></el-image>
          <div class="textBox">
            <span>{{ item.name }}</span>
          </div>
        </el-card>
      </div>
    </div>
    <div class="pagination">
      <el-pagination :current-page.sync="currentPage" ref="pagination" @current-change="currentChange" background :page-size="limit" layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/eventBus/eventBus.js'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      catList: [], // 歌单分类
      hotCatList: [], // 热门歌单分类
      categories: [], // 风格类型
      playlists: [], // 歌单
      showChooseBox: false,
      total: 0,
      limit: 50,
      offset: 0,
      order: 'hot',
      currentPage: 1
    }
  },
  computed: {
    ...mapState(['playListCate'])
  },
  created () {
    // 得到歌单分类
    this.getPlayListCate()
    // 得到热门分类
    this.gethotCateList()
    // 得到歌单
    this.getPlayList()
  },
  activated () {
    console.log('激活了')
    eventBus.$emit('backTo')
  },
  methods: {
    ...mapMutations(['changePlayListCate', 'changeHighQuality']),
    // 得到所有歌单分类
    async getPlayListCate () {
      const { data: res } = await this.$http.get('/playlist/catlist')
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.catList = res.sub
      this.categories = Object.entries(res.categories).map(item => {
        return { id: Number(item[0]), name: item[1] }
      })
      // console.log(12345)
      // console.log(this.catList)
      // console.log(this.categories)
    },
    // 得到歌单的热门分类
    async gethotCateList () {
      const { data: res } = await this.$http.get('/playlist/hot')
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.hotCatList = res.tags
      // console.log(789)
      // console.log(this.hotCatList)
    },
    // 得到当前分类的歌单
    async getPlayList () {
      const { data: res } = await this.$http.get('/top/playlist', {
        params: {
          order: this.order,
          offset: this.offset,
          limit: this.limit,
          cat: this.playListCate
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.total = res.total
      this.playlists = res.playlists
    },
    // 跳转到歌单详情页面
    goToDetial (id) {
      this.$router.push(`/playList/${id}`)
    },
    // 改变页数
    currentChange (page) {
      this.offset = (page - 1) * this.limit
      this.getPlayList()
      //   this.$refs.Cate.$el.scrollTop = 0
      eventBus.$emit('changeSearchPage')
    },
    // 是否打开盒子
    ifShowChooseBox () {
      this.showChooseBox = !this.showChooseBox
    },
    // 改变标签
    changeCate (cate) {
      this.currentPage = 1
      this.offset = 0
      this.changePlayListCate(cate)
      this.getPlayList()
      this.ifShowChooseBox()
    },
    // 改变热门标签
    changeHotCate (cate) {
      this.currentPage = 1
      this.offset = 0
      this.changePlayListCate(cate)
      this.getPlayList()
      this.showChooseBox = this.showChooseBox ? !this.showChooseBox : this.showChooseBox
    },
    // 跳转到热门歌单封面
    gotoHighQuality () {
      // this.$router.push('/highQuality')
      this.changeHighQuality()
    }
  }
}
</script>

<style lang="scss" scoped >
.allPlayList {
  .chooseCate {
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .hotCate {
      .tag {
        margin: 0 5px;
        cursor: pointer;
      }
    }
    .all {
      cursor: pointer;
    }
    .chooseBox {
      // width: 50%;
      height: 300px;
      background-color: #fff;
      position: absolute;
      top: 35px;
      left: 0;
      z-index: 9999;
      .cate {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        .cateItem {
          margin:3px 3px;
          cursor: pointer;
        }
      }
    }
  }
  .playList {
    .box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-top: 20px;
      .el-card {
        width: 18%;
        cursor: pointer;
        .textBox {
          height: 40px;
          // overflow: hidden;
          // white-space: nowrap;
          //  text-overflow: ellipsis;
          //  -o-text-overflow:ellipsis;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }
}
</style>
