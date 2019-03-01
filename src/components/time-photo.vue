<template>
  <div class="wrapper">
    <div class="text">
      <span class="dot"></span>
      <div class="time">
        <div class="block">
          <!-- <span class="demonstration">设置默认时间</span> -->
          <el-date-picker
            v-model="value3"
            type="datetime"
            placeholder="检索时间（默认当下）"
            default-time="12:00:00"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
  data() {
    return {
      value3: ''
    }
  },
  components: {}
};
</script>

<style scoped lang="stylus">
@import '~common/style/mixin';
</style>
