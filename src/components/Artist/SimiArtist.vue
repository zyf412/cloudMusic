<template>
  <div class="simiArtist">
    <div class="image" v-for="(item) in artistList" :key="item.id" @click="gotoDetail(item.id)">
      <MyImage :setStyle="''" :src="item.img1v1Url"></MyImage>
      <div class="name">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import MyImage from '@/components/MyComponents/MyImage.vue'
export default {
  props: ['id'],
  components: {
    MyImage
  },
  data () {
    return {
      artistList: []
    }
  },
  created () {
    this.getArtistList(this.id)
  },
  watch: {
    // id: {
    //   handler (newId) {
    //     this.getArtistList(newId)
    //   }
    // }
  },
  methods: {
    async getArtistList (id) {
      const { data: res } = await this.$http.get('/simi/artist', {
        params: {
          id
        }
      })
      if (res.code !== 200) return this.$message.error('获取相似歌手失败')
      this.artistList = res.artists
    },
    // 跳转到歌手详情页面
    gotoDetail (id) {
      this.$router.push(`/artistDetail/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.simiArtist {
  display: flex;
  flex-wrap: wrap;
  .image {
    width: 17%;
    margin-right: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    .name {
      margin-top: 8px;
      height: 40px;
    }
  }
}
</style>
