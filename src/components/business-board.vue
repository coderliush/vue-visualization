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
    min-width 190px
    img 
      width 100%
    .content
      position relative
      top -50%
      left 50%
      .active
        position absolute
        top -18px
        color $color-active
        font-size 26px
        transform translateX(-50%)
      .name 
        position absolute
        top 21px
        word-break keep-all
        transform translateX(-50%)
</style>
