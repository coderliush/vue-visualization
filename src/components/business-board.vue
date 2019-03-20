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
  img 
    width 100%
  .content
    position relative
    .active
      position absolute
      top -108px
      left 50%
      transform translateX(-50%)
      color $color-active
      font-size 24px
    .name 
      position absolute
      top -74px
      left 50%
      transform translateX(-50%)
      font-size $font-small
</style>
