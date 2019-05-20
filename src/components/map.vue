<template>
  <div class="map">
    <div class="main">
      <div class="container">
        <div class="select-wrapper">
          <div class="select1" v-show="isOrg">
            <el-select
              v-for="(orgs,index) in orgselesctoptions"
              :key="index"
              v-model="orgselescts[index]"
              @change="SelectChange(index,orgselescts[index])"
            >
              <el-option
                v-for="(org,j) in orgs"
                :key="j"
                :label="org.name"
                :value="org.id"
              >
              </el-option>
            </el-select>
            <el-select v-if="villageoptions" v-model="villageselect" @change="SelectVillage(villageselect)" >
              <el-option
                  v-for="(village,i) in villageoptions"
                  :key="i"
                  :label="village.name"
                  :value="village.id">
                </el-option>
            </el-select>
            <el-select v-if="celloptions" v-model="cellselect" @change="SelectCell(cellselect)" >
              <el-option
                  v-for="(cell,i) in celloptions"
                  :key="i"
                  :label="cell.address"
                  :value="cell.id">
                </el-option>
            </el-select>
          </div>
          <div class="select2" v-show="isDistrict">
            <el-select
              v-for="(districts,index) in districtselesctoptions"
              :key="index"
              v-model="districtselescts[index]"
              @change="SelectChange(index,districtselescts[index])"
            >
              <el-option
                v-for="(district,j) in districts"
                :key="j"
                :label="district.name"
                :value="district.id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="input-wrapper" v-show="isAddress">
            <i class="el-icon-search"></i>
            <el-input v-model="inputValue" class="input" type="text" placeholder="请输入单元地址" :disabled="disabledInput"></el-input>
            <el-button @click="searchAddress" v-show="!locking">搜索</el-button>
            <el-button class="locking" @click="onLocking" v-show="locking">锁定</el-button>
          </div>
        </div>
        <div class="header-wrapper"> 
          <div class="header">
            <p style="max-width: 334px; margin: 0 auto;position: relative; top: -8px;">{{cityname}}</p>
          </div>
        </div>
        <div class="body" id="bodymap" ref="transformMap">
          <div id="map" v-show="!showtype"></div>
          <div id="mappic" v-show="!showtype"></div>
          <villdgeUnit :type="showtype" :vname="vname" :src="imgurl" v-show="showtype"></villdgeUnit>
        </div>
        <div class="count">
          <p><span>锁数量：</span><span style="color: #0ff">{{deviceCount|splitNum}}</span></p>
          <p><span>房间数 / 单元数：</span><span style="color: #0ff">{{roomcount|splitNum}} / {{cellcount|splitNum}}</span></p>
        </div>
        <!-- <div class="footer">
          <div class="item" v-for="(item, index) in mapArr" :key="index">
            <img :src="item.url" alt>
            <div v-if="item.nums" style="position: relative;">
              <p style="position: relative; z-index: 999; height: 20px;padding-right: 14px; background: #103045;">{{item.name}}</p>
              <div>
                <transition-group name="slide">
                  <p v-for="num in item.nums" :key="num" class="number-active">{{num|splitNum}}</p>
                </transition-group>
              </div>
            </div>
          </div>
        </div> -->
        <div class="shade"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// 房间数单元数：1. 前四级   /dmp/api/Org/MapPointCount， 累加 cell 和是单元数，累加 room 是房间数
