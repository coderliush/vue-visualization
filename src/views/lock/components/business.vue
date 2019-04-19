<template>
  <div class="business" ref="business">
    <div class="title">
      <span class="dot"></span>
      <span>运营异常检索（异常占比）</span>
      <span class="active">{{querytime}}</span>
      <span>设备总计</span>
      <span class="active">{{total | splitNum}}</span>
    </div>

    <div class="switch-wrapper">
      <div class="switch">
        <div class="tab1" @click="tab1" :class="isActive ? 'active' : null"><p>运营</p></div>
        <div class="tab2" @click="tab2" :class="!isActive ? 'active' : null"><p>行政区</p></div>
      </div>
      <div class="input-wrapper">
        <i class="el-icon-search"></i>
        <el-input v-model="inputValue" class="input" type="text" placeholder="请输入单元地址"></el-input>
        <el-button>搜索</el-button>
      </div>
    </div>

    <div class="map-wrapper">
      <div class="group">
        <!-- <div class="item" v-for="(item, index) in districtList" :key="item.name" v-show="!isActive">
          <board v-show="districtSelectLength <= index + 1" :content="{name: item.name, num: item.num}" class="board"></board>
          <cirque :graphic="item.name" v-show="districtSelectLength >= index + 2" :cirqueData="disCirqueList[index]"></cirque>
        </div> -->
        <div class="item" v-for="(item, index) in boardList.slice(0, 3)" :key="index" v-show="isActive">
          <!-- orgSelectLength 小于等于 索引 index 的时候，显示board。 -->
          <!-- orgSelectLength 等于当前的索引 index 加2时，显示circle。orgSelectLength 大于 index 时, 显示到下级的 circle，本级同样显示。 -->
          <!-- cirqueData 为参数改变, circle 的数据。当 orgSelectLength === index + 2 时, 只渲染对应的 circle。 -->
          <board v-show="orgSelectLength <= index + 1" :content="{name: item.name, num: item.num}" class="board"></board>
          <cirque :graphic="item.name" v-show="orgSelectLength >= index + 2" :cirqueData="cirqueList[index]"></cirque>
        </div>
      </div>
      <b-map class="map" ref="map" :date="date" @nodechange="nodechange" :clickType="clickType" />
      <div class="group">
        <div class="item" v-for="(item, index) in boardList.slice(3)" :key="index" v-show="isActive">
          <board v-show="orgSelectLength <= index + 4" :content="{name: item.name, num: item.num}" class="board"></board>
          <cirque :graphic="item.name" v-show="orgSelectLength >= index + 5" :cirqueData="cirqueList[index + 3]"></cirque>
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
      clickType: '',
      inputValue: '',
      isActive: true,   // 默认组织架构
      total: null,
      orgSelectLength: null,   // 组织架构 select 个数
      districtSelectLength: null, // 行政区 select 个数
      cirqueList: [],
      disCirqueList: [],
      date :null,//当前时间
      update: false,
      districtList: [{
        name: '行政区1', 
        num: null
      }, {
        name: '行政区2', 
        num: null
      }, {
        name: '行政区3',
        num: null
      }],
      boardList: [{
        name: '省公司',
        num: null,
      }, {
        name: '城市公司',
        num: null,
      }, {
        name: '分公司',
        num: null,
      }, {
        name: '服务中心',
        num: null,
      }, {
        name: '小区',
        num: null,
      }, {
        name: '单元',
        num: null,
      }]
    }
  },
  watch: {
    params: {                  
      async handler(query) {
        const res = await this.$http.post('/dmp/api/LockHistory/CountLockUnWorksHistory', query);      
        if (this.isActive) {
          let cirqueIndex = this.orgSelectLength - 2
          this.cirqueList.splice(cirqueIndex, 1, objAddPercent(res)) // 6 个圆环数据的数组
        } else {     
          let cirqueIndex = this.districtSelectLength - 2
          this.disCirqueList.splice(cirqueIndex, 1, objAddPercent(res)) // 行政区圆环数据的数组      
        }
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
    numLength: {       // 当前选择select 长度 和总数num。环形赋值总数
      handler() {
        if (this.isActive) {
          this.orgSelectLength = this.numLength.org.selectLength
          if (this.orgSelectLength !== 7) { // boardList 索引为0 -> 5
            this.boardList[this.orgSelectLength - 1].num = this.numLength.org.num
          }
        } else {
          this.districtSelectLength = this.numLength.district.selectLength
          this.districtList[this.districtSelectLength - 1].num = this.numLength.district.num
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'params',
      'numLength',
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
    tab1() {
      this.isActive = true
      this.clickType = 'tab1'
    },
    tab2() {
      this.isActive = false
      this.clickType = 'tab2'
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
    .switch-wrapper
      display flex
      padding-right 50px
      justify-content space-between
      .input-wrapper 
        display flex
        .el-input__inner
          padding-left 20px
        .el-icon-search:before
          position relative
          top 10px
          left 26px
          z-index 9
        button 
          background $bg-active
          color $color-normal
          border none
          border-radius none
      .switch
        display flex
        .tab1.active 
          color #fff
          background url('../../../assets/tab1-active.png') no-repeat
        .tab2.active 
          color #fff
          background url('../../../assets/tab2-active.png') no-repeat
        .tab1 
          width 138px
          display flex
          position relative
          left 26px
          align-items center
          cursor pointer
          background url('../../../assets/tab1.png') no-repeat
          p
            padding: 0px 0 6px 47px
        .tab2
          position relative
          left -7px
          width 350px
          cursor pointer
          background url('../../../assets/tab2.png') no-repeat, url('../../../assets/tab2-active.png') no-repeat
          p 
            margin-top 9px
            text-align center

    .map-wrapper
      display flex
      min-height 892px
      .group
        width 250px
        padding 20px 0
        .item
          width 100%
          padding 4px 10px
          text-align center
    .map
      flex 1
</style>






