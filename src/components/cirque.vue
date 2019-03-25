<template>
  <div class="cirque-wrapper">
    <div class="label">
      <p class="register">未注册1</p>
      <p class="install">未安装1</p>
      <p class="check">未验收1</p>
      <p class="cancel">注销1</p>
      <p class="scrap">报废1</p>
      <p class="service">维修1</p>
      <p class="offline">离线1</p>
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
    graphic: {
      type: Array
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.initLabel()
    this.init();
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
              text: '555',
              width: 20,
              height: 20
              },
            left: 'center',
            top: 'center'
          }]
        },
        series: [
          {
            type: "pie",
            color: ['#7ABC12', '#1DA8FB', '#E7654B', '#979994', '#A26337', '#FDAE0B', '#FF67BB'],
            data: [{
                name: "",
                value: 14.28
              },
              {
                name: "",
                value: 14.28
              },
              {
                name: "",
                value: 14.28
              },
              {
                name: "",
                value: 14.28
              },
              {
                name: "",
                value: 14.28
              },
              {
                name: "",
                value: 14.28
              },
              {
                name: "",
                value: 14.28
              }],
            label: {
              position: "inside",
              formatter: '{d}'
            },
            radius: ['40%', '67%'],
            animation: false
          }
        ],
      }
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
      register.beginPath(); register.moveTo(40,50); register.lineTo(100,50); register.lineTo(120,60); register.strokeStyle="#7CCCEF"; register.stroke()
      offline.beginPath(); offline.moveTo(0,110); offline.lineTo(40,110); offline.lineTo(80,140); offline.strokeStyle="#7CCCEF"; offline.stroke()
      install.beginPath(); install.moveTo(190,60); install.lineTo(210,50); install.lineTo(270,50); install.strokeStyle="#7CCCEF"; install.stroke()
      check.beginPath(); check.moveTo(240,120); check.lineTo(260,110); check.lineTo(340,110); check.strokeStyle="#7CCCEF"; check.stroke()
      cancel.beginPath(); cancel.moveTo(220,60); cancel.lineTo(240,80); cancel.lineTo(340,80); cancel.strokeStyle="#7CCCEF"; cancel.stroke()
      scrap.beginPath(); scrap.moveTo(160,100); scrap.lineTo(180,120); scrap.lineTo(240,120); scrap.strokeStyle="#7CCCEF"; scrap.stroke()
      service.beginPath(); service.moveTo(80,60); service.lineTo(60,80); service.lineTo(0,80); service.strokeStyle="#7CCCEF"; service.stroke()
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
      top 28px
      left 53px
    .install
      top 28px
      left 214px
    .check
      top 88px
      left 256px
    .cancel
      top 210px
      left 245px
    .scrap
      top 250px
      left 185px
    .service
      top 211px
      left 7px
    .offline
      top 92px
      left 6px
    canvas 
      position absolute
      left 0
    .canvas-position
      top 150px
  .cirque
    width 300px
    height 300px

</style>