//              2. 小区    /dmp/api/GetImage/GetVillage，    房间数 /dmp/api/Cell/RoomCount
//              3. 单元    /dmp/api/GetImage/GetCuc，单元数， 房间数  /dmp/api/Cell/RoomCount
import axios from "axios"
import villdgeUnit from './villdge-unit'
import defaultImg from "../assets/no-pic.jpg"
import {mapMutations, mapGetters} from 'vuex'
export default {
  name: "",
  components: {
    villdgeUnit
  },
  computed: {
    ...mapGetters([
      'numLength',
      'params'
    ])
  },
  filters:{
    splitNum(num){
      if(num===null) return '暂无';
      let str = (num || 0).toString()
      if (str.indexOf('.') === -1) {
        return str.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else {
        return str.substring(0, str.indexOf('.')).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + str.substring(str.indexOf('.'))
      }
    }
  },
  props: {
    date: {
      type:Date,
      default:null
    },
    tabState: {
      type: Object,
      defaul: null
    }
  },
  data() {
    return {
      locking: false,
      disabledInput: false,
      inputValue: null,
      isOrg: true,   // 默认运营
      isDistrict: false,
      isAddress: false,
      orgList: [],  // select 选中的运营名字
      disList: [],  // select 选中的行政区名字
      mapArr: [
        {
          name: '开门次数',
          url: require("../assets/mark1.png"),
          num: 0,
          nums: []
        },
        {
          name: '充电次数',
          url: require("../assets/mark2.png"),
          num: 0,
          nums: []
        },
        {
          name: '充电度数',
          url: require("../assets/mark3.png"),
          num: 0,
          nums: []
        },
        {
          name: '用电度数',
          url: require("../assets/mark4.png"),
          num: 0,
          nums: []
        }
      ],
      options: [{
          value: 0,
          label: '显示地图'
        }, {
          value: 1,
          label: '显示小区'
        }, {
          value: 2,
          label: '显示单元'
        }],
      showtype: 0,//显示类型 0显示地图 1显示小区 2显示单元
      cityname: "",
      orgselescts: [], //组织架构选择的值
      orgselesctoptions: [], //组织架构下拉绑定的列表
      districtselescts: [], //行政区选择的值
      districtselesctoptions: [], //行政区下拉绑定的列表
      villageselect: null,
      villageoptions: null,
      cellselect: null,
      celloptions: null,
      cellcount:null,//公寓总数
      roomcount:null,//房间总数
      deviceCount:null,//设备数
      vname:null,//小区名称
      vpics:null,//小区图片数组
      imgurl:null,//数组第一张
    };
  },
  async mounted() {
    // 地图添加缩放
    this.setRap()
    window.onresize = ()=> {
      this.setRap()
    }


    const getdistrict = this.$http.get(`/dmp/api/Map/Query?time=${this.params.querytime}`);
    const getorg = this.$http.get(`/dmp/api/Org/Query?time=${this.params.querytime}`);
    this.districts = await getdistrict;
    // this.districtselesctoptions.push([{id:0,name:'全部'},...this.districts.filter(d=>{
    //   if(d.name=='上海市'){
    //     return d.parrentid!==0;
    //   }
    //   return d.parrentid===0;
    // })]);
    // this.districtselescts.push(0);
    this.orgs = await getorg;
    this.init();
   
    // document.getElementById("#map").omo = e =>{
    //    var mouseoverEvent = new Event('mouseover');
    //    this.myChart.dispatchEvent(myEvent);
    // }
    // document.getElementById("#map").onmouseover = e =>{
    //    var mouseoverEvent = new Event('mouseover');
    //    this.myChart.dispatchEvent(myEvent);
    // }
    //this.SelectChange(0,0);
    // setTimeout(() => this.init(), 300);
  },
  methods: {
    setRap(){
      var transformMap = this.$refs.transformMap;
      var rap = document.body.clientWidth / 1903 || 1
      transformMap.style.transformOrigin = '0 0'
      transformMap.style.transform =  `scale(${rap}) translateZ(0)`
    },
    onLocking() {
      this.locking = false
      this.disabledInput = false
    },
    searchAddress() {
      this.disabledInput = true
      this.locking = true
      this.setAddress(this.inputValue)
    },
    async getTotal(params) {  //获取组织架构总数
      const res = await this.$http.post('/dmp/api/Map/OrgCountsAllHistory', params)
      this.$emit('totalNum', res)
    },
    setTabNum(i,v){
      if(this.mapArr[i].nums.length===0){
        this.mapArr[i].nums.push(v);
      }
      else if(this.mapArr[i].nums.length&&this.mapArr[i].nums[0]!=v){
         this.mapArr[i].nums.length=0;
         this.mapArr[i].nums.push(v);
      }
    },
    getNum(i){
      if(this.mapArr[i].nums.length) return this.mapArr[i].nums[this.mapArr[i].nums.length-1];
    },
    //选择五级架构
    tab1() {
      this.isOrg = true
      this.isDistrict = false
      this.isAddress = false
      var index = 0;
      var selected =0 ;
      if(this.orgselescts.length){
        index = this.orgselescts.length -1;
        selected = this.orgselescts[index];
      }
      this.SelectChange(index,selected);
    },
    //选择行政区
    tab2() {
      this.isOrg = false
      this.isDistrict = true
      this.isAddress = false
      var index = 0;
      var selected =0 ;
      if(this.districtselescts.length){
        index = this.districtselescts.length -1;
        selected = this.districtselescts[index];
      }
      this.SelectChange(index,selected);
    },
    tab3() {
      this.isOrg = false
      this.isDistrict = false
      this.isAddress = true
      this.SelectChange(0, 0) // 显示全国地图
    },
    //获取地图显示数据(行政区)， 获取节点经纬度
    async getdatalist(id,isleaf,path){
      var getvillage = null,villages = null;
      if(isleaf)  getvillage = this.$http.get(`/dmp/api/Map/QueryVillage/${id}?time=${this.params.querytime}`);
      const httpresult = await this.$http.post('/dmp/api/Map/MapPointCount',{id:id,isleaf:isleaf,path:path,time:this.params.querytime});

      // this.setTabNum(0,httpresult.openCount);
      // this.setTabNum(1,httpresult.chargeCount);
      // this.mapArr[0].num = httpresult.openCount;
      // this.mapArr[1].num = httpresult.chargeCount;
      const datalist = httpresult.cell;
      const rooms = httpresult.room;
      const roomcache = {};
      rooms.forEach(r=>roomcache[r.id]=r.count);
      //const datalist2 = httpresult.device;
      if(isleaf) villages = await getvillage;
      for(var i =0;i<datalist.length;i++){
        var node = datalist[i];
        node.cellCount = node.count;
        var find =null;
        if(isleaf){
          find = villages.find(item=>item.id===node.id);
        }
        else {
          find = this.districts.find(item=>item.id===node.id);
          if(find.name=='上海市') {
            find = this.districts.find(item=>item.name=='上海市'&&item.parrentid!==0);
            if(find) node.id = find.id;
          }
          else if(find.name=='北京市') {
            find = this.districts.find(item=>item.name=='北京市'&&item.parrentid!==0);
            if(find) node.id = find.id;
          }
        }
        if(find){
          node.name = find.name;
          node.lng = find.lng;
          node.lat = find.lat;
        }
        node.roomCount = roomcache[node.id]||0;
      }
      var showlist = datalist.filter(d=>d.cellCount);
      this.cellcount = showlist.reduce((p,c)=>{
        return p+c.cellCount;
      },0);
      this.roomcount = showlist.reduce((p,c)=>{
        return p+c.roomCount;
      },0);
      // this.deviceCount = showlist.reduce((p,c)=>{
      //   return p+c.deviceCount;
      // },0);
      return showlist;
    },
    //获取地图显示数据(五级架构), 运营下匹配节点经纬度
    async getorgdatalist(id,isleaf,path){
      var getvillage = null,villages = null;
      if(isleaf)  getvillage = this.$http.get(`/dmp/api/Org/QueryVillage/${id}?time=${this.params.querytime}`);
      const httpresult = await this.$http.post('/dmp/api/Org/MapPointCount',{id:id,isleaf:isleaf,path:path,time:this.params.querytime});
      // this.setTabNum(0,httpresult.openCount);
      // this.setTabNum(1,httpresult.chargeCount);
      // this.mapArr[0].num = httpresult.openCount;
      // this.mapArr[1].num = httpresult.chargeCount;
      const datalist = httpresult.cell;

      if (!this.numLength.org.selectLength) {   //切换tab, 保存原状态
        this.setOrg({num: datalist.length, selectLength: 1});//地图左右存储个数和索引，当前是第一个 
      }

      const rooms = httpresult.room;
      const roomcache = {};
      rooms.forEach(r=>roomcache[r.id]=r.count);
      //const datalist2 = httpresult.device;
      if(isleaf) villages = await getvillage;

      for(var i =0;i<datalist.length;i++){
        var node = datalist[i];
        node.cellCount = node.count;
        var find =null;
        if(isleaf){
          find = villages.find(item=>item.id===node.id);
        }
        else {
          find = this.orgs.find(item=>item.id===node.id);
        }
        if(find){
          node.name = find.name;
          node.lng = find.lng;
          node.lat = find.lat;
        }
        node.roomCount = roomcache[node.id]||0;
      }
      var showlist = datalist.filter(d=>d.cellCount);
      this.cellcount = showlist.reduce((p,c)=>{
        return p+c.cellCount;
      },0);
      this.roomcount = showlist.reduce((p,c)=>{
        return p+c.roomCount;
      },0);
      // this.deviceCount = showlist.reduce((p,c)=>{
      //   return p+c.deviceCount;
      // },0);
      return showlist;
    },
    //下拉选择事件
    async SelectChange(index, id) {
      this.setNodeData({id, type: this.isOrg ? 1 : 2})
      // 前四个的下拉框 
      if(index&&!id){
        if(this.isOrg) this.$emit('nodechange',{id:this.orgselescts[index-1],type:1});
        else this.$emit('nodechange',{id:this.districtselescts[index-1],type:2});
      }
      else {
        if(this.isOrg&&id===0&&index===0){
           var rootnode = this.orgs.find(item=>item.parrentid==0);
           this.$emit('nodechange',{id:rootnode.id,type:this.isOrg?1:2});

           this.setOrg({num: 1, selectLength: 1});  //运营选择全部
        }else 
          this.$emit('nodechange',{id:id,type:this.isOrg?1:2});
        }

      this.showtype=0;//显示地图
      this.imgurl = "";
      // await this.$http.Delay();
      this.villageselect = null;//清除小区选择
      this.cellselect = null;//清除单元选择
      this.celloptions = null;//清除单元选择
      const params = { // 获取总数参数
        type: 1,
        time: this.params.querytime
      }
      if (this.isDistrict) {//行政区域
        this.districtselescts.length = index + 1;
        this.districtselesctoptions.length = index + 1;
        //const getdatalist = this.$http.post('/dmp/api/Map/CellCount',{id:0,isleaf:false});
        if(id==0){
          this.villageoptions = null;//小区选择清除
          if(index!=0){
            var node = this.districts.find(item=>item.id==this.districtselescts[index-1]);
            var datalist = await this.getdatalist(this.districtselescts[index-1],false,node.path);
            this.districtselescts[index]=0;
            this.districtselesctoptions[index]=[{id:0,name:'全部'}, ...datalist];
            this.InitMap(node.name,datalist,node, {index, id});//刷新地图
          }
          else{
            var datalist = await this.getdatalist(0,false);
            this.districtselescts.length = 0;
            this.districtselesctoptions.length = 0;
            this.districtselescts.push(0);
            this.districtselesctoptions.push([{id:0,name:'全部'}, ...datalist]);
            this.InitMap("中国",datalist,null, {index: null, id});//刷新地图

            let selectLength = this.districtselesctoptions.length; 
            this.setDistrict({selectLength: selectLength, num: this.districtselesctoptions[selectLength - 1].length - 1}) // 行政区初始化的 select 个数和options数目
          }
          return;
        }
        var node = this.districts.find(item=>item.id==id);
        var datalist = await this.getdatalist(node.id,node.isleaf,node.path);
        if (!node.isleaf){ 
          this.villageoptions = null;//小区选择清除
          this.districtselescts.push(0);
          this.districtselesctoptions.push([{id:0,name:'全部'}, ...datalist]);

          let selectLength = this.districtselesctoptions.length
          this.setDistrict({selectLength: selectLength, num: this.districtselesctoptions[selectLength - 1].length - 1}) // 选择行政区 select 个数和options数目
        }
        else{
          this.villageoptions = [{id:0,name:'全部'}, ...datalist];
          this.villageselect = 0;
        }
        this.InitMap(node.name,datalist,node, {index, id});//刷新地图
      } else {
        this.orgselescts.length = index + 1;
        this.orgselesctoptions.length = index + 1;
        if(id==0){
          this.villageoptions = null;//小区选择清除
          if(index!=0){
            var node = this.orgs.find(item=>item.id==this.orgselescts[index-1]);
            var datalist = await this.getorgdatalist(this.orgselescts[index-1],false,node.path);
            this.orgselescts[index]=0;
            this.orgselesctoptions[index]=[{id:0,name:'全部'}, ...datalist];
            this.InitMap(node.name,datalist,node, {index, id});//刷新地图
          }
          else{
            var rootnode = this.orgs.find(item=>item.parrentid==0);
            var datalist = await this.getorgdatalist(rootnode.id,false,rootnode.path);
            this.orgselescts.length = 0;
            this.orgselesctoptions.length = 0;
            this.orgselescts.push(0);
            this.orgselesctoptions.push([{id:0,name:'全部'}, ...datalist]);   
            this.InitMap("中国",datalist,null, {index: null, id});//刷新地图
          }
          params.id = id
          params.isleaf = false
          params.path = '801,802' // 全部
          this.getTotal(params) 
          return;
        }
        var node = this.orgs.find(item=>item.id==id);
        var datalist = await this.getorgdatalist(node.id,node.isleaf,node.path);
        if (!node.isleaf){ 
          this.villageoptions = null;//小区选择清除
          this.orgselescts.push(0);
          this.orgselesctoptions.push([{id:0,name:'全部'}, ...datalist]);
        }
        else{
          this.villageoptions = [{id:0,name:'全部'}, ...datalist];
          this.villageselect = 0;
        }
        this.InitMap(node.name,datalist,node, {index, id});//刷新地图
      }
      
      let selectLength;// select 个数
      if (this.villageoptions) { selectLength = 5 } else { selectLength = this.orgselesctoptions.length }
      this.setOrg({num: datalist.length, selectLength});// 地图左右存储select option个数和select 的个数
      params.id = id
      params.path = node.path
      index === 3 ? params.isleaf = true : params.isleaf = false
      this.getTotal(params)
    },
    async SelectVillage(id){
        let selectLength;// 选择'全部' selectLength 为5, 选择其他设置为6
        if(id==0){//选择全部
          //this.$emit('nodechange',{id:this.orgselescts[this.orgselescts.length-1],type:1});//更新图表
          this.SelectChange(this.orgselescts.length-1,this.orgselescts[this.orgselescts.length-1]);
          selectLength = 5
        }
        else{
          this.cellselect = null;//清除单元选择
          this.$emit('nodechange',{id:id,type:3});//更新图表
          this.showtype = 1;
          var village = this.villageoptions.find(v=>v.id==id);
          this.cityname = village.name;
          // 设置select选择单元的名字
          this.orgList.splice(4, 2, this.cityname)
          this.setOrgList(this.orgList)

          const httpresults = await this.$http.awaitTasks([
            this.$http.get(`/dmp/api/Cell/QueryCell/${id}?time=${this.params.querytime}`),
            this.$http.get(`/dmp/api/GetImage/GetVillage?id=${id}&time=${this.params.querytime}`),//1938 ${id}
            this.$http.post(`/dmp/api/Cell/RoomCount`,{id:id,type:3,time:this.params.querytime})
          ])
          const celloptions = httpresults[0];
          this.celloptions = [{id:0,address:'全部'}, ...celloptions];//单元选择赋值
          this.cellselect = 0;
          this.vpics = httpresults[1].pics;
          // 小区图片只取一张;
          if(this.vpics.length !== 0){
            this.imgurl = this.vpics.splice(0, 1)[0]
          } else{
            this.imgurl = defaultImg;
          }
          // if(httpresults[1].re)
          // this.setTabNum(0,httpresults[1].openCount);
          // this.setTabNum(1,httpresults[1].chargeCount);
          // this.mapArr[0].num = httpresults[1].openCount;
          // this.mapArr[1].num = httpresults[1].chargeCount;
          this.cellcount = httpresults[1].cellCount;
          this.roomcount = httpresults[2];
          // this.deviceCount = httpresults[1].deviceCount;

          selectLength = 6
        }
        this.setOrg({num: this.celloptions.length - 1, selectLength})
        this.setNodeData({id, type: 3}) // 五级架构：1。行政区：2。小区：3。单元：4 
    },
    async SelectCell(id){
      let selectLength;// 选择'全部' selectLength 设置为6, 选择其他设置为7
      if(id==0){//选择全部
        //this.$emit('nodechange',{id:this.villageselect[this.villageselect.length-1],type:1});//更新图表
        this.SelectVillage(this.villageselect);
        selectLength = 6
        this.setOrg({num: this.orgselescts.length, selectLength})
      } else {
        selectLength = 7
        this.setOrg({num: this.orgselescts.length, selectLength})

        this.$emit('nodechange',{id:id,type:4});//更新图表
        var cell = this.celloptions.find(v=>v.id==id);
        this.cityname = cell.address;
        // 设置select选择单元名字
        this.orgList.splice(5, 2, this.cityname)
        this.setOrgList(this.orgList)

        this.showtype=2;
        var getroomcount = this.$http.post(`/dmp/api/Cell/RoomCount`,{id:id,type:4,time:this.params.querytime});
        const httpresult = await this.$http.get(`/dmp/api/GetImage/GetCuc?id=${id}&time=${this.params.querytime}`);//28147 ${id}
        this.imgurl = httpresult.pic || defaultImg;   // 父元素
        // this.setTabNum(0,httpresult.openCount);
        // this.setTabNum(1,httpresult.chargeCount);
        // this.mapArr[0].num = httpresult.openCount;
        // this.mapArr[1].num = httpresult.chargeCount;
        this.cellcount = httpresult.cellCount;
        this.roomcount = await getroomcount;
        // this.deviceCount = httpresult.deviceCount;
        //this.celloptions = [{id:0,address:'全部'}, ...celloptions];//单元选择赋值
      }
      this.setNodeData({id, type: 4}) // 五级架构：1。行政区：2。小区：3。单元：4 
    },
    wait (){
      return new Promise((reslove,reject)=>{
        setTimeout(reslove,100);
      })
    },
    init() {
      // this.orgs = []; //5级架构数据数据
      // this.districts = []; //行政区数据
      this.dimensions = null; //缓存计算的缩放级别
      this.myChart = null; //echart控件
      this.bMap = null; //当前百度地图控件
      this.curlay = null; //当前图层
      this.curLevel = 1; //当前显示级别
      this.curCityName = null; //当前显示城市的名称
      this.lastCityNames = []; //

      this.CityZoom = { 上海市: 10, 中国: 5 };
      this.CityData = {}; //城市遮挡数据
      this.CityBoundaryData = {}; //城市边界数据
      this.CitySW = {}; //西南
      this.CityNE = {}; //东北
      this.CityCenter = {}; //中心
      const mapdiv = document.getElementById("map");

      this.myChart = echarts.init(mapdiv);
      this.curLevel = 1;
      // this.myChart.on("click", params => {
      //   const e = params.event.event;
      //   e.stopPropagation();
      //   e.preventDefault();
      //   this.curLevel++;
      //   //this.bMap.clearOverlays();

      //   this.lastCityNames.push(this.curCityName);
      //   this.curCityName = params.data.name;
      //   this.InitMap(this.curCityName);
      // });
      this.curCityName = "中国";
      //this.InitMap(this.curCityName);
      this.SelectChange(0,0);

      var chartmap = this.myChart;
      var canvas = null;
      var eventtrigger = (e,ename)=>{
      if(!canvas){
        var canvass = document.getElementById("bodymap").querySelectorAll("canvas");
        if(canvass.length) canvas = canvass[canvass.length-1];
        else return;
      } 
       var ev = document.createEvent('MouseEvents');
       ev.initMouseEvent(ename,true,true,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget,e.offsetX,e.offsetY);
       canvas.dispatchEvent(ev);
      }
      document.getElementById("mappic").onmouseover = e =>{
        eventtrigger(e,'mouseover');
      };
      document.getElementById("mappic").onmousemove = e =>{
        eventtrigger(e,'mousemove');
      };
      document.getElementById("mappic").onmouseout = e =>{
        eventtrigger(e,'mouseout');
      };
    },
    async InitMap(cityname,datalist,node, selectedInfo) { // 城市名字, 子元素, 节点的信息, selectedInfo: {index: select 的索引, id: 选择的id, 0是全部}
      // 存储区域的名字
      if (this.isOrg) {
        if (selectedInfo.index === null) {
          this.setOrgList([])
        } else {    
          this.orgList.splice(selectedInfo.index)
          if (selectedInfo.id !== 0) { this.orgList.push(cityname) }
          this.setOrgList(this.orgList)
        }   
      } else if (this.isDistrict) {
        if (selectedInfo.index === null) {
          this.setDistrictList([])
        } else {   
          this.disList.splice(selectedInfo.index)        
          if (selectedInfo.id !== 0) { this.disList.push(cityname) }
          this.setDistrictList(this.disList)
        }
      }

      var type = 0;
      if(this.villageoptions) type=3;
      else if(this.isOrg) type=1;
      else type=2;
      var cachepointdata={};
      var curshowid=0;
      var queryDeviceCount = (id)=>{
        curshowid=id;
        if(!cachepointdata[id]) cachepointdata[id]=this.$http.post('dmp/api/Map/DeviceCount',{type:type,id:id});
        return cachepointdata[id];
      }

      this.cityname = cityname;
      if(this.isOrg&&cityname==="中国") this.cityname = this.orgs.find(item=>item.parrentid==0).name;

      var points = null;
      if(this.isDistrict||cityname==="中国"){//是否需要获取边界数据抠图
        if(this.isDistrict&&cityname!=="中国"){
          var nameall=null;
          for(var j=0;j<this.districtselescts.length;j++){
            var curname = this.districtselesctoptions[j].find(o=>o.id==this.districtselescts[j]).name;
            if(curname.indexOf('市')!=-1) nameall=curname;
            else if(nameall&&curname!='全部'){
              nameall = nameall + curname;
            }
          }
          if(nameall) cityname = nameall;
        }
        if (!this.CityData[cityname]&&this.CityData[cityname]!==null){
          this.CityData[cityname] = this.GetData(cityname,node);
        }
        points = await this.CityData[cityname]; //获取城市边界遮挡数据
      }

      // const pcenter = this.CityCenter[cityname]; //地图显示区域中心
      let view = this.getZoom(cityname,datalist);
      var retry = 0;
      while(view.zoom<5&&retry<5){
        retry++;
        await this.$http.Delay(50);
        view = this.getZoom(cityname,datalist);
      }
      this.$zoom = view.zoom;
      this.$center = view.center;
      if(cityname==="中国") this.$center =this.CityCenter[cityname];

      var serietype = 'effectScatter';
      if(this.villageoptions) serietype='scatter';
      var option = {
        // backgroundColor: '#404a59',
        title: {
          // text: `${cityname}青客公寓分布图`,
          //subtext: 'data from qk365.com',
          //sublink: 'http://www.pm25.in',
          top: "20",
          left: "center",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          padding: 0,
          textStyle: {
            fontSize: 18
          }
        },
        bmap: {
          center: [this.$center.lng, this.$center.lat],
          zoom: this.$zoom,
          enableMapClick: false,
          roam: true,
          mapStyle: {
            styleJson: [
              {
                featureType: "water",
                elementType: "all",
                stylers: {
                  color: "#053858"
                }
              },
              {
                featureType: "land",
                elementType: "all",
                stylers: {
                  color: "#004981"
                }
              },
              {
                featureType: "boundary",
                elementType: "geometry",
                stylers: {
                  color: "#064f85"
                }
              },
              {
                featureType: "railway",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "highway",
                elementType: "geometry",
                stylers: {
                  color: "#004981"
                }
              },
              {
                featureType: "highway",
                elementType: "geometry.fill",
                stylers: {
                  color: "#005b96",
                  lightness: 1
                }
              },
              {
                featureType: "highway",
                elementType: "labels",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "arterial",
                elementType: "geometry",
                stylers: {
                  color: "#004981"
                }
              },
              {
                featureType: "arterial",
                elementType: "geometry.fill",
                stylers: {
                  color: "#00508b"
                }
              },
              {
                featureType: "poi",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "green",
                elementType: "all",
                stylers: {
                  color: "#056197",
                  visibility: "off"
                }
              },
              {
                featureType: "subway",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "manmade",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "local",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "arterial",
                elementType: "labels",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "boundary",
                elementType: "geometry.fill",
                stylers: {
                  color: "#029fd4"
                }
              },
              {
                featureType: "building",
                elementType: "all",
                stylers: {
                  color: "#1a5787"
                }
              },
              {
                featureType: "label",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              }
            ]
          }
        },
        series: [
          {
            // name: "Top 5",
            type: serietype,//"effectScatter",
            coordinateSystem: "bmap",
            // data: this.convertData(data.sort(function (a, b) {
            //     return b.value - a.value;
            // }).slice(0, 10)),
            data: this.convertData(datalist),
            symbolSize: function(val) {
              return 10;
            },
            //showEffectOn: 'emphasis',
            rippleEffect: {
              //涟漪特效相关配置
              scale: 6,
              brushType: "stroke" //'stroke','fill'
            },
            //hoverAnimation: true,
            label: {
              normal: {
                fontSize: 20,
                formatter: "{b}",
                position: "right",
                show: this.villageoptions ? false:true
              }
            },
            itemStyle: {
              normal: {
                color: "#ddb926",
                shadowBlur: 10,
                shadowColor: "#333"
              }
            },
            tooltip: {
              trigger :'item',
              // position: 'top',
              formatter:(params)=>{
                var node = params.value[2];
                if(node.deviceCount) return `<div class="tooltip-wrapper">${node.name}<br />房间数:${node.roomCount}<br />单元数:${node.cellCount}<br />设备数:${node.deviceCount}</div>`;
                queryDeviceCount(node.id).then(deciveCount=>{
                  node.deviceCount = deciveCount
                  if(curshowid==node.id) mapdiv.firstElementChild.innerHTML=`<div class="tooltip-wrapper">${node.name}<br />房间数:${node.roomCount}<br />单元数:${node.cellCount}<br />设备数:${deciveCount}</div>`
                });
                this.$bus.$emit('totalDevice', node.deviceCount) //设备总计
                // return `${node.name}<br />公寓总数:${node.cellCount}`;//<br />公寓总数:${node.cellCount}<br />设备数:${node.deviceCount}
                return `<div class="tooltip-wrapper">${node.name}<br />房间数:${node.roomCount}<br />单元数:${node.cellCount}</div>`;
              }
            },
            zlevel: 1
          }
        ]
      };

      if (this.curlay) this.bMap.removeOverlay(this.curlay); //删除当前图层
      if (this.curlayline) this.bMap.removeOverlay(this.curlayline); //删除当前虚线
      this.myChart.clear();
      const mapdiv = document.getElementById("map");
      for (var i = mapdiv.children.length - 2; i > -1; i--) {
        //移除上次echart生成的dom
        if (mapdiv.children[i].class != "ec-extension-bmap")
          mapdiv.removeChild(mapdiv.children[i]);
      }

      this.myChart.setOption(option); //重新设置参数
      var ecModel = this.myChart["_model"];
      let map;
      ecModel.eachComponent("bmap", function(bmapModel) {
        map = bmapModel.__bmap; //由echart实例获取百度地图的实例
        map.disableDoubleClickZoom(); //去掉双击放大事件
        map.disablePinchToZoom();
        map.disableScrollWheelZoom();
        map.disableDragging();
        map.disableInertialDragging();
      });
      this.bMap = map;

      if((this.isDistrict||cityname==="中国")&&points){
        this.curlay = new BMap.Polygon(points, {
          strokeColor: "none",
          fillColor: "rgba(0, 0, 0, 0.5)",
          // fillColor: "#053858",
          fillOpacity: 1,
          strokeOpacity: 0.5
        }); //建立多边形覆盖物
        this.curlayline = new BMap.Polyline( this.CityBoundaryData[cityname], {strokeColor:"blue", strokeWeight:2, strokeOpacity:1,strokeStyle:'dashed'});   //创建折线
        this.bMap.addOverlay(this.curlay); //添加覆盖物"#053858"
        if(cityname!=="中国")
          this.bMap.addOverlay(this.curlayline); //添加覆盖物"#053858"
      }

      // if (cityname === "中国") {
      //   this.bMap.disableScrollWheelZoom();
      //   this.bMap.disableDragging();
      //   this.bMap.setMinZoom(5);
      // } else {
      //   this.bMap.enableScrollWheelZoom();
      //   this.bMap.enableDragging();
      //   this.bMap.setMinZoom(zoom);
      //   //this.bMap.setZoom(this.getZoom(cityname))
      // }
    },
    back() {
      if (!this.lastCityNames.length) return;
      const lastCity = this.lastCityNames.pop();
      this.curCityName = lastCity;
      this.InitMap(lastCity);
    },
    //获取城市数据
    GetData(cityname,node) {
      return new Promise((resolve, reject) => {
        const bdary = new BMap.Boundary();
        bdary.get(cityname, rs => {
          resolve(this.getrect(rs, cityname,node));
        });
      });
    },
    //获取遮布数据并缓存 原有边界数据，以及计算中心，显示范围
    getrect(rs, cityname,node) {
      const blist = rs.boundaries;

      const pcentor = new BMap.Point(0, 0);
      const pNE = new BMap.Point(180, 90); //东北角
      const pNW = new BMap.Point(-180, 90); //西北角
      const pSW = new BMap.Point(-180, -90); //西南角
      const pSE = new BMap.Point(180, -90); //东南角

      //向数组中添加一次闭合多边形，并将西北角再加一次作为之后画闭合区域的起点
      var pArray = [];
      pArray.push(pcentor);
      pArray.push(pNW);
      pArray.push(pSW);
      pArray.push(pSE);
      pArray.push(pNE);
      pArray.push(pNW);
      pArray.push(pcentor);

      var boundary = [];
      //循环添加各闭合区域
      let minx = 180,
        miny = 90,
        maxx = 0,
        maxy = 0;
      for (var i = 0; i < blist.length; i++) {
        const ply = new BMap.Polygon(blist[i]);

        //将点增加到视野范围内
        let points = ply.getPath();
        if (
          points[0].lat != points[points.length - 1].lat ||
          points[0].lng != points[points.length - 1].lng
        ) {
          points = [...points, points[0]];
        }

        //将闭合区域加到遮蔽层上，每次添加完后要再加一次西北角作为下次添加的起点和最后一次的终点
        if (points.length > 200 || blist.length === 1) {
          pArray.push(...points, pArray[0]);
          boundary.push(...points);
          //计算
          const bounds = ply.getBounds();
          const ne = bounds.getNorthEast();
          if (ne.lng > maxx) maxx = ne.lng;
          if (ne.lat > maxy) maxy = ne.lat;
          const sw = bounds.getSouthWest();
          if (sw.lng < minx) minx = sw.lng;
          if (sw.lat < miny) miny = sw.lat;
        }
      }

      minx--;
      maxx++;
      miny--;
      maxy++;
      pcentor.lng = (minx + maxx) / 2;
      pcentor.lat = (miny + maxy) / 2;
      if(blist.length){
        this.CitySW[cityname] = new BMap.Point(minx, miny);
        this.CityNE[cityname] = new BMap.Point(maxx, maxy);
        this.CityBoundaryData[cityname] = boundary;
      }
      else{
        this.CitySW[cityname] = null;
        this.CityNE[cityname] = null;
        this.CityBoundaryData[cityname] = null;
      }
      
      if (cityname == "中国") {
        pcentor.lng = 104.114129;
        pcentor.lat = 20.550339;
        this.CityCenter[cityname] = new BMap.Point(104.114129, 37.550339); //中国中心
      } else {
        // this.CityCenter[cityname] = pcentor;
        this.CityCenter[cityname] = new BMap.Point(node.lng, node.lat);
      }
      return pArray;
    },
    //根据经纬极值计算绽放级别。
    getZoom(cityname,datalist) {
      if (!this.bMap) return {center:new BMap.Point(104.114129, 37.550339),zoom:5};
      if (cityname === "中国") return {center:new BMap.Point(104.114129, 37.550339), zoom:5};
      if(this.CityBoundaryData[cityname]){//有边界数据 按边界数计算
       return this.bMap.getViewport(this.CityBoundaryData[cityname]);
      }
      else{//没有边界数据 按展示的点计算
        var points = datalist.map(p => new BMap.Point(p.lng, p.lat));
        var result = this.bMap.getViewport(points);
        if(points.length==2) result.zoom-=1;
        return result;
      }
    },
    convertData(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = [data[i].lng, data[i].lat];
        // const p = this.CityCenter[data[i].name];
        // var geoCoord = [p.lng, p.lat];
        // var geoCoord = this.geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i])
          });
        }
      }
      return res;
    },
    //选择 行政区(true)，组织架构(false)
    SelectTab(isdistrict) {
      this.$isdistrict = isdistrict;
    },
    ...mapMutations({
      setOrg: 'SET_ORG',                     // select 的长度和总数
      setDistrict:'SET_DISTRICT',            // select 的长度和总数
      setAddress: 'SET_ADDRESS',
      setOrgList: 'SET_ORG_LIST',            // 区域文字描述
      setDistrictList: 'SET_DISTRICT_LIST',  // 区域文字描述
      setNodeData: 'SET_NODE_DATA'
    })
  },
};
</script>

