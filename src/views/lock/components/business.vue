<template>
  <div class="business" ref="business">
    <div class="board-wrapper">
      <board></board>
    </div>
    <b-map class="map" ref="map" @nodechange="nodechange" />
  </div>
</template>

<script type="text/ecmascript-6">
import Board from 'components/business-board'
import BMap from 'components/map'
import {computedPercent} from 'utils/computedPercent'
export default {
  name: 'app',
  data() {
    return {
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
    Board,
    BMap,
  }
}
</script>

<style scoped lang="stylus">

</style>






