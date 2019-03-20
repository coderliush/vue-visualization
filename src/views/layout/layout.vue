<template>
  <div class="layout" ref="layout">
    <nav-bar></nav-bar>
    <div class="main">
      <side-bar></side-bar>
      <views></views>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SideBar from './components/SideBar'
import NavBar from './components/NavBar'
import Views from '../lock/index'
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
    SideBar,
    NavBar,
    Views
  }
}
</script>

<style scoped lang="stylus">
  .layout
    padding 0 10px
</style>