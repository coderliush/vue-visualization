<template>
  <div class="nav-bar">
    <div class="header">
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
  components: {
    
  }
}
</script>

<style scoped lang="stylus">
  @import '~styles/variable'
  @import '~styles/mixin'
  .nav-bar
    flex 1
    padding 0 10px
    .header
      color $color-white
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
