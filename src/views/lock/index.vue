<template>
  <div class="lock">
    <time-photo></time-photo>
    <business></business>
    <device></device>
    <life></life>
    <table-page></table-page>
  </div>
</template>

<script type="text/ecmascript-6">
import TimePhoto from './components/time-photo.vue'
import Business from './components/business.vue'
import Device from './components/device.vue'
import Life from './components/life.vue'
import tablePage from './components/tablePage.vue'
export default {
  name: '',
  data() {
    return {}
  },
  mounted() {

  },
  methods: {

  },
  components: {
    TimePhoto,
    Business,
    Device,
    Life,
    tablePage
  }
}
</script>

<style scoped lang="stylus">
  .lock 
    position relative 
    z-index 9
</style>
