<template>
  <div class="life">
    <div class="title">
      <span class="dot"></span>
      <span>生命异常检索（异常占比）</span>
      <span class="active">2018-12-13</span>
      <span>设备总计</span>
      <span class="active">XXX</span>
    </div>
    <div class="content"> 
      <div v-for="(item, index) in list" :key="index" class="item">
        <el-select v-model="value" placeholder="请选择" class="select" @change="onSelect">
          <el-option v-for="each in item.options" :key="each.value" :label="each.label" :value="each.value"></el-option>
        </el-select>
        <div class="life-no-data">
          <img src="../../../assets/cirque.png" alt="">
          <p>{{item.options.label}}</p>
          <p>{{item.num}}</p>
          <img class="connect" src="../../../assets/connect.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  data() {
    return {
      value: 0,
      list: [{
        name: '注册',
        num: 100,
        options: [{label: '注册', value: 0}, {label: '未注册', value: 1}],
      }, {
        num: 100,
        options: [{label: '安装', value: 0}, {label: '未安装', value: 1}],
      }, {
        num: 100,
        options: [{label: '验收', value: 0}, {label: '未验收', value: 1}],
      }, {
        num: 100,
        options: [{label: '在线', value: 0}, {label: '离线', value: 1}],
      }, {
        num: 100,
        options: [{label: '在线', value: 0}, {label: '离线', value: 1}],
      }, {
        num: 100, 
        options: [{label: '数据正常', value: 0}, {label: '数据异常', value: 1}],
      }, {
        num: 100,
        options: [{label: '数据（无维修）', value: 0}],
      }, {
        num: 100,
        options: [{label: '数据（无注销）', value: 0}],
      }, {
        num: 100,
        options: [{label: '数据（无报废）', value: 0}],
      }]
    }
  },
  methods: {
    onSelect(val) {
      console.log('val', val)
    }
  },
  components: {}
}
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .el-input--suffix .el-input__inner
    padding 12px!important

  .life
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
    .content
      display flex
      .item
        margin-right 45px
        text-align center
        .select
          width 120px
          position relative
          left 13px
        .life-no-data
          position relative
          img:nth-of-type(1) 
            width 120%
          p:nth-of-type(1)
            position absolute
            top 47px
            left 53px
            font-size $font-small
          p:nth-of-type(2)
            position absolute
            top 73px
            left 53px
            font-size $font-small
            color $color-active
          .connect
            position absolute
            width 45%
            top 55px
            left 144px
      .item:last-of-type
        margin-right 0
        .connect
          display none

</style>
