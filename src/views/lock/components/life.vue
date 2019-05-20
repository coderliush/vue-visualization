<template>
  <div class="life">
    <div class="title">
      <span class="dot"></span>
      <span>锁的生命状态检索</span>
    </div>
    <div class="des">
      <span class="active">{{querytime}}</span>
      <span class="active">【{{this.area}}】</span>
      <span class="active">【{{this.device}}】</span>
    </div>

    <div class="content"> 
      <div v-for="(item, index) in list" :key="index" class="item">
        <el-select v-model="item.value" placeholder="请选择" class="select" @change="onSelect(item, index)">
          <el-option v-for="each in item.options" :key="each.value" :label="each.label" :value="each.value"></el-option>
        </el-select>

        <div class="cirque-wrapper">
          <div class="left">                                       
            <cirque class="cirque" :cirqueInfo="item.cirqueInfo" :value="item.value"></cirque>
            <div class="cirque-label" v-show="item.selected.num && item.selected.label !== '应有总数' && item.selected.num !== 0 ">
              <p>{{item.selected.label}} {{item.selected.num}}</p>
              <canvas ref="label" width="160" height="100"></canvas>
            </div>
            <div class="info">
              <p>{{item.selected.label}}</p>
              <p>{{item.selected.num}}</p>
            </div>
          </div>
          <div class="right">
            <img class="connect" src="../../../assets/connect.png" alt="">
          </div>
        </div>

        <span>{{item.des[index]}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import objAddPercent from 'utils/objAddPercent'
import Cirque from 'components/normalCirque.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: '',
  computed: {
    ...mapGetters([
      'params',
      'querytime',
      'text'
    ])
  },
  watch: {
    params: {
      handler(newValue, oldValue) {
        this.init()
      },
      deep: true
    },
    text: {
      handler() {
        if (this.text.business.active === 'org') {
          this.area = this.text.business.orgList.join('—') 
        } else if (this.text.business.active === 'district') {
          this.area = this.text.business.districtList.join('—')
        } else if (this.text.business.active === 'address') {
          this.area = this.text.business.address
        }

        this.device = this.text.deviceList.join('—')
      },
      deep: true
    }
  },
  data() {
    return {
      area: '区域',
      device: '设备属性',
      total: null,
      lifeList: [null, null, null, null],
      colors: ['#7CBE14', '#20A9F9', '#E6644E', '#FF66BC', '#A081FF', '#FFAE0D', '#999999', '#A56237'],
      list: [{
        value: 0,
        cirqueInfo: {},
        des: ['安装状态', '验收状态', '维修状态', '解绑状态'],
        selected: {label: '应有总数', num: null},
        options: [{label: '全部', value: 0, num: null}, {label: '已安装', value: 1, num: null}, {label: '未安装', value: 2, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        des: ['安装状态', '验收状态', '维修状态', '解绑状态'],
        selected: {label: '应有总数', num: null},
        options: [{label: '全部', value: 0, num: null},{label: '已验收', value: 1, num: null}, {label: '未验收', value: 2, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        des: ['安装状态', '验收状态', '维修状态', '解绑状态'],
        selected: {label: '应有总数', num: null},
        options: [{label: '全部', value: 0, num: null},{label: '维修中', value: 1, num: null}, {label: '未维修', value: 2, num: null}],
      }, {
        value: 0,
        cirqueInfo: {},
        des: ['安装状态', '验收状态', '维修状态', '解绑状态'],
        selected: {label: '应有总数', num: null},
        options: [{label: '全部', value: 0, num: null},{label: '已解绑', value: 1, num: null}, {label: '未解绑', value: 2, num: null}],
      }]
    }
  },
  methods: {
    async init() {
      const total = await this.$http.post('/dmp/api/LockHistory/GetLockCntHistoryByLife', {...this.params}) // 总数

      const res = await this.$http.awaitTasks([
        this.$http.post('/dmp/api/LockHistory/GetUnInstCntHistory', this.params), // 安装
        this.$http.post('/dmp/api/LockHistory/GetUnAcpCntHistory', this.params),  // 验收
        this.$http.post('/dmp/api/LockHistory/GetRepairCntHistory', this.params), // 维修
        this.$http.post('/dmp/api/LockHistory/GetCancelCntHistory', this.params), // 解绑
      ])  

      // 应有总数 total，已安装 trueStatusNums, 未安装 = total - trueStatusNums
      res.forEach((item, index) => {
        this.list[index].selected.num = total
        this.list[index].options[0].num = total
        this.list[index].options[1].num = item.trueStatusNums
        this.list[index].options[2].num = total - item.trueStatusNums
        this.list[index].cirqueInfo = {color: this.colors[index], ...objAddPercent({
          trueStatusNums: item.trueStatusNums,
          falseStatusNums: total - item.trueStatusNums,
          total
        })}
      })
    },
    onSelect(item, index) {
      item.selected.label = item.options[item.value].label
      item.selected.label === '全部' ? item.selected.label = '设备总数' : null
      item.selected.num = item.options[item.value].num

      this.lifeList.splice(index, 1, item.selected.label)
      this.setLife(this.lifeList)  // 报表显示状态文本
      // 设置生命状态的参数
      switch(index) {
        case 0:
          this.setInstall(item.value)
          break
        case 1: 
          this.setAccept(item.value)
          break
        case 2: 
          this.setRepair(item.value)
          break
        case 3: 
          this.setCancel(item.value)
      }
    },
    initCavas() {
      let label
      for (let i=0; i<=3; i++) {
        label = this.$refs.label[i].getContext('2d')
        label.beginPath(); label.moveTo(90, 40); label.lineTo(105, 30); label.strokeStyle="#7CCCEF"; label.stroke()
      }
    },
    ...mapMutations({
      setInstall: 'SET_INSTALL',
      setAccept: 'SET_ACCEPT',
      setRepair: 'SET_REPAIR',
      setCancel: 'SET_CANCEL',
      setLife: 'SET_LIFE'
    }) 
  },
  mounted() {
    this.$bus.$on('totalDevice', (total) => {
      this.total = total
    })

    this.init()
    this.initCavas()
  },
  components: {
    Cirque
  }
}
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .el-input--suffix .el-input__inner
    padding 12px!important

  .life
    position relative
    z-index 1
    margin-top 10px
    background $bg-panel
    .title
      display flex
      align-items center
      padding 20px 10px 10px
      .dot
        margin-right 10px
        dot($color-active)
      .active 
        margin 0 20px 0 10px
        color $color-active
    .des
      font-size $font-small
      padding 0 19px 10px
      .active 
        margin 0 0 0 10px
        color $color-active
    .content
      display flex
      width 1610px
      padding-left 200px
      margin 0 auto
      .item
        flex 1
        span
          font-size $font-small
          position relative
          left 46px
          top -8px
        .cirque-wrapper
          position relative
          display flex
          margin 20px 0
          .right
            img 
              width 316px
              position absolute
              top 50%
              transform translateX(-57px) translateY(-52%)
          .cirque
            position relative
            z-index 9999
          .cirque-label 
            position absolute
            p
              position absolute
              left 131px
              top -168px
              white-space nowrap
              padding-bottom 6px
              font-size $font-smaller
              border-bottom 1px solid #7CCCEF
            canvas
              position absolute
              top -178px
              left 26px
          .info
            min-width 154px
            position absolute
            top 50%
            text-align center
            transform translateY(-12px)
            p:nth-of-type(1)
              margin-bottom 4px
              font-size $font-small
            p:nth-of-type(2)
              font-size $font-small
              color $color-active
        .select
          width 140px
      .item:last-of-type
        margin-right 0
        .connect
          display none
        .active
          display none
</style>
