<template>
  <div class="search">
    <h4 class="count">找到</h4>
    <div class="card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="单曲" name="first">
          <SearchSongList :keyword=keyword ></SearchSongList>
        </el-tab-pane>
        <!-- <el-tab-pane :label="'评论'+ playlist.commentCount" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import SearchSongList from '@/components/Search/searchSongList.vue'
export default {
  props: ['keyword'],
  components: {
    SearchSongList
  },
  data () {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style>
</style>
