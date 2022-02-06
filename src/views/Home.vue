<template>
  <div class="home">
    <el-container class="sectionHeight">
      <!-- 顶部header  -->
      <el-header>
        <Header></Header>
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
<!--
            <el-menu-item index="2">
              <span slot="title">播客</span>
            </el-menu-item> -->

            <el-menu-item index="/AllVideo">
              <span slot="title">视频</span>
            </el-menu-item>

            <!-- <el-menu-item index="4">
              <span slot="title">朋友</span>
            </el-menu-item> -->

            <!-- <el-menu-item index="5">
              <span slot="title">直播</span>
            </el-menu-item> -->

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
              <router-view></router-view>
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
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
export default {
  name: 'Home',
  components: {
    Footer,
    Header
  },
  data () {
    return {
      isCollapse: false
      // navState: ''
    }
  },
  computed: {
    ...mapState([
      'playListCateScrollTop',
      'artistDetailScrollTop',
      'mainKeepAliveArr'
    ])
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
      if (this.$refs.main) this.getScrollTop(this.$refs.main.$el.scrollTop)
    })
    // 当返回之前的页面，还原之前滚动条的位置
    eventBus.$on('backTo', () => {
      if (this.$refs.main) this.$refs.main.$el.scrollTop = this.playListCateScrollTop
    })
    // 得到之前滚动条的位置，添加到vuex中去
    eventBus.$on('backArtistDetail', () => {
      this.getArtistDetailScrollTop(this.$refs.main.$el.scrollTop)
    })
    // 当返回之前的页面，还原之前滚动条的位置
    eventBus.$on('backToArtistDetail', () => {
      if (this.$refs.main) this.$refs.main.$el.scrollTop = this.artistDetailScrollTop
    })
  },

  methods: {
    ...mapMutations(['getScrollTop', 'getArtistDetailScrollTop'])
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
    height: 100%;
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
}
</style>
