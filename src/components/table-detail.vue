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
          <el-table-column prop="lockType" label="锁类型"></el-table-column>
          <el-table-column prop="lockvendor" label="厂商"></el-table-column>
          <el-table-column prop="batch" label="批次号"></el-table-column>

          <el-table-column prop="batch" label="macID"></el-table-column>

          <el-table-column prop="hardVersion" label="固体版本"></el-table-column>
          <el-table-column prop="address" label="详细地址" width="120"></el-table-column>
          <!-- <el-table-column prop="workTime" label="运行时长"></el-table-column> -->
          <!-- <el-table-column label="注册">
            <template slot-scope="scope">
              <p>{{scope.row.register}}</p>
              <p>{{scope.row.regdate}}</p>
              <p>{{scope.row.regPerName}}</p>
            </template>
          </el-table-column> -->
          <el-table-column label="安装">
            <template slot-scope="scope">
              <p>{{scope.row.install}}</p>
              <p>{{scope.row.installTime}}</p>
              <p>{{scope.row.installPerName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="验收">
            <template slot-scope="scope">
              <p>{{scope.row.accept}}</p>
              <p>{{scope.row.acceptTime}}</p>
              <p>{{scope.row.acceptPerName}}</p>
            </template>
          </el-table-column>
          <!-- <el-table-column label="在线">
            <template slot-scope="scope">
              <p>{{scope.row.online}}</p>
              <p>{{scope.row.acceptTime}}</p>
              <p>{{scope.row.acceptPerName}}</p>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="normal" label="数据正常"></el-table-column> -->
          <el-table-column label="智控维修">
            <template slot-scope="scope">
              <div class="detail" @click="detail">
                <p>{{scope.row.repair}}</p>
                <p>{{scope.row.repairTime}}</p>
                <p>{{scope.row.repairPerName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="解绑">
            <template slot-scope="scope">
              <p>{{scope.row.cancel}}</p>
              <p>{{scope.row.cancelTime}}</p>
              <p>{{scope.row.cancelPerName}}</p>
            </template>
          </el-table-column>
          <!-- <el-table-column label="报废">
            <template slot-scope="scope">
              <p>{{scope.row.dumping}}</p>
              <p>{{scope.row.dumpingTime}}</p>
              <p>{{scope.row.dumpingPerName}}</p>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="history" label="历史"></el-table-column> -->
        </el-table>
      </template>
    </div>

    <div class="pageGroup">
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, prev, pager, next, sizes"
        :total="totalCount">
      </el-pagination>

      <div class="jumper">
        <span>到第</span>
        <el-input class="input" v-model.number="jumper"></el-input>
        <span>页</span>
      </div>
      <el-button class="button" @click="onButton">确定</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import table from 'components/table'
import { mapGetters } from 'vuex'
export default {
  name: '',
  data() {
    return {
      currentPage: 1,
      tableData: [],
      totalCount: null,
      pageIndex: 1,
      pageSize: 10,
      jumper: null,
    }
  },
  computed: {
    ...mapGetters([
      'params'
    ])
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.jumper = null
      this.pageIndex = val
      this.init(val)
    },
    onButton() {
      this.currentPage = this.jumper
      this.pageIndex = this.jumper
      this.init()
    },
    detail() {
       const { href } = this.$router.resolve({
        path: '/repair-detail',
      })
      window.open(href, '_blank')
    },
    async init(pageIndex) {
      const obj = {
        id: this.params.id,
        type: this.params.type,
        time: this.params.querytime,
        pageIndex: this.jumper || this.pageIndex,
        pageSize: this.pageSize,
      }

      const res = await this.$http.post('/dmp/api/LockHistory/GetLocksHistoryList', obj)
      this.tableData = res.list
      this.totalCount = res.totalCount
    }
  },
  mounted() {
    this.init()
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
      .left .dot
        display inline-block
        dot($color-active)
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
        .detail
          cursor pointer
          p
            text-decoration underline
    .pageGroup
      display flex
      .jumper
        display flex
        align-items center
        span 
          font-size $font-smaller
          white-space nowrap
      .button
        margin-left 6px
        padding 0 20px
        color #fff!important
        background #0375A7
        border none
</style>


