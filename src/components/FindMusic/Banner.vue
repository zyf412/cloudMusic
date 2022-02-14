<template>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="item in banners" :key="item.targetId" >
      <img :src="item.imageUrl" alt="" width="100%" @click="gotoDetail(item.targetId,item.targetType)">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      banners: []
    }
  },
  created () {
    this.getBanners()
  },
  methods: {
    ...mapMutations(['addMusic']),
    async getBanners () {
      const { data: res } = await this.$http.get('/banner', { params: { type: 0 } })
      // console.log(res)
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.banners = res.banners
      // console.log(this.banners)
    },
    async gotoDetail (id, type) {
      switch (type) {
        case 1: {
          const { data: res } = await this.$http.get('/song/detail', {
            params: { ids: id }
          })
          if (res.code !== 200) {
            this.$message.error('获取信息失败')
            break
          }
          // console.log(res)
          this.addMusic(res.songs[0])
          break
        }
        case 1000: {
          this.$router.push(`/playList/${id}`)
          break
        }
      }
    }
  }
}
</script>

<style></style>
