<template>
  <div class="device">
    <div class="title">
      <span class="dot"></span>
      <span>设备属性检索</span>
    </div>
    <div class="des">
      <span class="active">{{querytime}}</span>
      <span class="active">【{{this.area}}】</span>
    </div>

    <div class="device-container">
      <div class="item">
        <el-select v-model="device.id" class="select"  @change="onDevice" placeholder="全部">
          <el-option v-for="item in device.options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div class="graph">
          <Cirque :graphic="text.deviceList[0]" class="device-selected" v-show="showDeviceCircle" :cirqueData="deviceCirqueData"></Cirque>
          <div class="device-no-selected" v-show="!showDeviceCircle">
            <img :src="device.src" alt="">
            <div class="content">
              <p class="name">{{device.name}} {{device.num}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="item">
        <el-select v-model="provider.value" class="select" placeholder="全部" disabled>
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
        <el-select v-model="hardVersion.value" class="select"  @change="onHardVersion" placeholder="全部">
          <el-option v-for="item in hardVersion.options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <div class="graph">
          <Cirque :graphic="text.deviceList[1]" class="device-selected" v-show="showHardVersionCircle" :cirqueData="HardVersionCirqueData"></Cirque>
          <div class="device-no-selected" v-show="!showHardVersionCircle" >
            <img :src="hardVersion.src" alt="">
            <div class="content">
              <p class="name">{{hardVersion.name}} {{hardVersion.num}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="item">
        <el-select v-model="batch.value" class="select" placeholder="全部" disabled>
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
  computed: {
    ...mapGetters([
      'params',
      'querytime',
      'text'
    ])
  },
  watch: {
    params: {
      async handler() {
        this.getData()
      },
      deep: true
    },
    text: {
      handler() {
        if (this.text.business.active === 'org') {
          this.area = this.text.business.orgList.join(' — ') 
        } else if (this.text.business.active === 'district') {
          this.area = this.text.business.districtList.join(' — ')
        } else if (this.text.business.active === 'address') {
          this.area = this.text.business.address
        }
      },
      deep: true
    }
  },
  data() {
    return {
      area: null,
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
        name: '暂无数据',
        num: null,
        value: null,
        options: [],
        src: require('../../../assets/no-data.png'),
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
        name: '暂无数据',
        num: null,
        value: null,
        options: [],
        src: require('../../../assets/no-data.png'),
        options: {value: 1, label: '设备类型'}
      }
    }
  },
  methods: {
    async getData() {
      // 设备类型和固体版本两种数据。不显示圆环图，调获取下拉框的接口, 否则调获取圆环图数据的接口。
      if (this.showDeviceCircle === false) { 
        const deviceOptions = await this.$http.get('/dmp/api/LockHistory/GetLockTypeHistory') // 获取下拉框锁的类型
        this.device.num = deviceOptions.length
        this.device.options = [{name: '全部', id: 0}, ...deviceOptions]
      } else { // 圆环图获取总数和每个部分的数据
        const res = await this.$http.post('/dmp/api/LockHistory/CountLockUnWorksHistory', {...this.params, hardversion: null}) 
        const total = await this.$http.post('/dmp/api/LockHistory/GetLockCountHistory', {...this.params})
        this.deviceCirqueData = objAddPercent({...res, total})
      }

      if (this.showHardVersionCircle === false) {
        const hardOptions = await this.$http.post('/dmp/api/LockHistory/GetLockHardversionHistory', {...this.params}) // 获取下拉框固体版本的类型
        this.hardVersion.num = hardOptions.length
        this.hardVersion.options = ['全部', ...hardOptions]
      } else {
        const res = await this.$http.post('/dmp/api/LockHistory/CountLockUnWorksHistory', this.params) 
        const total = await this.$http.post('/dmp/api/LockHistory/GetLockCountHistory', {...this.params}) 
        this.HardVersionCirqueData = objAddPercent({...res, total})
      }
    },
    onDevice(val) {
      if (val) { this.showDeviceCircle = true } else { this.showDeviceCircle = false } 
      this.showHardVersionCircle = false // 设备属性更改，固体版本显示默认
      let selected = this.device.options.find(item => item.id === val)
      this.setDevice(selected)

      this.hardVersion.value = null
      this.setHardVersion(this.hardVersion.value)
    },
    onHardVersion(val) {
      if (val !== '全部') { this.showHardVersionCircle = true } else { this.showHardVersionCircle = false }
      let selected = this.hardVersion.options.find(item => item === val)
      this.setHardVersion(selected)
    },
    ...mapMutations({
      setDevice: 'SET_DEVICE',
      setHardVersion: 'SET_HARD_VERSION'
    })
  },
  async mounted() {
    this.getData()
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
      padding 20px 10px 10px 
      .dot
        margin-right 10px
        dot($color-active)
    .des
      font-size $font-small
      padding 0 19px 10px
      .active 
        margin 0 0 0 10px
        color $color-active
    .device-container
      // width 1610px
      margin 0 auto
      padding 0 96px
      display flex
      .item 
        width 25%
        text-align center
        .select
          width 140px!important
          position relative 
          z-index 9
        .graph
          .device-selected
            position relative
            left 20px
            top -26px
          .device-no-selected
            margin-top 20px
            img
              width 158px
            .content
              position relative
              top -70px
              font-size $font-small
          .cirque
            width 100%
            height 300px
          p
            position relative
            top -6px

</style>
