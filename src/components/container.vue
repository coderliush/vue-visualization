<template>
  <div class="wrapper">
    <div class="header">
      <div class="title">
        <p>统一设备生命周期管理平台</p>
      </div>
      <div class="info">
        <span>欢迎您，XXX</span>
        <span>【退出】</span>
      </div>
    </div>
    <div class="time-photo">
      <div class="dot"></div>
      <time-photo></time-photo>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import timePhoto from 'components/time-photo'
export default {
  name: '',
  data() {
    return {}
  },
  components: {
    timePhoto
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/style/variable'
  .wrapper
    flex 1
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
        background url('../common/img/title-bg.png') no-repeat
        p
          position relative
          top 12px
</style>
