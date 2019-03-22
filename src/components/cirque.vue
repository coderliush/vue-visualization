<template>
  <div class="cirque-wrapper">
    <div class="label">
      <p>未注册1</p>
      <canvas ref="register"></canvas>
    </div>
    <div ref="cirque" class="cirque"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "cirque",
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
      let register = this.$refs.register.getContext("2d")
      register.beginPath()
      register.moveTo(40,40)
      register.lineTo(100,40)
      register.lineTo(120,100)
      register.strokeStyle="#7CCCEF"
      register.stroke()
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
      top 18px
      left 40px
    canvas 
      position absolute
      left 0
  .cirque
    width 300px
    height 300px

</style>
