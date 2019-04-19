<template>
  <!-- <div class="layout" ref="layout">
    <nav-bar class="nav"></nav-bar>
    <div class="main">
      <side-bar class="side"></side-bar>
      <views class="views"></views>
    </div>
  </div> -->
    <el-container>
      <el-header class="header"><nav-bar></nav-bar></el-header>
      <el-main class="container">
        <el-container>
          <el-aside class="aside"><side-bar></side-bar></el-aside>
          <el-main class="main"><views class="views"></views></el-main>
        </el-container>
      </el-main>
    </el-container>
</template>

<script type="text/ecmascript-6">
import SideBar from './components/SideBar'
import NavBar from './components/NavBar'
import Views from '../lock/index'
import {mapMutations} from 'vuex'
export default {
  name: '',
  data() {
    return {}
  },
  mounted() {
    // this.setRap()
    // window.onresize = ()=> {
    //   this.setRap()
    // }
  },
  methods: {
    setRap(){
      var layout = this.$refs.layout;
      var rap = document.body.clientWidth / 1903 || 1
      layout.style.transformOrigin = '0 0'
      layout.style.transform =  `scale(${rap}) translateZ(0)`
      layout.style.width = '1903px'

      this.setRatio(rap)
    },
    ...mapMutations({
      setRatio: 'SET_RATIO'
    })
  },
  components: {
    SideBar,
    NavBar,
    Views
  }
}
</script>

<style scoped lang="stylus">
  .header
    padding 0 10px!important
  .container
    padding 0!important
    .aside
      width 198px!important
      padding-left 10px!important
    .main 
      padding 0px!important
      .views 
        width 100%

</style>