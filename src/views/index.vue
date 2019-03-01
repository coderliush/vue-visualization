<template>
  <div class="layout" ref="layout">
    <side></side>
    <container></container>
  </div>
</template>

<script type="text/ecmascript-6">
import Side from 'components/side'
import Container from 'components/container'
export default {
  name: '',
  data() {
    return {}
  },
  mounted() {
    this.setRap()
    window.onresize = ()=> {
      this.setRap()
    }
  },
  methods: {
    setRap(){
      var layout = this.$refs.layout;
      var rap = document.body.clientWidth / 1903 || 1
      layout.style.transformOrigin = '0 0'
      layout.style.transform =  `scale(${rap}) translateZ(0)`
      layout.style.width = '1903px'
    },
  },
  components: {
    Side,
    Container
  }
}
</script>

<style scoped lang="stylus">
  .layout
    display flex
    padding 0 10px
</style>
