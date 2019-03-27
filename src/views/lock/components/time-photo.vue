<template>
  <div class="time-photo">
    <div class="row">
      <span class="dot"></span>
      <span>时间快照</span>
      <el-date-picker
        class="picker"
        v-model="value"
        type="datetime"
        placeholder="检索时间（默认当下）"
        default-time="12:00:00"
        @change="onChange"
      >
      </el-date-picker>
      <span>本部设备异常汇总：未安装</span>
      <span class="active">18</span>
      <span>未注册</span>
      <span class="active">18</span>
      <span>未验收</span>
      <span class="active">29</span>
      <span>离线</span>
      <span class="active">90</span>
      <span>维修</span>
      <span class="active">4</span>
      <span>注销</span>
      <span class="active">4</span>
      <span>报废</span>
      <span class="active">0</span>
      【<span class="red-dot"></span>】
      <span>生命过程录制</span>
    </div>
    <div class="axis">
      <img src="../../../assets/axis.png" alt="">
      <div class="tag" ref="tag"><span></span></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapMutations} from 'vuex'
export default {
  name: "",
  data() {
    return {
      hideSideBar: false,
      value: '',
      hours: '',
      originX: 183,
      gap: 50.5
    }
  },
  methods: {
    onChange(e) {
      let X
      if (!this.hideSideBar) {
        const hasSideX = 183, hasSideGap = 50.5
        X = hasSideX + e.getHours() * hasSideGap
      } else {
        const noSideX = 250, noSideGap = 52
        X = noSideX + e.getHours() * noSideGap
      }
      this.$refs.tag.style.left = `${X}px`,
      this.setTime(e)
    },
    ...mapMutations({
      setTime: 'SET_TIME'
    })
  },
  mounted() {
    this.$bus.$on('close', ()=>{
      this.hideSideBar = !this.hideSideBar
    })
  },
  components: {}
};
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .time-photo
    margin-top 4px
    padding 10px
    background $bg-panel
    .row
      display flex
      align-items center
      margin-bottom 20px
      .dot
        margin-right 10px
        dot($color-active)
      .picker
        margin 0 20px
      .active
        color $color-active
        margin 0 50px 0 6px
      .red-dot
        dot($red)
        border-radius 50%
    .axis
      position relative
      display flex
      img 
        width 86%
        margin 0 auto
      .tag
        position absolute
        top 18px
        left 183px
        display block
        width 10px 
        height 10px
        border 1px dashed $yellow
        transition all 1s
        span
          display block
          dot($yellow)
</style>
