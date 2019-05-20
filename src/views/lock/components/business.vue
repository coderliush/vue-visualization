<template>
  <div class="business" ref="business">
    <div class="title">
      <span class="dot"></span>
      <span>区域检索</span>
      <span class="active">{{querytime}}</span>
    </div>

    <div class="switch-wrapper">
      <div class="switch">
        <div class="tab1" @click="onOrg" :class="isOrg ? 'active' : null"><p>运营</p></div>
        <div class="tab2" @click="onDistrict" :class="isDistrict ? 'active' : null"><p>行政区</p></div>
        <div class="tab3" @click="onAddress" :class="isAddress ? 'active' : null"><p>按单元地址搜索</p></div>
      </div>
    </div>

    <div class="map-wrapper">
      <div class="group">
        <div class="item" v-for="(item, index) in boardList.slice(0, 3)" :key="index" v-show="isOrg">
          <board v-show="orgSelectLength <= index + 1" :content="{name: item.name, num: item.num}" class="board"></board>
          <cirque :graphic="item.name" v-show="orgSelectLength >= index + 2" :cirqueData="cirqueList[index]"></cirque>
        </div>
      </div>
      <b-map class="map" ref="map" :date="date" @nodechange="nodechange" @totalNum="totalNum" :tabState="{isOrg, isDistrict, isAddress}" />
      <div class="group">
        <div class="item" v-for="(item, index) in boardList.slice(3)" :key="index" v-show="isOrg">
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
      isOrg: true,
      isDistrict: false,
      isAddress: false,
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
        const res = await this.$http.post('/dmp/api/LockHistory/CountLockUnWorksHistory', query)  // 获取圆环图每个类型的值 
        const total = await this.$http.post('/dmp/api/LockHistory/GetLockCntHistoryByDist', {...query, time: this.params.querytime}) // 计算百分比的总数

        let cirqueIndex = this.orgSelectLength - 2
        this.cirqueList.splice(cirqueIndex, 1, objAddPercent({...res, total})) // 6 个圆环数据的数组
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
        this.orgSelectLength = this.numLength.org.selectLength
        if (this.orgSelectLength !== 7) { // boardList 索引为0 -> 5
          this.boardList[this.orgSelectLength - 1].num = this.numLength.org.num
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
  async mounted(){
    // this.$Interval = setInterval(()=>{
    //   if(this.cachenode) this.nodechange(this.cachenode,true);
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
      // 获取地图对应区域的锁数量
      this.$refs.map.deviceCount = await this.$http.post('/dmp/api/LockHistory/GetLockCountHistory', {
        id: this.params.id,
        type: this.params.type,
        querytime: this.params.querytime,
        devicetype: this.params.devicetype,
        hardversion: this.params.hardversion,
      })

      if(!this.config) await this.getconfig;
    },
    totalNum(total) {
      this.boardList[0].num = total.provinceNums
      this.boardList[1].num = total.cityNums
      this.boardList[2].num = total.areaNums
      this.boardList[3].num = total.serviceNums
      this.boardList[4].num = total.villageNums
      this.boardList[5].num = total.cellNums
    },
    async Flush(nodedata,isInterval){   // 获取地图下边四个总数'充电次数'，'充电度数', '用电度数'
      // if(this.date)
      //   nodedata.time = this.date;
      // else
      //   nodedata.time = null;
      // var httpresult = await this.$http.post('dmp/api/Map/TotalCount', nodedata); // 地图
      // if(this.cachenode!=nodedata) return;//节点改变
      // if(this.$refs.map.getNum(0)!=httpresult.lockRecord||this.$refs.map.getNum(1)!=httpresult.chargeCount
      // ||this.$refs.map.getNum(2)!=httpresult.chargeSum||this.$refs.map.getNum(3)!=httpresult.consumSum){
      //   if(isInterval) this.update = !this.update;
      // }
      // this.$refs.map.setTabNum(0,httpresult.lockRecord);
      // this.$refs.map.setTabNum(1,httpresult.chargeCount);
      // this.$refs.map.setTabNum(2,httpresult.chargeSum);
      // this.$refs.map.setTabNum(3,httpresult.consumSum);
      // this.$refs.map.mapArr[0].num= httpresult.lockRecord;
      // this.$refs.map.mapArr[1].num= httpresult.chargeCount;
    },
    onOrg() {
      this.isOrg = true
      this.isDistrict = false
      this.isAddress = false
      this.$refs.map.tab1()

      this.setActive('org')
    },
    onDistrict() {
      this.isOrg = false
      this.isDistrict = true
      this.isAddress = false
      this.$refs.map.tab2()

      this.setActive('district')
    },
    onAddress() {
      this.isOrg = false
      this.isDistrict = false
      this.isAddress = true
      this.$refs.map.tab3()

      this.setActive('address')
    },
    ...mapMutations({
      setActive: 'SET_ACTIVE'
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
      margin-bottom 20px
      padding-left 20px
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
        font-size $font-small
        div
          padding 10px 41px
          background url('../../../assets/tab.png') no-repeat
          background-size 100% 100%
          cursor pointer
        .active 
          color #fff
          background url('../../../assets/tab-active.png') no-repeat
          background-size 100% 100%
    .map-wrapper
      display flex
      min-height 892px
      .group
        width 236px
        padding 20px 0
        .item
          width 100%
          padding 4px 10px
          text-align center
        // .map
        //   flex 1
</style>






