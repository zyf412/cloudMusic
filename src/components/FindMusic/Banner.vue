<template>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="(item, index) in banners" :key="index">
      <img :src="item.imageUrl" alt="" width="100%">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
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
    async getBanners () {
      const { data: res } = await this.$http.get('/banner', { params: { type: 0 } })
      // console.log(res)
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.banners = res.banners
      // console.log(this.banners)
    }
  }
}
</script>

<style></style>
