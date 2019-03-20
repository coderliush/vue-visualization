<template>
  <div class="nav-bar">
    <div class="header">
      <div class="side">
        <img class="left" src="../../../assets/logo.png" alt="">
        <img class="right" src="../../../assets/menu.png" alt="" @click="close">
      </div>
      <div class="title">
        <p>统一设备生命周期管理平台</p>
      </div>
      <div class="info">
        <span>欢迎您，XXX</span>
        <span>【退出】</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  data() {
    return {}
  },
  methods: {
    lock() {
      this.$emit('close')
    }
  }
  components: {
    
  }
}
</script>

<style scoped lang="stylus">
  @import '~styles/variable'
  @import '~styles/mixin'
  .nav-bar
    flex 1
    .header
      display flex
      color $color-white
      .side
        width 266px
        height 50px
        margin-bottom 10px
        padding 0 20px
        display flex
        align-items center
        justify-content space-between
        background url('../../../assets/logobj.png') no-repeat
        background-size 100% 100%
        .right
          cursor pointer
      .info
        position absolute
        top 26px
        right 0
        font-size $font-small
      .title
        width 480px
        height 54px
        display flex
        justify-content center
        margin 0 auto
        background url('../../../assets/title-bg.png') no-repeat
        p
          position relative
          top 12px
</style>
