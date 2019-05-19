<template>
  <div style="width: 100%; height: 100%;">
    <div class="table-page" :style="{opacity: (showImg ? 0.4 : 1)}">
      <div class="title">
        <div class="left">
          <span class="dot"></span>
          <span>智控维修副表</span>
        </div>
      </div>

      <div class="sub">
        <div class="des">
          <span class="active">{{querytime}}</span>
          <span class="active">【{{this.address}}】</span>
        </div>
        <div class="download" @click="download">{{downloadText}}</div>
      </div>

      <div class="content">
        <template>
          <el-table :data="tableData" style="width: 100%" class="table">
            <!-- <el-table-column prop="lockType" label="类型"></el-table-column>
            <el-table-column prop="lockId" label="macID"></el-table-column>
            <el-table-column prop="hardVersion" label="G固体版本"></el-table-column> -->
            <el-table-column prop="declareSourceDesc" label="维修上报来源系统" align="center"></el-table-column>
            <el-table-column prop="declareCodeDesc" label="维修上报科目" align="center"></el-table-column>
            <el-table-column prop="repairCodeDesc" label="校准科目" align="center"></el-table-column>
            <el-table-column prop="repairBefore" label="维修前照片" align="center">
              <template slot-scope="scope">
                <p v-if="!scope.row.repairBefore">暂无照片</p>
                <p v-else class="view" @click="view(scope.row.repairBeforeList)">查看照片</p>
              </template>
            </el-table-column>
            <el-table-column prop="repairAfter" label="维修后照片" align="center">
              <template slot-scope="scope">
                <p v-if="!scope.row.repairAfter">暂无照片</p>
                <p v-else class="view" @click="view(scope.row.repairAfterList)">查看照片</p>
              </template>
            </el-table-column>
            <el-table-column prop="repairInfo" label="维修结果说明" align="center"></el-table-column>
            <el-table-column prop="declareTime" label="维修上报时间" align="center"></el-table-column>
            <el-table-column prop="completeTime" label="维修完成时间" align="center"></el-table-column>
            <el-table-column prop="repairName" label="维修人" align="center"></el-table-column>
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

    <div class="popover" v-show="showImg">
      <img class="cancel" @click="cancel" src="../../assets/cancel.png" alt="">
      <div class="content"><img :src="bigImg" alt=""></div>
      <div class="img-list">
        <div v-for="(item, index) in imgList" :key="index" alt="">
          <img :src="item" @click="showBig(item)" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import table from 'components/table'
import { mapGetters } from 'vuex'
import exportExcel from 'utils/exportExcel'

export default {
  name: '',
  data() {
    return {
      bigImg: '',
      address: '',
      imgList: [],
      downloadText: '报表导出',
      showImg: false,
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
      'querytime'
    ])
  },
  methods: {
    showBig(src) {
      this.bigImg = src
    },
    cancel() {
      this.showImg = false
    },
    view(imgList) {
      this.showImg = true
      this.bigImg = imgList[0]
      this.imgList = imgList
    },
    async download() {
      let fileName = `${this.querytime}-副表.xlsx`
      this.downloadText = '报表导出中...'

      const obj = {
        cucId: this.$route.query.cucid,
        roomId: this.$route.query.roomid,
        time: this.params.querytime,
      }

      this.$http.download('/dmp/api/LockHistory/ExportLockRepair', obj).catch(res => {
        this.downloadText = '报表导出'
        var blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        var _url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = _url;
        a.download = fileName
        a.click();
        window.URL.revokeObjectURL(_url);
      })   
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.jumper = null
      this.pageIndex = val
      this.getData(val)
    },
    onButton() {
      this.currentPage = this.jumper
      this.pageIndex = this.jumper
      this.getData()
    },
    async getData(pageIndex) {
      const obj = {
        time: this.params.querytime,
        cucId: this.$route.query.cucid,
        roomid: this.$route.query.roomid,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }

      const res = await this.$http.post('/dmp/api/LockHistory/GetLockRepairDetail', obj)
      this.tableData = res.list
      this.totalCount = res.totalCount
    }
  },
  mounted() {
    this.address = this.$route.query.address
    this.getData()
  },
  components: {}
}
</script>

<style scoped lang="stylus">
  @import '~styles/mixin'
  @import '~styles/variable'
  .view
    cursor pointer
    text-decoration underline

  .popover
    width 640px
    position absolute
    z-index 9
    top 50%
    left 50%
    transform translate(-50%, -50%)
    padding 10px 20px
    background #103045
    .cancel
      position absolute
      right 10px
      width 20px 
      cursor pointer
    .img-list
      width 600px
      margin-top 20px
      padding 0 20px
      display flex
      flex-wrap wrap
      div
        width 20%
        img
          width 100%
          padding 6px
          cursor pointer
    .content
      padding 36px 60px 0
      border-bottom 1px dashed #fff
      img 
        width 100%
        padding-bottom 30px

  .table-page
    width 100%
    height 100%
    position relative
    z-index 1
    margin-top 10px
    padding 20px 10px
    background $bg-panel
    .title
      display flex
      justify-content space-between
      align-items center
      .left .dot
        display inline-block
        dot($color-active)
      .left
        .dot
          margin-right 10px
          dot($color-active)
    .sub
      display flex
      align-items center
      padding 0 20px
      margin-bottom 10px
      justify-content space-between
      .des
        position relative
        top 6px
        font-size $font-small
        color $color-active
      .download 
        font-size $font-small
        padding 10px 20px
        border-radius 8px
        border 1px solid #00BDFB 
        background #00AEF5
        cursor pointer         
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


