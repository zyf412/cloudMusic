<template>
  <transition name="el-zoom-in-center">
    <div class="transition-box topList">
      <div class="offical">
        <h3>官方榜</h3>
        <div class="officalList">
          <div class="officalListBox" v-for="(item,index) in officalList" :key="item.id">
            <div class="image" @click="goToDetial(item.id)">
              <MyImage :setStyle="'width: 150px; height: 150px;'" :src="item.coverImgUrl"></MyImage>
            </div>
            <div class="songs" v-if="officalListDetail[index]">
              <el-table :data="officalListDetail[index].tracks" stripe style="width: 100%" :show-header="false">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="first"  width="180">
                </el-table-column>
                <el-table-column prop="second" >
                </el-table-column>
              </el-table>
            </div>
          </div>
           <el-divider></el-divider>
        </div>
      </div>
      <div class="global">
        <h3>全球榜</h3>
        <div class="globalList">
          <div class="globalListBox" @click="goToDetial(item.id)" v-for="(item, index) in globalList" :key="index">
            <div class="image">
              <MyImage :setStyle="''" :src="item.coverImgUrl"></MyImage>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import MyImage from '@/components/MyComponents/MyImage.vue'
export default {
  components: {
    MyImage
  },
  data () {
    return {
      officalList: [],
      officalListDetail: [],
      globalList: [],
      show: false
    }
  },
  created () {
    this.getList()
    this.getListDetail()
  },
  activated () {
    this.show = true
    console.log(12121)
  },
  deactivated () {
    this.show = false
  },
  methods: {
    async getList () {
      const { data: res } = await this.$http.get('/toplist')
      if (res.code !== 200) return this.$message.error('获取信息失败')
      for (let i = 0; i < 4; i++) {
        this.officalList.push(res.list[i])
      }
      for (let i = 4; i < res.list.length; i++) {
        this.globalList.push(res.list[i])
      }
      console.log(this.officalList)
      console.log(this.globalList)
    },
    async getListDetail () {
      const { data: res } = await this.$http.get('/toplist/detail')
      if (res.code !== 200) return this.$message.error('获取信息失败')
      for (let i = 0; i < 4; i++) {
        this.officalListDetail.push(res.list[i])
      }
    },
    // 跳转到歌单详情页面
    goToDetial (id) {
      // console.log(id)
      this.$router.push(`/playList/${id}`)
    }
  }
}
</script>

<style lang="scss" scope>
.topList {
  h3 {
    margin: 0;
    padding: 0;
  }
  .offical {
    .officalList {
      margin-top: 10px;
      // display: flex;
      // flex-wrap: wrap;
      // justify-content: space-between;
      .officalListBox {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .image {
          width: 150px;
          height: 150px;
          border-radius: 5px;
          overflow: hidden;
          cursor: pointer;
          margin-right: 15px;
        }
        .songs {
          width: 80%;
        }
      }
    }
  }
  .global {
    .globalList {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-top: 10px;
      .globalListBox {
        width: 18%;
        margin-right: 10px;
        margin-top: 5px;
        cursor: pointer;
        .image {
          width: 100%;
          height: 100%;
          border-radius: 5px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
