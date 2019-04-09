<template>
  <div>
    <div ref="cirque" class="cirque"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "cirque",
  props: {
    cirqueInfo: {
      type: Object,
    },
    isSecond: {
      type: Boolean
    }
  },
  watch: {
    isSecond() {
      if (this.isSecond === true) {
        this.list = [{
          value: this.cirqueInfo.falseStatusNums,
          percent: this.cirqueInfo.falseStatusNumsPercent
        }, {
          value: this.cirqueInfo.trueStatusNums,
          percent: this.cirqueInfo.trueStatusNumsPercent,
          label: {show: false}
        }]
      } else {
        this.list = [{
          value: 0,
          percent: '',
          label: {show: false}
        }]
      }

      this.init()
    },
  },
  data() {
    return {
      name: null,
      num: null,
      list: [{                 // value 值表示圆环占的百分比面积
        value: 0,
        percent: '',
        label: {show: false}
      }]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const echarts = require("echarts")
      const chart = echarts.init(this.$refs.cirque)
      let color
      if (this.isSecond) {
        color = [this.cirqueInfo.color, '#2D6D90']
      } else {
        color = ['#2D6D90']
      }
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
            type: "pie",
            radius: ['70%', '100%'],  // [内圆环半径, 外圆半径]
            color: color,
            data: this.list,
            label: {
              position: "inside",
              color: '#000',
              fontWeight: 'bold',
              formatter: (params) => {
                return params.data.percent
              }
            },
            animation: false
          }
        ],
      }
      option.graphic.elements[0].style.text = this.name
      chart.setOption(option)
    },
  },
  components: {}
};
</script>

<style scoped lang="stylus">
  @import '~styles/variable'
  .cirque
    width 150px
    height 150px

</style>
