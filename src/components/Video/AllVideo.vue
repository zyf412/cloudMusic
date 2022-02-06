<template>
  <div>
    <el-tabs v-model="activeName" :before-leave="leave">
      <el-tab-pane label="视频" name="first" v-if="ifLogin">
        <keep-alive>
          <VideoCate :activeName="activeName"></VideoCate>
        </keep-alive>
      </el-tab-pane>
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
import VideoCate from '@/components/Video/Videocate.vue'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'AllVideo',
  components: {
    MVcate,
    VideoCate
  },
  created () {
    if (!this.ifLogin) {
      this.activeName = 'second'
    }
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  computed: {
    ...mapState(['ifLogin'])
  },
  methods: {
    ...mapMutations(['showVideo', 'closeVideo', 'showMV', 'closeMV']),
    leave (activeName, oldName) {
      if (activeName === 'first') {
        this.showVideo()
        this.closeMV()
      }
      if (activeName === 'second') {
        this.closeVideo()
        this.showMV()
      }
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
