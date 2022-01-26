<template>
  <div>
    <el-tabs v-model="activeName" :before-leave="leave">
      <el-tab-pane label="个性推荐" name="first">
        <div class="recommend">
          <!-- 轮播图 -->
          <div class="banner">
            <Banner></Banner>
          </div>
          <!-- 推荐模块 -->
          <div>
            <Recommend></Recommend>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="专属定制" name="second">专属定制</el-tab-pane>
      <el-tab-pane :lazy="true" label="歌单" name="third">
          <AllPlayList v-if="!ifShowHighQuality"></AllPlayList>
          <!-- <router-view v-else></router-view> -->
          <HighQuality v-else></HighQuality>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="排行榜" name="fourth">
        <keep-alive>
        <TopList></TopList>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane  :lazy="true" label="歌手" name="fifth">
        <keep-alive>
        <Artist :activeName = "activeName"></Artist>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="最新音乐" name="sixth">最新音乐</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Banner from '@/components/FindMusic/Banner.vue'
import AllPlayList from '@/components/PlayList/allPlayList.vue'
import Recommend from '@/components/FindMusic/Recommend.vue'
import HighQuality from '@/components/PlayList/HighQualityPlaylist.vue'
import TopList from '@/components/FindMusic/TopList.vue'
import Artist from '@/components/FindMusic/Artist.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'FindMusic',
  components: {
    Banner,
    AllPlayList,
    Recommend,
    HighQuality,
    TopList,
    Artist
  },
  data () {
    return {
      // 默认显示个性推荐
      activeName: 'first'
    }
  },
  computed: {
    ...mapState(['ifShowHighQuality', 'ifArtistActived'])
  },
  methods: {
    ...mapMutations(['changeHighQuality', 'closeArtist', 'changeScrollTop', 'showArtist']),
    leave (activeName, oldName) {
      this.changeScrollTop()
      if (this.ifShowHighQuality) {
        this.changeHighQuality()
      }
      if (oldName === 'fifth') {
        console.log(oldName)
        this.closeArtist()
        console.log(this.ifArtistActived)
      }
      if (activeName === 'fifth') {
        this.showArtist()
      }
      return true
    }
    // goToThird () {
    //   this.activeName = 'third'
    // },
    // goToSixth () {
    //   this.activeName = 'sixth'
    // },
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  height: 80%;
  overflow-y: auto;
  .banner {
    margin-bottom: 10px;
  }
  .s {
    width: 50px;
    background-color: palegoldenrod;
    height: 600px;
  }

}
</style>
