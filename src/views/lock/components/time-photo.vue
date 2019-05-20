<template>
  <div class="time-photo">
    <div class="row">
      <span class="dot"></span>
      <span>时间快照</span>
      <el-date-picker
        ref="datePicker"
        class="picker"
        v-model="value"
        type="date"
        placeholder="检索时间（默认当下）"
        @change="onChange"
        @focus="onFocus"
      >
      </el-date-picker>
      <span>本部设备异常汇总：</span>
      <span>未安装</span>
      <span class="active">{{nums.length !== 0 ? nums[0].falseStatusNums : null}}</span>
      <span>未验收</span>
      <span class="active">{{nums.length !== 0 ? nums[1].falseStatusNums : null}}</span>
      <span>维修</span>
      <span class="active">{{nums.length !== 0 ? nums[2].trueStatusNums : null}}</span>
      <span>解绑</span>
      <span class="active">{{nums.length !== 0 ? nums[3].trueStatusNums : null}}</span>

      <span>锁总计</span>
      <span class="active">{{total | splitNum}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import moment from "moment"
import Vue from 'vue'
import {mapGetters ,mapMutations} from 'vuex'
export default {
  name: "",
  data() {
    return {
      total: null,
      hideSideBar: false,
      value: '',
      hours: '',
      originX: 183,
      gap: 50.5,
      rap: null,
      nums: [],
    }
  },
  computed: {
    ...mapGetters([
      'ratio',
      'params'
    ])
  },
  methods: {
    onChange(e) {
      // let X
      // if (!this.hideSideBar) {
      //   const hasSideX = 183, hasSideGap = 50.5
      //   X = hasSideX + e.getHours() * hasSideGap
      // } else {
      //   const noSideX = 250, noSideGap = 52
      //   X = noSideX + e.getHours() * noSideGap
      // }
      // this.$refs.tag.style.left = `${X}px`,
      let time = moment(e).add(1,'d').startOf('day')._d
      this.setTime(time)
      this.getNums()
      this.getTotal()
    },
    ...mapMutations({
      setTime: 'SET_TIME'
    }),
    onFocus() {
      // 日期选择版的放大比例
      // this.rap = this.ratio + 0.1
      // Vue.nextTick(()=>{
      //   document.getElementsByClassName('el-picker-panel')[0].style.width = '1200px!imoportant'
      //   document.getElementsByClassName('el-picker-panel')[0].style.transformOrigin = '0 0'
      //   document.getElementsByClassName('el-picker-panel')[0].style.transform = `scale(${this.rap}) translateZ(0)`
      // })
    },
    async getTotal() {  // 获取'锁总计'
      this.total = await this.$http.post('/dmp/api/LockHistory/GetLockCountHistory', {
        id: 0,
        type: 0,
        querytime: this.params.querytime,
      })
    },
    async getNums() {
      const params = {
        id: 0,
        type: 0,
        querytime: this.params.querytime
      }
      this.nums = await this.$http.awaitTasks([
        this.$http.post('/dmp/api/LockHistory/GetUnInstCntHistory', params), // 安装
        this.$http.post('/dmp/api/LockHistory/GetUnAcpCntHistory', params),  // 验收
        this.$http.post('/dmp/api/LockHistory/GetRepairCntHistory', params), // 维修
        this.$http.post('/dmp/api/LockHistory/GetCancelCntHistory', params), // 解绑
      ])  
    }
  },
  async mounted() {
    this.getNums()
    this.getTotal()
    this.$bus.$on('close', () => {
      this.hideSideBar = !this.hideSideBar
    })
  },
  components: {}
};
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .time-photo
    margin-top 4px
    padding 10px
    background $bg-panel
    .row
      display flex
      align-items center
      margin 10px 0
      .dot
        margin-right 10px
        dot($color-active)
      .picker
        margin 0 20px
      .active
        color $color-active
        margin 0 50px 0 6px
      .red-dot
        dot($red)
        border-radius 50%
    .axis
      position relative
      display flex
      img 
        width 86%
        margin 0 auto
      .tag
        position absolute
        top 18px
        left 183px
        display block
        width 10px 
        height 10px
        border 1px dashed $yellow
        transition all 1s
        span
          display block
          dot($yellow)
</style>
