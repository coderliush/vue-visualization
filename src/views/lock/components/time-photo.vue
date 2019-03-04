<template>
  <div class="time-photo">
    <div class="row">
      <span class="dot"></span>
      <span>时间快照</span>
      <el-date-picker
        v-model="value3"
        type="datetime"
        placeholder="检索时间（默认当下）"
        default-time="12:00:00"
        class="picker"
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
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
  data() {
    return {
      value3: ''
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
      img 
        width 86%
</style>
