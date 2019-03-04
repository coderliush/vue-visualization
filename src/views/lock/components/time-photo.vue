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
        @change="change"
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
export default {
  name: "",
  data() {
    return {
      value: '',
      hours: '',
    }
  },
  methods: {
    change(e) {
      const originX = 75
      let X = originX + e.getHours() * 53
      console.log('e.getHours()', X)
      this.$refs.tag.style.left = `${X}px`
    }
  },
  components: {}
};
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .time-photo
    margin-top 11px
    padding 10px
    background $bg-panel
    .row
      display flex
      align-items center
      .dot
        margin-right 10px
        dot($color-active)
      .picker
        margin 0 20px
      .active
        color $color-active
        margin 0 30px 0 6px
      .red-dot
        dot($red)
        border-radius 50%
    .axis
      position relative
      display flex
      img 
        width 86%
      .tag
        position absolute
        top 18px
        left 75px
        display block
        width 10px 
        height 10px
        border 1px dashed $yellow
        transition all 1s
        span
          display block
          dot($yellow)
</style>