<style lang="stylus">
@import '~styles/variable'
.slide-enter-active {
  transition: all .8s linear;
}
.slide-leave-active {
  transition: all .8s linear;
}
.slide-enter 
  transform: translateY(100%);

.slide-leave-to {
  transform: translateY(-100%);
}

.locking {
  margin-left: 0!important;
  color: #fff!important;
}
//   @keyframes enter 
//     from 
//       top 100px
//     to 
//       top 0
//   @keyframes leave 
//     from 
//       top 0
//     to 
//       top -100px
// .slide-leave-active
//   animation leave 10s inlinear;

// .slide-enter-active
//   animation enter 10s inlinear;

.normal-class {
  font-size: 16px;
  position: relative;
  top: 4px;
}

.number-active {
  position: absolute;
  top: 0;
  color: $color-active;
  font-weight: bold;
}

.footer .number-active {
  top: 20px;
}

.tooltip-wrapper {
  position: relative;
  // width: 150px;
  // height: 80px;
  padding: 12px;
  border-radius: 3px;
  background: #1C9AA8;
}

// .tooltip-wrapper:before {
//   content: '';
//   position: absolute;  
//   bottom: -6px;
//   left: 70px;
//   width: 3px;
//   border-left: 10px solid transparent;
//   border-right: 10px solid transparent;
//   border-top: 10px solid #1C9AA8;
// }

