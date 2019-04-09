<template>
  <div class="cirque-wrapper">
    <div class="label">
      <!-- <p class="register">未注册 {{cirqueData.unRegisters}}</p>
      <p class="install">未安装 {{cirqueData.unInstalls}}</p>
      <p class="check">未验收 {{cirqueData.unAccepts}}</p>
      <p class="cancel">注销 {{cirqueData.cancels}}</p>
      <p class="scrap">报废 {{cirqueData.dumpings}}</p>
      <p class="service">维修 {{cirqueData.repairs}}</p>
      <p class="offline">离线 {{cirqueData.offlines}}</p> -->

      <!-- <p class="register">未注册 {{isUpdate && cirqueData && cirqueData.unRegisters}}</p>
      <p class="install">未安装 {{isUpdate && cirqueData &&  cirqueData.unInstalls}}</p>
      <p class="check">未验收 {{isUpdate && cirqueData && cirqueData.unAccepts}}</p>
      <p class="cancel">注销 {{isUpdate && cirqueData && cirqueData.cancels}}</p>
      <p class="scrap">报废 {{isUpdate && cirqueData && cirqueData.dumpings}}</p>
      <p class="service">维修 {{isUpdate && cirqueData && cirqueData.repairs}}</p>
      <p class="offline">离线 {{isUpdate && cirqueData && cirqueData.offlines}}</p> -->

      <p class="register">未注册 {{cirqueData && cirqueData.unRegisters}}</p>
      <p class="install">未安装 {{cirqueData &&  cirqueData.unInstalls}}</p>
      <p class="check">未验收 {{cirqueData && cirqueData.unAccepts}}</p>
      <p class="cancel">注销 {{cirqueData && cirqueData.cancels}}</p>
      <p class="scrap">报废 {{cirqueData && cirqueData.dumpings}}</p>
      <p class="service">维修 {{cirqueData && cirqueData.repairs}}</p>
      <p class="offline">离线 {{cirqueData && cirqueData.offlines}}</p>

      <canvas ref="register"></canvas>
      <canvas ref="install"></canvas>
      <canvas ref="check"></canvas>
      <canvas ref="offline"></canvas>
      <canvas ref="cancel" class="canvas-position"></canvas>
      <canvas ref="scrap" class="canvas-position"></canvas>
      <canvas ref="service" class="canvas-position"></canvas>
    </div>
    <div ref="cirque" class="cirque"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "cirque",
  props: {
    cirqueData: {
      type: Object,
    },
    graphic: {
      type: String
    },
    isUpdate: {    // 默认更新
      type: Boolean,
      default: true
    }
  },
  watch: {
    cirqueData() {
      this.list = []
      this.order.forEach((item, index) => {
        for (let k in this.cirqueData) {
          if (k === item) {
            this.list.push({
              name: '',
              value: 1,
              percentName: k,
              percent: this.cirqueData[k],
              itemStyle: {
                color: this.color[index],
                borderWidth: 0
              }
            })
          }
        }
      })
      if (this.isUpdate !== false) {this.init()}
    }
  },
  data() {
    return {
      // 圆环图顺序: 未安装, 未验收, 注销, 报废, 维修, 离线, 未注册
      order: ['unInstallsPercent', 'unAcceptsPercent', 'cancelsPercent', 'dumpingsPercent', 'repairsPercent', 'offlinesPercent', 'unRegistersPercent'],
      color: ['#7ABC12', '#1DA8FB', '#E7654B', '#979994', '#A26337', '#FDAE0B', '#FF67BB'], 
      list: [{
        name: '',
        value: 1,
        percent: '0%',
      }, {
        name: '',
        value: 1,
        percent: '0%'
      }, {
        name: '',
        value: 1,
        percent: '0%'
      }, {
        name: '',
        value: 1,
        percent: '0%'
      }, {
        name: '',
        value: 1,
        percent: '0%'
      }, {
        name: '',
        value: 1,
        percent: '0%'
      }, {
        name: '',
        value: 1,
        percent: '0%'
      }]
    }
  },
  mounted() {
    this.initLabel()
    this.init()
  },
  methods: {
    init() {
      const echarts = require("echarts")
      const chart = echarts.init(this.$refs.cirque)
      const option = {
        title: {
          text: ""
        },
        graphic: {
          elements: [{
            type: 'text',
            style: {
              text: '',
              fill: '#67B2DA',
              font: 'bold 14px "Microsoft YaHei", sans-serif',
            },
            left: 'center',
            top: 'center'
          }]
        },
        series: [
          {
            type: "sunburst",
            data: this.list,
            label: {
              position: "inside",
              color: '#000',
              fontSize: 13,
              rotate: 'tangential',
              formatter: (params) => {
                return params.data.percent
              }
            },
            itemStyle: {
              borderWidth: 0
            },
            radius: ['45%', '67%'],
            animation: false
          }
        ],
      }
      option.graphic.elements[0].style.text = this.graphic
      chart.setOption(option)
    },
    initLabel() {
      let register = this.$refs.register.getContext("2d"),
          install = this.$refs.install.getContext("2d"),
          check = this.$refs.check.getContext("2d"), 
          cancel = this.$refs.cancel.getContext("2d"),
          scrap = this.$refs.cancel.getContext("2d"),
          service = this.$refs.service.getContext("2d"),
          offline = this.$refs.offline.getContext("2d")
      register.beginPath(); register.moveTo(45,60); register.lineTo(100,60); register.lineTo(120,80); register.strokeStyle="#7CCCEF"; register.stroke()
      offline.beginPath(); offline.moveTo(10,120); offline.lineTo(60,120); offline.lineTo(80,150); offline.strokeStyle="#7CCCEF"; offline.stroke()
      install.beginPath(); install.moveTo(190,90); install.lineTo(210,60); install.lineTo(270,60); install.strokeStyle="#7CCCEF"; install.stroke()
      check.beginPath(); check.moveTo(230,130); check.lineTo(250,115); check.lineTo(345,115); check.strokeStyle="#7CCCEF"; check.stroke()
      cancel.beginPath(); cancel.moveTo(220,60); cancel.lineTo(230,75); cancel.lineTo(280,75); cancel.strokeStyle="#7CCCEF"; cancel.stroke()
      scrap.beginPath(); scrap.moveTo(160,90); scrap.lineTo(170,115); scrap.lineTo(230,115); scrap.strokeStyle="#7CCCEF"; scrap.stroke()
      service.beginPath(); service.moveTo(90,60); service.lineTo(70,80); service.lineTo(20,80); service.strokeStyle="#7CCCEF"; service.stroke()
    },
  },
  components: {}
};
</script>

<style scoped lang="stylus">
  @import '~styles/variable'
  .label
    position relative
    font-size $font-smaller
    p
      position absolute
    .register
      top 40px
      left 53px
    .install
      top 40px
      left 214px
    .check
      top 96px
      left 256px
    .cancel
      top 205px
      left 245px
    .scrap
      top 245px
      left 190px
    .service
      top 210px
      left 27px
    .offline
      top 98px
      left 18px
    canvas 
      position absolute
      left 0
    .canvas-position
      top 150px
  .cirque
    position relative
    top 30px
    left 30px
    width 250px
    height 250px

</style>
