<template>
  <div class="business" ref="business">
    <div class="title">
      <span class="dot"></span>
      <span>运营异常检索（异常占比）</span>
      <span class="active">{{querytime}}</span>
      <span>设备总计</span>
      <span class="active">{{total | splitNum}}</span>
    </div>

    <div class="map-wrapper">
      <div class="group">
        <div class="item" v-for="(item, index) in boardList.slice(0, 3)" :key="index">
          <!-- selectLength 小于等于 索引 index 的时候，显示board。 -->
          <!-- selectLength 等于当前的索引 index 加2时，显示circle。selectLength 大于 index 时, 显示到下级的 circle，本级同样显示。 -->
          <!-- cirqueData 为参数改变, circle 的数据。当 selectLength === index + 2 时, 只渲染对应的 circle。 -->
          <board v-show="selectLength <= index + 1" :ref="item.ref" :content="{name: item.name, num: item.num}" class="board"></board>
          <cirque :graphic="item.name" v-show="selectLength >= index + 2" :cirqueData="cirqueData" :isUpdate="selectLength === index + 2 ? true : false"></cirque>
        </div>
      </div>
      <b-map class="map" ref="map" :date="date" @nodechange="nodechange" />
      <div class="group">
        <div class="item" v-for="(item, index) in boardList.slice(3)" :key="index">
          <board v-show="selectLength <= index + 4" :ref="item.ref" :content="{name: item.name, num: item.num}" class="board"></board>
          <cirque :graphic="item.name" v-show="selectLength >= index + 5" :cirqueData="cirqueData" :isUpdate="selectLength === index + 5 ? true : false"></cirque>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Cirque from 'components/shareCirque'
import Board from 'components/business-board'
import BMap from 'components/map'
import objAddPercent from 'utils/objAddPercent'
import {mapGetters, mapMutations} from 'vuex'
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

export default {
  name: 'app',
  data() {
    return {
      total: null,
      selectLength: null,   // select 个数
      cirqueData: null,
      date :null,//当前时间
      update: false,
      boardList: [{
        ref: 'board1',
        name: '省公司',
        num: null,
      }, {
        ref: 'board2',
        name: '城市公司',
        num: null,
      }, {
        ref: 'board3',
        name: '分公司',
        num: null,
      }, {
        ref: 'board4',
        name: '服务中心',
        num: null,
      }, {
        ref: 'board5',
        name: '小区',
        num: null,
      }, {
        ref: 'board6',
        name: '单元',
        num: null,
      }]
    }
  },
  watch: {
    params: {                  
      async handler (val) {
        const res = await this.$http.post('/dmp/api/LockHistory/CountLockUnWorksHistory', val)
        this.cirqueData = objAddPercent(res)
      },
      deep: true
    },
    'params.querytime'(v) {
      var isreal = new Date()<v;//是否是实时
      if(isreal) this.date = null;
      else this.date = v;
      if(this.$real==isreal) return;
      if(isreal){
        this.$Interval = setInterval(()=>{
          if(this.cachenode) this.nodechange(this.cachenode,true);
        },5000);
      }
      else window.clearInterval(this.$Interval);
      this.$real = isreal;
    },
    deviceNumLength() {       // 当前选择select 长度 和总数num。环形赋值总数
      this.selectLength = this.deviceNumLength.selectLength
      if (this.selectLength <= 5) {
        this.boardList[this.selectLength - 1].num = this.deviceNumLength.num
      }
    }
  },
  computed: {
    ...mapGetters([
      'params',
      'deviceNumLength',
      'querytime'
    ])
  },
  mounted(){
    this.$Interval = setInterval(()=>{
      if(this.cachenode) this.nodechange(this.cachenode,true);
      },5000);
    this.getconfig = this.$http.get('dmp/api/Config');
    this.getconfig.then(config=>{
      this.config = config;
    });

    this.$bus.$on('totalDevice', (total) => {
      this.total = total
    })
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
      if(this.date)
        nodedata.time = this.date;
      else
        nodedata.time = null;
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






