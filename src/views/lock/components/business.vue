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
      <div class="right"><board v-for="(item, index) in boardRight" :key="index" :content="item" class="board"></board></div>
      <b-map class="map" ref="map" @nodechange="nodechange" />
      <div class="right"><board v-for="(item, index) in boardRight" :key="index" :content="item" class="board"></board></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Cirque from 'components/cirque'
import Board from 'components/business-board'
import BMap from 'components/map'
import {computedPercent} from 'utils/computedPercent'
export default {
  name: 'app',
  data() {
    return {
      componentName: 'Cirque',
      left: {
        provice: {
          num: '10',
          name: '省公司'
        },
        city: {
          num: '10',
          name: '城市公司'
        },
        company: {
          num: '10',
          name: '分公司'
        },
      },
      boardRight: {
        servicesCenter: {
          num: '10',
          name: '服务中心'
        },
        village: {
          num: '10',
          name: '小区'
        },
        unit: {
          num: '10',
          name: '单元'
        },
      },
      update: false
    }
  },
  mounted(){
    setInterval(()=>{
      if(this.cachenode) this.nodechange(this.cachenode,true);
      },5000);
    // setInterval(()=>{
    //   if(this.cachenode) this.Flush(this.cachenode);
    //   },5000);
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
    async nodechange(nodedata,isInterval){
      if(!isInterval) this.cachenode = nodedata;//缓存当前节点
      this.Flush(nodedata,isInterval);
      var httpresults = await this.$http.awaitTasks([
        this.$http.post('dmp/api/Cmbox/Status', nodedata),
        this.$http.post('dmp/api/Meterbox/Status', nodedata),
        this.$http.post('dmp/api/Lock/Status', nodedata),
      ])
      computedPercent(httpresults);
      if(!this.config) await this.getconfig;
      let data = {
        cmbox: httpresults[0],
        meterbox: httpresults[1],
        lock: httpresults[2],
        warnPercent: this.config.warnPercent * 100
      }
      // if(this.cachedata){
      //   if(JSON.stringify(this.cachedata)==JSON.stringify(this.data)) return;
      // }
      this.cachedata = data;
      this.$refs.map.deviceCount = httpresults[0].onlineNums+ httpresults[1].onlineNums+httpresults[2].onlineNums
      +httpresults[0].offlineNums+ httpresults[1].offlineNums+httpresults[2].offlineNums;
      // this.$refs.progress.flush(data)      //  进度条注释
      // this.$refs.left.flush(data)          //  圆环注释
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
    }
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
      .left, .right
        float left
        padding 60px 100px 0 100px 
        .board
          height 33.33%
      .map
        flex 1
</style>






