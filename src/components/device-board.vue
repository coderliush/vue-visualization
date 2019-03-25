<template>
  <div class="device-board">
    <img :src="unSelected.src" alt="">
    <div class="content">
      <p class="active">{{unSelected.num}}</p>
      <p class="name">{{unSelected.name}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    unSelected: {
      type: Object
    }
  },
  components: {}
}
</script>

<style scoped lang="stylus">
.device-board
  margin-top 10px
  .content
    position relative
    top -55px
    font-size 14px
</style>
