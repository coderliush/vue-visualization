<template>
  <div class="business" ref="business">
    <div class="title">
      <span class="dot"></span>
      <span>运营异常检索（异常占比）</span>
      <span class="active">2018-12-13</span>
      <span>设备总计</span>
      <span class="active">XXX</span>
    </div>

    <div class="map-wrapper">
      <!-- <div class="left"><board v-for="(item, index) in boardLeft" :key="index" :content="item" class="board"></board></div> -->
      <div class="group">
        <div class="item">
          <board v-show="selectLength === 1" ref='board1' :content="{name: '省公司', num: board1Num}" class="board"></board>
          <cirque v-show="selectLength >= 2"></cirque>
        </div>
        <div class="item">
          <board v-show="selectLength <= 2" ref="board2" :content="{name: '城市公司', num: board2Num}" class="board"></board>
          <cirque v-show="selectLength >= 3"></cirque>
        </div>
        <div class="item">
          <board v-show="selectLength <= 3" ref="board3" :content="{name: '分公司', num: board3Num}" class="board"></board>
          <cirque v-show="selectLength >= 4"></cirque>
        </div>
      </div>
      <b-map class="map" ref="map" @nodechange="nodechange" />
      <!-- <div class="group"><board v-for="(item, index) in boardRight" :key="index" :content="item" class="board"></board></div> -->
      <div class="group">
        <div class="item">
          <board v-show="selectLength <= 4" ref="board4" :content="{name: '服务中心', num: board4Num}" class="board"></board>
          <cirque v-show="selectLength >= 5"></cirque>
        </div>
        <div class="item">
          <board v-show="selectLength <= 5" ref="board5" :content="{name: '小区', num: board5Num}" class="board"></board>
          <cirque v-show="selectLength >= 6"></cirque>
        </div>
        <div class="item">
          <board v-show="selectLength <= 6" ref="board6" :content="{name: '单元', num: board6Num}" class="board"></board>
          <cirque v-show="selectLength === 7"></cirque>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Cirque from 'components/cirque'
import Board from 'components/business-board'
import BMap from 'components/map'
import {computedPercent} from 'utils/computedPercent'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'app',
  data() {
    return {
      selectLength: 1,   // select 个数
      board1Num: null, board2Num: null, board3Num: null, board4Num: null, board5Num: null, board6Num: null,
      boardLeft: {
        provice: {
          num: '1000',
          name: '省公司'
        },
        city: {
          num: '1000',
          name: '城市公司'
        },
        company: {
          num: '10000',
          name: '分公司'
        },
      },
      boardRight: {
        servicesCenter: {
          num: '100000',
          name: '服务中心'
        },
        village: {
          num: '100000',
          name: '小区'
        },
        unit: {
          num: '100000',
          name: '单元'
        },
      },
      update: false
    }
  },
  watch: {
    params: {                  
      handler: async function(val) {
        const res = await this.$http.post('/dmp/api/LockHistory/CountLockUnWorksHistory', val)
        console.log('res', res)
      },
      deep: true
    },
    deviceNumLength() {       // 当前选择select 长度 和总数num   
      this.selectLength = this.deviceNumLength.selectLength
      let variable = `board${this.selectLength}Num`
      this[variable] = this.deviceNumLength.num
    }
  },
  computed: {
    ...mapGetters([
      'params',
      'deviceNumLength'
    ])
  },
  mounted(){
    setInterval(()=>{
      if(this.cachenode) this.nodechange(this.cachenode,true);
      },5000);
    this.getconfig = this.$http.get('dmp/api/Config');
    this.getconfig.then(config=>{
      this.config = config;
    });

  },
  destroyed(){
    window.onresize=null;
    // document.body.style.overflowY = 'auto';
  },
  methods:{
    // async nodechange(nodedata,isInterval){
    //   if(!isInterval) this.cachenode = nodedata;//缓存当前节点
    //   this.Flush(nodedata,isInterval);
    //   var httpresults = await this.$http.awaitTasks([
    //     this.$http.post('dmp/api/Cmbox/Status', nodedata),
    //     this.$http.post('dmp/api/Meterbox/Status', nodedata),
    //     this.$http.post('dmp/api/Lock/Status', nodedata),
    //   ])
    //   computedPercent(httpresults);
    //   if(!this.config) await this.getconfig;
    //   let data = {
    //     cmbox: httpresults[0],
    //     meterbox: httpresults[1],
    //     lock: httpresults[2],
    //     warnPercent: this.config.warnPercent * 100
    //   }
    //   // if(this.cachedata){
    //   //   if(JSON.stringify(this.cachedata)==JSON.stringify(this.data)) return;
    //   // }
    //   this.cachedata = data;
    //   this.$refs.map.deviceCount = httpresults[0].onlineNums+ httpresults[1].onlineNums+httpresults[2].onlineNums
    //   +httpresults[0].offlineNums+ httpresults[1].offlineNums+httpresults[2].offlineNums;
    //   // this.$refs.progress.flush(data)      //  进度条注释
    //   // this.$refs.left.flush(data)          //  圆环注释
    // },
    async nodechange(nodedata,isInterval){
      this.setNodeData(nodedata)                // 存储当前节点
      if(!isInterval) this.cachenode = nodedata;//缓存当前节点
      this.Flush(nodedata,isInterval);
      if(!this.config) await this.getconfig;
    },
    async Flush(nodedata,isInterval){
      var httpresult = await this.$http.post('dmp/api/Map/TotalCount', nodedata);
      if(this.cachenode!=nodedata) return;//节点改变
      if(this.$refs.map.getNum(0)!=httpresult.lockRecord||this.$refs.map.getNum(1)!=httpresult.chargeCount
      ||this.$refs.map.getNum(2)!=httpresult.chargeSum||this.$refs.map.getNum(3)!=httpresult.consumSum){
        if(isInterval) this.update = !this.update;
      }
      this.$refs.map.setTabNum(0,httpresult.lockRecord);
      this.$refs.map.setTabNum(1,httpresult.chargeCount);
      this.$refs.map.setTabNum(2,httpresult.chargeSum);
      this.$refs.map.setTabNum(3,httpresult.consumSum);
      // this.$refs.map.mapArr[0].num= httpresult.lockRecord;
      // this.$refs.map.mapArr[1].num= httpresult.chargeCount;
    },
    ...mapMutations({
      setNodeData: 'SET_NODE_DATA'
    })
  },
  components: {
    Cirque,
    Board,
    BMap,
  }
}
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .business
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
    .map-wrapper
      display flex
      min-height 892px
      .group
        width 336px
        padding 20px 0
        .item
          width 100%
          padding 4px 10px
          text-align center
        // .map
        //   flex 1
</style>






