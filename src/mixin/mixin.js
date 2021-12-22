export const mixin = {
  methods: {
    async checkMusic (id) {
      try {
        const { data: res } = await this.$http.get('/check/music', {
          params: { id }
        })
        if (!res.success) return this.$message.error('暂时没有版权欧!')
        return true
      } catch (error) {
        this.$message.error('暂时没有版权欧!')
        return false
      }
    }
  }
}
