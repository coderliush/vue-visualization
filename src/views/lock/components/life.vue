<template>
  <div class="life">
    <div class="title">
      <span class="dot"></span>
      <span>生命异常检索（异常占比）</span>
      <span class="active">{{querytime}}</span>
      <span>设备总计</span>
      <span class="active">{{total | splitNum}}</span>
    </div>
    <div class="content"> 
      <div v-for="(item, index) in list" :key="index" class="item">
        <el-select v-model="item.value" placeholder="请选择" class="select" @change="onSelect(item)">
          <el-option v-for="each in item.options" :key="each.value" :label="each.label" :value="each.value"></el-option>
        </el-select>

        <div class="cirque-wrapper">
          <cirque class="cirque" :cirqueInfo="item.cirqueInfo" :isSecond="item.value === 1 ? true : false"></cirque>
          <div class="cirque-label" v-show="item.value === 1">
            <p>{{item.options[1].label}} {{item.options[1].num}}</p>
            <canvas ref="label" width="160" height="100"></canvas>
          </div>
          <div class="info">
            <p>{{item.selected.label}}</p>
            <p>{{item.selected.num}}</p>
          </div>
          <img v-show="item.value === 0" class="connect" src="../../../assets/connect.png" alt="">
          <img v-show="item.value === 1" class="active" src="../../../assets/cirque-active.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import objAddPercent from 'utils/objAddPercent'
import Cirque from 'components/normalCirque.vue'
import { mapGetters } from 'vuex'
export default {
  name: '',
  data() {
    return {
      total: null,
      colors: ['#7CBE14', '#20A9F9', '#E6644E', '#FF66BC', '#A081FF', '#FFAE0D', '#999999', '#A56237'],
      list: [{
        value: 0, //默认选中第一项
        cirqueInfo: {}, // 圆环的百分数据
        selected: {label: '注册', num: null},
        options: [{label: '注册', value: 0, num: null}, {label: '未注册', value: 1, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        selected: {label: '安装', num: null},
        options: [{label: '安装', value: 0, num: null}, {label: '未安装', value: 1, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        selected: {label: '验收', num: null},
        options: [{label: '验收', value: 0, num: null}, {label: '未验收', value: 1, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        selected: {label: '在线', num: null},
        options: [{label: '在线', value: 0, num: null}, {label: '离线', value: 1, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        selected: {label: '数据正常', num: null},
        options: [{label: '数据正常', value: 0, num: null}, {label: '数据异常', value: 1, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        selected: {label: '正常(无维修)', num: null},
        options: [{label: '正常(无维修)', value: 0, num: null}, {label: '维修', value: 1, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        selected: {label: '正常(无注销)', num: null},
        options: [{label: '正常(无注销)', value: 0, num: null}, {label: '注销', value: 1, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        selected: {label: '正常(无报废)', num: null},
        options: [{label: '正常(无报废)', value: 0, num: null}, {label: '报废', value: 1, num: null}],
      }]
    }
  },
  watch: {
    params: {
      handler(obj) {
        this.init()
      },
      deep: true
    },
  },
  computed: {
    ...mapGetters([
      'params',
      'querytime'
    ])
  },
  methods: {
    async init() {
      const res = await this.$http.awaitTasks([
        this.$http.post('/dmp/api/LockHistory/GetUnRegCntHistory', this.params),  // 注册
        this.$http.post('/dmp/api/LockHistory/GetUnInstCntHistory', this.params), // 安装
        this.$http.post('/dmp/api/LockHistory/GetUnAcpCntHistory', this.params),  // 验收
        this.$http.post('/dmp/api/LockHistory/GetOfflnCntHistory', this.params),  // 在线

        this.$http.post('/dmp/api/LockHistory/GetOfflnCntHistory', this.params),  // 正常  无接口预留

        this.$http.post('/dmp/api/LockHistory/GetRepairCntHistory', this.params), // 维修
        this.$http.post('/dmp/api/LockHistory/GetCancelCntHistory', this.params), // 注销
        this.$http.post('/dmp/api/LockHistory/GetDumpCntHistory', this.params),   // 报废
      ])  

      this.$bus.$emit('headerCount', res)
      res.forEach((item, index) => {
        this.list[index].selected.num = item.trueStatusNums
        this.list[index].options[0].num = item.trueStatusNums
        this.list[index].options[1].num = item.falseStatusNums
        this.list[index].cirqueInfo = {color: this.colors[index], ...objAddPercent(item)}
      })
    },
    onSelect(item) {
      item.selected.label = item.options[item.value].label
      item.selected.num = item.options[item.value].num
    },
    initCanvas() {
      let label
      for (let i=0; i<=7; i++) {
        label = this.$refs.label[i].getContext('2d')
        if (i === 4) {  // 数据异常
          label.beginPath(); label.moveTo(90, 40); label.lineTo(105, 30); label.strokeStyle="#7CCCEF"; label.stroke()
        } else {
          label.beginPath(); label.moveTo(90, 40); label.lineTo(105, 30); label.strokeStyle="#7CCCEF"; label.stroke()
        }
      }
    }
  },
  mounted() {
    this.$bus.$on('totalDevice', (total) => {
      this.total = total
    })

    this.initCanvas()
    this.init()
  },
  components: {
    Cirque
  }
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
      position relative
      left -24px
      width 100%
      margin 0 28px
      .item
        flex 1
        text-align center
        .cirque-wrapper
          position relative
          display flex
          margin 20px
          .cirque
            position relative
            z-index 9999
          .cirque-label 
            position absolute
            p
              position absolute
              left 128px
              top -9px
              white-space nowrap
              padding-bottom 6px
              font-size $font-smaller
              border-bottom 1px solid #7CCCEF
            canvas
              position absolute
              top -20px
              left 26px
          .info
            min-width 124px
            position absolute
            top 50%
            left 50%
            transform translate(-54%, -37%)
            p:nth-of-type(1)
              margin-bottom 4px
              font-size $font-small
            p:nth-of-type(2)
              font-size $font-small
              color $color-active
          .connect
            position absolute
            height 41%
            left 135px
            top 47px
          .active
            position absolute
            left 103px
            top -19px
            width 100%
        .select
          width 120px
      .item:last-of-type
        margin-right 0
        .connect
          display none
        .active
          display none
</style>
