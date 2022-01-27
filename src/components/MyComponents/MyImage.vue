<template>
  <div>
    <el-image :style="Style" lazy :src="src" fit=fill>
      <div slot="placeholder" class="image-slot">
        <div class="slot">
          <div class="loading">
            <i class="el-icon-loading"></i>
          </div>
        </div>
      </div>
      <div slot="error" class="image-slot">
        <div class="slot">
          <div class="loading">
            <i class="el-icon-picture-outline"></i>
          </div>
        </div>
      </div>
    </el-image>
  </div>
</template>

<script>
export default {
  props: ['src', 'setStyle'],
  data () {
    return {
      Style: 'width:100%'
    }
  },
  created () {
    if (this.setStyle.includes(this.Style)) {
      this.Style = this.setStyle
    } else {
      this.Style = this.setStyle + this.Style
    }
  }
}
</script>

<style lang="scss" scoped>
.slot {
  width: 100%;
  /*虽然这里设置了100% 但是，如果Style传入了height，那么这个的填充的高度是Style传入的高度*/
  /*所以，当没有高度的时候，会撑开，当有高度的时候，会按照高度去撑开*/
  padding-bottom: 100%;
  position: relative;
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