.title {
  display: flex;
  .tab1.active {
    color: #fff;
    background: url('../assets//tab1-active.png') no-repeat
  }
  .tab2.active {
    color: #fff;
    background: url('../assets//tab2-active.png') no-repeat
  }

  .tab1 {
    width: 138px;
    display: flex;
    position: relative;
    left: 26px;
    align-items: center;
    cursor: pointer;
    background: url('../assets//tab1.png') no-repeat
    p {
      padding: 10px 0 6px 47px
    }
  }

  .tab2 {
    position: relative;
    left: -7px;
    width:350px;
    cursor: pointer;
    background: url('../assets//tab2.png') no-repeat, url('../assets//tab2-active.png') no-repeat;
    p {
      margin-top: 9px;
      text-align: center;
    }
  }
}

.main {
  display: flex;
  position: relative;
  .border-img {
    height 744px;
  }
  .container {
    position: relative;
    flex: 1;
    height: 742px;
    .select-wrapper {
      position: relative;
      top: -14px;
      margin: 6px 0;
      .input-wrapper {
        display: flex;
        .el-input__inner {
          padding-left: 30px!important;
        }
        .el-icon-search:before {
          position: relative;
          top: 10px;
          left: 26px;
          z-index: 9;
        }
        button {
          background: $bg-active;
          color: $color-normal;
          border: none;
          border-radius: none;
        }
      }
      .el-select {
        width: 137px;
        margin: 0 4px;
      }
      .el-select:nth-of-type(1) {
        margin-left: 0;
      }
      .el-select:nth-of-type(6) {
        margin-right: 0;
      }
    }
    .header {
      position: absolute;
      font-size: 16px;
      z-index: 99;
      top: 56px;
      left: 10px;
      right: 0;
      margin: auto;
      text-align: center;
    }
    .body {
        width: 880px;
        height: 100%;
        //background: url('../assets/mapBg.png') no-repeat;  
        background-size: 100% 100%;
        position: relative;
        top: 4px;
        #map {
            width: 948px;
            height: 861px;  //完整地图的高度
            transform: scale(0.927, 0.857);
            position: relative;
            z-index: -1;
            top: -58px;
            left: -34px;
        }
        #mappic {
            width: 880px;
            height: 771px;  //完整地图的高度
            position: relative;
            background: url('../assets/mapBg.png') no-repeat; 
            background-size: 100% 100%;
            top: -875px;
        }
      .community {
        display: flex;
        img {
          width: 400px;
        }
      }
    }
    .count {
      position: absolute;
      z-index: 999;
      bottom: 42px;
      left: 52px;
      height: 0;
      p {
        margin-bottom: 10px;
        span:nth-of-type(2) {
          color: $number-active
          font-weight: bold;
        }
      }  
    }
  }

  .footer {
    display: flex;
    position: relative;
    top: 32px;
    left: 77px;
    &:nth-child(1){
      display: none;
    }
    .item {
      flex: 1;
      display: flex;
      justify-content: center;
      &:nth-of-type(1) {
        display: none;
      }
      img {
        margin-right: 10px;
      }
      div {
        display: flex;
        flex:1;
        flex-direction: column;
        p:nth-child(1) {
          // font-size: $font-small;
          margin-bottom: 4px;
        }
        p:nth-child(2) {
          color: $color-active;
        }
      }
    }
  }
  .shade {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 14px;
    // background: #050A27;
  }
}
</style>

