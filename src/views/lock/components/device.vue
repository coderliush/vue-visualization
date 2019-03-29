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
      <div v-for="(item, index) in list" :key="index" class="item">
          <el-select v-model="value" class="select">
            <el-option :label="item.label" :value="item.value" onChange="onSelect"></el-option>
          </el-select>

          <div class="graph">
            <div class="device-no-data">
              <img :src="item.src" alt="">
              <div class="content">
                <p class="active">{{item.num}}</p>
                <p class="name">{{item.name}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Cirque from 'components/cirque'
export default {
  name: '',
  data() {
    return {
      componetName: 'Board',
      value: '',
      list: [{
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
  async mounted() {
    const getDeviceType = await this.$http.get('/dmp/api/LockHistory/GetLockTypeHistory')
    // console.log('getDeviceType', getDeviceType)
  },
  components: {
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
          .device-no-data
            margin-top 10px
            img
              width 39%
            .content
              position relative
              top -55px
              font-size 14px
          .cirque
            width 100%
            height 300px
          p
            position relative
            top -6px
            font-size 14px


</style>
