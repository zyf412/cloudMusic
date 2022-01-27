<template>
  <div>
    <el-tabs v-model="activeName">
    <el-tab-pane label="视频" name="first">视频</el-tab-pane>
    <el-tab-pane :lazy="true" label="MV" name="second">
        <keep-alive>
        <MVcate :activeName="activeName"></MVcate>
        </keep-alive>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import MVcate from '@/components/Video/MVcate.vue'
export default {
  name: 'AllVideo',
  components: {
    MVcate
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  activated () {
    console.log('激活了')
  },
  deactivated () {
    console.log('缓存了')
  }
}
</script>

<style>

</style>
