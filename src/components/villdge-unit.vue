<template>
  <div class="wrapper">
    <div  class="img-wrapper"><img :src="src" alt=""></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: {
    src: {
      default: '',
      type: String
    },
  
  },
  data() {
    return {}
  },
  components: {},
}
</script>

<style scoped lang="stylus">
    .wrapper
      width 877px
      height 750px 
      margin 0 auto
      position relative
      top -2px
      left -1px
      text-align center
      background url('../assets/mapBg.png') no-repeat
      background-size: 100% 82%
      .img-wrapper
        width 600px
        height 360px
        position relative
        top 123px
        margin 0 auto
        img
          width 100%
          max-height 360px
      .cell-wrapper
        background rgba(49, 116, 208, 0.5)
        img 
          opacity .6
</style>

