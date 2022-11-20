<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <span class="iconfont icon-home"></span>
        <span class="iconfont icon-sami-select"></span>
        <span class="iconfont icon-full-screen"></span>
      </div>
      <div class="history-wrapper">
        <span class="iconfont el-icon-arrow-left" @click="$router.go(-1)"></span>
        <span class="iconfont el-icon-arrow-right" @click="$router.go(1)"></span>
      </div>
    </div>
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <input
          type="text"
          v-model="query"
          autocomplete="off"
          placeholder="搜索"
          class="el-input__inner"
          @keyup.enter="toSearch"
        />
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'top',
  data () {
    return {
      query: ''
    }
  },
  methods: {
    toSearch () {
      if (this.query === '') {
        this.$message({
          message: '还未输入内容哦',
          type: 'warning'
        })
      } else {
        this.$router.push('/result?query=' + this.query)
      }
    }
  }
}
</script>

<style scoped>

</style>
