<template>
  <div>
      <el-table :data="comments"   :row-key="(row)=>row.commentId" style="width: 100%" :show-header="false">
          <el-table-column  width="80">
              <template slot-scope="scope">
                  <div>
                      <el-avatar size="medium" :src="scope.row.user.avatarUrl"></el-avatar>
                  </div>
              </template>
          </el-table-column>
          <el-table-column >
              <template  slot-scope="scope">
                  <div class="commentInfo">
                      <div >
                          <span class="nickname">{{scope.row.user.nickname}}</span>
                          <span>: {{scope.row.content}}</span>
                      </div>
                      <div>
                          <span class="time">{{scope.row.timeStr}}</span>
                      </div>
                  </div>
              </template>
          </el-table-column>
        </el-table>
  </div>
</template>

<script>
export default {
  props: ['comments']
}
</script>

<style lang="scss" scoped>
      .commentInfo {
      font-size: 1px;
       .nickname {
        color: #507daf !important;
      }
      .time {
        font-size: 12px;
        color: #ccc;
      }
      }
</style>
