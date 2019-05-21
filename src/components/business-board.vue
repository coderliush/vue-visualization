<template>
  <div class="circle">
    <img src="../assets/board.png" alt="">
    <div class="content">
      <p class="active">{{content.num}}</p>
      <p class="name">{{content.name}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'board',
  props: {
    content: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  components: {}
}
</script>

<style scoped lang="stylus">
  @import '~styles/variable'
  .circle
    position relative
    img 
      width 133px
      padding-top 58px
    .content
      position absolute
      top 60%
      left 50%
      .active
        position absolute
        top -13px
        color $color-active
        font-size 22px
        transform translateX(-50%)
      .name 
        position absolute
        top 16px
        font-size $font-small
        word-break keep-all
        transform translateX(-50%)
</style>
