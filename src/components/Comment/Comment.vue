<template>
  <div class="commentInput" ref="comment">
    <el-input type="textarea" resize="none" placeholder="请输入内容" v-model="commentText" maxlength="140" show-word-limit>
    </el-input>
    <div class="commit">
        <el-button>提交</el-button>
    </div>
    <div class="comment">
      <div class="hotComment">
      </div>
      <div class="newComment">
        <h4>最新评论</h4>
        <el-table :data="comments" style="width: 100%" :show-header="false">
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
        <div class="pagination">
      <el-pagination @current-change="currentChange" background :page-size="limit" layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/eventBus/eventBus.js'
export default {
  props: ['id'],
  data () {
    return {
      commentText: '',
      offset: 0,
      limit: 20,
      comments: [], // 评论
      total: 0
    }
  },
  created () {
    this.getCommentPlayList()
    // console.log(this.id)
  },
  methods: {
    async getCommentPlayList () {
      const { data: res } = await this.$http.get('/comment/playlist', {
        params: {
          id: this.id,
          limit: this.limit,
          offset: this.offset
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.comments = res.comments
      this.total = res.total
    },
    // 改变页数 ，通过事件总线去触发改变页面的事件
    currentChange (page) {
      this.offset = (page - 1) * this.limit
      this.getCommentPlayList()
      eventBus.$emit('changePage')
      //   this.$refs.scrollTo(top)
    }
  }
}
</script>

<style lang="scss" scope>
.commentInput {
    .commit {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
    }
}
    .comment {
  .hotComment {
  }
  .newComment {
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
  }
  .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
  }
}
</style>
