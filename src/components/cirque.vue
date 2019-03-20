<template>
  <div id="cirque" style="width: 400px;height: 400px;"></div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "cirque",
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const echarts = require("echarts")
      const chart = echarts.init(document.getElementById("cirque"))

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
            radius: [122, 180],

            animation: false
          }
        ],
      }
      chart.setOption(option)
    }
  },
  components: {}
};
</script>

<style scoped lang="stylus">

</style>
