<template>
  <div class="lock">
    <time-photo></time-photo>
    <business></business>
    <device></device>
    <life></life>
  </div>
</template>

<script type="text/ecmascript-6">
import TimePhoto from './components/time-photo.vue'
import Business from './components/business.vue'
import Device from './components/device.vue'
import Life from './components/life.vue'
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
    Life
  }
}
</script>

<style scoped lang="stylus">
  .lock 
    flex 1
    margin-left 10px
</style>
