<template>
  <div>
    <el-tabs v-model="activeName" :before-leave="leave">
    <el-tab-pane :lazy="true" label="专辑" name="first"><SubAlbum></SubAlbum></el-tab-pane>
    <el-tab-pane :lazy="true" label="歌手" name="second"><SubArtist></SubArtist></el-tab-pane>
    <el-tab-pane :lazy="true"  label="视频" name="third"><SubVideo :activeName="activeName"></SubVideo></el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import SubAlbum from '@/components/Collection/SubAlbum.vue'
import SubArtist from '@/components/Collection/SubArtist.vue'
import SubVideo from '@/components/Collection/SubVideo.vue'
export default {
  name: 'Collection',
  components: {
    SubAlbum,
    SubArtist,
    SubVideo
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    ...mapMutations(['showSubVideo', 'closeSubVideo']),
    leave (activeName, oldName) {
      if (oldName === 'third') {
        this.closeSubVideo()
      }
      if (activeName === 'third') {
        this.showSubVideo()
      }
      return true
    }
  }
}
</script>

<style>

</style>
