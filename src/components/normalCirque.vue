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
    value: {
      type: Number
    },
  },
  watch: {
    value() {   //value: 0 全部 1: 已安装，2：未安装。
      let value, percent, otherValue, otherPercent;  // value，percent: 圆环数据第一项。  otherValue, otherPercent：圆环数据第二项
      if (this.value === 0) {
        this.list = [{
          value: 1,
          percent: '',
          itemStyle: { color: this.color }
        }]
      } else if (this.value === 1) { 
        value = this.cirqueInfo.trueStatusNums
        percent = this.cirqueInfo.trueStatusNumsPercent
        otherValue = this.cirqueInfo.falseStatusNums
        otherPercent = this.cirqueInfo.falseStatusNumsPercent
      } else if (this.value === 2) {
        value = this.cirqueInfo.falseStatusNums,
        percent = this.cirqueInfo.falseStatusNumsPercent
        otherValue = this.cirqueInfo.trueStatusNums
        otherPercent = this.cirqueInfo.trueStatusNumsPercent
      } 

      // 设置最小圆环比例 1/10 
      if (percent < '1%' && percent !== '0%') { value = 1, otherValue = 10 } 
      if (otherPercent < '1%' && otherPercent !== '0%') { otherValue = 1, value = 10 } 

      if (value === 0) { // 如果值为0, data数据一项。 如果不为0, data两项。 
        this.list = [{
          value: 1,
          percent: '',
          itemStyle: { color: this.color }
        }]
      } else if (value > 0) {
        this.list = [{
          value: value,
          percent: percent,
          itemStyle: { color: this.cirqueInfo.color }
        }, {
          value: otherValue,
          percent: otherPercent,
          label:{ show: false },
          itemStyle: { color: this.color,  }
        }]
      }

      this.init()
    }
  },
  data() {
    return {
      name: null,
      num: null,
      color: '#2D6D90', // 圆环基色
      list: [{
        value: 1,
        percent: '',
        itemStyle: { color: '#2D6D90' }
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
            radius: ['70%', '100%'],  // [内圆环半径, 外圆半径]
            startAngle: 56.5,
            data: this.list,
            itemStyle: {borderWidth: 0},
            label: {
              position: "inside",
              rotate: 'tangential',
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
    width 120px
    height 120px

</style>
