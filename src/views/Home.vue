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
                <i class="el-icon-view"></i>
                <span>发现音乐</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/AllVideo">
              <i class="el-icon-video-camera-solid"></i>
              <span slot="title">视频</span>
            </el-menu-item>

            <el-menu-item-group>
              <template slot="title">我的音乐</template>
              <el-menu-item index="/Collection">
                <i class="el-icon-collection"></i>
                <span slot="title">我的收藏</span>
              </el-menu-item>

            </el-menu-item-group>

            <el-submenu index="12">
              <template slot="title">
                <i class="el-icon-collection-tag"></i>
                <span>创建的歌单</span>
              </template>

              <el-menu-item-group>
                <el-menu-item :title="item.name" v-for="item in userPlaylist" :key="item.id" @click="gotoPlaylist(item.id)">{{item.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="13">
              <template slot="title">
                <i class="iconfont icon-xihuan"></i>
                <span>收藏的歌单</span>
              </template>

              <el-menu-item-group>
                <el-menu-item :title="item.name" v-for="item in subscribedPlaylist" :key="item.id" @click="gotoPlaylist(item.id)">{{item.name}}</el-menu-item>
              </el-menu-item-group>
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
      isCollapse: false,
      // navState: ''
      userPlaylist: [],
      subscribedPlaylist: []
    }
  },
  computed: {
    ...mapState([
      'playListCateScrollTop',
      'artistDetailScrollTop',
      'mainKeepAliveArr',
      'uid'
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
      if (this.$refs.main) this.$refs.main.$el.scrollTop = 0
    })
    // 得到之前滚动条的位置，添加到vuex中去
    eventBus.$on('backAllPlayList', () => {
      if (this.$refs.main) this.getScrollTop(this.$refs.main.$el.scrollTop)
    })
    // 当返回之前的页面，还原之前滚动条的位置
    eventBus.$on('backTo', () => {
      if (this.$refs.main) { this.$refs.main.$el.scrollTop = this.playListCateScrollTop }
    })
    // 得到之前滚动条的位置，添加到vuex中去
    eventBus.$on('backArtistDetail', () => {
      if (this.$refs.main) { this.getArtistDetailScrollTop(this.$refs.main.$el.scrollTop) }
    })
    // 当返回之前的页面，还原之前滚动条的位置
    eventBus.$on('backToArtistDetail', () => {
      if (this.$refs.main) { this.$refs.main.$el.scrollTop = this.artistDetailScrollTop }
    })
    // this.getUserPlaylist(this.uid)
    if (this.uid) this.getUserPlaylist(this.uid)

    // 用户收藏或取消收藏歌单,更新用户的歌单
    eventBus.$on('updateUserPlaylist', () => {
      this.getUserPlaylist(this.uid)
    })
  },
  watch: {
    uid (newName, oldName) {
      this.getUserPlaylist(newName)
    }
  },
  methods: {
    ...mapMutations(['getScrollTop', 'getArtistDetailScrollTop']),
    async getUserPlaylist (uid) {
      if (uid === null) return
      const { data: res } = await this.$http.get('/user/playlist', {
        params: { uid }
      })
      if (res.code !== 200) return this.$message.error('获取用户歌单失败')
      this.userPlaylist = res.playlist.filter(item => item.subscribed === false)
      this.subscribedPlaylist = res.playlist.filter(
        item => item.subscribed === true
      )
    },
    gotoPlaylist (id) {
      this.$router.push(`/playList/${id}`)
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff !important;
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
