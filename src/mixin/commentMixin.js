// 发表评论
// type 0:歌曲; 2:歌单; 3:专辑; 4:电台; 5:视频;
export const mixin = {
  methods: {
    async comment (t, id, type, content) {
      let result = ''
      await this.$http.get('/comment', {
        params: {
          id,
          t,
          type,
          content
        }
      }).then(response => {
        const { data: res } = response
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('发表评论失败')
          result = false
        } else {
          this.$message.success('发表评论成功')
          result = true
        }
      }).catch(error => {
        const { data: err } = error.response
        this.$message.error(err.msg)
        result = false
      })
      return result
    }
  }
}
