<template>
  <div class="commentInput" ref="comment">
    <el-input type="textarea" resize="none" placeholder="请输入内容" v-model="commentText" maxlength="140" show-word-limit>
    </el-input>
    <div class="commit">
        <el-button>提交</el-button>
    </div>
    <div class="comment">
      <div class="hotComment">
        <h4>热门评论</h4>
        <CommentTable :comments="hotComments"></CommentTable>
      </div>
      <div class="newComment">
        <h4>最新评论</h4>
        <CommentTable :comments="comments"></CommentTable>
      </div>
    </div>
      <div class="pagination">
      <el-pagination @current-change="currentChange" background :page-size="limit" layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import CommentTable from '@/components/MyComponents/CommentTable.vue'
export default {
  props: ['id'],
  data () {
    return {
      commentText: '',
      offset: 0,
      limit: 20,
      comments: [], // 评论
      hotComments: [],
      total: 0
    }
  },
  components: {
    CommentTable
  },
  created () {
    this.getCommentVideo()
    // console.log(this.id)
  },
  methods: {
    async getCommentVideo () {
      const { data: res } = await this.$http.get('/comment/video', {
        params: {
          id: this.id,
          limit: this.limit,
          offset: this.offset
        }
      })
      if (res.code !== 200) return this.$message.error('获取信息失败')
      this.comments = res.comments
      if (this.offset === 0) {
        this.hotComments = res.hotComments
      }
      this.total = res.total
    },
    // 改变页数 ，通过事件总线去触发改变页面的事件
    currentChange (page) {
      this.offset = (page - 1) * this.limit
      this.getCommentVideo()
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
    margin-top: 15px;
    .newComment {
      margin-top: 15px;
    }
  }

  .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
  }
</style>
