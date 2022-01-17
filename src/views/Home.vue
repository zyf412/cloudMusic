<template>
  <div class="home">
    <el-container class="sectionHeight">
      <el-header>
        <!-- 顶部header  -->
        <div class="header">
          <div class="headerLeft">
          </div>
          <div class="headerCenter">
            <div class="back">
              <el-button @click="back" title="后退" type="danger" circle icon="el-icon-arrow-left" size="mini"></el-button>
            </div>
            <div class="go">
              <el-button @click="go" title="前进" type="danger" circle icon="el-icon-arrow-right" size="mini"></el-button>
            </div>
            <el-input ref="inputRef" placeholder="请输入内容" v-model="keyword" @blur="blur" debounce = 1000  @focus="focus" @keyup.enter.native="search">
              <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
            </el-input>
          </div>
          <div class="headerRight">
            <el-avatar size="medium"></el-avatar>
            <div class="username">username</div>
          </div>
        </div>
        <!-- 搜索盒子 -->
        <div class="searchBox" ref="hotListRef">
          <div class="hot">
            <div class="history">
              搜索历史
            </div>
            <div class="hotList">
              <h4>热搜榜</h4>
                <el-table :show-header="false" :data="hotList" highlight-current-row style="width: 100%" @row-click="hotClick">
                  <el-table-column type="index" width="50">
                  </el-table-column>
                  <el-table-column property="date" >
                    <template  slot-scope="scope">
                      <div>
                        <div class="songInfo">
                          <span >{{scope.row.searchWord}} </span>
                          <span >{{scope.row.score}}</span>
                        </div>
                        <div class="songcontent">{{scope.row.content}}</div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
            </div>
          </div>
        </div>
        <!-- 搜索建议盒子 -->
        <div class="searchSuggestBox" ref="searchSuggestRef" v-show="showKeyword">
          <div class="searchTitle">搜"{{showKeyword}}"相关的结果></div>
          <div class="searchSuggest">
            <ul>
              <li v-for="(item,index) in searchSuggest.order" :key="index">
                <div class="title" v-if="item==='songs'">单曲</div>
                <div class="title" v-if="item==='artists'">歌手</div>
                <div class="title" v-if="item==='albums'">专辑</div>
                <div class="title" v-if="item==='playlists'">歌单</div>
                <div v-for="(item2,index2) in searchSuggest[item] " :key="index2" class="suggestContet">
                  <div @click="clickSuggest(item,item2)">
                    {{item2.name}}<div style="display: inline-block" v-if="item2.artists"> - <span v-for="(songer,index3) in item2.artists" :key="index3">{{songer.name}}</span></div>
                     <span v-if="item2.artist"> - {{item2.artist.name}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-header>
      <el-container>
        <!-- 侧边菜单导航 -->
        <el-aside width="200px">
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router>
            <el-menu-item index="/FindMusic">
              <template slot="title">
                <span>发现音乐</span>
              </template>
            </el-menu-item>

            <el-menu-item index="2">
              <span slot="title">播客</span>
            </el-menu-item>

            <el-menu-item index="3">
              <span slot="title">视频</span>
            </el-menu-item>

            <el-menu-item index="4">
              <span slot="title">朋友</span>
            </el-menu-item>

            <el-menu-item index="5">
              <span slot="title">直播</span>
            </el-menu-item>

            <el-menu-item index="6">
              <span slot="title">私人FM</span>
            </el-menu-item>

            <el-menu-item-group>
              <template slot="title">我的音乐</template>

              <el-menu-item index="7">
                <i class="el-icon-location"></i>
                <span slot="title">本地与下载</span>
              </el-menu-item>

              <el-menu-item index="8">
                <i class="el-icon-location"></i>
                <span slot="title">最近播放</span>
              </el-menu-item>

              <el-menu-item index="9">
                <i class="el-icon-location"></i>
                <span slot="title">我的音乐云盘</span>
              </el-menu-item>

              <el-menu-item index="10">
                <i class="el-icon-location"></i>
                <span slot="title">我的播客</span>
              </el-menu-item>

              <el-menu-item index="11">
                <i class="el-icon-location"></i>
                <span slot="title">我的收藏</span>
              </el-menu-item>

            </el-menu-item-group>

            <el-submenu index="12">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>创建的歌单</span>
              </template>

              <el-menu-item-group>
                <el-menu-item index="12-1">选项1</el-menu-item>
                <el-menu-item index="12-2">选项2</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="13">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>收藏的歌单</span>
              </template>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主要内容 -->
        <el-container>
          <el-main class="bodyMain" ref="main">
            <keep-alive :include="mainKeepAliveArr">
             <router-view ></router-view>
            </keep-alive>
          </el-main>
        </el-container>
        <!-- 底部播放器 -->
      </el-container>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { eventBus } from '@/eventBus/eventBus.js'
import { mapState, mapMutations } from 'vuex'
import Footer from '@/components/Footer.vue'
export default {
  name: 'Home',
  components: {
    Footer
  },
  data () {
    return {
      isCollapse: false,
      // navState: ''
      keyword: '',
      showKeyword: '',
      hotList: [],
      timer: null, // 计时器防抖
      searchSuggest: {} // 搜索建议的列表
    }
  },
  computed: {
    ...mapState(['playListCateScrollTop', 'artistDetailScrollTop', 'mainKeepAliveArr'])
  },
  created () {
    // 通过事件总线，监听换页，移动滚动条
    // 歌单页面
    eventBus.$on('changePage', () => {
      this.$refs.main.$el.scrollTop = 200
    })
    // 通过事件总线，监听换页，移动滚动条
    // 搜索页面 直接回到顶部
    eventBus.$on('changeSearchPage', () => {
      this.$refs.main.$el.scrollTop = 0
    })
    // 得到之前滚动条的位置，添加到vuex中去
    eventBus.$on('backAllPlayList', () => {
      this.getScrollTop(this.$refs.main.$el.scrollTop)
    })
    // 当返回之前的页面，还原之前滚动条的位置
    eventBus.$on('backTo', () => {
      this.$refs.main.$el.scrollTop = this.playListCateScrollTop
    })
    // 得到之前滚动条的位置，添加到vuex中去
    eventBus.$on('backArtistDetail', () => {
      this.getArtistDetailScrollTop(this.$refs.main.$el.scrollTop)
    })
    // 当返回之前的页面，还原之前滚动条的位置
    eventBus.$on('backToArtistDetail', () => {
      this.$refs.main.$el.scrollTop = this.artistDetailScrollTop
    })
  },
  watch: {
    keyword: {
      handler (newVal) {
        if (newVal.trim()) {
          if (this.timer) clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.showKeyword = newVal
            this.getSearchSuggest()
          }, 600)
        } else {
          clearTimeout(this.timer)
          this.$refs.hotListRef.style.display = 'block'
          this.showKeyword = ''
        }
      }
    }
  },
  methods: {
    ...mapMutations(['getScrollTop', 'getArtistDetailScrollTop']),
    back () {
      this.$router.back()
    },
    go () {
      this.$router.forward()
    },
    search () {
      clearTimeout(this.timer)
      this.getSearchSuggest()
      this.$router.push(`/search/${this.keyword}`)
      this.showKeyword = '' // 我们没有等到setTimeout就快速按下了enter，将这个设置为空，保证不会显示出建议列表
      this.$refs.inputRef.blur() // 需要做失去焦点
    },
    // 获得热搜榜
    async getHotList () {
      const { data: res } = await this.$http.get('/search/hot/detail')
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.hotList = res.data
    },
    // 得到焦点
    focus () {
      if (!this.keyword) {
        this.getHotList()
        this.$refs.hotListRef.style.display = 'block'
      } else {
        this.showKeyword = this.keyword // 快速按下enter那里，showKeyword设置为空，或的焦点需要恢复
        this.$refs.searchSuggestRef.style.display = 'block'
      }
    },
    // 失去焦点
    blur () {
      // 后面点击hotList行获取数据，如果立刻隐藏，那么无法点击事件，所以需要延迟以下
      setTimeout(() => {
        this.$refs.hotListRef.style.display = 'none'
        this.$refs.searchSuggestRef.style.display = 'none'
      }, 300)
    },
    async getSearchSuggest () {
      const { data: res } = await this.$http.get('/search/suggest', { params: { keywords: this.keyword } })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.searchSuggest = res.result
    },
    // 点击热搜榜
    hotClick (row) {
      // console.log(row.searchWord)
      this.keyword = row.searchWord
      // 当keword改变之后，触发监听事件，事件是setTimeout，需要先执行，
      // 不然如果search先执行的话，showKeyword没有设置为空，搜索建议的盒子会显示出来，所以需要下一轮才执行search
      this.$nextTick(() => {
        this.search()
      })
    },
    // 点击搜索建议
    clickSuggest (title, item) {
      switch (title) {
        case 'songs':
        {
          this.keyword = item.name
          // 当keword改变之后，触发监听事件，事件是setTimeout，需要先执行，
          // 不然如果search先执行的话，showKeyword没有设置为空，搜索建议的盒子会显示出来，所以需要下一轮才执行search
          this.$nextTick(() => {
            this.search()
          })
          break
        }
        case 'artists':
        {
          console.log('artists')
          break
        }
        case 'albums':
        {
          console.log('albums')
          break
        }
        case 'playlists':
        {
          console.log(item)
          this.$router.push(`/playList/${item.id}`)
          break
        }
        default: break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  // 头部
  .el-header {
    height: 70px !important;
    background-color: #242424;
    .header {
      height: 100%;
      width: 95%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .headerLeft {
        width: 160px;
        height: 100%;
        // background-image: url("../assets/topbar.png");
        background-repeat: no-repeat;
        background-color: #ff4e4e;
      }
      .headerCenter {
        display: flex;
        justify-content: center;
        align-items: center;
        .go {
          margin: 0 5px;
        }
        ::v-deep .el-input__inner {
          outline: none;
          border: 0;
          border-radius: 20px;
          height: 40px;
          width: 250px;
        }
      }
      .headerRight {
        display: flex;
        justify-content: center;
        align-items: center;
        .username {
          margin-left: 5px;
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }
  //中间整体高度自适应
  .sectionHeight {
    height: 100%;
    & > .el-container {
      height: 80%;
    }
  }
  // 左侧菜单盒子
  ::v-deep .el-aside {
    overflow: hidden;
    background-color: #333744;
    height: 100%;
    .el-submenu__title {
      font-size: 10px;
    }
    & > .el-menu {
      height: 100%;
      overflow-y: auto;
      width: 100%;
      overflow-x: hidden;
    }
    .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
  }
  .el-footer {
    height: 70px !important;
  }
  .el-main {
    overflow-y: auto;
    height: 100%;
  }
  // 搜索框
  .searchBox {
    width: 400px;
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    height: 500px;
    display: none;
    z-index: 99999;
    overflow-y: auto;
    background-color: #fff;
    box-shadow: 0 0 15px 15px rgba(0,0,0,.3);
    .songInfo {
      & span:nth-child(1) {
         font-size: 15px;
        font-weight: 700;
      }
       & span:nth-child(2) {
         font-size: 12px;
        color: #ccc;
      }
    }
    .songcontent {
      font-size: 12px;
      color: #ccc;
    }
  }
  //搜索建议
  .searchSuggestBox {
    width: 400px;
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    height: 500px;
    z-index: 99999;
    overflow-y: auto;
    background-color: #fff;
    box-shadow: 0 0 15px 15px rgba(0,0,0,.3);
    // display: none;
    padding: 20px;
    .searchTitle {
      font-size: 14px;
      color: #666666
    }
    .searchSuggest {

      .title {
        background-color: #f5f5f7;
        font-size: 15px;
      }
      .suggestContet {
        line-height: 35px;
        font-size: 12px;
      }
    }
  }
}
</style>
