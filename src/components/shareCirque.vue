<template>
  <div class="cirque-wrapper">
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
  },
  watch: {
    cirqueData() {
      for (let k in this.cirqueData) {
        // 当总数为0时，设置总数为1.不然会导致0%占比50%
        // if (this.cirqueData.total === 0) {this.cirqueData.total = 1}
        if (k.indexOf('Percent') == '-1') {
          // 如果占比为0， 显示的value 为0，另一块为总户数
          // 如果占比小于1%，展示的value 为十分之一。
          // 占比大于1%，正常展示。
          if (this.cirqueData[k + 'Percent'] === '0%') {
            this.cirqueData['show' + k] = 0
            this.cirqueData['show' + k + 'other'] = this.cirqueData.total 
          } else if (this.cirqueData[k + 'Percent'] < '1%' ) {
            this.cirqueData['show' + k] = this.cirqueData.total * 0.1
            this.cirqueData['show' + k + 'other'] = this.cirqueData.total * 0.9
          } else {
            this.cirqueData['show' + k] = this.cirqueData[k]
            this.cirqueData['show' + k + 'other'] = this.cirqueData.total - this.cirqueData[k]
          }

          // 占比为0，selected 为true，label与圆环有个间隔，去掉这个间隔
          if (this.cirqueData.unInstallsPercent === '0%') {this.cirqueData.select1 = false} else { this.cirqueData.select1 = true }
          if (this.cirqueData.unAcceptsPercent === '0%') {this.cirqueData.select2 = false} else { this.cirqueData.select2 = true }
          if (this.cirqueData.repairsPercent === '0%') {this.cirqueData.select3 = false} else { this.cirqueData.select3 = true }
          if (this.cirqueData.cancelsPercent === '0%') {this.cirqueData.select4 = false} else { this.cirqueData.select4 = true }
        } 
      }
      this.init(this.cirqueData)
    }
  },
  data() {
    return {
      colorActive: '#B3E1F4', // 文字亮色
      select1: true,
      select2: true,
      select3: true,
      select4: true,
      color: {
        normalColor: '#2C6D8E',
        unInstall: '#1FADFF',
        unAccept: '#E6644E',
        repair: '#FDAE0B',
        cancel: '#A36337'
      }
    }
  },
  mounted() {
    // 初始化默认的数据
    const data = {
      realNum: null,
      showunInstalls: 3,
      showunInstallsother: 7,
      showunAccepts: 3,
      showunAcceptsother: 7,
      showrepairs: 3,
      showrepairsother: 7,
      showcancels: 3,
      showcancelsother: 7,
      unInstallsPercent: '30%',
      unAcceptsPercent: '70%',
      repairsPercent: '30%',
      cancelsPercent: '70%',
      select1: true,
      select2: true,
      select3: true,
      select4: true,
    }
    this.init(data)
  },
  methods: {
    init(obj) {
      const echarts = require("echarts")
      const chart = echarts.init(this.$refs.cirque)
      const option = {
        graphic: {
          elements: [{
            type: 'text',
            style: {
              text: '',
              stroke: '#B3E1F4',
              // fontSize: 14,
              fill: '#67B2DA',
              font: 'bold 14px "Microsoft YaHei", sans-serif',
            },
            left: 'center',
            top: 'center'
          }]
        },
        series: [
          {
            name:'name',
            type:'pie',
            radius: ['30%', '45%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#103045'
            },
            labelLine: {
              lineStyle: {
                color: '#61A7C7'
              }
            },
            label: {
              formatter: function (params) {
                return `{c|${params.data.name} ${params.data.percent}}\n{hr|}\n{d|${params.data.realNum}}`
              },
              rich: {
                b: {
                  fontSize: 12,
                  color: '#C5F6FF',
                  align: 'center',
                  padding: 4
                },
                hr: {
                  borderColor: '#33637D',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                d: {
                  fontSize: 12,
                  color: '#C5F6FF',
                  align: 'center',
                  padding: 4
                },
                c: {
                  fontSize: 12,
                  color: '#C5F6FF',
                  align: 'center',
                  padding: 4
                }
              }
            },
            data:[
              {
                name: '未安装',
                realNum: obj.unInstalls,           // 显示 label 真实数量 
                percent: obj.unInstallsPercent,    // 显示 label 百分比 
                value: obj.showunInstalls,         // echars 画图占比的依据
                selected: obj.select1,                        // 是否选中: 数量为0， 不选中。
                itemStyle: {
                  normal: {
                    color: this.color.unInstall
                  }
                },
              },
              {
                value: obj.showunInstallsother, 
                label: {show: false},
                labelLine: {show: false,length: 0,length2: 0},
                itemStyle: {
                  normal: {
                    color: this.color.normalColor,
                  }
                },
              },
              {
                name: '未验收',
                realNum: obj.unAccepts,
                percent: obj.unAcceptsPercent,
                value: obj.showunAccepts,
                selected: obj.select2,
                itemStyle: {
                  normal: {
                    color: this.color.unAccept
                  }
                },
                labelLine: {
                  show: true,
                  length: 0,
                  length2: 0
                }
              },
              {
                value: obj.showunAcceptsother, 
                label: {show: false},
                labelLine: {show: false,length: 0,length2: 0},
                itemStyle: {
                  normal: {
                    color: this.color.normalColor
                  }
                }
              },
              {
                name: '智能维修',
                realNum: obj.repairs,
                percent: obj.repairsPercent,
                value: obj.showrepairs,
                selected: obj.select3,
                itemStyle: {
                  normal: {
                    color: this.color.repair
                  }
                }
              },
              {
                value: obj.showrepairsother, 
                label: {show: false},
                labelLine: {show: false,length: 0,length2: 0},
                itemStyle: {
                  normal: {
                    color: this.color.normalColor
                  }
                }
              },
              {
                name: '解绑',
                realNum: obj.cancels,
                percent: obj.cancelsPercent,
                value: obj.showcancels,
                selected: obj.select4,
                itemStyle: {
                  normal: {
                    color: this.color.cancel
                  }
                },
                labelLine: {
                  show: true,
                  length: 0,
                  length2: 0
                }
              },
              {
                value: obj.showcancelsother, 
                label: {show: false},
                labelLine: {show: false,length: 0,length2: 0},
                itemStyle: {
                  normal: {
                    color: this.color.normalColor
                  }
                }
              },
            ]
          }
        ]
      };

      option.graphic.elements[0].style.text = this.graphic
      chart.setOption(option)
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
    div
      position absolute
      p:nth-of-type(1)
        margin-bottom 6px
    .register
      top 122px
      left -4px
    .install
      top 42px
      left 193px
    .check
      top 96px
      left 256px
    .unAccept
      top 207px
      left 245px
    .scrap
      top 245px
      left 190px
    .install
      top 212px
      left 4px
    .offline
      top 98px
      left 18px
  .cirque
    position relative
    top 30px
    width 250px
    height 250px
</style>
