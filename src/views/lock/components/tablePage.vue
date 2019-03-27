<template>
  <div class="table-page">
    <div class="title">
      <div class="left">
        <span class="dot"></span>
        <span>设备生命周期详细报表</span>
      </div>
      <div class="download">详细报表导出</div>
    </div>
    <div class="content">
      <template>
        <el-table :data="tableData" style="width: 100%" class="table">
          <el-table-column prop="device" label="设备类型"></el-table-column>
          <el-table-column prop="servicer" label="供应商"></el-table-column>
          <el-table-column prop="batch" label="批次号"></el-table-column>
          <el-table-column prop="version" label="固体版本"></el-table-column>
          <el-table-column prop="cell" label="单元地址" width="120"></el-table-column>
          <el-table-column prop="time" label="运行时长"></el-table-column>
          <el-table-column prop="register" label="注册"></el-table-column>
          <el-table-column prop="installl" label="安装"></el-table-column>
          <el-table-column prop="check" label="验收"></el-table-column>
          <el-table-column prop="online" label="在线"></el-table-column>
          <el-table-column prop="normal" label="数据正常"></el-table-column>
          <el-table-column prop="repair" label="维修"></el-table-column>
          <el-table-column prop="cancel" label="注销"></el-table-column>
          <el-table-column prop="useless" label="报废"></el-table-column>
          <el-table-column prop="history" label="历史"></el-table-column>
        </el-table>
      </template>
    </div>

     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="40">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import table from 'components/table'
export default {
  name: '',
  data() {
    return {
      currentPage4: 4,
      tableData: [{
        device: '网关',
        servicer: '青客',
        batch: '2018-12',
        version: 'v4.0.0.0',
        cell: '上海市建国中路103弄30号',
        time: '1年06天23小时59分',
        register: '注册',
        installl: '安装',
        check: '验收',
        online: '在线',
        normal: '正常',
        repair: '维修',
        cancel: '注销',
        useless: '报废',
        history: '历史'
      },]
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  components: {}
}
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .table-page
    width 100%
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
        font-size $font-small
        padding 9px
        border-radius 8px
        border 1px solid #00BDFB 
        background #00AEF5
      .left
        .dot
          margin-right 10px
          dot($color-active)
    .content
      width 100%
      .table
        margin-bottom 20px
</style>
