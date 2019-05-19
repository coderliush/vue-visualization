<template>
  <div>
    <div class="search">
      <span @click="searchButton">一键报表查询</span>
    </div>

    <div class="table-page" v-show="showTable">
      <div class="title">
        <div class="left">
          <span class="dot"></span>
          <span>设备生命周期详细报表</span>
        </div>
        <div class="download" @click="download">{{downloadText}}</div>
      </div>

      <div class="des">
        <span class="active">{{querytime}}</span>
        <span class="active">【{{this.area}}】</span>
        <span class="active">【{{this.device}}】</span>
        <span class="active">【{{this.life}}】</span>
      </div>

      <div class="content">
        <template>
          <el-table :data="tableData" style="width: 100%" class="table">
            <el-table-column prop="address" label="详细地址（单元门 / 房间门）" width="240" align="center"></el-table-column>
            <el-table-column prop="lockType" label="锁类型" align="center"></el-table-column>
            <el-table-column prop="lockvendor" label="供应商" align="center"></el-table-column>
            <el-table-column prop="batch" label="批次号" align="center"></el-table-column>
            <el-table-column prop="macId" label="macID" align="center"></el-table-column>
            <el-table-column prop="hardVersion" label="固体版本" align="center"></el-table-column>
            <el-table-column label="安装" align="center" width="180">
              <template slot-scope="scope">
                <p>{{scope.row.install}}</p>
                <p>{{scope.row.installTime}}</p>
                <p>{{scope.row.installPerName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="验收" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.accept}}</p>
                <p>{{scope.row.acceptTime}}</p>
                <p>{{scope.row.acceptPerName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="智控维修" align="center" width="180">
              <template slot-scope="scope">
                <p v-if="scope.row.repair === '无维修'">无维修</p>
                <div v-else class="detail" @click="detail(scope.row)">
                  <p style="text-decoration: underline">{{scope.row.repairCodeDesc}}</p>
                  <p style="text-decoration: underline">{{scope.row.repairTime}}</p>
                  <p style="text-decoration: underline">{{scope.row.repairPerName}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="解绑" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.cancel}}</p>
                <p>{{scope.row.cancelTime}}</p>
                <p>{{scope.row.cancelPerName}}</p>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>

      <div class="pageGroup">
        <el-pagination
          prev-text="上一页"
          next-text="下一页"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
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
  </div>
</template>

<script type="text/ecmascript-6">
import table from 'components/table'
import { mapGetters } from 'vuex'
import axios from 'axios'
import exportExcel from 'utils/exportExcel'
export default {
  name: '',
  data() {
    return {
      area: '区域',
      device: '设备属性',
      life: '生命状态', 
      downloadText: '报表导出',
      fileName: '',
      fullscreenLoading: false,
      showTable: false,
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
      'params',
      'querytime',
      'text'
    ])
  },
  watch: {
    params: {
      handler() {
        this.showTable = false
      },
      deep: true
    },
    text: {
      handler() {
        if (this.text.business.active === 'org') {
          let orgList = this.text.business.orgList
          this.area = orgList.join(' — ') 
          this.fileName = orgList[orgList.length - 1] // 文件名取最后一位
        } else if (this.text.business.active === 'district') {
          let districtList = this.text.business.districtList
          this.area = districtList.join(' — ')
          this.fileName = districtList[districtList.length - 1]
        } else if (this.text.business.active === 'address') {
          this.area = this.text.business.address
          this.fileName = this.area
        }

        this.device = this.text.deviceList.join(' — ')
        this.life = this.text.lifeList.filter(item => { return item && item.trim() }).join(' - ')
      },
      deep: true
    }
  },
  methods: {
    async download() {
      let params = {}
      let fullName = `${this.querytime}-${this.fileName}-主表.xlsx`
      this.downloadText = '报表导出中...'

      if (this.text.business.active === 'address') {
        params = { address: this.area, time: this.params.querytime }
      } else {
        params = { id: this.params.id, type: this.params.type, time: this.params.querytime }
      }

      this.$http.download('/dmp/api/LockHistory/Export', params).catch(res => {
        this.downloadText = '报表导出'
        var _url = window.URL.createObjectURL(res);
        var a = document.createElement('a');
        a.href = _url;
        a.download = fullName
        a.click();
        window.URL.revokeObjectURL(_url);
      })   
    },
    searchButton() {
      this.showTable = true
      this.pageIndex = 1
      this.currentPage = 1 // 选中第一页
      this.searchTable()
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.jumper = null
      this.pageIndex = val
      this.searchTable(val)
    },
    onButton() {
      this.currentPage = this.jumper
      this.pageIndex = this.jumper
      this.searchTable()
    },
    detail(row) {
      if (row.repair === '无维修') return

      const { href } = this.$router.resolve({
        path: '/repair-detail',
        query: {
          cucid: row.cucid,
          roomid: row.roomid,
          address: this.area
        }
      })
      window.open(href, '_blank')
    },
    async searchTable() {
      const obj = {
        id: this.params.id,
        type: this.params.type,
        time: this.params.querytime,
        pageIndex: this.jumper || this.pageIndex,
        pageSize: this.pageSize,
      }
      if (this.text.business.active === 'address') { obj.address = this.area }

      const res = await this.$http.post('/dmp/api/LockHistory/GetLocksHistoryList', obj)
      this.tableData = res.list
      this.totalCount = res.totalCount
    }
  },
  mounted() {
    // this.$bus.$on('address', (address) => {
    //   this.address = address
    //   this.showTable = true
    //   this.searchTable()
    // })
  },
  components: {}
}
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .search
    margin 10px 0
    padding 40px 0 
    background $bg-panel
    text-align center
    span
      display inline-block
      width 200px
      height 50px
      line-height 50px
      font-size 20px
      border-radius 8px
      border 1px solid #00BDFB 
      background #00aef5 
      cursor pointer

  .table-page
    width 100%
    position relative
    z-index 1
    margin-top 10px
    padding 20px 10px
    background $bg-panel
    text-align center
    .des
      font-size $font-small
      text-align left
      padding 0 10px 10px
      .active 
        margin 0 0 0 10px
        color $color-active
    .title
      display flex
      justify-content space-between
      align-items center
      .left .dot
        display inline-block
        dot($color-active)
      .download 
        font-size $font-small
        padding 10px 20px
        border-radius 8px
        border 1px solid #00BDFB 
        background #00AEF5
        cursor pointer
      .left
        .dot
          margin-right 10px
          dot($color-active)
    .content
      width 100%
      .table
        margin-bottom 20px
        text-align center
        .detail
          cursor pointer
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
