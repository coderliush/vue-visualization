<template>
  <div class="table-page">
    <div class="title">
      <div class="left">
        <span class="dot"></span>
        <span>设备生命周期详细报表</span>
      </div>
      <div class="download">详细报表导出</div>
    </div>
    <div class="container">
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import table from 'components/table'
export default {
  name: '',
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  components: {}
}
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .table-page
    position relative
    z-index 1
    margin-top 10px
    padding 20px 10px
    background $bg-panel
    .title
      display flex
      justify-content space-between
      align-items center
      margin-bottom 20px
      .download 
        padding 12px 9px
        border-radius 8px
        border 1px solid #00BDFB 
        background #00AEF5
      .left
        .dot
          margin-right 10px
          dot($color-active)
</style>
