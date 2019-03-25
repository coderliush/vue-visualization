<template>
  <div class="device">
    <div class="title">
      <span class="dot"></span>
      <span>设备异常检索（异常占比）</span>
      <span class="active">2018-12-13</span>
      <span>设备总计</span>
      <span class="active">XXX</span>
    </div>

    <div class="device-container">
      <div v-for="(item, index) in arr" :key="index" class="item">
          <el-select v-model="value" class="select">
            <el-option :label="item.label" :value="item.value" onChange="onSelect"></el-option>
          </el-select>

          <div class="graph">
            <component :is="componetName"></component>
          </div>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Cirque from 'components/cirque'
import Board from 'components/device-board'
export default {
  name: '',
  data() {
    return {
      componetName: 'Cirque',
      value: '',
      arr: [{
        name: '设备类型',
        src: require('../../../assets/device-type.png'),
        options: {value: 1, label: '设备类型'}
      }, {
        name: '供应商',
        src: require('../../../assets/supplier.png'),
        options: {value: 1, label: '设备类型'}
      }, {
        name: '固体版本',
        src: require('../../../assets/version.png'),
        options: {value: 1, label: '设备类型'}
      }, {
        name: '批次号',
        src: require('../../../assets/batch.png'),
        options: {value: 1, label: '设备类型'}
      }]
    }
  },
  methods: {
    onSelect() {
      console.log('1')
    }
  },
  components: {
    Board,
    Cirque
  }
}
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .device
    position relative
    z-index 1
    margin-top 10px
    background $bg-panel
    .title
      display flex
      align-items center
      padding 20px 10px
      .dot
        margin-right 10px
        dot($color-active)
      .active 
        margin 0 20px 0 10px
        color $color-active
    .device-container
      display flex
      padding 0 96px
      .item 
        width 25%
        text-align center
        .select
          width 120px!important
        .graph
          position relative
          top -14px
          left 30px
          .cirque
            width 100%
            height 300px
          p
            position relative
            top -50px
            font-size 14px


</style>
