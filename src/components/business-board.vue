<template>
  <div class="circle">
    <img src="../assets/board.png" alt="">
    <div class="content">
      <p class="active">{{content.num}}</p>
      <p class="name">{{content.name}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: {
    content: {
      type: Object,
      default: {
        return: {}
      }
    }
  },
  data() {
    return {}
  },
  components: {}
}
</script>

<style scoped lang="stylus">
</style>
