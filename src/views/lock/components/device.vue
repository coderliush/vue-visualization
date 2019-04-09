<template>
  <div class="device">
    <div class="title">
      <span class="dot"></span>
      <span>设备异常检索（异常占比）</span>
      <span class="active">{{querytime}}</span>
      <span>设备总计</span>
      <span class="active">{{total | splitNum}}</span>
    </div>

    <div class="device-container">
      <div class="item">
        <el-select v-model="device.id" class="select"  @change="onDevice()" placeholder="设备类型">
          <el-option v-for="item in device.options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div class="graph">
          <Cirque class="device-selected" v-show="showDeviceCircle" :cirqueData="deviceCirqueData"></Cirque>
          <div class="device-no-selected" v-show="!showDeviceCircle">
            <img :src="device.src" alt="">
            <div class="content">
              <p class="name">{{device.name}} {{device.num}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="item">
        <el-select v-model="provider.value" class="select" placeholder="供应商">
          <el-option :value="1"></el-option>
        </el-select>
        <div class="graph">
          <div class="device-no-selected">
            <img :src="provider.src" alt="">
            <div class="content">
              <p class="active">{{provider.num}}</p>
              <p class="name">{{provider.name}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="item">
        <el-select v-model="hardVersion.value" class="select"  @change="onHardVersion()" placeholder="固体版本">
          <el-option v-for="item in hardVersion.options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <div class="graph">
          <Cirque class="device-selected" v-show="showHardVersionCircle" :cirqueData="HardVersionCirqueData"></Cirque>
          <div class="device-no-selected" v-show="!showHardVersionCircle" >
            <img :src="hardVersion.src" alt="">
            <div class="content">
              <p class="name">{{hardVersion.name}} {{hardVersion.num}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="item">
        <el-select v-model="batch.value" class="select" placeholder="批次号">
          <el-option :value="1"></el-option>
        </el-select>
        <div class="graph">
          <div class="device-no-selected">
            <img :src="batch.src" alt="">
            <div class="content">
              <p class="active">{{batch.num}}</p>
              <p class="name">{{batch.name}}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Cirque from 'components/shareCirque'
import objAddPercent from 'utils/objAddPercent'
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: '',
  data() {
    return {
      total: null,
      showDeviceCircle: false,
      showHardVersionCircle: false,
      deviceCirqueData: null,  // 设备类型圆环图数据
      HardVersionCirqueData: null,  // 固体版本圆环图数据
      device: {
        name: '设备类型',
        num: null,
        value: null,
        options: [],
        src: require('../../../assets/device-type.png'),
        options: {value: 1, label: '设备类型'}
      },
      provider: {
        name: '供应商',
        num: null,
        value: null,
        options: [],
        src: require('../../../assets/supplier.png'),
        options: {value: 1, label: '设备类型'}
      },
      hardVersion: {
        name: '固体版本',
        num: null,
        value: null,
        options: [],
        src: require('../../../assets/version.png'),
        options: {value: 1, label: '设备类型'}
      },
      batch: {
        name: '批次号',
        num: null,
        value: null,
        options: [],
        src: require('../../../assets/batch.png'),
        options: {value: 1, label: '设备类型'}
      }
    }
  },
  watch: {
    params: {
      async handler(obj) {
        this.init()
      },
      deep: true
    },
  },
  computed: {
    ...mapGetters([
      'params',
      'querytime'
    ])
  },
  methods: {
    async init() {
      // 设备类型和固体版本两种数据。不显示圆环图，调获取下拉框的接口, 否则调获取圆环图数据的接口。
      if (this.showDeviceCircle === false) {
        const deviceOptions = await this.$http.get('/dmp/api/LockHistory/GetLockTypeHistory')
        this.device.num = deviceOptions.length
        this.device.options = [{name: '全部', id: 0}, ...deviceOptions]
      } else {
        const res = await this.$http.post('/dmp/api/LockHistory/CountLockUnWorksHistory', this.params) 
        this.deviceCirqueData = objAddPercent(res)
      }

      if (this.showHardVersionCircle === false) {
        const hardOptions = await this.$http.post('/dmp/api/LockHistory/GetLockHardversionHistory', {...this.params})
        this.hardVersion.num = hardOptions.length
        this.hardVersion.options = ['全部', ...hardOptions]
      } else {
        const res = await this.$http.post('/dmp/api/LockHistory/CountLockUnWorksHistory', this.params)  
        this.HardVersionCirqueData = objAddPercent(res)
      }
    },
    onDevice() {
      if (this.device.id === 0) { this.showDeviceCircle = false } else { this.showDeviceCircle = true }
      this.setDeviceType(this.device.id)
    },
    onHardVersion() {
      if (this.hardVersion.value === '') { this.showHardVersionCircle = false } else { this.showHardVersionCircle = true }
      this.setHardVersion(this.hardVersion.value)
    },
    ...mapMutations({
      setDeviceType: 'SET_DEVICE_TYPE',
      setHardVersion: 'SET_HARD_VERSION'
    })
  },
  async mounted() {
    this.init()
    this.$bus.$on('totalDevice', (total) => {
      this.total = total
    })
  },
  components: {
    Cirque
  }
}
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .device
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
    .device-container
      display flex
      padding 0 96px
      .item 
        width 25%
        text-align center
        .select
          width 120px!important
        .graph
          .device-selected
            position relative
            left 20px
            top -26px
          .device-no-selected
            margin-top 20px
            img
              width 45%
            .content
              position relative
              top -70px
          .cirque
            width 100%
            height 300px
          p
            position relative
            top -6px

</style>
