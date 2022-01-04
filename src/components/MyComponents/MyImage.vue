<template>
  <div>
    <el-image style="width: 100%" lazy :src="src">
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
  props: ['src']
}
</script>

<style lang="scss" scoped>
.slot {
  width: 100%;
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
