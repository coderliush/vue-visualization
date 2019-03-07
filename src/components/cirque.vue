<template>
  <div id="cirque" style="width: 400px;height: 400px;"></div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
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
            data: [
              {
                name: "北京",
                value: 20
              },
              {
                name: "天津",
                value: 20
              },
              {
                name: "上海",
                value: 20
              },
              {
                name: "美国",
                value: 20
              },
              {
                name: "法国",
                value: 20
              }
            ],
            label: {
              position: "inside"
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
